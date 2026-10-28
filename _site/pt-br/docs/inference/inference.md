Source: https://docs.aivax.net/pt-br/docs/inference/inference.html

# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré‑processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas de inferência diretas. Use [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também tem o alias de API `/api/v1/chat/completions`.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

## Solucionar solicitações

AIVAX usa dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta AIVAX com um erro ou um valor `data` bem‑sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou gateway e remova parâmetros não suportados da solicitação. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada via configuração do SDK. |
| `402 Payment Required` | Revise [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e confirme que a conta está pronta para uma solicitação paga. |
| `403 Forbidden` | Confirme que o tipo de chave, modelo ou recurso selecionado permite esta operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o volume de solicitações. |
| `500 Internal Server Error` | Ocorreu uma falha inesperada da AIVAX. Tente novamente mais tarde; a resposta não inclui detalhes internos. |
| `503 Service Unavailable` | Um serviço do qual a AIVAX depende está temporariamente indisponível. Tente novamente após o intervalo indicado no cabeçalho `Retry-After`. |
| `524` ou timeout de proxy | A solicitação levou mais tempo que o proxy permite enquanto a AIVAX ainda a processava. Envie-a ao [direct inference host](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference) com um timeout de cliente maior. |

Se a solicitação ainda falhar, verifique na seguinte ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. A chave de API está disponível para seu processo e é uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada para que você possa isolar problemas de configuração.

## Roteamento de provedor

Alguns modelos integrados estão disponíveis através de mais de um provedor. O roteamento de provedor permite que a AIVAX escolha entre esses provedores sem mudar o modelo solicitado pela sua aplicação. Isso difere do roteamento de modelo, que pode selecionar um modelo diferente com base na complexidade da solicitação.

A AIVAX considera provedores que estão atualmente disponíveis e compatíveis com a solicitação. Se apenas um provedor for elegível, a preferência de roteamento não altera o resultado. O roteamento de provedor aplica‑se apenas a modelos integrados da AIVAX; um gateway “traga‑seu‑próprio‑provedor” usa o endpoint do provedor configurado nesse gateway.

Preferências de roteamento disponíveis:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Esta é a padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço aplicável de tokens de entrada e saída. |
| `Fastest` | Prioriza o provedor com maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que a AIVAX classifica como de maior qualidade, sem otimizar preço ou velocidade. |

### Configurar roteamento em um AI Gateway

Use um AI Gateway quando o mesmo roteamento deve ser aplicado a cada solicitação. No editor do gateway, selecione um modelo integrado, escolha a estratégia em **Routing preference**, liste as tags de provedor em ordem em **Allowed providers** e salve o gateway.

A configuração equivalente de gateway usa `parameters.routingOption` e `parameters.allowedProviders`:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` segue as mesmas regras de `routing_options.allowed_providers` abaixo. O padrão é `["*"]`, e uma lista vazia é rejeitada ao salvar o gateway.

Após salvar, chame o gateway normalmente usando seu ID ou slug como `model`. A AIVAX aplica a preferência de roteamento armazenada enquanto preserva as instruções, ferramentas, configuração RAG e outras definições do gateway. Consulte [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) para o fluxo completo do gateway.

### Substituir roteamento em `chat/completions`

Use `routing_options` para escolher como os provedores são selecionados para uma solicitação. A substituição funciona com um modelo integrado direto ou um AI Gateway que usa um modelo integrado:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ],
    "routing_options": {
        "preset": "Balanced",
        "allowed_providers": [
            "azure-us",
            "azure-eu",
            "*"
        ]
    }
}
```

| Campo | Descrição |
|---|---|
| `preset` | Preferência de roteamento: `Balanced`, `Cheapest`, `Fastest` ou `Quality`. Quando omitido, a `routingOption` salva no gateway é usada. |
| `allowed_providers` | Lista ordenada de tags de provedor. A AIVAX tenta a primeira tag e passa para a próxima somente quando nenhum provedor correspondente está disponível ou compatível com a solicitação. `"*"` corresponde a qualquer provedor. Quando omitido, a `allowedProviders` salva no gateway é usada, cujo padrão é `["*"]`. |

Em cada etapa, `preset` escolhe entre os provedores correspondentes. Sem `"*"` ao final, a solicitação falha quando nenhum dos provedores listados está disponível. Uma lista vazia de `allowed_providers` é rejeitada. A correspondência de tags não diferencia maiúsculas de minúsculas.

Cada tag de provedor é mostrada nos detalhes do provedor na página de painel **Models**, onde pode ser copiada e retornada como `tag` na lista de provedores de `GET /v1/models`. Uma tag identifica um endpoint de provedor, incluindo sua região ou variante quando existente, como `azure-us` ou `azure-eu`.

`GET /v1/models` aceita um parâmetro de consulta opcional `filter` com um nome de modelo, como `?filter=@openai/gpt-4o`. A resposta então contém apenas entradas cujo nome é igual a ele ou é um snapshot datado dele (um sufixo numérico de pelo menos quatro dígitos), ordenado do mais próximo, com o snapshot mais recente primeiro. Sem `filter`, a lista completa é retornada.

Os valores de solicitação substituem o roteamento salvo do gateway apenas para aquela solicitação; eles não atualizam o gateway. Como `routing_options` é uma extensão da AIVAX, envie‑o como um campo extra no corpo da solicitação ao usar um SDK compatível com OpenAI.

O campo `routing_preset` anterior está depreciado mas ainda é aceito. Substitua `"routing_preset": "Fastest"` por `"routing_options": { "preset": "Fastest" }`. Quando ambos são enviados, `routing_options.preset` tem precedência.

### Apenas provedores com retenção zero de dados

Habilite **Zero data retention providers only** nas configurações de conta do painel para rotear inferência de texto com modelos integrados somente para provedores que não retêm prompts. Provedores que não são de retenção zero são excluídos antes de aplicar `allowed_providers` e `preset`. Quando o modelo não tem provedor de retenção zero disponível, a solicitação falha em vez de recuar para outro provedor; escolha um modelo com provedor de retenção zero ou desative a opção.

A opção aplica‑se apenas à inferência de texto. Não altera o registro de conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.

### Provedor nas respostas

Respostas para modelos integrados incluem um campo `provider` ao lado de `model` com a tag do provedor que atendeu à solicitação. Em respostas em streaming, cada chunk o inclui. O campo é `null` para gateways que usam suas próprias credenciais de provedor.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

Se um provedor falhar e a AIVAX reenviar a solicitação para outro provedor, `provider` reflete o provedor que produziu a resposta.

## Entrada e multimodalidade

AIVAX aceita partes de conteúdo de mensagem compatíveis com OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade a menos que você peça à AIVAX para pré‑processar a mídia em texto.

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe these inputs briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,<BASE64_PNG_CONTENT>",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "base64-encoded-audio",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,<BASE64_PDF_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

Mapeamentos de partes de conteúdo suportadas:

- `text`: Texto simples.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo suporta.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` é áudio em base64, e `input_audio.format` indica o formato.
- `file`: Conteúdo de arquivo. `file.filename` nomeia o arquivo, e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. O exemplo abaixo usa uma URL de dados base64; prefira uma URL publicamente acessível para vídeos grandes:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the main actions in this video and identify any visible safety risks."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "data:video/mp4;base64,<BASE64_MP4_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

Links externos devem ser acessíveis à AIVAX sem autenticação, restrições de firewall ou renderização apenas em JavaScript. Falhas de download, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos de provedor podem fazer a inferência falhar.

Você também pode enviar uma solicitação de texto simples com `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Idempotência da solicitação

Defina `idempotency_key` quando sua integração precisar de chamadas repetidas para atualizar o mesmo registro de conversa armazenado em vez de criar um novo token de conversa. A AIVAX usa esse valor para correlacionar o contexto do AI Gateway e o registro de conversas.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize order 123."
        }
    ],
    "idempotency_key": "order-123-summary"
}
```

O valor deve ser uma string não vazia com no máximo 128 caracteres. Quando omitido, a AIVAX gera um token de conversa automaticamente.

Para manter o estado da conversa em sua aplicação e a configuração do gateway na AIVAX, veja [migrating Assistants threads to Responses](https://aivax.net/blog/migrating-from-openai-assistants-without-rebuilding-the-same-coupling/).

## Metadados da solicitação

Defina `metadata` para anexar informações de chave/valor string à solicitação de inferência. A AIVAX armazena esse objeto com a conversa registrada e o expõe a eventos do gateway, sendo útil para correlação operacional como ID de pedido, locatário, fluxo de trabalho ou chave de rastreamento interno.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` deve ser um objeto JSON cujos nomes de propriedade e valores são strings. Não coloque segredos, credenciais, dados de pagamento ou payloads grandes neste campo.

