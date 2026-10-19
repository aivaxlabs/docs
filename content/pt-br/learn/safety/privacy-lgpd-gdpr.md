---
{title: "Privacidade, LGPD/GDPR e dados sensíveis",linkTitle: Privacidade e dados sensíveis,description: "Planeje como um agente coleta, usa, armazena e exclui informações pessoais sem enviar mais do que a tarefa requer.",weight: 20,duration: 13,objectives: [Reconhecer informações pessoais e sensíveis em um fluxo de trabalho de agente.,Explicar bases legais e responsabilidades em linguagem cotidiana.,"Aplicar decisões de minimização, mascaramento e retenção antes da implantação.",Preparar-se para solicitações de acesso e exclusão em serviços conectados.],sourceHash: 01fea118c4895707}
---

Um cliente solicita ao assistente de suporte reagendar uma entrega. Sua mensagem inclui nome, endereço residencial e uma explicação envolvendo uma consulta médica. Apenas parte dessas informações é necessária para organizar a entrega. Copiar toda a conversa para cada sistema conectado aumenta a exposição sem melhorar o serviço.

A privacidade começa com esta pergunta comum: o que cada parte do fluxo de trabalho realmente precisa saber? Não é simplesmente uma caixa de seleção na página de configurações do provedor de modelo. As mensagens podem passar por um canal de chat, sua aplicação, um provedor de modelo, um sistema empresarial e um registro de suporte. Cada cópia precisa de um propósito, proteção adequada e um tempo de vida planejado.

> [!IMPORTANT]
> Esta unidade é educacional, não assessoria jurídica. As obrigações da LGPD e do GDPR dependem da sua organização, usuários, propósitos e jurisdição. Consulte um profissional qualificado em privacidade para decisões sobre sua implantação.

## Saiba quais informações você manipula

**Dados pessoais** são informações relacionadas a uma pessoa identificada ou identificável. Um nome é um exemplo óbvio, mas um histórico de pedidos, identificador de dispositivo ou descrição de trabalho incomum também podem identificar alguém quando combinados com outras informações. Remover um nome não elimina necessariamente a conexão com a pessoa.

Algumas informações pessoais recebem proteção adicional. Sob a **LGPD** do Brasil, a Lei Geral de Proteção de Dados, isso inclui categorias como dados de saúde e biométricos em circunstâncias definidas. O **GDPR** da União Europeia, o Regulamento Geral de Proteção de Dados, possui **categorias especiais** comparáveis, com suas próprias definições e condições. Não presuma que as categorias ou exceções sejam idênticas.

{{< cards >}}
{{< card title="Informação visível" icon="chat" >}}
Uma mensagem, foto ou anexo pode conter detalhes pessoais. Peça aos usuários as informações mínimas necessárias ao invés de convidá-los a fazer upload de tudo.
{{< /card >}}
{{< card title="Informação ao redor da mensagem" icon="database" >}}
Referências de contas, históricos de conversas e logs técnicos podem revelar quem a pessoa é ou o que fez. Os controles de privacidade devem cobrir esses registros também.
{{< /card >}}
{{< card title="Inferências sobre pessoas" icon="eye" >}}
O resumo de um agente pode inferir saúde, situação financeira ou preferências pessoais. Informações geradas ainda podem ser dados pessoais e também podem estar erradas.
{{< /card >}}
{{< /cards >}}

Segredos empresariais e senhas também requerem proteção, mesmo quando não são dados pessoais. Uma revisão de privacidade e uma revisão de segurança se sobrepõem, mas nenhuma substitui a outra. Por exemplo, criptografar um registro o protege contra alguns acessos não autorizados; isso não estabelece um motivo válido para coletar o registro inicialmente.

## Comece com propósito e base legal

Uma **base legal** é o motivo que a lei permite um uso específico de dados pessoais. Em palavras simples, responde “Por que podemos fazer isso?”. Dependendo da lei e das circunstâncias, exemplos incluem cumprimento de contrato, atendimento a obrigação legal, consentimento válido ou interesse legítimo adequadamente avaliado. Esses não são rótulos intercambiáveis a escolher após coletar os dados.

