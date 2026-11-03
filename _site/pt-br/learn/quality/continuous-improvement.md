Source: https://docs.aivax.net/pt-br/learn/quality/continuous-improvement.html

Um agente não está concluído quando funciona pela primeira vez. As políticas mudam, os clientes usam palavras inesperadas e os sistemas conectados desenvolvem novos modos de falha. A **melhoria contínua** significa usar evidências do trabalho real para fazer mudanças deliberadas e verificadas ao longo do tempo. Não significa reescrever as instruções sempre que alguém não gosta de uma resposta. O objetivo é melhorar um resultado repetível, não vencer um argumento sobre uma única frase.

Imagine uma loja recebendo reclamações sobre entregas incorretas. Treinar a equipe pode ajudar, mas não se as etiquetas do armazém estiverem erradas. Da mesma forma, uma resposta ruim de um agente pode vir de instruções confusas, informações ausentes, uma ferramenta indisponível ou uma política comercial pouco clara. O primeiro passo é entender a causa. Somente então a equipe pode escolher uma correção provável de ajudar em mais de uma conversa.

## Torne o ciclo explícito

Coletar evidências → Classificar falhas → Corrigir a causa → Re-testar → Implantar e observar

**Implantar** significa disponibilizar uma versão testada aos seus usuários pretendidos. A observação após a implantação fecha o ciclo: você verifica se a melhoria aparece no trabalho real e se surgem novos problemas. Mantenha as evidências vinculadas à mudança para que outro colega possa entender por que ela foi feita. Caso contrário, as instruções acumulam exceções cujo propósito ninguém lembra e que podem contradizer umas às outras.

Uma **causa raiz** é a condição subjacente que explica a falha, em vez de seu sintoma visível. “O agente deu a resposta errada” é um sintoma. “A política aprovada estava ausente do conhecimento pesquisável” é uma candidata a causa raiz. Confirme-a usando a conversa, os documentos disponíveis e os registros de ações. Se as evidências forem incompletas, rotule a causa como incerta em vez de escolher uma explicação conveniente.

## Colete uma amostra equilibrada

Uma **amostra** é uma parte selecionada das conversas revisadas em detalhes. Revisar tudo pode ser impraticável ou desnecessário, mas revisar apenas reclamações é enganoso. Falhas silenciosas podem passar despercebidas, enquanto recusas justificadas podem atrair reclamações. Inclua conversas rotineiras selecionadas aleatoriamente junto com feedback negativo, escalonamentos, sessões abandonadas e tarefas importantes de alto risco. Um escalonamento é uma transferência para uma pessoa ou outro processo autorizado.

Mantenha um registro de como os casos entraram na amostra. Uma revisão contendo muitas reclamações não pode estimar a taxa geral de falha de todo o tráfego sem levar em conta essa seleção. Ainda assim, pode revelar causas valiosas. Mantenha uma amostra representativa para estimar a qualidade geral e uma amostra direcionada para investigar problemas graves ou incomuns. Eles servem a propósitos diferentes e não devem ser mesclados em uma única porcentagem inexplicada.

Leia toda a troca relevante, não apenas a última mensagem. Uma resposta breve pode ser apropriada após uma explicação detalhada, e uma pergunta de esclarecimento pode ser a resposta mais segura para informações ausentes. Remova detalhes pessoais desnecessários antes de circular os casos. Use controles de acesso e regras de retenção para que o trabalho de melhoria não crie uma coleção descontrolada de conversas de clientes.

## Marque a causa, não apenas o tom

Uma **etiqueta** é um rótulo consistente usado para agrupar casos semelhantes. Comece com um pequeno conjunto de rótulos que sua equipe possa aplicar de forma confiável. Registre o resultado pretendido pelo usuário, o que aconteceu em vez disso, as evidências de apoio e a causa provável. Adicione a gravidade, significando a seriedade da consequência, separadamente da frequência. Uma ação não autorizada rara pode merecer atenção mais rápida do que uma saudaçãoawkward comum.

- **Instruções** — As informações relevantes estavam disponíveis, mas as diretrizes do agente eram ambíguas ou conflitantes. Esclareça a regra aplicável e seus limites.

- **Conhecimento** — A fonte necessária estava ausente, desatualizada ou difícil de encontrar. Corrija a fonte e verifique se o agente pode recuperá-la.

- **Ferramentas e integrações** — Uma ação conectada falhou, faltou permissão ou retornou um resultado pouco claro. Repare o caminho da ação e como a falha é comunicada.

- **Processo ou causa não resolvida** — A própria regra comercial é pouco clara, ou as evidências são insuficientes. Atribua investigação em vez de disfarçar a incerteza como um problema de prompt.

Um único caso pode ter várias causas contribuintes. Por exemplo, uma consulta de pedido pode falhar e as instruções podem não dizer como comunicar essa situação. Registre ambas, mas use uma regra consistente ao resumir casos em um gráfico. Se cada caso tiver uma categoria primária, diga isso. Se as categorias se sobrepuserem, não as apresente como fatias que supostamente representam o todo.

**Causas primárias em uma amostra de falhas revisadas (ilustrativo)**

| Item | Value |
| --- | --- |
| Lacunas de conhecimento | 40% |
| Instruções pouco claras | 25% |
| Problemas com ferramentas | 20% |
| Processo ou não resolvido | 15% |

