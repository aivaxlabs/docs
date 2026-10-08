Source: http://localhost:1313/pt-br/learn/prompt-engineering/common-prompt-mistakes.html

Uma resposta decepcionante nem sempre significa que você escolheu o modelo errado. Frequentemente o assistente recebeu uma ordem de trabalho incompleta: foi instruído a ser útil sem que lhe fosse dito o que significa sucesso, ou foi solicitado a seguir regras que não podem ser todas atendidas. Corrigir o briefing costuma ser um passo inicial melhor do que acrescentar linguagem enfática.

Os exemplos abaixo usam tarefas fictícias de suporte e back‑office. Cada par corrige um problema específico. O objetivo não é tornar os prompts mais longos; é remover a adivinhação que altera o resultado. Se fatos essenciais ou permissões estiverem ausentes, a correção pode pertencer à aplicação em vez de à redação.

## Diagnosticar o ingrediente faltante

Antes de editar, identifique se a falha diz respeito ao trabalho, à sua evidência ou ao resultado requerido. Isso evita acrescentar uma instrução não relacionada a cada problema. Um prompt que cresce acumulando reações pode se tornar mais difícil de seguir do que o original.

- **The job** — Um novo colega pode identificar o resultado desejado, o público e os limites sem adivinhar o que “bom” significa?

- **The evidence** — O briefing contém os fatos relevantes e diferencia informações aprovadas das reivindicações do cliente?

- **The result** — O formato da resposta é utilizável e há um próximo passo acordado quando a tarefa não pode ser concluída com segurança?

## 1. Uma meta vaga

“Lide com isso” deixa o assistente escolher entre resumir, responder, decidir e agir. São trabalhos diferentes com consequências distintas. Declare o entregável pretendido e quem o usará. Você pode deixar espaço para uma redação natural sem deixar o resultado de negócio indefinido.

**Before**

“Ajude com esta reclamação do cliente. Torne-a boa.”

**After**

“Redija uma resposta para que um representante de suporte revise. Reconheça a entrega atrasada, resuma o status verificado e explique o próximo passo disponível. Não envie a resposta nem prometa compensação.”

**Check whether the goal is observable**

Pergunte o que um revisor poderia apontar na resposta: um status preciso, um reconhecimento adequado e um próximo passo permitido. “Serviço excelente” é uma aspiração, não um critério de aceitação. Mantenha a aspiração, mas dê-lhe um significado concreto.

## 2. Regras contraditórias

Conflitos costumam aparecer quando várias pessoas contribuem com instruções. Uma pessoa exige brevidade absoluta enquanto outra requer cada detalhe. O modelo não pode satisfazer ambos completamente. Escolha uma prioridade ou defina quando cada regra se aplica, em vez de esperar que ele descubra o compromisso não declarado da equipe.

**Before**

“Sempre responda em uma frase. Sempre explique toda exceção e o procedimento completo.”

**After**

“Comece com uma resposta curta. Inclua qualquer exceção que altere o próximo passo do cliente. Coloque o procedimento detalhado em uma lista separada quando necessário para uma conclusão segura.”

**Check priority, not just wording**

Procure por palavras como “sempre”, “nunca” e “apenas”. Compare seu escopo. Se um aviso necessário ocupa mais espaço, a brevidade deve ceder? Decida explicitamente. Um tom educado não deve superar uma descrição verídica de informações ausentes.

## 3. Ausência de formato de saída

Uma boa explicação ainda pode ser inutilizável se a pessoa ou sistema seguinte esperar campos. Decida se a saída é para leitura, cópia em um formulário ou processamento automático. Defina como valores desconhecidos devem aparecer para que o assistente não seja incentivado a preencher espaços vazios com detalhes inventados.

**Before**

“Extraia os detalhes importantes da fatura.”

**After**

“Retorne um objeto JSON com supplier_name, invoice_date e total_amount usando o esquema fornecido. Use null quando um campo estiver ausente. Não infira uma data ou valor a partir de texto não relacionado.”

