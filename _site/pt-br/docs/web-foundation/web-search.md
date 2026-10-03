Source: https://docs.aivax.net/pt-br/docs/web-foundation/web-search.html

# Busca na Web

A Busca na Web recupera informações atuais da internet para pesquisa, verificação de fatos e respostas que precisam de fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) quando já tiver uma URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Busca na Web

| Integração | Quando usar |
| --- | --- |
| [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Ative `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Dê a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |

Para pesquisas de múltiplas etapas em vez de uma consulta rápida, veja `AdvancedWebUsage` em [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md). É uma capacidade separada com cobrança diferente da Busca na Web padrão.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data relevante, versão do produto ou localização. Para várias perguntas independentes, use pesquisas separadas ao invés de combinar tópicos não relacionados em uma única consulta.

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e busque as páginas relevantes antes de confiar em detalhes que o resumo do resultado pode omitir. Mantenha os links das fontes com a resposta para que os leitores possam verificar as alegações.

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para o seu agente.

## Preços e limites

A Busca na Web é cobrada por pesquisa. Chamadas através de [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) utilizam a mesma precificação da ferramenta integrada correspondente e são cobradas na conta autenticada. A inferência do modelo, quando usada, é cobrada separadamente.

Consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para as cobranças atuais da Busca na Web e pesquisas avançadas, e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para cotas de conta e limites de taxa.
