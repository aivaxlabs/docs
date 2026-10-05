---
{title: Documentação MCP,linkTitle: Documentação MCP,weight: 390,group: MCP Utilities,aliases: [/docs/pt-br/tools/documentation-mcp.html,/docs/pt-br/mcp-utilities/documentation-mcp.html],sourceHash: 374ff6ea05264f1d}
---

# Documentação MCP

O MCP de documentação da AIVAX expõe a documentação da AIVAX, conteúdo de referência da API e metadados do modelo para clientes compatíveis com MCP. É projetado para assistentes, IDEs, agentes internos e fluxos de trabalho de implementação que precisam do contexto atual da AIVAX antes de responder, escrever código, configurar um gateway ou solucionar problemas de integração.

Este MCP é orientado à leitura. Não expõe uma ferramenta genérica de invocação de API de conta. Use-o quando um agente precisar entender recursos da AIVAX, encontrar a rota correta da API, comparar capacidades de modelo ou fundamentar sua resposta no manual do produto. Use o [account management MCP](/docs/pt-br/mcp-utilities/account-management-mcp) apenas quando o cliente também precisar inspecionar ou alterar recursos de conta autenticados por chamadas de API.

> [!NOTE]
> Não configure o MCP de documentação junto com o [account management MCP](/docs/pt-br/mcp-utilities/account-management-mcp) no mesmo cliente, a menos que tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de conta já inclui funções de busca na documentação, portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/documentation
```

Autentique‑se com uma chave de API de conta AIVAX:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](/docs/pt-br/authentication).

## Exemplo de configuração

A configuração exata depende do cliente MCP. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint de documentação da AIVAX e passe a chave de API como cabeçalho.

```json
{
  "servers": {
    "aivax-docs": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/documentation",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

Depois que o cliente se conectar, ele pode descobrir as ferramentas expostas pelo servidor. Os nomes das ferramentas são prefixados com `aivax_` para que permaneçam claros quando o cliente também possui ferramentas de projeto, banco de dados, navegador ou código disponíveis.

## Ferramentas disponíveis

### `aivax_search_documentation`

Busca na documentação da AIVAX e no conteúdo de referência da API. Use esta ferramenta quando o assistente precisar de contexto do produto antes de responder ou agir.

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_terms` | `string[]` | Sim | Termos de busca para consultar a documentação da AIVAX e a referência da API. |
| `search_type` | `string` | Não | Escopo da busca. Use `documentation-manual`, `api-function-reference` ou `all`. |

A busca pode consultar o manual de documentação, a referência de funções da API ou ambos. Ela devolve trechos relevantes da documentação em texto para que o cliente possa usá‑los diretamente como contexto. A busca é limitada a 10 termos por chamada e 500 caracteres no total entre todos os termos.

Argumentos de exemplo:

```json
{
  "search_terms": [
    "AI Gateway MCP headers",
    "tool metadata"
  ],
  "search_type": "all"
}
```

Use frases mais completas quando a pergunta tem uma intenção clara, como `semantic search reranker settings` ou `public key chat completion restrictions`. Use múltiplos termos quando quiser cobrir conceitos vizinhos, nomes alternativos ou termos prováveis da referência da API.

Chamadas de busca utilizam as cotas por conta documentadas em [Plans and limits](/docs/pt-br/limits#plan-limits).

### `aivax_list_models`

Lista modelos de chat integrados da AIVAX e devolve um resumo legível para cada correspondência. Use quando o assistente precisar escolher um modelo, explicar se um modelo está disponível no plano atual, comparar capacidades ou entender preços (veja [Pricing](/docs/pt-br/pricing)).

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `name_filter` | `string` | Não | Filtro difuso opcional para nomes de modelo, como `gpt 5`, `sonnet`, `qwen coder` ou `@openai/gpt-5-mini`. |

A resposta inclui descrição do modelo, estabilidade, tipo, capacidades, flags, grupo de limite de taxa, modelo de roteamento, multiplicador de assinatura, metadados técnicos, preços por token, provedores e disponibilidade para o plano de conta autenticada. Para detalhes de preços atuais, veja [Pricing](/docs/pt-br/pricing).

Argumentos de exemplo:

```json
{
  "name_filter": "gemini flash"
}
```

Chamadas de listagem de modelos utilizam as cotas por conta documentadas em [Plans and limits](/docs/pt-br/limits#plan-limits).

## Quando usar

Use o MCP de documentação quando quiser que um assistente responda perguntas sobre a AIVAX a partir de contexto respaldado por fonte em vez de memória. Isso é útil em IDEs, ferramentas de suporte, agentes de integração, copilotos de implementação internos e fluxos de avaliação onde o assistente deve buscar no manual antes de recomendar uma rota, parâmetro, recurso, modelo ou passo de depuração.

Também é útil para fluxos de trabalho de construção de agentes. Antes de criar ou editar um [AI Gateway](/docs/pt-br/inference/ai-gateway), um assistente pode buscar o recurso relevante, verificar capacidades do modelo e então explicar qual configuração deve ser usada e por quê. Por exemplo, pode comparar ferramentas embutidas, funções MCP, funções do lado do servidor, workers, coleções RAG, respostas estruturadas e pré‑processamento multimodal antes de sugerir um design.

Para solução de problemas, o MCP de documentação ajuda o assistente a passar de uma mensagem de erro para a provável fronteira do produto. Ele pode buscar regras de autenticação, limites de plano, requisitos de equilíbrio multimodal, parâmetros de busca RAG, comportamento do gateway ou restrições de chave pública e então gerar uma lista de verificação focada que reflita o comportamento da AIVAX.

Para seleção de modelo, combine `aivax_search_documentation` com `aivax_list_models`. Busque no manual o requisito de recurso, como chamada de ferramenta, entrada de vídeo, saída estruturada ou contexto longo, depois liste os modelos correspondentes e escolha um que esteja disponível no plano da conta.

## Escolhendo termos de busca

Bons termos de busca devem descrever o objetivo do usuário, não apenas uma palavra‑chave. Prefira:

```text
public key chat completion restrictions
semantic search include references
AI Gateway MCP source headers
multimodal preprocess video
```

Em vez de:

```text
key
search
headers
video
```

Quando o assistente não souber qual página contém a resposta, use `search_type: "all"`. Quando precisar de nomes de rotas, corpos de requisição ou comportamento de endpoint, use `api-function-reference`. Quando precisar de orientação conceitual, trade‑offs ou explicações de fluxo de trabalho, use `documentation-manual`.

## Orientação de segurança

O MCP de documentação é mais seguro que uma ferramenta de gerenciamento porque é orientado à leitura, mas ainda assim autentica como uma conta AIVAX e pode expor disponibilidade de modelo sensível ao plano da conta. Conecte‑o apenas a clientes que devam conhecer os modelos disponíveis na conta e o contexto da documentação.

Use uma chave de API dedicada para cada cliente MCP. Armazene‑a no mecanismo de segredos do cliente ou em um repositório de configuração local, não no controle de versão. Se um cliente precisar apenas de documentação pública e não necessitar de disponibilidade de modelo específica da conta, prefira vincular diretamente ao site de documentação pública em vez de conectar a um servidor MCP autenticado.
