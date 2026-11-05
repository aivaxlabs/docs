---
{title: Streaming,linkTitle: Transmissão ao vivo,weight: 110,group: Inference,sourceHash: ab8d11649fb7f950,aliases: [/docs/pt-br/inference/chat-completions/streaming.html]}
---

# Streaming

Defina `stream: true` para receber a resposta como eventos enviados pelo servidor (SSE) enquanto ela é gerada. Cada evento é uma linha `data:` contendo um `chat.completion.chunk` em JSON, e o stream termina com `data: [DONE]`. SDKs compatíveis com OpenAI analisam esse formato diretamente.

Use streaming para chats voltados ao usuário, para que ele veja o progresso enquanto o raciocínio e as ferramentas são executados. O streaming também mantém os dados fluindo, de modo que solicitações longas raramente atingem os limites de tempo (timeouts) do proxy.

## Tipos de eventos

| O chunk contém | Significado |
| --- | --- |
| `choices[].delta.content` | Um fragmento do texto da resposta. |
| `choices[].delta.reasoning` | Um fragmento do raciocínio do modelo, quando o modelo o retorna. |
| `choices[].delta.tool_calls` | Uma chamada de [ferramenta no lado do cliente](tools.md). O stream então termina com `finish_reason: "tool_calls"`. |
| `servertool` | Uma mudança de estado de [ferramenta no lado do servidor](#eventos-de-ferramentas-no-lado-do-servidor). `choices` está vazio. |
| `usage` | O último chunk antes de `[DONE]`, com `finish_reason` e uso de tokens. |
| `error` | Uma falha após o início do stream; consulte [Erros durante um stream](#erros-durante-um-stream). |

Cada chunk inclui `id`, o ID da mensagem AIVAX (`aivx_...`), `model` e `provider`. O último chunk antes de `[DONE]` também inclui `conversation_token`. Armazene ambos para continuar a conversa; consulte [Reutilização de sessão](session-reuse.md).

Preserve a ordem em que os eventos chegam. Raciocínio, eventos de ferramentas e texto da resposta de uma única virada do assistente podem ser intercalados.

## Eventos de ferramentas no lado do servidor

Enquanto o AIVAX executa uma ferramenta integrada, uma ferramenta MCP ou uma função de protocolo, ele envia chunks com um objeto `servertool`:

```json
{
    "object": "chat.completion.chunk",
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"weather forecast today\"}",
        "state": "Created",
        "explanation": null
    }
}
```

| Campo | Descrição |
| --- | --- |
| `name` | Nome da ferramenta. |
| `id` | ID da chamada da ferramenta. Todos os eventos de uma mesma chamada compartilham este ID. |
| `contents` | Argumentos da ferramenta como uma string JSON. |
| `state` | `Created` quando a chamada começa, seguido por `Completed` ou `Failed`. |
| `explanation` | `{ "reason", "goal" }` quando as [explicações de ferramentas](/docs/pt-br/inference/response-rendering/tool-explanations.md) estão habilitadas e o modelo as forneceu; caso contrário, `null`. |

Para receber o raciocínio e a atividade das ferramentas como blocos de texto dentro de `delta.content` em vez de campos separados, use `rendering_mode: "textual_blocks"`; consulte [Diretrizes de apresentação de chat](/docs/pt-br/inference/response-rendering/chat-presentation-guidance.md).

## Chunk de uso

O último chunk antes de `[DONE]` possui `delta` vazio, o `finish_reason` final e `usage`:

```json
{
    "object": "chat.completion.chunk",
    "choices": [
        { "index": 0, "finish_reason": "stop", "delta": {} }
    ],
    "usage": {
        "prompt_tokens": 412,
        "completion_tokens": 96,
        "total_tokens": 4604,
        "prompt_tokens_details": { "cached_tokens": 4096, "audio_tokens": 0 }
    },
    "conversation_token": "support-ticket-1042"
}
```

`prompt_tokens` exclui a entrada em cache; consulte [Cache](caching.md).

## Keep-alive

Enquanto um stream está aberto, o AIVAX envia um evento keep-alive com o dado `%ping%` a cada 15 segundos, para que proxies não fechem uma conexão ociosa durante chamadas de ferramentas longas. Ignore eventos cujos dados sejam `%ping%`. Se seu analisador SSE esperar JSON em cada evento, ignore esses eventos ou desative o keep-alive.

Para desativar o keep-alive, envie o cabeçalho de solicitação:

```text
Sse-Stream-Options: no-ping
```

Desative-o apenas quando nada entre seu cliente e o AIVAX fechar conexões ociosas.

## Erros durante um stream

Uma vez que o stream começa, o status HTTP já é `200`. Uma falha é enviada como um chunk com `finish_reason: "error"` e um objeto `error`, seguido por `[DONE]`:

```json
{
    "object": "chat.completion.chunk",
    "choices": [
        { "index": 0, "finish_reason": "error", "delta": { "content": "" } }
    ],
    "error": {
        "code": "service_unavailable",
        "message": "The inference provider is unavailable right now. Please, try again later."
    }
}
```

Verifique cada chunk quanto a `error` e trate-o como uma solicitação falha. O texto já recebido pertence a uma resposta incompleta; descarte-o ou marque-o como incompleto. Para modelos integrados, os detalhes do erro do provedor não são retornados; para gateways que usam sua própria chave de provedor, a mensagem do provedor é retornada conforme está.

Quando um provedor falha antes que qualquer dado tenha sido enviado, o AIVAX retrya a solicitação em outro provedor elegível, de modo que o cliente não vê nenhum erro.

## Streaming com `json_only`

Com `json_only: true`, o AIVAX gera o JSON completo primeiro e o envia como um único evento SSE contendo o JSON bruto, seguido por `[DONE]`. O evento não é um `chat.completion.chunk`. Consulte [Apenas JSON](/docs/pt-br/inference/structured-responses/json-only.md).
