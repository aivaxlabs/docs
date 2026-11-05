---
{title: Introdução aos agentes de IA,linkTitle: Introdução aos agentes de IA,description: "Compreenda como um agente de IA combina linguagem, informações e ações permitidas para ajudar a concluir uma tarefa.",weight: 10,duration: 10,objectives: [Distinguir um agente de um chatbot e de um script fixo.,"O ciclo \"Perceber, Decidir e Agir\" (Perceive, Decide, Act) é um modelo fundamental para entender como sistemas inteligentes — sejam humanos, organizações ou algoritmos de IA — interagem com o ambiente. Em termos empresariais, esse ciclo descreve a tomada de decisão operacional e estratégica em tempo real.\n\nAqui está uma explicação detalhada usando um exemplo prático: **Uma Loja de Varejo Online que Usa Inteligência Artificial para Personalização**.\n\n### 1. Perceber (Perceive)\nNesta fase, a empresa coleta dados do ambiente externo e interno. O objetivo é obter uma visão clara da situação atual.\n\n*   **No exemplo:** A plataforma de e-commerce monitora continuamente as ações dos usuários. Ela percebe que um cliente específico, João, visitou a página de tênis de corrida três vezes nos últimos dois dias, adicionou um par ao carrinho, mas não finalizou a compra. Além disso, o sistema percebe que há um estoque baixo desse modelo específico e que a concorrência lançou um produto similar com preço ligeiramente menor ontem.\n*   **Dados coletados:** Histórico de navegação, comportamento no carrinho, nível de estoque, preços da concorrência, sazonalidade.\n\n### 2. Decidir (Decide)\nCom os dados percebidos, a empresa (ou seu algoritmo) analisa as opções disponíveis, avalia riscos e benefícios, e escolhe a melhor ação possível com base em objetivos pré-definidos (como maximizar vendas, manter margens ou fidelizar clientes).\n\n*   **No exemplo:** O sistema de recomendação e precificação dinâmica processa os dados. Ele calcula que:\n    *   Se oferecer um desconto imediato, há alta probabilidade de conversão, mas a margem será reduzida.\n    *   Se esperar, o estoque pode acabar ou o cliente pode ir para a concorrência.\n    *   A análise preditiva indica que João é sensível a frete grátis mais do que a descontos diretos.\n    *   **Decisão:** O algoritmo decide enviar um e-mail personalizado para João oferecendo frete grátis na compra dos tênis, além de sugerir meias esportivas como complemento (cross-selling), aproveitando a urgência do estoque baixo.\n\n### 3. Agir (Act)\nEsta é a execução da decisão escolhida. A empresa implementa a ação no mundo real, afetando o ambiente e gerando novos dados para o próximo ciclo.\n\n*   **No exemplo:** O sistema envia automaticamente o e-mail promocional para João. Simultaneamente, ele ajusta a exibição do produto na página inicial de João, destacando a oferta de frete grátis e mostrando um contador de \"apenas 3 unidades restantes\".\n*   **Resultado:** João abre o e-mail, clica no link e finaliza a compra.\n\n### O Ciclo se Repete\nApós a ação, o ciclo recomeça imediatamente:\n*   **Nova Percepção:** O sistema percebe que João comprou os tênis e agora visualiza produtos relacionados, como garrafas de água esportivas.\n*   **Nova Decisão:** O sistema decide oferecer um cupom de 10% para a próxima compra dentro de 7 dias para incentivar a recompra.\n*   **Nova Ação:** O cupom é emitido e enviado por notificação push no aplicativo móvel.\n\n### Por que esse ciclo é importante nos negócios?\n\n1.  **Velocidade e Agilidade:** Empresas que automatizam esse ciclo (usando IA e big data) reagem mais rápido às mudanças do mercado do que concorrentes que dependem de decisões manuais lentas.\n2.  **Personalização em Escala:** Permite tratar cada cliente de forma única, aumentando a satisfação e a receita.\n3.  **Otimização de Recursos:** Ao decidir com base em dados reais, a empresa evita desperdícios (como marketing genérico que não converte).\n4.  **Aprendizado Contínuo:** Cada \"Ação\" gera novos dados de \"Percepção\", permitindo que o sistema refine suas futuras \"Decisões\" (machine learning).\n\nEm resumo, o ciclo Perceber-Decidir-Agir transforma dados brutos em valor empresarial, criando um loop virtuoso de melhoria contínua e resposta adaptativa ao mercado.","Identifique tarefas úteis para agentes no suporte, vendas e trabalho de back-office.",Identifique tarefas que exigem regras mais rigorosas ou julgamento humano.],sourceHash: ad339442c82948cd}
---

