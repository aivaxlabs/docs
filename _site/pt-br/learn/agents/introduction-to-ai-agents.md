Source: https://docs.aivax.net/pt-br/learn/agents/introduction-to-ai-agents.html

Um cliente escreve: “Minha entrega não chegou, e preciso dela para um evento.” Uma resposta útil exige mais do que um parágrafo simpático. Alguém precisa entender o problema, localizar o pedido, verificar as informações mais recentes de entrega e decidir quais opções permitidas oferecer. Um **agente de IA** é um sistema de software que usa um modelo para escolher etapas rumo a um objetivo, com informações e ações disponibilizadas por sua aplicação.

A palavra *agente* não significa uma pessoa digital ou um funcionário sem supervisão. Ela descreve como o software funciona. O sistema pode escolher a próxima etapa em vez de seguir apenas uma sequência fixa, mas sua competência e autoridade ainda dependem de seu design. Um agente de suporte pode investigar uma entrega atrasada enquanto permanece incapaz de emitir um reembolso.

## Imagine um novo funcionário

Imagine receber um novo colega no primeiro dia de trabalho. Ele é bom em leitura e escrita, mas não conhece sua empresa. Você lhe dá um manual, explica suas responsabilidades, mostra a tela de atendimento ao cliente e fornece um telefone. Você também informa quais decisões exigem um supervisor.

Um modelo de linguagem fornece parte da capacidade de leitura e escrita. As instruções atuam como a descrição do cargo. Os documentos comerciais atuam como o manual. As ferramentas fornecem acesso controlado aos sistemas. Regras e revisão humana estabelecem os limites. Sem essas adições, mesmo um modelo capaz é como um novo colega respondendo aos clientes com base na experiência geral, e não nas evidências da empresa.

A analogia tem limites. Uma pessoa pode notar eventos físicos, desenvolver relacionamentos e assumir responsabilidade de maneiras que o software não pode. Um agente vê apenas as informações que sua aplicação fornece. Ele não sabe automaticamente que um pacote chegou, que uma política mudou ou que um cliente está autorizado a acessar um registro. Esses fatos precisam de fontes confiáveis.

## Chatbot, script ou agente?

Um **chatbot** é uma interface conversacional: algo com o qual você pode enviar mensagens e receber uma resposta. Ele pode seguir regras fixas, usar um modelo de linguagem ou servir de front-end para um agente. Um **script** é um programa que segue etapas escritas antecipadamente. Um agente usa um modelo para escolher algumas etapas conforme a situação se desenrola. Essas categorias se sobrepõem, em vez de formar uma escada de qualidade.

**Script fixo**

Quando uma entrega se torna atrasada, envie uma notificação padrão. A condição e a ação são especificadas antecipadamente. Isso é adequado quando todos os casos devem seguir a mesma regra.

**Agente por trás de um chatbot**

Leia a preocupação do cliente, decida se é necessário pesquisar o pedido, inspecione o resultado e escolha uma resposta permitida. A conversa pode se adaptar à falta de informações ou a um resultado inesperado.

Um script pode enviar um e-mail e um agente pode produzir apenas texto. Portanto, realizar uma ação não é a única distinção. A pergunta importante é de onde vêm as decisões sobre a próxima etapa. Para uma tarefa precisamente definida, como somar totais de faturas, o software comum pode ser mais simples e confiável do que pedir a um modelo que decida o que fazer.

Um chatbot também pode ser útil sem se tornar um agente. Se os visitantes precisarem de horários de funcionamento e direções, uma resposta clara pode ser suficiente. Adicionar ferramentas e um loop de decisão introduz mais coisas a testar. Comece pelo trabalho que o usuário precisa realizar, não pelo desejo de atribuir o rótulo de agente a todas as conversas.

## O ciclo perceber, decidir e agir

**Perceber** significa receber informações: uma mensagem, um documento ou o resultado de uma ferramenta. **Decidir** significa escolher uma próxima etapa usando o objetivo, as instruções e as evidências disponíveis. **Agir** significa solicitar uma operação permitida ou produzir uma resposta. A aplicação retorna o resultado, permitindo outra decisão. Esse padrão repetido é chamado de **loop**.

Perceba a solicitação → Decida a próxima etapa → Solicite uma ação permitida → Observe o resultado → Continue ou pare

Para a entrega atrasada, a primeira decisão pode ser perguntar a qual pedido o cliente se refere. Assim que a aplicação identifica um pedido autorizado, o agente pode solicitar seu status. Se o rastreamento relatar um atraso, o agente pode explicar as opções disponíveis. Se a pesquisa falhar, ele não deve fingir que verificou com sucesso. As novas informações alteram a próxima etapa.

