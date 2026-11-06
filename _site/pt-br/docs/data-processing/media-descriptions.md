Source: https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.html

# Descrições de Mídia

Use Descrições de Mídia quando um aplicativo precisar de informações estruturadas a partir de áudio, imagens, vídeo ou conteúdo PDF. Os usos típicos incluem preparar mídia para pesquisa, revisão de moderação, fluxos de trabalho de acessibilidade e automação posterior.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Transcrições de Áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para conversão de fala em texto.

## Descrições de Mídia, Extração ou Busca

- **Descrições de Mídia** interpreta imagens, PDFs, áudio e vídeo e retorna texto gerado orientado pelas suas instruções. Use-o para explicar um gráfico, descrever uma foto ou responder a uma pergunta sobre um vídeo.
- **[Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md)** lê texto, imagens e PDFs e retorna os campos definidos pelo seu esquema JSON, um objeto por documento. Use-o quando precisar dos mesmos campos, como totais ou identificadores, de todos os documentos. O [Resumo](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) é o seu equivalente para resumos curtos.
- **[Busca e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md)** retorna o texto legível de páginas da web e documentos. Use-o quando precisar do texto completo, por exemplo, para indexá-lo.

## Descrever mídia ou raciocinar diretamente sobre ela

Existem duas maneiras de extrair informações de mídia, e elas atendem a necessidades diferentes:

- **Descrever a mídia e depois decidir** — use este endpoint quando precisar de um artefato de texto reutilizável: uma descrição armazenada para pesquisa, um registro semelhante a uma transcrição para auditoria ou texto de entrada para uma etapa posterior do fluxo de trabalho que é executada independentemente.
- **Inferência multimodal em uma única solicitação** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário for necessário. Consulte [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md).

Prefira as Descrições de Mídia quando a orientação de extração for estável e o resultado alimentar vários consumidores. Prefira a inferência multimodal direta quando a pergunta sobre a mídia mudar a cada solicitação.

## Descrever mídia

Forneça mídia que o AIVAX possa acessar e use diretrizes que concentrem a extração nas informações necessárias pelo seu fluxo de trabalho. A instrução opcional `extractionGuidance` restringe a saída — "identifique o assunto principal e o texto visível" para uma imagem, "resuma a sequência de eventos" para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa ter respondida.

Cada item submetido é tratado independentemente e os resultados retornam na ordem de entrada, portanto, mantenha as posições alinhadas ao correlacionar os resultados com a mídia original. Sob o preset `auto`, URLs de arquivos remotos são baixados antes do processamento, dentro de um limite de tamanho (consulte [Preços, limites e erros](#precos-limites-e-erros)). Altere para `high` quando o serviço deve receber a URL remota diretamente.

Para mídia remota, certifique-se de que o recurso permaneça acessível durante toda a duração do processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outros conteúdos que não devem aparecer em uma descrição gerada.

A referência embutida é a fonte da verdade para formas de mídia aceitas, opções de solicitação e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Describe%20media)

## Preços, limites e erros

| Descrição | Preço |
| --- | ---: |
| Descrições de mídia | **~US$ 1,50/milhões de tokens** |

O preço é aproximado e depende do modelo de processamento disponível.

Sob o preset `auto`, os arquivos remotos são baixados pelo AIVAX até 5 MB cada. O número de solicitações por minuto depende do plano; consulte [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/limits.md#data-processing).

Corrija mídias inacessíveis ou conteúdo inválido antes de tentar novamente.
