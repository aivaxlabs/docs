---
{title: Descrições de Mídia,linkTitle: descrições de mídia,weight: 280,group: Generations,sourceHash: cf02d32acc1f90f1,aliases: [/docs/pt-br/generations/media-descriptions.html]}
---

# Descrições de Mídia

Use Descrições de Mídia quando uma aplicação precisa de informações estruturadas de áudio, imagens, vídeo ou conteúdo PDF. Usos típicos incluem preparar a mídia para busca, revisão de moderação, fluxos de trabalho de acessibilidade e automação downstream.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Audio Transcriptions](/docs/pt-br/generations/audio-transcriptions) para fala para texto.

## Descrever mídia ou raciocinar diretamente sobre ela

Existem duas maneiras de extrair informações da mídia, e elas atendem a necessidades diferentes:

- **Descrever mídia, depois decidir** — use este endpoint quando você precisar de um artefato de texto reutilizável: uma descrição armazenada para busca, um registro tipo transcrição para auditoria ou texto de entrada para uma etapa posterior do fluxo de trabalho que roda de forma independente.
- **Inferência multimodal em uma única requisição** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário é necessário. Veja [Inference](/docs/pt-br/inference/inference.md).

Prefira Descrever quando a orientação de extração é estável e o resultado alimenta vários consumidores; prefira inferência multimodal direta quando a pergunta sobre a mídia muda a cada requisição.

## Descrever mídia

Forneça mídia que o AIVAX possa acessar e use orientações que foquem a extração nas informações que seu fluxo de trabalho necessita. A instrução opcional `extractionGuidance` restringe a saída — "identifique o assunto principal e o texto visível" para uma imagem, "resuma a sequência de eventos" para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa que seja respondida.

Cada item enviado é tratado de forma independente e os resultados retornam na ordem de entrada, portanto mantenha as posições alinhadas ao correlacionar resultados com a mídia original. URLs de arquivos remotos são baixados antes do processamento sob o preset `auto`, dentro de um limite de tamanho (veja [Request and payload limits](/docs/pt-br/limits#request-and-payload-limits)); troque para `high` quando o serviço deve receber a URL remota diretamente.

Para mídias remotas, certifique-se de que o recurso permaneça acessível durante todo o processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não deve aparecer em uma descrição gerada.

A referência incorporada é a fonte de verdade para os formatos de mídia aceitos, opções de requisição e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para preços atuais, disponibilidade de mídia e limites de conta, veja [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits). Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.
