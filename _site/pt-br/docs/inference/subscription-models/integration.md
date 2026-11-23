Source: https://docs.aivax.net/pt-br/docs/inference/subscription-models/integration.html

# Integração do Harness

Agentes de codificação e outros harnesses acessam modelos por assinatura através da mesma API [OI]-compatible Chat Completions usada por todos os modelos AIVAX. Nenhuma configuração extra é necessária no lado da AIVAX: crie uma [chave de API](https://docs.aivax.net/pt-br/docs/authentication.md), aponte o harness para `https://inference.aivax.net/v1` e use um nome de modelo `@aivax-subscription/`.

Use `https://direct.inference.aivax.net/v1` em vez disso quando o harness executar loops longos de ferramentas ou janelas de contexto grandes e você preferir evitar timeouts de solicitação do gateway. O modelo entregue e o consumo da cota são idênticos; apenas o host muda.

```text
URL Base:  https://inference.aivax.net/v1
Chave de API:   <AIVAX_API_KEY>
Modelo:     @aivax-subscription/kimi-k3.1-pro
```

Cada modelo por assinatura possui uma janela de contexto de 500.000 tokens, aceita os níveis de esforço de raciocínio `max`, `high` e `low` (MiniMax M3.1 Flash também aceita `xhigh` e `medium`) e é identificado por `flags.isSubscription` ou `_details.provider_model.subscription`. Consulte [Modelos por assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md) para a lista completa.

Para usá-lo via SDK, consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md). Para declarar o endpoint como um Gateway de IA, consulte [Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md).

## Avi

O Avi é um cliente desktop da AIVAX com um provedor dedicado da AIVAX, portanto, o endpoint e a lista de modelos já estão registrados.

1. Abra **Configurações**, depois **AIVAX** e faça login na sua conta, seja via OAuth ou com uma chave de API.
2. No compositor, abra o seletor de modelos e escolha uma entrada do provedor **AIVAX**.

Os modelos por assinatura aparecem no seletor junto com o restante do catálogo, e seu consumo é relatado por `/usage` como uma fonte de assinatura AIVAX em vez de um débito de saldo. Como o Avi lê nomes de modelos, limites de contexto, capacidades e esforços de raciocínio do catálogo público, uma entrada não precisa de configuração manual.

## Codex

A CLI do Codex fala a API [OI] Responses, que a AIVAX serve em `/v1/responses`. Declare a AIVAX como um provedor em `~/.codex/config.toml`:

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

Selecione o modelo com `codex --model "@aivax-subscription/glm-5.3"`, com `-c model=...` ou com `/model` na TUI.

O Codex não conhece os modelos da AIVAX, então defina `model_context_window` você mesmo e espere um aviso de metadados no seletor; forneça `model_catalog_json` se quiser que a lista seja preenchida automaticamente. O endpoint é stateless e suporta apenas ferramentas de função: ferramentas hospedadas, como pesquisa na web e outros tipos de ferramenta (`custom`, `namespace`), são ignoradas. Verifique uma edição real e um comando de shell antes de confiar nele.

## [CC]

A CLI [CC] tem como alvo a Anthropic Messages API, que a AIVAX serve em `/v1/messages`. Aponte o [CC] para a AIVAX através do bloco `env` de `~/.claude/settings.json`, ou através das mesmas variáveis exportadas no seu shell:

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

`ANTHROPIC_BASE_URL` não recebe o sufixo `/v1`, porque o [CC] adiciona os caminhos da Anthropic ele mesmo. `ANTHROPIC_AUTH_TOKEN` deve ser definido com um valor não vazio, caso contrário, o [CC] abre sua tela de login; use `/status` para confirmar a URL base e a origem das credenciais.

A descoberta de modelos do gateway mantém apenas nomes de modelos contendo `claude` ou `anthropic`, então os nomes `@aivax-subscription/` devem ser definidos explicitamente através das variáveis acima. Mantenha o alias Haiku apontando para um modelo por assinatura também, pois títulos de sessão e outras tarefas em segundo plano o usam. Apenas ferramentas de cliente são suportadas: ferramentas de servidor da Anthropic, como a pesquisa na web usada pela ferramenta WebSearch, são ignoradas.

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

Versões mais antigas do OpenCode usam o bloco legado `provider` com `npm: "@ai-sdk/openai-compatible"`, `api` para a URL base e `options.apiKey`; o formato atual acima é traduzido automaticamente a partir dele.

