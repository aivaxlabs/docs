---
{title: "Versionamento de prompts, agentes e conhecimento",linkTitle: Versionamento,description: "Mantenha um registro confiável das alterações dos agentes para que você possa testar lançamentos, explicar comportamentos e restaurar uma configuração mais segura quando necessário.",weight: 30,duration: 11,objectives: [Identificar os artefatos que pertencem a um lançamento de agente.,Conectar cada versão à sua evidência de avaliação e ao registro de alterações.,Separar as verificações de teste da implantação em produção.,Planejar reversão e frescor do conhecimento sem prometer respostas idênticas.],sourceHash: 288bbc6485cc39e9}
---

Um restaurante registra alterações em sua receita, ingredientes e instruções de preparo. Se os clientes relatarem um problema, a equipe precisa saber qual combinação produziu suas refeições. Um agente precisa da mesma disciplina. Alterar uma frase em suas instruções, substituir um documento de política ou adicionar uma ferramenta pode mudar o que os usuários recebem, mesmo quando a aplicação parece inalterada.

**Versionamento** significa manter registros nomeados e recuperáveis de alterações. Um **artefato** é algo mantido como parte de um sistema, como um documento de instruções ou definição de ferramenta. Uma versão só é útil quando identifica o que realmente foi executado. Chamar tudo de “último” dificulta explicar por que a resposta de ontem diferiu da de hoje.

## Versionar todo o arranjo de trabalho

Um **prompt** é o conjunto de instruções e outros textos fornecidos a um modelo para uma tarefa específica. Ele pode combinar regras estáveis com mensagens de usuário que mudam. Mantenha as instruções estáveis e a receita para montá‑las sob controle de versão: um sistema que registra seu histórico. Um documento compartilhado com alterações rastreadas pode ser um ponto de partida; o requisito essencial é um registro inequívoco e um modo de recuperá‑lo.

Não pare no prompt. Um agente também depende de definições de ferramentas, permissões, escolhas de modelo e fontes de conhecimento. Uma definição de ferramenta descreve uma ação disponível, suas entradas exigidas e o significado de seus resultados. Alterar “criar um rascunho” para “enviar uma mensagem” é uma mudança de comportamento material, não uma correção de redação. O registro de lançamento deve tornar essa diferença visível.

{{< cards >}}
{{< card title="Instruções" icon="book" >}}
Registre o papel, limites, exemplos e regras para montar o contexto. Mantenha um motivo para cada alteração significativa.
{{< /card >}}
{{< card title="Ferramentas e acesso" icon="tools" >}}
Registre definições de ferramentas, comportamento esperado e políticas de permissão. Referencie locais secretos sem copiar valores secretos para o histórico de versão.
{{< /card >}}
{{< card title="Conhecimento" icon="database" >}}
Registre quais documentos aprovados estavam disponíveis, suas revisões e quando foram revisados para frescor.
{{< /card >}}
{{< card title="Modelo e configurações" icon="cpu" >}}
Registre o modelo selecionado, configurações relevantes e regras de roteamento, ou seja, as regras que escolhem um modelo para uma requisição.
{{< /card >}}
{{< /cards >}}

Um **lançamento** é uma combinação aprovada desses artefatos disponibilizada aos usuários. Dê a cada lançamento um rótulo claro e mantenha um inventário curto de suas partes. Isso evita um erro comum: testar um prompt contra um conjunto de conhecimento e, acidentalmente, publicá‑lo com uma configuração de ferramenta diferente. O rótulo deve viajar para os registros operacionais para que um problema relatado possa ser conectado à combinação correta.

Relacionado: no AIVAX, a configuração reutilizável que reúne essas escolhas é chamada de [AI gateway](../../docs/inference/ai-gateway.md). Manter um inventário de lançamentos é uma prática operacional; não presuma que um editor de configuração fornece automaticamente sua aprovação completa, versionamento ou processo de reversão.

## Escrever um registro de alterações para decisões

