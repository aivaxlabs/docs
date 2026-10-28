Source: https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.html

# Descrições de Mídia

Use Media Descriptions quando um aplicativo precisa de informações estruturadas de áudio, imagens, vídeo ou conteúdo PDF. Usos típicos incluem preparação de mídia para busca, revisão de moderação, fluxos de trabalho de acessibilidade e automação downstream.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Audio Transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para conversão de fala em texto.

## Descrições de Mídia, Extração ou Busca

- **Media Descriptions** interpreta imagens, PDFs, áudio e vídeo e retorna texto gerado guiado pelas suas instruções. Use para explicar um gráfico, descrever uma foto ou responder a uma pergunta sobre um vídeo.
- **[Extraction](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md)** lê texto, imagens e PDFs e retorna os campos definidos pelo seu esquema JSON, um objeto por documento. Use quando precisar dos mesmos campos, como totais ou identificadores, em cada documento. [Summarization](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) é seu contraponto para resumos curtos.
- **[Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md)** retorna o texto legível de páginas web e documentos. Use quando precisar do texto completo, por exemplo para indexá-lo.

## Descrever mídia ou raciocinar sobre ela diretamente

Existem duas formas de extrair informações da mídia, e elas atendem a necessidades diferentes:

- **Describe media, then decide** — use este endpoint quando você precisa de um artefato de texto reutilizável: uma descrição armazenada para busca, um registro tipo transcrição para auditoria, ou texto de entrada para uma etapa posterior do fluxo de trabalho que roda de forma independente.
- **Multimodal inference in one request** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário é necessário. Veja [Inference](https://docs.aivax.net/pt-br/docs/inference/inference.md).

Prefira Media Descriptions quando a orientação de extração é estável e o resultado alimenta vários consumidores. Prefira inferência multimodal direta quando a pergunta sobre a mídia muda a cada requisição.

## Descrever mídia

Forneça mídia que o AIVAX possa acessar e use orientações que foquem a extração nas informações que seu fluxo de trabalho necessita. A instrução opcional `extractionGuidance` restringe a saída — "identify the main subject and visible text" para uma imagem, "summarize the sequence of events" para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa responder.

Cada item enviado é tratado de forma independente e os resultados retornam na ordem de entrada, portanto mantenha as posições alinhadas ao correlacionar os resultados com a mídia original. Sob o preset `auto`, URLs de arquivos remotos são baixados antes do processamento, dentro de um limite de tamanho (veja [Pricing, limits, and errors](#pricing-limits-and-errors)). Mude para `high` quando o serviço deve receber a URL remota diretamente.

Para mídia remota, certifique-se de que o recurso permaneça acessível durante todo o processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não deve aparecer em uma descrição gerada.

A referência incorporada é a fonte de verdade para os formatos de mídia aceitos, opções de requisição e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Describe%20media)

## Preços, limites e erros

| Descrição | Preço |
| --- | ---: |
| Descrições de mídia | **~$1.50/M tokens** |

O preço é aproximado e depende do modelo de processamento disponível.

Sob o preset `auto`, arquivos remotos são baixados pelo AIVAX até 5 MB cada. Para limites por conta, veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).

Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.
