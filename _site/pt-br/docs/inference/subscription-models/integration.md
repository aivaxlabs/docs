Source: https://docs.aivax.net/pt-br/docs/inference/subscription-models/integration.html

# Integração com harness

Agentes de codificação e outros harnesses acessam os modelos de assinatura pela mesma API de Chat Completions compatível com [OI] usada por todos os modelos da AIVAX. Não há configuração extra do lado da AIVAX: crie uma [chave de API](https://docs.aivax.net/pt-br/docs/authentication.md), aponte o harness para `https://inference.aivax.net/v1` e use um nome de modelo `@aivax-subscription/`.

Use `https://direct.inference.aivax.net/v1` quando o harness executa loops longos de ferramentas ou janelas de contexto grandes e você prefere evitar timeouts de solicitação na gateway. O modelo entregue e o consumo da cota são idênticos; apenas o host muda.

```text
URL base:   https://inference.aivax.net/v1
Chave:      <AIVAX_API_KEY>
Modelo:     @aivax-subscription/kimi-k3.1-pro
```

Todos os modelos de assinatura têm janela de contexto de 500.000 tokens, aceitam os esforços de raciocínio `max`, `high` e `low` (o MiniMax M3.1 Flash também aceita `xhigh` e `medium`) e são identificados por `flags.isSubscription` ou `_details.provider_model.subscription`. Consulte [Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md) para a lista completa.

Para usar a partir de um SDK, consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md). Para declarar o endpoint como uma AI Gateway, consulte [AI Gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md).

## Avi

O Avi é um cliente desktop da AIVAX com um provedor AIVAX dedicado, então o endpoint e a lista de modelos já estão registrados.

1. Abra **Configurações**, depois **AIVAX**, e entre com sua conta, por OAuth ou com uma chave de API.
2. No campo de composição, abra o seletor de modelos e escolha uma entrada do provedor **AIVAX**.

Os modelos de assinatura aparecem no seletor junto com o restante do catálogo, e o consumo é informado pelo `/usage` como origem de assinatura da AIVAX, em vez de débito no saldo. Como o Avi lê nomes, limites de contexto, capacidades e esforços de raciocínio do catálogo público, nenhuma entrada precisa de configuração manual.

## Codex

> [!WARNING]
> A CLI do Codex fala apenas a API Responses do [OI], e a AIVAX não serve `/v1/responses`. O Codex não consegue se conectar diretamente à AIVAX hoje; ele precisa de um tradutor local de Responses para Chat Completions antes do endpoint.

Execute um tradutor que exponha `/v1/responses` e encaminhe para `https://inference.aivax.net/v1`, por exemplo um proxy LiteLLM local:

```yaml
model_list:
  - model_name: "@aivax-subscription/kimi-k3.1-pro"
    litellm_params:
      model: "openai/@aivax-subscription/kimi-k3.1-pro"
      api_base: "https://inference.aivax.net/v1"
      api_key: "os.environ/AIVAX_API_KEY"
```

Em seguida, declare o proxy como provedor em `~/.codex/config.toml`:

```toml
model_provider = "aivax"
model = "@aivax-subscription/kimi-k3.1-pro"
model_context_window = 500000

[model_providers.aivax]
name = "AIVAX"
base_url = "http://127.0.0.1:4000/v1"
env_key = "AIVAX_PROXY_KEY"
wire_api = "responses"
supports_websockets = false
```

Selecione o modelo com `codex --model "@aivax-subscription/glm-5.3"`, com `-c model=...` ou com `/model` na TUI.

Duas consequências vêm da camada de tradução. O Codex não conhece os modelos da AIVAX, então defina `model_context_window` por conta própria e espere um aviso de metadados no seletor; forneça `model_catalog_json` se quiser a lista preenchida. Chamadas de ferramenta, `apply_patch` e saída de raciocínio dependem inteiramente do tradutor, então valide uma edição real e um comando de shell antes de confiar nele.

## [CC]

> [!WARNING]
> A CLI do [CC] usa a API Anthropic Messages (`/v1/messages`), que a AIVAX não serve. O [CC] não consegue se conectar diretamente à AIVAX; ele precisa de um tradutor local de Anthropic Messages para Chat Completions antes do endpoint.

