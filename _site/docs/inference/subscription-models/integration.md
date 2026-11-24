Source: https://docs.aivax.net/docs/inference/subscription-models/integration.html

# Harness integration

Coding agents and other harnesses reach subscription models through the same OpenAI-compatible Chat Completions API used by every AIVAX model. No extra setup is required on the AIVAX side: create an [API key](https://docs.aivax.net/docs/authentication.md), point the harness at `https://inference.aivax.net/v1`, and use a `@aivax-subscription/` model name.

Use `https://direct.inference.aivax.net/v1` instead when the harness runs long tool loops or large context windows and you would rather avoid gateway request timeouts. The delivered model and the quota consumption are identical; only the host changes.

```text
Base URL:  https://inference.aivax.net/v1
API key:   <AIVAX_API_KEY>
Model:     @aivax-subscription/kimi-k3.1-pro
```

Every subscription model has a 500,000-token context window, accepts the `max`, `high`, and `low` reasoning efforts (MiniMax M3.1 Flash also accepts `xhigh` and `medium`), and is identified from `flags.isSubscription` or `_details.provider_model.subscription`. See [Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md) for the full list.

To use it from an SDK, see [Authentication](https://docs.aivax.net/docs/authentication.md). To declare the endpoint as an AI Gateway, see [AI Gateways](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md).

## Avi

Avi is an AIVAX desktop client with a dedicated AIVAX provider, so the endpoint and the model list are already registered.

1. Open **Settings**, then **AIVAX**, and sign in with your account, either through OAuth or with an API key.
2. In the composer, open the model picker and choose an entry from the **AIVAX** provider.

Subscription models appear in the picker with the rest of the catalog, and their consumption is reported by `/usage` as an AIVAX subscription source instead of a balance debit. Because Avi reads model names, context limits, capabilities, and reasoning efforts from the public catalog, an entry needs no manual configuration.

## Codex

The Codex CLI speaks the OpenAI Responses API, which AIVAX serves at `/v1/responses`. Declare AIVAX as a provider in `~/.codex/config.toml`:

```toml
model_provider = "aivax"
model = "@aivax-subscription/kimi-k3.1-pro"
model_context_window = 500000

[model_providers.aivax]
name = "AIVAX"
base_url = "https://inference.aivax.net/v1"
env_key = "AIVAX_API_KEY"
wire_api = "responses"
supports_websockets = false
```

Select the model with `codex --model "@aivax-subscription/glm-5.3"`, with `-c model=...`, or with `/model` in the TUI.

Codex does not know the AIVAX models, so set `model_context_window` yourself and expect a metadata warning in the picker; supply `model_catalog_json` if you want the list pre-filled. The endpoint is stateless and supports only function tools: hosted tools such as web search and other tool types (`custom`, `namespace`) are ignored.

## Claude Code

The Claude Code CLI targets the Anthropic Messages API, which AIVAX serves at `/v1/messages`. Point Claude Code at AIVAX through the `env` block of `~/.claude/settings.json`, or through the same variables exported in your shell:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://inference.aivax.net",
    "ANTHROPIC_AUTH_TOKEN": "<AIVAX_API_KEY>",
    "ANTHROPIC_MODEL": "@aivax-subscription/kimi-k3.1-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "@aivax-subscription/kimi-k3.1-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "@aivax-subscription/glm-5.3",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "@aivax-subscription/glm-5.3-flash",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS": "1"
  }
}
```

`ANTHROPIC_BASE_URL` takes no `/v1` suffix, because Claude Code appends the Anthropic paths itself. `ANTHROPIC_AUTH_TOKEN` must be set to a non-empty value, otherwise Claude Code opens its login screen; use `/status` to confirm the base URL and the credential source.

Gateway model discovery only keeps model names containing `claude` or `anthropic`, so the `@aivax-subscription/` names must be set explicitly through the variables above. Keep the Haiku alias pointed at a subscription model as well, because session titles and other background tasks use it. Only client tools are supported: Anthropic server tools, such as the web search used by the WebSearch tool, are ignored.

## OpenCode

Declare a custom provider in `~/.config/opencode/opencode.json` (or in the project's `opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "aivax/glm-5.3",
  "providers": {
    "aivax": {
      "name": "AIVAX",
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        "baseURL": "https://inference.aivax.net/v1",
        "apiKey": "{env:AIVAX_API_KEY}"
      },
      "models": {
        "glm-5.3": {
          "modelID": "@aivax-subscription/glm-5.3",
          "name": "GLM 5.3",
          "capabilities": { "tools": true, "input": ["text"], "output": ["text"] },
          "limit": { "context": 500000, "output": 32000 }
        }
      }
    }
  }
}
```

Custom providers must list their models, because automatic discovery only covers the built-in local providers. Use a short key such as `glm-5.3` and put the real AIVAX name in `modelID`, so the runtime reference stays `aivax/glm-5.3` and the request carries the subscription model. The provider key becomes the model prefix: `opencode run --model aivax/glm-5.3`, or pick it in `/models`.

If a request fails on streaming usage accounting, add `"compatibility": { "streamUsage": false }` to the provider.

## VSCode

VS Code ships a first-party **Custom Endpoint** provider for Bring Your Own Key, which accepts any Chat Completions, Responses, or Anthropic Messages endpoint.

1. Open the Chat view, open the model picker, and choose **Manage Language Models** (or run **Chat: Manage Language Models** from the Command Palette).
2. Choose **Add Models**, then **Custom Endpoint**.
3. Set the API type to **Chat Completions**, enter the AIVAX base URL and key, then add the model names.
4. Select the models in the Chat picker.

The models are stored in `chatLanguageModels.json`:

```json
[
  {
    "name": "AIVAX",
    "vendor": "customendpoint",
    "apiKey": "${input:aivaxApiKey}",
    "apiType": "chat-completions",
    "models": [
      {
        "id": "@aivax-subscription/kimi-k3.1-pro",
        "name": "Kimi K3.1 Pro",
        "url": "https://inference.aivax.net/v1/chat/completions",
        "toolCalling": true,
        "vision": false,
        "maxInputTokens": 500000,
        "maxOutputTokens": 32000,
        "streaming": true
      }
    ]
  }
]
```

Give the full endpoint URL so VS Code does not append a path for you. Capabilities are declared by hand: agent mode needs `toolCalling: true`, and the token limits you enter are what the context manager uses.

If you prefer an extension over the built-in provider, Continue, Cline, and Roo Code all expose an OpenAI-Compatible provider where the same base URL and model names apply.

## Visual Studio 2026

Visual Studio 2026 18.12 and later accept any OpenAI-compatible endpoint through Bring Your Own Model.

1. Open Copilot Chat, open the model picker, and choose **Manage models**.
2. Choose **Add model provider**, then **Custom Endpoint**.
3. Enter the connection name, the endpoint `https://inference.aivax.net/v1`, and the API key.
4. Add the `@aivax-subscription/` model names, then set each model's API format to **Completions**, its context size to 500000, and enable tool calling.
5. Select the model in the picker and work in Agent Mode, which is the experience BYOM supports.

