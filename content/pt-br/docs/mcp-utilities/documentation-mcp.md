---
{title: Documentação MCP,linkTitle: Documentação MCP,weight: 20,group: MCP Utilities,aliases: [/docs/pt-br/tools/documentation-mcp.html,/docs/pt-br/mcp-utilities/documentation-mcp.html],sourceHash: 4c5f492de6b6e8a9}
---

# Documentação MCP

O MCP de documentação da AIVAX expõe a documentação da AIVAX, o conteúdo de referência da API e os metadados do modelo para clientes compatíveis com MCP. Ele foi projetado para assistentes, IDEs, agentes internos e fluxos de trabalho de implementação que precisam do contexto atual da AIVAX antes de responder, escrever código, configurar um gateway ou solucionar problemas de integração.

Este MCP é orientado à leitura. Ele não expõe uma ferramenta genérica de invocação da API de conta. Use-o quando um agente precisa entender os recursos da AIVAX, encontrar a rota de API correta, comparar as capacidades dos modelos ou fundamentar sua resposta no manual do produto. Use apenas o [MCP de gerenciamento de contas](/docs/pt-br/mcp-utilities/account-management-mcp) quando o cliente também precisar inspecionar ou alterar recursos de conta autenticados por meio de chamadas de API.

> [!NOTE]
> Não configure o MCP de documentação junto com o [MCP de gerenciamento de contas](/docs/pt-br/mcp-utilities/account-management-mcp) no mesmo cliente, a menos que você tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de contas já inclui funções de pesquisa de documentação. Adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

Este é o endereço para o MCP de documentação. Conecte um cliente aqui quando ele deve pesquisar o manual do produto, a referência da API ou os modelos de chat integrados para o plano da conta.

```text
https://inference.aivax.net/v1/mcp/documentation
```

Autentique-se com uma chave de API de conta da AIVAX:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chaves e opções de autenticação, consulte [Autenticação](/docs/pt-br/authentication).

## Exemplo de configuração

A configuração do cliente indica ao cliente MCP onde conectar. A forma exata depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint de documentação da AIVAX e passe a chave de API como um cabeçalho.

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

Após a conexão do cliente, ele pode descobrir as ferramentas expostas pelo servidor. Os nomes das ferramentas são prefixados com `aivax_` para permanecerem claros quando o cliente também tiver ferramentas de projeto, banco de dados, navegador ou código disponíveis.

## Ferramentas disponíveis

O servidor expõe duas ferramentas de leitura. Use-as quando o assistente precisar de contexto do produto ou de uma lista de modelos antes de responder ou agir.

### `aivax_search_documentation`

