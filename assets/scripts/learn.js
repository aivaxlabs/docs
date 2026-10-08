const STORAGE_KEY = 'learn-progress';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let fallbackProgress = new Set();

function readProgress() {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
        return fallbackProgress;
    }
}

function writeProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
    } catch {
        // Storage can be blocked (private mode, quota); progress then lives only for this page view.
        fallbackProgress = progress;
    }
    renderProgress();
}

function format(template, ...values) {
    let index = 0;
    return template.replace(/%d/g, () => values[index++]);
}

function renderProgress() {
    const progress = readProgress();

    document.querySelectorAll('[data-learn-unit]').forEach(link => {
        link.classList.toggle('is-complete', progress.has(link.dataset.learnUnit));
    });

    document.querySelectorAll('[data-learn-progress]').forEach(node => {
        const units = JSON.parse(node.dataset.learnUnits);
        const done = units.filter(unit => progress.has(unit)).length;
        node.style.setProperty('--progress', `${units.length ? done / units.length * 100 : 0}%`);
        node.querySelector('.progress-text').textContent = format(node.dataset.template, done, units.length);
    });

    document.querySelectorAll('[data-learn-count]').forEach(node => {
        const units = JSON.parse(node.dataset.learnUnits);
        const done = units.filter(unit => progress.has(unit)).length;
        node.textContent = done ? `${done}/${units.length}` : units.length;
        node.classList.toggle('is-complete', units.length > 0 && done === units.length);
    });

    document.querySelectorAll('[data-learn-start]').forEach(button => {
        const units = JSON.parse(button.dataset.learnUnits);
        const pending = units.find(unit => !progress.has(unit));
        const label = units.every(unit => progress.has(unit)) ? button.dataset.labelReview
            : units.some(unit => progress.has(unit)) ? button.dataset.labelContinue : button.dataset.labelStart;
        button.href = pending || units[0];
        button.querySelector('span').textContent = label;
    });

    document.querySelectorAll('[data-learn-complete]').forEach(button => {
        const done = progress.has(button.dataset.learnComplete);
        button.classList.toggle('is-done', done);
        button.querySelector('span').textContent = done ? button.dataset.labelDone : button.dataset.labelTodo;
    });
}

function initProgress() {
    renderProgress();

    document.querySelectorAll('[data-learn-complete]').forEach(button => {
        button.addEventListener('click', () => {
            const progress = readProgress();
            const unit = button.dataset.learnComplete;
            progress.has(unit) ? progress.delete(unit) : progress.add(unit);
            writeProgress(progress);
        });
    });

    document.querySelectorAll('[data-learn-advance]').forEach(link => {
        link.addEventListener('click', () => {
            const progress = readProgress();
            progress.add(link.dataset.learnAdvance);
            writeProgress(progress);
        });
    });
}

