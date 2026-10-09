---
{title: Pesquisa na Web,linkTitle: Pesquisa na Web,weight: 230,group: Web Foundation,sourceHash: f9f0bf2299abb904,aliases: [/docs/pt-br/web-foundation/web-search.html]}
---

# Pesquisa na Web

A Pesquisa na Web recupera informações atuais da internet para pesquisa, verificação de fatos e respostas que precisam de fontes além dos dados de treinamento do modelo. Use-a para descobrir páginas relevantes; use [Fetch and OCR](fetch-and-ocr.md) quando já tiver uma URL ou precisar ler uma fonte com mais detalhes.

## Escolha como usar a Pesquisa na Web

| Integração | Quando usar |
| --- | --- |
| [Ferramentas integradas](/docs/pt-br/tools/builtin-tools) | Deixe um modelo AIVAX decidir quando pesquisar durante a inferência. Habilite `WebSearch` no gateway ou na configuração `builtin_tools` da requisição. |
| [MCP de utilidades web](/docs/pt-br/mcp-utilities/web-utilities-mcp) | Dê a um agente compatível com MCP, IDE ou cliente de automação acesso à ferramenta `web_search` sem executar a inferência de um modelo AIVAX. |
| API direta | Chame o endpoint de pesquisa a partir do seu backend quando nenhum modelo ou agente estiver envolvido — monitores agendados, enriquecimento de conjuntos de dados ou pré‑busca de contexto antes da inferência. |

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Consulte os [Changelogs](/docs/pt-br/changelogs) para detalhes.

## Pesquise e verifique fontes

Escreva uma consulta focada que inclua o tópico e qualquer data, versão de produto ou localização relevante. Para várias perguntas independentes, use pesquisas separadas em vez de combinar tópicos não relacionados em uma única consulta.

Para requisições de API direta, limite os resultados com `country` (código de país de duas letras), `language` (código de idioma) e `includeDomains` (domínios confiáveis). Defina `topn` para solicitar mais resultados (veja [Limites de requisição e payload](/docs/pt-br/limits#request-and-payload-limits)) quando a recordação for importante, como ao pesquisar fontes concorrentes; caso contrário, mantenha a contagem padrão pequena. Para parâmetros da ferramenta de Pesquisa na Web integrada, consulte sua [referência](/docs/pt-br/tools/builtin-tools).

Os resultados da pesquisa ajudam a localizar evidências; eles não garantem que uma fonte seja precisa ou atual. Verifique datas de publicação, prefira fontes primárias e recupere as páginas relevantes antes de confiar em detalhes que um resumo de resultado possa omitir. Mantenha os links das fontes com a resposta para que os leitores possam verificar as afirmações.

Trate o texto recuperado como conteúdo externo e não confiável, não como instruções para seu agente.

## Referência da API

Para o contrato de requisição, resposta, autenticação e erros suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Search%20the%20web&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços e limites

A Pesquisa na Web é cobrada por pesquisa. Chamadas através do [MCP de utilidades web](/docs/pt-br/mcp-utilities/web-utilities-mcp) utilizam o mesmo preço da ferramenta integrada correspondente e são cobradas na conta autenticada. A inferência do modelo, quando usada, é cobrada separadamente.

Consulte a página de [Preços](/docs/pt-br/pricing) para as cobranças atuais da Pesquisa na Web e pesquisa avançada, e [Planos e limites](/docs/pt-br/limits) para cotas de conta e limites de taxa.