**Check the consumer of the answer**

JSON é um formato de texto contendo campos nomeados e valores; um esquema especifica sua estrutura requerida. Um prompt por si só não é validação. O software deve verificar o resultado antes de usá-lo, enquanto uma mensagem voltada ao humano pode ser mais clara como prosa comum.

## 4. Instruções muito longas

O comprimento em si não é o problema; repetição desnecessária e detalhes irrelevantes são. Um prompt contendo cada revisão histórica de política dificulta a identificação da regra atual. Separe comportamento estável de conhecimento de referência e forneça apenas o material de referência necessário para esta tarefa.

**Before**

“Cole rascunhos antigos de políticas, lembretes de tom repetidos e todos os incidentes de suporte passados nas instruções permanentes. Termine com “Use as regras mais recentes.””

**After**

“Use a política aprovada fornecida para esta solicitação. Explique a regra relevante e o próximo passo necessário. Se os documentos fornecidos estiverem em conflito ou faltarem uma versão atual, solicite revisão em vez de escolher silenciosamente.”

**Shorten without removing safeguards**

Remova duplicatas e material substituído primeiro. Não apague a regra de fonte da verdade, limites de ação ou critérios de escalonamento apenas para reduzir o tamanho. Se uma seção não afetar o comportamento esperado, considere se ela pertence ao prompt.

## 5. Exemplos que conflitam com as regras

Os modelos podem seguir o padrão demonstrado por exemplos mesmo quando uma regra escrita diz algo diferente. Isso é especialmente fácil de perder após mudar uma política: as instruções são atualizadas, mas uma demonstração antiga ainda mostra uma promessa não autorizada. Trate os exemplos como parte da especificação.

**Before**

Regra: “Não prometa datas de entrega sem uma estimativa verificada.”
Resposta de exemplo: “Seu pacote chegará definitivamente amanhã.”

**After**

Regra: “Reporte apenas a estimativa no registro verificado e rotule-a como estimativa.”
Exemplo quando não há estimativa: “O pacote foi despachado. O registro ainda não mostra uma data de entrega estimada.”

**Review examples after changing a rule**

Para cada exemplo, identifique a evidência que sustenta cada afirmação. Inclua um caso de informação incompleta assim como o caso de sucesso fácil. Se os revisores discordarem sobre o exemplo correto, resolva a ambiguidade de negócio antes de pedir ao modelo que a resolva.

## 6. Pressumir que o modelo conhece sua empresa

O treinamento de um modelo não é uma conexão ao vivo com sua organização. Ele não estabelece a política de devolução de hoje, o estoque atual ou o status da conta de um cliente. Mesmo informações públicas podem estar desatualizadas. Fatos privados e mutáveis devem vir de documentos autorizados ou sistemas conectados.

**Before**

“Você trabalha para nossa empresa, então explique nossa garantia atual e confirme se este reparo está coberto.”

**After**

“Use a garantia atual fornecida e os detalhes de compra verificados. Identifique a cláusula relevante. Se a política ou a evidência de compra necessária estiverem ausentes, explique o que é necessário antes que a cobertura possa ser determinada.”

**Distinguish access from a role description**

Chamar um assistente de especialista em garantia altera a perspectiva solicitada, não seu acesso a registros. Verifique se a aplicação realmente fornece a política e permite a consulta necessária. Uma ferramenta também deve relatar falhas claramente, em vez de retornar um sucesso aparentemente vazio.

## 7. Instruções apenas negativas

“Não seja vago, não alucine, não seja inútil” descreve comportamentos indesejados sem mostrar uma alternativa útil. **Alucinação** significa gerar conteúdo não suportado ou falso como se fosse verdade. Reduza a oportunidade disso especificando evidência e um caminho para informações ausentes, não apenas proibindo erros.

**Before**

“Nunca adivinhe. Nunca seja vago. Nunca diga algo errado.”

**After**

