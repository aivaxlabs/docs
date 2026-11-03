Source: https://docs.aivax.net/pt-br/learn/advanced-agents/long-running-and-asynchronous-agents.html

Um cliente que pede horário de funcionamento espera uma resposta enquanto a conversa está aberta. Um gerente que solicita a revisão de uma grande coleção de documentos pode estar disposto a retornar depois. Ambos são tarefas de agente, mas precisam de arranjos de entrega diferentes. Manter uma janela de chat aberta por horas não torna o trabalho longo confiável. A aplicação precisa de um registro do trabalho que exista independentemente da conversa.

Tarefas de longa duração incluem pesquisar um mercado, processar uma lista de registros e preparar relatórios a partir de várias fontes. Acompanhamentos agendados adicionam outro tipo de espera: o trabalho deve acontecer em um horário futuro acordado. Em cada caso, o agente precisa de um escopo definido, um responsável e uma forma de relatar o que realmente aconteceu, incluindo conclusão parcial ou falha.

## Trabalho síncrono e assíncrono

**Trabalho síncrono** mantém o chamador aguardando o resultado da requisição atual. **Trabalho assíncrono** reconhece a requisição e a conclui separadamente, permitindo que o chamador saia e verifique depois. Pense em esperar em um balcão por uma cópia versus deixar um pedido de impressão e recolhê‑lo quando notificado. Assíncrono não significa mais rápido; significa que o resultado é entregue por meio de um ciclo de vida diferente.

**Resposta síncrona**

O usuário aguarda na interação atual. Serve para perguntas curtas e delimitadas e ações cujos resultados são necessários imediatamente. Uma dependência lenta pode manter toda a interação aguardando.

**Trabalho assíncrono**

A aplicação devolve um recibo e mantém um registro de trabalho separado. Serve para tarefas mais longas, trabalho em fila e entrega posterior. A interface deve explicar o status, o cancelamento e onde o resultado aparecerá.

Um **trabalho em segundo plano** é uma unidade de trabalho registrada processada independentemente da requisição original. Uma **fila** mantém trabalhos aguardando execução, e um **worker** é o processo que pega um trabalho e executa suas etapas. Estas são responsabilidades de software comuns ao modelo. Um modelo dizendo “vou continuar trabalhando” não prova que um trabalho em segundo plano foi criado.

Uma **tarefa agendada** tem um horário ou gatilho acordado para iniciar. Seja preciso sobre o fuso horário, recorrência e regra de parada. Um acompanhamento recorrente de cliente também precisa de permissão para contato futuro e de uma forma de cancelá‑lo. Verifique o status atual do cliente quando a tarefa for executada; uma mensagem que fazia sentido quando agendada pode tornar‑se inadequada após a resolução do problema.

## Combine expectativas ao tipo de tarefa

Um trabalho de pesquisa pode gastar tempo encontrando e comparando fontes. Um trabalho em lote repete um processo sobre registros independentes. Um acompanhamento pode passar a maior parte de sua vida aguardando seu horário de vencimento ao invés de usar um modelo. O usuário deve ser capaz de distinguir tempo em fila, tempo aguardando aprovação e tempo de processamento ativo.

**Exemplos de durações de processamento ativo (ilustrativo)**

| Item | Value |
| --- | --- |
| Tarefa de pesquisa breve | 12 minutos |
| Comparação de documentos | 25 minutos |
| Lote de registros independentes | 90 minutos |

Exemplos de planejamento inventados, não benchmarks, promessas de serviço ou limites de produto. Tempo de fila e espera agendada são excluídos; a duração real depende do escopo, ferramentas e falhas.

Não apresente esses exemplos como estimativa de entrega para uma tarefa real. Estime a partir de cargas observadas quando possível, indique o que a estimativa inclui e atualize‑a quando as condições mudarem. Um horário de término exato é enganoso quando a quantidade de trabalho ainda está sendo descoberta. Um estágio atual claro pode ser mais útil que uma contagem regressiva aparentemente precisa.

