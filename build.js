#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const ROOT = __dirname;
const SOURCE = path.join(ROOT, 'content/en');
const SITE = path.join(ROOT, '_site');
const LANGUAGES = { 'pt-br': 'Brazilian Portuguese' };
const DEFAULT_TRANSLATION = {
    apiUrl: 'https://inference.aivax.net/v1/chat/completions',
    apiKeyEnv: 'AIVAX_API_KEY',
    model: '@inception/mercury-2',
    concurrency: 3,
    maxRetries: 5
};
const HELP = `AIVAX documentation — static Hugo build

Usage: bun build.js <command> [options]

Commands:
  translate [lang] [--force]  Translate missing/outdated pages; --force includes current pages
  status [lang]              Report current, outdated, missing and orphan translations
  build [pack options]       Clean _site, run Hugo, Pagefind and English JSONL export
  serve                     Run the Hugo development server (build first for search)
  all [pack options]         Translate, then build (paid API calls; explicit approval required)
  help, --help, -h           Show this help (also shown without arguments)

Languages: pt-br (Brazilian Portuguese); English is the source.
Translation settings: config.json; key from the configured environment variable
(default AIVAX_API_KEY). Never put credentials in config.json.
Progress includes errors and ETA. Failures: translate.errors.txt; logs: debug.log.
--debug enables detailed processing logs. Translation skips matching sourceHash values.

JSONL options for build/all:
  -i, --input <dir>       English Markdown input (default content/en/docs)
  -o, --output <file>     Default jsonl-exports/aivax-documentation.jsonl; - for stdout
  -u, --base-url <url>    Default https://docs.aivax.net/docs
  --single-page          One record per page instead of sections split at # and ##

Requirements: Bun, Hugo 0.154+, bun install. No DocFX or .NET required.
Production publishing is separate; no command here commits or deploys.
`;

function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    fs.appendFileSync(path.join(ROOT, 'debug.log'), `[${timestamp}] [${level}] ${message}\n`);
    console.error(message);
}

function walk(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const file = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

function parse(text) {
    const normalized = text.replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    return match ? { data: Bun.YAML.parse(match[1]) || {}, body: match[2] } : { data: {}, body: normalized };
}

function serialize(data, body) {
    return `---\n${Bun.YAML.stringify(data).trim()}\n---\n\n${body.trim()}\n`;
}

function run(command, args, quiet = false) {
    log(`Running ${command} ${args.join(' ')}`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd: ROOT, stdio: quiet ? ['ignore', 'pipe', 'inherit'] : 'inherit' });
        if (quiet) child.stdout.on('data', chunk => process.stderr.write(chunk));
        child.on('error', reject);
        child.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)));
    });
}

function jobs(languages) {
    return walk(SOURCE).filter(file => file.endsWith('.md')).flatMap(file => {
        const rel = path.relative(SOURCE, file).replace(/\\/g, '/');
        const text = fs.readFileSync(file, 'utf8');
        const hash = crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').slice(0, 16);
        return languages.map(lang => {
            const target = path.join(ROOT, 'content', lang, rel);
            const existing = fs.existsSync(target) ? parse(fs.readFileSync(target, 'utf8')).data : null;
            return { rel, text, hash, lang, target, state: !existing ? 'missing' : existing.sourceHash === hash ? 'current' : 'outdated' };
        });
    });
}