Um **registro de alterações** é um relato conciso do que mudou e por quê. “Prompt melhorado” não basta. Uma entrada útil diz que as instruções de suporte agora exigem uma fonte para um prazo de troca, identifica a avaliação relevante, registra quem aprovou a mudança e anota seu efeito esperado. Inclua limitações conhecidas, especialmente se uma mudança ajuda uma tarefa enquanto torna outra mais lenta ou menos confiável.

Um exemplo de histórico de versões abaixo segue um assistente de suporte fictício. Os rótulos descrevem lançamentos, não versões de produto ou compromissos de calendário. Observe que o motivo de cada passo está visível, incluindo a decisão de não promover um candidato.

{{< timeline >}}
{{< event date="Lançamento A" title="Apenas respostas de política" >}}
O assistente aprovado responde a partir de documentos de política revisados e encaminha solicitações específicas de conta a uma pessoa. O registro de lançamento inclui seus resultados de avaliação.
{{< /event >}}
{{< event date="Candidato B" title="Adicionar consulta de pedido" >}}
Uma versão de teste introduz acesso somente leitura a pedidos. Testes descobrem que identidade ambígua do cliente não é tratada com segurança, então o candidato é retido.
{{< /event >}}
{{< event date="Lançamento B" title="Publicar o fluxo de consulta corrigido" >}}
Verificações de identidade e mensagens de falha de ferramenta são corrigidas e retestadas. Um piloto limitado é aprovado com o lançamento anterior mantido.
{{< /event >}}
{{< event date="Lançamento C" title="Atualizar o conhecimento de política" >}}
Uma revisão de política de troca aprovada substitui o documento anterior. Avaliações relevantes são reexecutadas e respostas em cache afetadas pela mudança são removidas.
{{< /event >}}
{{< /timeline >}}

Separe o rótulo do lançamento da data efetiva do documento. Uma política de troca pode ser enviada hoje, mas aplicar‑se apenas a compras feitas após uma data posterior. Registre qual data governa a situação do cliente em vez de simplesmente dizer ao agente para usar o arquivo mais recente. Arquive material antigo quando necessário para perguntas históricas legítimas, evitando que seja confundido com a regra atual.

## Testar a versão que será publicada

Uma **avaliação**, frequentemente abreviada para **eval**, é um teste estruturado do agente contra tarefas representativas e critérios de aceitação. Salve os casos de teste, comportamento esperado, método de pontuação e resultados ao lado do registro de lançamento. Caso contrário, “teste aprovado” pode referir‑se a um prompt, modelo ou conjunto de conhecimento diferentes do que está atendendo os usuários atualmente.

Inclua tanto melhorias pretendidas quanto **verificações de regressão**, testes que confirmam que comportamentos previamente funcionais não foram quebrados. Se um novo prompt torna respostas mais curtas, verifique se ainda declara exceções importantes. Se um documento mudar, teste perguntas onde a resposta deve mudar e perguntas onde não deve. [Testando e avaliando agentes](../quality/testing-and-evaluating-agents.md) explica como transformar essas expectativas em evidência repetível.

**Teste** é um ambiente controlado para verificar um candidato antes que ele chegue aos usuários comuns. **Produção** é o ambiente que serve esses usuários. Mantenha seus propósitos e limites de acesso separados. Use dados de teste sintéticos ou adequadamente protegidos e evite que ferramentas de teste enviem mensagens reais ou modifiquem contas reais acidentalmente. Um teste aparentemente inofensivo ainda pode causar uma ação externa se conectado a uma ferramenta ao vivo.

{{< compare >}}
{{< side title="Alteração não versionada" tone="bad" >}}
Alguém edita as instruções ao vivo e envia uma política. Relatos de respostas incorretas chegam, mas ninguém consegue identificar a configuração anterior ou os testes usados.
{{< /side >}}
{{< side title="Alteração versionada" tone="good" >}}
Um candidato combina instruções nomeadas, revisões de ferramenta e conhecimento. Seu registro de avaliação, aprovação e escopo de implantação são salvos antes de chegar aos usuários.
{{< /side >}}
{{< /compare >}}