Aponte o [CC] para o tradutor pelo bloco `env` de `~/.claude/settings.json`, ou pelas mesmas variáveis exportadas no seu shell:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:4000",
    "ANTHROPIC_AUTH_TOKEN": "<PROXY_KEY>",
    "ANTHROPIC_MODEL": "@aivax-subscription/kimi-k3.1-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "@aivax-subscription/kimi-k3.1-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "@aivax-subscription/glm-5.3",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "@aivax-subscription/glm-5.3-flash",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS": "1"
  }
}
```

`ANTHROPIC_BASE_URL` não leva sufixo `/v1`, porque o [CC] acrescenta os caminhos da Anthropic por conta própria. `ANTHROPIC_AUTH_TOKEN` precisa ter um valor não vazio, caso contrário o [CC] abre a tela de login; use `/status` para confirmar a URL base e a origem da credencial.

A descoberta de modelos da gateway mantém apenas nomes que contêm `claude` ou `anthropic`, então os nomes `@aivax-subscription/` precisam ser definidos explicitamente pelas variáveis acima. Mantenha o alias Haiku apontado para um modelo de assinatura também, porque títulos de sessão e outras tarefas em segundo plano o utilizam. Assim como no Codex, o uso de ferramentas e a fidelidade do raciocínio dependem do tradutor, e os cabeçalhos `anthropic-beta` e os blocos de pensamento que o [CC] envia precisam ser tratados ou desativados nele.

## OpenCode

Declare um provedor personalizado em `~/.config/opencode/opencode.json` (ou no `opencode.json` do projeto):

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

Versões anteriores do OpenCode usam o bloco legado `provider` com `npm: "@ai-sdk/openai-compatible"`, `api` para a URL base e `options.apiKey`; o formato atual acima é traduzido automaticamente a partir dele.

Provedores personalizados precisam listar seus modelos, porque a descoberta automática cobre apenas os provedores locais embutidos. Use uma chave curta como `glm-5.3` e coloque o nome real da AIVAX em `modelID`, para que a referência em tempo de execução permaneça `aivax/glm-5.3` e a solicitação carregue o modelo de assinatura. A chave do provedor se torna o prefixo do modelo: `opencode run --model aivax/glm-5.3`, ou escolha em `/models`.

Se uma solicitação falhar na contabilização de uso em streaming, adicione `"compatibility": { "streamUsage": false }` ao provedor.

## VSCode

O VS Code inclui um provedor **Custom Endpoint** nativo para Bring Your Own Key, que aceita qualquer endpoint de Chat Completions, Responses ou Anthropic Messages.

1. Abra a exibição de Chat, abra o seletor de modelos e escolha **Manage Language Models** (ou execute **Chat: Manage Language Models** na Paleta de Comandos).
2. Escolha **Add Models**, depois **Custom Endpoint**.
3. Defina o tipo de API como **Chat Completions**, informe a URL base e a chave da AIVAX e adicione os nomes dos modelos.
4. Selecione os modelos no seletor do Chat.

Os modelos ficam em `chatLanguageModels.json`:

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

Informe a URL completa do endpoint para que o VS Code não acrescente um caminho. As capacidades são declaradas manualmente: o modo agente exige `toolCalling: true`, e os limites de tokens informados são o que o gerenciador de contexto utiliza. O Bring Your Own Key cobre sessões de Chat e de agente; completions embutidas e embeddings continuam vindo do GitHub Copilot, e as organizações podem desativar o recurso por política.

Se preferir uma extensão ao provedor nativo, Continue, Cline e Roo Code expõem um provedor compatível com [OI] no qual a mesma URL base e os mesmos nomes de modelo se aplicam.

## Visual Studio 2026

O Visual Studio 2026 18.12 e posteriores aceitam qualquer endpoint compatível com [OI] por meio do Bring Your Own Model.

1. Abra o Copilot Chat, abra o seletor de modelos e escolha **Manage models**.
2. Escolha **Add model provider**, depois **Custom Endpoint**.
3. Informe o nome da conexão, o endpoint `https://inference.aivax.net/v1` e a chave de API.
4. Adicione os nomes de modelo `@aivax-subscription/` e, em cada modelo, defina o formato de API como **Completions**, o tamanho de contexto como 500000 e habilite a chamada de ferramentas.
5. Selecione o modelo no seletor e trabalhe no Agent Mode, que é a experiência suportada pelo BYOM.

Não há arquivo de configuração documentado para isso; a conexão fica nas configurações da IDE. As capacidades são declaradas por modelo, exatamente como no VS Code, e os administradores podem remover **Add model provider** por política. Versões 18.x anteriores aceitavam endpoints personalizados apenas para [OI] e Ollama, então atualize antes de configurar.

## Pi Agent

O Pi lê provedores personalizados de `~/.pi/agent/models.json`:

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

Os modelos precisam ser listados, porque o Pi só descobre modelos em tempo de execução por uma extensão. Para tornar um deles o padrão, adicione `defaultProvider: "aivax"` e `defaultModel: "@aivax-subscription/kimi-k3.1-pro"` a `~/.pi/agent/settings.json`.

A referência em tempo de execução é `aivax/@aivax-subscription/kimi-k3.1-pro`, opcionalmente com um nível de raciocínio como `:high`. Prefira `defaultModel` e o seletor `/model` a digitar essa string manualmente, porque a parte do modelo já contém uma `/`. O custo é opcional; sem ele o Pi informa custo zero mesmo que a solicitação consuma sua cota, e uma credencial salva em `auth.json` tem precedência sobre `apiKey`.

## [DSH]

