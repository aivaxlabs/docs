Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateways/using-an-ai-gateway.html

# Usando um Gateway de IA

Crie um gateway no painel ou por meio da API e, em seguida, chame-o pelo endpoint `chat/completions` compatível com OpenAI, passando seu ID ou slug como `model`.

## Criar e gerenciar gateways

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20AI%20Gateway)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Edit%20AI%20Gateway)

Uma solicitação de edição pode conter apenas os campos a serem alterados; os campos omitidos mantêm seus valores atuais.

## Chamar o gateway

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

```json
{
    "model": "support:50c3",
    "messages": [
        {
            "role": "user",
            "content": "Como redefino minha senha?"
        }
    ]
}
```

A solicitação contém apenas a conversa. O gateway adiciona suas instruções, documentos recuperados e ferramentas antes que o modelo seja executado. Para entender como essa pré-configuração altera a solicitação, consulte [Inferência com Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/chat-completions/ai-gateways.md).

## Substituir valores do gateway

Solicitações enviadas com uma chave privada podem substituir os valores suportados do gateway apenas para essa solicitação. O gateway em si não é alterado.

| Campo da solicitação | Substitui |
| --- | --- |
| `temperature`, `top_p`, `seed`, `presence_penalty` | Parâmetros de amostragem. |
| `reasoning_effort`, `verbosity` | Configurações de raciocínio e verbosidade, quando o modelo as suporta. |
| `max_completion_tokens`, `stop` | Comprimento da saída e sequências de parada. |
| `tools` | Adiciona ferramentas do lado do cliente às ferramentas do gateway. |
| `builtin_tools` | Habilita [ferramentas integradas](https://docs.aivax.net/pt-br/docs/inference/chat-completions/built-in-tools.md) adicionais. |
| `response_schema`, `response_format` | [Saída estruturada](https://docs.aivax.net/pt-br/docs/inference/chat-completions/structured-output.md). |
| `time_zone` | Fuso horário do gateway. |
| `multimodal_resolver` | Mecanismos de [pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md). |
| `tool_invocation_explanations` | [Explicações de ferramentas](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md). |
| `routing_options` | [Roteamento de provedores](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md#override-routing-per-request). |

`frequency_penalty` é configurado apenas no gateway. Instruções, RAG, fontes MCP, funções de protocolo, habilidades, trabalhadores e moderação não podem ser substituídos por solicitação.

Chaves de API públicas aceitam apenas um pequeno conjunto de campos de solicitação e rejeitam os demais; consulte [Limites](https://docs.aivax.net/pt-br/docs/inference/chat-completions/limits.md#public-api-keys).

## Testar incrementalmente

Quando um gateway se comporta de maneira inesperada, teste primeiro um prompt simples e, em seguida, adicione RAG, ferramentas, mídia ou saída estruturada um de cada vez. Isso isola o recurso que causa o problema. Consulte [Solução de problemas](https://docs.aivax.net/pt-br/docs/inference/chat-completions/troubleshooting.md).

## Usar um gateway de clientes MCP

Para expor um modelo integrado ou um Gateway de IA como ferramenta para um cliente MCP externo, consulte [Inferência MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md).
