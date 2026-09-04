# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas diretas de inferência. Use [AI Gateway](/docs/pt-br/inference/ai-gateway) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também tem o alias de API `/api/v1/chat/completions`.

## Roteamento de provedor

Alguns modelos integrados estão disponíveis por mais de um provedor. O roteamento de provedor permite que a AIVAX escolha entre esses provedores sem alterar o modelo solicitado pela sua aplicação. Isso difere do roteamento de modelo, que pode selecionar um modelo diferente com base na complexidade da requisição.

A AIVAX considera provedores que estão atualmente disponíveis e compatíveis com a requisição. Se apenas um provedor for elegível, a preferência de roteamento não altera o resultado. O roteamento de provedor aplica‑se apenas a modelos integrados da AIVAX; um gateway “traga‑seu‑próprio‑chave” usa o endpoint do provedor configurado nesse gateway.

Preferências de roteamento disponíveis:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Este é o padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço de token de entrada e saída aplicável. |
| `Fastest` | Prioriza o provedor com a maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que a AIVAX classifica como o de maior qualidade, sem otimizar por preço ou velocidade. |

### Configurar roteamento em um AI Gateway

Use um AI Gateway quando a mesma preferência de roteamento deve ser aplicada a cada requisição. No editor do gateway, selecione um modelo integrado, abra **Routing preference**, escolha a estratégia preferida e salve o gateway.

A configuração equivalente do gateway usa `parameters.routingOption`:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest"
    }
}
```

Depois de salvar, chame o gateway normalmente usando seu ID ou slug como `model`. A AIVAX aplica a preferência de roteamento armazenada preservando as instruções, ferramentas, configuração RAG e outras definições do gateway. Consulte [AI Gateway](/docs/pt-br/inference/ai-gateway) para o fluxo completo do gateway.

### Substituir roteamento em `chat/completions`

Use `routing_preset` para escolher uma estratégia de provedor para uma única requisição. A sobrescrita funciona com um modelo integrado direto ou um AI Gateway que usa um modelo integrado:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ],
    "routing_preset": "Fastest"
}
```

Os valores aceitos são `Balanced`, `Cheapest`, `Fastest` e `Quality`. O valor da requisição sobrescreve o `routingOption` salvo no gateway apenas para essa requisição; não atualiza o gateway. Como `routing_preset` é uma extensão da AIVAX, envie‑o como um campo extra no corpo da requisição ao usar um SDK compatível com OpenAI. Sobrescritas de roteamento ao nível da requisição exigem uma chave de API privada.

## Entrada e multimodalidade

A AIVAX aceita partes de conteúdo de mensagem compatíveis com OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade a menos que você peça à AIVAX para pré‑processar a mídia em texto.

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

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. O exemplo a usa uma Data URL em base64; prefira uma URL publicamente acessível para vídeos grandes:

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

Links externos devem ser acessíveis à AIVAX sem autenticação, restrições de firewall ou renderização apenas em JavaScript. Falhas ao baixar, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor podem causar falha na inferência.

Você também pode enviar uma requisição simples de texto com `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Idempotência da requisição

Defina `idempotency_key` quando sua integração precisar de chamadas repetidas para atualizar o mesmo registro de conversa armazenado em vez de criar um novo token de conversa. A AIVAX usa esse valor para correlacionar o contexto do AI Gateway e o registro da conversa.

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

O valor deve ser uma string não vazia com no máximo 128 caracteres. Quando omitido, a AIVAX gera automaticamente um token de conversa.

## Metadados da requisição

Defina `metadata` para anexar informações de chave/valor em forma de string à requisição de inferência. A AIVAX armazena esse objeto com a conversa registrada e o expõe aos eventos do gateway, sendo útil para correlação operacional como ID de pedido, locatário, fluxo de trabalho ou chave de rastreamento interno.

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

`metadata` deve ser um objeto JSON cujas propriedades e valores são strings. Não coloque segredos, credenciais, dados de pagamento ou cargas úteis grandes neste campo.

## Pré‑processamento multimodal

Use `multimodal_preprocess` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos orientados a texto ou quando você deseja que a AIVAX normalize arquivos antes da inferência principal.

```json
{
    "model": "@meta/llama-3.3-70b",
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
    "multimodal_preprocess": "File"
}
```

Flags de pré‑processamento disponíveis:

- `Image`
- `Audio`
- `Video`
- `File`
- `OtherFiles`
- `All`

O resolvedor armazena em cache descrições de mídia por hash de conteúdo para reutilização. O pré‑processamento de `Image`, `Audio`, `Video` e PDF `File` usa inferência multimodal auxiliar. Arquivos não PDF suportados utilizam extração local de texto.

Entradas multimodais podem ter requisitos de conta. Revise [Pricing](../pricing.md) e [Plans and limits](../limits.md) antes de usá‑las em produção.

Quando uma inferência multimodal falha, estreite o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um anexo pequeno.
3. Teste o mesmo anexo com `multimodal_preprocess`.
4. Revise a URL, formato, tamanho e suporte de modalidade do modelo.

## Respostas estruturadas

A AIVAX oferece suporte a respostas estruturadas por meio de `response_schema`, `response_format` e `json_only`.

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

`response_schema` habilita JSON Healing. A AIVAX solicita JSON ao modelo, extrai JSON do texto ou blocos markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja alcançado.

Saiba mais em [Structured responses](/docs/pt-br/inference/structured-responses).

## Funções sob demanda

Use `builtin_tools` para habilitar ferramentas internas da AIVAX em uma requisição direta sem criar um gateway:

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

Ferramentas internas incluem `WebSearch`, `AdvancedWebUsage`, `OpenUrl`, `Code`, `Request`, `Calendar`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch` e `ImageGeneration`.

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se a mesma aplicação sempre usar as mesmas ferramentas, prefira configurá‑las em um AI Gateway para que a política seja centralizada.

