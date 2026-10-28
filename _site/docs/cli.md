Source: https://docs.aivax.net/docs/cli.html

# CLI tool

The AIVAX CLI operates an AIVAX account from the terminal. It covers the same products as the API, including AI Gateways, RAG collections, chat clients, Batch, Agentic Tests, web search, OCR, generations, conversations, skills, logs, and account settings, without requiring you to write HTTP requests.

The CLI is open source under the MIT license and published on npm as [`@aivax/cli`](https://www.npmjs.com/package/@aivax/cli).

## When to use it

Use the CLI when a person or an agent works with an account interactively or from scripts:

- inspecting and adjusting gateways, collections, and chat clients without opening the dashboard;
- importing documents into a collection, or transcribing a long PDF page by page into Markdown or RAG-ready JSONL;
- creating, starting, and exporting Batch jobs from local files;
- running Agentic Tests, checking consumption, or reading conversations and logs while debugging;
- giving a coding agent a compact way to operate AIVAX, since responses are optimized for agents by default.

For application code that serves end users, call the [API](https://docs.aivax.net/docs/overview.md#make-your-first-request) or an OpenAI-compatible SDK directly instead.

## Install

The CLI requires [Bun](https://bun.sh) 1.3.14 or newer.

```bash
bun install -g @aivax/cli
aivax auth login
```

`aivax auth login` saves an account profile. The access key is kept in the operating system credential store. For scripts and CI, set the `AIVAX_API_KEY` environment variable instead of logging in.

## What it can do

Ask a gateway about a local file:

```bash
aivax gateways chat -m <GATEWAY_ID> "Summarize this contract" -f contract.pdf --stream
```

Search a collection, or transcribe a document and index it:

```bash
aivax rag search --collection <COLLECTION_ID> -q "refund policy" -k 10
aivax ocr document manual.pdf --format jsonl -o manual.jsonl
aivax rag import -c <COLLECTION_ID> -f manual.jsonl
```

Run a Batch job from a JSONL file and export the results:

```bash
aivax batch items import -w <WORKFLOW_ID> -j <JOB_ID> -f customers.jsonl
aivax batch jobs start -w <WORKFLOW_ID> -j <JOB_ID>
aivax batch jobs export -w <WORKFLOW_ID> -j <JOB_ID> -o results.jsonl
```

Generate media, search the web, or check spending:

```bash
aivax generate speech -m <MODEL_ID> -t @script.txt -o narration.mp3
aivax web search -q "AI regulation news" --country US
aivax analytics balance
```

Call any endpoint that has no dedicated command:

```bash
aivax api get /api/v1/notifications/unread/count
```

Run `aivax --help` to list every command group, and add `--help` to any command to see its options. `aivax docs reference <ENDPOINT_NAME>` shows the API reference for an endpoint without leaving the terminal.
