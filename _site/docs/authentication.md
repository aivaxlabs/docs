Source: https://docs.aivax.net/docs/authentication.html

# Authentication

AIVAX authenticates API requests with account API keys. AIVAX accepts API keys via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefer the `Authorization` header for server-to-server calls. Use the query parameter only when a client or integration cannot send headers, because URLs can be logged by proxies, browsers, and monitoring tools.

## API key types

AIVAX has two key families because browser-facing and server-side use cases have different risk profiles. If your code runs on your server, use a private key and keep it out of client bundles, logs, and public repositories. If your code runs in a browser or another environment where the key can be inspected by the end user, use a public key and keep the workflow limited to routes designed for public access.

| Type | Prefix | Intended use | Access |
| --- | --- | --- | --- |
| Private key | `sk-aiv-acc` | Server-side integrations and administrative API calls. | Authenticated account APIs and OpenAI-compatible inference. |
| Public key | `pk-aiv-` | Restricted client-side calls to explicitly public routes. | Public RAG query/answer routes and restricted chat-completion calls. |

Public keys can be used for RAG semantic search, RAG answer generation, speech generation, media descriptions, image generation, and chat completions. When a public key calls chat completions:

- The `model` must be a full AI Gateway UUID; direct integrated-model calls and gateway slug lookup are disabled.
- MCP sources, protocol functions, built-in tools, Bash, skills, and sentinel options are stripped from the request.
- Only these request parameters are accepted: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `idempotency_key`, and `stream`.
- Request and token rate limits are applied both globally per key and per remote address. See [Public API keys](https://docs.aivax.net/docs/limits.md#public-api-keys) for the current values.

Use private keys for backend services, account management, model listing, collection management, batch operations, and any workflow that needs the full gateway tool surface.

For a first server-side request, continue with [Make your first request](https://docs.aivax.net/docs/overview.md#make-your-first-request). If you are exposing a browser or widget experience to end users, review [Chat Clients](https://docs.aivax.net/docs/inference/chat-clients.md) before deciding whether a public key is the right boundary.

## Manage keys

Create and revoke API keys in the API Keys area of the AIVAX dashboard. Keys belong to an account and can have a label, expiration, and type; expired keys are rejected by authentication.

Create separate keys for separate applications. That makes rotation safer: if one integration is compromised, you can revoke only that key instead of breaking every service tied to the account. Use labels to identify each key's owner and application, and expiration dates to plan when to renew or replace it.

## Send a key with Bearer auth

For OpenAI-compatible SDKs, pass the AIVAX key as the SDK API key and set the base URL to `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Hook authentication

AIVAX can authenticate outbound requests to your services, such as AI Gateway workers and server-side protocol functions.

This is the reverse direction of normal API authentication. In a normal API call, your application proves it is allowed to call AIVAX by sending an API key. In a worker or protocol-function callback, AIVAX is calling your service, so your service needs a way to verify that the request really came from the account configuration you control. That is what `X-Request-Nonce` is for.

If your account has a hook key, AIVAX sends:

```text
X-Request-Nonce: <BCrypt hash>
```

The nonce is a BCrypt hash derived from the account hook key. Validate the header by verifying the stored plain-text hook key against the hash. If the account has no hook key, the header is not sent.

Rolling the hook key invalidates existing worker and integration validation secrets.

### C# example

```csharp
using BCrypt.Net;

var nonce = request.Headers["X-Request-Nonce"];
var hookKey = Environment.GetEnvironmentVariable("AIVAX_HOOK_SECRET");

if (nonce is null || hookKey is null)
{
    return Results.Unauthorized();
}

if (!BCrypt.Net.BCrypt.Verify(hookKey, nonce, enhancedEntropy: false))
{
    return Results.Forbid();
}
```

### Python example

```python
import os
import bcrypt
from flask import abort, request

nonce = request.headers.get("X-Request-Nonce")
hook_key = os.getenv("AIVAX_HOOK_SECRET")

if nonce is None or hook_key is None:
    abort(401)

if not bcrypt.checkpw(hook_key.encode("utf-8"), nonce.encode("utf-8")):
    abort(403)
```

### JavaScript example

```javascript
import bcrypt from "bcrypt";

const nonce = req.header("X-Request-Nonce");
const hookKey = process.env.AIVAX_HOOK_SECRET;

if (!nonce || !hookKey) {
  return res.sendStatus(401);
}

if (!(await bcrypt.compare(hookKey, nonce))) {
  return res.sendStatus(403);
}
```

## Console sign-in

The console at `console.aivax.net` signs in with the login key e-mailed when the account is created. A login key is not an API key. It only opens a console session. API keys continue to call the API without a login key or authenticator code.

### Two-factor authentication

Account holders can add one or more authenticator apps from **My account**, **Security**. The QR code and secret are shown only while the six-digit code from that app is confirmed. After confirmation, the secret cannot be viewed again.

When at least one authenticator is confirmed, console sign-in and switching to that saved account ask for a current six-digit code. `POST /api/v1/auth/login` accepts an optional `totpCode`. If the login key is valid and the code is missing, the response has `requiresTwoFactor: true` and does not create a session. Send the same login key again with `totpCode`. Accounts without an authenticator are unchanged.

Removing the last authenticator disables the prompt. Disabling two-factor authentication without a current code is handled by [AIVAX support](https://aivax.net/contact/).

### Recover access

The sign-in page links to account support.

- **Recover login key** asks for the registration e-mail. AIVAX shows the same confirmation whether or not that e-mail belongs to an account. When it does, the message contains a one-time sign-in link and a link to reset the login key. Both expire in one hour. The sign-in link still asks for an authenticator code when two-factor authentication is enabled. The reset link creates a new login key, e-mails it, and signs the account out of every console session. It does not disable two-factor authentication or revoke API keys.
- **Disable two-factor authentication** opens [AIVAX support](https://aivax.net/contact/).
- If the registration e-mail is no longer available, use the same support page.

Resetting the login key from **Security** asks for confirmation, then does the same rotation: a new key is e-mailed, console sessions are signed out, and the browser's saved login is cleared. API keys keep working.
