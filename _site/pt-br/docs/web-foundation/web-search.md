Source: https://docs.aivax.net/pt-br/docs/web-foundation/web-search.html

# Pesquisa na Web

A Pesquisa na Web obtém informações atuais da internet para pesquisa, verificação de fatos e respostas que precisam de fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) quando já tiver um URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usar |
| --- | --- |
| [Built-in tools](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Habilite `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Dê a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar inferência de modelo AIVAX. |
| API direta | Chame o endpoint de pesquisa a partir do seu backend quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de datasets ou pré‑busca de contexto antes da inferência. |

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Veja [Changelogs](https://docs.aivax.net/pt-br/docs/changelogs.md) para detalhes.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data relevante, versão do produto ou localização. Para várias perguntas independentes, use buscas separadas em vez de combinar tópicos não relacionados em uma única consulta.

Para requisições de API direta, restrinja os resultados com `country` (código de país de duas letras), `language` (código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar até 25 resultados quando a recordação for importante, como ao pesquisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para os parâmetros da ferramenta de Pesquisa na Web embutida, veja sua [referência](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e recupere as páginas relevantes antes de confiar em detalhes que o resumo do resultado pode omitir. Mantenha os links das fontes junto à resposta para que os leitores possam verificar as afirmações.

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência da API

Para o contrato de requisição, resposta, autenticação e erros suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Search%20the%20web)

## Preços e limites

A Pesquisa na Web é cobrada por pesquisa. Chamadas através de [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usam o mesmo preço da ferramenta embutida correspondente e são cobradas na conta autenticada. A inferência do modelo, quando utilizada, é cobrada separadamente.

Veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) para os preços atuais da Pesquisa na Web e de buscas avançadas, e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) para cotas de conta e limites de taxa.
