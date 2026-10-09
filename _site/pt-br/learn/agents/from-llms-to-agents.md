Source: https://docs.aivax.net/pt-br/learn/agents/from-llms-to-agents.html

Dê a um modelo de linguagem puro a solicitação “Ajude este cliente com uma entrega danificada”, e ele pode produzir uma resposta que parece sensata. Mas qual política ele deve seguir? O cliente comprovou a propriedade do pedido? Um substituto está disponível? O sistema pode fazer esse substituto, ou apenas rascunhar a solicitação? O modelo não pode responder a essas perguntas apenas com habilidade linguística.

Um agente combina o modelo com uma aplicação que fornece informações, expõe ações permitidas e gerencia o trabalho. Pense no modelo como um novo colega capaz e na aplicação como o ambiente de trabalho ao redor dele. Habilidade de escrita é útil, mas o colega também precisa de um papel, um dossiê, acesso a sistemas aprovados e um limite claro entre suas decisões e as decisões de um gerente.

## Comece com um trabalho, não com uma coleção de recursos

Um trabalho inicial útil deve ser suficientemente estreito para que o sucesso seja visível. “Explique a política de entrega danificada e prepare uma solicitação para revisão” é mais fácil de avaliar do que “Gerenciar a felicidade do cliente”. A primeira descrição tem uma entrada clara, uma saída útil e uma decisão humana explícita. A segunda deixa o sistema adivinhando ações aceitáveis e quando parar.

Ao longo desta unidade, imagine um assistente de entregas ajudando um cliente com um pacote danificado. Vamos adicionar camadas ao assistente, mas não porque todo agente precise de todas as capacidades. Cada camada deve resolver uma peça faltante específica. Um assistente que apenas explica a política pode precisar de documentos, mas não de uma ferramenta que altere um pedido. Um assistente que cria tickets pode não precisar de memória de longo prazo.

## Adicione as camadas deliberadamente

A construção a seguir é uma sequência de ensino, não um requisito para adiar a segurança até o fim. Em uma aplicação real, limites de permissão devem existir antes que qualquer ação consequente esteja disponível. As camadas trabalham juntas, e algumas aplicações as organizam sob nomes diferentes.


1. **Instruções: definir o trabalho**

Explique que o assistente lida com perguntas sobre entregas, solicita informações faltantes e nunca promete um substituto sem confirmação. As instruções descrevem o comportamento desejado, não a permissão técnica.


2. **Contexto: fornecer o caso atual**

Inclua a pergunta do cliente, o histórico relevante da conversa e os detalhes verificados que a aplicação tem permissão para compartilhar. O modelo agora tem um caso para trabalhar, em vez de um problema abstrato.


3. **Ferramentas: expor ações permitidas**

Forneça um meio de consultar o pedido ou preparar um ticket. O modelo pode solicitar uma operação, enquanto o software ao redor valida e a executa.


4. **Conhecimento: fornecer material autoritário**

Disponibilize a política atual de entrega danificada. O assistente pode basear sua explicação em orientações aprovadas, em vez de uma expectativa genérica sobre devoluções no varejo.


5. **Habilidades: empacotar métodos repetíveis**

Forneça um manual reutilizável para coletar evidências e redigir uma solicitação de revisão. Isso evita recriar o procedimento de forma independente em cada assistente.


6. **Barreiras de segurança: aplicar os limites**

Verifique o acesso, restrinja ações disponíveis e direcione exceções a uma pessoa. Uma solicitação fora da autoridade do assistente não deve se tornar uma mudança no sistema apenas porque está bem formulada.


7. **Memória: reter informações selecionadas**

Quando justificado e permitido, salve informações úteis para interações posteriores. Mantenha evidências temporárias do caso separadas das informações que devem sobreviver entre conversas.





Instruções respondem “Como você deve trabalhar?” Contexto responde “O que está acontecendo agora?” Ferramentas respondem “Quais operações você pode solicitar?” Conhecimento responde “Qual material de referência deve apoiar a resposta?” Essas distinções facilitam o diagnóstico de falhas. Se uma resposta de política estiver desatualizada, mudar o tom do assistente não a corrigirá. Se a consulta ao pedido for proibida, adicionar mais texto de política não a tornará permitida.