1. **Receba o problema**

O cliente relata uma entrega perdida. O agente reconhece que é necessário um registro de pedido ativo, não uma explicação geral sobre o envio.

2. **Reúna evidências suficientes**

A aplicação verifica o acesso e executa uma pesquisa de pedido. O resultado retornado torna-se informação que o modelo pode usar.

3. **Escolha uma resposta limitada**

O agente explica o status registrado, oferece opções permitidas ou encaminha o caso para uma pessoa. Ele para quando o objetivo é atingido ou atinge um limite definido.

O loop precisa de uma regra de parada. “Continue tentando até que o cliente esteja satisfeito” é muito aberto: um sistema poderia repetir chamadas fracassadas ou fazer promessas cada vez mais infundadas. Condições de parada melhores incluem receber um resultado confirmado, encontrar um serviço indisponível ou atingir uma decisão reservada para uma pessoa. A aplicação deve impor limites ao trabalho, bem quanto às permissões.

## Onde os agentes ajudam

Tarefas iniciais boas envolvem linguagem variada, mas um processo comercial reconhecível. Os clientes descrevem o mesmo problema de muitas maneiras. Os funcionários fazem perguntas sem saber o título de um documento. Um modelo pode ajudar a interpretar essas solicitações, enquanto o software comum permanece responsável pelo acesso confiável aos registros e pelas alterações.

- **Suporte ao cliente** — Encontre uma política relevante, verifique um pedido e prepare uma explicação. Escalone exceções em vez de inventar uma promessa.

- **Vendas** — Pergunte sobre as necessidades do comprador, reúna requisitos relevantes e prepare uma transferência. Não invente capacidades de produtos para garantir interesse.

- **Trabalho de back-office** — Leia uma solicitação, reúna detalhes faltantes e rascunhe um ticket para aprovação. Mantenha a alteração do registro separada do rascunho.

- **Assistência interna** — Localize orientações aprovadas e explique-as em linguagem cotidiana. Respeite quais documentos cada funcionário tem acesso permitido.

Observe que esses exemplos têm um fim claro: uma pergunta respondida, um conjunto de requisitos concluído ou um ticket preparado. Eles não pedem ao agente que “gerencie o departamento”. Responsabilidades menores são mais fáceis de explicar aos usuários, avaliar contra exemplos e transferir quando algo dá errado.

## O que os agentes não fazem bem

Os agentes podem mal-interpretar solicitações ambíguas, perder evidências relevantes e afirmar com confiança algo falso. Eles são especialmente arriscados quando solicitados a fazer cálculos exatos sem uma ferramenta de cálculo, inferir fatos privados que não receberam ou lidar com longas cadeias de decisões dependentes sem verificações. Uma explicação fluida não prova que uma tarefa foi concluída corretamente.

Algumas decisões também envolvem responsabilidade que não pode ser sensatamente delegada a um sistema gerador de texto. Aprovar um pagamento excepcional, interpretar uma reclamação grave ou tomar uma decisão de emprego consequential pode exigir julgamento humano responsável. Um agente pode organizar evidências para a pessoa sem tomar a decisão final por conta própria.

Antes de escolher um agente, pergunte o que uma resposta errada poderia mudar. Um rascunho fraco pode ser editado; um pagamento não autorizado pode ser difícil de reverter. Comece com assistência que uma pessoa possa inspecionar, depois expanda a autoridade apenas onde evidências, permissões e avaliação justificarem. Mais independência é uma escolha de design, não uma medida automática de progresso.

**Relacionado:** No AIVAX, o tempo de execução configurado que reúne um modelo, instruções e capacidades é chamado de [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md).

**Próximos passos:** Conheça o motor no centro deste sistema em [O que é um LLM](https://docs.aivax.net/pt-br/learn/agents/what-is-an-llm.md).

**Verifique seu conhecimento.** O que distingue mais utilmente um agente de IA em uma aplicação comercial?

1. Ele deve operar sem nenhuma supervisão humana
2. Ele usa um modelo para escolher etapas rumo a um objetivo dentro dos limites da aplicação
3. Ele pode acessar qualquer sistema comercial porque entende a linguagem
4. Ele é sempre mais apropriado do que um script fixo

Answer: option 2. Um agente pode escolher uma próxima etapa usando informações e ações permitidas. A aplicação ainda define seu acesso, regras de parada e supervisão humana.
