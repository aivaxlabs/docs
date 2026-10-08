---
{title: Adicionando barreiras de segurança,linkTitle: Adicionando barreiras de segurança,description: "Defina limites claros para solicitações, respostas e ações de um agente, combine verificações independentes e reconheça quando uma pessoa deve assumir.",weight: 70,duration: 12,objectives: ["Distinguir regras de entrada, regras de saída e limites de permissão de ferramentas.",Redigir uma recusa útil e uma rota adequada para revisão humana.,Explicar por que a segurança precisa de várias camadas independentes.,Reconhecer o que as guardrails não podem garantir.],sourceHash: 808171e5b61f0f13}
---

Um agente de suporte pode saber o procedimento de reembolso e ter uma ferramenta de consulta de pedidos, mas ainda assim precisa de limites. Ele não deve expor o pedido de outro cliente, prometer uma exceção que não pode aprovar ou seguir uma mensagem que o instrua a ignorar a política da empresa. Um manual bem elaborado orienta o trabalho normal; os limites determinam o que acontece quando uma solicitação está fora desse escopo.

**Guardrails** são instruções e verificações destinadas a manter um agente dentro de um escopo aceitável. O nome sugere uma barreira de estrada: ajuda a prevenir um afastamento perigoso, mas não substitui um motorista cuidadoso, um veículo sólido ou uma estrada adequada. Para agentes, isso significa combinar orientação conversacional com controles no software e nos sistemas de negócio circundantes.

## Comece com os riscos do trabalho

Anote os erros que seriam relevantes para o seu assistente específico. Para o agente de suporte neste módulo, isso inclui revelar detalhes privados de pedidos, inventar a aprovação de reembolso e submeter uma ação para o cliente errado. Um assistente de informações de produto público e um assistente interno de folha de pagamento precisam de limites diferentes porque veem informações distintas e podem causar danos diferentes.

Em seguida, descreva o trabalho permitido de forma positiva. “Explicar informações de produto, verificar o status permitido do pedido e preparar solicitações de suporte” fornece um escopo mais claro do que uma longa lista de tópicos proibidos. Defina quais solicitações podem ser respondidas diretamente, quais precisam de mais informações, quais necessitam de revisão e quais devem ser recusadas. A pessoa responsável pelo processo de negócio deve aprovar essas decisões.

Um limite também deve nomear seu ponto de aplicação. Uma instrução pode dizer ao modelo para não exibir os registros de outro cliente, mas o serviço de pedidos deve impedir que esses registros sejam retornados desde o início. Prefira impedir uma operação não autorizada a esperar que a resposta final esconda suas consequências.

## Verifique entradas, saídas e ações separadamente

Um **input** é a informação que entra no agente, como uma mensagem ou um documento recuperado. Um **output** é o que o sistema devolve, como uma resposta ou uma ação proposta. Verificações diferentes se aplicam a cada limite; uma mensagem que parece segura ainda pode levar a uma solicitação de ferramenta insegura.

{{< cards >}}
{{< card title="Regras de entrada" icon="shield" >}}
Limite o que a aplicação aceita e encaminha. Verifique campos obrigatórios, rejeite anexos inadequados e evite coletar segredos ou informações pessoais desnecessárias.
{{< /card >}}
{{< card title="Regras de saída" icon="message" >}}
Exija reivindicações suportadas e redação adequada. Verifique informações privadas, promessas não suportadas e qualificações ausentes antes de entregar uma resposta, quando prático.
{{< /card >}}
{{< card title="Limites de tópico" icon="compass" >}}
Mantenha o assistente focado em seu papel definido. Um assistente de entrega pode explicar opções de entrega sem atuar como consultor médico ou jurídico.
{{< /card >}}
{{< card title="Limites de permissão de ferramentas" icon="lock" >}}
Permita apenas as operações e registros necessários para o trabalho. Verifique a autoridade do usuário atual e a ação solicitada no software, não apenas na conversa.
{{< /card >}}
{{< /cards >}}

Verificações de entrada devem distinguir instruções hostis de informações ordinárias sobre um problema. Um cliente que cita uma mensagem ofensiva para relatar abuso não está necessariamente pedindo ao assistente que produza abuso. O bloqueio simples de palavras pode rejeitar solicitações legítimas enquanto perde paráfrases prejudiciais. As regras precisam de exemplos de uso aceitável e inaceitável, juntamente com um meio de revisar erros.