As unidades dedicadas desenvolvem essas peças: [Adicionando contexto](https://docs.aivax.net/pt-br/learn/agents/adding-context.md), [Adicionando ferramentas](https://docs.aivax.net/pt-br/learn/agents/adding-tools.md), [Adicionando conhecimento](https://docs.aivax.net/pt-br/learn/agents/adding-knowledge.md), [Adicionando habilidades](https://docs.aivax.net/pt-br/learn/agents/adding-skills.md) e [Adicionando barreiras de segurança](https://docs.aivax.net/pt-br/learn/agents/adding-guardrails.md). Instruções e memória também têm seus próprios tratamentos em [Escrevendo bons prompts e instruções](https://docs.aivax.net/pt-br/learn/agents/writing-good-prompts-and-instructions.md) e [Memória](https://docs.aivax.net/pt-br/learn/prompt-engineering/memory.md).

## Informação não é permissão

Um documento de política pode dizer que clientes elegíveis podem receber substitutos. Isso é informação de negócio, não autoridade para o modelo fazer um pedido. A aplicação ainda deve verificar a elegibilidade, identificar a conta correta e aplicar quem pode solicitar a mudança. Da mesma forma, uma conversa dizendo “Eu sou o proprietário da conta” é uma alegação, não prova de identidade.

Mantenha essa separação visível ao projetar o assistente. O modelo pode explicar uma política, fazer uma pergunta ou propor uma ação. O software responsável por um registro de negócio deve decidir se a ação solicitada é autorizada e válida. Essa decisão não deve depender apenas do modelo lembrar de uma frase de suas instruções.


- **Informação** — “A política permite substituto após revisão.” Isso ajuda a explicar o processo, mas não prova que este caso se qualifica.

- **Ação proposta** — “Prepare uma solicitação de substituto para este pedido.” Isso é uma solicitação ao software, não evidência de que um substituto exista.

- **Resultado confirmado** — “A solicitação de revisão foi criada.” Essa afirmação requer um resultado bem‑sucedido do sistema responsável.




Essa distinção também ajuda os usuários. O assistente deve dizer se está rascunhando, solicitando, aguardando ou confirmando. São estados diferentes. Uma frase tranquilizadora que os mistura pode fazer alguém parar de buscar ajuda quando nenhuma ação real ocorreu.

## Como as peças funcionam durante uma solicitação

Suponha que o cliente explique que o pacote chegou danificado. A aplicação fornece as instruções do assistente e as informações disponíveis do caso. O modelo pode decidir que precisa do status do pedido antes de responder. A aplicação verifica se o usuário pode acessar aquele pedido, realiza a consulta e devolve um resultado permitido. Um trecho relevante da política também é fornecido quando necessário.

Solicitação do cliente → Instruções e contexto relevante → Modelo escolhe o próximo passo → Aplicação verifica e executa a ação → Resultado informa a resposta


O modelo agora tem fundamentos melhores para sua resposta. Ele pode explicar como enviar evidências, preparar um ticket de revisão ou fazer uma pergunta de esclarecimento. Se o serviço de pedidos estiver indisponível, a resposta deve refletir essa limitação. Se a política excluir o caso, o assistente deve explicar a rota disponível seguinte, em vez de reinterpretar a política para satisfazer o cliente.

A aplicação pode repetir o ciclo de decisão‑ação, mas também deve saber quando parar. Solicitar repetidamente o mesmo registro indisponível não cria progresso. Um agente limitado tem regras para tentativas malsucedidas, informações faltantes e decisões fora de seu escopo. Uma transição clara pode ser o resultado bem‑sucedido, não uma falha de automação.

## Adicione memória apenas por um motivo

Memória é informação retida intencionalmente para interações futuras. É diferente da conversa atual que a aplicação inclui em uma solicitação. Uma preferência por explicações concisas pode ser útil depois; um status de entrega temporário pode ser enganoso se salvo como se fosse permanente. Antes de reter informação, defina seu propósito, quem pode acessá‑la e quando deve expirar ou ser corrigida.

Um agente não desenvolve automaticamente uma biografia confiável de cada usuário. Memória requer um processo de armazenamento e um modo de selecionar o que volta ao contexto posterior. Memória mal gerenciada pode preservar erros, misturar usuários ou divulgar informações onde não pertence. Se a tarefa puder ser concluída com dados de caso frescos, isso pode ser um design mais simples.

## Crie o assistente completo menor

Um assistente pequeno mas completo precisa de mais do que uma demonstração de caminho feliz. Ele deve responder sensatamente quando o usuário fornece informações incompletas, quando uma ação é rejeitada e quando evidências discordam. Escolha exemplos representativos dessas situações antes de adicionar mais capacidades. Caso contrário, uma demonstração atraente pode esconder um processo que só funciona quando todas as dependências se comportam perfeitamente.

Pergunte o que cada camada proposta melhora e que nova responsabilidade ela cria. Ferramentas precisam de permissões e tratamento de falhas. Conhecimento precisa de propriedade e atualizações. Memória precisa de regras de retenção. Habilidades precisam de condições claras de ativação. O objetivo não é a maior pilha de recursos; é oferecer suporte suficiente para que o assistente execute um trabalho definido sem fingir ter informação ou autoridade que lhe falta.

**Relacionado:** No AIVAX, um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) reúne a configuração do modelo e as capacidades do agente. As camadas conceituais acima ajudam a decidir o que essa configuração realmente precisa.

**Próximo passo:** Observe atentamente as informações fornecidas para cada solicitação em [Adicionando contexto](https://docs.aivax.net/pt-br/learn/agents/adding-context.md).

**Verifique seu conhecimento.** Qual é o ponto de partida mais forte para transformar um modelo em um assistente de negócio?

1. Dê todas as ferramentas disponíveis e deixe que aprenda os limites com erros
2. Defina um trabalho estreito, forneça as informações necessárias e imponha ações permitidas fora do modelo
3. Adicione memória de longo prazo antes de decidir o que o assistente deve fazer
4. Trate o texto da política como permissão suficiente para modificar qualquer pedido

Answer: option 2. Um agente útil combina um propósito claro, evidências relevantes e limites impostos. Capacidades extras devem atender a uma necessidade definida, não substituir esse projeto.