`aivax_search_documentation` pesquisa na documentação da AIVAX e no conteúdo de referência da API. Use esta ferramenta quando o assistente precisar de contexto do produto antes de responder ou agir.

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_terms` | `string[]` | Sim | Termos de pesquisa para consulta contra a documentação da AIVAX e a referência da API. |
| `search_type` | `string` | Não | Escopo da pesquisa. Use `documentation-manual`, `api-function-reference` ou `all`. |

A pesquisa pode consultar o manual de documentação, a referência de função da API ou ambos. Ela retorna trechos de documentação relevantes em formato de texto para que o cliente possa usá-los diretamente como contexto. A pesquisa aceita no máximo 10 termos de pesquisa e 500 caracteres totais por chamada.

Exemplo de argumentos:

```json
{
  "search_terms": [
    "AI Gateway MCP headers",
    "tool metadata"
  ],
  "search_type": "all"
}
```

Escolha termos que correspondam à pergunta:

- Use uma frase completa quando a intenção estiver clara, como `configurações de reranker de busca semântica` ou `restrições de conclusão de chat de chave pública`.
- Use vários termos para cobrir conceitos vizinhos, nomes alternativos ou prováveis termos de referência da API.

As chamadas de pesquisa usam as cotas por conta documentadas em [Planos e limites](/docs/pt-br/limits#account-limits).

### `aivax_list_models`

`aivax_list_models` lista os modelos de chat integrados da AIVAX e retorna um resumo legível pelo modelo para cada correspondência. Use-o quando o assistente precisar escolher um modelo, explicar se um modelo está disponível para o plano atual, comparar capacidades ou entender o preço (consulte [Preços](/docs/pt-br/pricing)).

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `name_filter` | `string` | Não | Filtro aproximado opcional para nomes de modelos, como `gpt 5`, `sonnet`, `qwen coder` ou `@openai/gpt-5-mini`. |

A resposta inclui a descrição, estabilidade, tipo, capacidades, flags e disponibilidade de cada modelo para o plano de conta autenticado. Para preços atuais, consulte [Preços](/docs/pt-br/pricing).

Exemplo de argumentos:

```json
{
  "name_filter": "gemini flash"
}
```

As chamadas de listagem de modelos usam as cotas por conta documentadas em [Planos e limites](/docs/pt-br/limits#account-limits).

## Quando usar

Use o MCP de documentação quando quiser que um assistente responda perguntas sobre a AIVAX com base em contexto respaldado pela fonte, em vez de memória. As seções abaixo correspondem aos trabalhos usuais.

### Responder com base no manual

Use-o em IDEs, ferramentas de suporte, agentes de integração, copilotos de implementação interna e fluxos de trabalho de avaliação. O assistente deve pesquisar o manual antes de recomendar uma rota, parâmetro, recurso, modelo ou etapa de depuração.

### Projetar um gateway

Antes de criar ou editar um [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md), o assistente pode pesquisar o recurso relevante, verificar as capacidades do modelo e, em seguida, explicar qual configuração usar e por quê. Por exemplo, ele pode comparar:

- ferramentas integradas;
- funções MCP;
- funções do lado do servidor;
- workers;
- coleções RAG;
- respostas estruturadas;
- pré-processamento multimodal.

### Solucionar um erro

O assistente pode passar de uma mensagem de erro para o limite de produto provável. Ele pode pesquisar regras de autenticação, limites de plano, requisitos de equilíbrio multimodal, parâmetros de pesquisa RAG, comportamento do gateway ou restrições de chave pública. Em seguida, ele pode produzir uma lista de verificação focada que reflita o comportamento da AIVAX.

### Escolher um modelo

Combine `aivax_search_documentation` com `aivax_list_models`:

1. Pesquise o manual para o requisito do recurso, como chamada de ferramenta, entrada de vídeo, saída estruturada ou contexto longo.
2. Liste os modelos correspondentes.
3. Escolha um que esteja disponível para o plano da conta.

## Escolhendo termos de pesquisa

Bons termos de pesquisa descrevem o objetivo do usuário, não apenas uma palavra-chave. Use esta seção quando uma pesquisa retornar ruído ou perder a página que você esperava.

Prefira:

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

Escolha `search_type` com base no tipo de resposta que você precisa:

- Use `search_type: "all"` quando o assistente não tiver certeza de qual página contém a resposta.
- Use `api-function-reference` quando ele precisar de nomes de rotas, corpos de solicitação ou comportamento de endpoints.
- Use `documentation-manual` quando ele precisar de orientação conceitual, compensações ou explicações de fluxo de trabalho.

## Diretrizes de segurança

O MCP de documentação é mais seguro do que uma ferramenta de gerenciamento porque é orientado à leitura, mas ainda assim autentica como uma conta da AIVAX. Conecte-o apenas a clientes que devem conhecer os modelos disponíveis da conta e o contexto da documentação. Ele pode expor a disponibilidade de modelos sensível ao plano da conta.

- Use uma chave de API dedicada para cada cliente MCP.
- Armazene a chave no mecanismo de segredo do cliente ou no armazenamento de configuração local.
- Não armazene a chave no controle de origem.

Se um cliente precisar apenas de documentação pública e não precisar de disponibilidade de modelos específica da conta, prefira vincular diretamente ao site de documentação público em vez de conectar um servidor MCP autenticado.