## Dê ao trabalho um ciclo de vida visível

Um **ciclo de vida** é o conjunto de estágios que um trabalho atravessa, desde a aceitação até o resultado final. “Aceito” significa que a aplicação registrou a requisição, não que a tarefa esteja concluída. “Concluído” deve significar que o entregável acordado existe e passou nas verificações. Torne resultados bloqueados, falhados, cancelados e parcialmente concluídos visíveis ao invés de agrupar todo trabalho interrompido sob sucesso.

- **Accepted — Registrar o acordo**: Armazene o objetivo, escopo, responsável, canal de entrega, limites e um recibo que o usuário possa revisitar.

- **Queued — Aguardar sem fingir que está trabalhando**: Mostre que o trabalho está aguardando capacidade ou seu início agendado. Preserve a capacidade de cancelar.

- **Running — Trabalhar e salvar progresso**: Processar a próxima unidade permitida, validar seu resultado e registrar um ponto de verificação antes de prosseguir.

- **Paused if needed — Solicitar uma decisão concreta**: Explique informações ausentes, orçamento esgotado ou aprovação necessária. Não continue gastando enquanto uma decisão humana for necessária.

- **Finished — Entregar um resultado honesto**: Disponibilize o resultado verificado, divulgue omissões e notifique o usuário através do canal acordado.

Um trabalho precisa de um registro durável: informações armazenadas que sobrevivam a um navegador fechado, conexão perdida ou worker reiniciado. Esse registro deve identificar itens concluídos, trabalho atual, erros não resolvidos, ações aprovadas e orçamento restante. Não dependa apenas da conversa do modelo como único registro. O histórico de conversa pode ser encurtado ou ficar muito grande, enquanto o trabalho ainda precisa de um relato preciso do que mudou.

## Use pontos de verificação para retomar com segurança

Um **ponto de verificação** é uma posição salva de onde o trabalho pode retomar. Imagine colocar um marcador após cada seção verificada de um relatório. Para um trabalho de processamento de registros, salve o resultado de cada item concluído ou grupo manejável de itens. Após uma interrupção, continue a partir do estado salvo ao invés de reexecutar a lista inteira.

1. **Definir uma unidade de trabalho**

Escolha um item que possa ser verificado e registrado independentemente, como um documento ou uma linha de entrada. Documente qualquer dependência de resultados anteriores.

2. **Executar e validar a unidade**

Execute a operação permitida, verifique a saída e distinga sucesso de um resultado ausente ou inválido.

3. **Salvar resultado e posição juntos**

Registre o resultado, o estado de conclusão e as informações necessárias para evitar repetir seus efeitos externos. Apenas um contador de progresso não é suficiente.

4. **Retomar a partir do estado confirmado**

Ignore o trabalho verificado, reconcilie ações incertas e reexecute apenas os itens elegíveis restantes dentro dos limites originais.

Algumas operações criam um intervalo perigoso entre o efeito externo e o ponto de verificação. Um e‑mail pode ser enviado justo antes do worker parar, deixando sem registro local de conclusão. Retomar às cegas poderia enviá‑lo novamente. **Idempotência** significa que o processamento repetido da mesma operação pretendida não cria efeitos adicionais. Um serviço pode oferecer isso reconhecendo uma referência de operação estável e retornando o resultado anterior ao invés de repetir a ação.

Essa proteção deve existir no sistema receptor ou em um processo de ação cuidadosamente projetado; adicionar um rótulo a um prompt não torna a operação idempotente. Quando o resultado remoto não pode ser estabelecido, pause para reconciliação ao invés de assumir que falhou. Distinga “repetir a mesma operação” de “o usuário solicitou deliberadamente uma nova operação”. Eles não devem compartilhar acidentalmente o mesmo registro de conclusão.

## Relate progresso sem inventá‑lo

