---
{title: Inferência MCP,linkTitle: Inferência MCP,weight: 60,group: MCP Utilities,aliases: [/docs/pt-br/tools/inference-mcp.html,/docs/pt-br/mcp-utilities/inference-mcp.html],sourceHash: 4f8055e98c8a7b02}
---

# Inference MCP

O Inference MCP expõe um modelo integrado do AIVAX ou um Gateway de IA como uma ferramenta para clientes MCP compatíveis. Utilize-o quando outro modelo, agente, IDE ou assistente de desktop precisar chamar o modelo ou gateway configurado do AIVAX como um subagente.

Para obter informações sobre a configuração de modelos, instruções, RAG, ferramentas e workers no gateway subjacente, consulte [Gateways de IA](/docs/pt-br/inference/ai-gateways/concepts.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/inference
```

## Cabeçalhos

| Cabeçalho | Descrição | Obrigatório |
| --- | --- | --- |
| `Authorization` | Token Bearer para sua chave de API do AIVAX. | Sim |
| `X-Mcp-Model-Name` | Tag do modelo integrado, ID completo do gateway ou slug do gateway. | Sim |
| `X-Mcp-Tool-Name` | Nome base da ferramenta. O AIVAX converte para o formato de identificador e expõe `invoke_{tool_name}`. | Não, padrão é `ai_model` |
| `X-Mcp-Tool-Description` | Descrição exibida ao cliente MCP. | Não |
| `X-Mcp-Tool-Title` | Título amigável exibido ao cliente MCP. | Não |
| `X-Mcp-User` | ID de usuário externo armazenado no contexto de inferência. | Não |

## Exemplo de configuração

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
        "X-Mcp-Tool-Description": "Use esta ferramenta para invocar o assistente especializado em análise de dados.",
        "X-Mcp-Tool-Title": "Assistente de Análise de Dados"
      }
    }
  }
}
```

A ferramenta MCP gerada aceita um argumento:

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `prompt` | string | Prompt enviado ao modelo ou gateway configurado. |

A ferramenta MCP retorna a resposta do gateway como texto e compartilha a mesma faturação de inferência e limite de taxa do endpoint de conclusão de chat subjacente.
