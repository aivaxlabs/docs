---
{title: Melhoria contínua a partir de conversas reais,linkTitle: Melhoria contínua,description: "Use conversas reais para encontrar causas raiz, fazer correções direcionadas e verificar se cada lançamento melhora o agente sem quebrar outros trabalhos.",weight: 40,duration: 11,objectives: [Amostre conversas sem olhar apenas para reclamações.,"Distinga sintomas de falhas de prompt, conhecimento e ferramenta.",Organize uma revisão semanal com responsáveis claros e evidências.,Reavalie mudanças antes de um lançamento controlado.],sourceHash: c5df15fd10f69f3c}
---

Um agente não está concluído quando funciona pela primeira vez. Políticas mudam, clientes usam termos inesperados e sistemas conectados desenvolvem novos modos de falha. **Melhoria contínua** significa usar evidências do trabalho real para fazer mudanças deliberadas e verificadas ao longo do tempo. Não significa reescrever as instruções sempre que alguém não gosta de uma resposta. O objetivo é melhorar um resultado repetível, não vencer um argumento sobre uma frase.

Imagine uma loja recebendo reclamações sobre entregas incorretas. Treinar a equipe pode ajudar, mas não se as etiquetas do armazém estiverem erradas. Da mesma forma, uma resposta ruim do agente pode vir de instruções confusas, informação faltante, ferramenta indisponível ou política de negócio pouco clara. O primeiro passo é entender a causa. Só então a equipe pode escolher uma correção que ajude mais de uma conversa.

## Torne o ciclo explícito

{{< flow "Coletar evidência | Classificar falhas | Corrigir a causa | Re-testar | Implantar e observar" >}}

**Implantar** significa disponibilizar uma versão testada para seus usuários previstos. A observação após a implantação fecha o ciclo: você verifica se a melhoria aparece no trabalho real e se surgem novos problemas. Mantenha a evidência vinculada à mudança para que outro colega entenda por que foi feita. Caso contrário, as instruções acumulam exceções cujo propósito ninguém lembra e que podem se contradizer.

Uma **causa raiz** é a condição subjacente que explica a falha, e não seu sintoma visível. “O agente deu a resposta errada” é um sintoma. “A política aprovada estava ausente do conhecimento pesquisável” é uma causa raiz candidata. Confirme-a usando a conversa, os documentos disponíveis e registros de ações. Se a evidência estiver incompleta, rotule a causa como incerta ao invés de escolher uma explicação conveniente.

## Coletar uma amostra equilibrada

Uma **amostra** é uma parte selecionada de conversas revisadas em detalhe. Revisar tudo pode ser impraticável ou desnecessário, mas revisar apenas reclamações é enganoso. Falhas silenciosas podem passar despercebidas, enquanto recusas justificadas podem atrair reclamações. Inclua conversas rotineiras selecionadas aleatoriamente ao lado de feedback negativo, escalonamentos, sessões abandonadas e tarefas de alto risco importantes. Um escalonamento é uma transferência para uma pessoa ou outro processo autorizado.

Mantenha registro de como os casos entraram na amostra. Uma revisão contendo muitas reclamações não pode estimar a taxa geral de falha de todo o tráfego sem levar em conta essa seleção. Ainda assim, pode revelar causas valiosas. Mantenha uma amostra representativa para estimar a qualidade geral e uma amostra direcionada para investigar problemas graves ou incomuns. Elas servem a propósitos diferentes e não devem ser mescladas em um único percentual inexplainado.

Leia toda a troca relevante, não apenas a última mensagem. Uma resposta breve pode ser apropriada após uma explicação detalhada, e uma pergunta de esclarecimento pode ser a resposta mais segura para informações faltantes. Remova detalhes pessoais desnecessários antes de circular os casos. Use controles de acesso e regras de retenção para que o trabalho de melhoria não crie uma coleção descontrolada de conversas de clientes.

## Marque a causa, não apenas o tom

Um **rótulo** é uma marca consistente usada para agrupar casos semelhantes. Comece com um pequeno conjunto de rótulos que sua equipe possa aplicar de forma confiável. Registre o resultado pretendido pelo usuário, o que aconteceu em vez disso, a evidência de apoio e a causa provável. Adicione severidade, que indica a gravidade da consequência, separadamente da frequência. Uma ação não autorizada rara pode merecer atenção mais rápida do que uma saudação estranha comum.

{{< cards >}}
{{< card title="Instruções" icon="list-check" >}}
As informações relevantes estavam disponíveis, mas as diretrizes do agente eram ambíguas ou conflitantes. Esclareça a regra aplicável e seus limites.
{{< /card >}}
{{< card title="Conhecimento" icon="book" >}}
A fonte necessária estava ausente, desatualizada ou difícil de encontrar. Corrija a fonte e verifique se o agente pode recuperá‑la.
{{< /card >}}
{{< card title="Ferramentas e integrações" icon="tools" >}}
Uma ação conectada falhou, faltou permissão ou retornou um resultado pouco claro. Repare o caminho da ação e como a falha é comunicada.
{{< /card >}}
{{< card title="Processo ou causa não resolvida" icon="question" >}}
A própria regra de negócio é pouco clara, ou a evidência é insuficiente. Atribua investigação ao invés de disfarçar a incerteza como um problema de prompt.
{{< /card >}}
{{< /cards >}}

Um único caso pode ter várias causas contributivas. Por exemplo, uma consulta de pedido pode falhar e as instruções podem deixar de indicar como comunicar essa situação. Registre ambas, mas use uma regra consistente ao resumir casos em um gráfico. Se cada caso tem uma categoria primária, indique isso. Se as categorias se sobrepõem, não as apresente como fatias que supostamente explicam o todo.

