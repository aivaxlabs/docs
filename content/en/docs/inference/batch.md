---
{title: Batch Processing,linkTitle: Batch processing,weight: 90,group: Inference,aliases: [/docs/platform/batch.html,/docs/features/batch.html]}
---

# Batch Processing

Batch runs the same AI workflow over many independent items. It turns a list of inputs into a background queue with fixed instructions, structured output, optional validation, progress tracking, retries, and result export.

Use Batch when dozens, hundreds, or thousands of records need the same reasoning, and each record can be handled on its own. Typical jobs:

- Classify leads.
- Extract fields from text.
- Enrich records.
- Summarize short documents.
- Evaluate responses.
- Moderate content.
- Generate structured data.
- Call built-in tools for each line of a list.

## What Batch solves

Use Batch when you would otherwise build the queue yourself. Processing many items usually needs error handling, retries, JSON validation, and result export. Batch keeps those parts in AIVAX, so you operate the workload instead of assembling the pipeline.

In practice, it gives you:

- **Repeatable processing:** the same instruction, model, and schema are applied to all items.
- **Asynchronous execution:** the work continues in the background, without keeping a request open.
- **Structured output:** each item can be required to return an object compatible with a JSON Schema.
- **Correction and validation:** AIVAX tries to reprocess invalid responses and can run a second validation step.
- **Operation at scale:** jobs can be started, paused, resumed, monitored, filtered, cleaned, resent for retry, and exported.
- **Operational control:** the UI shows progress, failures, confidence, and job events.

## When to use

Use Batch when each item can be processed on its own and does not need to share memory with the others. A typical item is one line for:

- a client;
- a URL;
- a product;
- a ticket;
- a message;
- a short document;
- a contract snippet;
- a raw record.

Batch is a good choice when:

- the same prompt applies to all items;
- you need tabular or JSON results for later consumption;
- response time can be asynchronous;
- you want to track errors and retry only the problematic items;
- you want to use built-in tools, such as web search, for each item;
- you need to measure confidence and success rate per run.

Do **not** use Batch when:

- the conversation must be real-time;
- one item depends on the previous item's response;
- you are indexing documents for RAG;
- the task is purely deterministic and does not require an AI model.

To index searchable knowledge, use [RAG collections](/docs/rag/collections). For a single immediate response to a user, use [inference](/docs/inference/chat-completions/concepts.md).

## Concepts

Batch is built from a workflow, a job, and items. Save the workflow once, create a job for each workload, and treat every imported row as its own item.

### Workflow

The workflow is the processing recipe. Create it when many jobs should follow the same rule. It defines how future items will be handled:

- title;
- processing instructions;
- model or AI gateway;
- expected result schema;
- enabled built-in tools;
- validation instructions; and
- retry and error-handling behavior.

Changing a workflow affects subsequent jobs and items processed with that configuration. Use separate workflows when the instruction, schema, model, or validation rules change in a significant way.

### Model and routing

Each item is processed by the integrated model or AI Gateway you choose. Set that choice in the workflow **Model** setting. The API uses the same choice as `modelName`.

When the workflow does not use an AI Gateway, Batch optimizes for cost:

- Items are always routed with the `Cheapest` [provider routing preference](/docs/inference/routing/setup-routing.md).
- That preference selects the available provider with the lowest input and output token price for that model.
- The `Balanced` default is not applied, so provider selection can differ from other features that request the same model.
- When only one provider is available or compatible with the request, routing does not change the result.

Create an [AI Gateway](/docs/inference/ai-gateways/concepts.md) and select it in the workflow when you need a different route or shared gateway setup. A gateway lets you:

- use the `Balanced`, `Fastest`, or `Quality` preference;
- restrict which providers are attempted;
- apply fixed instructions, tools, and RAG configuration to every item.

### Job

A job is one workload created from a workflow. Use it to group the items you want to process together. It keeps that workload's state, events, and metrics while the job is prepared, processed, paused, or completed.

