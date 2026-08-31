# Inferência

AIVAX expõe uma API `chat/completions` compatível com OpenAI com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas embutidas, respostas estruturadas, pré‑processamento multimodal, roteamento de modelo e metadados de faturamento.

Use esta página para chamadas diretas de inferência. Use [AI Gateway](/docs/pt-br/inference/ai-gateway) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também tem o alias de API `/api/v1/chat/completions`.

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

Mapeamentos de partes de conteúdo suportados:

- `text`: Texto simples.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo o suporta.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` é áudio codificado em base64, e `input_audio.format` indica o formato.
- `file`: Conteúdo de arquivo. `file.filename` nomeia o arquivo, e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. O exemplo a seguir usa uma Data URL base64; prefira uma URL publicamente acessível para vídeos grandes:

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

Links externos devem ser acessíveis ao AIVAX sem autenticação, restrições de firewall ou renderização apenas em JavaScript. Falhas ao baixar, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor podem fazer a inferência falhar.

Você também pode enviar uma solicitação simples de texto com `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Idempotência da solicitação

Defina `idempotency_key` quando sua integração precisar de chamadas repetidas para atualizar o mesmo registro de conversa armazenado em vez de criar um novo token de conversa. AIVAX usa esse valor para correlacionar o contexto do AI Gateway e o registro da conversa.

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

O valor deve ser uma string não vazia com no máximo 128 caracteres. Quando omitido, o AIVAX gera um token de conversa automaticamente.

## Metadados da solicitação

Defina `metadata` para anexar informações de chave/valor string à solicitação de inferência. O AIVAX armazena esse objeto com a conversa registrada e o expõe a eventos do gateway, sendo útil para correlação operacional, como ID de pedido, locatário, fluxo de trabalho ou chave de rastreamento interno.

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

`metadata` deve ser um objeto JSON cujos nomes de propriedade e valores são strings. Não coloque segredos, credenciais, dados de pagamento ou cargas úteis grandes neste campo.

## Pré‑processamento multimodal

Use `multimodal_preprocess` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos que priorizam texto ou quando você deseja que o AIVAX normalize arquivos antes da inferência principal.

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

Quando uma inferência multimodal falha, reduza o problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um anexo pequeno.
3. Teste o mesmo anexo com `multimodal_preprocess`.
4. Revise a URL, formato, tamanho e suporte à modalidade do modelo.

## Respostas estruturadas

AIVAX suporta respostas estruturadas através de `response_schema`, `response_format` e `json_only`.

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

`response_schema` habilita o JSON Healing. O AIVAX solicita JSON ao modelo, extrai JSON do texto ou blocos de markdown gerados, valida contra o esquema e tenta novamente com feedback de validação até que a saída seja válida ou o limite de tentativas seja atingido.

Saiba mais em [Structured responses](/docs/pt-br/inference/structured-responses).

## Funções sob demanda

Use `builtin_tools` para habilitar ferramentas internas do AIVAX em uma solicitação direta sem criar um gateway:

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

## Corpo da solicitação de provedor personalizado

Quando um gateway usa uma chave de API fornecida e um ponto de extremidade de provedor compatível com OpenAI, `extra_body` pode mesclar JSON personalizado ao corpo da solicitação do provedor:

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

Defina `tool_invocation_explanations: true` para solicitar que o AIVAX inclua campos de explicação nos argumentos de ferramentas do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma cópia amigável ao cliente:

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

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que o AIVAX coloque o raciocínio e a atividade de ferramentas do lado do servidor no mesmo fluxo de resposta textual que a interface de chat já renderiza. Isso é útil para clientes que constroem uma linha do tempo única de resposta e desejam transformar raciocínio e atividade de ferramentas em componentes visíveis sem manter caminhos de tratamento de eventos separados para cada tipo de marcador.

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

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado ao assistente pode ser emitido como blocos `<assistant-answer>` e marcadores de ferramentas do lado do servidor podem aparecer como elementos de resultado de ferramenta, como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do fluxo de resposta: analise‑os em componentes da linha do tempo, seções colapsáveis de raciocínio, fragmentos de resposta do assistente ou linhas de status de ferramenta, mas não concatene cegamente cada marcador na resposta final do assistente.

Clientes que não compreendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega via `delta.reasoning`, e a atividade de ferramentas do lado do servidor chega via eventos `servertool`. Preserve a ordem em que os eventos de stream chegam para que raciocínio, atividade de ferramenta, conteúdo parcial e a resposta final permaneçam na mesma linha do tempo.

### Exemplo bruto de múltiplas trocas

O exemplo abaixo mostra a forma de uma resposta em stream quando o raciocínio do lado do servidor é visível ao cliente, `tool_invocation_explanations` está habilitado e `textual_blocks` é usado para manter a linha do tempo textual. Os atributos exatos do resultado da ferramenta podem variar conforme o renderizador, mas o comportamento importante é a ordenação: raciocínio, fragmentos de resposta do assistente, atividade de ferramenta, mais raciocínio e a resposta final podem pertencer ao mesmo turno do assistente.

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

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível do assistente. Armazene o raciocínio e os detalhes da ferramenta como metadados de linha do tempo ou auditoria se seu produto precisar, mas não os transforme em uma nova mensagem do usuário. A mensagem do assistente deve usar o conteúdo do último bloco `<assistant-answer>`, não a transcrição completa do raciocínio.

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

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes que a resposta final exista. O assistente pode “falar” enquanto raciocina emitindo atualizações de processo voltadas ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramenta e conteúdo parcial à medida que a resposta se desenvolve.

Quando a resposta final do assistente é gerada, essa resposta torna‑se o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas geralmente deixa de ser o objetivo principal do usuário. Colapse ou minimize o raciocínio por padrão após a conclusão para que a resposta final receba a   visual, mantendo o processo disponível para usuários que desejam inspecioná‑lo.

Use divulgação progressiva ao longo desse ciclo de vida. O raciocínio pode ser visível enquanto o modelo ainda está trabalhando, depois tornar‑se um elemento secundário mais discreto após a aparição da resposta final. A atividade de ferramenta deve ser lida como status, não como discurso: use rótulos concisos como “Searching”, “Opening source”, “Running tool”, “Finished” ou “Failed”, e mantenha cada invocação de ferramenta agrupada como um item da linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior destaque, tipografia de leitura normal, parte da conversa principal.
- Raciocínio em progresso: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor destaque, cor ou contêiner suavizado, colapsado ou minimizado por padrão.
- Blocos de ferramenta: linhas de status compactas com carregamento, sucesso e erros claros.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja desenvolvedor, auditor ou superfície de depuração.

Evite expor internals barulhentos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos quando ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, cargas úteis grandes e detalhes de implementação, a menos que o usuário solicite explicitamente detalhes ou a superfície do produto seja feita para inspeção técnica.

Para acessibilidade, torne cada bloco colapsado controlável por teclado, dê a cada linha de status um rótulo legível, evite depender apenas de cor para estado e mantenha o movimento sutil. Uma resposta em stream deve parecer estável enquanto atualiza: novos raciocínios ou linhas de ferramenta podem aparecer em ordem, mas o conteúdo existente não deve pular nem forçar o usuário a perder a posição de leitura.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde a aplicação controla o modelo, prompt, ferramentas e contexto de cada solicitação.

Use um AI Gateway quando o comportamento precisa ser estável, auditável e reutilizável. Gateways são melhores para assistentes de suporte, bots de chat, agentes RAG, ferramentas permanentes, workers, skills e configurações compartilhadas por vários clientes.