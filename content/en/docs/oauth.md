---
{title: OAuth,linkTitle: OAuth,weight: 22,group: Introduction}
---

# OAuth

OAuth lets your application use a person's AIVAX account for its AI features. Instead of building your own model access, billing and limits, your application asks the account holder for permission, and AIVAX gives it an access token limited to what the person approved.

It is designed for applications that need AI resources but should not own them: desktop and mobile apps, editor plugins, browser extensions, automation tools and SaaS products where each user brings their own AIVAX account. The account holder keeps control of the account. Requests made with the token use that account's models, AI gateways, collections and balance, and the person can revoke the access at any time.

## When to use it

Use OAuth when the person who owns the AIVAX account is not the developer of the application. They should never have to copy an API key into a third-party product, and the application should only receive the permissions it needs.

Use OAuth when:

- the account holder is not the developer of the application;
- the person should not copy an API key into your product;
- the application needs only the permissions it will use.

Use a [private or public API key](authentication.md#api-key-types) when the application and the AIVAX account belong to you. For example, a backend that serves your own users with your own AIVAX account should use a private key.

## How it works

Authorization is a browser handoff. Your application creates a request, the person reviews it in the console, and AIVAX returns the result to your callback.

1. Your application creates an authorization request with its name, the reason it needs access, the permissions it wants and the address that receives the result.
2. Your application sends the person to the authorization address returned by AIVAX.
3. The person signs in to the AIVAX console if needed, reviews the request and chooses how long the access lasts: 1 day, 7 days, 90 days or 1 year.
4. AIVAX redirects the person back to your application with an access token, or with an error if access was denied.
5. Your application calls the AIVAX API with the token, like any other API key.

No refresh token is issued. When the token expires or is revoked, start a new authorization.

## Create an authorization request

Use this call when your application is ready to send a person to the AIVAX console. This endpoint does not require authentication and is rate limited per remote address.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20OAuth%20Authorization%20Request&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Request body

The request body has:

- `clientName`: the name shown to the person, from 3 to 64 characters.
- `reason`: why your application needs access, from 3 to 500 characters and at most 6 lines. Be specific, for example "Summarize your meeting notes with your AI gateways".
- `permissions`: the [permissions](#permissions) your application needs.
- `returnUrl`: the address that receives the result.

### Return URL

The `returnUrl` must:

- be an absolute `http` or `https` address;
- contain no credentials;
- contain no fragment;
- not point to the AIVAX console;
- not repeat query parameters;
- not already contain `access_token`, `expires_in` or `error` in its query.

### Response

The response has:

- `authorizationUrl`: the console address where the person approves the request.
- `expiresIn`: seconds until the request expires.

The request expires after one hour and can be approved or denied once.

## Send the person to the console

Open the returned address in the person's browser. Do this before the request expires.

1. Open `authorizationUrl` in the person's browser.
2. The console asks them to sign in when they are not signed in, and returns to the request afterwards.
3. The console shows your application name, the reason, the requested permissions and the full return address.
4. The **Authorize** button stays disabled for five seconds so the request can be read.
5. Authorizing requires a browser check.

## Receive the token

Your `returnUrl` receives the decision as query parameters. Handle that callback on your server, then store the token as a secret.

### Query parameters

After approval, AIVAX redirects the person to `returnUrl` with these query parameters:

- `access_token`: the application key, starting with `sk-aiv-apk`.
- `expires_in`: the token lifetime, in seconds.

If the person denies access, the query has `error=access_denied` instead.

Query parameters already present in `returnUrl` are kept.

### Check state

Add your own random `state` value when you create the request. This check confirms that the callback belongs to a request your application started.

1. Store `state` in the person's session.
2. Compare it in the callback.
3. Accept the result only when the values match.

### Store the token on the server

The token arrives in a URL. Treat the callback as sensitive:

1. Read the token on your server.
2. Store it as a secret.
3. Redirect the browser to an address without it.
4. Do not log callback URLs or send the token to the browser.

```javascript
app.get("/oauth/callback", async (req, res) => {
  if (!req.query.state || req.query.state !== req.session.oauthState) {
    return res.status(400).send("Invalid state.");
  }

  if (req.query.error) {
    return res.redirect("/settings?aivax=denied");
  }

  if (!req.query.access_token) {
    return res.status(400).send("Missing token.");
  }

  await saveAivaxToken(req.session.userId, {
    token: req.query.access_token,
    expiresAt: Date.now() + Number(req.query.expires_in) * 1000
  });

  res.redirect("/settings?aivax=connected");
});
```

## Use the token

Send the token like any other API key, preferably in the `Authorization` header. For OpenAI-compatible SDKs, pass it as the API key and set the base URL to `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<ACCESS_TOKEN>"
)
```

Usage made with the token is charged to the account that authorized your application. Every application key can call `GET /api/v1/accounts` to read the account identifier, name and e-mail, so your application can show which account it is connected to.

A request that needs a permission the token does not have returns `403 Forbidden`, and the error message names the missing permissions. A revoked or expired token returns `401 Unauthorized`; ask the person to connect again.

## Permissions

Request only what your application uses. The console shows each permission to the person before they approve it.

- `InferenceText`: chat completions with models and AI gateways.
- `InferenceGenerations`: image, speech, transcription, decision, extraction and other generations.
- `InferenceRealtime`: realtime voice sessions.
- `ResourcesRead`: read AI gateways, chat clients, batch, skills, shell sandbox files and other resources, and list models.
- `ResourcesWrite`: create, edit and delete those resources.
- `RagRead`: semantic search and reading documents of RAG collections.
- `RagWrite`: create, edit and delete RAG collections and documents.
- `ManagementAnalytics`: read balance, consumption and billing information.
- `Account`: payments, subscriptions, plan changes, notifications and other account-level operations.
- `WebUtilities`: web search and URL fetching.

`ManagementKeys` cannot be requested, so application keys can never list, create or delete API keys or manage the account credentials.

## Revoke access

The account holder revokes an application from the console. Use this section to tell them where to review or remove access.

In **My account**, **Authorized applications**, the account holder can see:

- every authorized application;
- its permissions;
- its expiration;
- its last use.

Revoking an application invalidates the token immediately.
