Source: https://docs.aivax.net/pt-br/learn/safety/privacy-lgpd-gdpr.html

Um cliente pede a um assistente de suporte para reagendar uma entrega. Sua mensagem inclui um nome, endereço residencial e uma explicação envolvendo uma consulta médica. Apenas parte dessas informações é necessária para organizar a entrega. Copiar a conversa inteira em todos os sistemas conectados aumenta a exposição sem melhorar o serviço.

A privacidade começa com essa pergunta comum: o que cada parte do fluxo de trabalho realmente precisa saber? Não é simplesmente uma caixa de seleção na página de configurações de um provedor de modelo. As mensagens podem passar por um canal de chat, sua aplicação, um provedor de modelo, um sistema de negócios e um registro de suporte. Cada cópia precisa de um propósito, proteção adequada e uma vida útil planejada.

> [!IMPORTANT]
> Esta unidade é educacional, não assessoria jurídica. As obrigações da LGPD e do GDPR dependem da sua organização, usuários, propósitos e jurisdição. Consulte um profissional de privacidade qualificado para decisões sobre sua implantação.

## Saiba quais informações você manipula

**Dados pessoais** são informações relacionadas a uma pessoa identificada ou identificável. Um nome é um exemplo óbvio, mas um histórico de pedidos, identificador de dispositivo ou descrição de trabalho incomum também podem identificar alguém quando combinados com outras informações. Remover um nome não remove necessariamente a conexão com a pessoa.

Algumas informações pessoais recebem proteção adicional. Sob a **LGPD** do Brasil, a Lei Geral de Proteção de Dados Pessoais, isso inclui categorias como dados de saúde e biométricos em circunstâncias definidas. O **GDPR** da União Europeia, o Regulamento Geral de Proteção de Dados, possui **categorias especiais** comparáveis com suas próprias definições e condições. Não presuma que as categorias ou exceções são idênticas.


- **Informação visível** — Uma mensagem, foto ou anexo pode conter detalhes pessoais. Peça aos usuários as informações mínimas necessárias ao invés de convidá-los a enviar tudo.

- **Informações ao redor da mensagem** — Referências de conta, históricos de conversas e logs técnicos podem revelar quem é a pessoa ou o que ela fez. Os controles de privacidade também devem cobrir esses registros.

- **Inferências sobre pessoas** — Um resumo do agente pode inferir saúde, circunstâncias financeiras ou preferências pessoais. Informações geradas ainda podem ser dados pessoais e também podem estar erradas.




Segredos comerciais e senhas também requerem proteção, mesmo quando não são dados pessoais. Uma revisão de privacidade e uma revisão de segurança se sobrepõem, mas nenhuma substitui a outra. Por exemplo, criptografar um registro o protege contra algum acesso não autorizado; isso não estabelece um motivo válido para coletar o registro inicialmente.

## Comece com propósito e base legal

Uma **base legal** é a razão pela qual a lei permite um uso específico de dados pessoais. Em palavras simples, responde "Por que podemos fazer isso?" Dependendo da lei e das circunstâncias, exemplos incluem cumprir um contrato, atender a uma obrigação legal, consentimento válido ou um interesse legítimo devidamente avaliado. Esses não são rótulos intercambiáveis para escolher após a coleta dos dados.

Consentimento significa que a pessoa faz uma escolha válida e informada sob os requisitos aplicáveis. Não é um atalho universal, e uma frase vaga como “Ao conversar, você aceita tudo” não resolve a questão. Processar dados sensíveis pode exigir condições adicionais além da base usada para dados pessoais comuns.

Um **controlador** decide por que e como os dados pessoais são processados. Um **processador** os manipula conforme as instruções do controlador. Um negócio que implanta um assistente de cliente normalmente atua como controlador desse fluxo de trabalho do cliente, enquanto provedores de serviços podem atuar como processadores para atividades específicas. As responsabilidades dependem dos papéis e acordos reais, não apenas do rótulo em um folheto de vendas.

| Preocupação compartilhada | LGPD, em palavras simples | GDPR, em palavras simples |
| --- | --- | --- |
| Propósito e necessidade | Explique o propósito e limite o processamento ao que é necessário. | Declare um propósito específico e minimize os dados usados. |
| Justificação legal | Identifique uma base legal aplicável e condições para dados sensíveis. | Identifique uma base legal aplicável e qualquer condição adicional de categoria especial. |
| Direitos individuais | Forneça meios para exercer os direitos aplicáveis, incluindo acesso e exclusão quando disponíveis. | Forneça meios para exercer os direitos aplicáveis, incluindo acesso e apagamento quando disponíveis. |
| Responsabilidade | Ser capaz de demonstrar medidas e responsabilidades adequadas. | Ser capaz de demonstrar conformidade e salvaguardas adequadas. |
| Transferências internacionais | Avaliar regras e salvaguardas de transferência aplicáveis. | Avaliar regras e salvaguardas de transferência aplicáveis. |

Essas semelhanças ajudam a organizar perguntas; a tabela não significa que as leis tenham escopo, prazos, exceções ou aplicação idênticos. O responsável pela privacidade deve documentar os detalhes que se aplicam ao seu serviço antes que ele manipule conversas reais.

## Minimize antes de enviar

**Minimização de dados** significa usar apenas os dados pessoais necessários para o propósito declarado. Um modelo solicitado a classificar um problema de entrega geralmente precisa da descrição do problema, não do endereço completo do cliente. Uma ferramenta de negócios autenticada pode usar o endereço posteriormente, se a mudança real da entrega exigir isso.

