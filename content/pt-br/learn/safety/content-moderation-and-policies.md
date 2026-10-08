---
{title: Moderação de conteúdo e políticas de uso,linkTitle: Moderação e políticas de uso,description: Defina os limites de um agente e responda a solicitações inseguras ou fora do escopo sem abandonar as necessidades legítimas do usuário.,weight: 40,duration: 12,objectives: ["Distinguir moderação de entrada, moderação de saída e controles de ação.",Redigir limites de tópicos que se ajustem ao propósito e ao público do agente.,Projetar recusas úteis e tratamento proporcional de abusos.,Testar políticas tanto contra solicitações nocivas quanto contra discussões legítimas.],sourceHash: 82c5b8d6b72d7d0d}
---

Um cliente digita uma reclamação irritada contendo um insulto. Outro pergunta como proteger uma conta após receber uma ameaça. Uma lista simples de palavras bloqueadas pode rejeitar ambas as mensagens. Contudo, uma pode precisar de atendimento ao cliente calmo e a outra de orientação de segurança. A moderação de conteúdo funciona melhor quando entende o propósito da solicitação, não apenas as palavras que contém.

**Moderação de conteúdo** é o processo de decidir se o conteúdo pode ser aceito, gerado ou exibido sob uma política. Uma **política de uso** define o que um serviço permite, restringe e faz quando um limite é alcançado. A política é a regra; a moderação é uma forma de aplicá‑la. Nenhuma delas deve ficar totalmente a cargo do que o modelo responder.

## Verifique ambos os lados da conversa

**Moderação de entrada** examina o material antes que ele chegue ao modelo ou a outro componente. Ela pode identificar solicitações que exigem recusa, esclarecimento ou tratamento especializado. Inclua anexos e material fornecido por ferramentas quando relevante, não apenas a caixa de texto que o usuário vê.

**Moderação de saída** examina o rascunho da resposta antes que ele chegue ao usuário. Mesmo uma pergunta legítima pode gerar uma resposta inadequada, uma acusação não suportada ou informação que o usuário não deveria receber. Verificar apenas a entrada, deixa uma lacuna importante. As verificações devem se adequar ao propósito e ao risco do serviço, e não aplicar cegamente a mesma regra em todos os casos.

{{< flow "User request | Input checks | Agent and permitted tools | Output checks | Answer or safe alternative" >}}

Esse fluxo simplificado não é a arquitetura completa de segurança. Uma ferramenta pode enviar um e‑mail ou alterar um registro antes que exista uma resposta final. Essas ações precisam de permissões e verificações de política separadas antes da execução. Bloquear a mensagem final não pode desfazer uma ação já concluída. [Adding guardrails](../agents/adding-guardrails.md) explica como esses controles se encaixam ao redor do agente.

Para respostas em streaming, onde o texto aparece conforme é gerado, decida como as verificações de saída necessárias funcionam antes da liberação. Uma mensagem que já foi exibida não pode ser tornada invisível por uma recusa posterior. Dependendo do risco, a aplicação pode precisar checar respostas completas ou partes verificadas, em vez de exibir tudo imediatamente.

## Defina mais do que conteúdo proibido

Uma política útil cobre o propósito do agente, bem como material nocivo. Um assistente de entregas não deve se tornar um consultor médico geral apenas porque um usuário pede educadamente. Isso é um **limite de tópico**: o limite dos assuntos e ações que o agente foi projetado para lidar competentemente.

{{< cards >}}
{{< card title="Supported work" icon="briefcase" >}}
Declare o que o agente pode responder e fazer. Exemplos incluem explicar regras de devolução publicadas ou coletar informações para um agendamento.
{{< /card >}}
{{< card title="Restricted work" icon="shield" >}}
Identifique solicitações que exigem recusa ou revisão humana, como divulgar registros de outro cliente ou fazer uma garantia não suportada.
{{< /card >}}
{{< card title="Audience conditions" icon="user" >}}
Defina restrições de idade, linguagem apropriada e requisitos de acesso. Verifique as regras que se aplicam ao seu serviço em vez de presumir que todos os usuários são adultos.
{{< /card >}}
{{< card title="Safe alternatives" icon="compass" >}}
Descreva o que o agente deve oferecer quando não puder concluir uma solicitação: informação geral, uma tarefa suportada ou um caminho para uma pessoa qualificada.
{{< /card >}}
{{< /cards >}}

Alguns assuntos são **regulados**, ou seja, leis ou normas profissionais restringem como podem ser tratados. Cuidados médicos, serviços financeiros, consultoria jurídica e produtos com restrição de idade podem exigir controles especializados. O tom confiante de um agente não estabelece competência profissional, e um aviso legal não cria permissão para fornecer um serviço que sua organização não está autorizada a oferecer.

Para crianças e adolescentes, considere design adequado à idade, privacidade, conteúdo e consentimento ou verificação necessários. Não colete documentos de identidade apenas porque um assistente suspeita que alguém seja jovem. Escolha um processo proporcional, revisado legalmente e adequado ao serviço, e mantenha a verificação sensível fora da conversa comum sempre que possível.

## Redija regras que as pessoas possam aplicar

“Seja seguro” expressa uma intenção, mas não resolve casos difíceis. Uma política utilizável conecta uma categoria de solicitação a uma ação e a uma resposta. Ela identifica quem detém a regra, quais evidências importam e quando o agente deve solicitar a intervenção de uma pessoa em vez de improvisar.

