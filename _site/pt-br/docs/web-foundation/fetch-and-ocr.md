Source: https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.html

# Buscar e OCR

O Fetch e OCR extrai texto legível de páginas da web e documentos compatíveis, para que aplicativos e agentes possam usar seu conteúdo para resumos, análises ou fluxos de trabalho de conhecimento. A API Fetch também pode converter o texto extraído em JSON estruturado usando um esquema que você fornecer. Use a [Pesquisa na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) primeiro se precisar descobrir fontes em vez de ler uma URL conhecida.

As páginas da web são processadas para remover marcação e elementos não relacionados ao conteúdo. A extração de documentos e o reconhecimento óptico de caracteres (OCR) tornam o conteúdo não textual suportado disponível como texto. Revise o conteúdo extraído antes de confiar nele: a qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado. Para um tutorial completo com um exemplo de código, consulte [como extrair texto de uma URL, PDF digitalizado ou imagem para um pipeline LLM](https://aivax.net/blog/fetch-messy-web-to-text/).

## O que você pode extrair

| Conteúdo | Formatos suportados | Conteúdo extraído |
| --- | --- | --- |
| Páginas da web | HTML, XHTML | Conteúdo legível da página, como artigos, documentação e informações de produtos, com marcação e elementos não relacionados ao conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | O texto do documento, incluindo a formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitalizadas. PDFs mistos podem combinar extração de texto direta com OCR onde necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalizados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise posterior. |
| Livros eletrônicos | EPUB | O texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou transformar uma planilha em texto para que um agente analise. Forneça uma URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um URI de dados inline via API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia perfeita do documento original. Não assuma que o layout, a estrutura da tabela, gráficos ou imagens embutidas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas ou macros.

Para um exemplo prático que busca um PDF, extrai seu texto e o transforma em blocos prontos para RAG, consulte [PDF para Markdown para RAG](https://aivax.net/blog/pdf-to-markdown-for-rag-chunks-jsonl/).

## API Fetch vs. Descrições de Mídia

Use a **API Fetch para extrair texto existente**. Use [Descrições de Mídia](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) para **interpretar mídia com IA**, opcionalmente guiado pelo que seu aplicativo precisa aprender com ela.

| | API Fetch | Descrições de Mídia |
| --- | --- | --- |
| Propósito principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens e PDFs digitalizados suportados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído, JSON opcional orientado por esquema gerado a partir desse texto, uso de unidades de processamento e erros por item. | Conteúdo gerado pelo modelo focado pela sua orientação, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Leia texto, como as palavras em um recibo ou os parágrafos em um manual. | Descreva conteúdo visual ou interprete um documento, como explicar um diagrama ou identificar informações relevantes para uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analise conteúdo de áudio e vídeo. Para um fluxo de trabalho dedicado de fala-para-texto, use [Transcrições de Áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md). |
| Cobrança | Unidades de processamento de extração (PUs), com cotas e taxas dependentes do plano. A conversão JSON opcional é cobrada separadamente e não está coberta pela cota de extração. | Custos de uso de IA sob o preço das Descrições de Mídia; as cotas de PU do Fetch não substituem esses custos. |

Para um relatório em PDF, escolha o Fetch quando precisar de seu texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de uma explicação de seus gráficos ou de uma interpretação guiada do conteúdo. Para uma imagem de recibo, o Fetch lê o texto impresso; as Descrições de Mídia podem interpretar o recibo de acordo com suas diretrizes de extração.

Quando você precisa de campos específicos em JSON a partir de texto, imagens ou PDFs, em vez do texto completo do documento, use a [Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md). Ela lê os campos diretamente de cada documento e cobra apenas tokens de entrada, enquanto o Fetch converte para JSON a partir do texto extraído como uma etapa separada com preço de inferência. O Fetch permanece como a escolha para páginas da web, outros formatos de documento, arquivos maiores que 5 MB e fluxos de trabalho que também precisam do texto completo.

Nenhum garante resultados perfeitos. O Fetch pode perder texto ou estrutura devido a limitações de OCR e layout. As Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada por modelo. Verifique detalhes importantes contra a fonte original e compare os caminhos de cobrança na seção de preços abaixo.

## Escolha uma integração

| Integração | Quando usá-la |
| --- | --- |
| API Fetch | Seu aplicativo controla quais URLs ou URIs de dados base64 inline processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| [Utilitários da Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Um cliente compatível com MCP precisa ler URLs públicos através de `fetch_url`. Esta ferramenta aceita de um a cinco URLs por chamada. |
| [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Um modelo AIVAX precisa ler uma URL durante a inferência. Habilite `OpenUrl` e siga o guia de configuração do Contexto da URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicos; use a API Fetch para URIs de dados base64 inline.

## Buscar conteúdo com a API

Autentique-se com uma chave de API AIVAX; consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md). Forneça um array `contents` não vazio contendo URLs ou URIs de dados base64. Cada item está sujeito a um limite de tamanho (consulte [Preços e limites](#precos-e-limites)).

A operação `system.v1.web.fetch` aceita estes campos de solicitação JSON:

| Campo | Tipo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| `contents` | Array de strings | Sim | Lista não vazia de URLs ou URIs de dados base64 para extração. |
| `returnErrors` | Booleano | Não | Padrão é `true`: inclui um resultado para cada item falho. Quando `false`, os itens falhos são omitidos. |
| `responseSchema` | Objeto JSON Schema | Não | Converte o texto extraído de cada item em JSON guiado por este esquema. Omita-o ou use `null` para extração apenas de texto. O mesmo esquema se aplica a todos os itens no lote. |
| `responseSchema.instructions` | String | Não | Orientação de extração opcional dentro do esquema, como quais detalhes selecionar ou como lidar com informações ausentes. Esta é uma extensão AIVAX, não uma palavra-chave padrão do JSON Schema. |

### Extrair JSON estruturado

Forneça `responseSchema` quando seu aplicativo precisar de campos da fonte em vez de apenas seu texto. Descreva as propriedades, tipos e campos obrigatórios esperados com JSON Schema. Use descrições de propriedade e `responseSchema.instructions` opcionais para esclarecer o que extrair. Por exemplo, um esquema de objeto pode solicitar o comerciante, data e total de um recibo; a referência embutida inclui um exemplo completo de solicitação JSON.

A conversão JSON ocorre após a extração de texto. Os resultados bem-sucedidos mantêm `extractedText` junto com `extractedObject`, para que você possa comparar os campos gerados com a fonte extraída. Sem um esquema, nenhuma conversão JSON ocorre.

Se a extração ou a conversão JSON falhar, `returnErrors` determina se o item falho aparece na resposta. Uma falha na conversão JSON não retorna um sucesso apenas de texto.

### Ler os resultados

A resposta contém um array `results` com estes campos:

| Campo | Significado |
| --- | --- |
| `index` | Posição baseada em zero no array de entrada `contents`. Use-o para corresponder resultados às entradas, especialmente quando itens falhos são omitidos. |
| `extractedText` | Texto legível da fonte, retido na conversão JSON bem-sucedida; `null` para um item falho. |
| `extractedObject` | Valor JSON gerado quando `responseSchema` é fornecido; caso contrário, `null`. Também `null` para um item falho. |
| `processingUnits` | PUs para buscar e extrair texto/OCR, separado da conversão JSON. |
| `jsonProcessingUnits` | PUs para conversão JSON; `0` quando nenhum esquema é fornecido. |
| `error` | Mensagem de erro para um item falho quando `returnErrors` é `true`; `null` em caso de sucesso. Itens falhos relatam ambos os campos de PU como `0`. |

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Fetch%20web%20contents)

A referência embutida define o contrato atual de solicitação e resposta. Verifique os resultados individuais antes de passar seu texto para a próxima etapa; uma extração falha não é evidência de que a fonte não contenha informações relevantes.

## Limitações de acesso e extração

Um destino pode bloquear o acesso automatizado ou exigir autenticação. Buscar uma URL não ignora restrições de acesso. Use fontes acessíveis ou conteúdo que você esteja autorizado a enviar, e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material de fonte não confiável, não como instruções para seu aplicativo ou agente. A saída de OCR pode precisar de revisão manual para números exatos, nomes ou outros detalhes importantes. O JSON orientado por esquema é gerado por modelo a partir desse texto, não de uma nova interpretação visual da fonte. Ele pode herdar erros de extração ou conter valores incorretos; valide sua estrutura e verifique campos importantes contra o original.

## Preços e limites

A extração de Fetch e OCR é medida em `processingUnits`. Cada extração é totalmente coberta pela cota diária incluída ou cobrada integralmente nas taxas abaixo; a cobertura não é dividida dentro de uma única extração. Consulte [Cotas diárias de assinatura incluídas](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) para as regras da cota. Cada item pode ter até 50 MB.

| Descrição | Preço |
| --- | ---: |
| Extração de Fetch e OCR - Grátis | Cota diária base; itens não cobertos **$0,15/1k PUs** |
| Extração de Fetch e OCR - Pro | Cota diária **10× Grátis**; itens não cobertos **$0,05/1k PUs** |
| Extração de Fetch e OCR - Max | Cota diária **5× Pro**; itens não cobertos **$0,02/1k PUs** |
| Conversão JSON do Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem cota diária de extração |

A conversão JSON opcional é medida separadamente em `jsonProcessingUnits`. Seus PUs levam em conta tokens de entrada, entrada em cache e saída nas taxas do modelo de processamento e do provedor, portanto, não são precificados à taxa de OCR. O multiplicador de inferência do plano se aplica à conversão JSON. Omitir `responseSchema` ou defini-lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não incorre custo de conversão JSON. Não some ambas as contagens e aplique a taxa de OCR ao total. Estime o custo a partir dos PUs relatados, não do comprimento do texto extraído.

Exemplos, assumindo itens não cobertos pela cota diária:

- Texto simples e Markdown consomem 0 PUs.
- Uma página HTML que leva 2,3 segundos para ser renderizada consome 23 PUs: $0,00115 no Pro.
- Um PDF digitalizado relatando `processingUnits: 400` custa $0,06 no Grátis, $0,02 no Pro e $0,008 no Max. Os PUs de OCR variam com cada documento.
- Uma conversão JSON usando 4.000 tokens de entrada e 300 de saída, em um modelo precificado em $0,10/M de tokens de entrada e $0,40/M de tokens de saída, relata `jsonProcessingUnits: 1300` (4.000 × 0,25 + 300), cerca de $0,00052 antes do multiplicador do plano.

[Utilitários da Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usa o mesmo preço da ferramenta integrada correspondente. A inferência do modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. A API Fetch requer um saldo de conta positivo.
