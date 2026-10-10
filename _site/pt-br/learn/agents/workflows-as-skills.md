Source: https://docs.aivax.net/pt-br/learn/agents/workflows-as-skills.html

Um agente útil não deve inventar um novo processo de integração de cliente toda vez que uma venda é concluída. Ele deve saber quais informações coletar, o que verificar, quem deve aprovar a configuração e quando o cliente pode receber uma mensagem de boas‑vindas. Um **fluxo de trabalho** descreve essa sequência de tarefas e as condições para avançar.

## De uma capacidade para um procedimento

Em [Adding skills](https://docs.aivax.net/pt-br/learn/agents/adding-skills.md), uma habilidade é um corpo reutilizável de orientações para um tipo específico de trabalho. Uma habilidade em forma de fluxo de trabalho vai além de descrever expertise. Ela indica quando iniciar, quais informações são necessárias, quais etapas dependem de resultados anteriores e o que conta como concluído.

Por exemplo, “escrever mensagens de boas‑vindas amigáveis” descreve uma capacidade. “Verificar se a conta está aprovada, confirmar o canal de contato, rascunhar a mensagem de boas‑vindas, obter revisão e então enviar pela ferramenta autorizada” descreve um procedimento. O procedimento torna as dependências visíveis. Uma boa mensagem não é útil se for enviada antes que o acesso do cliente exista.

**Conversa livre**

O próximo passo segue as perguntas do usuário e as informações que surgem. Útil para exploração, explicação e descoberta de requisitos. A conclusão pode ser uma resposta satisfatória em vez de um registro alterado.

**Fluxo de trabalho definido**

O próximo passo depende de um procedimento declarado e progresso registrado. Útil para operações repetíveis com verificações necessárias. A conclusão tem evidência explícita, como uma configuração aprovada e um resultado confirmado.

Nenhum estilo deve substituir o outro em todas as situações. Um cliente pode precisar de uma conversa aberta para entender suas opções antes de iniciar a integração. Uma vez iniciada a integração, o sistema deve saber qual procedimento está ativo e não deve pular verificações necessárias apenas porque a conversa muda de direção.

## Projetar as condições de início e término

Um fluxo de trabalho precisa de um **gatilho**, ou seja, o evento ou solicitação que o inicia. “Um funcionário autorizado solicita a integração do cliente” é mais específico que “um cliente é mencionado”. Também necessita de pré-requisitos: fatos ou permissões que já devem existir. Por exemplo, o contrato pode precisar ser aceito antes que a criação da conta seja permitida.

Defina a linha de chegada antes de escrever a parte intermediária. “Cliente integrado” pode significar coisas diferentes para vendas, operações e suporte. Decida se o fluxo de trabalho termina na criação de conta aprovada, na entrega confirmada da mensagem de boas‑vindas ou na conclusão de uma sessão de treinamento posterior. Se uma equipe separada for responsável por essa etapa posterior, torne a transferência explícita ao invés de afirmar que todo o trabalho está concluído.

Em seguida, separe etapas obrigatórias de ramificações opcionais. Uma **ramificação** é um caminho alternativo escolhido sob uma condição declarada. Um cliente que já possui uma conta pode precisar de uma revisão de acesso ao invés de uma nova conta. O fluxo de trabalho deve verificar essa condição ao invés de permitir que o agente crie um duplicado porque a lista principal diz “criar conta”.

## Exemplo de integração de cliente

A sequência abaixo é ilustrativa e deve ser adaptada às políticas reais da organização. É um exemplo de design, não uma afirmação de que qualquer plataforma específica executa automaticamente essas etapas ou concede essas permissões.

1. **Confirmar a solicitação e pré-requisitos**

Identifique o solicitante autorizado e o cliente pretendido. Verifique se a aprovação comercial necessária existe e procure uma conta existente.

2. **Coletar e validar os detalhes da configuração**

Solicite apenas as informações necessárias. Verifique os campos obrigatórios e resolva ambiguidades antes de preparar uma alteração.

3. **Apresentar a configuração proposta**

Exiba o registro do cliente, o nível de acesso e a comunicação planejada em um resumo revisável. Torne as informações ausentes visíveis.

4. **Obter a aprovação necessária**

Registre quem aprovou qual versão da mudança proposta. Se detalhes importantes mudarem depois, solicite uma nova aprovação.

5. **Executar e verificar**

Utilize ferramentas autorizadas, inspecione seus resultados e registre o que realmente foi bem‑sucedido. Não anuncie a conclusão apenas porque uma solicitação foi enviada.

O procedimento também deve indicar o que não fazer. Se a aprovação for recusada, interrompa ao invés de buscar outra rota para a mesma mudança. Se o registro do cliente for ambíguo, peça esclarecimento ao invés de escolher o nome mais próximo. Se uma ferramenta estiver indisponível, preserve as verificações concluídas e explique qual etapa permanece aberta.

## Pontos de verificação são mais que frases reconfortantes

Um **ponto de verificação** é um momento em que o processo verifica evidências antes de continuar. Uma aprovação é um tipo de ponto de verificação, mas outros incluem validar um campo obrigatório, confirmar que um registro existe ou checar o resultado de uma ação. “Certifique‑se de que tudo parece correto” não é um ponto de verificação útil porque não define as evidências necessárias.

Para aprovações, especifique a decisão, o aprovador autorizado e a ação proposta. O entusiasmo geral do cliente não é aprovação para alterar um contrato. Um gerente que aprova um rascunho não autoriza necessariamente enviá‑lo a todo contato. A unidade [human-in-the-loop](https://docs.aivax.net/pt-br/learn/advanced-agents/human-in-the-loop.md) explica como projetar a participação humana sem tornar a responsabilidade confusa.

Começar com pré-requisitos → Preparar o trabalho → Verificar evidências → Obter aprovação → Executar → Verificar conclusão

Registre o progresso em um local que a aplicação possa consultar de forma confiável. Esse **estado** registrado informa ao sistema quais etapas estão concluídas, pendentes ou falhadas. O texto da conversa sozinho é uma lista de verificação frágil: pode se tornar longo, ser resumido ou conter declarações contraditórias. Um processo confiável não deve esquecer um limite de aprovação porque uma mensagem anterior não está mais visível ao modelo.

Para um fluxo de trabalho de fechamento de fim de mês, isso é especialmente importante. Uma conta pode estar reconciliada enquanto outra ainda precisa de revisão. O fluxo de trabalho deve preservar essa distinção ao invés de reiniciar tudo ou relatar todo o fechamento como concluído. Se o processo for retomado depois, deve reverificar qualquer informação que possa ter mudado ao invés de assumir que todas as observações anteriores permanecem atuais.

## Quando preferir execução determinística

**Determinístico** significa que os mesmos inputs e regras definidos levam à mesma decisão ou ação. Softwares comuns podem impor que um total esteja balanceado, que um campo obrigatório esteja presente ou que uma aprovação exista antes de uma operação de escrita. Um modelo é útil para interpretar linguagem variada, mas não deve ser o único mecanismo que impõe essas regras.

Uma habilidade contendo etapas numeradas não é automaticamente um mecanismo de fluxo de trabalho determinístico. Ela orienta o modelo; não garante por si só a ordem das etapas, progresso durável ou verificações de permissão. Para procedimentos importantes, combine a habilidade com controles de aplicação que imponham transições e aprovações necessárias. O modelo pode ajudar a rascunhar e explicar enquanto o software controla se o processo pode avançar.

**Quando uma habilidade escrita é suficiente?**

Para uma tarefa de baixo impacto, como rascunhar um resumo de reunião, instruções reutilizáveis e revisão humana podem ser suficientes. A consequência de uma etapa perdida é limitada e a saída é fácil de inspecionar. Ainda assim, defina o que um rascunhar completo deve conter.

**Quando o software deve impor o fluxo de trabalho?**

Use controles mais fortes quando as etapas alteram registros, envolvem dinheiro, requerem verificações reguladas ou devem ser retomadas após uma interrupção. Aprovações necessárias e cálculos de negócio não devem depender apenas do modelo escolher seguir uma lista de verificação.

A unidade [planning and reasoning loops](https://docs.aivax.net/pt-br/learn/advanced-agents/planning-and-reasoning-loops.md) explora casos em que um agente decide seu próximo passo a partir de observações. Essa flexibilidade é valiosa para trabalhos incertos. É menos apropriada quando o negócio já conhece a sequência necessária e precisa de evidências de que cada condição foi atendida.

## Como isso se mapeia ao AIVAX

No AIVAX, [skills](https://docs.aivax.net/pt-br/docs/features/skills.md) contêm instruções reutilizáveis. [Processing pipelines](https://docs.aivax.net/pt-br/docs/inference/pipelines.md) configuram o processamento em torno de solicitações de modelo; eles não são o mesmo conceito de um processo completo de aprovação de negócio. Mantenha o procedimento de negócio e seus controles externos necessários explícitos ao invés de supor que a palavra “pipeline” os fornece automaticamente.

[Batch](https://docs.aivax.net/pt-br/docs/features/batch.md) aplica um fluxo de trabalho de IA a muitas entradas independentes em segundo plano. Pode ser adequado para tarefas como preparar resumos separados para vários clientes. Não é um substituto para uma sequência dependente em que o próximo passo de um cliente espera pela aprovação ou resultado de outra etapa. Escolha o mecanismo de execução de acordo com as dependências do trabalho.

O que vem a seguir: aprenda a expressar papéis, limites e procedimentos claramente em [Writing good prompts and instructions](https://docs.aivax.net/pt-br/learn/agents/writing-good-prompts-and-instructions.md).

**Verifique seu conhecimento.** Qual afirmação descreve corretamente um fluxo de trabalho escrito como uma habilidade?

1. Uma habilidade numerada garante automaticamente que toda aprovação seja imposta
2. O modelo deve decidir se as aprovações necessárias valem a pena solicitar
3. Uma habilidade orienta o agente, enquanto o software deve impor permissões importantes e pontos de verificação do processo

Answer: option 3. Orientações escritas ajudam o agente a seguir o procedimento, mas requisitos de alto impacto precisam de controles que não podem ser ignorados apenas porque um modelo produz um próximo passo diferente.
