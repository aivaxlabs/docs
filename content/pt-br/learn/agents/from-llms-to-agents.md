---
{title: De LLMs a agentes,linkTitle: De LLMs a agentes,description: "Construa um modelo mental das instruções, contexto, ferramentas, conhecimento, diretrizes e memória que transformam um modelo de linguagem em um agente útil.",weight: 30,duration: 12,objectives: [Um modelo nu carece de dados e contexto para uma tarefa de negócios.,Explique o propósito de cada camada ao redor do modelo.,"Separe informações, instruções e permissão para agir.",Escolha um escopo inicial pequeno para um agente.],sourceHash: b2418594479490ca}
---

Dê a um modelo de linguagem básico a solicitação “Ajude este cliente com uma entrega danificada” e ele pode produzir uma resposta que soa sensata. Mas qual política ele deve seguir? O cliente provou ser o proprietário do pedido? Há uma substituição disponível? O sistema pode realizar essa substituição ou apenas rascunhar uma solicitação? O modelo não consegue responder a essas perguntas apenas com base na capacidade linguística.

Um agente combina o modelo com um aplicativo que fornece informações, expõe ações permitidas e gerencia o trabalho. Pense no modelo como um novo colega capaz e no aplicativo como o ambiente de trabalho ao seu redor. A habilidade de escrita é útil, mas o colega também precisa de um cargo, de um processo, de acesso aos sistemas aprovados e de uma fronteira clara entre suas decisões e as decisões de um gerente.

## Comece com uma função, não com uma coleção de recursos

Uma função inicial útil é estreita o suficiente para que o sucesso seja visível. “Explique a política de entregas danificadas e prepare uma solicitação para revisão” é mais fácil de avaliar do que “Gerencie a satisfação do cliente”. A primeira descrição tem uma entrada clara, uma saída útil e uma decisão humana explícita. A segunda deixa o sistema adivinhando quais ações são aceitáveis e quando parar.

Ao longo desta unidade, imagine um assistente de entregas ajudando um cliente com um pacote danificado. Adicionaremos camadas ao assistente, mas não porque todo agente precise de todas as capacidades. Cada camada deve resolver uma peça faltante específica. Um assistente que apenas explica políticas pode precisar de documentos, mas não de nenhuma ferramenta que altere um pedido. Um assistente que rascunha tickets pode não precisar de memória de longo prazo.

## Adicione as camadas deliberadamente

A seguinte construção é uma sequência didática, não um requisito para adiar a segurança até o final. Em um aplicativo real, os limites de permissão devem existir antes que qualquer ação consequente se torne disponível. As camadas funcionam juntas, e alguns aplicativos as organizam sob nomes diferentes.

{{< steps >}}
{{< step title="Instruções: defina a função" >}}
Explique que o assistente lida com perguntas sobre entregas, solicita informações ausentes e nunca promete uma substituição sem confirmação. As instruções descrevem o comportamento desejado, não a permissão técnica.
{{< /step >}}
{{< step title="Contexto: forneça o caso atual" >}}
Inclua a pergunta do cliente, o histórico relevante da conversa e os detalhes verificados que o aplicativo tem permissão para compartilhar. O modelo agora tem um caso para trabalhar, em vez de um problema abstrato.
{{< /step >}}
{{< step title="Ferramentas: exponha ações permitidas" >}}
Forneça uma maneira de consultar o pedido ou preparar um ticket. O modelo pode solicitar uma operação, enquanto o software circundante valida e executa.
{{< /step >}}
{{< step title="Conhecimento: forneça material autoritativo" >}}
Disponibilize a política atual de entregas danificadas. O assistente pode basear sua explicação em orientações aprovadas, em vez de uma expectativa genérica sobre devoluções de varejo.
{{< /step >}}
{{< step title="Habilidades: empacote métodos repetíveis" >}}
Forneça um manual reutilizável para reunir evidências e escrever uma solicitação de revisão. Isso evita recriar o procedimento independentemente em cada assistente.
{{< /step >}}
{{< step title="Controles: imponha os limites" >}}
Verifique o acesso, restrinja as ações disponíveis e encaminhe exceções para uma pessoa. Uma solicitação fora da autoridade do assistente não deve se tornar uma alteração no sistema apenas porque está bem redigida.
{{< /step >}}
{{< step title="Memória: retenha informações selecionadas" >}}
Quando justificado e permitido, salve informações úteis para interações futuras. Mantenha as evidências temporárias do caso separadas das informações destinadas a sobreviver entre conversas.
{{< /step >}}
{{< /steps >}}

As instruções respondem “Como você deve trabalhar?” O contexto responde “O que está acontecendo agora?” As ferramentas respondem “Quais operações você pode solicitar?” O conhecimento responde “Qual material de referência deve apoiar a resposta?” Essas distinções facilitam o diagnóstico de falhas. Se uma resposta de política estiver desatualizada, alterar o tom do assistente não a corrigirá. Se uma consulta de pedido for proibida, adicionar mais texto de política não a tornará permitida.

As unidades dedicadas desenvolvem essas partes: [Adicionando contexto](adding-context.md), [Adicionando ferramentas](adding-tools.md), [Adicionando conhecimento](adding-knowledge.md), [Adicionando habilidades](adding-skills.md) e [Adicionando controles](adding-guardrails.md). Instruções e memória também têm seus próprios tratamentos em [Escrevendo prompts e instruções bons](writing-good-prompts-and-instructions.md) e [Memória](../prompt-engineering/memory.md).

## Informação não é permissão

