# Getting Started

This guide takes you from an AIVAX account to a verified OpenAI-compatible chat completion. The example uses Python and a private API key from a server-side environment.

By the end, you will have confirmed that your key and selected model or AI Gateway can complete a request.

## Before you begin

You need:

- An AIVAX account with dashboard access and permission to create a private API key.
- Python 3.8 or later with `pip` available.

For pricing and operational limits, see [Pricing](pricing.md) and [Plans and limits](limits.md).

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

## 1. Create a private API key

Create a **private** key from the API Keys area of the AIVAX dashboard. Copy the key when it is shown and store it as a secret; do not paste the real value into the code below.

Private keys are intended for trusted server-side applications. Public keys are restricted credentials for intentionally exposed client-side routes and are not a substitute for a backend key.

If you are building a public web widget or messaging experience, review [Chat clients](features/chat-clients.md) before exposing any credential. Chat sessions provide a clearer boundary for user identity, conversation history, and attachments.

See [Authentication](authentication.md) for supported authentication schemes, private and public key behavior, and secret-handling guidance.

## 2. Install the OpenAI SDK

Install the SDK in the Python environment you will use for this example:

```bash
python -m pip install openai
```

Keep the key outside your source file. For example, set an environment variable named `AIVAX_API_KEY` using the secret-management method appropriate for your shell or deployment platform.

## 3. Choose a model or AI Gateway

The `model` field can identify:

- A hosted model returned by the model listing endpoint.
- An AI Gateway available to your account.

Use a **hosted model** for a direct, one-off call or early experiment. Use an **AI Gateway** when you want to reuse the same model, instructions, RAG collections, skills, tools, moderation, and output settings across requests or users.

Gateway slugs are supported with private keys. Public-key chat completions must use the full gateway UUID and cannot call integrated models directly.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Copy one model name or gateway identifier that is available to your account. You will use it as `<MODEL_OR_GATEWAY_ID>` in the next step.

## 4. Make the first request

Create a file named `quickstart.py` with the following code:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ],
)

print(response.choices[0].message.content)
```

Replace `<MODEL_OR_GATEWAY_ID>` with the exact hosted model name or gateway identifier selected in the previous step. Do not replace `AIVAX_API_KEY` with the key itself; the code reads the secret from the environment.

Run the file:

```bash
python quickstart.py
```

A successful request prints one generated sentence and exits without an API error.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 5. Confirm the integration

Confirm that the generated response matches the prompt and comes from the model or AI Gateway selected in the previous step. This verifies the endpoint, credential, and model selection used by your application.

Before increasing traffic or processing large inputs, review [Pricing](pricing.md) and [Plans and limits](limits.md).

## Troubleshoot the first request

AIVAX uses two response styles:

- OpenAI-compatible endpoints return an OpenAI-style `error` object.
- Account and administrative endpoints return an AIVAX response envelope with an error or a successful `data` value.

| Status | What to check |
| --- | --- |
| `400 Bad Request` | Confirm the model or gateway identifier and remove unsupported parameters from the request. |
| `401 Unauthorized` | Confirm that the private key is present, complete, active, and sent through the SDK configuration. |
| `402 Payment Required` | Review [Pricing](pricing.md) and confirm that the account is ready for a billable request. |
| `403 Forbidden` | Confirm that the key type, model, or selected resource allows this operation. |
| `429 Too Many Requests` | Retry later and review [Plans and limits](limits.md) before increasing request volume. |

If the request still fails, verify in this order:

1. `base_url` is `https://inference.aivax.net/v1`.
2. `AIVAX_API_KEY` is available to the Python process and contains a private key.
3. The selected model or gateway exists and is available to the account.
4. For a gateway, test a plain prompt before adding RAG, tools, media, or structured output so you can isolate configuration problems.

For completions that can exceed the standard proxy timeout, use the direct inference SDK base URL:

```text
https://direct.inference.aivax.net/v1
```

The direct host exposes the OpenAI-compatible model listing and chat completion paths. Keep the same API key, model value, request body, and SDK usage; change only the base URL. Use it when a request receives HTTP `524` while waiting for a long completion, not as a general fallback for authentication or request errors.

## Choose the next product

Once the minimal request works, add one capability at a time:

- [AI Gateways](inference/ai-gateway.md) — make the assistant configuration reusable across requests and users.
- [Structured responses](inference/structured-responses.md) — require generated JSON to follow an application schema.
- [RAG collections](rag/collections.md) — index your documents, test retrieval, and attach grounded knowledge to a gateway.
- [Built-in tools](tools/builtin-tools.md), [MCP](tools/mcp.md), or [Protocol functions](tools/protocol-functions.md) — let the assistant retrieve live information or take action.
- [Chat clients](features/chat-clients.md) — deliver a gateway through web chat or supported messaging channels.
- [Text and media products](overview.md#process-text-documents-and-media) — classify or segment documents, generate images or speech, transcribe audio, and describe media.
- [Batch](features/batch.md) — apply the same workflow to many independent records asynchronously.
- [Agentic Tests](inference/agentic-tests.md) — evaluate a complete gateway conversation before and after configuration changes.

Before increasing traffic or processing large inputs, review [Pricing](pricing.md) and [Plans and limits](limits.md).
