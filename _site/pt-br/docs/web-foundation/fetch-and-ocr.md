Source: https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.html

# Buscar e OCR

Buscar e OCR extrai texto legível de páginas da web e documentos suportados para que aplicativos e agentes possam usar seu conteúdo para resumos, análises ou fluxos de conhecimento. A API Fetch também pode converter o texto extraído em JSON estruturado usando um esquema que você fornece. Use [Web Search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) primeiro se precisar descobrir fontes em vez de ler um URL conhecido.

Páginas da web são processadas para remover marcações e elementos não relacionados ao conteúdo. A extração de documentos e o reconhecimento óptico de caracteres (OCR) tornam o conteúdo não textual suportado disponível como texto. Revise o conteúdo extraído antes de confiar nele: a qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado. Para um tutorial completo com um exemplo de código, veja [how to extract text from a URL, scanned PDF or image for an LLM pipeline](https://aivax.net/blog/fetch-messy-web-to-text/).

## O que você pode extrair

| Conteúdo | Formatos suportados | Conteúdo extraído |
| --- | --- | --- |
| Páginas da web | HTML, XHTML | Conteúdo da página legível, como artigos, documentação e informações de produto, com marcações e elementos não relacionados ao conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | O texto do documento, incluindo a formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitalizadas. PDFs mistos podem combinar extração direta de texto com OCR quando necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalizados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise subsequente. |
| E-books | EPUB | Texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou transformar uma planilha em texto para que um agente analise. Forneça um URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um URI de dados através da API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia pixel a perfeita do documento original. Não presuma que o layout, a estrutura de tabelas, gráficos ou imagens incorporadas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas ou macros.

## API Fetch vs. Descrições de Mídia

Use a **API Fetch para extrair texto existente**. Use [Media Descriptions](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) para **interpretar mídia com IA**, opcionalmente guiado pelo que sua aplicação precisa aprender a partir dela.

|  | API Fetch | Descrições de Mídia |
| --- | --- | --- |
| Objetivo principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens suportadas e PDFs digitalizados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído, JSON opcional guiado por esquema gerado a partir desse texto, uso de unidades de processamento e erros por item. | Conteúdo gerado por modelo focado na sua orientação, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Ler texto, como as palavras em um recibo ou os parágrafos de um manual. | Descrever conteúdo visual ou interpretar um documento, como explicar um diagrama ou identificar informações relevantes para uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analisar conteúdo de áudio e vídeo. Para um fluxo de trabalho dedicado de fala para texto, use [Audio Transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md). |
| Faturamento | Unidades de processamento de extração (PUs), com limites e tarifas dependentes do plano. Conversão opcional para JSON é cobrada separadamente e não está coberta pelo limite de extração. | Cobranças de uso de IA sob a precificação de Descrições de Mídia; os limites de PU da Fetch não substituem essas cobranças. |

Para um relatório em PDF, escolha Fetch quando precisar do texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de uma explicação de seus gráficos ou de uma interpretação guiada do conteúdo. Para uma imagem de recibo, Fetch lê o texto impresso; Descrições de Mídia podem interpretar o recibo de acordo com sua orientação de extração.

Quando precisar de campos específicos como JSON a partir de texto, imagens ou PDFs, em vez do texto completo do documento, use [Extraction](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md). Ele lê os campos diretamente de cada documento e cobra apenas os tokens de entrada, enquanto Fetch converte para JSON a partir do texto extraído como uma etapa separada, cobrada por inferência. Fetch continua sendo a escolha para páginas da web, outros formatos de documento, arquivos maiores que 5 MB e fluxos de trabalho que também precisam do texto completo.

Nenhum garante resultados perfeitos. Fetch pode perder texto ou estrutura devido a limitações de OCR e layout. Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada por modelo. Verifique detalhes relevantes contra a fonte original e compare os caminhos de cobrança na seção de preços abaixo.

## Escolha uma integração

| Integração | Quando usar |
| --- | --- |
| API Fetch | Seu aplicativo controla quais URLs ou URIs de dados base64 embutidos processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| Utilitários web MCP | Um cliente compatível com MCP precisa ler URLs públicas através de `fetch_url`. Esta ferramenta aceita de um a cinco URLs por chamada. |
| Ferramentas integradas | Um modelo AIVAX precisa ler um URL durante a inferência. Habilite `OpenUrl` e siga o guia de configuração de Contexto de URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicas; use a API Fetch para URIs de dados base64 embutidos.

## Buscar conteúdo com a API

Autentique-se com uma chave de API AIVAX; veja [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md). Forneça um array `contents` não vazio contendo URLs ou URIs de dados base64. Cada item está sujeito a um limite de tamanho (veja [Pricing and limits](#pricing-and-limits)).

A operação `system.v1.web.fetch` aceita os seguintes campos de requisição JSON:

| Campo | Tipo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| `contents` | Array de strings | Sim | Lista não vazia de URLs ou URIs de dados base64 para extrair. |
| `returnErrors` | Booleano | Não | Padrão `true`: inclui um resultado para cada item falhado. Quando `false`, itens falhados são omitidos. |
| `responseSchema` | Objeto JSON Schema | Não | Converte o texto extraído de cada item em JSON guiado por este esquema. Omitir ou usar `null` para extração apenas de texto. O mesmo esquema se aplica a todos os itens no lote. |
| `responseSchema.instructions` | String | Não | Orientação opcional de extração dentro do esquema, como quais detalhes selecionar ou como lidar com informações ausentes. Esta é uma extensão AIVAX, não uma palavra‑chave padrão de JSON Schema. |

### Extrair JSON estruturado

Forneça `responseSchema` quando seu aplicativo precisar de campos da fonte em vez de apenas seu texto. Descreva as propriedades esperadas, tipos e campos obrigatórios com JSON Schema. Use descrições de propriedades e `responseSchema.instructions` opcional para esclarecer o que extrair. Por exemplo, um esquema de objeto pode solicitar o comerciante, data e total de um recibo; a referência embutida inclui um exemplo completo de requisição JSON.

A conversão para JSON ocorre após a extração de texto. Resultados bem‑sucedidos mantêm `extractedText` junto com `extractedObject`, para que você possa comparar os campos gerados com a fonte extraída. Sem um esquema, nenhuma conversão para JSON é executada.

Se a extração ou a conversão para JSON falhar, `returnErrors` determina se o item falhado aparece na resposta. Uma falha na conversão para JSON não retorna um sucesso apenas de texto.

### Ler os resultados

A resposta contém um array `results` com estes campos:

| Campo | Significado |
| --- | --- |
| `index` | Posição baseada em zero no array `contents` de entrada. Use para corresponder resultados às entradas, especialmente quando itens falhados são omitidos. |
| `extractedText` | Texto fonte legível, mantido na conversão JSON bem‑sucedida; `null` para um item falhado. |
| `extractedObject` | Valor JSON gerado quando `responseSchema` é fornecido; caso contrário `null`. Também `null` para um item falhado. |
| `processingUnits` | PUs para busca e extração de texto/OCR, separado da conversão JSON. |
| `jsonProcessingUnits` | PUs para conversão JSON; `0` quando nenhum esquema é fornecido. |
| `error` | Mensagem de erro para um item falhado quando `returnErrors` é `true`; `null` em caso de sucesso. It falhados relatam ambos os campos de PU como `0`. |

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Fetch%20web%20contents)

A referência embutida define o contrato de requisição e resposta atual. Verifique resultados individuais antes de passar seu texto para a próxima etapa; uma extração falhada não é prova de que a fonte não contém informações relevantes.

## Limitações de acesso e extração

Um destino pode bloquear acesso automatizado ou exigir autenticação. Buscar um URL não contorna restrições de acesso. Use fontes acessíveis ou conteúdo que você está autorizado a submeter, e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material de fonte não confiável, não como instruções para seu aplicativo ou agente. A saída de OCR pode precisar de revisão manual para números exatos, nomes ou outros detalhes relevantes. JSON guiado por esquema é gerado por modelo a partir desse texto, não a partir de uma nova interpretação visual da fonte. Pode herdar erros de extração ou conter valores incorretos; valide sua estrutura e verifique campos relevantes contra o original.

## Preços e limites

A extração de Buscar e OCR é medida em `processingUnits`. Cada extração ou é totalmente coberta pela cota diária incluída ou cobrada integralmente nas tarifas abaixo; a cobertura não é dividida dentro de uma única extração. Veja [Included daily subscription allowances](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) para as regras de cota. Cada item pode ter até 10 MB.

| Descrição | Preço |
| --- | ---: |
| Extração de Buscar e OCR - Gratuita | Cota diária base; itens não cobertos **$0.15/1k PUs** |
| Extração de Buscar e OCR - Pro | **10× Gratuita** cota diária; itens não cobertos **$0.05/1k PUs** |
| Extração de Buscar e OCR - Max | **5× Pro** cota diária; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem cota diária de extração |

A conversão opcional para JSON é medida separadamente em `jsonProcessingUnits`. Seus PUs contabilizam tokens de entrada, entrada em cache e saída nas tarifas do modelo de processamento e do provedor, portanto não são precificados à taxa de OCR. O multiplicador de inferência do plano se aplica à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON. Não some ambas as contagens e aplique a taxa de OCR ao total. Estime o custo a partir dos PUs relatados, não do comprimento do texto extraído.

Exemplos, assumindo itens não cobertos pela cota diária:

- Texto simples e Markdown não consomem PUs.
- Uma página HTML que leva 2,3 segundos para renderizar consome 23 PUs: $0,00115 no Pro.
- Um PDF digitalizado que relata `processingUnits: 400` custa $0,06 no Gratuito, $0,02 no Pro e $0,008 no Max. Os PUs de OCR variam com cada documento.
- Uma conversão JSON usando 4.000 tokens de entrada e 300 de saída, em um modelo com preço de $0,10 por M de entrada e $0,40 por M de saída, relata `jsonProcessingUnits: 1300` (4.000 × 0,25 + 300), cerca de $0,00052 antes do multiplicador do plano.

[Utilitários web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usa a mesma precificação da ferramenta integrada correspondente. Inferência de modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. A API Fetch requer um saldo de conta positivo.
