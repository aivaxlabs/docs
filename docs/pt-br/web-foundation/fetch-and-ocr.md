# Buscar e OCR

Buscar e OCR extrai texto legível de páginas da web e documentos suportados para que aplicações e agentes possam usar seu conteúdo para resumos, análises ou fluxos de conhecimento. Use [Busca na Web](web-search.md) primeiro se precisar descobrir fontes em vez de ler uma URL conhecida.

Páginas da web são processadas para remover marcação e elementos não relacionados ao conteúdo. A extração de documentos e o reconhecimento óptico de caracteres (OCR) tornam o conteúdo não textual suportado disponível como texto. Revise o conteúdo extraído antes de confiar nele: a qualidade da digitalização, layouts complexos e tabelas podem afetar o resultado.

## O que você pode extrair

| Content | Supported formats | Extracted content |
| --- | --- | --- |
| Páginas da web | HTML, XHTML | Conteúdo de página legível, como artigos, documentação e informações de produto, com marcação e elementos não relacionados ao conteúdo removidos. JavaScript e CSS são renderizados antes da extração. |
| Texto simples e Markdown | TXT, Markdown | Texto do documento, incluindo formatação Markdown existente. |
| PDFs | PDF | Texto de documentos digitais e texto OCR de páginas digitalizadas. PDFs mistos podem combinar extração direta de texto com OCR quando necessário. |
| Imagens contendo texto | PNG, JPEG, WebP, TIFF, BMP | Texto reconhecido de capturas de tela, documentos digitalizados, recibos e outras imagens com escrita legível. |
| Documentos de processamento de texto | DOC, DOCX, ODT, RTF | Texto do documento convertido em uma representação textual legível. |
| Apresentações | PPT, PPTX, ODP | Conteúdo textual dos slides. |
| Planilhas e arquivos tabulares | XLSX, ODS, CSV | Conteúdo de células e linhas como texto, para leitura ou análise posterior. |
| E-books | EPUB | Texto da publicação. |

Por exemplo, você pode buscar um artigo online, ler um manual em PDF, extrair texto de uma imagem de recibo ou converter uma planilha em texto para que um agente a analise. Forneça uma URL que retorne a página ou arquivo real, não uma página de compartilhamento que exija login. Ao enviar um URI de dados através da API, declare o tipo MIME correto do conteúdo.

O resultado é texto extraído, não uma cópia pixel-perfeita do documento original. Não presuma que o layout, a estrutura de tabelas, gráficos ou imagens incorporadas serão reproduzidos exatamente. A extração de planilhas não executa fórmulas ou macros.

## API de Busca vs. Descrições de Mídia

Use a **API de Busca para extrair texto existente**. Use [Descrições de Mídia](/docs/pt-br/generations/media-descriptions) para **interpretar mídia com IA**, opcionalmente guiado pelo que sua aplicação precisa aprender a partir dela.

|  | API de Busca | Descrições de Mídia |
| --- | --- | --- |
| Objetivo principal | Recuperar texto legível de páginas e documentos, usando OCR para imagens suportadas e PDFs digitalizados. | Gerar descrições ou extrair informações de imagens, PDFs, áudio e vídeo usando IA. |
| Saída | Texto extraído com uso de unidades de processamento e erros opcionais por item. Não é um resumo ou resposta gerada. | Conteúdo gerado por modelo focado na sua orientação, que pode descrever informações visuais ou audiovisuais além do texto presente na fonte. |
| Imagens e PDFs | Ler texto, como palavras em um recibo ou parágrafos em um manual. | Descrever conteúdo visual ou interpretar um documento, como explicar um diagrama ou identificar informações relevantes para uma pergunta. |
| Áudio e vídeo | Não é uma API de compreensão ou transcrição de áudio/vídeo. | Analisar conteúdo de áudio e vídeo. Para um fluxo dedicado de fala‑para‑texto, use [Audio Transcriptions](/docs/pt-br/generations/audio-transcriptions). |
| Faturamento | Unidades de processamento (PUs), com cotas e taxas dependentes do plano. | Cobranças de uso de IA sob a precificação de Descrições de Mídia; as cotas de PU da Busca não substituem essas cobranças. |

