---
{title: Busca e OCR,linkTitle: Busca e OCR,weight: 240,group: Web Foundation,sourceHash: cd37df0bcda883b2,aliases: [/docs/pt-br/web-foundation/fetch-and-ocr.html]}
---

# Busca e OCR

Fetch e OCR extrai texto legível de páginas da web e documentos suportados para que aplicativos e agentes possam usar seu conteúdo para resumos, análises ou fluxos de trabalho de conhecimento. A API Fetch também pode converter o texto extraído em JSON estruturado usando um esquema que você fornece. Use [Busca na Web](web-search.md) primeiro se precisar descobrir fontes ao invés de ler um URL conhecido.

Páginas da web são processadas para remover marcação e elementos não relacionados ao conteúdo. Extração de documentos e reconhecimento óptico de caracteres (OCR) tornam o conteúdo não textual suportado disponível como texto. Revise o conteúdo extraído antes de confiar nele: qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado.

## O que você pode extrair

| Conteúdo | Formatos suportados | Conteúdo extraído |
| --- | --- | --- |
| Páginas da web | HTML, XHTML | Conteúdo de página legível, como artigos, documentação e informações de produto, com marcação e elementos não relacionados ao conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | Texto do documento, incluindo formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitalizadas. PDFs mistos podem combinar extração direta de texto com OCR quando necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalizados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise posterior. |
| E-books | EPUB | Texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou transformar uma planilha em texto para um agente analisar. Forneça um URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um URI de dados através da API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia pixel-perfeita do documento original. Não presuma que layout, estrutura de tabelas, gráficos ou imagens incorporadas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas ou macros.

## API Fetch vs. Descrições de Mídia

Use a **API Fetch para extrair texto existente**. Use [Descrições de Mídia](/docs/pt-br/generations/media-descriptions) para **interpretar mídia com IA**, opcionalmente guiado pelo que sua aplicação precisa aprender a partir dela.

|  | API Fetch | Descrições de Mídia |
| --- | --- | --- |
| Objetivo principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens suportadas e PDFs digitalizados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído, JSON opcional guiado por esquema gerado a partir desse texto, uso de unidades de processamento e erros por item. | Conteúdo gerado por modelo focado por sua orientação, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Ler texto, como as palavras em um recibo ou os parágrafos em um manual. | Descrever conteúdo visual ou interpretar um documento, como explicar um diagrama ou identificar informações relevantes para uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analisar conteúdo de áudio e vídeo. Para um fluxo de trabalho dedicado de fala para texto, use [Transcrições de Áudio](/docs/pt-br/generations/audio-transcriptions). |
| Faturamento | Unidades de processamento de extração (PUs), com cotas e tarifas dependentes do plano. Conversão JSON opcional é cobrada separadamente e não está coberta pela cota de extração. | Cobranças de uso de IA sob preço de Descrições de Mídia; as cotas de PU de Fetch não substituem essas cobranças. |

Para um relatório em PDF, escolha Fetch quando precisar do texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de uma explicação de seus gráficos ou de uma interpretação guiada do conteúdo. Para uma imagem de recibo, Fetch lê o texto impresso; Descrições de Mídia pode interpretar o recibo de acordo com sua orientação de extração.

Nenhum garante resultados perfeitos. Fetch pode perder texto ou estrutura devido a limitações de OCR e layout. Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada por modelo. Verifique detalhes consequentes contra a fonte original e compare os caminhos de faturamento na seção de preços abaixo.

## Escolha uma integração

| Integração | Quando usar |
| --- | --- |
| API Fetch | Sua aplicação controla quais URLs ou URIs de dados base64 em linha processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| [Web utilities MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) | Um cliente compatível com MCP precisa ler URLs públicas através de `fetch_url`. Esta ferramenta aceita de um a cinco URLs por chamada. |
| [Built-in tools](/docs/pt-br/tools/builtin-tools) | Um modelo AIVAX precisa ler uma URL durante a inferência. Habilite `OpenUrl` e siga o guia de configuração de Contexto de URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicas; use a API Fetch para URIs de dados base64 em linha.

## Buscar conteúdo com a API

