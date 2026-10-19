Source: https://docs.aivax.net/pt-br/docs/web-foundation/web-search.html

# Pesquisa na Web

A Pesquisa na Web recupera informações atuais da internet para pesquisa, verificação de fatos e respostas que exigem fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) quando já possuir um URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usar |
| --- | --- |
| [Ferramentas internas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Ative `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [Utilitários Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Conceda a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |
| API Direta | Chame o endpoint de pesquisa do seu backend quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de conjunto de dados ou pré‑busca de contexto antes da inferência. |

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Veja [Changelogs](https://docs.aivax.net/pt-br/docs/legal/changelogs.md) para detalhes.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data, versão de produto ou localização relevante. Para várias perguntas independentes, use pesquisas separadas ao invés de combinar tópicos não relacionados em uma única consulta.

Para solicitações de API direta, restrinja os resultados com `country` (código de país de duas letras), `language` (código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar mais resultados (1–25 por solicitação de API direta) quando a lembrança for importante, como ao analisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para os parâmetros da ferramenta de Pesquisa na Web interna, veja sua [referência](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e recupere as páginas relevantes antes de confiar em detalhes que um resumo de resultado pode omitir. Mantenha os links das fontes junto à resposta para que os leitores possam verificar as alegações. Para um pipeline que encadeia pesquisa e busca e mantém a evidência, veja [web search API vs. page fetch for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência da API

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Search%20the%20web)

## Preços e limites

A Pesquisa na Web é cobrada por pesquisa. Chamadas através de [Utilitários Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usam o mesmo preço da ferramenta interna correspondente e são cobradas na conta autenticada. A inferência do modelo, quando usada, é cobrada separadamente.

| Descrição | Preço |
| --- | ---: |
| Pesquisa na Web | **$5/1k searches** |
| Pesquisa X (Twitter) | **$5/1k searches** |

Solicitações de API direta retornam 1–25 resultados por solicitação (`topn`).

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Pesquisa na Web interna | 15/dia | 1.000/dia | 10.000/dia |
| Pesquisa X/Twitter interna | Não disponível | 1.000/dia | 10.000/dia |