Para um relatório em PDF, escolha a API de Busca quando precisar do texto para indexação ou análise posterior. Escolha Descrições de Mídia quando precisar de uma explicação dos gráficos ou de uma interpretação guiada do conteúdo. Para uma imagem de recibo, a API de Busca lê o texto impresso; as Descrições de Mídia podem interpretar o recibo de acordo com sua orientação de extração.

Nenhum garante resultados perfeitos. A API de Busca pode perder texto ou estrutura devido a limitações de OCR e layout. As Descrições de Mídia podem omitir detalhes ou introduzir interpretações incorretas porque sua saída é gerada por modelo. Verifique detalhes consequentes contra a fonte original e consulte [Preços](/docs/pt-br/pricing) antes de escolher um caminho de processamento.

## Escolha uma integração

| Integração | Quando usar |
| --- | --- |
| API de Busca | Sua aplicação controla quais URLs ou URIs de dados base64 embutidos processar e precisa de resultados estruturados, uso de unidades de processamento e erros por item. |
| [Web utilities MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) | Um cliente compatível com MCP precisa ler URLs públicas através de `fetch_url`. Esta ferramenta aceita de uma a cinco URLs por chamada. |
| [Built-in tools](/docs/pt-br/tools/builtin-tools) | Um modelo AIVAX precisa ler uma URL durante a inferência. Ative `OpenUrl` e siga o guia de configuração de Contexto de URL. |

As integrações têm contratos de entrada diferentes. Em particular, a ferramenta MCP aceita URLs públicas; use a API de Busca para URIs de dados base64 embutidos.

## Buscar conteúdo com a API

Autentique-se com uma chave de API AIVAX; veja [Autenticação](/docs/pt-br/authentication). Forneça um array `contents` não vazio contendo URLs ou URIs de dados base64. Cada item tem limite de 10 MB.

Defina `returnErrors` como `true` quando precisar de um resultado de erro para um item que falhou individualmente. Os resultados incluem `index`, `extractedText`, `processingUnits` e `error`, permitindo que sua aplicação associe texto extraído ou uma falha à entrada correspondente.

<script src="https://inference.aivax.net/apidocs?embed-target=Fetch%20web%20contents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A referência incorporada define o contrato atual de requisição e resposta. Verifique os resultados individuais antes de passar seu texto para a próxima etapa; uma extração falhada não é evidência de que a fonte não contém informações relevantes.

## Limitações de acesso e extração

Um destino pode bloquear acesso automatizado ou exigir autenticação. Buscar uma URL não contorna restrições de acesso. Use fontes acessíveis ou conteúdo que você está autorizado a enviar, e corrija entradas inválidas ou inacessíveis antes de tentar novamente.

Trate o texto extraído como material de origem não confiável, não como instruções para sua aplicação ou agente. A saída de OCR pode necessitar de revisão manual para números exatos, nomes ou outros detalhes consequentes.

## Preços e limites

A extração de Busca e OCR é medida em unidades de processamento (PUs). As cotas diárias incluídas e as taxas adicionais de PU dependem do plano da conta. Veja [Preços](/docs/pt-br/pricing) para cotas e cobranças atuais, em vez de estimar o custo com base no comprimento do texto extraído.

[Web utilities MCP](/docs/pt-br/mcp-utilities/web-utilities-mcp) usa a mesma precificação da ferramenta embutida correspondente. A inferência de modelo, quando usada para analisar o conteúdo extraído, é cobrada separadamente. Veja [Planos e limites](/docs/pt-br/limits) para cotas de conta e limites de taxa. A API de Busca requer um saldo de conta positivo.