async function translate(language, force, debug) {
    const languages = language ? [language] : Object.keys(LANGUAGES);
    if (languages.some(lang => !LANGUAGES[lang])) throw new Error(`Unknown language: ${language}`);
    const pending = jobs(languages).filter(job => force || job.state !== 'current');
    if (!pending.length) return log('All translations are current.');
    const configFile = path.join(ROOT, 'config.json');
    const config = { ...DEFAULT_TRANSLATION, ...(fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile, 'utf8')).translation : {}) };
    if (!Number.isInteger(config.concurrency) || config.concurrency < 1) throw new Error('translation.concurrency must be a positive integer');
    if (!Number.isInteger(config.maxRetries) || config.maxRetries < 1) throw new Error('translation.maxRetries must be a positive integer');
    const apiKey = process.env[config.apiKeyEnv];
    if (!apiKey) throw new Error(`Environment variable ${config.apiKeyEnv} is not set`);
    const errors = [];
    const errorsFile = path.join(ROOT, 'translate.errors.txt');
    const started = Date.now();
    let cursor = 0;
    let done = 0;
    log(`Translating ${pending.length} pages with ${config.model}; concurrency ${config.concurrency}`);
    await Promise.all(Array.from({ length: Math.min(config.concurrency, pending.length) }, async (_, workerId) => {
        while (cursor < pending.length) {
            const job = pending[cursor++];
            log(`Processing item "${job.rel}" (WorkerId="${workerId}")`);
            try {
                const source = parse(job.text);
                const prompt = `You are translating AIVAX documentation to ${LANGUAGES[job.lang]}.
Rules:
- Translate prose, headings, table text and code comments, but not code symbols, identifiers, variables or constants.
- Do not translate script-header file names, language names, code fence titles, CLI commands or HTML tag names.
- Keep the same Markdown structure, headings, lists, tables, code fences, attributes and alert markers such as [!NOTE], [!TIP], [!IMPORTANT], [!WARNING] and [!CAUTION].
- Keep every link target and anchor unchanged. The build script localizes documentation links after translation.
- Preserve YAML structure and keys. Translate only front matter values title, linkTitle and description, the objectives list items, and the title and description of each paths item; copy all other keys and values exactly.
- "Learn" is the name of the AIVAX learning section; keep it in English when it names the section, as in "AIVAX Learn" or "How Learn works".
- Reply ONLY with the translated document: no greetings, advice, comments or wrapping code fence.
File: ${job.rel}
<translation-input>
${job.text}
</translation-input>`;
                let output;
                for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
                    const response = await fetch(config.apiUrl, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: prompt }], stream: false }),
                        signal: AbortSignal.timeout(180000)
                    });
                    if (response.ok) {
                        output = (await response.json()).choices?.[0]?.message?.content;
                        break;
                    }
                    if (!(response.status === 429 || response.status >= 500) || attempt === config.maxRetries) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const retryAfter = response.headers.get('retry-after');
                    const delay = retryAfter && Number.isFinite(Number(retryAfter))
                        ? Number(retryAfter) * 1000
                        : retryAfter && Number.isFinite(Date.parse(retryAfter))
                            ? Math.max(0, Date.parse(retryAfter) - Date.now()) : attempt * 5000;
                    log(`HTTP ${response.status}; retry ${attempt}/${config.maxRetries} in ${delay}ms`, 'WARN');
                    await Bun.sleep(delay);
                }
                if (typeof output !== 'string' || !output.trim()) throw new Error('Empty translation response');
                const translated = parse(output.trim().replace(/^```(?:markdown|md)?\n([\s\S]*)\n```$/, '$1'));
                for (const [label, regex] of [['fences', /^\s*(?:```|~~~)/gm], ['headings', /^#{1,6} /gm], ['alerts', /^\s*>\s*\[!\w+\]/gm]]) {
                    if ((source.body.match(regex) || []).length !== (translated.body.match(regex) || []).length) {
                        throw new Error(`Structure mismatch: ${label}`);
                    }
                }
                const sourceEmbeds = source.body.match(/<script\b[^>]*src="https:\/\/inference\.aivax\.net\/apidocs[^>]*>[\s\S]*?<\/script>/g) || [];
                const translatedEmbeds = translated.body.match(/<script\b[^>]*src="https:\/\/inference\.aivax\.net\/apidocs[^>]*>[\s\S]*?<\/script>/g) || [];
                if (JSON.stringify(sourceEmbeds) !== JSON.stringify(translatedEmbeds)) throw new Error('Structure mismatch: endpoint embeds');
                const data = { ...source.data, sourceHash: job.hash };
                for (const key of ['title', 'linkTitle', 'description']) {
                    if (source.data[key] !== undefined) {
                        if (typeof translated.data[key] !== 'string') throw new Error(`Missing translated front matter: ${key}`);
                        data[key] = translated.data[key];
                    }
                }
                if (Array.isArray(source.data.objectives)) {
                    const objectives = translated.data.objectives;
                    if (!Array.isArray(objectives) || objectives.length !== source.data.objectives.length) throw new Error('Structure mismatch: objectives');
                    data.objectives = objectives;
                }
                if (Array.isArray(source.data.paths)) {
                    const paths = translated.data.paths;
                    if (!Array.isArray(paths) || paths.length !== source.data.paths.length) throw new Error('Structure mismatch: paths');
                    data.paths = source.data.paths.map((item, index) => ({ ...item, title: paths[index].title, description: paths[index].description }));
                }
                const prefix = `/docs/${job.lang}/`;
                if (data.aliases) data.aliases = data.aliases.map(alias => alias.startsWith('/docs/')
                    ? alias.replace(/^\/docs\//, prefix) : `/${job.lang}${alias}`);
                if (data.url) data.url = data.url.replace(/^\/docs\//, prefix);
                if (job.rel.startsWith('docs/')) {
                    data.aliases = [...new Set([...(data.aliases || []), prefix + job.rel.slice(5).replace(/_index\.md$/, 'index.html').replace(/\.md$/, '.html')])];
                }
                const body = translated.body
                    .replace(/(\]\(|(?:href|src)=["']|^\s*\[[^\]]+\]:\s*|<)(https:\/\/docs\.aivax\.net)?\/docs\/(?!pt-br\/)/gm, `$1$2${prefix}`);
                fs.mkdirSync(path.dirname(job.target), { recursive: true });
                fs.writeFileSync(job.target, serialize(data, body));
                if (debug) log(`WorkerId="${workerId}" Action="Translate" State="Success" File="${job.rel}"`, 'DEBUG');
            } catch (error) {
                const message = `${job.lang}|${job.rel}|${error.message}`;
                errors.push(message);
                log(message, 'ERROR');
                fs.writeFileSync(errorsFile, errors.join('\n') + '\n');
            }
            done++;
            const eta = Math.ceil((Date.now() - started) / done * (pending.length - done) / 1000);
            log(`Processed ${done}/${pending.length} (${Math.round(done / pending.length * 100)}%), errors: ${errors.length}, ETA: ${eta}s`);
        }
    }));
    if (errors.length) throw new Error(`${errors.length} translations failed; see translate.errors.txt`);
    fs.rmSync(errorsFile, { force: true });
}

function slugify(text) {
    return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
}

function cleanMarkdown(markdown) {
    return markdown.replace(/\r/g, '').replace(/^---\n[\s\S]*?\n---\n/, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function build(options) {
    let input = path.join(SOURCE, 'docs');
    let output = path.join(ROOT, 'jsonl-exports/aivax-documentation.jsonl');
    let baseUrl = 'https://docs.aivax.net/docs';
    let singlePage = false;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option === '--debug') continue;
        if (option === '--single-page') { singlePage = true; continue; }
        if (!['-i', '--input', '-o', '--output', '-u', '--base-url'].includes(option)) throw new Error(`Unknown option: ${option}`);
        const value = options[++i];
        if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
        if (['-i', '--input'].includes(option)) input = path.resolve(value);
        if (['-o', '--output'].includes(option)) output = value === '-' ? '-' : path.resolve(value);
        if (['-u', '--base-url'].includes(option)) baseUrl = value.replace(/\/$/, '');
    }
    if (!fs.existsSync(input)) throw new Error(`Input directory not found: ${input}`);
    fs.rmSync(SITE, { recursive: true, force: true });
    await run('hugo', ['--gc', '--minify'], output === '-');
    fs.mkdirSync(path.join(SITE, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'node_modules/mermaid/dist/mermaid.min.js'), path.join(SITE, 'scripts/mermaid.min.js'));
    const pagefind = await import('pagefind');
    try {
        const { index, errors } = await pagefind.createIndex({ excludeSelectors: ['.heading-anchor', '.code-header'] });
        if (errors?.length) throw new Error(errors.join('\n'));
        const result = await index.addDirectory({ path: SITE, glob: '{docs/**/*.html,learn/**/*.html,pt-br/docs/**/*.html,pt-br/learn/**/*.html}' });
        if (result.errors?.length) throw new Error(result.errors.join('\n'));
        const written = await index.writeFiles({ outputPath: path.join(SITE, 'pagefind') });
        if (written.errors?.length) throw new Error(written.errors.join('\n'));
        const entry = JSON.parse(fs.readFileSync(path.join(SITE, 'pagefind/pagefind-entry.json'), 'utf8'));
        log(`Pagefind: ${Object.entries(entry.languages).map(([lang, data]) => `${lang}: ${data.page_count} pages`).join(', ')}`);
    } finally {
        await pagefind.close();
    }
    const records = [];
    const files = walk(input).filter(file => file.endsWith('.md') && !file.endsWith('_index.md'))
        .filter(file => !path.relative(input, file).replace(/\\/g, '/').startsWith('pt-br/'))
        .sort((a, b) => a.localeCompare(b));
    for (const file of files) {
        const { data } = parse(fs.readFileSync(file, 'utf8'));
        const markdown = cleanMarkdown(fs.readFileSync(file, 'utf8'));
        const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || data.title || path.basename(file, '.md');
        const sections = [];
        let current = null;
        let inFence = false;
        if (singlePage) sections.push({ heading: title, anchor: '', text: markdown });
        else {
            for (const line of markdown.split('\n')) {
                if (/^\s*```/.test(line)) inFence = !inFence;
                const heading = !inFence ? line.match(/^(#{1,2})\s+(.+?)\s*#*\s*$/) : null;
                if (heading) {
                    if (current?.lines.length) sections.push(current);
                    current = { heading: heading[2].trim(), anchor: slugify(heading[2].trim()), lines: [line] };
                } else {
                    current ||= { heading: title, anchor: slugify(title), lines: [] };
                    current.lines.push(line);
                }
            }
            if (current?.lines.length) sections.push(current);
        }
        const relative = path.relative(input, file).replace(/\\/g, '/');
        for (const section of sections) {
            const text = section.text ?? cleanMarkdown(section.lines.join('\n'));
            if (!text) continue;
            const sectionSlug = slugify(section.anchor);
            records.push({
                docid: `${relative}${sectionSlug ? `#${sectionSlug}` : ''}`,
                text,
                __ref: relative,
                __tags: ['aivax', 'docs', 'english', ...relative.replace(/\.md$/i, '').split('/').filter(part => part && part !== 'index')],
                __meta: {
                    title, heading: section.heading, path: relative,
                    url: `${baseUrl}/${relative.replace(/\.md$/i, '.html')}${section.anchor ? `#${section.anchor}` : ''}`
                }
            });
        }
    }
    const jsonl = records.map(record => JSON.stringify(record)).join('\n') + (records.length ? '\n' : '');
    if (output === '-') process.stdout.write(jsonl);
    else {
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, jsonl);
    }
    log(`Packed ${records.length} records into ${output}; static site ready in _site`);
}