## Resposta e registros de conversa

O envelope de resposta padrão `/v1/chat/completions` inclui `generation_context`. Suas entradas `generated_usage` contêm `sku`, `amount`, `unit_price`, `quantity` e `description`. Defina `json_only: true` para retornar apenas o JSON final sem esse envelope.

Defina `allow_logging: false` em uma solicitação `/v1/chat/completions` para manter essa solicitação fora dos registros de conversa da conta. O padrão é `true`, e não pode habilitar o registro quando o registro de conversa está desativado para a conta. Registros de uso e faturamento ainda são criados.

Quando o registro de conversa está habilitado, o registro armazenado inclui seu ID, origem, nome do modelo, ID da solicitação, esquema de resposta, ferramentas e esquemas de entrada de ferramentas, uso, recursos vinculados, timestamps de criação e atualização, contagem de tokens, ID de usuário externo, mensagem de erro, mensagens e metadados. O contexto de gateway e chave de API está disponível através dos recursos vinculados.

Use `idempotency_key` e `metadata` para correlacionar esses registros com seu próprio fluxo de trabalho.

## Pré‑processamento multimodal

Use `multimodal_resolver` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos orientados a texto ou quando você deseja que a AIVAX normalize arquivos antes da inferência principal. O objeto escolhe um mecanismo para cada tipo de conteúdo; tipos omitidos ou `null` são enviados ao modelo principal sem alterações.