Um documento de política pode dizer que clientes elegíveis podem receber substituições. Esta é uma informação comercial, não uma autoridade para o modelo pedir uma. O aplicativo ainda deve verificar a elegibilidade, identificar a conta correta e impor quem pode solicitar a mudança. Da mesma forma, uma conversa dizendo “Eu sou o proprietário da conta” é uma afirmação, não uma prova de identidade.

Mantenha essa separação visível ao projetar o assistente. O modelo pode explicar uma política, fazer uma pergunta ou propor uma ação. O software responsável por um registro comercial deve decidir se a ação solicitada é autorizada e válida. Essa decisão não deve depender apenas do modelo lembrar de uma frase de suas instruções.

{{< cards >}}
{{< card title="Informação" icon="book" >}}
“A política permite substituição após revisão.” Isso ajuda a explicar o processo, mas não prova que este caso se qualifica.
{{< /card >}}
{{< card title="Ação proposta" icon="tools" >}}
“Prepare uma solicitação de substituição para este pedido.” Esta é uma solicitação ao software, não uma evidência de que uma substituição existe.
{{< /card >}}
{{< card title="Resultado confirmado" icon="check" >}}
“A solicitação de revisão foi criada.” Esta declaração precisa de um resultado bem-sucedido do sistema responsável.
{{< /card >}}
{{< /cards >}}

Essa distinção também ajuda os usuários. O assistente deve dizer se está rascunhando, solicitando, aguardando ou confirmando. Esses são estados diferentes. Uma frase reconfortante que os confunde pode fazer com que alguém pare de buscar ajuda quando nenhuma ação real ocorreu.

## Como as peças funcionam durante uma solicitação

Suponha que o cliente explique que o pacote chegou danificado. O aplicativo fornece as instruções do assistente e as informações relevantes do caso. O modelo pode decidir que precisa do status do pedido antes de responder. O aplicativo verifica se o usuário pode acessar esse pedido, executa a consulta e retorna um resultado permitido. Um trecho relevante da política também é fornecido quando necessário.

{{< flow "Solicitação do cliente | Instruções e contexto relevante | Modelo escolhe o próximo passo | Aplicativo verifica e executa a ação | Resultado informa a resposta" >}}

O modelo agora tem fundamentos melhores para sua resposta. Ele pode explicar como enviar evidências, preparar um ticket de revisão ou fazer uma pergunta esclarecedora. Se o serviço de pedidos estiver indisponível, a resposta deve refletir essa limitação. Se a política excluir o caso, o assistente deve explicar a próxima rota disponível, em vez de reinterpretar a política para satisfazer o cliente.

O aplicativo pode repetir o ciclo de decisão e ação, mas também deve saber quando parar. Solicitar repetidamente o mesmo registro indisponível não cria progresso. Um agente delimitado tem regras para tentativas malsucedidas, informações ausentes e decisões fora de seu escopo. Uma transferência clara pode ser o resultado bem-sucedido, e não uma falha de automação.

## Adicione memória apenas por um motivo

Memória é informação retida intencionalmente para interações futuras. É diferente da conversa atual que o aplicativo inclui em uma solicitação. Uma preferência por explicações concisas pode ser útil mais tarde; um status de entrega temporário pode ser enganoso se salvo como se fosse permanente. Antes de reter informações, defina seu propósito, quem pode acessá-lo e quando deve expirar ou ser corrigido.

Um agente não desenvolve automaticamente uma biografia confiável de todos os usuários. A memória requer um processo de armazenamento e uma maneira de selecionar o que volta para o contexto posterior. A memória mal gerenciada pode preservar erros, misturar usuários ou divulgar informações onde não pertencem. Se a tarefa puder ser concluída com dados de caso frescos, isso pode ser um design mais simples.

## Crie o assistente completo menor possível

Um assistente pequeno, mas completo, precisa de mais do que uma demonstração de caminho feliz. Ele deve responder de forma sensata quando o usuário fornece informações incompletas, quando uma ação é rejeitada e quando as evidências discordam. Escolha exemplos representativos dessas situações antes de adicionar mais capacidades. Caso contrário, uma demonstração atraente pode esconder um processo que só funciona quando todas as dependências se comportam perfeitamente.

Pergunte o que cada camada proposta melhora e qual nova responsabilidade ela cria. Ferramentas precisam de permissões e tratamento de falhas. Conhecimento precisa de propriedade e atualizações. Memória precisa de regras de retenção. Habilidades precisam de condições claras de ativação. O objetivo não é a pilha maior de recursos; é suporte suficiente para o assistente cumprir uma função definida, sem fingir ter informações ou autoridade que lhe faltam.

**Relacionado:** No AIVAX, um [gateway de IA](../../docs/inference/ai-gateways/concepts.md) reúne configuração de modelo e capacidades de agente. As camadas conceituais acima ajudam você a decidir o que essa configuração realmente precisa.

**Próximo passo:** Analise de perto as informações fornecidas para cada solicitação em [Adicionando contexto](adding-context.md).

{{< quiz options="Dê a ele todas as ferramentas disponíveis e deixe-o aprender os limites a partir dos erros | Defina uma função estreita, forneça as informações necessárias e imponha ações permitidas fora do modelo | Adicione memória de longo prazo antes de decidir o que o assistente deve fazer | Trate o texto da política como permissão suficiente para modificar qualquer pedido" answer="2" explanation="Um agente útil combina um propósito claro, evidências relevantes e limites impostos. Capacidades extras devem atender a uma necessidade definida, em vez de substituir esse design." >}}
Qual é o ponto de partida mais forte para transformar um modelo em um assistente empresarial?
{{< /quiz >}}