(async () => {
    const [command, ...args] = process.argv.slice(2);
    if (!command || ['help', '--help', '-h'].includes(command) || args.some(arg => ['--help', '-h'].includes(arg))) {
        console.log(HELP);
        return;
    }
    if (command === 'build') return build(args);
    if (command === 'serve') {
        if (args.length) throw new Error('serve takes no arguments');
        return run('hugo', ['server', '--disableFastRender']);
    }
    if (command === 'all') { await translate(undefined, false, args.includes('--debug')); return build(args); }
    if (!['status', 'translate'].includes(command)) throw new Error(`Unknown command: ${command}. Run bun build.js help`);
    const language = args.find(arg => !arg.startsWith('-'));
    if (args.filter(arg => !arg.startsWith('-')).length > 1 || args.some(arg => arg.startsWith('-') && !['--force', '--debug'].includes(arg))) throw new Error('Invalid arguments');
    if (language && !LANGUAGES[language]) throw new Error(`Unknown language: ${language}`);
    if (command === 'translate') return translate(language, args.includes('--force'), args.includes('--debug'));
    const languages = language ? [language] : Object.keys(LANGUAGES);
    const allJobs = jobs(languages);
    const sources = new Set(allJobs.map(job => job.rel));
    for (const lang of languages) {
        const own = allJobs.filter(job => job.lang === lang);
        const orphans = walk(path.join(ROOT, 'content', lang)).filter(file => file.endsWith('.md'))
            .map(file => path.relative(path.join(ROOT, 'content', lang), file).replace(/\\/g, '/')).filter(rel => !sources.has(rel));
        log(`${lang}: ${['current', 'outdated', 'missing'].map(state => `${state}: ${own.filter(job => job.state === state).length}`).join(', ')}, orphan: ${orphans.length}`);
        own.filter(job => job.state !== 'current').forEach(job => log(`${job.state}|${lang}|${job.rel}`));
        orphans.forEach(rel => log(`orphan|${lang}|${rel}`));
    }
})().catch(error => { log(error.message, 'ERROR'); process.exitCode = 1; });