## Corpo da requisição de provedor personalizado

Quando um gateway usa uma chave de API fornecida e um endpoint de provedor compatível com OpenAI, `extra_body` pode mesclar JSON customizado ao corpo da requisição do provedor:

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

## Explicações de ferramentas

Defina `tool_invocation_explanations: true` para pedir à AIVAX que inclua campos de explicação nos argumentos de ferramentas do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

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

Exemplo de evento de stream:

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

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que a AIVAX coloque raciocínio e atividade de ferramentas do lado do servidor no mesmo fluxo textual de resposta que a UI de chat já renderiza. Isso é útil para clientes que constroem uma linha do tempo única de resposta e desejam transformar raciocínio e atividade de ferramentas em componentes visíveis sem manter caminhos de tratamento de eventos separados para cada tipo de marcador.

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

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado ao assistente pode ser emitido como blocos `<assistant-answer>` e marcadores de ferramentas do lado do servidor podem aparecer como elementos de resultado de ferramenta, como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do fluxo de resposta: analise‑os em componentes da linha do tempo de chat, seções colapsáveis de raciocínio, fragmentos de resposta do assistente ou linhas de status de ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não entendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos estruturados do stream. No modo padrão, o raciocínio chega via `delta.reasoning` e a atividade de ferramentas do lado do servidor chega via eventos `servertool`. Preserve a ordem em que os eventos do stream chegam para que o raciocínio, a atividade de ferramentas, o conteúdo parcial e a resposta final permaneçam na mesma linha do tempo de resposta.

### Exemplo bruto de múltiplas turnos

O exemplo abaixo mostra a forma de uma resposta em stream quando o raciocínio do lado do servidor está visível ao cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo textual. Os atributos exatos do resultado da ferramenta podem variar conforme o renderizador, mas o comportamento importante é a ordenação: raciocínio, fragmentos de resposta do assistente, atividade de ferramentas, mais raciocínio e a resposta final podem pertencer ao mesmo turno do assistente.

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

Linha do tempo do assistente em stream:

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

Top picks:

1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.
2. @qwen/qwen3.5-9b: the lowest input cost with video support.
3. @amazon/nova-lite: low input cost and a large context window.

Use VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível do assistente. Armazene o raciocínio e os detalhes da ferramenta como metadados de linha do tempo ou auditoria se seu produto precisar disso, mas não os converta em uma nova mensagem de usuário. A mensagem do assistente deve usar o conteúdo do bloco `<assistant-answer>` final, não a transcrição completa do raciocínio.

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
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nTop picks:\n\n1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: the lowest input cost with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
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

### Orientação de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode “falar” enquanto raciocina emitindo atualizações de processo voltadas ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramentas e conteúdo de resposta parcial à medida que a resposta se desenvolve.

Uma vez que a resposta final do assistente é gerada, essa resposta se torna o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas costuma deixar de ser o objetivo principal do usuário. Colapse ou minimize o raciocínio por padrão após a conclusão, de modo que a resposta final receba a ênfase visual mais forte, mantendo o processo disponível para usuários que desejam inspecioná‑lo.

Use divulgação progressiva ao longo desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, tornando‑se um elemento secundário mais discreto após a aparição da resposta final. A atividade de ferramentas deve ser lida como status, não como discurso: use rótulos concisos como “Searching”, “Opening source”, “Running tool”, “Finished” ou “Failed”, e mantenha cada invocação de ferramenta agrupada como um item da linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior destaque, tipografia de leitura normal, parte da conversa principal.
- Raciocínio em progresso: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor destaque, cor ou contêiner suavizado, colapsado ou minimizado por padrão.
- Blocos de ferramentas: linhas de status compactas com indicadores claros de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja um desenvolvedor, auditor ou superfície de depuração.

Evite expor internals barulhentos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, cargas úteis grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja projetada para inspeção técnica.

Para acessibilidade, torne cada bloco colapsado alternável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas de cor para indicar estado e mantenha o movimento sutil. Uma resposta em stream deve parecer estável enquanto se atualiza: novos raciocínios ou linhas de ferramentas podem aparecer em ordem, mas o conteúdo existente não deve saltar ou forçar o usuário a perder a posição de leitura.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, o prompt, as ferramentas e o contexto de cada requisição.

Use um AI Gateway quando o comportamento precisar ser estável, auditável e reutilizável. Gateways são mais adequados para assistentes de suporte, bots de chat, agentes RAG, ferramentas permanentes, workers, skills e configurações compartilhadas por vários clientes.