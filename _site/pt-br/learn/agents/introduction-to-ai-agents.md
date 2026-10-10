Source: https://docs.aivax.net/pt-br/learn/agents/introduction-to-ai-agents.html

Um cliente escreve: “Minha entrega não chegou e eu preciso dela para um evento.” Uma resposta útil requer mais do que um parágrafo amigável. Alguém deve entender o problema, encontrar o pedido, verificar as informações mais recentes da entrega e decidir quais opções permitidas oferecer. Um **AI agent** é um sistema de software que usa um modelo para escolher passos em direção a um objetivo, com informações e ações disponibilizadas por sua aplicação.

A palavra *agent* não significa uma pessoa digital ou um funcionário sem supervisão. Ela descreve como o software funciona. O sistema pode escolher o próximo passo ao invés de seguir apenas uma sequência fixa, mas sua competência e autoridade ainda dependem de seu design. Um agente de suporte pode investigar uma entrega atrasada enquanto permanece incapaz de emitir um reembolso.

## Imagine um novo colaborador

Imagine receber um novo colega na sua primeira manhã. Ele é bom em ler e escrever, mas não conhece sua empresa. Você lhe entrega um manual, explica suas responsabilidades, mostra a tela de atendimento ao cliente e fornece um telefone. Também informa quais decisões requerem um supervisor.

Um modelo de linguagem fornece parte da habilidade de leitura e escrita. Instruções atuam como a descrição do trabalho. Documentos de negócios funcionam como o manual. Ferramentas fornecem acesso controlado aos sistemas. Regras e revisão humana estabelecem os limites. Sem essas adições, mesmo um modelo capaz é como um novo colega respondendo a clientes a partir de experiência geral, e não de evidências da empresa.

A analogia tem limites. Uma pessoa pode perceber eventos físicos, desenvolver relacionamentos e assumir responsabilidades de maneiras que o software não pode. Um agente vê apenas as informações que sua aplicação fornece. Ele não sabe automaticamente que um pacote chegou, que uma política mudou ou que um cliente está autorizado a acessar um registro. Esses fatos precisam de fontes confiáveis.

## Chatbot, script ou agente?

Um **chatbot** é uma interface de conversação: algo que você pode enviar mensagem e receber uma resposta. Ele pode seguir regras fixas, usar um modelo de linguagem ou ter um agente. Um **script** é um programa que segue passos escritos previamente. Um agente usa um modelo para escolher alguns passos conforme a situação se desenvolve. Essas categorias se sobrepõem ao invés de formar uma escala de qualidade.

**Script fixo**

Quando uma entrega se atrasa, envie uma notificação padrão. A condição e a ação são especificadas antecipadamente. Isso é adequado quando cada caso deve seguir a mesma regra.

**Agente por trás de um chatbot**

Leia a preocupação do cliente, decida se é necessária a busca de um pedido, inspecione o resultado e escolha uma resposta permitida. A conversa pode se adaptar a informações ausentes ou a um resultado inesperado.

Um script pode enviar um e‑mail e um agente pode produzir apenas texto. Executar uma ação, portanto, não é a única distinção. A questão importante é de onde vêm as decisões sobre o próximo passo. Para uma tarefa precisamente definida, como adicionar totais de fatura, um software comum pode ser mais simples e confiável do que pedir a um modelo que decida o que fazer.

Um chatbot também pode ser útil sem se tornar um agente. Se os visitantes precisam de horário de funcionamento e direções, uma resposta clara pode ser suficiente. Adicionar ferramentas e um ciclo de decisão introduz mais coisas para testar. Comece pelo trabalho que o usuário precisa que seja feito, não por um desejo de colocar o rótulo de agente em toda conversa.

## O ciclo perceber, decidir e agir

**Perceber** significa receber informações: uma mensagem, um documento ou o resultado de uma ferramenta. **Decidir** significa escolher o próximo passo usando o objetivo, as instruções e as evidências disponíveis. **Agir** significa solicitar uma operação permitida ou produzir uma resposta. A aplicação devolve o resultado, permitindo outra decisão. Esse padrão repetido é chamado de **loop**.

Perceber a solicitação → Decidir o próximo passo → Solicitar uma ação permitida → Observar o resultado → Continuar ou parar

Para a entrega atrasada, a primeira decisão pode ser perguntar qual pedido o cliente se refere. Quando a aplicação identifica um pedido autorizado, o agente pode solicitar seu status. Se o rastreamento indicar atraso, o agente pode explicar as opções disponíveis. Se a busca falhar, ele não deve fingir que verificou com sucesso. A nova informação altera o próximo passo.

