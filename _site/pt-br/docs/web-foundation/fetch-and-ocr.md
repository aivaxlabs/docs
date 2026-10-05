Source: https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.html

# Buscar e OCR

Buscar e OCR extrai texto legível de páginas da web e documentos suportados para que aplicações e agentes possam usar seu conteúdo para resumos, análises ou fluxos de conhecimento. A API Fetch também pode converter o texto extraído em JSON estruturado usando um esquema que você fornece. Use [Pesquisa na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) primeiro se precisar descobrir fontes em vez de ler um URL conhecido.

Páginas da web são processadas para remover marcação e elementos não‑conteúdo. A extração de documentos e o reconhecimento óptico de caracteres (OCR) disponibilizam conteúdo não textual suportado como texto. Revise o conteúdo extraído antes de confiar nele: qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado.

## O que você pode extrair

| Conteúdo | Formatos suportados | Conteúdo extraído |
| --- | --- | --- |
| Páginas da web | HTML, XHTML | Conteúdo legível da página, como artigos, documentação e informações de produtos, com marcação e elementos não‑conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | Texto do documento, incluindo a formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitalizadas. PDFs mistos podem combinar extração direta de texto com OCR quando necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalizados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise subsequente. |
| E‑books | EPUB | Texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou transformar uma planilha em texto para um agente analisar. Forneça um URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um URI de dados através da API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia pixel‑a‑pixel do documento original. Não presuma que layout, estrutura de tabelas, gráficos ou imagens incorporadas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas nem macros.

## API Fetch vs. Descrições de Mídia

Use a **API Fetch para extrair texto existente**. Use [Descrições de Mídia](https://docs.aivax.net/pt-br/docs/generations/media-descriptions.md) para **interpretar mídia com IA**, opcionalmente guiado pelo que sua aplicação precisa aprender a partir dela.

|  | API Fetch | Descrições de Mídia |
| --- | --- | --- |
| Propósito principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens e PDFs digitalizados suportados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído, JSON opcional guiado por esquema gerado a partir desse texto, uso de unidades de processamento e erros por item. | Conteúdo gerado pelo modelo focado nas suas orientações, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Ler texto, como as palavras em um recibo ou os parágrafos de um manual. | Descrever conteúdo visual ou interpretar um documento, como explicar um diagrama ou identificar informações relevantes para uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analisar conteúdo de áudio e vídeo. Para um fluxo dedicado de fala‑para‑texto, use [Transcrições de Áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md). |
| Cobrança | Unidades de processamento de extração (PUs), com limites e tarifas dependentes do plano. Conversão JSON opcional é cobrada separadamente e não está coberta pelo limite de extração. | Tarifas de uso de IA sob precificação de Descrições de Mídia; limites de PU de Fetch não substituem essas cobranças. |

Para um relatório em PDF, escolha Fetch quando precisar do texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de uma explicação dos gráficos ou de uma interpretação guiada do conteúdo. Para uma imagem de recibo, Fetch lê o texto impresso; Descrições de Mídia pode interpretar o recibo de acordo com sua orientação de extração.

Nenhum garante resultados perfeitos. Fetch pode perder texto ou estrutura por limitações de OCR e layout. Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada pelo modelo. Verifique detalhes críticos contra a fonte original e compare os caminhos de cobrança na seção de preços abaixo.

## Escolha uma integração

| Integração | Quando usar |
| --- | --- |
| API Fetch | Sua aplicação controla quais URLs ou URIs base64 embutidos processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| [Utilitários Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) | Um cliente compatível com MCP precisa ler URLs públicas através de `fetch_url`. Esta ferramenta aceita de um a cinco URLs por chamada. |
| [Ferramentas internas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) | Um modelo AIVAX precisa ler um URL durante a inferência. Habilite `OpenUrl` e siga o guia de configuração de Contexto de URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicas; use a API Fetch para URIs base64 embutidos.

## Buscar conteúdo com a API

Autentique‑se com uma chave de API AIVAX; veja [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md). Forneça um array `contents` não vazio contendo URLs ou URIs base64. Cada item tem limite de 10 MB.

A operação `system.v1.web.fetch` aceita os seguintes campos de solicitação JSON:

| Campo | Tipo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| `contents` | Array de strings | Sim | Lista não vazia de URLs ou URIs base64 para extrair. |
| `returnErrors` | Booleano | Não | Padrão `true`: inclui um resultado para cada item que falhar. Quando `false`, itens que falharem são omitidos. |
| `responseSchema` | Objeto JSON Schema | Não | Converte o texto extraído de cada item em JSON guiado por esse esquema. Omitir ou usar `null` para extração apenas de texto. O mesmo esquema se aplica a todos os itens do lote. |
| `responseSchema.instructions` | String | Não | Orientação opcional de extração dentro do esquema, como quais detalhes selecionar ou como lidar com informações faltantes. Esta é uma extensão AIVAX, não uma palavra‑chave padrão de JSON Schema. |

### Extrair JSON estruturado

Forneça `responseSchema` quando sua aplicação precisar de campos da fonte, não apenas do texto. Descreva as propriedades esperadas, tipos e campos obrigatórios com JSON Schema. Use descrições de propriedades e o opcional `responseSchema.instructions` para esclarecer o que extrair. Por exemplo, um esquema de objeto pode solicitar o comerciante, data e total de um recibo; a referência incorporada inclui um exemplo completo de solicitação JSON.

A conversão para JSON ocorre após a extração de texto. Resultados bem‑sucedidos mantêm `extractedText` junto com `extractedObject`, permitindo comparar os campos gerados com a fonte extraída. Sem um esquema, nenhuma conversão para JSON é executada. Se a extração ou a conversão para JSON falharem, o item segue `returnErrors`; uma falha na conversão para JSON não devolve um sucesso apenas de texto.

### Ler os resultados

A resposta contém um array `results` com estes campos:

| Campo | Significado |
| --- | --- |
| `index` | Posição baseada em zero no array de entrada `contents`. Use para corresponder resultados às entradas, especialmente quando itens que falharem são omitidos. |
| `extractedText` | Texto fonte legível, mantido em conversão JSON bem‑sucedida; `null` para um item que falhou. |
| `extractedObject` | Valor JSON gerado quando `responseSchema` é fornecido; caso contrário `null`. Também `null` para um item que falhou. |
| `processingUnits` | PUs para busca e extração de texto/OCR, separado da conversão JSON. |
| `jsonProcessingUnits` | PUs para conversão JSON; `0` quando nenhum esquema é fornecido. |
| `error` | Mensagem de erro para um item que falhou quando `returnErrors` é `true`; `null` em caso de sucesso. Itens que falharem relatam ambos os campos de PU como `0`. |

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Fetch%20web%20contents)