Provedores personalizados devem listar seus modelos, porque a descoberta automática cobre apenas os provedores locais integrados. Use uma chave curta, como `glm-5.3`, e coloque o nome real da AIVAX em `modelID`, para que a referência do runtime permaneça `aivax/glm-5.3` e a solicitação carregue o modelo por assinatura. A chave do provedor torna-se o prefixo do modelo: `opencode run --model aivax/glm-5.3`, ou selecione-a em `/models`.

Se uma solicitação falhar na contabilidade de uso em streaming, adicione `"compatibility": { "streamUsage": false }` ao provedor.

## VSCode

O VS Code vem com um provedor **Custom Endpoint** de primeira mão para Bring Your Own Key, que aceita qualquer endpoint Chat Completions, Responses ou Anthropic Messages.

1. Abra a visualização Chat, abra o seletor de modelos e escolha **Gerenciar Modelos de Linguagem** (ou execute **Chat: Gerenciar Modelos de Linguagem** na Paleta de Comandos).
2. Escolha **Adicionar Modelos**, depois **Endpoint Personalizado**.
3. Defina o tipo de API como **Chat Completions**, insira a URL base e a chave da AIVAX, depois adicione os nomes dos modelos.
4. Selecione os modelos no seletor de Chat.

Os modelos são armazenados em `chatLanguageModels.json`:

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

Forneça a URL completa do endpoint para que o VS Code não acrescente um caminho para você. As capacidades são declaradas manualmente: o modo agente precisa de `toolCalling: true`, e os limites de token que você insere são o que o gerenciador de contexto usa. Bring Your Own Key cobre sessões de Chat e agente; complementos de código inline e embeddings ainda vêm do GitHub Copilot, e as organizações podem desativar o recurso por política.

Se você preferir uma extensão sobre o provedor integrado, Continue, Cline e Roo Code expõem todos um provedor [OI]-Compatible onde a mesma URL base e nomes de modelos se aplicam.

## Visual Studio 2026

Visual Studio 2026 18.12 e posteriores aceitam qualquer endpoint [OI]-compatible através do Bring Your Own Model.

1. Abra o Copilot Chat, abra o seletor de modelos e escolha **Gerenciar modelos**.
2. Escolha **Adicionar provedor de modelos**, depois **Endpoint Personalizado**.
3. Insira o nome da conexão, o endpoint `https://inference.aivax.net/v1` e a chave de API.
4. Adicione os nomes dos modelos `@aivax-subscription/`, depois defina o formato de API de cada modelo como **Completions**, seu tamanho de contexto para 500000 e ative a chamada de ferramentas.
5. Selecione o modelo no seletor e trabalhe no Modo Agente, que é a experiência que o BYOM suporta.

Não há arquivo de configuração documentado para isso; a conexão vive nas configurações do IDE. As capacidades são declaradas por modelo, exatamente como no VS Code, e os administradores podem remover **Adicionar provedor de modelos** por política. Versões anteriores da série 18.x aceitavam endpoints personalizados apenas para [OI] e Ollama, então atualize antes de configurar.

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

Os modelos devem ser listados, porque o Pi só descobre modelos em tempo de execução através de uma extensão. Para tornar um padrão, adicione `defaultProvider: "aivax"` e `defaultModel: "@aivax-subscription/kimi-k3.1-pro"` em `~/.pi/agent/settings.json`.

A referência do runtime é `aivax/@aivax-subscription/kimi-k3.1-pro`, opcionalmente com um nível de pensamento, como `:high`. Prefira `defaultModel` e o seletor `/model` a passar essa string manualmente, porque a parte do modelo já contém um `/`. O custo é opcional; sem ele, o Pi reporta custo zero mesmo que a solicitação consuma sua cota, e uma credencial salva em `auth.json` tem precedência sobre `apiKey`.

## [DSH]

