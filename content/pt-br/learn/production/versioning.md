---
{title: "Versionamento de prompts, agentes e conhecimento",linkTitle: Versionamento,description: "Mantenha um registro confiável das alterações de agentes para que você possa testar versões, explicar o comportamento e restaurar uma configuração mais segura quando necessário.",weight: 30,duration: 11,objectives: [Identifique os artefatos que pertencem a uma versão de agente.,Conecte cada versão às suas evidências de avaliação e ao registro de alterações.,Separe as verificações de ambiente de staging da implantação em produção.,Reversão de plano e atualização do conhecimento sem prometer respostas idênticas.],sourceHash: b1561543a7e5da8f}
---

Um restaurante registra alterações em suas receitas, ingredientes e instruções de preparo. Se os clientes relatarem um problema, a equipe precisa saber qual combinação produziu as refeições deles. Um agente precisa da mesma disciplina. Alterar uma frase em suas instruções, substituir um documento de política ou adicionar uma ferramenta pode mudar o que os usuários recebem, mesmo quando a aplicação em si parece inalterada.

**Versionamento** significa manter registros nomeados e recuperáveis das alterações. Um **artefato** é algo mantido como parte de um sistema, como um documento de instrução ou definição de ferramenta. Uma versão só é útil quando identifica o que realmente foi executado. Chamar tudo de “mais recente” torna difícil explicar por que a resposta de ontem diferiu da de hoje.

## Versione toda a configuração de trabalho

Um **prompt** é o conjunto de instruções e outro texto fornecidos a um modelo para uma tarefa específica. Ele pode combinar regras estáveis com mensagens de usuário em mudança. Mantenha as instruções estáveis e a receita para montá-las sob controle de versão: um sistema que registra seu histórico. Um documento compartilhado com rastreamento de alterações pode ser um ponto de partida; o requisito essencial é um registro inequívoco e uma maneira de recuperá-lo.

Não pare no prompt. Um agente também depende de definições de ferramentas, permissões, escolhas de modelos e fontes de conhecimento. Uma definição de ferramenta descreve uma ação disponível, seus inputs necessários e o significado de seus resultados. Alterar “criar um rascunho” para “enviar uma mensagem” é uma alteração comportamental material, não apenas uma correção de redação. O registro de lançamento deve tornar essa diferença visível.

{{< cards >}}
{{< card title="Instruções" icon="book" >}}
Registre o papel, os limites, os exemplos e as regras para montar o contexto. Mantenha um motivo para cada alteração significativa.
{{< /card >}}
{{< card title="Ferramentas e acesso" icon="tools" >}}
Registre definições de ferramentas, comportamento esperado e políticas de permissão. Referencie locais secretos sem copiar valores secretos para o histórico de versionamento.
{{< /card >}}
{{< card title="Conhecimento" icon="database" >}}
Registre quais documentos aprovados estavam disponíveis, suas revisões e quando foram verificados quanto à atualidade.
{{< /card >}}
{{< card title="Modelo e configurações" icon="cpu" >}}
Registre o modelo selecionado, as configurações relevantes e as regras de roteamento, ou seja, as regras que escolhem um modelo para uma solicitação.
{{< /card >}}
{{< /cards >}}

Um **lançamento** é uma combinação aprovada desses artefatos disponibilizada aos usuários. Dê a cada lançamento um rótulo claro e mantenha um inventário curto de suas partes. Isso evita um erro comum: testar um prompt contra um conjunto de conhecimento específico e, acidentalmente, publicá-lo com uma configuração de ferramenta diferente. O rótulo deve acompanhar os registros operacionais para que um problema relatado possa ser conectado à combinação correta.

Relacionado: na AIVAX, a configuração reutilizável que reúne essas escolhas é chamada de [gateway de IA](../../docs/inference/ai-gateways/concepts.md). Manter um inventário de lançamentos é uma prática operacional; não assuma que um editor de configuração fornece automaticamente seu processo completo de aprovação, versionamento ou reversão.

## Escreva um log de alterações para decisões

