---
{title: Documentação MCP,linkTitle: Documentação MCP,weight: 20,group: MCP Utilities,aliases: [/docs/pt-br/tools/documentation-mcp.html,/docs/pt-br/mcp-utilities/documentation-mcp.html],sourceHash: 3ba334290b0e8b96}
---

# Documentação MCP

O MCP de documentação do AIVAX expõe a documentação, o conteúdo de referência da API e os metadados de modelos do AIVAX para clientes compatíveis com MCP. Ele foi projetado para assistentes, IDEs, agentes internos e fluxos de trabalho de implementação que precisam do contexto atual do AIVAX antes de responder, escrever código, configurar um gateway ou solucionar problemas de integração.

Este MCP é orientado à leitura. Ele não expõe uma ferramenta genérica de invocação da API de conta. Use-o quando um agente precisa entender os recursos do AIVAX, encontrar a rota de API correta, comparar as capacidades dos modelos ou fundamentar sua resposta no manual do produto. Use apenas o [MCP de gerenciamento de contas](/docs/pt-br/mcp-utilities/account-management-mcp) quando o cliente também precisar inspecionar ou alterar recursos de conta autenticados por meio de chamadas de API.

> [!NOTE]
> Não configure o MCP de documentação junto com o [MCP de gerenciamento de contas](/docs/pt-br/mcp-utilities/account-management-mcp) no mesmo cliente, a menos que você tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de contas já inclui funções de pesquisa de documentação; portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/documentation
```

Autentique-se com uma chave de API de conta do AIVAX:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chave e opções de autenticação, consulte [Autenticação](/docs/pt-br/authentication).

## Exemplo de configuração

A configuração exata depende do cliente MCP. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint de documentação do AIVAX e passe a chave de API como um cabeçalho.

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

### `aivax_search_documentation`

Pesquisa a documentação e o conteúdo de referência da API do AIVAX. Use esta ferramenta quando o assistente precisar de contexto do produto antes de responder ou agir.

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_terms` | `string[]` | Sim | Termos de pesquisa para consulta contra a documentação e a referência da API do AIVAX. |
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

Use frases mais completas quando a pergunta tiver uma intenção clara, como `configurações de reranker de busca semântica` ou `restrições de conclusão de chat com chave pública`. Use vários termos quando quiser cobrir conceitos vizinhos, nomes alternativos ou prováveis termos de referência da API.

As chamadas de pesquisa usam as cotas por conta documentadas em [Planos e limites](/docs/pt-br/limits#account-limits).

### `aivax_list_models`

Lista os modelos de chat integrados do AIVAX e retorna um resumo legível por modelo para cada correspondência. Use-o quando o assistente precisar escolher um modelo, explicar se um modelo está disponível para o plano atual, comparar capacidades ou entender o preço (consulte [Preços](/docs/pt-br/pricing)).

A ferramenta aceita:

| Argumento | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `name_filter` | `string` | Não | Filtro aproximado opcional para nomes de modelos, como `gpt 5`, `sonnet`, `qwen coder` ou `@openai/gpt-5-mini`. |

A resposta inclui a descrição, estabilidade, tipo, capacidades, sinalizadores e disponibilidade de cada modelo para o plano de conta autenticado. Para preços atuais, consulte [Preços](/docs/pt-br/pricing).

Exemplo de argumentos:

```json
{
  "name_filter": "gemini flash"
}
```

As chamadas de listagem de modelos usam as cotas por conta documentadas em [Planos e limites](/docs/pt-br/limits#account-limits).

## Quando usar

Use o MCP de documentação quando quiser que um assistente responda perguntas sobre o AIVAX com base em contexto respaldado pela fonte, em vez de memória. Isso é útil em IDEs, ferramentas de suporte, agentes de integração, copilotos de implementação interna e fluxos de trabalho de avaliação, onde o assistente deve pesquisar o manual antes de recomendar uma rota, parâmetro, recurso, modelo ou etapa de depuração.

Também é útil para fluxos de trabalho de criação de agentes. Antes de criar ou editar um [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md), um assistente pode pesquisar o recurso relevante, verificar as capacidades do modelo e, em seguida, explicar qual configuração deve ser usada e por quê. Por exemplo, ele pode comparar ferramentas integradas, funções MCP, funções do lado do servidor, workers, coleções RAG, respostas estruturadas e pré-processamento multimodal antes de sugerir um design.

Para solução de problemas, o MCP de documentação ajuda o assistente a passar de uma mensagem de erro para o limite de produto provável. Ele pode pesquisar regras de autenticação, limites de plano, requisitos de equilíbrio multimodal, parâmetros de pesquisa RAG, comportamento do gateway ou restrições de chave pública e, em seguida, produzir uma lista de verificação focada que reflita o comportamento do AIVAX.

Para seleção de modelos, combine `aivax_search_documentation` com `aivax_list_models`. Pesquise o manual para o requisito do recurso, como chamada de ferramenta, entrada de vídeo, saída estruturada ou contexto longo, liste os modelos correspondentes e escolha um que esteja disponível para o plano da conta.

## Escolhendo termos de pesquisa

Os bons termos de pesquisa devem descrever o objetivo do usuário, não apenas uma palavra-chave. Prefira:

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

Quando o assistente não tiver certeza de qual página contém a resposta, use `search_type: "all"`. Quando ele precisar de nomes de rotas, corpos de solicitação ou comportamento de endpoint, use `api-function-reference`. Quando ele precisar de orientação conceitual, compensações ou explicações de fluxo de trabalho, use `documentation-manual`.

## Diretrizes de segurança

O MCP de documentação é mais seguro do que uma ferramenta de gerenciamento porque é orientado à leitura, mas ainda assim autentica como uma conta do AIVAX e pode expor a disponibilidade de modelos sensíveis ao plano da conta. Conecte-o apenas a clientes que devem conhecer os modelos disponíveis da conta e o contexto da documentação.

Use uma chave de API dedicada para cada cliente MCP. Armazene-a no mecanismo de segredo do cliente ou no armazenamento de configuração local, não no controle de origem. Se um cliente precisar apenas de documentação pública e não precisar da disponibilidade de modelos específica da conta, prefira vincular diretamente ao site de documentação pública em vez de conectar um servidor MCP autenticado.