See the embedded API Reference for supported job states.

### Item

An item is one row from the imported list. Each row becomes an independent input sent to the model with the workflow's instructions.

Each item records its processing outcome, output, confidence, and validation details. See the embedded API Reference for supported item states.

## How to use in the console

Use the console when you want to design the workflow, inspect items, and operate the job by hand. In the AIVAX console, go to **Batch**.

### Create a workflow

A workflow is the rule later jobs reuse. In **Workflows**, create one and configure:

1. **Basic:** set a title, the processing instruction, and the JSON Schema of the result.
2. **Behavior:** choose the supported assistant capabilities for the workflow.
3. **Validation:** enable validation when the response needs to be checked against business rules.
4. **Handling:** configure the workflow's error-handling behavior.

Write the instruction as a general rule, not as a single question. The imported item will be the variable input.

Instruction example:

```text
Classify the company provided in the input. Return the likely sector, a short justification, and signals found in the text. If the input does not contain enough information, use sector "Undefined".
```

Schema example:

```json
{
  "type": "object",
  "properties": {
    "sector": { "type": "string" },
    "reason": { "type": "string" },
    "signals": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["sector", "reason", "signals"],
  "additionalProperties": false
}
```

### Create and run a job

A job is the workload for one run. Create it after the workflow exists. New jobs are created in `Paused` state so you can import and inspect the workload before starting processing.

Choose the import mode that matches the source:

- `lines`: reads one uploaded text file and imports each non-empty line as one item.
- `files`: imports each uploaded plain-text file as one item.
- `zip`: imports each plain-text entry in an uploaded ZIP file as one item.
- `text`: imports the submitted text field as a single item.

Lines can be plain text, delimited CSV, URLs, IDs, compact JSON, or any format the instruction knows how to interpret. For structured line-based inputs, prefer JSONL: one JSON object per line.

Example:

```jsonl
{"name":"Company A","description":"B2B auto-parts marketplace"}
{"name":"Company B","description":"Office specializing in employment contracts"}
{"name":"Company C","description":"Regional pharmacy chain"}
```

Start the job when the imported list looks right. The job screen lets you monitor:

- overall progress;
- pending, completed, and failed items;
- average confidence;
- job events;
- most recent processed items;
- full item list with filters by state and confidence.

### Operate on failed items

Use this step when the job has errors, refusals, or results you do not trust yet. Filter the list by execution error, validation error, refusal, or low confidence. Then you can:

- retry all errors;
- retry only execution errors;
- retry only validation errors;
- retry completed items with low confidence;
- remove pending, completed, error, or all non-running items;
- open an individual item to review input, output, state, and confidence.

### Export results

Export when the job finishes and you need the rows outside AIVAX. The file is JSONL. Each line contains metadata, the original input, and the output. Import it into a spreadsheet, database, data pipeline, or manual review step.

## How to use via the API

Use the API when Batch should run inside your own system, data pipeline, or automation. Authentication follows the same pattern as the AIVAX API.

The API flow matches the console. Each step is a separate operation:

1. Create the workflow, the reusable recipe.
2. Create a job from that workflow.
3. Import the items.
4. Start the job when the workload looks right.
5. List, retry, clean up, and export items without losing track of individual records.

If you are still deciding whether Batch is the right feature:

- Use Batch for repeated reasoning over independent items.
- Use [RAG collections](/docs/rag/collections) for searchable knowledge that should be retrieved later.
- Use [direct inference](/docs/inference/chat-completions/concepts.md) for one immediate answer.

### Create workflow

A workflow is the saved processing rule. Create one when future jobs should reuse the same policy, not a one-time prompt for a single record.

Define:

- the instruction;
- the model;
- the output schema;
- validation behavior;
- retries;
- enabled tools.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Create job