Um **log de alterações** é uma descrição concisa do que mudou e por quê. “Prompt melhorado” não é suficiente. Uma entrada útil diz que as instruções de suporte agora exigem uma fonte para um prazo de troca, identifica a avaliação relevante, registra quem aprovou a alteração e observa seu efeito esperado. Inclua limitações conhecidas, especialmente se uma alteração ajudar em uma tarefa enquanto torna outra mais lenta ou menos confiável.

Um exemplo de histórico de versões abaixo segue um assistente de suporte fictício. Os rótulos descrevem lançamentos, não versões de produto ou compromissos de calendário. Observe que o motivo de cada etapa é visível, incluindo a decisão de não promover um candidato.

{{< timeline >}}
{{< event date="Lançamento A" title="Respostas baseadas apenas em políticas" >}}
O assistente aprovado responde com base em documentos de política revisados e encaminha solicitações específicas da conta para uma pessoa. O registro de lançamento inclui seus resultados de avaliação.
{{< /event >}}
{{< event date="Candidato B" title="Adicionar consulta de pedidos" >}}
Uma versão de staging introduz acesso somente leitura aos pedidos. Os testes descobrem que a identidade ambígua do cliente não é tratada com segurança, então o candidato é retido.
{{< /event >}}
{{< event date="Lançamento B" title="Publicar o fluxo de consulta corrigido" >}}
As verificações de identidade e as mensagens de falha nas ferramentas são corrigidas e retestadas. Um piloto limitado é aprovado, mantendo o lançamento anterior.
{{< /event >}}
{{< event date="Lançamento C" title="Atualizar o conhecimento da política" >}}
Uma revisão aprovada da política de troca substitui o documento mais antigo. As avaliações relevantes são executadas novamente, e as respostas em cache afetadas pela alteração são removidas.
{{< /event >}}
{{< /timeline >}}

Separe o rótulo do lançamento da data de vigência do documento. Uma política de troca pode ser carregada hoje, mas aplicar-se apenas a compras feitas após uma data posterior. Registre qual data rege a situação do cliente, em vez de simplesmente instruir o agente a usar o arquivo mais novo. Arquive o material mais antigo onde necessário para perguntas históricas legítimas, impedindo que seja confundido com a regra atual.

## Teste a versão que você irá publicar

Uma **avaliação**, frequentemente abreviada como **eval**, é um teste estruturado do agente contra tarefas representativas e critérios de aceitação. Salve os casos de teste, o comportamento esperado, o método de pontuação e os resultados junto ao registro de lançamento. Caso contrário, “teste aprovado” pode referir-se a um prompt, modelo ou conjunto de conhecimento diferentes daquele que agora atende aos usuários.

Inclua tanto melhorias pretendidas quanto **verificações de regressão**, testes que confirmam que o comportamento anteriormente funcional não foi quebrado. Se um novo prompt tornar as respostas mais curtas, verifique se ele ainda declara exceções importantes. Se um documento mudar, teste perguntas cuja resposta deve mudar e perguntas cuja resposta não deve mudar. [Testando e avaliando agentes](../quality/testing-and-evaluating-agents.md) explica como transformar essas expectativas em evidências repetíveis.

**Staging** (ambiente de pré-produção) é um ambiente controlado para verificar um candidato antes que ele alcance os usuários comuns. **Produção** é o ambiente que atende a esses usuários. Mantenha seus propósitos e limites de acesso separados. Use dados de teste sintéticos ou adequadamente protegidos e impeça que ferramentas de staging enviem mensagens reais ou modifiquem contas reais acidentalmente. Um teste aparentemente inofensivo ainda pode causar uma ação externa se estiver conectado a uma ferramenta ativa.

{{< compare >}}
{{< side title="Alteração sem versionamento" tone="bad" >}}
Alguém edita as instruções ao vivo e carrega uma política. Relatórios de respostas incorretas chegam, mas ninguém consegue identificar a configuração anterior ou os testes utilizados.
{{< /side >}}
{{< side title="Alteração versionada" tone="good" >}}
Um candidato combina revisões nomeadas de instruções, ferramentas e conhecimento. Seu registro de avaliação, aprovação e escopo de implantação são salvos antes de alcançar os usuários.
{{< /side >}}
{{< /compare >}}

