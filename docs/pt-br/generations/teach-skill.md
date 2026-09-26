# Ensinar Habilidade

Use o recurso Ensinar Habilidade para transformar demonstrações gravadas em instruções de habilidade reutilizáveis, passo a passo. Os usos típicos incluem capturar o fluxo de tela de um especialista para que agentes de suporte o repitam consistentemente, converter tutoriais de integração em comportamento de assistente e iniciar um rascunho de habilidade que um humano depois aperfeiçoa.

Envie vídeos tutoriais como partes de conteúdo `video_url` — URLs hospedados ou URIs de dados base64. Como a análise leva um tempo em gravações mais longas, a API recomenda `direct.inference.aivax.net`.

## Grave uma demonstração que ensine bem

A qualidade do rascunho segue a qualidade da gravação. Antes de enviar:

- Mostre o fluxo de trabalho na ordem em que deve ser compreendido, um passo de cada vez, sem pular entre telas.
- Narre ou legendue a intenção por trás de cada ação ("Eu abro este painel porque..."), não apenas o clique em si — gravações silenciosas deixam o contexto necessário implícito e forçam o modelo a adivinhar.
- Mantenha credenciais, dados pessoais e informações do cliente fora do quadro; tudo que for visível pode acabar nas instruções resultantes.
- Prefira algumas gravações curtas e focadas em vez de uma sessão longa quando o procedimento tem fases naturais.

## Crie um rascunho de habilidade

Organize as gravações na ordem em que o procedimento deve ser compreendido. A resposta usa o envelope JSON padrão. `data.resultText` contém um rascunho Markdown estruturado que pode incluir front matter, etapas, notas e suposições quando a gravação deixa o contexto necessário implícito. `data.usage.processedUnits` relata as unidades de uso processadas para a solicitação.

Um rascunho gerado não é publicado automaticamente como uma habilidade de conta. Valide cada etapa contra o fluxo de trabalho real, remova detalhes específicos da gravação (tamanhos de janela, nomes de teste, valores pontuais), confirme pré-requisitos e reescreva etapas vagas como instruções imperativas antes de salvá-lo. Consulte [Habilidades](/docs/pt-br/features/skills) para a estrutura da habilidade e orientações de ativação.

A referência incorporada é a fonte de verdade para a entrada de vídeo aceita e o comportamento da resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Teach%20skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para disponibilidade atual e limites de conta, veja [Preços](/docs/pt-br/pricing) e [Planos e Limites](/docs/pt-br/limits). Corrija conteúdo de vídeo inválido ou inacessível antes de tentar novamente uma solicitação falhada.