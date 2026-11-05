---
{title: Agente de vendas e qualificação,linkTitle: Vendas e qualificação,description: "Projete um assistente de vendas útil que reúna necessidades relevantes, apresente um resultado de qualificação transparente e devolva o controle às pessoas.",weight: 20,duration: 12,objectives: [Faça perguntas de qualificação proporcionais sem pressionar os visitantes.,Separe a pontuação de leads baseada em evidências das decisões de vendas.,Solicite a aprovação adequada antes de escrever em um sistema do cliente.,Avalie um piloto de vendas com base na qualidade e na escolha do cliente.],sourceHash: 1bca94c68374ab66}
---

Um visitante pergunta se um serviço pode ajudar o negócio dele. Um agente de vendas útil ajuda-o a compreender a adequação e, se desejar, a contactar a pessoa certa. Não é uma máquina para extrair dados de contacto a qualquer custo. Este guia segue uma empresa fictícia, Fieldwork Scheduling, que vende software de gestão de agendamentos para pequenas organizações.

Um **lead** (potencial cliente) é uma pessoa ou organização que manifestou possível interesse. **Qualificação** significa aprender o suficiente sobre as necessidades deles para sugerir um próximo passo sensato. Um **CRM** (Customer Relationship Management, ou sistema de gestão de relacionamento com o cliente) armazena registos de vendas e atividades de acompanhamento. Pense no agente como um rececionista que pode preparar um resumo para a reunião, não como um vendedor autorizado a fazer todas as promessas comerciais.

## Definir um resultado útil

A Fieldwork quer que os visitantes interessados recebam uma explicação precisa, uma oferta adequada de demonstração ou uma declaração honesta de que o serviço pode não ser adequado. O agente não deve inventar descontos, prometer funcionalidades ou afirmar a existência de prazos que não existem. “Não, obrigado” é um resultado válido, não uma falha em superar objeções.

Separe três responsabilidades antes de escrever a primeira instrução:

{{< cards >}}
{{< card title="Informar" icon="book" >}}
Responda com base nas informações aprovadas do produto, incluindo limitações conhecidas. Permita que os visitantes leiam sobre o serviço sem exigir os seus detalhes primeiro.
{{< /card >}}
{{< card title="Qualificar" icon="question" >}}
Faça apenas perguntas que alterem a recomendação. Registe a incerteza em vez de preencher lacunas com suposições sobre o negócio de um visitante.
{{< /card >}}
{{< card title="Conectar" icon="user" >}}
Ofereça uma conversa humana quando o visitante quiser. Prepare um resumo conciso e confirmado em vez de fazê-lo repetir toda a troca de mensagens.
{{< /card >}}
{{< /cards >}}

Uma **conversão** é um próximo passo definido, como uma demonstração acordada. Defina-a explicitamente: enviar um link de calendário não é o mesmo que marcar uma reunião, e uma marcação não é uma venda. Caso contrário, o painel de controle pode recompensar atividades que não trazem benefício para nenhuma das partes.

## Construir a conversa em torno do visitante

{{< steps >}}
{{< step title="Explicar o papel e perguntar sobre a necessidade" >}}
Diga que este é um assistente automatizado. Pergunte o que o visitante está tentando melhorar: faltas a compromissos, escalonamento de pessoal ou outro problema. Responda à pergunta original antes de iniciar uma entrevista.
{{< /step >}}
{{< step title="Explorar tempo e orçamento com delicadeza" >}}
Pergunte quando esperam fazer uma mudança e se têm uma faixa de orçamento aproximada. Explique por que a pergunta ajuda. Permita “não decidido” e “prefiro não dizer”.
{{< /step >}}
{{< step title="Resumir e verificar os fatos" >}}
Repita a necessidade declarada, as restrições e o próximo passo solicitado. Peça correções. Distinga as declarações do visitante da interpretação do agente.
{{< /step >}}
{{< step title="Propor um resultado de roteamento" >}}
Use um rubrica acordada, um pequeno conjunto de regras de pontuação, para sugerir um acompanhamento apenas informativo ou uma conversa com um vendedor humano. Mantenha as informações ausentes visíveis.
{{< /step >}}
{{< step title="Aprovar, salvar e transferir" >}}
Peça permissão para compartilhar o resumo e confirme o método de contato pretendido. Aplique a aprovação necessária pela equipe da empresa antes da gravação no CRM, depois verifique o resultado antes de dizer que foi salvo.
{{< /step >}}
{{< /steps >}}