**Mascaramento** substitui detalhes identificadores por marcadores de posição. **Pseudonimização** substitui identificadores preservando uma forma de reconectar o registro a uma pessoa, como uma tabela de consulta separada. Esses dados geralmente permanecem como dados pessoais. **Anonimização** visa impedir a identificação sob o padrão legal aplicável; substituir apenas um nome não é suficiente para alegar isso.


**Mensagem bruta: marcadores ilustrativos**

“My name is [FULL NAME], and I live at [HOME ADDRESS]. Please move my delivery because I have [MEDICAL DETAIL]. My order is [ORDER REFERENCE].” Sending all of this to a model for topic classification is unnecessary.


**Mensagem mascarada para classificação**

“The customer wants to reschedule a delivery for a personal reason.” The application retains the verified order reference separately for an authorised delivery tool. The model can identify the task without seeing the omitted details.





Realize mascaramento antes da transmissão, não apenas ao exibir logs posteriormente. Revise também anexos e resumos de conversas: ambos podem reintroduzir um detalhe removido da mensagem mais recente. Se os marcadores precisarem ser restaurados, mantenha esse mapeamento em um sistema protegido e restaure apenas os campos necessários para a saída autorizada.

A remoção excessiva também pode prejudicar a tarefa. Uma preferência de idioma pode ser necessária para responder claramente, e uma solicitação de acessibilidade pode ser essencial para organizar um serviço adequado. O objetivo é um mínimo justificado, não excluir o contexto indiscriminadamente. Teste se a mensagem reduzida ainda suporta uma resposta correta.

## Crie uma lista de verificação de tratamento de dados


1. **Mapeie a jornada**

Liste onde mensagens, anexos, entradas e saídas do modelo e logs circulam. Inclua serviços externos e acesso de equipe, não apenas a interface de chat.


2. **Justifique cada campo**

Registre o propósito, base legal, aviso necessário e proprietário responsável. Remova informações que não ajudam a concluir a tarefa autorizada.


3. **Proteja o que resta**

Aplique mascaramento antes da transmissão, restrinja o acesso e revise as configurações do provedor. Evite copiar mensagens sensíveis para sistemas amplos de depuração ou análise.


4. **Defina retenção e exclusão**

Escolha por quanto tempo cada categoria deve ser mantida, documente exceções e implemente exclusão. Inclua backups, exportações, índices de busca e cópias mantidas pelo provedor, quando aplicável.


5. **Ensaiar uma solicitação de direitos**

Verifique a identidade do solicitante de forma proporcional, encontre os registros relevantes e direcione a solicitação ao seu proprietário. Teste o manuseio de acesso e exclusão sem expor os dados de outra pessoa.





**Retenção** é por quanto tempo as informações são mantidas. Propósitos diferentes podem justificar períodos diferentes: um caso de suporte não resolvido e um registro contábil legal não precisam compartilhar um cronograma. “Manter tudo por precaução” não é uma política útil. Tampouco prometer exclusão imediata quando um dever legal documentado exige que alguns registros permaneçam.

## Verifique provedores, locais e acordos

**Residência de dados** descreve onde os dados são armazenados ou processados. Não é o mesmo que uma avaliação completa de transferência internacional. Uma região de armazenamento escolhida pode não abranger acesso remoto de suporte, processamento de modelo, backups ou subcontratados. Pergunte quais serviços manipulam os dados e verifique os compromissos escritos atuais para a configuração que você realmente usa.

Um **acordo de processamento de dados**, ou DPA, registra responsabilidades entre um controlador e um processador. Revise instruções, medidas de segurança, subprocessadores, assistência com solicitações de direitos, tratamento de incidentes e exclusão ao final do serviço. Um **subprocessador** é outro serviço contratado para processar dados em nome de um processador. Uma lista de provedores é evidência útil, mas não substitui as verificações contratuais e operacionais necessárias.

**Desativar o treinamento significa que nada é retido?**

Não. Treinamento, armazenamento de conversas, registro de segurança e processamento temporário são atividades diferentes. Revise cada uma separadamente. Uma configuração que interrompe a coleta futura pode não excluir registros passados ou reverter o treinamento de modelo concluído. Prometa aos usuários apenas os controles e direitos que seu serviço completo pode realmente oferecer.



Relacionado ao AIVAX: leia a documentação de [Privacy Policy](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md), [Third-Party Processors](https://docs.aivax.net/pt-br/docs/legal/third-party-processors.md) e [Data Collecting](https://docs.aivax.net/pt-br/docs/data-collecting.md) em conjunto. O programa opcional de coleta de dados semânticos tem um escopo específico e está desativado por padrão; revise suas condições ao invés de tratá-lo como uma configuração universal para todo o processamento.

Próximo passo: examine resultados desiguais em [Bias, fairness and responsible AI](https://docs.aivax.net/pt-br/learn/safety/bias-fairness-responsible-ai.md).

**Verifique seu conhecimento.** Um modelo só precisa classificar um problema de entrega. Qual abordagem melhor segue a minimização de dados?

1. Remover nomes e assumir que todo o texto restante é anônimo
2. Enviar a mensagem completa e ocultar detalhes apenas no painel
3. Enviar apenas as informações necessárias para classificação e manter os identificadores autorizados separados
4. Manter todas as conversas para sempre caso o cliente retorne

Answer: option 3. A minimização reduz a exposição antes do processamento. Remover um nome não garante anonimato, e mascarar apenas a exibição deixa a transmissão original inalterada.