The connection lives in the IDE settings. Capabilities are declared per model, as in VS Code.

## Pi Agent

Pi reads custom providers from `~/.pi/agent/models.json`:

```json
{
  "$schema": "https://pi.dev/schemas/models.schema.json",
  "providers": {
    "aivax": {
      "name": "AIVAX",
      "baseUrl": "https://inference.aivax.net/v1",
      "api": "openai-completions",
      "apiKey": "$AIVAX_API_KEY",
      "models": [
        {
          "id": "@aivax-subscription/kimi-k3.1-pro",
          "name": "Kimi K3.1 Pro",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 500000,
          "maxTokens": 32000
        },
        {
          "id": "@aivax-subscription/glm-5.3",
          "name": "GLM 5.3",
          "reasoning": true,
          "input": ["text"],
          "contextWindow": 500000,
          "maxTokens": 32000
        }
      ]
    }
  }
}
```

Models must be listed, because Pi only discovers models at runtime through an extension. To make one the default, add `defaultProvider: "aivax"` and `defaultModel: "@aivax-subscription/kimi-k3.1-pro"` to `~/.pi/agent/settings.json`.

The runtime reference is `aivax/@aivax-subscription/kimi-k3.1-pro`, optionally with a thinking level such as `:high`. Prefer `defaultModel` and the `/model` picker over passing that string by hand, because the model part already contains a `/`. Cost is optional; without it Pi reports zero cost even though the request consumes your quota, and a credential saved in `auth.json` takes precedence over `apiKey`.

## DeepSeek harness

The DeepSeek harness stores providers in `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, where the profile is `web` for the web UI and `headless` for terminal runs. The interactive route is **Settings**, **Models**, **Add model provider**, **Custom model API**.

```yaml
- id: agent-default-model
  name: "@deepseek-ai/dsh-agent-default-model"
  config:
    provider: aivax
    model: "@aivax-subscription/kimi-k3.1-pro"
    reasoningEffort: high
- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      aivax:
        displayName: AIVAX
        apiKeyEnv: AIVAX_API_KEY
        api: openai-completions
        baseURL: https://inference.aivax.net/v1
        defaultContextWindow: 500000
        defaultMaxTokens: 32000
        compat:
          supportsDeveloperRole: false
        models:
          - id: "@aivax-subscription/kimi-k3.1-pro"
            name: Kimi K3.1 Pro
          - id: "@aivax-subscription/glm-5.3"
            name: GLM 5.3
```

`apiKeyEnv` holds the name of the environment variable, not the key itself. Listed models appear in the picker, and choosing one stores it as the default for new sessions; the **Fetch available models** action in the UI fills the list from `GET /v1/models`.

## OpenClaw

OpenClaw accepts third-party endpoints under `models.providers` in `~/.openclaw/openclaw.json`, a JSON5 file:

```json5
{
  models: {
    mode: "merge",
    providers: {
      aivax: {
        baseUrl: "https://inference.aivax.net/v1",
        apiKey: "<AIVAX_API_KEY>",
        api: "openai-completions",
        models: [
          {
            id: "@aivax-subscription/kimi-k3.1-pro",
            name: "Kimi K3.1 Pro",
            reasoning: true,
            input: ["text"],
            contextWindow: 500000,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
  agents: {
    defaults: {
      model: { primary: "aivax/@aivax-subscription/kimi-k3.1-pro" },
    },
  },
}
```

A model reference is `provider/model`, split at the first `/`, so the subscription name keeps its own slash after the provider id. `agents.defaults.model.primary` sets the default, and `openclaw models set` or `/model` switches per session.

Declare every model you plan to use with its context window and token limits, because a custom endpoint has no catalog to describe them. If AIVAX rejects the reasoning parameter, add `compat: { supportsReasoningEffort: false }` to the model. Add `input: ["text", "image"]` for models that accept images.

## Hermes Agent

Hermes Agent uses `~/.hermes/config.yaml` as its single source of truth, with secrets in `~/.hermes/.env`:

```yaml
model:
  default: "@aivax-subscription/kimi-k3.1-pro"
  provider: custom
  base_url: https://inference.aivax.net/v1
  key_env: AIVAX_API_KEY
  context_length: 500000
```

Set `AIVAX_API_KEY` in `~/.hermes/.env`. The `hermes model` command writes the same block interactively through **Custom endpoint**.

The base URL keeps its `/v1` suffix, because Hermes calls a custom endpoint directly. Hermes cannot infer the context window of an unknown model, so set `context_length` explicitly.

For several endpoints, use the `providers` map and switch with `/model custom:aivax:@aivax-subscription/glm-5.3` inside a session:

```yaml
providers:
  aivax:
    api: https://inference.aivax.net/v1
    key_env: AIVAX_API_KEY
    transport: chat_completions
    default_model: "@aivax-subscription/kimi-k3.1-pro"
    context_length: 500000
```

Hermes sends `reasoning_effort: medium` by default on Chat Completions requests. An endpoint that rejects the level returns `400` without a silent downgrade, so pick the level per model or turn the field off with `supports_reasoning: false`.

## OpenBot

OpenBot hosts external coding CLIs and reaches third-party endpoints through its Custom provider, which it runs on its bundled OpenCode runtime. Add it in **Settings**, **Providers**, then **Custom provider**:

```text
Provider name:  AIVAX
Base URL:       https://inference.aivax.net/v1
API key:        <AIVAX_API_KEY>
Models:         @aivax-subscription/kimi-k3.1-pro
                @aivax-subscription/glm-5.3
Context window: 500000
Max output:     32000
```

If the provider does not appear, check whether a project `opencode.json` restricts `enabled_providers` or `disabled_providers`.

## ZCode

ZCode adds providers in the UI: open the model selector, choose **Manage Models**, then **Add Provider**, and fill the OpenAI endpoint.

```text
Provider name:      AIVAX
OpenAI endpoint:      https://inference.aivax.net/v1
Anthropic endpoint: leave empty
API key:            <AIVAX_API_KEY>
Models:             @aivax-subscription/kimi-k3.1-pro
                    @aivax-subscription/glm-5.3
```

Then open the per-model **Advanced** settings and set the context window to 500000 and the maximum output tokens.

ZCode does not read shell environment variables for model setup, so the key must be entered in the form. It also sends a top-level `reasoning_effort` to OpenAI-compatible endpoints; if a level is rejected with `400`, choose a lower one.
