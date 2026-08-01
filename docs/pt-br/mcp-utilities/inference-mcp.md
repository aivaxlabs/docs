# Inferência MCP

O Inference MCP expõe um modelo integrado AIVAX ou AI Gateway como uma ferramenta para clientes MCP compatíveis. Use quando outro modelo, agente, IDE ou assistente de desktop deve chamar o modelo ou gateway AIVAX configurado como um sub‑agente.

Para informações sobre configuração de modelos, instruções, RAG, ferramentas e workers no gateway subjacente, veja [AI Gateways](/docs/pt-br/inference/ai-gateway).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/inference
```

## Headers

| Header | Description | Required |
| --- | --- | --- |
| `Authorization` | Token Bearer para sua chave de API AIVAX. | Sim |
| `X-Mcp-Model-Name` | Tag do modelo integrado, ID completo do gateway ou slug do gateway. | Sim |
| `X-Mcp-Tool-Name` | Nome base da ferramenta. AIVAX converte para formato de identificador e expõe `invoke_{tool_name}`. | Não, padrão `ai_model` |
| `X-Mcp-Tool-Description` | Descrição mostrada ao cliente MCP. | Não |
| `X-Mcp-Tool-Title` | Título amigável mostrado ao cliente MCP. | Não |
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

| Parameter | Type | Description |
| --- | --- | --- |
| `prompt` | string | Prompt enviado ao modelo ou gateway configurado. |

A ferramenta MCP retorna a resposta do gateway como texto e compartilha o mesmo caminho de faturamento e limite de taxa de inferência da conclusão de chat subjacente.