{{< steps >}}
{{< step title="Describe the service and audience" >}}
Escreva uma breve declaração de quem o agente atende e quais tarefas ele suporta. Inclua canais e quaisquer restrições de idade ou profissionais relevantes ao serviço.
{{< /step >}}
{{< step title="Define allowed and restricted cases" >}}
Use exemplos simples, incluindo solicitações limítrofes. Distinga ajuda nociva de relatos legítimos, educação ou pedidos de proteção.
{{< /step >}}
{{< step title="Choose the response for each boundary" >}}
Decida se vai responder, fazer uma pergunta de esclarecimento, recusar a parte insegura, encaminhar a uma pessoa ou encerrar uma sessão abusiva repetida.
{{< /step >}}
{{< step title="Place enforceable checks" >}}
Mantenha permissões de identidade e ação na aplicação ou serviço conectado. Use verificações de conteúdo quando for necessária interpretação, com uma resposta segura explícita quando uma verificação obrigatória falhar.
{{< /step >}}
{{< step title="Review and test the policy" >}}
Designe um responsável, documente alterações e teste tanto solicitações proibidas quanto vizinhas legítimas. Ofereça aos usuários e à equipe um caminho para relatar bloqueios indevidos.
{{< /step >}}
{{< /steps >}}

Um **falso positivo** é uma solicitação inofensiva bloqueada erroneamente. Um **falso negativo** é uma solicitação proibida permitida indevidamente. Ambos são importantes. Uma política que bloqueia toda conversa difícil pode parecer segura, mas torna o serviço inutilizável para quem precisa de ajuda. Teste linguagem realista, citações, dialetos e frustração, não apenas exemplos limpos escritos pelo autor da política.

## Adapte a mesma estrutura para diferentes indústrias

Esses exemplos são pontos de partida para discussão, não políticas legais prontas. Cada um descreve um limite e uma alternativa útil. Sua organização deve revisar o produto real, jurisdição, público e capacidade da equipe antes de transformá‑los em regras operacionais.

{{< tabs >}}
{{< tab title="Retail support" >}}
Explique devoluções publicadas e ajude com o pedido do cliente conectado. Não revele o histórico de compras de outro cliente nem invente exceções de reembolso. Ofereça revisão humana quando o caso sair da política publicada.
{{< /tab >}}
{{< tab title="Healthcare administration" >}}
Ajude com horários de funcionamento e logística de agendamentos. Não diagnostique sintomas nem escolha tratamento. Encaminhe questões clínicas a um profissional adequado e siga um processo revisado para situações urgentes.
{{< /tab >}}
{{< tab title="Financial services" >}}
Explique informações de produtos aprovados dentro do escopo permitido pelo serviço. Não prometa retornos nem apresente uma recomendação pessoal como conselho garantido. Encaminhe adequação e decisões reguladas pelo processo autorizado.
{{< /tab >}}
{{< /tabs >}}

Um assistente interno também precisa de política. Funcionários podem discutir legitimamente incidentes, reclamações de discriminação ou ameaças de segurança em seu trabalho. Bloquear o assunto completamente pode impedir relatos. Em vez disso, diferencie o tratamento de um relatório autorizado da geração de abuso ou divulgação de informação restrita. Direitos de acesso e confidencialidade ainda se aplicam dentro da organização.

## Recuse a parte insegura, não a pessoa

Uma recusa útil é breve, específica o para explicar o limite e seguida por um próximo passo seguro. Evite julgamentos morais, acusações e descrições longas de verificações internas. Não repita informações sensíveis nem reexplique material nocivo na própria recusa.

{{< compare >}}
{{< side title="Poor refusal" tone="bad" >}}
“Request rejected. You violated our policy.” O usuário não sabe qual parte não pode ser concluída nem como resolver o problema legítimo.
{{< /side >}}
{{< side title="Helpful refusal" tone="good" >}}
“I can't share another customer's account information. If you need help with your own order, sign in through the support page, or I can explain how to contact our team.”
{{< /side >}}
{{< /compare >}}

A resposta melhor protege o limite sem debater o caráter do usuário. Também evita prometer uma ação que o agente não pode executar. Se ele não puder realmente criar um ticket de suporte, deve fornecer o caminho de contato disponível em vez de anunciar que uma pessoa foi notificada.

Trate o abuso de forma proporcional. Um usuário irritado descrevendo mau serviço é diferente de alguém que ameaça repetidamente a equipe ou tenta usar o sistema de forma indevida. Use um lembrete calmo quando apropriado, limite tentativas repetidas de acordo com um processo documentado e envolva funcionários treinados para situações que exigem julgamento. Não penalize automaticamente uma conta apenas porque o modelo inferiu intenção hostil a partir de linguagem ambígua.

## Mantenha a política conectada às operações

Monitore recusas indevidas, saídas nocivas que passaram nas verificações, resultados de apelações e incidentes envolvendo ferramentas. Armazene apenas os detalhes necessários para revisão, restrinja acesso e defina regras de retenção. Quando a política mudar, atualize as instruções do agente, as verificações da aplicação, orientações da equipe e casos de avaliação simultaneamente, para que não se contradigam.

Relacionado ao AIVAX: consulte os [Terms of Use](../../docs/legal/terms-of-service.md) para obrigações da plataforma. [AI workers](../../docs/inference/workers.md) são ganchos externos que podem permitir, parar ou modificar partes da execução do gateway. Eles podem apoiar controles específicos da aplicação, mas não substituem o design e a validação do processo completo de moderação.

Próximo passo: aprenda a explicar limites e transferir responsabilidade em [Transparency and human escalation](transparency-and-human-escalation.md).

{{< quiz options="Block every message containing an offensive word | Check only the final answer because that is all the user sees | Define contextual input and output checks, enforce action permissions and offer safe alternatives | Let each response invent its own policy based on tone" answer="3" explanation="Moderation needs context and controls at the relevant points. Final-output checks cannot undo tool actions, and keyword blocking alone can reject legitimate complaints or safety reports." >}}
Which approach best balances useful service with enforceable boundaries?
{{< /quiz >}}