Um cliente escreve: “Minha entrega não chegou, e preciso dela para um evento.” Uma resposta útil exige mais do que um parágrafo simpático. Alguém precisa entender o problema, localizar o pedido, verificar as informações mais recentes de entrega e decidir quais opções permitidas oferecer. Um **agente de IA** é um sistema de software que usa um modelo para escolher etapas rumo a um objetivo, com informações e ações disponibilizadas por sua aplicação.

A palavra *agente* não significa uma pessoa digital ou um funcionário sem supervisão. Ela descreve como o software funciona. O sistema pode escolher a próxima etapa em vez de seguir apenas uma sequência fixa, mas sua competência e autoridade ainda dependem de seu design. Um agente de suporte pode investigar uma entrega atrasada enquanto permanece incapaz de emitir um reembolso.

## Imagine um novo funcionário

Imagine receber um novo colega no primeiro dia de trabalho. Ele é bom em leitura e escrita, mas não conhece sua empresa. Você lhe dá um manual, explica suas responsabilidades, mostra a tela de atendimento ao cliente e fornece um telefone. Você também informa quais decisões exigem um supervisor.

Um modelo de linguagem fornece parte da capacidade de leitura e escrita. As instruções atuam como a descrição do cargo. Os documentos comerciais atuam como o manual. As ferramentas fornecem acesso controlado aos sistemas. Regras e revisão humana estabelecem os limites. Sem essas adições, mesmo um modelo capaz é como um novo colega respondendo aos clientes com base na experiência geral, e não nas evidências da empresa.

A analogia tem limites. Uma pessoa pode notar eventos físicos, desenvolver relacionamentos e assumir responsabilidade de maneiras que o software não pode. Um agente vê apenas as informações que sua aplicação fornece. Ele não sabe automaticamente que um pacote chegou, que uma política mudou ou que um cliente está autorizado a acessar um registro. Esses fatos precisam de fontes confiáveis.

## Chatbot, script ou agente?

Um **chatbot** é uma interface conversacional: algo com o qual você pode enviar mensagens e receber uma resposta. Ele pode seguir regras fixas, usar um modelo de linguagem ou servir de front-end para um agente. Um **script** é um programa que segue etapas escritas antecipadamente. Um agente usa um modelo para escolher algumas etapas conforme a situação se desenrola. Essas categorias se sobrepõem, em vez de formar uma escada de qualidade.

{{< compare >}}
{{< side title="Script fixo" >}}
Quando uma entrega se torna atrasada, envie uma notificação padrão. A condição e a ação são especificadas antecipadamente. Isso é adequado quando todos os casos devem seguir a mesma regra.
{{< /side >}}
{{< side title="Agente por trás de um chatbot" >}}
Leia a preocupação do cliente, decida se é necessário pesquisar o pedido, inspecione o resultado e escolha uma resposta permitida. A conversa pode se adaptar à falta de informações ou a um resultado inesperado.
{{< /side >}}
{{< /compare >}}

Um script pode enviar um e-mail e um agente pode produzir apenas texto. Portanto, realizar uma ação não é a única distinção. A pergunta importante é de onde vêm as decisões sobre a próxima etapa. Para uma tarefa precisamente definida, como somar totais de faturas, o software comum pode ser mais simples e confiável do que pedir a um modelo que decida o que fazer.

Um chatbot também pode ser útil sem se tornar um agente. Se os visitantes precisarem de horários de funcionamento e direções, uma resposta clara pode ser suficiente. Adicionar ferramentas e um loop de decisão introduz mais coisas a testar. Comece pelo trabalho que o usuário precisa realizar, não pelo desejo de atribuir o rótulo de agente a todas as conversas.

## O ciclo perceber, decidir e agir

**Perceber** significa receber informações: uma mensagem, um documento ou o resultado de uma ferramenta. **Decidir** significa escolher uma próxima etapa usando o objetivo, as instruções e as evidências disponíveis. **Agir** significa solicitar uma operação permitida ou produzir uma resposta. A aplicação retorna o resultado, permitindo outra decisão. Esse padrão repetido é chamado de **loop**.

{{< flow "Perceba a solicitação | Decida a próxima etapa | Solicite uma ação permitida | Observe o resultado | Continue ou pare" >}}

Para a entrega atrasada, a primeira decisão pode ser perguntar a qual pedido o cliente se refere. Assim que a aplicação identifica um pedido autorizado, o agente pode solicitar seu status. Se o rastreamento relatar um atraso, o agente pode explicar as opções disponíveis. Se a pesquisa falhar, ele não deve fingir que verificou com sucesso. As novas informações alteram a próxima etapa.

