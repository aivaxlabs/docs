Source: https://docs.aivax.net/docs/data-processing/summarization.html

# Summarization

Use Summarization to condense text, images, and PDFs into short summaries, optionally guided by instructions about format, focus, language, or length. It fits reports, articles, contracts, and scanned documents that need a quick overview before review, search, or a later workflow step.

A summary restates the document in new words without adding information or commentary. To get specific fields as JSON, use [Extraction](https://docs.aivax.net/docs/data-processing/extraction.md) instead. To ask open questions about media or describe visual content, use [Media Descriptions](https://docs.aivax.net/docs/data-processing/media-descriptions.md).

Before calling this endpoint, [create an API key](https://docs.aivax.net/docs/authentication.md) and make sure the account has a positive balance.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/summarize</span>
</div>

## Request behavior

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `documents` | Content part array | Yes | One or more documents as OpenAI-compatible content parts: `text`, `image_url`, or `file`. |
| `instructions` | String | No | Guidance that applies to every summary, such as format, language, focus, or length. |

Images and files accept base64 data URLs or public HTTP(S) URLs. Supported formats are JPEG, PNG, TIFF, and PDF, including multi-page PDFs. AIVAX downloads remote URLs before processing, up to 5 MB each; the resource must be reachable without sign-in. Other content types, such as audio or video, return `400 Bad Request`. The error does not identify which document was rejected, so check the content type of each document in the request.

```json
{
  "instructions": "Answer in three bullet points, in English.",
  "documents": [
    {
      "type": "file",
      "file": {
        "filename": "bitcoin.pdf",
        "file_data": "https://bitcoin.org/bitcoin.pdf"
      }
    }
  ]
}
```

## Read the response

`data` contains one summary string per document, in the same order as `documents`. Documents are summarized independently and in parallel; to get a single summary of several documents, send them as one text document or summarize the individual summaries in a second request.

```json
{
  "message": null,
  "data": [
    "- Proposes a peer-to-peer electronic cash system that works without a trusted third party.\n- Prevents double spending with a proof-of-work chain of timestamped transactions.\n- Stays secure while honest nodes control most of the computing power."
  ]
}
```

If any document fails, the request returns an error instead of partial results. Documents that finished before the failure are still billed and count toward your quota, so retry only after fixing the failing document. Summaries are model-generated and can omit or misstate details; verify consequential information against the original document.

## Pricing and limits

Summarization is billed for the input tokens of each document. Output tokens are not billed.

| Description | Pricing |
| --- | ---: |
| Summarization input | **$0.04/M tokens** |

Summarization and [Extraction](https://docs.aivax.net/docs/data-processing/extraction.md) share the same document limits. An em dash (`—`) means the plan does not impose a limit.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Processed documents | 10/min and 300/day | 200/min | 2,500/min |

The quota counts every item in the request's `documents` array, not each HTTP request. A request that would exceed any active window returns `429 Too Many Requests`. For account-level limits, see [Plans and Limits](https://docs.aivax.net/docs/limits.md).

The embedded API reference contains the server-maintained request, response, authentication, and error details:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Summarize%20documents)
