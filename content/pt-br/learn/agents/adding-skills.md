---
{title: Adicionando habilidades,linkTitle: Adicionando habilidades,description: "Empacote uma forma repetível de trabalhar em uma habilidade reutilizável, distinga-a de ferramentas e conhecimento, e mantenha-a útil por meio de revisão e testes.",weight: 60,duration: 12,objectives: [Distinguir uma habilidade de uma ferramenta e de uma fonte de conhecimento.,Identificar uma tarefa recorrente que se beneficie de um playbook reutilizável.,Descrever as instruções e limites que uma habilidade útil necessita.,Planejar como versionar e testar uma habilidade usada por vários agentes.],sourceHash: 3a5998d1dac7fba7}
---

Um consultor de suporte experiente faz mais do que conhecer a política de devoluções. Ele sabe qual pergunta fazer primeiro, quando verificar um pedido, como explicar uma exceção e quando envolver um supervisor. Dar esse método a um novo colaborador evita que ele o redescubra a cada conversa. Um agente pode se beneficiar do mesmo tipo de playbook.

Uma **skill** é um conjunto reutilizável de instruções para um tipo particular de trabalho. Ela descreve como abordar uma tarefa, incluindo as verificações necessárias e o resultado esperado. Uma habilidade de revisão de reembolso pode guiar o agente da solicitação do cliente a um resumo claro para um reidor humano. Anexá‑la não treina novamente o modelo subjacente nem concede ao agente permissão para emitir reembolsos.

## Separar método, ação e evidência

Uma forma útil de distinguir as partes de um agente é fazer três perguntas: Como devo trabalhar? O que posso fazer? Que informação sustenta minha resposta? Essas perguntas geralmente aparecem juntas em uma conversa, mas suas respostas pertencem a lugares diferentes.

{{< cards >}}
{{< card title="Habilidade: o método" icon="list-check" >}}
Um playbook de revisão de reembolso indica esclarecer a solicitação, consultar a política atual, verificar o registro de pedido permitido e resumir os pontos não resolvidos.
{{< /card >}}
{{< card title="Ferramenta: a ação" icon="tools" >}}
Uma operação de busca de pedido recupera um registro. Uma operação de solicitação de revisão envia um caso. O software executa essas ações e aplica o acesso.
{{< /card >}}
{{< card title="Conhecimento: a evidência" icon="book" >}}
A política de devoluções aprovada explica elegibilidade e exceções. A habilidade instrui o agente a consultá‑la em vez de adivinhar seu conteúdo.
{{< /card >}}
{{< /cards >}}

Pense em uma cozinha: a receita descreve o método, o forno fornece uma capacidade e o rótulo do ingrediente fornece fatos. Uma receita não pode aquecer nada por si só. Da mesma forma, uma habilidade que diz “verificar o pedido” ainda precisa de uma ferramenta de busca disponível e autorizada. Se essa ferramenta estiver ausente, o agente deve explicar a limitação em vez de fingir que a verificação ocorreu.

Alguns documentos contêm tanto fatos quanto procedimentos. A distinção está no propósito, não no formato do arquivo. Mantenha a sequência reutilizável na habilidade e aponte para a política autoritária ao mudar regras de negócio. Copiar cada detalhe da política para todas as habilidades cria vários lugares para atualizar quando o negócio mudar sua promessa.

## Decidir quando vale a pena criar uma habilidade

Crie uma habilidade quando o mesmo método será útil repetidamente, particularmente quando envolve decisões que uma instrução curta deixa ambígua. Exemplos incluem preparar uma cotação, revisar uma solicitação de reembolso ou transformar notas de reunião em uma transferência interna. O objetivo é tratamento consistente, não uma biblioteca maior de instruções.

Uma habilidade é menos útil para uma mudança pontual de redação ou uma regra que deve se aplicar a toda interação. “Identifique‑se como assistente” pertence às instruções permanentes do agente. “Ao elaborar uma cotação, separe requisitos confirmados de suposições” pertence a uma habilidade de cotação focada. Restrições de segurança essenciais não devem depender de o modelo lembrar de carregar um playbook especializado.

A mesma habilidade de revisão de reembolso pode ser anexada a um agente de suporte de site e a um agente interno de service‑desk. Eles podem compartilhar o método tendo acessos diferentes. O agente público pode coletar uma descrição e solicitar revisão; o agente interno pode também ver o histórico de casos autorizado. Reutilizar não significa compartilhar registros de clientes ou conceder às ambos agentes ferramentas idênticas.

## Escrever um playbook, não uma aspiração

Comece com um propósito claro e uma descrição de quando a habilidade deve ser usada. Essa descrição funciona como a etiqueta de uma pasta de treinamento: deve ajudar alguém a escolher a pasta correta antes de abri‑la. “Use quando um cliente solicitar revisão de reembolso” é mais informativo que “Excelente atendimento ao cliente.” Também explique quando uma tarefa estreitamente relacionada pertence a outro lugar.

{{< compare >}}
{{< side title="Uma aspiração" tone="bad" >}}
“Manusear reembolsos profissionalmente. Manter os clientes satisfeitos e resolver seus problemas rapidamente.”
{{< /side >}}
{{< side title="Um método utilizável" tone="good" >}}
“Esclarecer o resultado solicitado. Consultar a política atual e o registro de pedido autorizado. Explicar o que foi confirmado. Se uma exceção precisar de aprovação, preparar uma solicitação de revisão sem prometer um reembolso.”
{{< /side >}}
{{< /compare >}}

