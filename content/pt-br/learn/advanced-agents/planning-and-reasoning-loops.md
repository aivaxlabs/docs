---
{title: Ciclos de planejamento e raciocínio,linkTitle: Laços de planejamento e raciocínio,description: "Aprenda como um agente planeja, age, verifica os resultados e revisa sua abordagem sem perder o controle do tempo, dos custos ou do escopo.",weight: 10,duration: 12,objectives: ["Imagine que você está tentando resolver um problema, como consertar uma torneira pingando ou organizar sua agenda para a semana. Esse processo de \"planejar, agir, observar e revisar\" é basicamente o ciclo natural de aprendizado e melhoria contínua.\n\n1. **Planejar (Plan):** Você pensa no que precisa ser feito e cria uma estratégia. Por exemplo: \"Vou fechar o registro principal da água para ver se consigo trocar a válvula interna.\"\n\n2. **Agir (Act):** Você coloca o plano em prática. No caso, você realmente fecha o registro e começa a desmontar a parte da torneira.\n\n3. **Observar (Observe):** Você olha para o resultado da sua ação. Talvez descubra que a válvula estava intacta, mas o problema era outro, ou que não tinha a ferramenta certa e fez uma bagunça.\n\n4. **Revisar (Revise):** Você analisa o que aconteceu. Se deu certo, ótimo! Se não, você aprende com o erro e ajusta seu próximo passo. Por exemplo: \"Ah, percebi que preciso de uma chave inglesa específica. Da próxima vez, vou verificar as ferramentas antes de começar.\"\n\nEsse ciclo se repete até que o problema seja resolvido ou o objetivo alcançado. É assim que aprendemos com a experiência e nos adaptamos ao mundo real.",Distinguir um loop de agente útil de uma cadeia desnecessária de chamadas.,"Defina a conclusão, as condições de parada e os limites de etapas antes da execução.","Iterações repetidas podem aumentar tanto o custo quanto a incerteza devido aos seguintes fatores:\n\n1. **Aumento de Custos**:\n   - Cada iteração adicional geralmente requer recursos adicionais, como tempo, mão de obra e materiais. Isso pode levar a um acúmulo significativo de custos ao longo do processo.\n   - Se as iterações não forem bem planejadas ou se houver retrabalho frequente, os custos podem crescer exponencialmente.\n\n2. **Aumento da Incerteza**:\n   - À medida que mais iterações são realizadas, a complexidade do projeto ou sistema pode aumentar, tornando mais difícil prever resultados finais com precisão.\n   - Mudanças constantes nos requisitos ou nas condições externas durante as iterações podem introduzir novas variáveis e imprevisibilidades.\n   - A falta de clareza sobre o estado atual do projeto após cada iteração pode levar a decisões mal informadas, aumentando a incerteza geral.\n\nEm resumo, embora as iterações possam ser necessárias para refinar e melhorar um produto ou processo, elas devem ser gerenciadas cuidadosamente para evitar que os custos e a incerteza cresçam além do aceitável."],sourceHash: 2630d7b15f8ad26e}
---

Suponha que você peça a um assistente para encontrar um fornecedor e redigir uma consulta. Um resultado útil exige mais do que um parágrafo convincente. O assistente deve entender o que você precisa, encontrar ofertas atuais, comparar produtos equivalentes e lidar com detalhes ausentes. Algumas dessas decisões só se tornam possíveis após uma busca anterior retornar. Um plano ajuda a organizar o trabalho; um loop permite que o assistente se adapte quando os fatos mudam.

Um **loop de agente** é um ciclo repetido de decidir o que fazer, executar uma ação, examinar o resultado e escolher o próximo passo. Pense em um comprador com uma lista de verificação, não em uma máquina que toma uma decisão completa de compra baseada apenas na memória. A lista de verificação pode mudar, mas a autoridade e o orçamento do comprador não aumentam apenas porque a tarefa se torna difícil.

## Planeje, atue, observe, revise

O **plano** indica os próximos passos úteis rumo a um resultado definido. Para **agir**, o agente solicita uma operação a uma ferramenta: software capaz de pesquisar, calcular ou interagir com outro sistema. Para **observar**, ele lê o que realmente aconteceu. Para **revisar**, ele altera o plano restante com base nessa evidência. Uma volta completa ao ciclo é uma **iteração**.

{{< flow items="Planeje o próximo passo útil | Aja por meio de uma ferramenta autorizada | Observe o resultado real | Revise, depois continue ou pare" direction="vertical" >}}