O harness da DeepSeek ([DSH]) guarda provedores em `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, onde o perfil é `web` para a interface web e `headless` para execuções no terminal. O caminho interativo é **Settings**, **Models**, **Add model provider**, **Custom model API**.

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

`apiKeyEnv` contém o nome da variável de ambiente, não a chave em si. Os modelos listados aparecem no seletor, e escolher um o armazena como padrão para novas sessões; a ação **Fetch available models** na interface preenche a lista a partir de `GET /v1/models`.

Se o provedor padrão continuar respondendo a partir do catálogo da DeepSeek, ele é uma entrada de provedor separada; mantenha a rota da AIVAX com identificador próprio e selecione-a explicitamente.

## OpenClaw

O OpenClaw aceita endpoints de terceiros em `models.providers` de `~/.openclaw/openclaw.json`, um arquivo JSON5:

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

Uma referência de modelo é `provedor/modelo`, dividida na primeira `/`, então o nome de assinatura mantém sua própria barra após o identificador do provedor. `agents.defaults.model.primary` define o padrão, e `openclaw models set` ou `/model` alternam por sessão.

Declare cada modelo que pretende usar com sua janela de contexto e limites de tokens, porque um endpoint personalizado não tem catálogo que os descreva. Se a AIVAX rejeitar o parâmetro de raciocínio, adicione `compat: { supportsReasoningEffort: false }` ao modelo. Modelos renderizados como somente texto durante o onboarding, como os nomes Kimi e DeepSeek, precisam de `input: ["text", "image"]` adicionado manualmente quando o modelo aceita imagens.

## Hermes Agent

O Hermes Agent usa `~/.hermes/config.yaml` como fonte única de verdade, com segredos em `~/.hermes/.env`:

```yaml
model:
  default: "@aivax-subscription/kimi-k3.1-pro"
  provider: custom
  base_url: https://inference.aivax.net/v1
  key_env: AIVAX_API_KEY
  context_length: 500000
```

Defina `AIVAX_API_KEY` em `~/.hermes/.env`. O comando `hermes model` escreve o mesmo bloco interativamente por **Custom endpoint**.

A URL base mantém o sufixo `/v1`, porque o Hermes chama um endpoint personalizado diretamente. O Hermes se recusa a iniciar com janela de contexto abaixo de 64.000 tokens, e não consegue inferir a janela de um modelo desconhecido, então defina `context_length` explicitamente. `OPENAI_BASE_URL` não redireciona um provedor personalizado.

Para vários endpoints, use o mapa `providers` e alterne com `/model custom:aivax:@aivax-subscription/glm-5.3` dentro de uma sessão:

```yaml
providers:
  aivax:
    api: https://inference.aivax.net/v1
    key_env: AIVAX_API_KEY
    transport: chat_completions
    default_model: "@aivax-subscription/kimi-k3.1-pro"
    context_length: 500000
```

O Hermes envia `reasoning_effort: medium` por padrão em solicitações de Chat Completions. Um endpoint que rejeite o nível retorna `400` sem rebaixamento silencioso, então escolha o nível por modelo ou desative o campo com `supports_reasoning: false`.

## OpenBot

O OpenBot hospeda CLIs de codificação externas e acessa endpoints de terceiros pelo provedor Custom, que ele executa no runtime OpenCode incluído. Adicione-o em **Settings**, **Providers**, depois **Custom provider**:

```text
Nome do provedor: AIVAX
URL base:         https://inference.aivax.net/v1
Chave de API:     <AIVAX_API_KEY>
Modelos:          @aivax-subscription/kimi-k3.1-pro
                  @aivax-subscription/glm-5.3
Janela contexto:  500000
Saída máxima:     32000
```

A chave é criptografada pelo aplicativo e não deve ser editada manualmente, então use o formulário em vez da cópia armazenada. Como o provedor roda sobre o OpenCode, um `opencode.json` no projeto que restrinja `enabled_providers` ou `disabled_providers` pode ocultá-lo; verifique esse arquivo se o provedor não aparecer.

Cada turno envia as ferramentas do agente junto com um esforço de raciocínio, então o modelo de assinatura escolhido precisa aceitar ambos em Chat Completions.

## ZCode

O ZCode adiciona provedores na interface: abra o seletor de modelos, escolha **Manage Models**, depois **Add Provider**, e preencha o endpoint [OI].

```text
Nome do provedor:   AIVAX
Endpoint [OI]:      https://inference.aivax.net/v1
Endpoint Anthropic: deixe vazio
Chave de API:       <AIVAX_API_KEY>
Modelos:            @aivax-subscription/kimi-k3.1-pro
                    @aivax-subscription/glm-5.3
```

Depois abra as configurações **Advanced** de cada modelo e defina a janela de contexto como 500000 e o máximo de tokens de saída. O ZCode assume 200.000 tokens para um modelo desconhecido e só reconhece a janela maior por um sufixo no nome do modelo, que os modelos de assinatura não carregam.

O ZCode não lê variáveis de ambiente do shell para configurar modelos, então a chave precisa ser informada no formulário. Ele também envia um `reasoning_effort` de nível superior para endpoints compatíveis com [OI]; se um nível for rejeitado com `400`, escolha um inferior. As configurações ficam em `~/.zcode/`, onde o arquivo de credenciais é criptografado por dispositivo.
