---
{title: Ferramentas,linkTitle: Ferramentas,weight: 70,group: Inference,sourceHash: 5bda0d50cba0ef30,aliases: [/docs/pt-br/inference/chat-completions/tools.html]}
---

# Ferramentas

As ferramentas permitem que o modelo solicite ações e dados. O AIVAX suporta dois modelos de execução, e uma única solicitação pode usar ambos:

| | Ferramentas do lado do cliente | Ferramentas do lado do servidor |
| --- | --- | --- |
| Definidas por | `tools` na solicitação ou no gateway | Fontes MCP do gateway, funções de protocolo, habilidades, shell e ferramentas integradas; `builtin_tools` na solicitação |
| Executadas por | Seu aplicativo | AIVAX |
| Retornadas a você | Como `tool_calls`, que encerram a resposta | Como eventos `servertool` durante o streaming; a resposta final inclui seus efeitos |
| Resultados | Seu aplicativo os envia de volta como mensagens `tool` | O AIVAX os adiciona à conversa e continua |

Use ferramentas do lado do cliente quando a ação precisar ser executada no seu aplicativo, por exemplo, porque ela precisa do estado local do usuário ou de uma credencial que não deve sair do seu sistema. Use ferramentas do lado do servidor quando o AIVAX puder realizar a ação, para que uma única solicitação conclua toda a tarefa. Consulte [MCP e funções de protocolo](mcp-and-protocol-functions.md) e [Ferramentas integradas](built-in-tools.md).

## Ferramentas do lado do cliente

Defina ferramentas do lado do cliente com o formato `tools` da OpenAI:

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Qual é o clima em Lisboa?"
        }
    ],
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Retorna o clima atual de uma cidade.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string" }
                    },
                    "required": ["city"]
                }
            }
        }
    ]
}
```

Quando o modelo chama uma ferramenta do lado do cliente, a resposta termina com `finish_reason: "tool_calls"`, e as chamadas são retornadas em `choices[].message.tool_calls`, ou como `delta.tool_calls` durante o streaming. Execute cada chamada e, em seguida, envie a mensagem do assistente com seus `tool_calls` e uma mensagem `tool` por chamada, usando o mesmo `tool_call_id`:

```json
{
    "model": "@openai/gpt-5-mini",
    "conversation_token": "weather-thread-7",
    "messages": [
        { "role": "user", "content": "Qual é o clima em Lisboa?" },
        {
            "role": "assistant",
            "content": null,
            "tool_calls": [
                {
                    "id": "call_abc123",
                    "type": "function",
                    "function": { "name": "get_weather", "arguments": "{\"city\":\"Lisbon\"}" }
                }
            ]
        },
        {
            "role": "tool",
            "tool_call_id": "call_abc123",
            "content": "{\"temperature\":21,\"condition\":\"sunny\"}"
        }
    ],
    "tools": [ "..." ]
}
```

Envie as mesmas definições de `tools` novamente na solicitação subsequente. `tool_choice` e `parallel_tool_calls` são encaminhados ao provedor quando o modelo os suporta.

Ferramentas definidas no parâmetro bruto `tools` do gateway comportam-se da mesma maneira: elas são enviadas ao modelo, e seu cliente as executa.

## Combinando ferramentas do lado do cliente e do lado do servidor

Em uma única solicitação, o AIVAX executa as ferramentas do lado do servidor chamadas pelo modelo e continua gerando. Quando o modelo chama uma ferramenta do lado do cliente, a resposta termina e retorna essas chamadas a você; quaisquer ferramentas do lado do servidor solicitadas na mesma etapa já foram executadas. Após enviar os resultados das ferramentas do cliente, envie o mesmo `conversation_token` para que o modelo ainda veja os resultados do lado do servidor das etapas anteriores; consulte [Reutilização de sessão](session-reuse.md).

## Requisitos

- O modelo deve suportar chamada de funções. Para um modelo sem chamada de ferramentas nativa confiável, um gateway pode usar um [manipulador de ferramentas](/docs/pt-br/inference/ai-gateways/concepts.md#tool-handler).
- Os nomes das ferramentas devem ser exclusivos entre todas as ferramentas da solicitação. Os nomes `shell` e `read_skill` são reservados quando o gateway usa o shell.
- Chaves de API públicas podem enviar `tools`, mas as ferramentas do lado do servidor do gateway não são usadas; consulte [Limites](limits.md#public-api-keys).

Cada ferramenta adiciona seu nome, descrição e esquema à entrada de cada solicitação. Exponha apenas as ferramentas necessárias para a tarefa e forneça nomes específicos e esquemas restritivos; consulte [Escolhendo o nome da função](/docs/pt-br/tools/mcp.md#choosing-the-function-name).
