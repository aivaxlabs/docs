Source: https://docs.aivax.net/pt-br/learn/advanced-agents/planning-and-reasoning-loops.html

Suponha que você peça a um assistente para encontrar um fornecedor e redigir uma consulta. Um resultado útil exige mais do que um parágrafo convincente. O assistente deve entender o que você precisa, encontrar ofertas atuais, comparar produtos equivalentes e lidar com detalhes ausentes. Algumas dessas decisões só se tornam possíveis após uma busca anterior retornar. Um plano ajuda a organizar o trabalho; um loop permite que o assistente se adapte quando os fatos mudam.

Um **loop de agente** é um ciclo repetido de decidir o que fazer, executar uma ação, examinar o resultado e escolher o próximo passo. Pense em um comprador com uma lista de verificação, não em uma máquina que toma uma decisão completa de compra baseada apenas na memória. A lista de verificação pode mudar, mas a autoridade e o orçamento do comprador não aumentam apenas porque a tarefa se torna difícil.

## Planeje, atue, observe, revise

O **plano** indica os próximos passos úteis rumo a um resultado definido. Para **agir**, o agente solicita uma operação a uma ferramenta: software capaz de pesquisar, calcular ou interagir com outro sistema. Para **observar**, ele lê o que realmente aconteceu. Para **revisar**, ele altera o plano restante com base nessa evidência. Uma volta completa ao ciclo é uma **iteração**.

Planeje o próximo passo útil → Aja por meio de uma ferramenta autorizada → Observe o resultado real → Revise, depois continue ou pare

Essa abordagem é frequentemente chamada de estilo **ReAct**: raciocínio e ação se alternam. Em termos simples, o agente não resolve tudo antes de verificar o mundo. Ele considera as evidências atuais, age e considera as novas evidências. Você não precisa de um transcript do raciocínio interno privado do modelo para supervisioná-lo. Um breve resumo da ação, o resultado da ferramenta e a razão para o próximo passo fornecem um registro operacional mais útil.

A distinção entre um plano e uma evidência é importante. “Verificar os custos de entrega” é uma intenção. “A cotação do fornecedor inclui a entrega” é uma afirmação que precisa de uma fonte. Uma pesquisa que não retornou nenhum resultado não é evidência de que a entrega é gratuita. O loop deve preservar essas diferenças para que um rascunho confiante não transforme silenciosamente algo desconhecido em fato.

## Por que um loop pode superar uma resposta única

Uma **resposta única** é produzida em uma única resposta do modelo, sem uma sequência controlada pelo aplicativo de verificações externas. Pode ser perfeitamente adequada para reescrever um e-mail ou resumir um documento já fornecido. Adicionar pesquisas e revisões a essa tarefa pode apenas introduzir atrasos. Use um loop quando a próxima ação depender genuinamente de informações que ainda não estão disponíveis.

Para uma comparação de fornecedores, uma primeira pesquisa pode revelar que uma oferta atraente tem o tamanho do pacote errado. A próxima pesquisa deve restringir a especificação do produto, em vez de coletar mais das mesmas ofertas. Uma resposta fixa escrita antes dessa descoberta poderia comparar produtos diferentes. O loop justifica seu custo tomando uma decisão materialmente melhor, não apenas aparentando estar ocupado.