{{< steps >}}
{{< step title="Receba o problema" >}}
O cliente relata uma entrega perdida. O agente reconhece que é necessário um registro de pedido ativo, não uma explicação geral sobre o envio.
{{< /step >}}
{{< step title="Reúna evidências suficientes" >}}
A aplicação verifica o acesso e executa uma pesquisa de pedido. O resultado retornado torna-se informação que o modelo pode usar.
{{< /step >}}
{{< step title="Escolha uma resposta limitada" >}}
O agente explica o status registrado, oferece opções permitidas ou encaminha o caso para uma pessoa. Ele para quando o objetivo é atingido ou atinge um limite definido.
{{< /step >}}
{{< /steps >}}

O loop precisa de uma regra de parada. “Continue tentando até que o cliente esteja satisfeito” é muito aberto: um sistema poderia repetir chamadas fracassadas ou fazer promessas cada vez mais infundadas. Condições de parada melhores incluem receber um resultado confirmado, encontrar um serviço indisponível ou atingir uma decisão reservada para uma pessoa. A aplicação deve impor limites ao trabalho, bem quanto às permissões.

## Onde os agentes ajudam

Tarefas iniciais boas envolvem linguagem variada, mas um processo comercial reconhecível. Os clientes descrevem o mesmo problema de muitas maneiras. Os funcionários fazem perguntas sem saber o título de um documento. Um modelo pode ajudar a interpretar essas solicitações, enquanto o software comum permanece responsável pelo acesso confiável aos registros e pelas alterações.

{{< cards >}}
{{< card title="Suporte ao cliente" icon="chat" >}}
Encontre uma política relevante, verifique um pedido e prepare uma explicação. Escalone exceções em vez de inventar uma promessa.
{{< /card >}}
{{< card title="Vendas" icon="briefcase" >}}
Pergunte sobre as necessidades do comprador, reúna requisitos relevantes e prepare uma transferência. Não invente capacidades de produtos para garantir interesse.
{{< /card >}}
{{< card title="Trabalho de back-office" icon="list-check" >}}
Leia uma solicitação, reúna detalhes faltantes e rascunhe um ticket para aprovação. Mantenha a alteração do registro separada do rascunho.
{{< /card >}}
{{< card title="Assistência interna" icon="book" >}}
Localize orientações aprovadas e explique-as em linguagem cotidiana. Respeite quais documentos cada funcionário tem acesso permitido.
{{< /card >}}
{{< /cards >}}

Observe que esses exemplos têm um fim claro: uma pergunta respondida, um conjunto de requisitos concluído ou um ticket preparado. Eles não pedem ao agente que “gerencie o departamento”. Responsabilidades menores são mais fáceis de explicar aos usuários, avaliar contra exemplos e transferir quando algo dá errado.

## O que os agentes não fazem bem

Os agentes podem mal-interpretar solicitações ambíguas, perder evidências relevantes e afirmar com confiança algo falso. Eles são especialmente arriscados quando solicitados a fazer cálculos exatos sem uma ferramenta de cálculo, inferir fatos privados que não receberam ou lidar com longas cadeias de decisões dependentes sem verificações. Uma explicação fluida não prova que uma tarefa foi concluída corretamente.

Algumas decisões também envolvem responsabilidade que não pode ser sensatamente delegada a um sistema gerador de texto. Aprovar um pagamento excepcional, interpretar uma reclamação grave ou tomar uma decisão de emprego consequential pode exigir julgamento humano responsável. Um agente pode organizar evidências para a pessoa sem tomar a decisão final por conta própria.

Antes de escolher um agente, pergunte o que uma resposta errada poderia mudar. Um rascunho fraco pode ser editado; um pagamento não autorizado pode ser difícil de reverter. Comece com assistência que uma pessoa possa inspecionar, depois expanda a autoridade apenas onde evidências, permissões e avaliação justificarem. Mais independência é uma escolha de design, não uma medida automática de progresso.

**Relacionado:** No AIVAX, o tempo de execução configurado que reúne um modelo, instruções e capacidades é chamado de [gateway de IA](../../docs/inference/ai-gateways/concepts.md).

**Próximos passos:** Conheça o motor no centro deste sistema em [O que é um LLM](what-is-an-llm.md).

{{< quiz options="Ele deve operar sem nenhuma supervisão humana | Ele usa um modelo para escolher etapas rumo a um objetivo dentro dos limites da aplicação | Ele pode acessar qualquer sistema comercial porque entende a linguagem | Ele é sempre mais apropriado do que um script fixo" answer="2" explanation="Um agente pode escolher uma próxima etapa usando informações e ações permitidas. A aplicação ainda define seu acesso, regras de parada e supervisão humana." >}}
O que distingue mais utilmente um agente de IA em uma aplicação comercial?
{{< /quiz >}}
