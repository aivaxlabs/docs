---
{title: Agente de vendas e qualificação,linkTitle: Vendas e qualificação,description: "Projete um assistente de vendas útil que reúna necessidades relevantes, proponha um resultado de qualificação transparente e devolva o controle às pessoas.",weight: 20,duration: 12,objectives: [Fazer perguntas de qualificação proporcionais sem pressionar os visitantes.,Separar a pontuação de leads baseada em evidências das decisões de vendas.,Exigir aprovação adequada antes de escrever em um sistema de cliente.,Avaliar um piloto de vendas usando qualidade e escolha do cliente.],sourceHash: 5b3c11029086955f}
---

Um visitante pergunta se um serviço pode ajudar seu negócio. Um agente de vendas útil ajuda a entender o ajuste e, se quiser, a chegar à pessoa certa. Não é uma máquina para extrair detalhes de contato a qualquer custo. Este guia segue uma empresa fictícia, Fieldwork Scheduling, que vende software de gerenciamento de compromissos para pequenas organizações.

Um **lead** é uma pessoa ou organização que demonstrou interesse potencial. **Qualificação** significa aprender o suficiente sobre suas necessidades para sugerir um próximo passo sensato. Um **CRM**, ou sistema de gerenciamento de relacionamento com o cliente, armazena registros de vendas e atividades de acompanhamento. Pense no agente como um recepcionista que pode preparar um resumo de reunião, não como um vendedor autorizado a fazer todas as promessas comerciais.

## Definir um resultado útil

A Fieldwork deseja que visitantes interessados recebam uma explicação precisa, uma oferta de demonstração adequada ou uma declaração honesta de que o serviço pode não ser adequado. O agente não deve inventar descontos, prometer recursos ou alegar um prazo que não existe. “Não, obrigado” é um resultado válido, não uma falha a ser superada.

Separe três responsabilidades antes de escrever a primeira instrução:

{{< cards >}}
{{< card title="Informar" icon="book" >}}
Responda com informações de produto aprovadas, incluindo limitações conhecidas. Deixe os visitantes lerem sobre o serviço sem exigir seus dados primeiro.
{{< /card >}}
{{< card title="Qualificar" icon="question" >}}
Faça apenas perguntas que alterem a recomendação. Registre incertezas em vez de preencher lacunas com suposições sobre o negócio do visitante.
{{< /card >}}
{{< card title="Conectar" icon="user" >}}
Ofereça uma conversa humana quando o visitante quiser. Prepare um resumo conciso e confirmado em vez de fazê‑lo repetir toda a troca.
{{< /card >}}
{{< /cards >}}

Uma **conversão** é um próximo passo definido, como uma demonstração acordada. Defina explicitamente: enviar um link de calendário não é o mesmo que marcar uma reunião, e uma marcação não é uma venda. Caso contrário, o painel pode recompensar atividades que não criam benefício para nenhuma das partes.

## Construir a conversa ao redor do visitante

{{< steps >}}
{{< step title="Explicar o papel e perguntar sobre a necessidade" >}}
Diga que este é um assistente automatizado. Pergunte o que o visitante está tentando melhorar: compromissos perdidos, agendamento de equipe ou outro problema. Responda à pergunta original antes de iniciar a entrevista.
{{< /step >}}
{{< step title="Explorar timing e orçamento suavemente" >}}
Pergunte quando eles esperam fazer a mudança e se têm uma faixa de orçamento aproximada. Explique por que a pergunta ajuda. Permita “não decidido” e “prefiro não dizer”.
{{< /step >}}
{{< step title="Resumir e verificar os fatos" >}}
Repita a necessidade declarada, as restrições e o próximo passo solicitado. Peça correções. Distinga as declarações do visitante da interpretação do agente.
{{< /step >}}
{{< step title="Propor um resultado de roteamento" >}}
Use um rubric acordado, um pequeno conjunto de regras de pontuação, para sugerir um acompanhamento apenas informativo ou uma conversa de vendas humana. Mantenha as informações ausentes visíveis.
{{< /step >}}
{{< step title="Aprovar, salvar e repassar" >}}
Peça permissão para compartilhar o resumo e confirme o método de contato pretendido. Aplique a aprovação de staff necessária antes da gravação no CRM, depois verifique o resultado antes de dizer que foi salvo.
{{< /step >}}
{{< /steps >}}