Um modelo projetado para um raciocínio mais deliberado e um loop de agente são escolhas diferentes. Um modelo pode gastar mais esforço em uma resposta sem entrar em contato com um banco de dados de fornecedores. Um aplicativo também pode executar um loop de ferramentas com um modelo padrão. [Raciocínio versus modelos padrão](https://docs.aivax.net/pt-br/learn/models/reasoning-vs-standard-models.md) explica a escolha do modelo; nenhuma dessas opções elimina a necessidade de verificar fatos externos.

## Exemplo prático: encontre o fornecedor mais barato e redija um e-mail

Comece definindo “mais barato” e “concluído”. Para este exemplo, o comprador deseja o menor custo total cotado para um produto e quantidade específicos, incluindo a entrega, entre fornecedores que o negócio está autorizado a usar. O resultado é uma comparação e um rascunho de consulta não enviado. Fazer um pedido e enviar o e-mail estão fora do escopo. Se o comprador não tiver fornecido um destino ou prazo, pergunte antes de presumir que a comparação é significativa.

1. **Concordar com a comparação**

Registre a especificação do produto, quantidade, destino da entrega e fornecedores aceitáveis. Marque qualquer requisito ausente que mudaria a escolha.

2. **Recolher ofertas atuais**

Use uma ferramenta de pesquisa ou catálogo autorizada. Mantenha a fonte, data, tamanho do pacote, status de estoque e condições de entrega de cada oferta juntas.

3. **Observar uma incompatibilidade**

O preço anunciado mais baixo é para um pacote menor. Exclua-o ou converta-o para uma quantidade equivalente usando uma ferramenta de cálculo; não compare preços diretos diretamente.

4. **Revisar a próxima ação**

Uma oferta otherwise adequada omite a entrega. Peça essa informação ausente ou marque o total como desconhecido, em vez de classificá-la silenciosamente como a primeira.

5. **Retornar o resultado delimitado**

Apresente o total verificado mais baixo entre as ofertas verificadas, observe cotações não resolvidas e rascunhe a consulta. Pare sem enviar ou comprar.

Observe a expressão “entre as ofertas verificadas”. É uma conclusão defensável, diferente de “o fornecedor mais barato em qualquer lugar”. O agente não pode estabelecer uma afirmação universal a partir de uma pesquisa limitada. Uma resposta final útil explica o limite da comparação e qualquer fato que possa alterar a recomendação. O rascunho pode perguntar sobre uma questão de entrega não resolvida sem implicar que o fornecedor já respondeu.

As descrições das ferramentas também moldam o loop. Se uma ferramenta de pesquisa e uma ferramenta de compra estiverem ambas disponíveis, o agente deve conhecer seus efeitos diferentes. O software deve impor as operações permitidas, em vez de confiar apenas em uma frase no prompt. Consulte [Adicionando ferramentas](https://docs.aivax.net/pt-br/learn/agents/adding-tools.md) para a diferença entre solicitar uma ação e executá-la.

## Projete as saídas antes da entrada

Um loop precisa de **condições de parada**: situações explícitas nas quais ele deve terminar, pausar ou devolver o controle. “Continuar até ficar confiante” é muito vago. Modelos podem soar certos sem melhores evidências, e pesquisas repetidas podem continuar revelando algo novo para verificar. Decida quais evidências são suficientes para esta decisão empresarial específica.

- **Sucesso** — A comparação acordada está completa e o rascunho não enviado está pronto. Mais pesquisas não satisfariam um requisito adicional.

- **Autoridade ou informação ausente** — O próximo passo precisa de permissão ou de um detalhe material do usuário. Pause e faça uma pergunta focada.

- **Sem progresso útil** — Tentativas repetidas retornam a mesma evidência ausente ou inutilizável. Explique a lacuna em vez de circular indefinidamente.

- **Limite de recurso** — O limite de etapa, tempo ou orçamento financeiro foi atingido. Retorne um resultado parcial claramente rotulado, não um sucesso falso.

Um **limite de etapas** limita quantas ações ou chamadas de modelo o aplicativo permite. Defina quais eventos contam: uma nova tentativa ainda consome recursos, e uma pesquisa delegada não deve escapar do orçamento. Adicione um limite de tempo decorrido e um limite de gastos como controles separados. O software fora do modelo deve impor esses limites, porque uma instrução para ser econômico não é uma barreira confiável de gastos.

Mantenha o teste de sucesso observável. “Comparou os fornecedores permitidos com quantidades equivalentes e registrou os custos de entrega ausentes” pode ser inspecionado. “Pesquisou exaustivamente” não pode. Quando o agente parar antecipadamente, o usuário deve ver o que foi concluído, o que permanece desconhecido e qual decisão é necessária. O trabalho parcial ainda pode ser valioso se seus limites forem visíveis.

## Cada iteração tem um preço

As chamadas de modelo processam **tokens**, as partes de texto que um modelo lê e escreve. Cada iteração pode repetir instruções, mensagens anteriores e resultados de ferramentas como entrada, gerando então uma nova resposta. Serviços de ferramentas podem adicionar suas próprias cobranças. À medida que o histórico cresce, iterações posteriores podem custar mais do que as anteriores; duas vezes mais iterações não significam necessariamente apenas duas vezes o custo total.

**Custo cumulativo de trabalho versus iterações (ilustrativo)**

| | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Histórico de conversa crescente | 1 unidades de custo | 2.3 unidades de custo | 3.9 unidades de custo | 5.8 unidades de custo | 8 unidades de custo |

Unidades de ensino arbitrárias, não preços ou desempenho medido. Chamadas posteriores neste exemplo processam mais contexto acumulado.

Reduza o desperdício solicitando resultados de ferramentas focados, mantendo um registro factual conciso e evitando verificações repetidas de informações inalteradas. Os resumos devem preservar evidências importantes, incerteza e limites de aprovação; encurtar o histórico não deve remover o fato de que o envio é proibido. Escolha um orçamento apropriado ao valor da decisão, meça então os resultados concluídos em vez de recompensar planos mais longos.

**Relacionado:** No AIVAX, instruções reutilizáveis, ferramentas e configurações de contexto pertencem a um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Essas configurações fazem parte da configuração do agente; seu aplicativo ainda precisa de critérios explícitos de conclusão e controle sobre a tarefa geral.

Próximos passos: explore como as mesmas fronteiras se aplicam quando o trabalho é dividido em [Arquiteturas e orquestração multi-agente](https://docs.aivax.net/pt-br/learn/advanced-agents/multi-agent-architectures.md).

**Verifique seu conhecimento.** O comprador solicitou uma comparação de fornecedores e um rascunho de e-mail, não uma compra. Qual resultado respeita melhor a tarefa?

1. Continue pesquisando até que o modelo diga estar completamente confiante
2. Pare com uma comparação de totais verificados, rotule as informações ausentes e deixe o e-mail não enviado
3. Envie uma consulta a todos os fornecedores automaticamente porque mais evidências são sempre melhores
4. Remova o limite de iteração sempre que uma cotação estiver ausente

Answer: option 2. A tarefa é uma comparação delimitada e um rascunho. Evidências claras, incerteza visível e respeito pela fronteira de envio são mais importantes do que buscas infinitas ou confiança autorrelatada.