A job is one concrete workload. Create it when an existing workflow should process a specific list. Jobs are created paused so you can import and inspect items before processing.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Import the items next. Leave the job paused until the list looks right.

### Import items

Import is how a source file becomes independent units of work. Do it after the job exists, and choose the mode that matches the source:

- one line per record;
- one file per record;
- one ZIP entry per record;
- one submitted text as a single record.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

See the embedded API Reference for supported import modes, fields, and current constraints.

### Start, pause, or finish

These actions change whether the job keeps running. Use them only after the item list is the workload you intend to process.

- **Start** when the item list looks correct.
- **Pause** to investigate errors or adjust the workflow.
- **Finish** when the job should be terminated rather than resumed.

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

See the embedded API Reference for the supported job states.

### Monitor

Monitoring tells you whether the workflow is healthy enough to leave running. Use the job view for overall state. Use the item list when you need to see where work is stuck, which items failed validation, and which low-confidence results deserve human review.

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

List the job's items when you need the row-level view:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the list endpoint to filter items by state, confidence, or input text. See the embedded API Reference for supported filters.

### Retry and clean

Retry and cleanup are for items you have already inspected. Retry after you understand the failure shape:

- Retry **execution errors** when the provider or request failed.
- Retry **validation errors** when the response can likely be regenerated into the expected shape.
- Retry **low-confidence results** when the item succeeded but deserves another model attempt.

Use a cleanup endpoint when non-running items are no longer useful and should leave the job.

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the retry endpoint after reviewing the failure pattern. See the embedded API Reference for supported retry options and resulting job behavior. For the export filter that matches each retry mode, and how provider batch APIs handle expiry, see [expired batch jobs: partial results and retrying only what failed](https://aivax.net/blog/expired-batch-job-recover-partial-results-retry-failed/).

To remove non-running items from the job:

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the removal endpoint only for items that are no longer useful. See the embedded API Reference for supported removal options.

### Export

Export is the handoff from AIVAX back into your workflow. Use it after the job finishes, or export a subset when review needs finished items first and errors later.

JSONL fits spreadsheets, databases, queues, and manual audit tools. Each line stays tied to the original input and its generated output.

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the export endpoint when your review or downstream process needs a selected set of completed results. See the embedded API Reference for supported export filters.

## Availability

Review billing and capacity before you process a large workload. Start with [Pricing](/docs/pricing) and the [limits](#limits) below.

## Limits

Limits are the capacity check for a large workload. The number of workflow items processed per day depends on the plan. See [Batch and Agentic Tests limits](/docs/limits.md#batch-and-agentic-tests).

These import limits apply to every plan:

| Limit | Value |
| --- | --- |
| Files per import request | 1,000 |
| Total import size | 100 MiB/request |
| Single imported file size | 10 MiB |

Batch processing is asynchronous. If quota pauses or fails the job:

1. Wait until the quota window resets, then retry.
2. Or upgrade the account.

For how batch admission handles quota pauses and partial results, see [running thousands of LLM requests in batch](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Best practices

Use these checks before a large run, while you repair failures, and before you hand results to review.

- Test the workflow with a few items before importing a large list.
- Use restrictive schemas with `required` and `additionalProperties: false` when the output will be consumed by a system.
- Include input and output examples in the instruction when the format is ambiguous.
- Prefer one line per item; if you need to send complex objects, use JSONL.
- Keep validation enabled for sensitive tasks such as legal, financial extraction, or data that feeds automations.
- Use `maxRetries` to fix occasional failures, but investigate repeated errors in the prompt or schema.
- Set a low `errorStopThreshold` in new workflows to avoid spending on a batch with a wrong configuration.
- Retry low-confidence items separately. Low confidence does not mean error, but it indicates the response deserves review.
- Export results by state when manual review is needed, e.g., first `finished`, then `errors`.
- For an operational walkthrough of rate limits, retries, and partial results, see [running thousands of LLM requests in batch](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).