function initReveal() {
    const charts = [...document.querySelectorAll('.chart')];
    if (!charts.length) return;

    if (reducedMotion) {
        document.body.classList.add('no-motion');
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    charts.forEach(chart => observer.observe(chart));
}

function initSteps() {
    document.querySelectorAll('[data-steps]').forEach(block => {
        const steps = [...block.querySelectorAll('[data-step]')];
        const counter = block.querySelector('[data-steps-counter]');
        const play = block.querySelector('[data-steps-play]');
        let current = 0;
        let timer = null;

        const render = () => {
            steps.forEach((step, index) => {
                step.classList.toggle('is-active', index === current);
                step.classList.toggle('is-done', index < current);
            });
            counter.textContent = format(block.dataset.labelOf, current + 1, steps.length);
            play.querySelector('span').textContent = current === steps.length - 1 ? play.dataset.labelReplay : play.dataset.labelPlay;
        };

        const stop = () => {
            clearInterval(timer);
            timer = null;
        };

        const go = index => {
            current = (index + steps.length) % steps.length;
            render();
            if (!reducedMotion) steps[current].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        };

        block.querySelector('[data-steps-prev]').addEventListener('click', () => { stop(); go(current - 1); });
        block.querySelector('[data-steps-next]').addEventListener('click', () => { stop(); go(current + 1); });
        play.addEventListener('click', () => {
            if (timer) return stop();
            if (current === steps.length - 1) go(0);
            timer = setInterval(() => {
                if (current === steps.length - 1) return stop();
                go(current + 1);
            }, 1800);
        });
        steps.forEach((step, index) => step.addEventListener('click', () => { stop(); go(index); }));

        render();
    });
}

function initQuizzes() {
    document.querySelectorAll('[data-quiz]').forEach(quiz => {
        const feedback = quiz.querySelector('[data-quiz-feedback]');
        const explanation = quiz.querySelector('[data-quiz-explanation]');

        quiz.querySelector('[data-quiz-check]').addEventListener('click', () => {
            const selected = quiz.querySelector('input:checked');
            if (!selected) return;

            const correct = selected.value === quiz.dataset.answer;
            quiz.querySelectorAll('.quiz-option').forEach(option => option.classList.remove('is-correct', 'is-incorrect'));
            selected.closest('.quiz-option').classList.add(correct ? 'is-correct' : 'is-incorrect');
            feedback.textContent = correct ? quiz.dataset.labelCorrect : quiz.dataset.labelIncorrect;
            feedback.className = `quiz-feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
            if (explanation) explanation.hidden = !correct;
        });
    });
}

function el(tag, attributes = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value);
    });
    node.append(...[children].flat().filter(child => child !== null && child !== undefined));
    return node;
}

const chipColors = ['#7f2942', '#0b6bcb', '#1a7f37', '#9a6700', '#7a3fd1', '#cf222e', '#0e7490', '#b45309'];

function tokenize(text) {
    return text.match(/\s*[A-Za-zÀ-ÿ]{1,5}|\s*\d{1,3}|\s*[^\sA-Za-zÀ-ÿ\d]|\s+/g) || [];
}

const demos = {
    tokenizer(stage, config) {
        const input = el('textarea', { rows: 3 }, []);
        input.value = config.text || 'Artificial intelligence turns words into numbers.';
        const chips = el('div', { class: 'token-chips' });
        const readout = el('div', { class: 'demo-readout' });

        const render = () => {
            const tokens = tokenize(input.value);
            chips.replaceChildren(...tokens.map((token, index) => el('span', { class: 'token-chip', style: `--chip: ${chipColors[index % chipColors.length]}` }, [token])));
            readout.replaceChildren(
                el('span', {}, [`${config.labels.characters}: `, el('strong', {}, [String(input.value.length)])]),
                el('span', {}, [`${config.labels.tokens}: `, el('strong', {}, [String(tokens.length)])])
            );
        };

        input.addEventListener('input', render);
        stage.append(el('label', { class: 'demo-field' }, [config.labels.prompt || '', input]), chips, readout);
        render();
    },

    temperature(stage, config) {
        const candidates = config.candidates || [
            ['sunny', 0.52], ['cloudy', 0.22], ['rainy', 0.14], ['windy', 0.08], ['purple', 0.04]
        ];
        const slider = el('input', { type: 'range', min: 0, max: 2, step: 0.1, value: 1 });
        const label = el('span', {}, [`${config.labels.temperature}: `, el('strong', {}, ['1.0'])]);
        const list = el('div', { class: 'prob-list' });
        const result = el('p', { class: 'demo-readout' });
        const button = el('button', { type: 'button', class: 'button button-primary' }, [config.labels.sample]);

        const distribution = () => {
            const t = Math.max(Number(slider.value), 0.05);
            const weights = candidates.map(([, p]) => Math.pow(p, 1 / t));
            const total = weights.reduce((sum, weight) => sum + weight, 0);
            return candidates.map(([word, p], index) => [word, weights[index] / total, p]);
        };

        const render = picked => {
            label.querySelector('strong').textContent = Number(slider.value).toFixed(1);
            list.replaceChildren(...distribution().map(([word, p]) => el('div', { class: `prob-row${picked === word ? ' is-picked' : ''}` }, [
                el('span', {}, [word]),
                el('span', { class: 'chart-track' }, [el('span', { class: 'chart-bar', style: `--value: ${(p * 100).toFixed(1)}%; --color: var(--chart-2); width: var(--value)` })]),
                el('span', { class: 'chart-value' }, [`${(p * 100).toFixed(0)}%`])
            ])));
        };

        button.addEventListener('click', () => {
            let roll = Math.random();
            const picked = distribution().find(([, p]) => (roll -= p) <= 0) || distribution().at(-1);
            render(picked[0]);
            result.replaceChildren(el('span', {}, [config.prefix || '', ' ', el('strong', {}, [picked[0]])]));
        });
        slider.addEventListener('input', () => render());

        stage.append(el('label', { class: 'demo-field' }, [label, slider]), list, el('div', { class: 'demo-row' }, [button, result]));
        render();
    },

    context(stage, config) {
        const blocks = config.blocks || [
            ['System instructions', 400, '#7a3fd1'], ['Knowledge snippets', 1200, '#1a7f37'], ['Tool definitions', 600, '#9a6700'],
            ['Message 1', 300, '#0b6bcb'], ['Message 2', 500, '#0b6bcb'], ['Message 3', 450, '#0b6bcb'],
            ['Message 4', 700, '#0b6bcb'], ['Message 5', 650, '#0b6bcb'], ['New question', 200, '#7f2942']
        ];
        const total = blocks.reduce((sum, [, size]) => sum + size, 0);
        const slider = el('input', { type: 'range', min: 500, max: total, step: 100, value: total });
        const label = el('span', {}, [`${config.labels.contextSize}: `, el('strong', {}, [`${total} ${config.labels.tokens}`])]);
        const window_ = el('div', { class: 'context-window' });
        const readout = el('div', { class: 'demo-readout' });

        const render = () => {
            const limit = Number(slider.value);
            label.querySelector('strong').textContent = `${limit} ${config.labels.tokens}`;
            let used = blocks.at(-1)[1];
            const kept = new Set([blocks.length - 1]);
            for (let index = blocks.length - 2; index >= 0; index--) {
                if (used + blocks[index][1] <= limit) {
                    used += blocks[index][1];
                    kept.add(index);
                }
            }
            window_.replaceChildren(...blocks.map(([name, size, color], index) =>
                el('span', { class: `context-block${kept.has(index) ? '' : ' is-dropped'}`, style: `--chip: ${color}` }, [`${name} · ${size}`])));
            readout.replaceChildren(
                el('span', {}, [`${config.labels.fits}: `, el('strong', {}, [String(kept.size)])]),
                el('span', {}, [`${config.labels.dropped}: `, el('strong', {}, [String(blocks.length - kept.size)])]),
                el('span', {}, [`${config.labels.tokens}: `, el('strong', {}, [`${used} / ${limit}`])])
            );
        };

        slider.addEventListener('input', render);
        stage.append(el('label', { class: 'demo-field' }, [label, slider]), window_, readout);
        render();
    },

    conversation(stage, config) {
        const script = config.messages || [];
        const chat = el('div', { class: 'chat-sim' });
        const play = el('button', { type: 'button', class: 'button button-primary' }, [config.labels.play]);
        let index = 0;
        let timer = null;

        const next = () => {
            if (index >= script.length) {
                clearInterval(timer);
                timer = null;
                play.textContent = config.labels.replay;
                return;
            }
            const [role, text] = script[index++];
            chat.append(el('div', { class: `chat-bubble ${role}` }, [text]));
            chat.lastElementChild.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
        };

        play.addEventListener('click', () => {
            if (timer) return;
            chat.replaceChildren();
            index = 0;
            play.textContent = config.labels.play;
            next();
            timer = setInterval(next, reducedMotion ? 200 : 1300);
        });

        stage.append(chat, el('div', { class: 'demo-row' }, [play]));
    },

    search(stage, config) {
        const documents = config.documents || [];
        const input = el('input', { type: 'text', placeholder: config.placeholder || '' });
        const grid = el('div', { class: 'rag-grid' });

        const words = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]{3,}/g) || [];

        const render = () => {
            const query = new Set(words(input.value));
            const scored = documents.map(([title, body, tags]) => {
                const bag = words(`${title} ${body} ${(tags || []).join(' ')}`);
                const hits = [...query].filter(term => bag.some(word => word.startsWith(term) || term.startsWith(word))).length;
                return { title, body, score: query.size ? hits / query.size : 0 };
            }).sort((a, b) => b.score - a.score);
            const best = scored[0]?.score || 0;
            grid.replaceChildren(...scored.map(doc => el('div', { class: `rag-doc${doc.score > 0 && doc.score === best ? ' is-match' : ''}` }, [
                el('strong', {}, [doc.title]),
                doc.body,
                query.size ? el('span', { class: 'score' }, [`${(doc.score * 100).toFixed(0)}%`]) : null
            ])));
        };

        input.addEventListener('input', render);
        stage.append(el('label', { class: 'demo-field' }, [config.label || '', input]), grid);
        render();
    },

    cost(stage, config) {
        const fields = [
            ['conversations', config.labels.conversations, 1000, 100, 50000, 2000],
            ['inputTokens', config.labels.inputTokens, 500, 100, 20000, 100],
            ['outputTokens', config.labels.outputTokens, 300, 50, 5000, 50],
            ['inputPrice', config.labels.inputPrice, 1, 0.05, 20, 0.05],
            ['outputPrice', config.labels.outputPrice, 4, 0.1, 80, 0.1]
        ];
        const inputs = {};
        const readout = el('div', { class: 'demo-readout' });
        const bar = el('span', { class: 'chart-track' }, [el('span', { class: 'chart-bar', style: '--color: var(--chart-1); width: 0' })]);

        const render = () => {
            const value = key => Number(inputs[key].value);
            const monthly = value('conversations') * (value('inputTokens') * value('inputPrice') + value('outputTokens') * value('outputPrice')) / 1e6;
            const perConversation = monthly / value('conversations');
            readout.replaceChildren(
                el('span', {}, [`${config.labels.monthlyCost}: `, el('strong', {}, [`US$ ${monthly.toFixed(2)}`])]),
                el('span', {}, [`${config.labels.perConversation}: `, el('strong', {}, [`US$ ${perConversation.toFixed(4)}`])])
            );
            bar.firstElementChild.style.width = `${Math.min(monthly / (config.max || 2000) * 100, 100)}%`;
        };

        fields.forEach(([key, label, value, min, max, step]) => {
            const input = el('input', { type: 'range', min, max, step, value });
            const text = el('span', {}, [`${label}: `, el('strong', {}, [String(value)])]);
            input.addEventListener('input', () => {
                text.querySelector('strong').textContent = input.value;
                render();
            });
            inputs[key] = input;
            stage.append(el('label', { class: 'demo-field' }, [text, input]));
        });

        stage.append(bar, readout);
        render();
    }
};

function initDemos() {
    const labels = document.body.dataset;
    document.querySelectorAll('[data-demo]').forEach(section => {
        const demo = demos[section.dataset.demo];
        if (!demo) return;
        try {
            const config = section.dataset.config ? JSON.parse(section.dataset.config) : {};
            config.labels = { ...JSON.parse(labels.learnLabels || '{}'), ...(config.labels || {}) };
            demo(section.querySelector('[data-demo-stage]'), config);
        } catch (error) {
            console.error(`Learn demo "${section.dataset.demo}" failed`, error);
        }
    });
}

export function initLearn() {
    if (!document.body.classList.contains('layout-learn') && !document.body.classList.contains('layout-learn-hub')) return;
    initProgress();
    initReveal();
    initSteps();
    initQuizzes();
    initDemos();
}
