# Descrições de Mídia

Use Descrições de Mídia quando uma aplicação precisa de informações estruturadas de áudio, imagens, vídeo ou conteúdo PDF. É útil para preparar mídia para busca, revisão de moderação, fluxos de acessibilidade e automação downstream.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Transcrições de Áudio](/docs/pt-br/generations/audio-transcriptions) para fala para texto.

## Descrever mídia

Forneça mídia que o AIVAX possa acessar e use orientações que foquem a extração nas informações que seu fluxo de trabalho necessita. Cada item enviado é tratado de forma independente, portanto preserve a ordem de entrada ao correlacionar os resultados com a mídia original.

Para mídias remotas, certifique-se de que o recurso permaneça acessível durante todo o processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não deve aparecer em uma descrição gerada.

A referência incorporada é a fonte de verdade para os formatos de mídia aceitos, opções de solicitação e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para preços atuais, disponibilidade de mídia e limites de conta, veja [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits). Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.