Faça uma pergunta de cada vez e reutilize respostas já fornecidas. Se alguém disser “Precisamos disso no próximo mês”, não pergunte novamente sobre o tempo apenas porque é o próximo em um formulário. Um assistente conversacional deve reduzir o esforço em comparação com um formulário, não esconder um longo formulário obrigatório dentro de bolhas de chat.

O rascunho da instrução pode ser simples: “Ajude os visitantes a avaliar se nosso serviço documentado se adapta. Faça perguntas relevantes sem pressão. Não infira características pessoais, invente termos ou envie follow-ups sem a permissão necessária. Registre respostas desconhecidas como desconhecidas. Ofereça uma pessoa quando solicitado e respeite uma recusa imediatamente.”

{{< demo name="conversation" title="Exemplo: qualificação com uma pergunta de orçamento não respondida" config=`{"messages":[["assistant","Sou um assistente automatizado. O que você gostaria que o software de agendamento melhorasse?"],["user","Perdemos chamadas enquanto atendemos aos clientes. Esperamos mudar isso no próximo mês."],["assistant","Posso explicar as opções de reserva documentadas. Você tem uma faixa de orçamento, ou isso ainda está indeciso?"],["user","Indeciso. Posso falar com alguém?"],["assistant","Sim. Posso partilhar este resumo com a equipa de vendas: você quer reduzir as chamadas perdidas, espera fazer uma mudança no próximo mês e ainda não definiu um orçamento?"],["user","Sim."],["assistant","Obrigado. Vou submeter esse resumo para a revisão necessária antes de ser adicionado ao sistema de vendas."]]}` >}}
O pedido do visitante por uma pessoa tem prioridade sobre completar todos os campos de qualificação. Este exemplo para antes da revisão e gravação, portanto, não afirma que existe um registro ou agendamento.
{{< /demo >}}

## Pontuar evidências, não pessoas

Uma **pontuação de lead** é uma ferramenta de priorização baseada em fatos empresariais declarados. Não é uma medida do valor de uma pessoa nem uma previsão confiável do comportamento de compra. Um **lead quente** simplesmente significa aquele que atende aos critérios de prontidão documentados da empresa e deseja contato oportuno.

Para este caso, a rubrica considera a adequação do produto, um problema concreto e o tempo declarado. O orçamento pode melhorar a completude do resumo, mas um orçamento desconhecido não significa “desqualificado”. Um humano deve ser capaz de ler as mesmas evidências e entender por que o agente sugeriu sua rota.

| Evidência | Interpretação apropriada | Atalho inadequado |
|---|---|---|
| O visitante descreve uma necessidade suportada | Adequação potencial do produto | Compra garantida |
| O visitante solicita uma discussão próxima no tempo | Priorizar uma resposta acordada | Inventar um prazo urgente |
| O orçamento não é divulgado | Marcar o campo como desconhecido | Assumir que a organização é pobre |
| O visitante recusa contato | Encerrar o acompanhamento com respeito | Tentar outro canal |

Evite pontuar com base em nomes, sotaques, deficiências, idade ou outras características sensíveis e proxies injustificadas. Uma **proxy** é um substituto indireto, como usar um código postal para adivinhar a renda. Revise a rubrica quanto a efeitos injustos, particularmente se influenciar o acesso a serviços ou termos comerciais.

Relacionado: Modelos de [decisão AIVAX](../../docs/data-processing/decisions.md) podem avaliar perguntas definidas, enquanto [respostas estruturadas](../../docs/inference/structured-responses/concepts.md) fornecem um formato de saída legível por máquina. Uma estrutura válida apenas mostra que os campos se encaixam em uma forma requerida; não prova que os fatos ou a recomendação estão corretos.

## Colocar a aprovação antes da gravação