Essa abordagem é frequentemente chamada de estilo **ReAct**: raciocínio e ação se alternam. Em termos simples, o agente não resolve tudo antes de verificar o mundo. Ele considera as evidências atuais, age e considera as novas evidências. Você não precisa de um transcript do raciocínio interno privado do modelo para supervisioná-lo. Um breve resumo da ação, o resultado da ferramenta e a razão para o próximo passo fornecem um registro operacional mais útil.

A distinção entre um plano e uma evidência é importante. “Verificar os custos de entrega” é uma intenção. “A cotação do fornecedor inclui a entrega” é uma afirmação que precisa de uma fonte. Uma pesquisa que não retornou nenhum resultado não é evidência de que a entrega é gratuita. O loop deve preservar essas diferenças para que um rascunho confiante não transforme silenciosamente algo desconhecido em fato.

## Por que um loop pode superar uma resposta única

Uma **resposta única** é produzida em uma única resposta do modelo, sem uma sequência controlada pelo aplicativo de verificações externas. Pode ser perfeitamente adequada para reescrever um e-mail ou resumir um documento já fornecido. Adicionar pesquisas e revisões a essa tarefa pode apenas introduzir atrasos. Use um loop quando a próxima ação depender genuinamente de informações que ainda não estão disponíveis.

Para uma comparação de fornecedores, uma primeira pesquisa pode revelar que uma oferta atraente tem o tamanho do pacote errado. A próxima pesquisa deve restringir a especificação do produto, em vez de coletar mais das mesmas ofertas. Uma resposta fixa escrita antes dessa descoberta poderia comparar produtos diferentes. O loop justifica seu custo tomando uma decisão materialmente melhor, não apenas aparentando estar ocupado.

Um modelo projetado para um raciocínio mais deliberado e um loop de agente são escolhas diferentes. Um modelo pode gastar mais esforço em uma resposta sem entrar em contato com um banco de dados de fornecedores. Um aplicativo também pode executar um loop de ferramentas com um modelo padrão. [Raciocínio versus modelos padrão](../models/reasoning-vs-standard-models.md) explica a escolha do modelo; nenhuma dessas opções elimina a necessidade de verificar fatos externos.

## Exemplo prático: encontre o fornecedor mais barato e redija um e-mail

Comece definindo “mais barato” e “concluído”. Para este exemplo, o comprador deseja o menor custo total cotado para um produto e quantidade específicos, incluindo a entrega, entre fornecedores que o negócio está autorizado a usar. O resultado é uma comparação e um rascunho de consulta não enviado. Fazer um pedido e enviar o e-mail estão fora do escopo. Se o comprador não tiver fornecido um destino ou prazo, pergunte antes de presumir que a comparação é significativa.

{{< steps >}}
{{< step title="Concordar com a comparação" >}}
Registre a especificação do produto, quantidade, destino da entrega e fornecedores aceitáveis. Marque qualquer requisito ausente que mudaria a escolha.
{{< /step >}}
{{< step title="Recolher ofertas atuais" >}}
Use uma ferramenta de pesquisa ou catálogo autorizada. Mantenha a fonte, data, tamanho do pacote, status de estoque e condições de entrega de cada oferta juntas.
{{< /step >}}
{{< step title="Observar uma incompatibilidade" >}}
O preço anunciado mais baixo é para um pacote menor. Exclua-o ou converta-o para uma quantidade equivalente usando uma ferramenta de cálculo; não compare preços diretos diretamente.
{{< /step >}}
{{< step title="Revisar a próxima ação" >}}
Uma oferta otherwise adequada omite a entrega. Peça essa informação ausente ou marque o total como desconhecido, em vez de classificá-la silenciosamente como a primeira.
{{< /step >}}
{{< step title="Retornar o resultado delimitado" >}}
Apresente o total verificado mais baixo entre as ofertas verificadas, observe cotações não resolvidas e rascunhe a consulta. Pare sem enviar ou comprar.
{{< /step >}}
{{< /steps >}}

Observe a expressão “entre as ofertas verificadas”. É uma conclusão defensável, diferente de “o fornecedor mais barato em qualquer lugar”. O agente não pode estabelecer uma afirmação universal a partir de uma pesquisa limitada. Uma resposta final útil explica o limite da comparação e qualquer fato que possa alterar a recomendação. O rascunho pode perguntar sobre uma questão de entrega não resolvida sem implicar que o fornecedor já respondeu.

As descrições das ferramentas também moldam o loop. Se uma ferramenta de pesquisa e uma ferramenta de compra estiverem ambas disponíveis, o agente deve conhecer seus efeitos diferentes. O software deve impor as operações permitidas, em vez de confiar apenas em uma frase no prompt. Consulte [Adicionando ferramentas](../agents/adding-tools.md) para a diferença entre solicitar uma ação e executá-la.