Para casos de baixo risco adequados, um **teste A/B** compara duas versões com grupos separados sob condições definidas. Registre qual lançamento cada grupo recebe e qual resultado decidirá a comparação. Não combine várias alterações não relacionadas e depois afirme saber qual causou uma melhoria. [Testes A/B](../quality/ab-testing.md) cobre o design e os limites dessa abordagem.

## Fixe modelos sempre que possível e planeje a substituição

**Fixação** (pinning) significa selecionar uma versão específica de um modelo disponível, em vez de um nome móvel que pode apontar para outro lugar posteriormente. Onde um provedor oferece suporte, a fixação ajuda a distinguir suas alterações das alterações no modelo subjacente. Registre o identificador do modelo do provedor e quaisquer configurações relevantes. Se apenas um nome móvel estiver disponível, registre essa limitação e monitore as mudanças.

A fixação não garante respostas idênticas para sempre. As saídas dos modelos podem variar, os serviços podem mudar e uma versão antiga pode ser aposentada. Mantenha um plano de substituição: identifique um candidato, execute as mesmas avaliações e agende uma troca controlada antes que a opção atual desapareça. Não trate o modelo antigo como uma rota de fuga de emergência disponível indefinidamente.

## Lance e restaure deliberadamente

Uma **reversão** (rollback) restaura uma configuração previamente aprovada quando uma mais recente causa problemas. É mais fácil quando todo o inventário de lançamento é conhecido, incluindo compatibilidade de conhecimento e ferramentas. Decida antecipadamente quem pode acioná-la, quais evidências a justificam e como a equipe confirma que a versão pretendida está realmente atendendo às solicitações.

{{< steps >}}
{{< step title="Monte o candidato" >}}
Congele as revisões pretendidas de instruções, ferramentas, conhecimento e modelo em um registro de lançamento. Explique o propósito e os riscos da alteração.
{{< /step >}}
{{< step title="Avalie no staging" >}}
Execute verificações representativas e de regressão contra essa combinação exata. Resolva falhas bloqueantes e registre as limitações restantes.
{{< /step >}}
{{< step title="Aprove e realize um piloto" >}}
Atribua um revisor responsável e exponha o candidato a um público limitado e adequado. Mantenha a configuração segura anterior disponível, onde compatível.
{{< /step >}}
{{< step title="Observe e decida" >}}
Compare o piloto com os critérios de aceitação. Expanda, pause ou reverta, então registre a decisão e a versão que permanece ativa.
{{< /step >}}
{{< /steps >}}

Restaurar a configuração não reverte ações externas. Uma mensagem já enviada continua enviada; uma transação aprovada pode exigir uma correção separada. Também pode estar errado restaurar conhecimento obsoleto após uma atualização de política legalmente exigida. Nesse caso, interrompa a capacidade afetada ou publique um lançamento corrigido em vez de reintroduzir informações sabidamente falsas.

{{< accordion title="Como as datas de atualidade diferem das versões?" >}}
Uma versão identifica uma revisão específica. Uma data de atualidade registra quando alguém verificou se o conteúdo ainda estava preciso. Um documento inalterado pode ficar desatualizado porque o mundo mudou. Dê aos fontes importantes um proprietário, uma data de vigência, onde relevante, e um cronograma de revisão; acione uma revisão antecipada quando um proprietário de política anunciar uma mudança.
{{< /accordion >}}

Próximos passos: reúna esses hábitos de lançamento na [Lista de verificação de implantação](deployment-checklist.md).

{{< quiz options="Apenas o texto mais recente do prompt, porque tudo o resto é externo | Um rótulo de lançamento vinculado a instruções, ferramentas, conhecimento, escolhas de modelo e evidências de avaliação | Uma captura de tela de uma resposta bem-sucedida | Um nome de modelo antigo sem registros de conhecimento ou permissão" answer="2" explanation="O comportamento de um agente depende de toda a configuração. Um registro de lançamento conecta essa combinação aos seus testes e aprovações, ajudando a equipe a investigar alterações e planejar uma restauração segura." >}}
O que um registro de lançamento de agente útil deve identificar?
{{< /quiz >}}
