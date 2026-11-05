Source: https://docs.aivax.net/docs/inference/ai-gateways/using-sdks.html

# Using AI Gateways via SDKs

The inference endpoint follows the OpenAI chat completions shape, so existing OpenAI-compatible SDKs work by changing the base URL and the API key. Load your private API key from secure configuration; see [Make your first request](https://docs.aivax.net/docs/overview.md#make-your-first-request) for an environment-variable example.

```python {title="gateway.py"}
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explain why AI gateways are useful."}
    ],
)

print(response.choices[0].message.content)
```

```js {title="gateway.js"}
import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://inference.aivax.net/v1",
    apiKey: process.env.AIVAX_API_KEY,
});

const response = await client.chat.completions.create({
    model: "my-gateway:50c3",
    messages: [
        { role: "user", content: "Explain why AI gateways are useful." }
    ],
});

console.log(response.choices[0].message.content);
```

Replace `my-gateway:50c3` with your gateway's full ID or slug.

OpenAI-compatible inference uses `/v1/chat/completions`. The `/v1/responses` endpoint is not supported.

## Send AIVAX fields

AIVAX extensions, such as `conversation_token`, `builtin_tools`, `response_schema`, `routing_options`, or `metadata`, are not part of the SDK's typed parameters. Send them as extra request-body fields:

```python
response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[{"role": "user", "content": "What changed in my order?"}],
    extra_body={
        "conversation_token": "order-thread-1042",
        "metadata": {"workflow": "order-support"},
    },
)
```

In the JavaScript SDK, add the fields directly to the request object; the SDK sends them in the request body. In TypeScript, the extra fields may need a type cast.

> [!NOTE]
> The Python SDK's `extra_body` argument only adds fields to the request body. It is different from the AIVAX `extra_body` request field, which forwards custom JSON to a BYOK provider; see [Custom JSON](https://docs.aivax.net/docs/inference/chat-completions/custom-json.md).

Fields that AIVAX adds to responses, such as `conversation_token`, `provider`, or `generation_context`, are available through the SDK's raw response or the untyped properties of the returned object.

## Long requests

Requests with long reasoning or many tool calls can exceed the proxy timeout of the default host. Use the direct inference host `https://direct.inference.aivax.net/v1` as `base_url` and raise the SDK timeout; see [Long-running inference](https://docs.aivax.net/docs/overview.md#long-running-inference).