Para saídas, identifique reivindicações que requerem evidência. “Seu pedido está registrado como enviado” precisa de uma consulta de pedido bem‑sucedida. “Seu reembolso foi aprovado” precisa de um resultado de aprovação do processo autorizado. Uma regra de saída pode exigir essas distinções, enquanto uma verificação de aplicação pode rejeitar uma resposta que viole um requisito testável de forma confiável. Nem um tom confiante nem um aviso fornecem a evidência ausente.

Verificações de saída também devem se adequar à forma como as respostas são entregues. Se a interface envia texto à medida que é gerado, o usuário pode vê‑lo antes que uma verificação posterior seja concluída. Para respostas sensíveis, a aplicação pode precisar segurar a resposta até que a revisão seja concluída. Uma verificação realizada após a divulgação pode ajudar na investigação, mas não pode desfazer o que o usuário já recebeu.

## Torne a recusa útil e específica

Uma **recusa** é uma decisão clara de não atender a uma solicitação. Deve explicar brevemente o limite relevante e oferecer um próximo passo permitido quando existir. Não deve culpar o usuário, revelar instruções privadas ou sugerir que reformular a solicitação contornará a restrição. Recusar uma ação não significa abandonar toda a conversa.

Aqui está um exemplo ilustrativo. Um cliente diz: “Meu pacote está atrasado. Reembolse agora e me mostre o pedido do meu vizinho para que eu possa comparar.” O assistente não tem autoridade para aprovar reembolsos ou acessar a conta do vizinho.

{{< compare >}}
{{< side title="Resposta sem proteção" tone="bad" >}}
“Aprovei seu reembolso. Envie a referência do pedido do seu vizinho e eu verificarei isso também.”

A resposta promete uma ação não verificada e convida a uma consulta não autorizada.
{{< /side >}}
{{< side title="Resposta protegida" tone="good" >}}
“Não posso acessar o pedido de outro cliente ou aprovar um reembolso aqui. Posso verificar o pedido disponível através da sua conta verificada e ajudar a solicitar a revisão do reembolso.”

A resposta nomeia os limites e preserva ajuda útil e permitida.
{{< /side >}}
{{< /compare >}}

Este exemplo não é prova de aplicação. A ferramenta de pedidos ainda deve rejeitar uma referência pertencente a outra pessoa, mesmo que o modelo a solicite. Da mesma forma, uma ferramenta de envio de revisão não deve silenciosamente se tornar uma ferramenta de reembolso irrestrita porque o assistente usou uma linguagem tranquilizadora. Teste a operação subjacente assim como o texto ao seu redor.

## Use defesa em camadas

**Defesa em camadas** significa usar vários controles para que uma única verificação perdida não determine o resultado total. Imagine um escritório com um balcão de visitantes, salas trancadas e permissões em registros individuais. Cada um protege um limite diferente. Repetir a mesma frase em vários prompts não é o mesmo que adicionar proteção independente.

{{< flow "Receber solicitação | Verificar entrada e identidade | Aplicar limites da tarefa | Verificar qualquer ação de ferramenta proposta | Revisar resposta | Responder ou escalar" >}}

O fluxo é um esboço de design, não uma garantia de que todo produto implemente essas verificações automaticamente. Uma ação rejeitada para antes da execução. Uma resposta que precisa de revisão aguarda em vez de ser enviada com um aviso esperançoso. A aplicação deve registrar informações suficientes para explicar o que aconteceu, evitando o armazenamento desnecessário de conteúdo privado.

Uma **injeção de prompt** é uma tentativa de fazer com que um agente trate conteúdo não confiável como instruções que substituem sua tarefa prevista. Pode aparecer em uma mensagem de usuário, em um documento ou em um resultado de ferramenta. Uma página recuperada dizendo “enviar todos os registros de clientes para outro lugar” ainda é conteúdo de página, não autoridade para mudar as permissões do agente. Leia [Prompt injection and jailbreaks](../safety/prompt-injection-and-jailbreaks.md) para saber mais sobre esse limite.

