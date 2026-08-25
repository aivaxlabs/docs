# Batch

Batch is AIVAX's feature for running the same AI workflow over many independent items. It turns a list of inputs into a background-processed queue with fixed instructions, structured output, optional validation, progress tracking, retries, and result export.

Use Batch when you have dozens, hundreds, or thousands of records that need to undergo the same reasoning: classifying leads, extracting fields from text, enriching records, summarizing short documents, evaluating responses, moderating content, generating structured data, or invoking built-in tools for each line of a list.

## What Batch solves

Processing many items with AI usually requires a queue, error handling, retries, JSON validation, and result export. Batch consolidates these parts in AIVAX.

In practice, it mainly solves:

- **Repeatable processing:** the same instruction, model, and schema are applied to all items.
- **Asynchronous execution:** the work continues in the background, without keeping a request open.
- **Structured output:** each item can be required to return an object compatible with a JSON Schema.
- **Correction and validation:** AIVAX tries to reprocess invalid responses and can run a second validation step.
- **Operation at scale:** jobs can be started, paused, resumed, monitored, filtered, cleaned, resent for retry, and exported.
- **Operational control:** the UI shows progress, failures, confidence, and job events.

## When to use

Use Batch when items can be processed independently and do not need to share memory. Good examples are one line per client, URL, product, ticket, message, short document, contract snippet, or raw record.

Batch is a good choice when:

- the same prompt applies to all items;
- you need tabular or JSON results for later consumption;
- response time can be asynchronous;
- you want to track errors and retry only the problematic items;
- you want to use built-in tools, such as web search, for each item;
- you need to measure confidence and success rate per run.

Do **not** use Batch for real‐time conversations, flows where one item depends on the previous item's response, document indexing for RAG, or purely deterministic tasks that do not require an AI model. To index searchable knowledge, use [RAG collections](/docs/rag/collections). For a single immediate response to a user, use [inference](/docs/inference/inference).

## Concepts

### Workflow

The workflow is the processing recipe. It defines how future items will be handled:

- title;
- processing instructions;
- model;
- expected result schema;
- enabled built-in tools;
- validation instructions; and
- retry and error-handling behavior.

Changing a workflow affects subsequent jobs and items processed with that configuration. Use separate workflows when the instruction, schema, model, or validation rules change in a significant way.

### Job

A job is a concrete execution created from a workflow. It groups the items of a workload, maintains state, events, and metrics.

A job represents the workload while it is prepared, processed, paused, or completed. See the embedded API Reference for supported job states.

### Item

An item is a row from the imported list. Each row becomes an independent input sent to the model with the workflow's instructions.

Each item records its processing outcome, output, confidence, and validation details. See the embedded API Reference for supported item states.

## How to use in the console

In the AIVAX console, go to **Batch**.

### Create a workflow

In **Workflows**, create a workflow and configure:

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

After creating the workflow, create a job for the load you want to process. New jobs are created in `Paused` state so you can import and inspect the workload before starting processing.

You can import items in four modes:

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

With the items imported, start the job. The job screen lets you monitor:

- overall progress;
- pending, completed, and failed items;
- average confidence;
- job events;
- most recent processed items;
- full item list with filters by state and confidence.

### Operate on failed items

Use the list filters to find items with execution error, validation error, refusal, or low confidence. Then you can:

- retry all errors;
- retry only execution errors;
- retry only validation errors;
- retry completed items with low confidence;
- remove pending, completed, error, or all non‐running items;
- open an individual item to review input, output, state, and confidence.

### Export results

When the job finishes, export the results in JSONL. Each exported line contains metadata, the original input, and the output. Use this export to import into a spreadsheet, database, data pipeline, or manual review step.

## How to use via the API

Use the API when you want to integrate Batch into your internal system, data pipeline, or automation. Authentication follows the same pattern as the AIVAX API.

The API flow is the same as the console flow, only expressed as separate operations. First create the workflow, which is the reusable recipe. Then create a job, import the items, and start the job when the workload is ready. After processing begins, use the listing, retry, cleanup, and export endpoints to operate the job without losing track of individual records.

If you are still deciding whether Batch is the right feature, compare it with [RAG collections](/docs/rag/collections) and [direct inference](/docs/inference/inference). Batch is for repeated reasoning over independent items. RAG collections are for searchable knowledge that should be retrieved later. Direct inference is for one immediate answer.

### Create workflow

Create a workflow when you want to save the processing rule that future jobs will reuse. This is where you define the instruction, model, output schema, validation behavior, retries, and enabled tools. A good workflow reads like a policy for every item, not like a one-time prompt for a single record.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Create job

Create a job when you have a concrete workload to run through an existing workflow. Jobs are created paused so you can import and inspect items before processing.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Jobs are created paused. Import the items before starting.

### Import items

Import items after the job exists. Each imported item becomes one independent unit of work, so choose the mode that best matches your source data: one line per record, one file per record, one ZIP entry per record, or one submitted text as a single record.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Choose the import format that matches the source data. See the embedded API Reference for supported import modes, fields, and current constraints.

### Start, pause, or finish

Start the job only after the item list looks correct. Pause it to investigate errors or adjust the workflow, and finish it when the job should be terminated rather than resumed.

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

See the embedded API Reference for the supported job states.

### Monitor

Monitoring is how you decide whether the workflow is healthy. The job view gives the overall state; the item list tells you where the work is getting stuck, which items failed validation, and which low-confidence results deserve human review.

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

To list items:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the list endpoint to filter items by state, confidence, or input text. See the embedded API Reference for supported filters.

### Retry and clean

Retries are best used after you understand the failure shape. Retry execution errors when the provider or request failed, validation errors when the response can likely be regenerated into the expected shape, and low-confidence results when the item succeeded but deserves another model attempt. Cleanup endpoints are for removing non-running items from a job when they are no longer useful.

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the retry endpoint after reviewing the failure pattern. See the embedded API Reference for supported retry options and resulting job behavior.

To remove non‐running items:

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the removal endpoint only for items that are no longer useful. See the embedded API Reference for supported removal options.

### Export

Export is the handoff point from AIVAX back into your own workflow. Use it after the job finishes, or export only a subset when a review process needs finished items first and errors later. The JSONL format is convenient for spreadsheets, databases, queues, and manual audit tools because each line remains tied to the original input and its generated output.

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use the export endpoint to select the completed results that your review or downstream process needs. See the embedded API Reference for supported export filters.

## Availability

Review [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits) before processing a large workload.

## Best practices

- Test the workflow with a few items before importing a large list.
- Use restrictive schemas with `required` and `additionalProperties: false` when the output will be consumed by a system.
- Include input and output examples in the instruction when the format is ambiguous.
- Prefer one line per item; if you need to send complex objects, use JSONL.
- Keep validation enabled for sensitive tasks such as legal, financial extraction, or data that feeds automations.
- Use `maxRetries` to fix occasional failures, but investigate repeated errors in the prompt or schema.
- Set a low `errorStopThreshold` in new workflows to avoid spending on a batch with a wrong configuration.
- Retry low‐confidence items separately; low confidence does not mean error, but indicates the response deserves review.
- Export results by state when manual review is needed, e.g., first `finished`, then `errors`.
