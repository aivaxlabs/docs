---
{title: Descrições de Mídia,linkTitle: Descrições de Mídia,weight: 10,group: Data processing,aliases: [/docs/pt-br/generations/media-descriptions.html,/docs/pt-br/data-processing/media-descriptions.html],sourceHash: bceba700ee9271a7}
---

# Descrições de Mídia

Use Descrições de Mídia quando um aplicativo precisa de informações estruturadas de áudio, imagens, vídeo ou conteúdo PDF. Usos típicos incluem preparação de mídia para busca, revisão de moderação, fluxos de trabalho de acessibilidade e automação subsequente.

Escolha a API mais especializada quando a tarefa for limitada a um único meio, como [Transcrições de Áudio](/docs/pt-br/generations/audio-transcriptions) para fala‑para‑texto.

## Descrever mídia ou raciocinar sobre ela diretamente

Existem duas maneiras de extrair informações de mídia, e elas atendem a necessidades diferentes:

- **Descrever mídia, depois decidir** — use este endpoint quando precisar de um artefato de texto reutilizável: uma descrição armazenada para busca, um registro tipo transcrição para auditoria ou texto de entrada para uma etapa posterior do fluxo que roda de forma independente.
- **Inferência multimodal em uma única requisição** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário for necessário. Veja [Inferência](/docs/pt-br/inference/inference.md).

Prefira Descrições de Mídia quando a orientação de extração for estável e o resultado alimentar vários consumidores. Prefira inferência multimodal direta quando a pergunta sobre a mídia mudar a cada requisição.

## Descrever mídia

Forneça a mídia que o AIVAX pode acessar e use orientações que foquem a extração nas informações que seu fluxo de trabalho necessita. A instrução opcional `extractionGuidance` restringe a saída — “identificar o assunto principal e texto visível” para uma imagem, “resumir a sequência de eventos” para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa responder.

Cada item enviado é tratado de forma independente e os resultados retornam na ordem de entrada, portanto mantenha as posições alinhadas ao correlacionar resultados com a mídia original. Sob o preset `auto`, URLs de arquivos remotos são baixados antes do processamento, dentro de um limite de tamanho (veja [Preços, limites e erros](#pricing-limits-and-errors)). Mude para `high` quando o serviço deve receber a URL remota diretamente.

Para mídia remota, certifique‑se de que o recurso permaneça acessível durante o processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não de aparecer em uma descrição gerada.

A referência incorporada é a fonte de verdade para formas de mídia aceitas, opções de requisição e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

| Descrição | Preço |
| --- | ---: |
| Descrições de Mídia | **~$1.50/M tokens** |

O preço é aproximado e depende do modelo de processamento disponível.

Sob o preset `auto`, arquivos remotos são baixados pelo AIVAX até 5 MB cada. Para limites ao nível da conta, veja [Planos e Limites](/docs/pt-br/limits).

Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.