Consentimento significa que a pessoa faz uma escolha válida e informada sob os requisitos aplicáveis. Não é um atalho universal, e uma frase vaga como “Ao conversar, você aceita tudo” não resolve a questão. Processar dados sensíveis pode exigir condições adicionais além da base usada para dados pessoais ordinários.

Um **controlador** decide por que e como os dados pessoais são processados. Um **processador** os manipula sob as instruções do controlador. Um negócio que implanta um assistente ao cliente costuma atuar como controlador para esse fluxo de trabalho, enquanto provedores de serviço podem atuar como processadores para atividades específicas. As responsabilidades dependem dos papéis e acordos reais, não apenas do rótulo em um folheto de vendas.

| Preocupação compartilhada | LGPD, em palavras simples | GDPR, em palavras simples |
| --- | --- | --- |
| Propósito e necessidade | Explique o propósito e limite o processamento ao que é necessário. | Declare um propósito específico e minimize os dados usados. |
| Justificação legal | Identifique uma base legal aplicável e condições para dados sensíveis. | Identifique uma base legal aplicável e qualquer condição adicional de categoria especial. |
| Direitos individuais | Forneça meios para exercer os direitos aplicáveis, incluindo acesso e exclusão quando disponíveis. | Forneça meios para exercer os direitos aplicáveis, incluindo acesso e apagamento quando disponíveis. |
| Responsabilidade | Seja capaz de demonstrar medidas e responsabilidades adequadas. | Seja capaz de demonstrar conformidade e salvaguardas adequadas. |
| Transferências internacionais | Avalie regras e salvaguardas de transferência aplicáveis. | Avalie regras e salvaguardas de transferência aplicáveis. |

Essas semelhanças ajudam a organizar as perguntas; a tabela não indica que as leis tenham escopo, prazos, exceções ou aplicação idênticos. O responsável pela privacidade deve documentar os detalhes que se aplicam ao seu serviço antes que ele manipule conversas reais.

## Minimize antes de enviar

**Minimização de dados** significa usar apenas os dados pessoais necessários para o propósito declarado. Um modelo solicitado a classificar um problema de entrega costuma precisar apenas da descrição do problema, não do endereço completo do cliente. Uma ferramenta empresarial autenticada pode usar o endereço depois, se a alteração real da entrega exigir.

**Mascaramento** substitui detalhes identificadores por marcadores. **Pseudonimização** substitui identificadores preservando um modo de reconectar o registro a uma pessoa, como uma tabela de consulta separada. Esses dados geralmente permanecem como dados pessoais. **Anonimização** visa impedir a identificação sob o padrão legal aplicável; substituir apenas um nome não basta para alegar anonimato.

{{< compare >}}
{{< side title="Mensagem bruta: marcadores ilustrativos" tone="bad" >}}
“My name is [FULL NAME], and I live at [HOME ADDRESS]. Please move my delivery because I have [MEDICAL DETAIL]. My order is [ORDER REFERENCE].” Sending all of this to a model for topic classification is unnecessary.
{{< /side >}}
{{< side title="Mensagem mascarada para classificação" tone="good" >}}
“The customer wants to reschedule a delivery for a personal reason.” The application retains the verified order reference separately for an authorised delivery tool. The model can identify the task without seeing the omitted details.
{{< /side >}}
{{< /compare >}}

Realize o mascaramento antes da transmissão, não apenas ao exibir logs posteriormente. Revise também anexos e resumos de conversas: ambos podem reintroduzir um detalhe removido da mensagem mais recente. Se os marcadores precisarem ser restaurados, mantenha esse mapeamento em um sistema protegido e restaure apenas os campos necessários para a saída autorizada.

A remoção excessiva também pode prejudicar a tarefa. Uma preferência de idioma pode ser necessária para responder claramente, e uma solicitação de acessibilidade pode ser essencial para organizar um serviço adequado. O objetivo é um mínimo justificado, não excluir o contexto indiscriminadamente. Teste se a mensagem reduzida ainda suporta uma resposta correta.

## Crie uma lista de verificação de manipulação de dados

