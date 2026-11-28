---
{title: Pesquisa na Web,linkTitle: Pesquisa na Web,weight: 10,group: Web Foundation,sourceHash: 3416f4564c35984e,aliases: [/docs/pt-br/web-foundation/web-search.html]}
---

# Pesquisa na Web

A Pesquisa na Web recupera informações atualizadas da internet para pesquisa, verificação de fatos e respostas que exigem fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Buscar e OCR](fetch-and-ocr.md) quando você já tiver uma URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usá-la |
| --- | --- |
| [Ferramentas integradas](/docs/pt-br/tools/builtin-tools) | Permita que um modelo AIVAX decida quando pesquisar durante a inferência. Ative `WebSearch` no gateway ou na configuração `builtin_tools` da solicitação. |
| [MCP de utilitários web](/docs/pt-br/mcp-utilities/web-utilities-mcp) | Conceda a um agente, IDE ou cliente de automação compatível com MCP acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |
| API direta | Chame o endpoint de pesquisa a partir do seu back-end quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de conjuntos de dados ou busca antecipada de contexto antes da inferência. |

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data relevante, versão do produto ou localização. Para várias perguntas independentes, use pesquisas separadas em vez de combinar tópicos não relacionados em uma única consulta.

Para solicitações de API direta, restrinja os resultados usando `country` (um código de país de duas letras), `language` (um código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar mais resultados (1–25 por solicitação de API direta) quando a recuperação for importante, como ao analisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para os parâmetros da ferramenta de Pesquisa na Web integrada, consulte sua [referência](/docs/pt-br/tools/builtin-tools).

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique as datas de publicação, prefira fontes primárias e busque as páginas relevantes antes de confiar em detalhes que um resumo de resultado pode omitir. Mantenha os links das fontes junto com a resposta para que os leitores possam verificar as afirmações. Para um pipeline que encadeia pesquisa e busca e mantém as evidências, consulte [API de pesquisa na web vs. busca de página para pesquisa LLM](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência da API

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Search%20the%20web&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Geração assíncrona

Adicione `"async": true` para colocar a pesquisa em fila, o que é útil para monitores agendados e enriquecimento de conjuntos de dados. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado posteriormente ou recebe um webhook quando ele estiver concluído. Consulte [Gerações assíncronas](/docs/pt-br/inference/batch/async-generations.md).

```json
{
  "query": "latest artificial intelligence research",
  "topn": 5,
  "async": true
}
```

## Preços e limites

A Pesquisa na Web é cobrada por pesquisa. As chamadas através do [MCP de utilitários web](/docs/pt-br/mcp-utilities/web-utilities-mcp) usam os mesmos preços da ferramenta integrada correspondente e são cobradas na conta autenticada. A inferência do modelo, quando usada, é cobrada separadamente.

| Descrição | Preço |
| --- | ---: |
| Pesquisa na web | **$5/1k pesquisas** |
| Pesquisa no X (Twitter) | **$5/1k pesquisas** |

As solicitações de API direta retornam 1–25 resultados por solicitação (`topn`).

A pesquisa na web integrada e a pesquisa no X/Twitter têm limites diários de plano, e a pesquisa no X/Twitter não está disponível no plano Gratuito; consulte [Ferramentas integradas e limites de pesquisa na web](/docs/pt-br/pricing/plans-and-limits.md#built-in-tools-and-web-search).
