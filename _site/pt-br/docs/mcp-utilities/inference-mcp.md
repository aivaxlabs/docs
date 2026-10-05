Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.html

# MCP de Inferência

O MCP de Inferência expõe um modelo integrado AIVAX ou AI Gateway como uma ferramenta para clientes MCP compatíveis. Use‑o quando outro modelo, agente, IDE ou assistente de desktop precisar chamar o modelo ou gateway AIVAX configurado como um sub‑agente.

Para informações sobre configuração de modelos, instruções, RAG, ferramentas e workers no gateway subjacente, veja [AI Gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/inference
```

## Headers

| Cabeçalho | Descrição | Obrigatório |
| --- | --- | --- |
| `Authorization` | Token Bearer para sua chave de API AIVAX. | Sim |
| `X-Mcp-Model-Name` | Tag de modelo integrado, ID completo do gateway ou slug do gateway. | Sim |
| `X-Mcp-Tool-Name` | Nome base da ferramenta. AIVAX converte para formato de identificador e expõe `invoke_{tool_name}`. | Não, padrão `ai_model` |
| `X-Mcp-Tool-Description` | Descrição mostrada ao cliente MCP. | Não |
| `X-Mcp-Tool-Title` | Título amigável mostrado ao cliente MCP. | Não |
| `X-Mcp-User` | ID de usuário externo armazenado no contexto de inferência. | Não |

## Configuration example

```json
{
  "servers": {
    "my-ai-gateway-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/inference",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Model-Name": "<MODEL_TAG_OR_GATEWAY_ID>",
        "X-Mcp-Tool-Name": "data_assistant",
        "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis.",
        "X-Mcp-Tool-Title": "Data Analysis Assistant"
      }
    }
  }
}
```

A ferramenta MCP gerada aceita um argumento:

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `prompt` | string | Prompt enviado ao modelo ou gateway configurado. |

A ferramenta MCP devolve a resposta do gateway como texto e compartilha o mesmo caminho de faturamento e limite de taxa de inferência do chat completado subjacente.
