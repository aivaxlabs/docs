---
{title: Loops de planejamento e raciocínio,linkTitle: Loops de planejamento e raciocínio,description: "Aprenda como um agente planeja, age, verifica resultados e revisa sua abordagem sem perder o controle de tempo, custo ou escopo.",weight: 10,duration: 12,objectives: ["Descrever o loop de planejar, agir, observar e revisar em linguagem cotidiana.",Distinguir um loop de agente útil de uma cadeia desnecessária de chamadas.,"Definir conclusão, condições de parada e limites de etapas antes da execução.",Explicar por que iterações repetidas podem aumentar tanto o custo quanto a incerteza.],sourceHash: 962f65723a7e4bad}
---

Suponha que você peça a um assistente para encontrar um fornecedor e rascunhar uma solicitação. Um resultado útil requer mais do que um parágrafo convincente. O assistente deve entender o que você precisa, encontrar ofertas atuais, comparar produtos equivalentes e lidar com detalhes ausentes. Algumas dessas decisões só se tornam possíveis após uma busca anterior retornar. Um plano ajuda a organizar o trabalho; um loop permite que o assistente se adapte quando os fatos mudam.

Um **agent loop** é um ciclo repetido de decidir o que fazer, executar uma ação, examinar o resultado e escolher o que vem a seguir. Pense em um comprador com uma lista de verificação, não em uma máquina que escreve uma decisão de compra completa de memória. A lista de verificação pode mudar, mas a autoridade e o orçamento do comprador não se expandem apenas porque a tarefa se torna difícil.

## Planejar, agir, observar, revisar

O **plano** indica os próximos passos úteis em direção a um resultado definido. Para **agir**, o agente solicita uma operação a uma ferramenta: software que pode buscar, calcular ou interagir com outro sistema. Para **observar**, ele lê o que realmente aconteceu. Para **revisar**, ele altera o plano restante à luz dessas evidências. Uma volta completa no ciclo é uma **iteração**.

{{< flow items="Planejar o próximo passo útil | Agir através de uma ferramenta autorizada | Observar o resultado real | Revisar, então continuar ou parar" direction="vertical" >}}

Essa abordagem costuma ser chamada de **Estilo ReAct**: raciocínio e ação se alternam. Em palavras simples, o agente não resolve tudo antes de verificar o mundo. Ele considera as evidências atuais, age e considera as novas evidências. Você não precisa de uma transcrição do raciocínio interno privado do modelo para supervisioná‑lo. Um resumo curto da ação, o resultado da ferramenta e a razão para o próximo passo fornecem um registro operacional mais útil.

A distinção entre plano e evidência importa. “Verificar custos de entrega” é uma intenção. “A cotação do fornecedor inclui entrega” é uma afirmação que precisa de fonte. Uma busca que não retornou resultado não é evidência de que a entrega é gratuita. O loop deve preservar essas diferenças para que um rascunhar confiante não transforme silenciosamente um desconhecido em um fato.

## Por que um loop pode superar uma resposta única

Uma **resposta única** é produzida em uma única resposta do modelo sem uma sequência controlada pela aplicação de verificações externas. Ela pode ser perfeitamente adequada para reescrever um e‑mail ou resumir um documento já fornecido. Acrescentar buscas e revisões a essa tarefa pode apenas introduzir atraso. Use um loop quando a próxima ação realmente depende de informações ainda não disponíveis.

Para uma comparação de fornecedores, a primeira busca pode revelar que uma oferta atraente tem o tamanho de embalagem errado. A busca seguinte deve restringir a especificação do produto ao invés de coletar mais ofertas iguais. Uma resposta fixa escrita antes dessa descoberta poderia comparar produtos diferentes. O loop justifica seu custo ao tomar uma decisão materialmente melhor, não ao parecer ocupado.

Um modelo projetado para raciocínio mais deliberado e um agent loop são escolhas diferentes. Um modelo pode gastar mais esforço em uma resposta sem contatar um banco de dados de fornecedores. Uma aplicação também pode executar um loop de ferramentas com um modelo padrão. [Reasoning versus standard models](../models/reasoning-vs-standard-models.md) explica a escolha do modelo; nenhuma das opções elimina a necessidade de verificar fatos externos.

## Exemplo prático: encontrar o fornecedor mais barato e rascunhar um e‑mail

Comece definindo “mais barato” e “finalizado”. Neste exemplo, o comprador quer o menor custo total cotado para um produto e quantidade especificados, incluindo entrega, entre os fornecedores que a empresa tem permissão para usar. O resultado é uma comparação e um rascunhar de solicitação não enviado. Fazer um pedido e enviar o e‑mail estão fora do escopo. Se o comprador não forneceu destino ou prazo, pergunte antes de fingir que a comparação é significativa.

{{< steps >}}
{{< step title="Concordar com a comparação" >}}
Registre a especificação do produto, quantidade, destino da entrega e fornecedores aceitáveis. Marque qualquer requisito ausente que poderia mudar a escolha.
{{< /step >}}
{{< step title="Coletar ofertas atuais" >}}
Use uma ferramenta de busca ou catálogo autorizada. Mantenha junto a fonte da oferta, data, tamanho da embalagem, status de estoque e termos de entrega.
{{< /step >}}
{{< step title="Observar um descompasso" >}}
O preço anunciado mais baixo é para uma embalagem menor. Exclua‑o ou converta‑o para uma quantidade equivalente usando uma ferramenta de cálculo; não compare preços de cabeçalho diretamente.
{{< /step >}}
{{< step title="Revisar a próxima ação" >}}
Uma oferta, caso contrário, omite entrega. Pergunte pela informação ausente ou marque o total como desconhecido ao invés de classificá‑la silenciosamente como a primeira.
{{< /step >}}
{{< step title="Retornar o resultado limitado" >}}
Apresente o menor total verificado entre as ofertas analisadas, note cotações não resolvidas e rascunhe a solicitação. Pare sem enviar ou comprar.
{{< /step >}}
{{< /steps >}}

