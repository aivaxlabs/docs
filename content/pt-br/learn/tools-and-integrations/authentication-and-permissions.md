---
{title: Autenticação e permissões para ferramentas,linkTitle: Autenticação e permissões,description: Dê a um agente acesso suficiente para ajudar um usuário sem conceder a autoridade irrestrita de toda a organização.,weight: 30,duration: 12,objectives: [Distinguir autenticação de permissão para executar uma ação.,Comparar chaves de API de aplicação com tokens delegados por usuário.,Aplicar privilégio mínimo e acesso somente leitura ao projetar uma ferramenta.,"Identificar quando aprovação, registros de auditoria e proteção de segredos são necessários."],sourceHash: 5ebca7cafdfbd5d5}
---

Um assistente que pode explicar a política de reembolso é útil. Um assistente que pode emitir reembolsos está atuando dentro do seu negócio. Antes de conectar essa ferramenta, você precisa responder a uma pergunta mais importante do que “O modelo pode chamá‑la?”: “De quem é a autoridade que está sendo usada e o que essa autoridade permite?”

Pense em um agente como um funcionário temporário que trabalha em nome de alguém. Um crachá pode permitir que o funcionário entre no prédio, mas não deve abrir todos os armários, aprovar todas as faturas ou assinar todos os contratos. Uma boa segurança de ferramentas mantém identidade, acesso permitido e aprovação separados, mesmo quando a conversa faz parecer que são um só passo.

## Defina quem está agindo

**Autenticação** verifica a identidade: é o equivalente digital de conferir um crachá. **Autorização** verifica a permissão: decide quais portas esse crachá abre. Passar na autenticação não significa que toda ação solicitada é permitida. Um cliente reconhecido pode ler seus próprios pedidos, mas não os de outro cliente, e um funcionário autenticado ainda pode não ter permissão para alterar a folha de pagamento.

Frequentemente há várias identidades em uma interação de agente. A aplicação tem sua própria identidade técnica, a pessoa tem uma identidade de usuário e uma solicitação de ferramenta tem um propósito de negócio. O sistema precisa preservar a relação entre elas. “A aplicação de suporte fez esta solicitação” não é suficiente para determinar a registro do cliente deve ser acessado.

Uma mensagem de chat não é prova de identidade. “Eu sou o proprietário da conta” é apenas texto até que a aplicação a verifique por meio de um processo adequado de login ou verificação de conta. Da mesma forma, um argumento de ferramenta fornecido pelo modelo não deve determinar o acesso por conta própria. O sistema de negócio deve derivar a conta permitida a partir do contexto confiável da aplicação e, em seguida, verificar o registro solicitado contra ele.

{{< cards >}}
{{< card title="Identity" icon="user" >}}
Quem é o usuário para quem a aplicação está agindo? Use contexto de usuário verificado, não um nome ou reivindicação de conta escrita na conversa.
{{< /card >}}
{{< card title="Permission" icon="lock" >}}
O que essa identidade pode fazer? Imponha acesso tanto à operação quanto aos registros específicos envolvidos.
{{< /card >}}
{{< card title="Approval" icon="check" >}}
Uma pessoa autorizada concordou com essa ação consequente específica? A aprovação não substitui as verificações de identidade ou permissão.
{{< /card >}}
{{< card title="Audit record" icon="list-check" >}}
O que aconteceu, sob qual autoridade e com qual resultado? Mantenha evidências suficientes para investigação sem copiar conteúdo privado desnecessário.
{{< /card >}}
{{< /cards >}}

## Chaves de API e tokens por usuário

Uma **chave de API** é uma credencial que um programa apresenta ao chamar um serviço. Uma **credencial** é evidência usada para obter acesso, como uma senha ou token de acesso. Muitas chaves de API identificam uma aplicação ou conta em vez de um usuário final individual. Isso as torna convenientes para trabalhos de servidor‑para‑servidor, mas perigosas se a aplicação tratar cada usuário como tendo direito a tudo que a chave pode alcançar.