O harness DeepSeek ([DSH]) armazena provedores em `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, onde o perfil é `web` para a interface da web e `headless` para execuções de terminal. A rota interativa é **Configurações**, **Modelos**, **Adicionar provedor de modelos**, **API de modelo personalizada**.

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

`apiKeyEnv` contém o nome da variável de ambiente, não a chave em si. Os modelos listados aparecem no seletor, e escolher um armazena-o como padrão para novas sessões; a ação **Buscar modelos disponíveis** na interface preenche a lista a partir de `GET /v1/models`.

Se o provedor padrão ainda responder a partir do catálogo da DeepSeek, trata-se de uma entrada de provedor separada; mantenha a rota da AIVAX sob seu próprio identificador e selecione-a explicitamente.

## OpenClaw

O OpenClaw aceita endpoints de terceiros sob `models.providers` em `~/.openclaw/openclaw.json`, um arquivo JSON5:

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

Uma referência de modelo é `provider/model`, dividida no primeiro `/`, então o nome da assinatura mantém sua própria barra após o id do provedor. `agents.defaults.model.primary` define o padrão, e `openclaw models set` ou `/model` alterna por sessão.

Declare cada modelo que você planeja usar com sua janela de contexto e limites de token, porque um endpoint personalizado não tem catálogo para descrevê-los. Se a AIVAX rejeitar o parâmetro de raciocínio, adicione `compat: { supportsReasoningEffort: false }` ao modelo. Modelos renderizados como texto único durante o onboarding, como os nomes Kimi e DeepSeek, precisam de `input: ["text", "image"]` adicionado manualmente quando o modelo aceita imagens.

## Hermes Agent

O Hermes Agent usa `~/.hermes/config.yaml` como sua única fonte de verdade, com segredos em `~/.hermes/.env`:

```yaml
model:
  default: "@aivax-subscription/kimi-k3.1-pro"
  provider: custom
  base_url: https://inference.aivax.net/v1
  key_env: AIVAX_API_KEY
  context_length: 500000
```

Defina `AIVAX_API_KEY` em `~/.hermes/.env`. O comando `hermes model` escreve o mesmo bloco interativamente através de **Endpoint personalizado**.

A URL base mantém seu sufixo `/v1`, porque o Hermes chama um endpoint personalizado diretamente. O Hermes recusa iniciar com uma janela de contexto abaixo de 64.000 tokens, e não pode inferir a janela de um modelo desconhecido, então defina `context_length` explicitamente. `OPENAI_BASE_URL` não redireciona um provedor personalizado.

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

O Hermes envia `reasoning_effort: medium` por padrão em solicitações Chat Completions. Um endpoint que rejeita o nível retorna `400` sem uma redução silenciosa, então escolha o nível por modelo ou desative o campo com `supports_reasoning: false`.

## OpenBot

O OpenBot hospeda CLIs de codificação externas e alcança endpoints de terceiros através de seu provedor Custom, que executa em seu runtime OpenCode embutido. Adicione-o em **Configurações**, **Provedores**, depois **Provedor personalizado**:

```text
Nome do Provedor:  AIVAX
URL Base:       https://inference.aivax.net/v1
Chave de API:        <AIVAX_API_KEY>
Modelos:         @aivax-subscription/kimi-k3.1-pro
                @aivax-subscription/glm-5.3
Janela de contexto: 500000
Saída máxima:     32000
```

A chave é criptografada pelo aplicativo e não deve ser editada manualmente, então use o formulário em vez da cópia armazenada. Como o provedor roda no OpenCode, um projeto `opencode.json` que restringe `enabled_providers` ou `disabled_providers` pode ocultá-lo; verifique esse arquivo se o provedor não aparecer.

Cada turno envia as ferramentas do agente junto com um esforço de raciocínio, então o modelo por assinatura que você escolhe deve aceitar ambos sobre Chat Completions.

## ZCode

O ZCode adiciona provedores na interface do usuário: abra o seletor de modelos, escolha **Gerenciar Modelos**, depois **Adicionar Provedor**, e preencha o endpoint [OI].

```text
Nome do Provedor:      AIVAX
Endpoint [OI]:      https://inference.aivax.net/v1
Endpoint Anthropic: deixe vazio
Chave de API:            <AIVAX_API_KEY>
Modelos:             @aivax-subscription/kimi-k3.1-pro
                    @aivax-subscription/glm-5.3
```

Depois, abra as configurações **Avançadas** por modelo e defina a janela de contexto para 500000 e os tokens de saída máximos. O ZCode define um modelo desconhecido como padrão para 200.000 tokens e reconhece apenas a janela longa a partir de um sufixo no nome do modelo, o que os modelos por assinatura não possuem.

O ZCode não lê variáveis de ambiente do shell para configuração de modelos, então a chave deve ser inserida no formulário. Ele também envia um `reasoning_effort` de nível superior para endpoints [OI]-compatible; se um nível for rejeitado com `400`, escolha um menor. As configurações são armazenadas sob `~/.zcode/`, onde o arquivo de credenciais é criptografado por dispositivo.