Observe a formulação “entre as ofertas analisadas”. É uma conclusão defensável, ao contrário de “o fornecedor mais barato em qualquer lugar”. O agente não pode estabelecer uma afirmação universal a partir de uma busca limitada. Uma resposta final útil explica o limite da comparação e qualquer fato que possa mudar a recomendação. O rascunhar pode perguntar sobre uma entrega não resolvida sem implicar que o fornecedor já respondeu.

Descrições de ferramentas também moldam o loop. Se uma ferramenta de busca e uma ferramenta de compra estiverem disponíveis, o agente deve conhecer seus efeitos diferentes. O software deve impor as operações permitidas ao invés de confiar apenas em uma frase no prompt. Consulte [Adding tools](../agents/adding-tools.md) para a diferença entre solicitar uma ação e executá‑la.

## Projetar as saídas antes da entrada

Um loop precisa de **condições de parada**: situações explícitas nas quais ele deve terminar, pausar ou devolver o controle. “Continuar até ter confiança” é vago demais. Modelos podem soar confiantes sem evidência melhor, e buscas repetidas podem continuar descobrindo algo a ser verificado. Decida qual evidência é suficiente para esta decisão de negócio específica.

{{< cards >}}
{{< card title="Sucesso" icon="check" >}}
A comparação acordada está completa e o rascunhar não enviado está pronto. Mais buscas não atenderiam a um requisito adicional.
{{< /card >}}
{{< card title="Autoridade ou informação ausente" icon="user" >}}
A próxima etapa precisa de permissão ou de um detalhe material do usuário. Pause e faça uma pergunta focada.
{{< /card >}}
{{< card title="Sem progresso útil" icon="pause" >}}
Tentativas repetidas retornam a mesma evidência ausente ou inutilizável. Explique a lacuna ao invés de ficar circulando indefinidamente.
{{< /card >}}
{{< card title="Limite de recurso" icon="coin" >}}
O passo, tempo ou orçamento de gasto foi alcançado. Retorne um resultado parcial claramente rotulado, não um sucesso falso.
{{< /card >}}
{{< /cards >}}

Um **limite de etapas** restringe quantas ações ou chamadas ao modelo a aplicação permite. Defina quais eventos contam: uma nova tentativa ainda consome recursos, e uma busca delegada não deve fugir do orçamento. Adicione um limite de tempo decorrido e um limite de gasto como controles separados. O software fora do modelo deve impor esses limites, pois uma instrução para ser econômico não é uma barreira de gasto confiável.

Mantenha o teste de sucesso observável. “Comparou os fornecedores permitidos com quantidades equivalentes e registrou custos de entrega ausentes” pode ser inspecionado. “Pesquisou profundamente” não pode. Quando o agente para cedo, o usuário deve ver o que foi concluído, o que permanece desconhecido e que decisão é necessária. Trabalho parcial ainda pode ser valioso se seus limites forem visíveis.

## Cada iteração tem um preço

Chamadas ao modelo processam **tokens**, as partes de texto que o modelo lê e escreve. Cada iteração pode repetir instruções, mensagens anteriores e resultados de ferramentas como entrada, então gerar uma nova resposta. Serviços de ferramentas podem acrescentar suas próprias cobranças. À medida que o histórico cresce, iterações posteriores podem custar mais que as anteriores; duas vezes mais iterações não significa necessariamente apenas o dobro do custo total.

{{< chart type="line" title="Custo cumulativo do trabalho versus iterações (ilustrativo)" unit=" unidades de custo" data=`{"labels":["1","2","3","4","5"],"series":[{"name":"Histórico de conversa crescente","values":[1,2.3,3.9,5.8,8]}]}` caption="Unidades de ensino arbitrárias, não preços ou desempenho medido. Chamadas posteriores neste exemplo processam mais contexto acumulado." >}}

Reduza o desperdício solicitando resultados de ferramentas focados, mantendo um registro factual conciso e evitando verificações repetidas de informações inalteradas. Resumos devem preservar evidências importantes, incerteza e limites de aprovação; encurtar o histórico não deve remover o fato de que enviar é proibido. Escolha um orçamento adequado ao valor da decisão, depois meça os resultados concluídos ao invés de recompensar planos mais longos.

**Related:** No AIVAX, instruções reutilizáveis, ferramentas e configurações de contexto pertencem a um [AI gateway](../../docs/inference/ai-gateway.md). Essas configurações fazem parte da configuração do agente; sua aplicação ainda precisa de critérios explícitos de conclusão e controle sobre a tarefa geral.

O que vem a seguir: explore como os mesmos limites se aplicam quando o trabalho é dividido em [Multi-agent architectures and orchestration](multi-agent-architectures.md).

{{< quiz options="Continuar a buscar até que o modelo diga que está completamente confiante | Parar com uma comparação de totais verificados, rotular informações ausentes e deixar o e‑mail não enviado | Enviar uma solicitação a todos os fornecedores automaticamente porque mais evidência é sempre melhor | Remover o limite de iteração sempre que uma cotação estiver ausente" answer="2" explanation="A tarefa é uma comparação limitada e um rascunhar. Evidência clara, incerteza visível e respeito ao limite de envio importam mais que buscas intermináveis ou confiança auto‑relatada." >}}
O comprador solicitou uma comparação de fornecedores e um rascunhar de e‑mail, não uma compra. Qual resultado respeita melhor a tarefa?
{{< /quiz >}}