Um **token por usuário** é uma credencial associada ao acesso delegado de um usuário específico. **Delegação** significa permitir que uma aplicação execute um conjunto definido de ações em nome desse usuário. Um assistente de calendário, por exemplo, pode receber permissão para ler o calendário de uma pessoa sem receber as credenciais administrativas da organização. Tokens podem ter tempos de expiração e mecanismos para revogar o acesso; os detalhes dependem do serviço.

{{< compare >}}
{{< side title="Application API key" >}}
Frequentemente adequado para operações em segundo plano de uma conta de serviço. Sua aplicação ainda deve impor quais usuários e registros podem usar essa autoridade. Uma chave compartilhada não cria limites por usuário automaticamente.
{{< /side >}}
{{< side title="Delegated per-user token" >}}
Pode preservar o limite de acesso do usuário no serviço conectado. Requer fluxo de login e consentimento, armazenamento seguro e tratamento para expiração ou permissão revogada.
{{< /side >}}
{{< /compare >}}

Nenhum tipo de credencial é automaticamente seguro. Um token de usuário com privilégios amplos pode ser excessivo, e uma credencial de serviço restrita pode ser apropriada. Escolha de acordo com quem detém a tarefa. Um relatório de inventário noturno pode pertencer a uma conta de serviço; uma alteração de calendário pessoal normalmente deve preservar a identidade e as permissões da pessoa solicitante.

Quando o acesso expira, não troque silenciosamente por uma conta compartilhada mais poderosa. Peça ao usuário que reconecte ou encaminhe a tarefa para o operador responsável. Caso contrário, uma falha rotineira de autenticação pode se tornar uma expansão inesperada de autoridade. Torne a perda de acesso um estado de produto compreensível, não um convite para o modelo improvisar.

## Conceda a menor permissão útil

**Privilégio mínimo** significa conceder apenas o acesso necessário para a tarefa, e somente enquanto for necessário. Um **escopo** é um limite nomeado desse acesso, como ler tickets ou criar rascunhos. Alguns serviços oferecem escopos granulares; outros exigem que sua aplicação imponha restrições adicionais. Não presuma que um escopo exista apenas porque seu nome seria conveniente.

Comece com acesso **somente leitura**: o assistente pode inspecionar informações permitidas, mas não alterá‑las. Ler não é isento de risco, pois pode expor informações confidenciais. Contudo, isso separa erros de interpretação de erros que alteram o negócio. Quando a leitura funciona de forma confiável, adicione a menor capacidade de escrita necessária e teste-a de forma independente.

| Nível de permissão | Exemplo | Limite a impor |
| --- | --- | --- |
| Ler registros permitidos | Verificar o status do pedido do usuário atual | Restringir registros e campos a esse usuário |
| Preparar um rascunho | Rascunhar uma resposta ao cliente | Não enviar ou publicar automaticamente |
| Fazer uma alteração limitada | Adicionar uma nota a um ticket atribuído | Restringir tickets elegíveis e campos permitidos |
| Executar uma ação consequente | Enviar um reembolso ou remover acesso | Verificar política e exigir aprovação adequada |
| Administrar o serviço | Gerenciar acesso em toda a organização | Manter separado do trabalho rotineiro do assistente |

Os níveis são um auxílio de design, não um sistema de permissão universal. Um rascunho salvo em um espaço de trabalho compartilhado pode já divulgar informações, e uma edição aparentemente pequena pode ter consequências legais. Avalie o efeito real, incluindo quem pode ver o resultado, se há movimentação de dinheiro e se é possível reverter. Evite agrupar leitura, edição e exclusão em uma ferramenta com nome vago.

## Coloque a aprovação no ponto certo

A aprovação deve acontecer depois que a ação proposta esteja clara e antes que a operação consequente seja executada. Perguntar “Posso ajudar?” no início da conversa não autoriza um pagamento posterior não especificado. Mostre o registro relevante, destinatário, valor quando aplicável e efeito esperado em linguagem que o aprovador possa verificar.

