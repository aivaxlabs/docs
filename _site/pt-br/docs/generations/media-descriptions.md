Source: https://docs.aivax.net/pt-br/docs/generations/media-descriptions.html

# Descrições de Mídia

Use Descrições de Mídia quando um aplicativo precisa de informações estruturadas de áudio, imagens, vídeo ou conteúdo PDF. Os usos típicos incluem preparar a mídia para busca, revisão de moderação, fluxos de trabalho de acessibilidade e automação subsequente.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Audio Transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para fala para texto.

## Descreva a mídia ou raciocine sobre ela diretamente

Existem duas maneiras de extrair informações da mídia, e elas atendem a necessidades diferentes:

- **Descreva a mídia, depois decida** — use este endpoint quando você precisar de um artefato de texto reutilizável: uma descrição armazenada para busca, um registro tipo transcrição para auditoria, ou texto de entrada para uma etapa posterior do fluxo de trabalho que rode de forma independente.
- **Inferência multimodal em uma única requisição** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário for necessário. Veja [Inference](https://docs.aivax.net/pt-br/docs/inference/inference.md).

Prefira Descreva quando a orientação de extração for estável e o resultado atender a vários consumidores; prefira inferência multimodal direta quando a pergunta sobre a mídia mudar a cada requisição.

## Descreva a mídia

Forneça mídia que o AIVAX possa acessar e use orientações que concentrem a extração nas informações que seu fluxo de trabalho precisa. A instrução opcional `extractionGuidance` restringe a saída — "identifique o assunto principal e o texto visível" para uma imagem, "resuma a sequência de eventos" para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa responder.

Cada item enviado é tratado de forma independente e os resultados retornam na ordem de entrada, portanto mantenha as posições alinhadas ao correlacionar resultados com a mídia original. URLs de arquivos remotos são baixados antes do processamento sob o preset `auto` (até 5 MB); troque para `high` quando o serviço deve receber a URL remota diretamente.

Para mídia remota, certifique-se de que o recurso permaneça acessível durante todo o processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não deve aparecer em uma descrição gerada.

A referência incorporada é a fonte de verdade para os formatos de mídia aceitos, opções de requisição e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Describe%20media)

## Preços, limites e erros

Para preços atuais, disponibilidade de mídia e limites de conta, veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md). Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.
