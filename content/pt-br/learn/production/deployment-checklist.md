---
{title: Lista de verificação de implantação,linkTitle: Lista de verificação de implantação,description: "Transforme um agente promissor em um lançamento controlado com responsáveis claros, evidências, limites operacionais e uma implantação gradual.",weight: 40,duration: 13,objectives: [Revisar as áreas essenciais de prontidão antes que um agente entre em produção.,Anexar evidências e responsabilidade às decisões de implantação.,"Planejar um piloto, expansão gradual e um procedimento de parada segura.",Reconhecer questões não resolvidas que devem impedir o lançamento.],sourceHash: 8db7d435ee251963}
---

A demonstração prova que um agente pode funcionar em uma situação selecionada. **Implantação** o disponibiliza em seu ambiente pretendido; entrar em produção significa que pessoas reais podem depender dele. Isso muda a pergunta de “Ele pode responder?” para “Podemos operá‑lo de forma responsável quando a resposta está errada, o serviço está lento ou a solicitação está fora do seu escopo?”

Use esta lista de verificação como uma revisão de lançamento, não como uma cerimônia. Cada item marcado deve apontar para evidências e um responsável. Uma captura de tela da configuração pode provar que uma configuração existe; um resultado de teste mostra se funciona. Nenhum substitui uma pessoa nomeada que pode tomar uma decisão quando algo dá errado.

## Defina o que significa prontidão

Comece com uma promessa de serviço precisa. Um agente de suporte que explica políticas publicadas tem riscos diferentes de um que altera detalhes de contas. Declare quem pode usá‑lo, quais tarefas ele trata e quais ações permanecem decisões humanas. A decisão de lançamento deve aplicar‑se a esse escopo, não a uma ideia indefinida de um “assistente inteligente”.

Um **problema bloqueante** é um problema suficientemente sério para impedir o lançamento, como informações privadas chegando ao cliente errado ou uma ação não autorizada sendo bem‑sucedida. Outras questões podem ser aceitáveis dentro de um piloto restrito se tiverem um responsável, uma mitigação e uma data de revisão. Registre essas decisões explicitamente; uma lista quase completa não é razão para ignorar a questão de segurança restante.

{{< cards >}}
{{< card title="Promessa de serviço" icon="compass" >}}
Objetivos, instruções e conhecimento definem o que o agente deve fazer e o que sustenta suas respostas.
{{< /card >}}
{{< card title="Limites" icon="shield" >}}
Ferramentas, permissões, segurança e privacidade definem quais informações e ações devem permanecer protegidas.
{{< /card >}}
{{< card title="Evidência e operação" icon="eye" >}}
Avaliação, monitoramento e controles de custo mostram se o serviço funciona e permanece dentro dos limites acordados.
{{< /card >}}
{{< card title="Pessoas e lançamento" icon="user" >}}
Suporte, escalonamento e implantação estabelecem quem responde, quem decide e como a exposição aumenta de forma segura.
{{< /card >}}
{{< /cards >}}

## Revisar a lista de verificação de lançamento

