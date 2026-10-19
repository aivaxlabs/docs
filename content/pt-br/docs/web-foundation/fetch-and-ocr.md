---
{title: Busca e OCR,linkTitle: Busca e OCR,weight: 20,group: Web Foundation,sourceHash: 135754827e78453a,aliases: [/docs/pt-br/web-foundation/fetch-and-ocr.html]}
---

# Busca e OCR

Fetch and OCR extrai texto legível de páginas da web e documentos suportados para que aplicações e agentes possam usar seu conteúdo para resumos, análises ou fluxos de conhecimento. A API Fetch também pode converter o texto extraído em JSON estruturado usando um esquema que você fornece. Use [Web Search](web-search.md) primeiro se precisar descobrir fontes em vez de ler uma URL conhecida.

Páginas da web são processadas para remover marcação e elementos não‑conteúdo. A extração de documentos e o reconhecimento óptico de caracteres (OCR) tornam o conteúdo não‑texto suportado disponível como texto. Revise o conteúdo extraído antes de confiar nele: qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado. Para um walkthrough completo com exemplo de código, veja [how to extract text from a URL, scanned PDF or image for an LLM pipeline](https://aivax.net/blog/fetch-messy-web-to-text/).

## O que você pode extrair

| Conteúdo | Formatos suportados | Conteúdo extraído |
| --- | --- | --- |
| Páginas web | HTML, XHTML | Conteúdo legível da página, como artigos, documentação e informações de produtos, com marcação e elementos não‑conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | O texto do documento, incluindo a formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitaladas. PDFs mistos podem combinar extração direta de texto com OCR quando necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise subsequente. |
| E‑books | EPUB | Texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou transformar uma planilha em texto para um agente analisar. Forneça uma URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um data URI pela API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia pixel‑perfect do documento original. Não presuma que layout, estrutura de tabelas, gráficos ou imagens embutidas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas ou macros.

## API Fetch vs. Descrições de Mídia

Use a **API Fetch para extrair texto existente**. Use [Media Descriptions](/docs/pt-br/data-processing/media-descriptions) para **interpretar mídia com IA**, opcionalmente guiada pelo que sua aplicação precisa aprender dela.

|  | API Fetch | Descrições de Mídia |
| --- | --- | --- |
| Propósito principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens suportadas e PDFs digitalados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído, JSON opcional guiado por esquema gerado a partir desse texto, uso de unidades de processamento e erros por item. | Conteúdo gerado por modelo focado na sua orientação, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Ler texto, como as palavras em um recibo ou os parágrafos de um manual. | Descrever conteúdo visual ou interpretar um documento, como explicar um diagrama ou identificar informações relevantes a uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analisar conteúdo de áudio e vídeo. Para um fluxo de trabalho dedicado de fala para texto, use [Audio Transcriptions](/docs/pt-br/generations/audio-transcriptions). |
| Cobrança | Unidades de processamento de extração (PUs), com alocações e taxas dependentes do plano. Conversão JSON opcional é cobrada separadamente e não está coberta pela alocação de extração. | Cobranças de uso de IA sob preço de Descrições de Mídia; as alocações de PU do Fetch não substituem essas cobranças. |

Para um relatório em PDF, escolha Fetch quando precisar do texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de explicação dos gráficos ou interpretação guiada do conteúdo. Para uma imagem de recibo, Fetch lê o texto impresso; Descrições de Mídia pode interpretar o recibo de acordo com sua orientação de extração.

Nenhum garante resultados perfeitos. Fetch pode perder texto ou estrutura por limitações de OCR e layout. Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada por modelo. Verifique detalhes consequentes contra a fonte original e compare os caminhos de cobrança na seção de preços abaixo.

## Escolha uma integração

| Integração | Quando usar |
| --- | --- |
| API Fetch | Sua aplicação controla quais URLs ou URIs de dados base64 embutidos processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| [Utilitários Web MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) | Um cliente compatível com MCP precisa ler URLs públicas via `fetch_url`. Esta ferramenta aceita de uma a cinco URLs por chamada. |
| [Ferramentas internas](/docs/pt-br/tools/builtin-tools) | Um modelo AIVAX precisa ler uma URL durante a inferência. Habilite `OpenUrl` e siga o guia de configuração de Contexto de URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicas; use a API Fetch para URIs de dados base64 embutidos.

## Buscar conteúdo com a API

Autentique‑se com uma chave de API AIVAX; veja [Authentication](/docs/pt-br/authentication). Forneça um array `contents` não vazio contendo URLs ou URIs de dados base64. Cada item está sujeito a um limite de tamanho (veja [Pricing and limits](#pricing-and-limits)).

A operação `system.v1.web.fetch` aceita os seguintes campos de requisição JSON:

| Campo | Tipo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| `contents` | Array de strings | Sim | Lista não vazia de URLs ou URIs de dados base64 para extrair. |
| `returnErrors` | Booleano | Não | Padrão `true`: inclui um resultado para cada item falhado. Quando `false`, itens falhados são omitidos. |
| `responseSchema` | Objeto JSON Schema | Não | Converte o texto extraído de cada item em JSON guiado por esse esquema. Omitir ou usar `null` para extração apenas de texto. O mesmo esquema se aplica a todos os itens do lote. |
| `responseSchema.instructions` | String | Não | Orientação opcional de extração dentro do esquema, como quais detalhes selecionar ou como lidar com informações ausentes. Isso é uma extensão AIVAX, não uma palavra‑chave padrão de JSON Schema. |

### Extrair JSON estruturado

Forneça `responseSchema` quando sua aplicação precisar de campos da fonte ao invés de apenas o texto. Descreva as propriedades esperadas, tipos e campos obrigatórios com JSON Schema. Use descrições de propriedades e `responseSchema.instructions` opcional para esclarecer o que extrair. Por exemplo, um esquema de objeto pode solicitar o comerciante, data e total de um recibo; a referência embutida inclui um exemplo completo de requisição JSON.

A conversão JSON ocorre após a extração de texto. Resultados bem‑sucedidos mantêm `extractedText` junto com `extractedObject`, para que você possa comparar os campos gerados com a fonte extraída. Sem esquema, nenhuma conversão JSON é executada.

Se a extração ou a conversão JSON falhar, `returnErrors` determina se o item falhado aparece na resposta. Uma falha na conversão JSON não devolve um sucesso apenas de texto.

### Ler os resultados

A resposta contém um array `results` com estes campos:

| Campo | Significado |
| --- | --- |
| `index` | Posição baseada em zero no array de `contents` de entrada. Use para corresponder resultados às entradas, especialmente quando itens falhados são omitidos. |
| `extractedText` | Texto fonte legível, mantido na conversão JSON bem‑sucedida; `null` para um item falhado. |
| `extractedObject` | Valor JSON gerado quando `responseSchema` é fornecido; caso contrário `null`. Também `null` para um item falhado. |
| `processingUnits` | PUs para busca e extração de texto/OCR, separado da conversão JSON. |
| `jsonProcessingUnits` | PUs para conversão JSON; `0` quando nenhum esquema é fornecido. |
| `error` | Mensagem de erro para um item falhado quando `returnErrors` é `true`; `null` em sucesso. It falhados relatam ambos os campos PU como `0`. |

<script src="https://inference.aivax.net/apidocs?embed-target=Fetch%20web%20contents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A referência embutida define o contrato atual de requisição e resposta. Verifique resultados individuais antes de passar seu texto para a próxima etapa; uma extração falhada não é evidência de que a fonte não contém informação relevante.

## Limitações de acesso e extração

Um destino pode bloquear acesso automatizado ou exigir autenticação. Buscar uma URL não contorna restrições de acesso. Use fontes acessíveis ou conteúdo que você esteja autorizado a enviar, e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material fonte não confiável, não como instruções para sua aplicação ou agente. A saída OCR pode precisar de revisão manual para números exatos, nomes ou outros detalhes consequentes. JSON guiado por esquema é gerado por modelo a partir desse texto, não a partir de uma nova interpretação visual da fonte. Ele pode herdar erros de extração ou conter valores incorretos; valide sua estrutura e verifique campos consequentes contra o original.

## Preços e limites

A extração Fetch e OCR é medida em `processingUnits`. Cada extração ou está totalmente coberta pela alocação diária incluída ou é cobrada integralmente nas taxas abaixo; a cobertura não é dividida dentro de uma única extração. Veja [Included daily subscription allowances](/docs/pt-br/limits#included-daily-subscription-allowances) para as regras de alocação. Cada item pode ter até 10 MB.

| Descrição | Preço |
| --- | --- |
| Extração Fetch e OCR - Gratuita | Alocação diária base; itens não cobertos **$0.15/1k PUs** |
| Extração Fetch e OCR - Pro | **10× Gratuita** alocação diária; itens não cobertos **$0.05/1k PUs** |
| Extração Fetch e OCR - Max | **5× Pro** alocação diária; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem alocação diária de extração |

A conversão JSON opcional é medida separadamente em `jsonProcessingUnits`. Seus PUs contabilizam tokens de entrada, entrada em cache e saída nas taxas do modelo de processamento e do provedor, portanto não são precificados à taxa de OCR. O multiplicador de inferência do plano aplica‑se à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON. Não some ambas as contagens e aplique a taxa de OCR ao total. Estime o custo a partir dos PUs relatados, não do comprimento do texto extraído.

Exemplos, assumindo itens não cobertos pela alocação diária:

- Texto simples e Markdown não consomem PUs.
- Uma página HTML que leva 2,3 s para renderizar consome 23 PUs: $0.00115 no Pro.
- Um PDF escaneado relatando `processingUnits: 400` custa $0.06 na Gratuita, $0.02 no Pro e $0.008 no Max. PUs de OCR variam por documento.
- Uma conversão JSON usando 4 000 tokens de entrada e 300 de saída, num modelo com preço de $0.10 por M de entrada e $0.40 por M de saída, relata `jsonProcessingUnits: 1300` (4 000 × 0.25 + 300), aproximadamente $0.00052 antes do multiplicador do plano.

[Utilitários Web MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) usa o mesmo preço da ferramenta interna correspondente. A inferência de modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. A API Fetch requer saldo de conta positivo.