## Projete as saídas antes da entrada

Um loop precisa de **condições de parada**: situações explícitas nas quais ele deve terminar, pausar ou devolver o controle. “Continuar até ficar confiante” é muito vago. Modelos podem soar certos sem melhores evidências, e pesquisas repetidas podem continuar revelando algo novo para verificar. Decida quais evidências são suficientes para esta decisão empresarial específica.

{{< cards >}}
{{< card title="Sucesso" icon="check" >}}
A comparação acordada está completa e o rascunho não enviado está pronto. Mais pesquisas não satisfariam um requisito adicional.
{{< /card >}}
{{< card title="Autoridade ou informação ausente" icon="user" >}}
O próximo passo precisa de permissão ou de um detalhe material do usuário. Pause e faça uma pergunta focada.
{{< /card >}}
{{< card title="Sem progresso útil" icon="pause" >}}
Tentativas repetidas retornam a mesma evidência ausente ou inutilizável. Explique a lacuna em vez de circular indefinidamente.
{{< /card >}}
{{< card title="Limite de recurso" icon="coin" >}}
O limite de etapa, tempo ou orçamento financeiro foi atingido. Retorne um resultado parcial claramente rotulado, não um sucesso falso.
{{< /card >}}
{{< /cards >}}

Um **limite de etapas** limita quantas ações ou chamadas de modelo o aplicativo permite. Defina quais eventos contam: uma nova tentativa ainda consome recursos, e uma pesquisa delegada não deve escapar do orçamento. Adicione um limite de tempo decorrido e um limite de gastos como controles separados. O software fora do modelo deve impor esses limites, porque uma instrução para ser econômico não é uma barreira confiável de gastos.

Mantenha o teste de sucesso observável. “Comparou os fornecedores permitidos com quantidades equivalentes e registrou os custos de entrega ausentes” pode ser inspecionado. “Pesquisou exaustivamente” não pode. Quando o agente parar antecipadamente, o usuário deve ver o que foi concluído, o que permanece desconhecido e qual decisão é necessária. O trabalho parcial ainda pode ser valioso se seus limites forem visíveis.

## Cada iteração tem um preço

As chamadas de modelo processam **tokens**, as partes de texto que um modelo lê e escreve. Cada iteração pode repetir instruções, mensagens anteriores e resultados de ferramentas como entrada, gerando então uma nova resposta. Serviços de ferramentas podem adicionar suas próprias cobranças. À medida que o histórico cresce, iterações posteriores podem custar mais do que as anteriores; duas vezes mais iterações não significam necessariamente apenas duas vezes o custo total.

{{< chart type="line" title="Custo cumulativo de trabalho versus iterações (ilustrativo)" unit=" unidades de custo" data=`{"labels":["1","2","3","4","5"],"series":[{"name":"Histórico de conversa crescente","values":[1,2.3,3.9,5.8,8]}]}` caption="Unidades de ensino arbitrárias, não preços ou desempenho medido. Chamadas posteriores neste exemplo processam mais contexto acumulado." >}}

Reduza o desperdício solicitando resultados de ferramentas focados, mantendo um registro factual conciso e evitando verificações repetidas de informações inalteradas. Os resumos devem preservar evidências importantes, incerteza e limites de aprovação; encurtar o histórico não deve remover o fato de que o envio é proibido. Escolha um orçamento apropriado ao valor da decisão, meça então os resultados concluídos em vez de recompensar planos mais longos.

**Relacionado:** No AIVAX, instruções reutilizáveis, ferramentas e configurações de contexto pertencem a um [gateway de IA](../../docs/inference/ai-gateways/concepts.md). Essas configurações fazem parte da configuração do agente; seu aplicativo ainda precisa de critérios explícitos de conclusão e controle sobre a tarefa geral.

Próximos passos: explore como as mesmas fronteiras se aplicam quando o trabalho é dividido em [Arquiteturas e orquestração multi-agente](multi-agent-architectures.md).

{{< quiz options="Continue pesquisando até que o modelo diga estar completamente confiante | Pare com uma comparação de totais verificados, rotule as informações ausentes e deixe o e-mail não enviado | Envie uma consulta a todos os fornecedores automaticamente porque mais evidências são sempre melhores | Remova o limite de iteração sempre que uma cotação estiver ausente" answer="2" explanation="A tarefa é uma comparação delimitada e um rascunho. Evidências claras, incerteza visível e respeito pela fronteira de envio são mais importantes do que buscas infinitas ou confiança autorrelatada." >}}
O comprador solicitou uma comparação de fornecedores e um rascunho de e-mail, não uma compra. Qual resultado respeita melhor a tarefa?
{{< /quiz >}}