Resultados de revisão inventados, com uma categoria primária por caso. Esta não é a taxa de falha de todas as conversas nem um benchmark de produto.

Esta distribuição ilustrativa sugere onde a investigação pode começar, não o que deve ser corrigido primeiro. Considere a gravidade, os usuários afetados e a força do diagnóstico, bem como o tamanho de cada fatia. Uma lacuna de conhecimento frequente pode justificar uma atualização editorial, enquanto um problema menor de permissão pode exigir contenção imediata. Designe um proprietário que possa alterar a causa real, em vez de enviar todos os problemas ao autor do prompt.

## Altere a menor coisa que aborda a causa

Uma **hipótese** é uma explicação específica que você pode testar. Escreva-a antes de fazer uma correção: “O agente perde a exceção porque está separada da política principal; colocá-las juntas deve melhorar esses casos.” Declare quais exemplos devem mudar e quais devem permanecer inalterados. Isso transforma a edição em uma intervenção testável, em vez de uma tentativa geral de fazer o agente soar melhor.

Evite anexar o wording do cliente falho às instruções como uma exceção especial. Isso pode corrigir a demonstração, criando contradições ou piorando casos próximos. Se a política autoritativa estiver incompleta, repare-a em vez de copiar uma resposta privada em um prompt global. Se uma ferramenta estiver quebrada, um pedido para “tentar mais duro” não repara a conexão ou autoriza ações adicionais.

**Corrija o exemplo visível**

Adicione “sempre ofereça um reembolso” após uma reclamação. O exemplo agora parece amigável, mas clientes não relacionados recebem promessas fora da política.

**Corrija a regra subjacente**

Esclareça as condições de elegibilidade, repare o material de origem ausente e verifique casos elegíveis e não elegíveis antes do lançamento.

Um **teste de regressão** verifica se um comportamento anteriormente funcional ainda funciona. Cada falha confirmada deve sugerir um caso seguro e reutilizável, mas o novo caso não é suficiente por si só. Execute novamente casos relacionados e críticos, depois o conjunto de avaliação mais amplo. Veja [Testando e avaliando agentes](https://docs.aivax.net/pt-br/learn/quality/testing-and-evaluating-agents.md) para construir essas expectativas e revisar resultados. Não aceite várias regressões graves apenas porque uma média geral melhorou.

## Dê à equipe um ritual de revisão semanal

Uma revisão regular evita que as evidências se tornem uma caixa de entrada não lida. Traga uma pessoa que entenda as regras comerciais, alguém que possa modificar o agente ou suas conexões e alguém responsável pela experiência do usuário. Mantenha a reunião focada em decisões: o que falhou, quais evidências apoiam a causa, quem é o proprietário da correção e como a equipe saberá que funcionou.

1. **Prepare as evidências**

Selecione amostras autorizadas e resuma tendências. Inclua exemplos de comportamento bem-sucedido para que a equipe veja o que deve ser preservado.

2. **Concorde sobre prioridade e propriedade**

Separe a contenção urgente da melhoria ordinária. Nomeie um proprietário e um resultado esperado observável para cada problema selecionado.

3. **Revise correções propostas e testes**

Inspeccione a menor correção, novos casos de teste e resultados de regressão. Mantenha diagnósticos incertos abertos em vez de declará-los resolvidos.

4. **Verifique lançamentos anteriores**

Compare as evidências pós-lançamento com a previsão. Feche um problema quando seu resultado for verificado, não meramente quando uma edição for salva.

A revisão semanal não é uma razão para adiar um incidente sério. Use um canal de resposta urgente separado para exposição de privacidade, ações prejudiciais ou falha generalizada. Para melhorias rotineiras, lance de forma controlada e mantenha uma configuração conhecida como funcionando. [Versionamento](https://docs.aivax.net/pt-br/learn/production/versioning.md) explica como identificar alterações relacionadas em prompts, conhecimento e ferramentas para que possam ser comparadas e, se necessário, revertidas.

**Relacionado na AIVAX:** [Testes Agenticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) podem transformar uma falha conversacional em um cenário reutilizável. Mantenha seu resultado esperado claro e revise os resultados junto com evidências do mundo real. A melhoria simulada suporta uma decisão de lançamento; não substitui a verificação do que acontece após os usuários encontrarem a mudança. Para encontrar o turno em que uma conversa real se tornou arriscada e transformar essa forma em um teste, veja [usando a trajetória do juiz como sinal de produção](https://aivax.net/blog/judge-trajectory-production-signal/).

**Próximos passos:** Compare alternativas propostas de forma justa em [Testes A/B de prompts e modelos](https://docs.aivax.net/pt-br/learn/quality/ab-testing.md).

**Verifique seu conhecimento.** Qual é a maneira mais segura de aprender com uma falha de agente recém-descoberta?

1. Adicione a resposta falha exata ao prompt e lance imediatamente
2. Identifique a causa, faça uma mudança focada e execute tanto o novo caso quanto os testes de regressão
3. Ignore o caso a menos que muitos usuários reclamem
4. Altere o prompt, o modelo e todo o conhecimento ao mesmo tempo

Answer: option 2. Uma correção focada e baseada em evidências pode ser avaliada. Os testes de regressão protegem o comportamento anteriormente funcional, enquanto mudanças não relacionadas simultâneas obscurecem a causa da melhoria ou falha.