Para uma lista fixa, mostre contagens de itens concluídos, falhados e restantes, com definições claras. Se uma nova tentativa estiver em progresso, não conte o mesmo registro duas vezes. Para pesquisas abertas, use estágios e descobertas: “Coleta de fontes concluída; comparando termos de entrega conflitantes” é mais honesto que uma porcentagem sem sustentação. O progresso deve descrever trabalho verificado, não quanto texto o agente escreveu.

- **Progresso útil** — Mostre o trabalho concluído, o estágio atual e qualquer decisão que bloqueie o próximo passo. Rotule estimativas como estimativas.

- **Cancelamento controlado** — Pare de iniciar novo trabalho e explique se uma operação já está em progresso. O cancelamento não desfaz uma ação externa concluída.

- **Notificação confiável** — Envie um aviso de conclusão acordado com um link seguro para o resultado. Mantenha o resultado acessível mesmo que a entrega da notificação falhe.

- **Gasto limitado** — Conte chamadas ao modelo, uso de ferramentas, novas tentativas e trabalho delegado dentro do mesmo orçamento da tarefa. Pause antes que os recursos autorizados se esgotem.

Notificações merecem seu próprio status. “O relatório está pronto” e “o usuário recebeu a notificação” são fatos diferentes. Evite colocar resultados sensíveis diretamente em um e‑mail ou notificação que possa ser visualizada em uma tela compartilhada. Prefira o canal acordado e uma rota autenticada para o resultado completo. Não notifique um novo destinatário apenas porque o contato original falhou.

## Mantenha o trabalho longo dentro de sua autoridade original

O tempo pode mudar o contexto. Antes de uma ação consequente, verifique novamente permissões, validade da aprovação e fatos que podem estar desatualizados. Um rascunho aprovado não é permissão para enviar uma versão materialmente alterada amanhã. Execuções mais longas tornam essa separação ainda mais importante, pois pessoas podem atualizar registros ou cancelar instruções enquanto o trabalho aguarda.

Um **limite de custo** é um orçamento máximo imposto para a tarefa. Aplique‑o em novas tentativas e workers, e verifique a cota restante antes de iniciar mais trabalho. Também defina um prazo e um limite de workers ativos simultaneamente. Mais trabalho simultâneo pode encurtar a fila, mas pode aumentar erros de limite de taxa e dificultar o controle de gastos. Quando um limite for alcançado, preserve o progresso e pergunte se deve parar ou ampliar o escopo autorizado.

**Relacionado:** No AIVAX, [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md) processa o mesmo fluxo de trabalho sobre itens independentes em segundo plano. Não é um substituto geral para trabalhos multi‑etapa dependentes. [Gateway pipelines](https://docs.aivax.net/pt-br/docs/inference/pipelines.md) descrevem o processamento dentro de requisições de gateway, não um agendador durável de trabalhos em segundo plano. Use [Webhooks, eventos e automações](https://docs.aivax.net/pt-br/learn/tools-and-integrations/webhooks-events-and-automations.md) para entender a coordenação orientada a eventos em torno dessas capacidades.

Próximo passo: aprenda a provar que esses designs funcionam em [Testing and evaluating agents](https://docs.aivax.net/pt-br/learn/quality/testing-and-evaluating-agents.md).

**Verifique seu conhecimento.** Um trabalho em segundo plano reinicia após uma interrupção. Qual abordagem de recuperação é mais confiável?

1. Reiniciar todo o trabalho porque trabalho repetido é sempre mais seguro
2. Retomar a partir de pontos de verificação confirmados, reconciliar ações externas incertas e preservar os limites originais
3. Marcar o trabalho como concluído porque alguns resultados foram salvos
4. Remover o limite de custo até que todo item seja bem‑sucedido

Answer: option 2. Pontos de verificação duráveis evitam repetições desnecessárias, mas efeitos externos incertos ainda precisam de reconciliação ou proteção de idempotência. Um reinício não concede novo gasto ou autoridade de ação.
