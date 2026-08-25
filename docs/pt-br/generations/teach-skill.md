# Ensinar Habilidade

Use o Ensinar Habilidade para transformar demonstrações gravadas em instruções de habilidade reutilizáveis e passo a passo. Envie vídeos tutoriais que mostram um fluxo de trabalho, depois revise e refine o Markdown retornado antes de usá-lo como uma habilidade de conta.

O Ensinar Habilidade funciona melhor quando as ações relevantes, telas e orientações faladas estão claras. Não inclua credenciais, dados pessoais ou outras informações que não devem fazer parte das instruções resultantes.

## Criar um rascunho de habilidade

Organize as gravações na ordem em que o procedimento deve ser compreendido. A resposta usa o envelope JSON padrão. `data.resultText` contém um rascunho de Markdown estruturado que pode incluir front matter, etapas, notas e suposições quando a gravação deixa implícito o contexto necessário. `data.usage.processedUnits` relata as unidades de uso processadas para a solicitação.

Um rascunho gerado não é publicado automaticamente como uma habilidade de conta. Valide cada etapa, remova detalhes específicos da gravação e confirme pré-requisitos antes de salvá‑lo. Consulte [Skills](/docs/pt-br/features/skills) para a estrutura da habilidade e orientações de ativação.

A referência incorporada é a fonte de verdade para a entrada de vídeo aceita e o comportamento da resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Teach%20skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para disponibilidade atual e limites de conta, veja [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits). Corrija conteúdo de vídeo inválido ou inacessível antes de tentar novamente uma solicitação que falhou.