Uma gravação no CRM é uma ação externa: ela altera um registro comercial. Mantenha o resumo proposto separado do registro salvo. Os dados propostos devem incluir a necessidade declarada pelo visitante, os campos desconhecidos, o método de contato aprovado e as evidências para a recomendação de roteamento. Evite armazenar todo o chat quando um resumo curto for suficiente.

{{< flow items="Visitante confirma o resumo | Equipe aprova o registro proposto | Aplicação valida permissões | Gravação no CRM | Verifica o resultado salvo" direction="vertical" >}}

O acordo do visitante e a aprovação da equipe servem a propósitos diferentes. O visitante confirma o que será compartilhado; o membro da equipe verifica se a empresa deve criar ou atualizar esse registro. Nem um nem outro fornecem automaticamente toda a base legal necessária para o processamento de dados pessoais. Estabeleça a base apropriada, o aviso de privacidade, o período de retenção e as regras de canal com a equipe responsável.

Leia [Humano no loop](../advanced-agents/human-in-the-loop.md) para o design da aprovação. A tela de aprovação deve mostrar exatamente o que mudará. Se campos importantes forem alterados após a aprovação, peça novamente em vez de tratar a aprovação anterior como permissão ilimitada.

{{< compare >}}
{{< side title="Pressão e ação oculta" tone="bad" >}}
“Preciso do seu número de telefone antes de poder responder. Adicionei você à nossa campanha porque parece interessado.”
{{< /side >}}
{{< side title="Escolha e um limite claro" tone="good" >}}
“Aqui estão as informações do produto. Se você quiser uma conversa de vendas, posso preparar um resumo para sua revisão. Você também pode parar aqui.”
{{< /side >}}
{{< /compare >}}

Se a solicitação do CRM expirar, a aplicação pode não saber se a gravação ocorreu. Verifique o resultado existente antes de tentar novamente para que o visitante não se torne vários leads duplicados. Um **webhook** é uma notificação de evento enviada de um sistema para outro; ele pode acionar o acompanhamento após uma alteração confirmada. Veja [Webhooks, eventos e automações](../tools-and-integrations/webhooks-events-and-automations.md) para o padrão de conexão.

## Avaliar o funil sem recompensar a pressão

Um **funil** mostra quantas pessoas passam por etapas sucessivas. Use etapas claramente definidas e o mesmo período de observação. O gráfico abaixo é ilustrativo, não uma previsão de conversão nem uma reivindicação sobre qualquer produto.

{{< chart type="bar" title="Funil piloto ilustrativo" unit="visitantes" data=`[{"label":"Fez uma pergunta sobre o produto","value":100},{"label":"Escolheu a qualificação","value":64},{"label":"Solicitou uma conversa humana","value":28},{"label":"Confirmou uma reunião","value":18}]` caption="Dados didáticos inventados. Cada etapa é um subconjunto da anterior; recusar-se a continuar pode ser um resultado apropriado." >}}

Revise se a equipe de vendas recebeu resumos precisos, se os visitantes entenderam a transferência e se a recusa de contato foi respeitada. Acompanhe reivindicações incorretas sobre o produto, registros duplicados, mensagens indesejadas e reclamações junto com as reuniões. Um aumento nas reservas acompanhado por mais reclamações de pressão não é uma melhoria qualificada.

Teste orçamentos ausentes, respostas contraditórias, solicitações de funcionalidades não suportadas, retirada da permissão de contato, falha no CRM e uma tentativa de contornar a aprovação da equipe. Pilot com revisores disponíveis, defina quem é proprietário de cada acompanhamento e interrompa gravações automatizadas se as verificações de aprovação ou permissão falharem.

Próximos passos: construa um [assistente de conhecimento interno](internal-knowledge-assistant.md), onde a questão central é quem pode ver quais informações.

{{< quiz options="Adivinhar o orçamento pelo cargo profissional do visitante | Marcar o orçamento como desconhecido e oferecer a transferência humana solicitada | Recusar ajuda adicional até que todos os campos sejam preenchidos" answer="2" explanation="Informações desconhecidas devem permanecer desconhecidas, e a qualificação não deve bloquear um pedido razoável por uma pessoa ou incentivar suposições sensíveis." >}}
Um visitante não compartilha um orçamento, mas pede para falar com as vendas. Qual é o próximo passo apropriado?
{{< /quiz >}}