```json
{
    "model": "@metaai/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe this file briefly."
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,BASE64_PDF_CONTENT"
                    }
                }
            ]
        }
    ],
    "multimodal_resolver": {
        "imageEngine": "InferenceLow",
        "audioEngine": "Stt",
        "fileEngine": "InferenceHigh"
    }
}
```

| Campo | Mecanismos aceitos |
| --- | --- |
| `imageEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |
| `audioEngine` | `InferenceLow`, `InferenceHigh`, `Stt` |
| `videoEngine` | `InferenceLow`, `InferenceHigh` |
| `fileEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |

`Inference` é aceito como alias de `InferenceLow`. Os mecanismos funcionam da seguinte forma:

- `InferenceLow` descreve o conteúdo com um modelo multimodal menor e de menor custo.
- `InferenceHigh` descreve o conteúdo com um modelo multimodal maior, mais preciso e mais caro.
- `Ocr` extrai o texto de imagens e arquivos com o mesmo serviço de extração de [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), cobrado em Unidades de Processamento. Aceita URIs de dados base64 e URLs públicas.
- `Stt` transcreve a fala do áudio com o modelo padrão de [speech‑to‑text](https://docs.aivax.net/pt-br/docs/pricing.md) e é cobrado por segundo de áudio. Música e sons ambientes não são descritos.

Com `InferenceLow` ou `InferenceHigh`, `fileEngine` envia PDFs ao modelo multimodal e converte outros tipos de arquivo com OCR. Com `Ocr`, todo arquivo, incluindo PDFs, é convertido com OCR.

Os resultados são armazenados em cache por conteúdo e mecanismo para reutilização, de modo que a mesma mídia resolvida com o mesmo mecanismo não seja cobrada novamente. Alterar o mecanismo processa e cobra o conteúdo novamente.

### `multimodal_preprocess` depreciado

Os sinalizadores `multimodal_preprocess` permanecem aceitos por compatibilidade, mas estão depreciados. Use `multimodal_resolver` em vez disso; quando ambos são enviados, `multimodal_resolver` tem precedência. Os sinalizadores são mapeados para os novos mecanismos da seguinte forma:

| Sinalizador legado | Equivalente |
| --- | --- |
| `Image` | `imageEngine: "InferenceLow"` |
| `Audio` | `audioEngine: "InferenceLow"` |
| `Video` | `videoEngine: "InferenceLow"` |
| `File` | `fileEngine: "InferenceLow"` |
| `OtherFiles` | `fileEngine: "Ocr"` |
| `All` | Todos os anteriores, com `fileEngine: "InferenceLow"` |

Como um mecanismo agora cobre todos os tipos de arquivo, `OtherFiles` sozinho também converte PDFs com OCR, e `File` sozinho também converte arquivos não‑PDF com OCR. Anteriormente, os tipos de arquivo fora do sinalizador selecionado eram enviados ao modelo principal sem alterações.

Entradas multimodais podem ter requisitos de conta. Revise [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) antes de usá‑las em produção.

Quando uma inferência multimodal falha, restrinja o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um anexo pequeno.
3. Teste o mesmo anexo com `multimodal_resolver`.
4. Revise a URL, formato, tamanho e suporte de modalidade do modelo.

## Respostas estruturadas

A AIVAX suporta respostas estruturadas através de `response_schema`, `response_format` e `json_only`.

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "news": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "News title"
                        },
                        "summary": {
                            "type": "string",
                            "description": "News summary"
                        }
                    },
                    "required": ["title", "summary"]
                }
            }
        },
        "required": ["news"]
    }
}
```

`response_schema` habilita o JSON Healing. A AIVAX pede ao modelo JSON, extrai JSON do texto ou blocos markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja atingido.

Leia mais sobre [Structured responses](https://docs.aivax.net/pt-br/docs/inference/structured-responses.md).

Se sua aplicação não conseguir analisar ou validar o resultado, siga o [guia de solução de problemas de JSON inválido](https://aivax.net/blog/structured-output-healing-boundary/) antes de aumentar o orçamento de tentativas.

## Funções sob demanda

Use `builtin_tools` para habilitar ferramentas integradas da AIVAX em uma solicitação direta sem criar um gateway:

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

Ferramentas integradas incluem `DateTime`, `WebSearch`, `AdvancedWebUsage` (desativada; retorna resposta indisponível; veja [Changelogs](https://docs.aivax.net/pt-br/docs/legal/changelogs.md)), `OpenUrl`, `Code`, `Request`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch` e `ImageGeneration`.

