Source: https://docs.aivax.net/pt-br/docs/web-foundation/web-search.html

# Pesquisa na Web

A Pesquisa na Web recupera informações atuais da internet para pesquisa, verificação de fatos e respostas que precisam de fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) quando já tiver uma URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usar |
| --- | --- |
| [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Habilite `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [MCP de utilidades web](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Dê a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |
| API direta | Chame o endpoint de pesquisa a partir do seu backend quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de conjuntos de dados ou pré‑busca de contexto antes da inferência. |

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Consulte os [Changelogs](https://docs.aivax.net/pt-br/docs/changelogs.md) para detalhes.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data, versão de produto ou localização relevante. Para várias perguntas independentes, use pesquisas separadas em vez de combinar tópicos não relacionados em uma única consulta.

Para requisições de API direta, limite os resultados com `country` (código de país de duas letras), `language` (código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar mais resultados (veja [Limites de requisição e payload](https://docs.aivax.net/pt-br/docs/limits.md#request-and-payload-limits)) quando a recordação for importante, como ao pesquisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para parâmetros da ferramenta de Pesquisa na Web integrada, consulte sua [referência](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e recupere as páginas relevantes antes de confiar em detalhes que um resumo de resultado possa omitir. Mantenha os links das fontes com a resposta para que os leitores possam verificar as afirmações.

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência da API

Para o contrato de requisição, resposta, autenticação e erros suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Search%20the%20web)

## Preços e limites

A Pesquisa na Web é cobrada por pesquisa. Chamadas através do [MCP de utilidades web](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) utilizam o mesmo preço da ferramenta integrada correspondente e são cobradas na conta autenticada. A inferência do modelo, quando usada, é cobrada separadamente.

Consulte a página de [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para as cobranças atuais da Pesquisa na Web e pesquisa avançada, e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para cotas de conta e limites de taxa.