1. **Receber o problema**

O cliente relata uma entrega desaparecida. O agente reconhece que é necessário um registro de pedido ativo, não uma explicação geral sobre envio.

2. **Coletar evidências suficientes**

A aplicação verifica o acesso e realiza uma busca de pedido. O resultado retornado torna‑se informação que o modelo pode usar.

3. **Escolher uma resposta delimitada**

O agente explica o status registrado, oferece opções permitidas ou encaminha o caso para uma pessoa. Ele para quando o objetivo é atingido ou quando atinge um limite definido.

O loop precisa de uma regra de parada. “Continuar tentando até que o cliente esteja satisfeito” é muito aberto: um sistema poderia repetir chamadas falhas ou fazer promessas cada vez mais sem suporte. Condições de parada melhores incluem receber um resultado confirmado, encontrar um serviço indisponível ou chegar a uma decisão reservada para uma pessoa. A aplicação deve impor limites ao trabalho assim como às permissões.

## Onde os agentes ajudam

Boas tarefas iniciais envolvem linguagem variada, mas um processo de negócio reconhecível. Clientes descrevem o mesmo problema de várias maneiras. Funcionários fazem perguntas sem saber o título de um documento. Um modelo pode ajudar a interpretar essas solicitações enquanto o software comum permanece responsável pelo acesso confiável a registros e por alterações.

- **Suporte ao cliente** — Encontre uma política relevante, verifique um pedido e prepare uma explicação. Escale exceções ao invés de inventar uma promessa.

- **Vendas** — Pergunte sobre as necessidades do comprador, colete requisitos relevantes e prepare a transferência. Não invente capacidades do produto para garantir interesse.

- **Trabalho de back-office** — Leia uma solicitação, reúna detalhes ausentes e elabore um ticket para aprovação. Mantenha a alteração de registro separada do rascunho.

- **Assistência interna** — Localize orientações aprovadas e explique-as em linguagem cotidiana. Respeite quais documentos cada funcionário tem permissão para acessar.

Observe que esses exemplos têm um final claro: uma pergunta respondida, um conjunto de requisitos concluído ou um ticket preparado. Eles não pedem ao agente para “gerenciar o departamento”. Responsabilidades menores são mais fáceis de explicar aos usuários, avaliar com base em exemplos e repassar quando algo dá errado.

## O que os agentes não fazem bem

Os agentes podem interpretar mal solicitações ambíguas, perder evidências relevantes e afirmar algo falso com confiança. Eles são especialmente arriscados quando solicitados a fazer cálculos exatos sem uma ferramenta de cálculo, inferir fatos privados que não receberam ou lidar com longas cadeias de decisões dependentes sem verificações. Uma explicação fluente não prova que uma tarefa foi concluída corretamente.

Algumas decisões também envolvem responsabilidade que não pode ser delegada sensatamente a um sistema gerador de texto. Aprovar um pagamento excepcional, interpretar uma reclamação grave ou tomar uma decisão de emprego consequente pode exigir julgamento humano responsável. Um agente pode organizar evidências para a pessoa sem tomar a decisão final.

Antes de escolher um agente, pergunte o que uma resposta errada poderia mudar. Um rascunho fraco pode ser editado; um pagamento não autorizado pode ser difícil de reverter. Comece com assistência que uma pessoa possa inspecionar, depois expanda a autoridade apenas onde evidências, permissões e avaliação aifiquem. Mais independência é uma escolha de design, não uma medida automática de progresso.

**Related:** No AIVAX, o runtime configurado que reúne um modelo, instruções e capacidades é chamado de [AI gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md).

**What's next:** Conheça o motor no centro deste sistema em [What is an LLM](https://docs.aivax.net/pt-br/learn/agents/what-is-an-llm.md).

**Verifique seu conhecimento.** O que mais diferencia utilmente um agente de IA em uma aplicação empresarial?

1. Deve operar sem nenhuma supervisão humana
2. Usa um modelo para escolher passos em direção a um objetivo dentro dos limites da aplicação
3. Pode acessar qualquer sistema empresarial porque entende linguagem
4. É sempre mais apropriado que um script fixo

Answer: option 2. Um agente pode escolher o próximo passo usando informações e ações permitidas. A aplicação ainda define seu acesso, regras de parada e supervisão humana.