Faça uma pergunta por vez e reutilize respostas já dadas. Se alguém disser “Precisamos disso no próximo mês”, não pergunte novamente sobre o timing apenas porque está próximo em um formulário. Um assistente conversacional deve reduzir o esforço comparado a um formulário, não esconder um formulário longo e obrigatório dentro de balões de chat.

O rascunho da instrução pode ser simples: “Ajude os visitantes a avaliar se nosso serviço documentado se encaixa. Faça perguntas relevantes sem pressão. Não inferir características pessoais, inventar termos ou enviar seguimentos sem a permissão necessária. Registre respostas desconhecidas como desconhecidas. Ofereça uma pessoa quando solicitado e respeite a recusa imediatamente.”

{{< demo name="conversation" title="Exemplo: qualificação com pergunta de orçamento não respondida" config=`{"messages":[["assistant","I'm an automated assistant. What would you like appointment software to improve?"],["user","We miss calls while serving customers. We hope to change that next month."],["assistant","I can explain the documented booking options. Do you have a budget range, or is that still undecided?"],["user","Undecided. Can I speak to someone?"],["assistant","Yes. May I share this summary with the sales team: you want to reduce missed calls, hope to make a change next month, and have not set a budget?"],["user","Yes."],["assistant","Thank you. I will submit that summary for the required review before it is added to the sales system."]]}` >}}
A solicitação do visitante por uma pessoa tem prioridade sobre completar todo campo de qualificação. Este exemplo para antes da revisão e gravação, portanto não afirma que um registro ou agendamento exista.
{{< /demo >}}

## Pontuar evidências, não pessoas

Um **lead score** é um auxílio de priorização baseado em fatos de negócio declarados. Não é uma medida do valor de uma pessoa nem uma previsão confiável de comportamento de compra. Um **hot lead** simplesmente significa aquele que atende aos critérios de prontidão documentados da empresa e deseja contato oportuno.

Para este caso, o rubric considera ajuste de produto, problema concreto e timing declarado. O orçamento pode melhorar a completude do resumo, mas um orçamento desconhecido não significa “não qualificado”. Um humano deve ser capaz de ler a mesma evidência e entender por que o agente sugeriu sua rota.

| Evidência | Interpretação adequada | Atalho inadequado |
|---|---|---|
| Visitante descreve uma necessidade suportada | Possível ajuste de produto | Compra garantida |
| Visitante solicita uma discussão de curto prazo | Priorizar resposta acordada | Inventar prazo urgente |
| Orçamento não divulgado | Marcar campo como desconhecido | Supor que a organização seja pobre |
| Visitante recusa contato | Encerrar acompanhamento respeitosamente | Tentar outro canal |

Evite pontuar a partir de nomes, sotaques, deficiência, idade ou outras características sensíveis e proxies injustificados. Um **proxy** é um substituto indireto, como usar um CEP para adivinhar renda. Revise o rubric para efeitos injustos, particularmente se influenciar acesso a serviços ou termos comerciais.

Relacionado: AIVAX [modelos de decisão](../../docs/generations/decisions.md) podem avaliar perguntas definidas, enquanto [respostas estruturadas](../../docs/inference/structured-responses.md) fornecem um formato de saída legível por máquina. Uma estrutura válida apenas mostra que os campos se encaixam em um formato exigido; não prova que os fatos ou a recomendação estão corretos.

## Colocar aprovação antes da gravação

Uma gravação no CRM é uma ação externa: altera um registro de negócio. Mantenha o resumo proposto separado do registro salvo. Os dados propostos devem incluir a necessidade declarada pelo visitante, campos desconhecidos, método de contato aprovado e evidência para a recomendação de roteamento. Evite armazenar todo o chat quando um resumo curto for suficiente.