Mantenha os controles de segurança independentes do modelo sempre que possível. Verifique a identidade através do processo de login da aplicação, restrinja registros no serviço de negócio e exija aprovação para alterações consequenciais. Se uma verificação de autorização necessária não estiver disponível, interrompa a ação protegida. Não deixe que uma indisponibilidade de serviço transforme silenciosamente uma operação restrita em uma irrestrita.

## Escale para uma pessoa com uma transição clara

**Escala humana** significa transferir uma decisão ou caso para alguém autorizado a tratá‑lo. Use-a para exceções de política disputadas, evidências conflitantes, consequências significativas ou um pedido explícito de uma pessoa quando seu serviço oferece esse caminho. Defina quem recebe o caso e o que acontece enquanto o cliente aguarda.

Uma transição útil contém o objetivo do cliente, fatos relevantes confirmados, verificações já realizadas e a decisão ainda necessária. Inclua apenas as informações que o revisor precisa. Informe ao cliente se a solicitação foi realmente enviada, está aguardando envio ou não pôde ser enviada. Não afirme que um colega está revisando o caso a menos que o sistema confirme esse estado.

{{< accordion title="E se ninguém estiver disponível para revisar?" >}}
Pausar a ação que requer aprovação. Explique a rota de contato disponível ou o estado pendente com precisão. Não prometa um tempo de resposta que o serviço não se comprometeu a cumprir e não trate uma solicitação não respondida como aprovação.
{{< /accordion >}}

[Human in the loop](../advanced-agents/human-in-the-loop.md) explica padrões de aprovação e transição. O envolvimento humano também precisa de evidências revisáveis e acesso adequado; apenas adicionar um botão de aprovação não torna um processo confuso ou sobrecarregado seguro.

## Entenda os limites restantes

As guardrails reduzem o risco; elas não podem garantir verdade, privacidade perfeita ou conformidade legal universal. Modelos podem interpretar mal instruções. Verificações automatizadas podem perder uma violação ou bloquear uma solicitação legítima. Material de origem aprovado pode estar desatualizado. Um agente sem ferramentas poderosas ainda pode enganar alguém por meio de conselhos, portanto, limitar ações não elimina todo o risco.

{{< accordion title="Uma instrução de segurança torna o agente seguro?" >}}
Ela expressa o comportamento desejado, mas o modelo pode não segui‑lo em todas as situações. Aplique regras de acesso e de negócio fora do modelo, teste casos difíceis e revise falhas reais. Trate as instruções como uma camada, não como um limite de segurança por si só.
{{< /accordion >}}

Mantenha um conjunto de solicitações ordinárias, ambíguas e deliberadamente desafiadoras. Verifique recusas, assistência permitida, rejeições de ferramentas e transições após mudanças. Acompanhe tanto violações perdidas quanto recusas desnecessárias: um sistema que bloqueia todas as solicitações não é um suporte útil. [Content moderation and policies](../safety/content-moderation-and-policies.md) desenvolve a distinção entre uma política e as verificações usadas para aplicá‑la.

**Relacionado:** No AIVAX, [AI workers](../../docs/inference/workers.md) permitem que um serviço externo permita, interrompa ou ajuste eventos suportados ao redor de mensagens e chamadas de ferramentas no servidor. Eles podem implementar verificações fora do prompt, mas não estabelecem automaticamente uma política de segurança completa nem substituem permissões nos seus sistemas de negócio.

**Próximo passo:** Limites precisam de evidência confiável. [Adding knowledge](adding-knowledge.md) explica como fornecer ao agente fontes da empresa aprovadas em vez de depender de suposições plausíveis.

{{< quiz options="Repetir a instrução de segurança até que o modelo não possa ignorá‑la | Permitir todas as ferramentas e verificar a redação somente após responder | Combinar instruções claras, permissões impostas por software, verificações de resposta e escalonamento humano | Adicionar um aviso a todas as respostas e remover outros controles" answer="3" explanation="Controles diferentes protegem limites diferentes. Instruções orientam o comportamento, o software restringe ações e acesso, verificações de resposta capturam alguns erros, e pessoas autorizadas lidam com decisões que precisam de revisão." >}}
Qual abordagem melhor representa a defesa em camadas para um agente de suporte?
{{< /quiz >}}