{{< tabs >}}
{{< tab title="Objetivos e escopo" >}}
- [ ] Definir o público e as tarefas suportadas — isso estabelece expectativas de serviço compartilhadas.
- [ ] Listar solicitações excluídas e ações proibidas — isso evita promessas abertas.
- [ ] Nomear o responsável e os critérios de sucesso — isso torna o lançamento responsável e mensurável.
{{< /tab >}}
{{< tab title="Instruções" >}}
- [ ] Declarar o papel, limites e comportamento em incerteza — isso orienta as respostas quando informações estão faltando.
- [ ] Verificar regras conflitantes — isso reduz escolhas imprevisíveis.
- [ ] Salvar a versão aprovada da instrução — isso conecta o comportamento à sua configuração revisada.
{{< /tab >}}
{{< tab title="Conhecimento" >}}
- [ ] Confirmar a propriedade da fonte, datas de vigência e atualidade — isso reduz respostas obsoletas.
- [ ] Testar a recuperação com formulação realista — isso verifica se a evidência pode ser encontrada.
- [ ] Separar conhecimento por permissões de acesso — isso protege material restrito.
{{< /tab >}}
{{< tab title="Ferramentas e permissões" >}}
- [ ] Habilitar apenas ações necessárias e acesso mínimo — isso limita danos potenciais.
- [ ] Exigir aprovação para ações consequentes — isso preserva o controle humano.
- [ ] Testar tempos limite e prevenção de duplicatas — isso evita ações repetidas após confirmações perdidas.
{{< /tab >}}
{{< tab title="Segurança e privacidade" >}}
- [ ] Revisar instruções maliciosas em mensagens e documentos — isso testa a resistência a tentativas de redirecionar o agente.
- [ ] Documentar objetivo dos dados, acesso, retenção e exclusão — isso torna o tratamento de dados pessoais deliberado e revisável.
- [ ] Explicar o papel da IA e limitações relevantes — isso ajuda as pessoas a decidir quando solicitar assistência humana.
{{< /tab >}}
{{< tab title="Avaliação" >}}
- [ ] Executar casos representativos, difíceis e fora do escopo — isso testa além de exemplos fáceis.
- [ ] Confirmar precisão, segurança e critérios de falha — isso expõe erros prejudiciais.
- [ ] Salvar resultados para a versão exata — isso vincula a aprovação ao que será lançado.
{{< /tab >}}
{{< tab title="Observabilidade" >}}
- [ ] Registrar resultados, tempos e rótulos de lançamento — isso ajuda a localizar falhas.
- [ ] Remover conteúdo sensível desnecessário dos logs — isso reduz a exposição diagnóstica.
- [ ] Testar alertas e atribuir respondedores — isso garante que os problemas cheguem a alguém capaz de agir.
{{< /tab >}}
{{< tab title="Controles de custo" >}}
- [ ] Estimar custo por tarefa concluída e volume — isso conecta gastos aos resultados.
- [ ] Limitar tentativas, loops de ferramentas e trabalho simultâneo — isso limita o processamento descontrolado.
- [ ] Definir alertas de orçamento e comportamento de parada segura — isso torna o excesso de gastos gerenciável.
{{< /tab >}}
{{< tab title="Suporte e escalonamento" >}}
- [ ] Fornecer um caminho visível para uma pessoa — isso dá aos usuários uma alternativa quando a automação não pode ajudar.
- [ ] Testar detalhes de transferência e disponibilidade do serviço — isso evita que casos desapareçam entre equipes.
- [ ] Atribuir responsáveis por incidentes e comunicação — isso dá à equipe um caminho claro para decisões urgentes.
{{< /tab >}}
{{< tab title="Plano de implantação" >}}
- [ ] Iniciar com um público piloto limitado e adequado — isso revela problemas antes da expansão.
- [ ] Definir critérios de expansão e pausa antecipadamente — isso reduz a pressão para justificar resultados ruins.
- [ ] Ensaiar a parada e restauração de uma configuração segura — isso torna a recuperação prática.
{{< /tab >}}
{{< /tabs >}}

## Inspecione os limites, não apenas as respostas

**Permissões** determinam o que um usuário ou sistema pode ler ou mudar. Não confie apenas em uma instrução dizendo “Nunca acessar o pedido de outro cliente”. A aplicação e o serviço conectado devem impor esse limite. Teste com um usuário que deveria ser recusado, uma identidade ausente e uma conexão expirada, assim como uma solicitação válida. Recusar corretamente é um resultado de segurança bem‑sucedido, não um defeito a ser contornado.

**Dados pessoais** são informações relacionadas a uma pessoa identificável. Decida o que o agente realmente precisa e evite coletar o restante. Registros de conversas, resultados de ferramentas e logs de diagnóstico podem conter material sensível. Confirme quem pode acessá‑los, por quanto tempo são mantidos e como as solicitações de exclusão são tratadas. Requisitos legais dependem da situação; use [Privacy, LGPD and GDPR](../safety/privacy-lgpd-gdpr.md) para enquadrar as perguntas para seu revisor de privacidade ou jurídico responsável.

Verificações de conhecimento devem testar acesso assim como atualidade. Um manual interno pode estar atualizado, mas inadequado para um canal de suporte público. Uma busca bem‑sucedida não basta: o trecho recuperado deve aplicar‑se à situação do usuário e ser permitido para esse público. Quando a fonte não responde à pergunta, teste se o agente reconhece a lacuna e segue o próximo passo acordado.

## Torne as falhas visíveis e acionáveis

**Observabilidade** significa ser capaz de entender o que um sistema está fazendo a partir de seus sinais registrados. Um **log** registra eventos; um **trace** conecta etapas pertencentes a uma solicitação. Capture informações suficientes para distinguir uma busca falha de uma ferramenta falha ou de uma resposta de modelo inadequada, sem registrar conteúdo privado desnecessário. [Logs, traces and monitoring](../quality/logs-traces-and-monitoring.md) explica como transformar esses sinais em evidências operacionais úteis.