Para casos de baixo risco adequados, um **teste A/B** compara duas versões com grupos separados sob condições definidas. Registre qual lançamento cada grupo recebe e qual resultado decidirá a comparação. Não combine várias mudanças não relacionadas e depois afirme saber qual causou a melhoria. [Teste A/B](../quality/ab-testing.md) cobre o desenho e os limites dessa abordagem.

## Fixar modelos quando possível e planejar substituição

**Fixação** significa selecionar uma versão específica de modelo disponível em vez de um nome móvel que pode apontar para outro lugar depois. Onde o provedor oferece suporte, a fixação ajuda a distinguir suas mudanças das mudanças no modelo subjacente. Registre o identificador de modelo do provedor e quaisquer configurações relevantes. Se apenas um nome móvel estiver disponível, registre essa limitação e monitore mudanças.

Fixar não garante respostas idênticas para sempre. Saídas de modelo podem variar, serviços podem mudar e uma versão antiga pode ser descontinuada. Mantenha um plano de substituição: identifique um candidato, execute as mesmas avaliações e agende uma troca controlada antes que a opção atual desapareça. Não trate o modelo antigo como uma rota de escape de emergência indefinidamente disponível.

## Liberar e restaurar deliberadamente

Um **rollback** restaura uma configuração aprovada anteriormente quando uma mais nova causa problemas. É mais fácil quando todo o inventário de lançamento é conhecido, incluindo compatibilidade de conhecimento e ferramenta. Decida previamente quem pode acioná‑lo, que evidência o justifica e como a equipe confirma que a versão pretendida está realmente atendendo às requisições.

{{< steps >}}
{{< step title="Montar o candidato" >}}
Congele as revisões de instruções, ferramenta, conhecimento e modelo pretendidas em um registro de lançamento. Explique o propósito e os riscos da mudança.
{{< /step >}}
{{< step title="Avaliar em teste" >}}
Execute verificações representativas e de regressão contra essa combinação exata. Resolva falhas bloqueadoras e registre as limitações restantes.
{{< /step >}}
{{< step title="Aprovar e pilotar" >}}
Designe um revisor responsável e exponha o candidato a um público limitado e adequado. Mantenha a configuração segura anterior disponível onde compatível.
{{< /step >}}
{{< step title="Observar e decidir" >}}
Compare o piloto com os critérios de aceitação. Expanda, pause ou faça rollback, então registre a decisão e a versão que permanece ativa.
{{< /step >}}
{{< /steps >}}

Restaurar a configuração não reverte ações externas. Uma mensagem já enviada permanece enviada; uma transação aprovada pode exigir correção separada. Também pode ser errado restaurar conhecimento obsoleto após uma atualização de política legalmente exigida. Nesse caso, interrompa a capacidade afetada ou publique um lançamento corrigido em vez de reintroduzir informações conhecidas como falsas.

{{< accordion title="Como as datas de frescor diferem das versões?" >}}
Uma versão identifica uma revisão específica. Uma data de frescor registra quando alguém verificou se seu conteúdo ainda estava preciso. Um documento inalterado pode ficar obsoleto porque o mundo mudou. Dê a fontes importantes um proprietário, uma data efetiva quando relevante e um cronograma de revisão; dispare revisão antecipada quando o proprietário da política anunciar uma mudança.
{{< /accordion >}}

Próximo passo: reúna esses hábitos de lançamento na [Checklist de implantação](deployment-checklist.md).

{{< quiz options="Apenas o texto do prompt mais recente, porque todo o resto é externo | Um rótulo de lançamento ligado a instruções, ferramentas, conhecimento, escolhas de modelo e evidência de avaliação | Uma captura de tela de uma resposta bem‑sucedida | Um nome antigo de modelo sem registros de conhecimento ou permissão" answer="2" explanation="O comportamento de um agente depende de toda a configuração. Um registro de lançamento conecta essa combinação aos seus testes e aprovações, ajudando a equipe a investigar mudanças e planejar uma restauração segura." >}}
O que um registro útil de lançamento de agente deve identificar?
{{< /quiz >}}
