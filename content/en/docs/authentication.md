---
{title: Authentication,linkTitle: Authentication,weight: 20,group: Introduction}
---

# Authentication

AIVAX authenticates API requests with account API keys. A login key is a separate credential and only opens the console.

AIVAX accepts API keys via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Choose how to send the key:

- Prefer `Authorization: Bearer <API_KEY>` for server-to-server calls.
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>` is also accepted.
- Use `?api-key=<API_KEY>` only when a client or integration cannot send headers, because URLs can be logged by proxies, browsers, and monitoring tools.

## API key types

A key type decides which routes the caller can use. Choose it from where the code runs and who owns the account.

AIVAX has two key families because browser-facing and server-side use cases have different risk profiles. If your code runs on your server, use a private key and keep it out of client bundles, logs, and public repositories. If your code runs in a browser or another environment where the key can be inspected by the end user, use a public key and keep the workflow limited to routes designed for public access. Application keys are a third type: an account holder approves them for a third-party application through [OAuth](oauth.md).

| Type | Prefix | Intended use | Access |
| --- | --- | --- | --- |
| Private key | `sk-aiv-acc` | Server-side integrations and administrative API calls. | Every authenticated account API except API key and credential management. |
| Public key | `pk-aiv-` | Restricted client-side calls. | Text inference, generations, and RAG retrieval. |
| Application key | `sk-aiv-apk` | Third-party applications authorized by the account holder. | The permissions approved through [OAuth](oauth.md), plus the account identity. |

Each key type grants a fixed set of permissions, and each route requires some of them. A request whose key lacks a permission required by the route returns `403 Forbidden`, and the error message names the missing permissions.

### Private keys

Use a private key for backend services, account management, model listing, collection management, batch operations, and any workflow that needs the full gateway tool surface.

Private keys cannot list, create, or delete API keys, roll the account salt, manage authenticators, or reset the login key. Use the dashboard for these operations.

For a first server-side request, continue with [Make your first request](overview.md#make-your-first-request).

### Public keys

Use a public key only for routes designed for public access. A public key can call:

- chat completions;
- the `/api/v1/generations/*` endpoints;
- RAG semantic search;
- RAG answer generation.

A public key cannot:

- read or change account resources;
- open voice sessions;
- use the web search and fetch endpoints.

When a public key calls chat completions:

- The `model` must be a full AI Gateway UUID; direct integrated-model calls and gateway slug lookup are disabled.
- MCP sources, protocol functions, built-in tools, Bash, skills, and sentinel options are stripped from the request.
- Only these request parameters are accepted: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `conversation_token`, `idempotency_key`, and `stream`.
- Request and token rate limits are applied both globally per key and per remote address. See [Public API keys](limits.md#public-api-keys) for the current values.

If you are exposing a browser or widget experience to end users, review [Chat Clients](/docs/inference/chat-clients/overview.md) before deciding whether a public key is the right boundary.

### Application keys

Use an application key when a third-party application should call AIVAX with the account holder's permission. The key receives the permissions approved through [OAuth](oauth.md), plus the account identity. See [OAuth authorization](#oauth-authorization) for the short version, and [OAuth](oauth.md) for the complete flow.

## Manage keys

Create and revoke API keys in the API Keys area of the AIVAX dashboard. Use this area when you need a new key, a label, an expiration date, or a revocation.

Keys belong to an account and can have a label, expiration, and type. Expired keys are rejected by authentication.

Create separate keys for separate applications. That makes rotation safer: if one integration is compromised, you can revoke only that key instead of breaking every service tied to the account. Use labels to identify each key's owner and application, and expiration dates to plan when to renew or replace it.

## OAuth authorization

OAuth lets a third-party application ask an AIVAX account holder for an application key instead of asking them to copy an API key. Use it when the person who owns the account is not the developer of the application.

The account holder reviews the request in the console, chooses how long the access lasts, and can revoke it at any time. See [OAuth](oauth.md) for the complete flow, permissions and callback handling.

## Send a key with Bearer auth

Use this pattern when an OpenAI-compatible SDK should call AIVAX. Pass the AIVAX key as the SDK API key and set the base URL to `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Hook authentication

Hook authentication lets your service verify outbound AIVAX requests. Use it for AI Gateway workers and server-side protocol functions.

This is the reverse direction of normal API authentication:

1. In a normal API call, your application proves it is allowed to call AIVAX by sending an API key.
2. In a worker or protocol-function callback, AIVAX calls your service.
3. Your service needs a way to verify that the request really came from the account configuration you control.

That is what `X-Request-Nonce` is for.

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

The console at `console.aivax.net` signs in with the login key e-mailed when the account is created. Use this section when you need to open the console, add an authenticator, or recover a login key.

A login key is not an API key. It only opens a console session. API keys continue to call the API without a login key or authenticator code.

### Two-factor authentication

Account holders can add one or more authenticator apps from **My account**, **Security**. Use an authenticator when console sign-in should require a current code as well as the login key.

1. Add one or more authenticator apps from **My account**, **Security**.
2. Confirm the six-digit code from that app. The QR code and secret are shown only while that code is confirmed.
3. After confirmation, the secret cannot be viewed again.

When at least one authenticator is confirmed:

- Console sign-in asks for a current six-digit code.
- Switching to that saved account asks for a current six-digit code.
- `POST /api/v1/auth/login` accepts an optional `totpCode`.
- If the login key is valid and the code is missing, the response has `requiresTwoFactor: true` and does not create a session.
- Send the same login key again with `totpCode`.

Accounts without an authenticator are unchanged.

Removing the last authenticator disables the prompt. Disabling two-factor authentication without a current code is handled by [AIVAX support](https://aivax.net/contact/).

### Recover access

The sign-in page links to account support. Use these paths when the account holder cannot sign in.

#### Recover login key

**Recover login key** asks for the registration e-mail. AIVAX shows the same confirmation whether or not that e-mail belongs to an account.

When the e-mail belongs to an account, the message contains:

- a one-time sign-in link;
- a link to reset the login key.

Both links expire in one hour.

- The sign-in link still asks for an authenticator code when two-factor authentication is enabled.
- The reset link creates a new login key, e-mails it, and signs the account out of every console session.
- The reset link does not disable two-factor authentication or revoke API keys.

#### Disable two-factor authentication

**Disable two-factor authentication** opens [AIVAX support](https://aivax.net/contact/).

#### Registration e-mail no longer available

If the registration e-mail is no longer available, use the same [support page](https://aivax.net/contact/).

#### Reset the login key in Security

Resetting the login key from **Security** asks for confirmation, then does the same rotation:

- A new key is e-mailed.
- Console sessions are signed out.
- The browser's saved login is cleared.

API keys keep working.
