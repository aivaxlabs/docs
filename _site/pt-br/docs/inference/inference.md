Source: https://docs.aivax.net/pt-br/docs/inference/inference.html

# Inferência

A AIVAX expõe uma API `chat/completions` compatível com OpenAI, com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG (Recuperação de Ampliada por Geração), ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de modelos e metadados de faturamento.

Esta página abrange chamadas diretas de inferência. Use um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde o aplicativo controla o modelo, o prompt, as ferramentas e o contexto para cada solicitação.

Use um Gateway de IA quando o comportamento precisar ser estável, auditável e reutilizável. Os gateways são melhores para assistentes de suporte, chatbots, agentes de RAG, ferramentas permanentes, trabalhadores, habilidades e configurações compartilhadas por vários clientes.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também possui o alias de API `/api/v1/chat/completions`.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

## Solução de problemas de solicitações

A AIVAX utiliza dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta da AIVAX com um erro ou um valor `data` bem-sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou do gateway e remova parâmetros não suportados da solicitação. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada através da configuração do SDK. |
| `402 Payment Required` | Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e confirme que a conta está pronta para uma solicitação cobrável. |
| `403 Forbidden` | Confirme que o tipo de chave, o modelo ou o recurso selecionado permite esta operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o volume de solicitações. |
| `500 Internal Server Error` | Ocorreu uma falha inesperada na AIVAX. Tente novamente mais tarde; a resposta não inclui detalhes internos. |
| `503 Service Unavailable` | Um serviço do qual a AIVAX depende está temporariamente indisponível. Tente novamente após o intervalo indicado no cabeçalho `Retry-After`. |
| `524` ou tempo limite do proxy | A solicitação demorou mais do que o proxy permite enquanto a AIVAX ainda estava processando-a. Envie-a para o [host de inferência direta](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference) com um tempo limite do cliente mais longo. |

Se a solicitação ainda falhar, verifique nesta ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. A chave de API está disponível para seu processo e é uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada para isolar problemas de configuração.

## Roteamento de provedores

Alguns modelos integrados estão disponíveis por meio de mais de um provedor. O roteamento de provedores permite que a AIVAX escolha entre esses provedores sem alterar o modelo solicitado pelo seu aplicativo. Isso difere do roteamento de modelos, que pode selecionar um modelo diferente com base na complexidade da solicitação.

A AIVAX considera os provedores que estão atualmente disponíveis e compatíveis com a solicitação. Se apenas um provedor for elegível, a preferência de roteamento não alterará o resultado. O roteamento de provedores aplica-se apenas a modelos integrados da AIVAX; um gateway bring-your-own-key (traga sua própria chave) usa o endpoint do provedor configurado nesse gateway.