{{< chart type="pie" title="Causas primárias em uma amostra de falhas revisada (ilustrativa)" unit="%" data=`[{"label":"Lacunas de conhecimento","value":40},{"label":"Instruções pouco claras","value":25},{"label":"Problemas de ferramenta","value":20},{"label":"Processo ou não resolvido","value":15}]` caption="Resultados de revisão inventados, com uma categoria primária por caso. Isso não é a taxa de falha de todas as conversas ou um benchmark de produto." >}}

Essa distribuição ilustrativa sugere onde a investigação pode começar, não o que deve ser corrigido primeiro. Considere a severidade, os usuários afetados e a força do diagnóstico, bem como o tamanho de cada fatia. Uma lacuna de conhecimento frequente pode justificar uma atualização editorial, enquanto um problema de permissão menor pode exigir contenção imediata. Atribua um responsável que possa mudar a causa real ao invés de enviar cada problema ao autor do prompt.

## Mude a menor coisa que resolve a causa

Uma **hipótese** é uma explicação específica que pode ser testada. Escreva uma antes de fazer uma correção: “O agente perde a exceção porque está separada da política principal; colocá‑las juntas deve melhorar esses casos.” Indique quais exemplos devem mudar e quais devem permanecer inalterados. Isso transforma a edição em uma intervenção testável ao invés de uma tentativa geral de melhorar o som do agente.

Evite acrescentar a formulação do cliente que falhou às instruções como uma exceção especial. Isso pode corrigir a demonstração enquanto cria contradições ou piora casos próximos. Se a política autoritária está incompleta, repare‑a ao invés de copiar uma resposta privada para um prompt global. Se uma ferramenta está quebrada, um pedido para “tentar mais” não repara a conexão nem autoriza ações adicionais.

{{< compare >}}
{{< side title="Corrigir o exemplo visível" tone="bad" >}}
Adicione “oferecer sempre um reembolso” após uma reclamação. O exemplo agora parece amigável, mas clientes não relacionados recebem promessas fora da política.
{{< /side >}}
{{< side title="Corrigir a regra subjacente" tone="good" >}}
Esclareça as condições de elegibilidade, repare o material de fonte faltante e verifique tanto casos elegíveis quanto inelegíveis antes do lançamento.
{{< /side >}}
{{< /compare >}}

Um **teste de regressão** verifica se um comportamento que funcionava antes ainda funciona. Cada falha confirmada deve sugerir um caso seguro e reutilizável, mas o novo caso não basta por si só. Reexecute casos relacionados e críticos, depois o conjunto de avaliação mais amplo. Veja [Testing and evaluating agents](testing-and-evaluating-agents.md) para construir essas expectativas e revisar resultados. Não aceite várias regressões graves apenas porque a média geral melhorou.

## Dê à equipe um ritual de revisão semanal

Uma revisão regular impede que evidências se tornem uma caixa de entrada não lida. Traga uma pessoa que entenda as regras de negócio, alguém que possa modificar o agente ou suas conexões, e alguém responsável pela experiência do usuário. Mantenha a reunião focada em decisões: o que falhou, que evidência apoia a causa, quem é o responsável pela correção e como a equipe saberá que funcionou.

{{< steps >}}
{{< step title="Prepare a evidência" >}}
Selecione amostras autorizadas e resuma tendências. Inclua exemplos de comportamento bem‑sucedido para que a equipe veja o que deve ser preservado.
{{< /step >}}
{{< step title="Concorde sobre prioridade e responsabilidade" >}}
Separe contenção urgente de melhoria ordinária. Nomeie um responsável e um resultado observável esperado para cada problema selecionado.
{{< /step >}}
{{< step title="Revise correções propostas e testes" >}}
Inspecione a menor correção, novos casos de teste e resultados de regressão. Mantenha diagnósticos incertos abertos ao invés de declará‑los resolvidos.
{{< /step >}}
{{< step title="Verifique lançamentos anteriores" >}}
Compare a evidência pós‑lançamento com a previsão. Feche um problema quando seu resultado for verificado, não apenas quando um edit for salvo.
{{< /step >}}
{{< /steps >}}

A revisão semanal não é motivo para adiar um incidente grave. Use uma rota de resposta urgente separada para exposição de privacidade, ações nocivas ou falha generalizada. Para melhorias rotineiras, lance de forma controlada e retenha uma configuração conhecida como funcional. [Versioning](../production/versioning.md) explica como identificar mudanças relacionadas de prompt, conhecimento e ferramenta para que possam ser comparadas e, quando necessário, revertidas.

**Relacionado ao AIVAX:** [Agentic Tests](../../docs/inference/agentic-tests.md) pode transformar uma falha conversacional em um cenário reutilizável. Mantenha seu resultado esperado claro e revise os resultados ao lado de evidências do mundo real. A melhoria simulada apoia a decisão de lançamento; ela não substitui a verificação do que acontece depois que os usuários encontram a mudança.

**Próximos passos:** Compare alternativas propostas de forma justa em [A/B testing prompts and models](ab-testing.md).

{{< quiz options="Adicionar a resposta falhada exatamente ao prompt e lançar imediatamente | Identificar a causa, fazer uma mudança focada e executar tanto o novo caso quanto os testes de regressão | Ignorar o caso a menos que muitos usuários reclamem | Alterar o prompt, modelo e todo o conhecimento ao mesmo tempo" answer="2" explanation="Uma correção focada e baseada em evidências pode ser avaliada. Testes de regressão protegem comportamentos que funcionavam, enquanto mudanças simultâneas não relacionadas obscurecem a causa da melhoria ou falha." >}}
Qual é a maneira mais segura de aprender com uma falha recém‑descoberta de um agente?
{{< /quiz >}}