`DateTime` expõe `get_date_time`, uma ferramenta sem argumentos que retorna a data atual, hora, dia da semana em inglês, fuso horário, deslocamento UTC e timestamp ISO 8601. Usa o fuso horário do gateway (padrão `America/Sao_Paulo`); envie `time_zone` com um identificador IANA para sobrescrev‑lo em uma solicitação. Essa configuração é independente do fuso horário do navegador do usuário. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time) para exemplos de configuração e saída.

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se a mesma aplicação sempre usa as mesmas ferramentas, prefira configurá‑las em um AI Gateway para que a política seja centralizada.

## Corpo de solicitação de provedor customizado

Quando um gateway usa uma chave de API fornecida e um endpoint de provedor compatível com OpenAI, `extra_body` pode mesclar JSON customizado ao corpo da solicitação do provedor:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` não é permitido com modelos integrados da AIVAX.

Parâmetros de raciocínio diferem por provedor e modelo. Consulte [how to set reasoning effort across providers](https://aivax.net/blog/reasoning-is-a-protocol-not-just-a-model-setting/) antes de escolher opções específicas de provedor.

## Explicações de ferramentas

Defina `tool_invocation_explanations: true` para solicitar que a AIVAX inclua campos de explicação nos argumentos de ferramenta do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather forecast for today?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Exemplo de evento de streaming:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"weather forecast today\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to answer accurately.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Searching for today's weather forecast online",
            "goal": "I need current weather information to answer accurately."
        }
    },
    "usage": null
}
```

## Modo de renderização da resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que a AIVAX coloque raciocínio e atividade de ferramenta do lado do servidor no mesmo fluxo textual de resposta que a UI de chat já renderiza. Isso é útil para clientes que constroem uma única linha do tempo de resposta e desejam transformar raciocínio e atividade de ferramenta em componentes visíveis sem manter caminhos de tratamento de eventos separados para cada tipo de marcador.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Search for recent product updates and summarize the important changes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado ao assistente pode ser emitido como blocos `<assistant-answer>` e marcadores de ferramenta do lado do servidor podem aparecer como elementos de resultado de ferramenta como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do fluxo de resposta: analise‑os em componentes da linha do tempo de chat, seções colapsáveis de raciocínio, fragmentos de resposta do assistente ou linhas de status de ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não compreendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega via `delta.reasoning`, e a atividade de ferramenta do lado do servidor chega via eventos `servertool`. Preserve a ordem em que os eventos de stream chegam para que raciocínio, atividade de ferramenta, conteúdo parcial e a resposta final permaneçam na mesma linha do tempo.

### Exemplo bruto de múltiplas interações