As preferências de roteamento disponíveis são:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Esta é a padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço aplicável de tokens de entrada e saída. |
| `Fastest` | Prioriza o provedor com a maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que a AIVAX classifica como mais alto em qualidade, sem otimizar para preço ou velocidade. |
| `Special` | Funciona como `Balanced`, mas também inclui [provedores especiais](#special-providers) e lhes dá prioridade. |

### Configurar roteamento em um Gateway de IA

Use um Gateway de IA quando o mesmo roteamento deve se aplicar a todas as solicitações. No editor do gateway, selecione um modelo integrado, escolha a estratégia em **Preferência de roteamento**, liste as tags dos provedores em ordem em **Provedores permitidos** e salve o gateway.

A configuração equivalente do gateway usa `parameters.routingOption` e `parameters.allowedProviders`:

```json
{
    "name": "Assistente otimizado por custo",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` segue as mesmas regras que `routing_options.allowed_providers` abaixo. Ele assume o valor padrão `["*"]`, e uma lista vazia é rejeitada ao salvar o gateway.

Após salvar, chame o gateway normalmente usando seu ID ou slug como `model`. A AIVAX aplica a preferência de roteamento armazenada, preservando as instruções do gateway, ferramentas, configuração de RAG e outras configurações. Consulte [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) para o fluxo completo do gateway.

### Substituir roteamento em `chat/completions`

Use `routing_options` para escolher como os provedores são selecionados para uma única solicitação. A substituição funciona com um modelo integrado direto ou um Gateway de IA que usa um modelo integrado:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Resuma este relatório de incidente."
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
| `preset` | Preferência de roteamento: `Balanced`, `Cheapest`, `Fastest`, `Quality` ou `Special`. Quando omitido, o `routingOption` salvo do gateway é usado. |
| `allowed_providers` | Lista ordenada de tags de provedor. A AIVAX tenta a primeira tag e passa para a próxima apenas quando nenhum provedor correspondente está disponível ou é compatível com a solicitação. `"*"` corresponde a qualquer provedor. Quando omitido, o `allowedProviders` salvo do gateway é usado, que assume o valor padrão `["*"]`. |

Dentro de cada etapa, `preset` escolhe entre os provedores correspondentes. Sem `"*"` no final, a solicitação falha quando nenhum dos provedores listados está disponível. Uma lista vazia de `allowed_providers` é rejeitada. A correspondência de tags não diferencia maiúsculas de minúsculas.

A tag de cada provedor é mostrada nos detalhes do provedor na página **Modelos** do painel, onde pode ser copiada, e retornada como `tag` na lista de provedores de `GET /v1/models`. Uma tag identifica um endpoint de provedor, incluindo sua região ou variante, quando existente, como `azure-us` ou `azure-eu`.

`GET /v1/models` aceita um parâmetro de consulta `filter` opcional com um nome de modelo, como `?filter=@openai/gpt-4o`. A resposta contém apenas entradas cujo nome seja igual a ele ou uma versão datada dele (um sufixo numérico final de pelo menos quatro dígitos), ordenadas da correspondência mais próxima, com a versão mais recente primeiro. Sem `filter`, a lista completa é retornada.

Os valores da solicitação substituem o roteamento salvo do gateway apenas para essa solicitação; eles não atualizam o gateway. Como `routing_options` é uma extensão da AIVAX, envie-o como um campo extra no corpo da solicitação ao usar um SDK compatível com OpenAI.

O campo anterior `routing_preset` está obsoleto, mas ainda é aceito. Substitua `"routing_preset": "Fastest"` por `"routing_options": { "preset": "Fastest" }`. Quando ambos são enviados, `routing_options.preset` tem precedência.

### Apenas provedores com retenção zero de dados

Ative **Apenas provedores com retenção zero de dados** nas configurações da conta no painel para rotear apenas a inferência de texto com modelos integrados para provedores que não retêm prompts. Provedores que não têm retenção zero de dados são excluídos antes que `allowed_providers` e `preset` sejam aplicados. Quando o modelo não tem nenhum provedor com retenção zero de dados disponível, a solicitação falha em vez de cair em outro provedor; escolha um modelo com um provedor de retenção zero de dados ou desative a opção.

A opção aplica-se apenas à inferência de texto. Ela não altera o registro de conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.

### Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os oferecem a preços descontados sob condições que podem ser menos transparentes do que as dos provedores regulares. Provedores especiais nunca são selecionados a menos que você opte por eles:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` | Nunca usados. |
| `Cheapest`, `Fastest`, `Quality` | Considerados apenas quando **Permitir provedores especiais** está habilitado nas configurações de privacidade da conta no painel. Está desabilitado por padrão. |
| `Special` | Sempre considerados e priorizados, independentemente da configuração da conta. |

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, solicitações que não os permitem falham. Use a preferência `Special`, ou habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced`. [Apenas provedores com retenção zero de dados](#zero-data-retention-providers-only) e `allowed_providers` ainda se aplicam aos provedores especiais.

### Provedor nas respostas

As respostas para modelos integrados incluem um campo `provider` ao lado de `model` com a tag do provedor que atendeu à solicitação. Nas respostas em streaming, cada chunk o inclui. O campo é `null` para gateways que usam suas próprias credenciais de provedor.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

Se um provedor falhar e a AIVAX tentar novamente a solicitação em outro provedor, `provider` refletirá o provedor que produziu a resposta.

## Entrada e multimodalidade

A AIVAX aceita partes de conteúdo de mensagem compatíveis com OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade, a menos que você peça à AIVAX para pré-processar a mídia em texto.

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Descreva brevemente estas entradas."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,<CONTEÚDO_PNG_BASE64>",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "<CONTEÚDO_WAV_BASE64>",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "documento.pdf",
                        "file_data": "data:application/pdf;base64,<CONTEÚDO_PDF_BASE64>"
                    }
                }
            ]
        }
    ]
}
```

Mapeamentos de partes de conteúdo suportados:

- `text`: Texto puro.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo suporta.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` são dados de áudio base64, e `input_audio.format` nomeia o formato.
- `file`: Conteúdo de arquivo. `file.filename` nomeia o arquivo, e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. O exemplo a seguir usa uma URL de dados base64; para vídeos grandes, prefira uma URL publicamente acessível:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Resuma as ações principais neste vídeo e identifique quaisquer riscos de segurança visíveis."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "data:video/mp4;base64,<CONTEÚDO_MP4_BASE64>"
                    }
                }
            ]
        }
    ]
}
```

Links externos devem ser acessíveis à AIVAX sem autenticação, restrições de firewall ou renderização apenas via JavaScript. A inferência pode falhar devido a downloads com falha, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor.

Para uma solicitação simples apenas de texto, você pode enviar `prompt` em vez de `messages`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Diga olá"
}
```

## Idempotência de solicitação

Defina `idempotency_key` quando sua integração precisar de chamadas repetidas para atualizar o mesmo registro de conversa armazenado, em vez de criar um novo token de conversa. A AIVAX usa esse valor para correlacionar o contexto do Gateway de IA e o registro de conversas.

```json
{
    "model": "seu-modelo-id-do-gateway",
    "messages": [
        {
            "role": "user",
            "content": "Resuma o pedido 123."
        }
    ],
    "idempotency_key": "resumo-pedido-123"
}
```

O valor deve ser uma string não vaziva com 128 caracteres ou menos. Quando omitido, a AIVAX gera automaticamente um token de conversa.

Para manter o estado da conversa em seu aplicativo e a configuração do gateway na AIVAX, consulte [migrando threads de Assistentes para Respostas](https://aivax.net/blog/migrating-from-openai-assistants-without-rebuilding-the-same-coupling/).

## Metadados de solicitação

Defina `metadata` para anexar informações de chave/valor de string à solicitação de inferência. A AIVAX armazena este objeto com a conversa registrada e o expõe aos eventos do gateway, sendo útil para correlação operacional, como um ID de pedido, inquilino, fluxo de trabalho ou chave de rastreamento interna.

```json
{
    "model": "seu-modelo-id-do-gateway",
    "messages": [
        {
            "role": "user",
            "content": "Resuma este ticket de suporte."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "triagem-suporte"
    }
}
```

`metadata` deve ser um objeto JSON cujos nomes de propriedade e valores são strings. Não coloque segredos, credenciais, dados de pagamento ou cargas úteis grandes neste campo.

## Resposta e registros de conversa

O envelope de resposta padrão `/v1/chat/completions` inclui `generation_context`. Suas entradas `generated_usage` contêm `sku`, `amount`, `unit_price`, `quantity` e `description`. Defina `json_only: true` para retornar apenas o JSON final sem este envelope.

Defina `allow_logging: false` em uma solicitação `/v1/chat/completions` para manter essa solicitação fora dos logs de conversa da conta. Ela assume o valor padrão `true`, e não pode habilitar o log quando o log de conversas está desabilitado para a conta. Registros de uso e faturamento ainda são criados.

Quando o log de conversas está habilitado, o registro armazenado inclui seu ID, origem, nome do modelo, ID da solicitação, esquema de resposta, esquemas de ferramentas e entrada de ferramentas, uso, recursos vinculados, carimbos de data/hora de criação e atualização, contagem de tokens, ID de usuário externo, mensagem de erro, mensagens e metadados. O contexto do gateway e da chave de API está disponível por meio dos recursos vinculados.

Use `idempotency_key` e `metadata` para correlacionar esses registros com seu próprio fluxo de trabalho.

## Pré-processamento multimodal

Use `multimodal_resolver` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos focados em texto ou quando você deseja que a AIVAX normalize os arquivos antes da inferência principal. O objeto escolhe um mecanismo para cada tipo de conteúdo; tipos omitidos ou `null` são enviados ao modelo principal inalterados.

```json
{
    "model": "@metaai/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Descreva este arquivo brevemente."
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "documento.pdf",
                        "file_data": "data:application/pdf;base64,<CONTEÚDO_PDF_BASE64>"
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

`Inference` é aceito como um alias de `InferenceLow`. Os mecanismos funcionam da seguinte maneira:

- `InferenceLow` descreve o conteúdo com um modelo multimodal menor e de menor custo.
- `InferenceHigh` descreve o conteúdo com um modelo multimodal maior, mais preciso e mais caro.
- `Ocr` extrai o texto de imagens e arquivos com o mesmo serviço de extração do [Buscar e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), cobrado em Unidades de Processamento. Aceita URIs de dados base64 e URLs públicas.
- `Stt` transcreve a fala no áudio com o modelo padrão de [fala para texto](https://docs.aivax.net/pt-br/docs/pricing.md) e é cobrado por segundo de áudio. Música e sons ambientes não são descritos.

Com `InferenceLow` ou `InferenceHigh`, `fileEngine` envia PDFs para o modelo multimodal e converte outros tipos de arquivo com OCR. Com `Ocr`, todo arquivo, incluindo PDFs, é convertido com OCR.

Os resultados são armazenados em cache por conteúdo e mecanismo para reutilização, portanto, a mesma mídia resolvida com o mesmo mecanismo não é cobrada novamente. Alterar o mecanismo processa e cobra o conteúdo novamente.

### `multimodal_preprocess` obsoleto

As flags `multimodal_preprocess` permanecem aceitas por compatibilidade, mas estão obsoletas. Use `multimodal_resolver` em vez disso; quando ambas são enviadas, `multimodal_resolver` é usado. As flags mapeiam para os novos mecanismos da seguinte forma:

| Flag legada | Equivalente |
| --- | --- |
| `Image` | `imageEngine: "InferenceLow"` |
| `Audio` | `audioEngine: "InferenceLow"` |
| `Video` | `videoEngine: "InferenceLow"` |
| `File` | `fileEngine: "InferenceLow"` |
| `OtherFiles` | `fileEngine: "Ocr"` |
| `All` | Todos os acima, com `fileEngine: "InferenceLow"` |

Como um mecanismo agora cobre todos os tipos de arquivo, `OtherFiles` sozinho também converte PDFs com OCR, e `File` sozinho também converte arquivos não-PDF com OCR. Anteriormente, os tipos de arquivo fora da flag selecionada eram enviados ao modelo principal inalterados.

Entradas multimodais podem ter requisitos da conta. Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de usá-las em produção.

Quando uma inferência multimodal falha, reduza o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um anexo pequeno.
3. Teste o mesmo anexo com `multimodal_resolver`.
4. Revise a URL, o formato, o tamanho e o suporte de modalidade do modelo.

## Respostas estruturadas

Use respostas estruturadas quando seu aplicativo precisar de uma saída JSON que corresponda a um esquema. A AIVAX suporta elas por meio de `response_schema`, `response_format` e `json_only`.

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Procure notícias recentes sobre veículos elétricos.",
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
                            "description": "Título da notícia"
                        },
                        "summary": {
                            "type": "string",
                            "description": "Resumo da notícia"
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

`response_schema` habilita o Curativo de JSON. A AIVAX pede ao modelo o JSON, extrai o JSON do texto gerado ou blocos de markdown, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja atingido.

Leia mais em [Respostas estruturadas](https://docs.aivax.net/pt-br/docs/inference/structured-responses.md).

Se seu aplicativo não puder analisar ou validar o resultado, siga o [guia de solução de problemas de JSON inválido](https://aivax.net/blog/structured-output-healing-boundary/) antes de aumentar o orçamento de retry.

## Ferramentas integradas sob demanda

Use `builtin_tools` para habilitar [ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) da AIVAX para uma solicitação direta, sem criar um gateway:

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Procure notícias recentes sobre veículos elétricos.",
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

As ferramentas integradas incluem `DateTime`, `WebSearch`, `AdvancedWebUsage` (desabilitado; retorna uma resposta indisponível; consulte [Changelogs](https://docs.aivax.net/pt-br/docs/legal/changelogs.md)), `OpenUrl`, `Code`, `Request`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch` e `ImageGeneration`.

`DateTime` expõe `get_date_time`, uma ferramenta sem argumentos que retorna a data atual, hora, dia da semana em inglês, fuso horário, deslocamento UTC e timestamp ISO 8601. Ele usa o fuso horário do gateway (padrão `America/Sao_Paulo`); envie `time_zone` com um identificador IANA para substituí-lo para uma única solicitação. Esta configuração é independente do fuso horário do navegador do usuário. Consulte [Data e Hora Atuais](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time) para exemplos de configuração e saída.

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se o mesmo aplicativo sempre usa as mesmas ferramentas, prefira configurá-las em um Gateway de IA para que a política seja centralizada.

### Corpo de solicitação do provedor personalizado

Use `extra_body` para enviar opções específicas do provedor. Quando um gateway usa sua própria chave de API do provedor e um endpoint de provedor compatível com OpenAI, `extra_body` mescla JSON personalizado no corpo da solicitação do provedor:

```json
{
    "model": "meu-modelo-customizado:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explique a compensação."
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

Os parâmetros de raciocínio diferem por provedor e modelo. Consulte [como definir o esforço de raciocínio entre provedores](https://aivax.net/blog/reasoning-is-a-protocol-not-just-a-model-setting/) antes de escolher opções específicas do provedor.

## Explicações de ferramentas

Use explicações de ferramentas quando seu cliente mostrar aos usuários por que uma ferramenta do lado do servidor está em execução. Defina `tool_invocation_explanations: true` para pedir à AIVAX que inclua campos de explicação nos argumentos de ferramentas do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "Qual é a previsão do tempo para hoje?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Exemplo de evento de stream:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"previsão do tempo hoje\",\"_tool_reason\":\"Pesquisando a previsão do tempo de hoje online\",\"_tool_goal\":\"Preciso de informações meteorológicas atuais para responder com precisão.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Pesquisando a previsão do tempo de hoje online",
            "goal": "Preciso de informações meteorológicas atuais para responder com precisão."
        }
    },
    "usage": null
}
```

## Modo de renderização de resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que a AIVAX coloque o raciocínio e a atividade de ferramentas do lado do servidor no mesmo fluxo de resposta textual que a interface de chat já renderiza. Isso é útil para clientes que constroem uma única linha do tempo de resposta e querem transformar o raciocínio e a atividade de ferramentas em componentes visíveis, sem manter caminhos de manipulação de eventos separados para cada tipo de marcador.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Procure atualizações recentes de produtos e resuma as mudanças importantes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado para o assistente pode ser emitido como blocos `<assistant-answer>`, e os marcadores de ferramentas do lado do servidor podem aparecer como elementos de resultado da ferramenta, como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do stream de resposta: analise-os em componentes de linha do tempo de chat, seções de raciocínio colapsáveis, fragmentos de resposta do assistente ou linhas de status da ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não entendem esta marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega por meio de `delta.reasoning`, e a atividade de ferramentas do lado do servidor chega por meio de eventos `servertool`. Preserve a ordem em que os eventos de stream chegam para que o raciocínio, a atividade da ferramenta, o conteúdo parcial e a resposta final permaneçam na mesma linha do tempo de resposta.

### Exemplo bruto de múltiplas rodadas

O exemplo abaixo mostra a forma de uma resposta em streaming quando o raciocínio do lado do servidor é visível para o cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo de resposta textual. Os atributos exatos do resultado da ferramenta podem variar conforme o renderer, mas o comportamento importante é a ordem: raciocínio, fragmentos de resposta do assistente, atividade da ferramenta, mais raciocínio e a resposta final podem pertencer à mesma rodada do assistente.

```json
{
    "model": "meu-modelo-customizado:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmeras de segurança?"
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

Linha do tempo do assistente em streaming bruto:

```text
<thinking-group>
<think>
O usuário está pedindo modelos multimodais baratos e rápidos para análise de câmeras de segurança.
Devo listar os modelos disponíveis da AIVAX e pesquisar a documentação antes de recomendar opções.
</think>
</thinking-group>

<assistant-answer>
Vou verificar os modelos multimodais disponíveis e identificar as melhores opções para análise de câmeras de segurança.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listando os modelos disponíveis na AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Pesquisando documentação sobre modelos multimodais e análise de imagens na AIVAX</span></div>

<think>
Os modelos relevantes devem suportar VideoInput ou ImageInput, ter baixo custo de entrada e ser rápidos o suficiente para fluxos de trabalho de câmera.
Encontrei vários candidatos e devo classificá-los por custo, velocidade e suporte de modalidade.
</think>
</thinking-group>

<assistant-answer>
Para análise de câmeras de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.

A disponibilidade e os preços dos modelos mudam com o tempo; as escolhas abaixo são uma saída de exemplo — consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para valores atuais.

Principais escolhas:

1. @google/gemini-3.5-flash-lite: rápido, econômico e suporta vídeo.
2. @qwen/qwen3.5-9b: baixo custo de entrada nesta saída de exemplo com suporte a vídeo.
3. @amazon/nova-lite: baixo custo de entrada e grande janela de contexto.

Use VideoInput para clipes quando possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá-los.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível do assistente para o usuário. Armazene o raciocínio e os detalhes da ferramenta como metadados de linha do tempo ou auditoria se seu produto precisar deles, mas não os transforme em uma nova mensagem do usuário. A mensagem do assistente deve usar o conteúdo do bloco `<assistant-answer>` final, não a transcrição completa do raciocínio.

```json
{
    "model": "meu-modelo-customizado:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmeras de segurança?"
        },
        {
            "role": "assistant",
            "content": "Para análise de câmeras de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.\n\nA disponibilidade e os preços dos modelos mudam com o tempo; as escolhas abaixo são uma saída de exemplo — consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para valores atuais.\n\nPrincipais escolhas:\n\n1. @google/gemini-3.5-flash-lite: rápido, econômico e suporta vídeo.\n2. @qwen/qwen3.5-9b: baixo custo de entrada nesta saída de exemplo com suporte a vídeo.\n3. @amazon/nova-lite: baixo custo de entrada e grande janela de contexto.\n\nUse VideoInput para clipes quando possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá-los."
        },
        {
            "role": "user",
            "content": "Agora recomende um modelo para alertas em tempo real e um para revisão mais profunda."
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

### Orientações de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode "falar" enquanto raciocina, emitindo atualizações de processo visíveis ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem estar intercaladas com blocos de raciocínio, chamadas de ferramentas e conteúdo de resposta parcial conforme a resposta se desenvolve.

Uma vez que a resposta final do assistente é gerada, essa resposta se torna o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas geralmente deixa de ser o objetivo principal do usuário. Colapse ou minimize o raciocínio por padrão após a conclusão para que a resposta final receça o maior destaque visual, mantendo o processo disponível para usuários que desejam inspecioná-lo.

Use divulgação progressiva ao redor desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, tornando-se depois um elemento secundário mais discreto após o aparecimento da resposta final. A atividade da ferramenta deve ser lida como status, não como fala: use rótulos concisos como "Pesquisando", "Abrindo fonte", "Executando ferramenta", "Concluído" ou "Falhou", e mantenha cada invocação de ferramenta agrupada como um único item de linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior proeminência, tipografia normal de leitura, parte da conversa principal.
- Raciocínio em andamento: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor proeminência, cor ou container mais suave, colapsado ou minimizado por padrão.
- Blocos de ferramenta: linhas de status compactas com estados claros de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja uma superfície de desenvolvedor, auditoria ou depuração.

Evite expor internals barulhentos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de fonte ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, cargas úteis grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja construída para inspeção técnica.

Para acessibilidade, faça cada bloco colapsável alternável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas da cor para o estado e mantenha o movimento sutil. Uma resposta em streaming deve parecer estável enquanto atualiza: novas linhas de raciocínio ou ferramenta podem aparecer em ordem, mas o conteúdo existente não deve pular ou forçar o usuário a perder sua posição de leitura.

## Preços

As taxas de inferência dependem do modelo selecionado, do provedor, do tamanho da entrada e do tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo o uso de entrada, entrada em cache e saída; seu preço em PU varia com o modelo e o provedor usados. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) aplica-se à inferência de modelos integrados e à moderação. BYOK (Bring Your Own Key) não é afetado por ele.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e Gateway de IA | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da cobrança principal de inferência |

Uma PU de moderação equivale a um token de saída do modelo de moderação, e os tokens de entrada contam proporcionalmente ao seu preço. Por exemplo, com um modelo precificado em $0,10/M de tokens de entrada e $0,40/M de tokens de saída, uma verificação usando 3.000 tokens de entrada e 50 tokens de saída consome 800 PUs (3.000 × 0,25 + 50), cerca de $0,00032 antes do multiplicador de plano.