A referência incorporada define o contrato atual de solicitação e resposta. Verifique os resultados individuais antes de encaminhar seu texto para a próxima etapa; uma extração falha não é evidência de que a fonte não contém informação relevante.

## Limitações de acesso e extração

Um destino pode bloquear acesso automatizado ou exigir autenticação. Buscar um URL não contorna restrições de acesso. Use fontes acessíveis ou conteúdo que você esteja autorizado a submeter e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material de origem não confiável, não como instruções para sua aplicação ou agente. A saída de OCR pode precisar de revisão manual para números exatos, nomes ou outros detalhes críticos. O JSON guiado por esquema é gerado pelo modelo a partir desse texto, não a partir de uma nova interpretação visual da fonte. Ele pode herdar erros de extração ou conter valores incorretos; valide sua estrutura e verifique campos críticos contra o original.

## Preço e limites

A extração de Buscar e OCR é medida em `processingUnits`. As cotas diárias incluídas e tarifas para extração não coberta dependem do plano da conta. Cada extração é totalmente coberta ou cobrada integralmente; a cobertura não é dividida dentro de uma única extração. A conversão opcional para JSON é medida separadamente em `jsonProcessingUnits`, com preço de PU variável baseado em inferência e sem cobertura pela cota diária de extração. Não some ambas as contagens nem aplique a tarifa de OCR ao total. Veja [Preços](https://docs.aivax.net/pt-br/docs/pricing.md#web-search-ocr-and-fetch) para cotas e cobranças em vez de estimar o custo a partir do comprimento do texto extraído.

[Utilitários Web MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md) usa a mesma precificação da ferramenta interna correspondente. A inferência do modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. Consulte [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para cotas de conta e limites de taxa. A API Fetch requer saldo de conta positivo.