{{< steps >}}
{{< step title="Verificar o usuário e a tarefa permitida" >}}
Estabeleça a identidade fora do texto livre do modelo. Confirme que tanto a operação quanto o registro alvo estão dentro do acesso do usuário.
{{< /step >}}
{{< step title="Preparar uma proposta concreta" >}}
Reúna os fatos necessários e descreva exatamente o que será alterado. Mantenha a preparação separada da execução sempre que possível.
{{< /step >}}
{{< step title="Obter aprovação significativa" >}}
Peça a uma pessoa apropriadamente autorizada que confirme a proposta específica. Se o alvo ou o efeito mudar, a aprovação antiga não deve cobrir silenciosamente a nova ação.
{{< /step >}}
{{< step title="Executar e registrar o resultado" >}}
Verifique novamente as condições materiais, execute a ação aprovada e relate o resultado real. Preserve um registro que vincule a solicitação, autoridade, aprovação e resultado.
{{< /step >}}
{{< /steps >}}

Esses controles pertencem à lógica da aplicação, não apenas aos prompts. Um prompt pode instruir o modelo a perguntar antes de enviar uma mensagem; a ferramenta de envio ainda deve rejeitar uma solicitação que careça da aprovação necessária. Para mais informações sobre como escolher pontos de revisão, veja [human-in-the-loop](../advanced-agents/human-in-the-loop.md).

## Mantenha segredos fora das conversas

Nunca coloque chaves de API privadas, senhas ou tokens de acesso em prompts, descrições de ferramentas ou resultados comuns de ferramentas. O modelo não precisa ler a credencial para usar um serviço corretamente conectado. A aplicação anexa a credencial durante a solicitação autorizada, fora do conteúdo da conversa.

Armazene segredos em uma configuração protegida ou serviço de armazenamento de segredos com acesso limitado aos componentes que os necessitam. Mantenha-os fora do código do navegador, capturas de tela e logs rotineiros. Se um segredo for divulgado, remover o texto visível não é suficiente: revogue ou substitua a credencial e investigue seu uso. Evite pedir que clientes coletem senhas no chat como um atalho para um fluxo de login ausente.

{{< accordion title="Todo chamada de ferramenta deve exigir que uma pessoa clique em Aprovar?" >}}
Não necessariamente. Aprovações repetidas para leituras inofensivas e bem delimitadas podem treinar as pessoas a clicar sem pensar. Ajuste o controle às consequências reais. Uma política de aprovação deve identificar as ações, circunstâncias e pessoas que requerem intervenção, em vez de depender do modelo para decidir o que parece arriscado.
{{< /accordion >}}

{{< accordion title="O que um registro de auditoria deve conter?" >}}
Registre a identidade atuante, operação, referência de registro relevante, decisão, horário e resultado, com informações de conexão suficientes para acompanhar a solicitação. Evite registrar credenciais ou conversas inteiras por padrão. Proteja o acesso aos registros de auditoria e defina por quanto tempo eles são mantidos.
{{< /accordion >}}

Um **log de auditoria** é um registro usado para reconstruir ações e decisões. Ele ajuda a responder se uma falha veio da solicitação do modelo, de uma decisão de permissão ou do serviço conectado. Projete essas evidências antes de um incidente; [logs, rastreamentos e monitoramento](../quality/logs-traces-and-monitoring.md) explicam como conectar as peças.

**Relacionado:** No AIVAX, o acesso à conta usa chaves de API, com usos diferentes para chaves públicas e privadas. O [guia de autenticação](../../docs/authentication.md) documenta esses limites. Não presuma que os padrões gerais de token delegado nesta unidade sejam fornecidos automaticamente por toda integração.

Próximo passo: aplique esses limites de identidade ao [integrar canais](integrating-channels.md) como chat web, mensagens, e‑mail e voz.

{{< quiz options="Deixe o modelo decidir qual conta de cliente acessar a partir da mensagem do usuário | Use uma chave irrestrita porque o assistente tem um prompt cuidadoso | Verifique o usuário, imponha acesso restrito no software e obtenha aprovação específica para ações consequentes" answer="3" explanation="Prompts podem orientar o comportamento, mas a aplicação confiável e as verificações do sistema de negócio devem impor identidade, registro de acesso e requisitos de aprovação." >}}
Qual design protege melhor uma ferramenta de suporte ao cliente?
{{< /quiz >}}