Autentique-se com uma chave de API AIVAX; veja [Autenticação](/docs/pt-br/authentication). Forneça um array `contents` não vazio contendo URLs ou URIs de dados base64. Cada item está sujeito a um limite de tamanho; veja [Limites de requisição e payload](/docs/pt-br/limits#request-and-payload-limits).

A operação `system.v1.web.fetch` aceita os seguintes campos de requisição JSON:

| Campo | Tipo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| `contents` | Array de strings | Sim | Lista não vazia de URLs ou URIs de dados base64 para extrair. |
| `returnErrors` | Boolean | Não | Padrão `true`: inclui um resultado para cada item falhado. Quando `false`, itens falhados são omitidos. |
| `responseSchema` | Objeto JSON Schema | Não | Converte o texto extraído de cada item em JSON guiado por este esquema. Omitir ou usar `null` para extração apenas de texto. O mesmo esquema se aplica a todos os itens no lote. |
| `responseSchema.instructions` | String | Não | Orientação opcional de extração dentro do esquema, como quais detalhes selecionar ou como lidar com informações ausentes. Esta é uma extensão AIVAX, não uma palavra-chave padrão do JSON Schema. |

### Extrair JSON estruturado

Forneça `responseSchema` quando sua aplicação precisa de campos da fonte ao invés de apenas o texto. Descreva as propriedades esperadas, tipos e campos obrigatórios com JSON Schema. Use descrições de propriedades e `responseSchema.instructions` opcional para esclarecer o que extrair. Por exemplo, um esquema de objeto pode solicitar o comerciante, data e total de um recibo; a referência embutida inclui um exemplo completo de requisição JSON.

A conversão JSON ocorre após a extração de texto. Resultados bem‑sucedidos mantêm `extractedText` ao lado de `extractedObject`, para que você possa comparar os campos gerados com a fonte extraída. Sem um esquema, nenhuma conversão JSON ocorre.

Se a extração ou conversão JSON falhar, `returnErrors` determina se o item falhado aparece na resposta. Uma falha na conversão JSON não retorna um sucesso apenas de texto.

### Ler os resultados

A resposta contém um array `results` com estes campos:

| Campo | Significado |
| --- | --- |
| `index` | Posição baseada em zero no array de entrada `contents`. Use para combinar resultados com entradas, especialmente quando itens falhados são omitidos. |
| `extractedText` | Texto fonte legível, mantido em conversão JSON bem‑sucedida; `null` para um item falhado. |
| `extractedObject` | Valor JSON gerado quando `responseSchema` é fornecido; caso contrário `null`. Também `null` para um item falhado. |
| `processingUnits` | PUs para busca e extração de texto/OCR, separado da conversão JSON. |
| `jsonProcessingUnits` | PUs para conversão JSON; `0` quando nenhum esquema é fornecido. |
| `error` | Mensagem de erro para um item falhado quando `returnErrors` é `true`; `null` em sucesso. It falhados reportam ambos os campos PU como `0`. |

<script src="https://inference.aivax.net/apidocs?embed-target=Fetch%20web%20contents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A referência embutida define o contrato atual de requisição e resposta. Verifique resultados individuais antes de passar seu texto para a próxima etapa; uma extração falhada não é evidência de que a fonte não contém informações relevantes.

## Limitações de acesso e extração

Um destino pode bloquear acesso automatizado ou exigir autenticação. Buscar uma URL não contorna restrições de acesso. Use fontes acessíveis ou conteúdo que você está autorizado a submeter, e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material de fonte não confiável, não como instruções para sua aplicação ou agente. A saída de OCR pode precisar de revisão manual para números exatos, nomes ou outros detalhes relevantes. JSON guiado por esquema é gerado por modelo a partir desse texto, não de uma nova interpretação visual da fonte. Pode herdar erros de extração ou conter valores incorretos; valide sua estrutura e verifique campos relevantes contra o original.

## Preços e limites

A extração de Busca e OCR é medida em `processingUnits`. Cotas diárias incluídas e tarifas para extração não coberta dependem do plano da conta. Cada extração ou é totalmente coberta ou cobrada integralmente; a cobertura não é dividida dentro de uma extração. Conversão JSON opcional é medida separadamente em `jsonProcessingUnits`, com preço de PU baseado em inferência variável e sem cobertura da cota diária de extração. Não some ambas as contagens e aplique a taxa de OCR ao total. Veja [Preços](/docs/pt-br/pricing#web-search-ocr-and-fetch) para cotas e cobranças ao invés de estimar custo a partir do comprimento do texto extraído.

[Web utilities MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) usa a mesma precificação da ferramenta embutida correspondente. Inferência de modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. Veja [Planos e limites](/docs/pt-br/limits) para cotas de conta e limites de taxa. A API Fetch requer um saldo de conta positivo.