{{< flow items="Visitante confirma o resumo | Staff aprova o registro proposto | Aplicação valida permissões | Gravação no CRM | Verifica resultado salvo" direction="vertical" >}}

A concordância do visitante e a aprovação do staff servem a propósitos diferentes. O visitante confirma o que será compartilhado; o membro da equipe verifica se o negócio deve criar ou atualizar esse registro. Nenhum fornece automaticamente todas as bases legais necessárias para o tratamento de dados pessoais. Estabeleça a base adequada, aviso de privacidade, período de retenção e regras de canal com a equipe responsável.

Leia [Humano no loop](../advanced-agents/human-in-the-loop.md) para design de aprovação. A tela de aprovação deve mostrar exatamente o que será alterado. Se campos importantes mudarem após a aprovação, pergunte novamente em vez de tratar a aprovação antiga como permissão ilimitada.

{{< compare >}}
{{< side title="Pressão e ação oculta" tone="bad" >}}
“Preciso do seu número de telefone antes de poder responder. Eu já o adicionei à nossa campanha porque parece interessado.”
{{< /side >}}
{{< side title="Escolha e limite claro" tone="good" >}}
“Aqui estão as informações do produto. Se quiser uma conversa de vendas, posso preparar um resumo para sua revisão. Você também pode parar aqui.”
{{< /side >}}
{{< /compare >}}

Se a solicitação ao CRM expirar, a aplicação pode não saber se a gravação ocorreu. Verifique o resultado existente antes de tentar novamente para que o visitante não se torne vários leads duplicados. Um **webhook** é uma notificação de evento enviada de um sistema para outro; pode acionar acompanhamento após uma mudança confirmada. Veja [Webhooks, eventos e automações](../tools-and-integrations/webhooks-events-and-automations.md) para o padrão de conexão.

## Avaliar o funil sem recompensar pressão

Um **funil** mostra quantas pessoas avançam por estágios sucessivos. Use estágios claramente definidos e o mesmo período de observação. O gráfico abaixo é ilustrativo, não uma previsão de conversão ou afirmação sobre qualquer produto.

{{< chart type="bar" title="Funil piloto ilustrativo" unit=" visitantesantes" data=`[{"label":"Perguntou sobre o produto","value":100},{"label":"Escolheu qualificação","value":64},{"label":"Solicitou conversa humana","value":28},{"label":"Reunião confirmada","value":18}]` caption="Dados de ensino inventados. Cada estágio é um subconjunto do anterior; recusar continuar pode ser um resultado adequado." >}}

Revise se a equipe de vendas recebeu resumos precisos, se os visitantes entenderam a transferência e se o contato recusado foi respeitado. Acompanhe reivindicações de produto incorretas, registros duplicados, mensagens indesejadas e reclamações junto às reuniões. Um aumento em marcações acompanhado de mais reclamações por pressão não é uma melhoria não qualificada.

Teste orçamentos ausentes, respostas contraditórias, solicitações de recursos não suportados, retirada de permissão de contato, falha no CRM e tentativa de contornar a aprovação do staff. Pilote com revisores disponíveis, defina quem possui cada acompanhamento e interrompa gravações automatizadas se verificações de aprovação ou permissão falharem.

Próximo passo: construir um [assistente interno de conhecimento](internal-knowledge-assistant.md), onde a questão central é quem pode ver quais informações.

{{< quiz options="Adivinhar um orçamento a partir do cargo do visitante | Marcar o orçamento como desconhecido e oferecer a transferência humana solicitada | Recusar ajuda adicional até que todos os campos sejam preenchidos" answer="2" explanation="Informações desconhecidas devem permanecer desconhecidas, e a qualificação não deve bloquear um pedido razoável por uma pessoa ou encorajar suposições sensíveis." >}}
Um visitante não compartilhará o orçamento mas pedirá para falar com vendas. Qual é o próximo passo apropriado?
{{< /quiz >}}