{{< steps >}}
{{< step title="Mapear a jornada" >}}
Liste onde mensagens, anexos, entradas e saídas de modelo e logs viajam. Inclua serviços externos e acesso de equipe, não apenas a interface de chat.
{{< /step >}}
{{< step title="Justificar cada campo" >}}
Registre o propósito, base legal, aviso obrigatório e responsável. Remova informações que não ajudam a concluir a tarefa autorizada.
{{< /step >}}
{{< step title="Proteger o que resta" >}}
Aplique mascaramento antes da transmissão, restrinja acesso e revise as configurações do provedor. Evite copiar mensagens sensíveis para sistemas amplos de depuração ou análise.
{{< /step >}}
{{< step title="Definir retenção e exclusão" >}}
Escolha por quanto tempo cada categoria deve ser mantida, documente exceções e implemente a exclusão. Inclua backups, exportações, índices de busca e cópias mantidas pelo provedor quando aplicável.
{{< /step >}}
{{< step title="Ensaiar uma solicitação de direitos" >}}
Verifique a identidade do solicitante de forma proporcional, encontre os registros relevantes e encaminhe a solicitação ao seu proprietário. Teste o manuseio de acesso e exclusão sem expor os dados de outra pessoa.
{{< /step >}}
{{< /steps >}}

**Retenção** é o tempo que as informações são mantidas. Propósitos diferentes podem justificar períodos diferentes: um caso de suporte não resolvido e um registro contábil legal não precisam compartilhar o mesmo cronograma. “Manter tudo por precaução” não é uma política útil. Nem prometer exclusão imediata quando um dever legal documentado exige que alguns registros permaneçam.

## Verifique provedores, locais e acordos

**Residência de dados** descreve onde os dados são armazenados ou processados. Não é o mesmo que uma avaliação completa de transferência internacional. Uma região de armazenamento escolhida pode não descrever acesso remoto de suporte, processamento de modelo, backups ou subcontratados. Pergunte quais serviços toam os dados e verifique os compromissos escritos atuais para a configuração que você realmente usa.

Um **acordo de processamento de dados**, ou DPA, registra responsabilidades entre controlador e processador. Revise instruções, medidas de segurança, subprocessadores, assistência com solicitações de direitos, tratamento de incidentes e exclusão ao final do serviço. Um **subprocessador** é outro serviço contratado para processar dados em nome de um processador. Uma lista de provedores é evidência útil, mas não substitui as verificações contratuais e operacionais necessárias.

{{< accordion title="Desativar o treinamento significa que nada é retido?" >}}
Não. Treinamento, armazenamento de conversas, registro de segurança e processamento temporário são atividades diferentes. Revise cada uma separadamente. Uma configuração que interrompe a coleta futura pode não excluir registros passados ou reverter o treinamento concluído do modelo. Prometa aos usuários apenas os controles e direitos que seu serviço completo pode realmente oferecer.
{{< /accordion >}}

Relacionado ao AIVAX: leia a [Privacy Policy](../../docs/legal/privacy-policy.md), [Third-Party Processors](../../docs/legal/third-party-processors.md) e a documentação de [Data Collecting](../../docs/data-sharing.md) em conjunto. O programa opcional de coleta de dados semânticos tem um escopo específico e está desativado por padrão; revise suas condições ao invés de tratá‑lo como uma configuração universal para todo o processamento.

Próximo passo: examine resultados desiguais em [Bias, fairness and responsible AI](bias-fairness-responsible-ai.md).

{{< quiz options="Remover nomes e assumir que todo o texto restante é anônimo | Enviar a mensagem completa e ocultar detalhes apenas no painel | Enviar apenas as informações necessárias para classificação e manter identificadores autorizados separados | Manter todas as conversas para sempre caso um cliente retorne" answer="3" explanation="A minimização reduz a exposição antes do processamento. Remover um nome não garante anonimato, e mascarar apenas a exibição deixa a transmissão original inalterada." >}}
Um modelo só precisa classificar um problema de entrega. Qual abordagem segue melhor a minimização de dados?
{{< /quiz >}}