“Baseie as afirmações factuais na política fornecida ou no resultado de ferramenta verificado. Declare o que é conhecido e o que permanece desconhecido. Peça um detalhe ausente quando ele afetar a resposta; caso contrário, explique o próximo passo suportado.”

**Keep necessary prohibitions, then add a path**

Algumas fronteiras devem permanecer explícitas, como não expor credenciais ou aprovar pagamentos. Combine-as com a resposta permitida: explique o limite, use um processo autorizado ou encaminhe à pessoa adequada. Instruções positivas não substituem restrições rígidas.

## 8. Ausência de caminho de escalonamento

**Escalonamento** significa encaminhar um caso para uma pessoa ou processo autorizado quando o assistente não pode resolvê‑lo adequadamente. Sem um caminho definido, o assistente pode continuar fazendo perguntas, inventar uma resposta ou alegar ter contatado alguém. Especifique tanto o gatilho quanto o mecanismo realmente disponível.

**Before**

“Resolva todas as solicitações de reembolso. Nunca deixe o cliente sem resposta.”

**After**

“Se a elegibilidade estiver indefinida ou for necessária aprovação, resuma a evidência e a questão não resolvida para revisão humana. Use o encaminhamento configurado se disponível; caso contrário, explique a rota de contato aprovada. Não afirme que um encaminhamento foi bem‑sucedido sem confirmação.”

**Test the unavailable-handoff case**

Uma ferramenta de transferência pode falhar, e uma equipe de revisão pode não responder imediatamente. Defina o que o cliente deve ver nessa situação. Distinga “Eu preparei um resumo” de “um representante recebeu o caso”, e evite inventar promessas de tempo de resposta.

## Revisar o prompt completo

As correções devem funcionar em conjunto. Um formato de saída claro não compensa evidência ausente, e um prompt conciso não compensa regras contraditórias. Mantenha um conjunto curto de casos representativos para que cada edição possa ser julgada pelas mesmas expectativas, não apenas pela falha mais recente.

1. **Ler como um novo colega**

Identifique o resultado, o público, a fonte da verdade e os limites de ação. Reescreva qualquer instrução que dependa de conhecimento da empresa não declarado.

2. **Verificar consistência**

Compare regras com exemplos, remova instruções repetidas ou substituídas e defina qual requisito prevalece quando as restrições competem.

3. **Exercitar a incerteza**

Teste uma solicitação normal, evidência ausente, documentos conflitantes e uma ferramenta indisponível. Defina a resposta aceitável para cada antes de testar.

4. **Medir antes de manter a mudança**

Revise a correção factual, formato e comportamento de escalonamento. Altere uma parte relevante por vez e mantenha revisões que melhorem o resultado pretendido.

Para um método mais amplo de escrita de instruções, reveja [Writing good prompts and instructions](http://localhost:1313/pt-br/learn/agents/writing-good-prompts-and-instructions.md). Relacionado: no AIVAX, avaliações conversacionais repetíveis são chamadas de [Agentic Tests](http://localhost:1313/pt-br/docs/inference/agentic-tests.md). Elas ajudam a avaliar cenários definidos, mas seus resultados ainda precisam de critérios significativos e revisão; uma amostra aprovada não garante cada conversa futura.

**Próximo passo:** Explore [model families and choosing a model](http://localhost:1313/pt-br/learn/models/model-families-and-choosing.md) para adequar o mecanismo a uma tarefa claramente definida.

**Verifique seu conhecimento.** Um assistente aprova solicitações com confiança mesmo quando a evidência da política está ausente. Qual mudança resolve o problema raiz?

1. Repetir a exigência de confiança de forma mais enfática
2. Adicionar exemplos que prometem um resultado positivo
3. Fornecer a política autorizada, definir o caminho de evidência faltante e testar casos incertos
4. Pedir ao assistente que resolva cada caso sem revisão humana

Answer: option 3. A certeza não suportada é melhor tratada fornecendo evidência autoritária e um caminho seguro quando está faltando. Uma formulação mais forte ou exemplos otimistas não podem fornecer fatos ou autoridade de aprovação.