As instruções completas devem identificar as informações necessárias antes de prosseguir, a sequência de verificações, as ferramentas que podem ajudar e o formato de resposta esperado. Inclua o que fazer quando informações estiverem ausentes ou contraditórias. Um playbook que cobre apenas o caminho feliz deixa o agente inventar um procedimento exatamente quando a situação se torna difícil.

Por exemplo, se o cliente disser que um item chegou danificado, o pedido não puder ser localizado, a habilidade não deve tratar a reclamação como prova de elegibilidade. Ela pode solicitar as informações de busca permitidas ou explicar a rota de revisão disponível. Não deve solicitar informações sensíveis desnecessárias apenas porque mais detalhes podem ser convenientes.

## Adaptar o método ao departamento

Os exemplos a seguir são esboços ilustrativos de playbooks, não políticas de negócio completas. Observe que cada um especifica uma tarefa e um estado final, em vez de apenas escolher um tom de voz.

{{< tabs >}}
{{< tab title="Suporte" >}}
**Revisão de reembolso:** estabelecer o que o cliente deseja, consultar a política aplicável, verificar o registro de pedido autorizado e identificar qualquer necessidade de aprovação. Concluir com fatos confirmados, informações ausentes e a próxima ação permitida. Não descreva uma solicitação de revisão como um reembolso aprovado.
{{< /tab >}}
{{< tab title="Vendas" >}}
**Elaboração de cotação:** confirmar os produtos, quantidades e necessidades de entrega solicitados. Obter informações comerciais atuais de fontes aprovadas. Separar termos confirmados de suposições e sinalizar exceções para revisão. Concluir com uma cotação preliminar; não insinuar que elaborá‑la aceita um pedido.
{{< /tab >}}
{{< tab title="Back office" >}}
**Consulta de fatura:** esclarecer a discrepância, comparar a fatura com registros de apoio autorizados e resumir a diferença. Pedir à pessoa responsável que resolva a evidência ausente. Concluir com uma explicação revisável, não com uma alteração não aprovada no registro contábil.
{{< /tab >}}
{{< /tabs >}}

Um bom rascunho costuma vir de quem já realiza o trabalho. Peça que explique o raciocínio por trás de suas decisões, não apenas os cliques que realiza. “Abrir este painel” é frágil se a tela mudar. “Verificar se um reembolso já foi registrado antes de enviar outra solicitação” captura um requisito de negócio que permanece útil em diferentes interfaces.

## Manter habilidades compartilhadas versionadas e testadas

**Versionamento** significa manter revisões identificáveis de um conjunto de instruções para que a equipe possa ver o que mudou e recuperar uma versão aprovada anterior. Registre um proprietário, o motivo de cada mudança e quais agentes usam a habilidade. Um playbook compartilhado é valioso porque evita duplicação, mas um erro nele pode afetar vários agentes ao mesmo tempo.

Não presuma que mudar a habilidade atualiza automaticamente cada cópia ou anexo em todas as plataformas. Verifique como seu sistema distribui as mudanças. Antes do lançamento, confirme as instruções que cada agente afetado realmente receberá, junto com suas ferramentas disponíveis e regras permanentes. Um playbook testado com um agente interno de suporte pode falhar com um agente público que não tem acesso aos mesmos registros.

{{< steps >}}
{{< step title="Rascunhar com o responsável pela tarefa" >}}
Capture o propósito, pré‑requisitos, pontos de decisão e limites. Use exemplos sanitizados que não contenham registros de clientes ou credenciais.
{{< /step >}}
{{< step title="Testar seleção e execução" >}}
Verifique se o agente escolhe a habilidade para solicitações relevantes e a evita para as não relacionadas. Em seguida, confirme que ele segue o método.
{{< /step >}}
{{< step title="Revisar antes de compartilhar" >}}
Faça com que a equipe responsável aprove a revisão. Teste as permissões de cada agente anexado e o comportamento de ferramenta ausente antes do uso mais amplo.
{{< /step >}}
{{< step title="Monitorar e revisar" >}}
Mantenha a revisão aprovada anterior, investigue falhas e repita as verificações após mudanças nas políticas, ferramentas ou instruções.
{{< /step >}}
{{< /steps >}}

Testar requer mais do que uma resposta educada final. Inclua uma solicitação normal, fatos ausentes, uma exceção disputada e uma ferramenta indisponível. Verifique se o agente consultou a fonte correta, preservou a incerteza e parou no limite de aprovação. Também teste uma conversa que muda de assunto: um playbook de reembolso não deve distorcer uma pergunta posterior sobre cuidados com o produto.

**Relacionado:** No AIVAX, esse conjunto reutilizável de instruções é chamado de [skill](../../docs/features/skills.md), e habilidades selecionadas podem ser habilitadas para o runtime configurado de um agente. [Teach Skill](../../docs/generations/teach-skill.md) pode transformar uma demonstração gravada em instruções preliminares. Revise esse rascunho contra o processo real antes de salvá‑lo; gerá‑lo não publica automaticamente uma habilidade.

**Próximo passo:** Um método precisa de limites. [Adding guardrails](adding-guardrails.md) explica como limitar ações e lidar com solicitações que o agente não deve atender.

{{< quiz options="A política de devoluções atual | Uma operação que lê um registro de pedido | Um procedimento reutilizável para verificar uma solicitação de reembolso e prepará‑la para revisão | Permissão para aprovar todo reembolso" answer="3" explanation="Uma habilidade descreve como executar uma tarefa recorrente. A política fornece conhecimento, a consulta fornece uma capacidade de ferramenta e a autoridade de aprovação deve ser aplicada separadamente." >}}
Qual item é uma habilidade no design de um agente de suporte?
{{< /quiz >}}