Teste um alerta criando deliberadamente uma falha segura em um ambiente de teste. Confirme que ele chega à pessoa certa e inclui contexto suficiente para ação. Um painel que ninguém verifica não é um plano de resposta a incidentes. Anote como pausar a capacidade afetada, preservar evidências adequadas e explicar a situação aos usuários sem adivinhar a causa.

Uma **escalonamento humano** transfere um caso ou decisão para uma pessoa. Especifique o que a dispara: incerteza não resolvida, solicitação explícita do usuário, decisão sensível ou falhas repetidas. Inclua o histórico relevante e as etapas tentadas, com apenas as informações que a equipe receptora precisa. [Human in the loop](../advanced-agents/human-in-the-loop.md) descreve onde a aprovação e revisão humana pertencem em um fluxo de trabalho do agente.

Não prometa ajuda imediata quando a equipe de suporte estiver indisponível. Explique a próxima rota disponível e o que o usuário deve esperar. Teste o que acontece quando a própria transferência falha, e garanta que o usuário possa distinguir “Seu caso foi recebido” de “Alguém resolveu seu caso”. São compromissos diferentes.

## Implantar gradualmente, usando evidências

Um **piloto** é um período deliberadamente limitado de uso real com um público adequado. Não é permissão para expor usuários a comportamentos conhecidos como inseguros. Escolha tarefas de menor risco primeiro, mantenha o suporte disponível e explique as limitações do serviço. A implantação gradual então aumenta a exposição apenas depois que a fase atual atende aos critérios de aceitação pré‑definidos.

{{< steps >}}
{{< step title="Ensaiar em um ambiente controlado" >}}
Execute a jornada completa com dados de teste protegidos, incluindo acesso negado, ferramentas indisponíveis e o procedimento de parada.
{{< /step >}}
{{< step title="Executar um piloto limitado" >}}
Ofereça o escopo aprovado a um pequeno público adequado. Revise falhas e transferências juntamente com interações bem‑sucedidas.
{{< /step >}}
{{< step title="Expandir em etapas" >}}
Aumente deliberadamente o público ou o escopo de tarefas, não ambos por acidente. Reavalie capacidade, qualidade, custo e prontidão do suporte.
{{< /step >}}
{{< step title="Operar e revisar" >}}
Mantenha responsáveis e revisões regulares após o lançamento. Repita as verificações de prontidão relevantes quando instruções, ferramentas, conhecimento ou modelos mudarem.
{{< /step >}}
{{< /steps >}}

Use a conclusão de tarefas, resultados inseguros, tempo de espera, escalonamento e custo em conjunto. Uma alta taxa de conclusão não é aceitável se o agente a alcançar fazendo promessas não autorizadas. Falhas graves infrequentes merecem revisão individual ao invés de serem ocultas por uma média alta. Decida antes do lançamento quais evidências fariam a expansão parar.

Para uma revisão ilustrativa, imagine que a maioria dos itens está concluída, mas um problema de controle de acesso permanece. Contar caixas concluídas ajuda a coordenar o trabalho, mas não pode superar esse bloqueador. Os números abaixo descrevem apenas essa revisão fictícia e não são limites recomendados ou prova de prontidão.

{{< stats >}}
{{< stat value="27" label="verificações concluídas em uma revisão ilustrativa" >}}
{{< stat value="2" label="verificações aguardando evidência na mesma revisão" >}}
{{< stat value="1" label="problema de acesso bloqueante: lançamento permanece pausado" >}}
{{< /stats >}}

{{< accordion title="Podemos lançar com uma lista de verificação incompleta?" >}}
Somente dentro de um escopo que permaneça seguro e explicitamente aprovado. Um recurso ausente pode ser excluído do piloto; um limite de permissão quebrado não pode ser justificado limitando o público. Registre cada exceção, responsável, mitigação e data de revisão. Se a equipe não puder explicar como os usuários permanecem protegidos, mantenha a capacidade afetada indisponível.
{{< /accordion >}}

O que vem a seguir: aplique esta lista de verificação a um serviço concreto em [Customer support agent](../guides/customer-support-agent.md).

{{< quiz options="Lançar porque a maioria das caixas está marcada | Ignorar o problema se o público do piloto for pequeno | Pausar o lançamento afetado até que o limite de acesso seja corrigido e verificado | Remover o teste falho das evidências de lançamento" answer="3" explanation="Uma falha de permissão é um bloqueador de lançamento mesmo quando outras verificações passam. Um público menor não torna o acesso não autorizado seguro; corrija e verifique o limite antes de expor os usuários a essa capacidade." >}}
Uma revisão de lançamento encontra um problema não resolvido que expõe registros de outro cliente. O que a equipe deve fazer?
{{< /quiz >}}
