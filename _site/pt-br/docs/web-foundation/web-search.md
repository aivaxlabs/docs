Source: https://docs.aivax.net/pt-br/docs/web-foundation/web-search.html

# Pesquisa na Web

A Pesquisa na Web recupera informações atuais da internet para pesquisa, verificação de fatos e respostas que precisam de fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) quando já tiver um URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usar |
| --- | --- |
| [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Ative `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [Utilitários da Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Dê a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |
| API direta | Chame o endpoint de busca do seu backend quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de conjuntos de dados ou pré‑busca de contexto antes da inferência. |

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Consulte [Changelogs](https://docs.aivax.net/pt-br/docs/changelogs.md) para detalhes.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data relevante, versão do produto ou localização. Para várias perguntas independentes, use buscas separadas ao invés de combinar tópicos não relacionados em uma única consulta.

Para requisições diretas à API, restrinja os resultados com `country` (código de país de duas letras), `language` (código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar mais resultados (veja [Request and payload limits](https://docs.aivax.net/pt-br/docs/limits.md#request-and-payload-limits)) quando a abrangência for importante, como ao analisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para os parâmetros da ferramenta de Busca na Web integrada, veja sua [reference](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

Os resultados da busca ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e recupere as páginas relevantes antes de confiar em detalhes que o resumo do resultado possa omitir. Mantenha os links das fontes junto à resposta para que os leitores possam verificar as afirmações. Para um pipeline que encadeia busca e captura e mantém a evidência, veja [web search API vs. page fetch for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência de API

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Search%20the%20web)

## Preços e limites

A Pesquisa na Web é cobrada por busca. Chamadas através de [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usam o mesmo preço da ferramenta integrada correspondente e são cobradas na conta autenticada. A inferência do modelo, quando utilizada, é cobrada separadamente.

Consulte [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) para as tarifas atuais da Pesquisa na Web e buscas avançadas, e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) para cotas de conta e limites de taxa.