O exemplo abaixo mostra a forma de uma resposta em stream quando o raciocínio do lado do servidor está visível ao cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo textual. Os atributos exatos do resultado da ferramenta podem variar conforme o renderizador, mas o comportamento importante é a ordenação: raciocínio, fragmentos de resposta do assistente, atividade de ferramenta, mais raciocínio e a resposta final podem pertencer ao mesmo turno do assistente.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Linha do tempo do assistente em stream bruto:

```text
<thinking-group>
<think>
The user is asking for cheap, fast multimodal models for security camera analysis.
I should list available AIVAX models and search the documentation before recommending options.
</think>
</thinking-group>

<assistant-answer>
I will check the available multimodal models and identify the best options for security camera analysis.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listing the available models in AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Searching documentation about multimodal models and image analysis in AIVAX</span></div>

<think>
The relevant models should support VideoInput or ImageInput, have low input cost, and be fast enough for camera workflows.
I found several candidates and should rank them by cost, speed, and modality support.
</think>
</thinking-group>

<assistant-answer>
For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.

Model availability and prices change over time; the picks below are example output — see [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) for current values.

Top picks:

1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.
2. @qwen/qwen3.5-9b: low input cost in this example output with video support.
3. @amazon/nova-lite: low input cost and a large context window.

Use VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível ao usuário. Armazene o raciocínio e detalhes da ferramenta como metadados de linha do tempo ou auditoria se seu produto precisar, mas não os transforme em uma nova mensagem do usuário. A mensagem do assistente deve usar o conteúdo do bloco final `<assistant-answer>`, não a transcrição completa do raciocínio.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        },
        {
            "role": "assistant",
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nModel availability and prices change over time; the picks below are example output — see [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) for current values.\n\nTop picks:\n\n1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: low input cost in this example output with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
        },
        {
            "role": "user",
            "content": "Now recommend one model for real-time alerts and one for deeper review."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

### Diretrizes de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode “falar” enquanto raciocina emitindo atualizações de processo voltadas ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramenta e conteúdo parcial da resposta à medida que a resposta se desenvolve.

Quando a resposta final do assistente é gerada, essa resposta se torna o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas normalmente deixa de ser o objetivo principal do usuário. Colapse ou minimize o raciocínio por padrão após a conclusão para que a resposta final receba a maior  visual, mantendo o processo disponível para usuários que desejam inspecioná‑lo.

Use divulgação progressiva ao longo desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, depois tornar‑se um elemento secundário mais discreto após a aparição da resposta final. A atividade de ferramenta deve ser lida como status, não como fala: use rótulos concisos como “Searching”, “Opening source”, “Running tool”, “Finished” ou “Failed”, e mantenha cada invocação de ferramenta agrupada como um item da linha do tempo mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior destaque, tipografia de leitura normal, parte da conversa principal.
- Raciocínio em progresso: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor destaque, cor ou contêiner atenuado, colapsado ou minimizado por padrão.
- Blocos de ferramenta: linhas de status compactas com indicadores claros de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja um desenvolvedor, auditor ou superfície de depuração.

Evite expor ruídos internos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, payloads grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja projetada para inspeção técnica.

Para acessibilidade, torne cada bloco colapsado acionável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas de cor para estado e mantenha o movimento sutil. Uma resposta em streaming deve parecer estável enquanto atualiza: novos raciocínios ou linhas de ferramenta podem aparecer em ordem, mas o conteúdo existente não deve pular nem forçar o usuário a perder a posição de leitura.

## Preços

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo entrada, entrada em cache e uso de saída; seu preço de PU varia com o modelo e provedor usados. O [plan multiplier](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) aplica‑se à inferência de modelo integrado e à moderação. BYOK não é afetado por ele.

| Descrição | Preço |
| --- | --- |
| Inferência de modelo de IA e AI Gateway | Tarifas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da cobrança principal de inferência |

Um PU de moderação equivale a um token de saída do modelo de moderação, e tokens de entrada contam proporcionalmente ao seu preço. Por exemplo, com um modelo cotado a $0,10/M de entrada e $0,40/M de saída, uma verificação usando 3.000 tokens de entrada e 50 de saída consome 800 PUs (3.000 × 0,25 + 50), cerca de $0,00032 antes do multiplicador de plano.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, prompt, ferramentas e contexto para cada solicitação.

Use um AI Gateway quando o comportamento precisar ser estável, auditável e reutilizável. Gateways são melhores para assistentes de suporte, chatbots, agentes RAG, ferramentas permanentes, workers, skills e configurações compartilhadas por múltiplos clientes.
