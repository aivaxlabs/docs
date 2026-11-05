---
{title: Glossário e guia de consulta,linkTitle: Glossário e guia de consulta rápida,description: "Procure o vocabulário essencial de agentes e use uma lista de verificação compacta para prompts, conhecimento, ferramentas, segurança e custo.",weight: 50,duration: 12,objectives: [Explicando termos comuns de agentes em linguagem cotidiana.,Distinguir o comportamento do modelo das responsabilidades da aplicação.,Encontre a unidade de Aprendizado que desenvolve um conceito em profundidade.,Realize verificações práticas antes de alterar um agente.],sourceHash: ce4d2ffe8f3364ac}
---

Você não precisa memorizar todos os termos técnicos antes de construir um assistente útil. Você precisa de um vocabulário compartilhado ao discutir o que ele pode saber, o que pode fazer e quem verifica seu trabalho. Use esta página como um cartão de referência de oficina: encontre a palavra desconhecida e siga seu link quando a distinção afetar seu design.

Os termos abaixo descrevem conceitos gerais, não garantias sobre um produto específico. “Estruturado” não significa “verdadeiro”, “autenticado” não significa “permitido fazer tudo” e “automatizado” não significa “sem responsabilidades”. Essas distinções são mais importantes do que lembrar as abreviações.

## Glossário

As guias agrupam os termos em ordem alfabética. Cada entrada fornece um significado curto e aponta para uma lição que explica seu uso prático.

{{< tabs >}}
{{< tab title="A–C" >}}
**Teste A/B** — Uma comparação que atribui usuários ou casos comparáveis a diferentes versões para que seus resultados possam ser avaliados com justiça; veja [Testes A/B](../quality/ab-testing.md).

**Agente** — Software que combina um modelo com instruções, contexto e ferramentas permitidas para realizar uma tarefa delimitada; veja [Introdução aos agentes de IA](../agents/introduction-to-ai-agents.md).

**API** — Uma interface de programação de aplicativos é uma maneira definida pela qual um programa solicita informações ou ações a outro; veja [Conectando-se a sistemas existentes](../agents/connecting-to-existing-systems.md).

**Autenticação** — Um processo que verifica a identidade de um usuário ou sistema, em vez de decidir todas as ações que ele pode executar; veja [Autenticação e permissões](../tools-and-integrations/authentication-and-permissions.md).

**Autorização** — A decisão sobre quais informações ou ações um usuário identificado pode acessar em uma situação específica; veja [Autenticação e permissões](../tools-and-integrations/authentication-and-permissions.md).

**Viés** — Uma tendência sistemática que pode produzir resultados injustos ou não representativos, em vez de erros aleatórios; veja [Viés, justiça e IA responsável](../safety/bias-fairness-responsible-ai.md).

**Cache** — Informações armazenadas ou um resultado anterior reutilizado para evitar trabalho repetido, sujeito a frescor e restrições de acesso; veja [Otimização de custos e cache](../production/cost-optimization-and-caching.md).

**Canal** — O local onde as pessoas interagem com um assistente, como um chat em um site ou serviço de mensagens; veja [Integração de canais](../tools-and-integrations/integrating-channels.md).

**Chunk (Fragmento)** — Um trecho menor extraído de um documento maior para que informações relevantes possam ser recuperadas sem enviar tudo; veja [Preparando documentos para conhecimento](../teaching-agents/preparing-documents-for-knowledge.md).

**Citação** — Uma referência que permite ao leitor inspecionar a fonte que sustenta uma afirmação específica da resposta; veja [Escrevendo bons documentos](../teaching-agents/writing-good-documents.md).

**Contexto** — As instruções, mensagens, fatos e resultados de ferramentas fornecidos ao modelo para sua resposta atual; veja [Adicionando contexto](../agents/adding-context.md).

**Janela de contexto** — A capacidade do modelo de considerar os tokens dentro de uma solicitação, com detalhes de contabilidade dependendo do modelo; veja [Janela de contexto, tokens e custo](../prompt-engineering/context-window-tokens-and-cost.md).
{{< /tab >}}
{{< tab title="D–H" >}}
**Deflexão** — Um problema elegível resolvido sem intervenção humana, que não deve ser confundido com uma conversa abandonada ou bloqueada; veja [Métricas](../quality/metrics.md).

**Implantação** — Tornar uma versão testada disponível para seus usuários pretendidos, com monitoramento, propriedade e um plano de recuperação; veja [Lista de verificação de implantação](../production/deployment-checklist.md).

**Embedding (Vetorização)** — Uma representação numérica usada para comparar o significado ou características de texto e outros conteúdos; veja [Embeddings e busca semântica](../models/embeddings-and-semantic-search.md).

**Escalonamento** — Transferir um problema para uma pessoa ou processo com a autoridade necessária para lidar com ele; veja [Transparência e escalonamento humano](../safety/transparency-and-human-escalation.md).

**Avaliação** — Uma avaliação planejada contra exemplos e critérios definidos, em vez de julgar um agente por uma única resposta impressionante; veja [Testando e avaliando agentes](../quality/testing-and-evaluating-agents.md).

**Fallback (Plano B)** — Uma alternativa definida usada quando a operação preferencial não pode ser concluída, sem enfraquecer silenciosamente a segurança ou as permissões; veja [Erros, retentativas e fallbacks](../advanced-agents/errors-retries-and-fallbacks.md).

**Chamada de função** — Uma solicitação estruturada do modelo para que o software execute uma operação nomeada com entradas especificadas; veja [Chamada de função](../tools-and-integrations/function-calling.md).

**Fundamentação (Grounding)** — Conectar uma resposta às evidências fornecidas, em vez de depender apenas de padrões aprendidos durante o treinamento; veja [O que é um RAG](../teaching-agents/what-is-a-rag.md).

**Guarda-chuva (Guardrail)** — Um limite comportamental ou de software destinado a manter um agente dentro de seu escopo e ações permitidos; veja [Adicionando guardrails](../agents/adding-guardrails.md).

**Alucinação** — Uma afirmação gerada pelo modelo, sem suporte ou incorreta, que pode soar fluida e confiante apesar de carecer de evidências; veja [Medindo aderência e alucinação](../teaching-agents/measuring-adherence-and-hallucination.md).

**Humano no loop** — Uma pessoa envolvida deliberadamente em um ponto definido de decisão ou aprovação, em vez de meramente observar posteriormente; veja [Humano no loop](../advanced-agents/human-in-the-loop.md).
{{< /tab >}}
{{< tab title="I–P" >}}
**Idempotência** — Uma propriedade que permite que solicitações repetidas para a mesma operação evitem criar efeitos indesejados adicionais; veja [Erros, retentativas e fallbacks](../advanced-agents/errors-retries-and-fallbacks.md).

**Inferência** — Executar um modelo treinado em uma nova entrada para obter uma saída, em vez de alterar o modelo por meio do treinamento; veja [O que é um LLM](../agents/what-is-an-llm.md).

**Instrução** — Uma declaração que diz a um assistente como se comportar, que ainda precisa de aplicação por software para permissões consequentes; veja [Escrevendo prompts e instruções bons](../agents/writing-good-prompts-and-instructions.md).

**Latência** — O tempo entre uma solicitação e uma resposta útil, incluindo pesquisa, ferramentas e processamento do modelo; veja [Desempenho e latência](../production/performance-and-latency.md).

**LLM** — Um grande modelo de linguagem é um sistema treinado que gera linguagem prevendo peças sucessivas de texto; veja [O que é um LLM](../agents/what-is-an-llm.md).

**Log** — Um evento registrado que ajuda os operadores a entender o que aconteceu sem precisar reproduzir cada interação do usuário; veja [Logs, rastros e monitoramento](../quality/logs-traces-and-monitoring.md).

**MCP** — O Protocolo de Contexto do Modelo é um protocolo compartilhado para expor ferramentas e recursos a aplicativos compatíveis; veja [Protocolo de Contexto do Modelo](../tools-and-integrations/model-context-protocol.md).

**Memória** — Informação intencionalmente retida e posteriormente fornecida a um assistente, não uma recordação automática semelhante à humana pelo modelo; veja [Memória](../prompt-engineering/memory.md).

**Metadados** — Informações descritivas sobre um documento, como seu proprietário, público-alvo ou data de vigência; veja [Encontrando e preparando conhecimento](../teaching-agents/finding-and-preparing-knowledge.md).

**Multimodalidade** — A capacidade de lidar com mais de uma forma de informação, como texto, imagens ou áudio; veja [Multimodalidade](../models/multimodality.md).

**Prompt** — A entrada que pede ao modelo para fazer algo e fornece orientação ou material relevante; veja [Anatomia de um prompt](../prompt-engineering/anatomy-of-a-prompt.md).

**Injeção de prompt** — Uma tentativa de fazer com que um assistente trate conteúdo não confiável como instruções que substituem sua tarefa ou limites pretendidos; veja [Injeção de prompt e jailbreaks](../safety/prompt-injection-and-jailbreaks.md).
{{< /tab >}}
{{< tab title="R–W" >}}
**RAG** — A geração aumentada por recuperação recupera evidências relevantes e as inclui ao pedir ao modelo para produzir uma resposta; veja [O que é um RAG](../teaching-agents/what-is-a-rag.md).

**Limite de taxa** — Uma restrição sobre com frequência as solicitações podem ser feitas, que os aplicativos devem respeitar, em vez de contornar; veja [Erros, retentativas e fallbacks](../advanced-agents/errors-retries-and-fallbacks.md).

**Reclassificação** — Reordenar candidatos recuperados usando outra avaliação de relevância antes de escolher quais trechos usar; veja [Estratégias de recuperação](../teaching-agents/retrieval-strategies.md).

**Recuperação** — Encontrar informações candidatas relevantes para uma pergunta dentro das fontes que o usuário atual pode acessar; veja [Estratégias de recuperação](../teaching-agents/retrieval-strategies.md).

**Retentativa** — Outra tentativa após uma operação falha ou incerta, sujeita a limites e verificações de ação duplicada; veja [Erros, retentativas e fallbacks](../advanced-agents/errors-retries-and-fallbacks.md).

**Schema (Esquema)** — Uma descrição da forma e dos tipos de dados necessários, não prova de que os valores estão factualmente corretos; veja [respostas estruturadas](../../docs/inference/structured-responses/concepts.md).

**Busca semântica** — Encontrar conteúdo por significado, em vez de depender apenas de correspondências exatas de palavras; veja [Embeddings e busca semântica](../models/embeddings-and-semantic-search.md).

**Habilidade (Skill)** — Um pacote de instruções reutilizável para uma tarefa ou método, distinto de uma ferramenta executável; veja [Adicionando habilidades](../agents/adding-skills.md).

**Temperatura** — Uma configuração que afeta como as saídas do modelo são amostradas, não um botão que garante precisão factual; veja [Parâmetros](../models/parameters.md).

**Token** — Uma pequena unidade de texto processada por um modelo, que pode ser uma palavra, parte de uma palavra ou pontuação; veja [Janela de contexto, tokens e custo](../prompt-engineering/context-window-tokens-and-cost.md).

**Ferramenta (Tool)** — Uma operação de software definida que um agente pode solicitar, como pesquisar um banco de dados ou criar um chamado; veja [Adicionando ferramentas](../agents/adding-tools.md).

**Rastro (Trace)** — Um registro conectado das etapas dentro de uma operação que ajuda a localizar falhas ou atrasos; veja [Logs, rastros e monitoramento](../quality/logs-traces-and-monitoring.md).

**Webhook** — Uma notificação enviada a outro sistema quando um evento definido ocorre, muitas vezes para iniciar trabalho de acompanhamento; veja [Webhooks, eventos e automações](../tools-and-integrations/webhooks-events-and-automations.md).

**Fluxo de trabalho (Workflow)** — Uma sequência organizada de tarefas e decisões que define como o trabalho prossegue e onde ele termina; veja [Fluxos de trabalho como habilidades](../agents/workflows-as-skills.md).
{{< /tab >}}
{{< /tabs >}}

## O guia rápido de trabalho

Estas regras cabem em uma agenda de revisão de projeto. São perguntas para verificar, não frases mágicas para colar em todo prompt. Aplique-as às fontes, sistemas e pessoas envolvidos reais.

{{< cards >}}
{{< card title="Prompts: especifique o trabalho" icon="chat" >}}
Declare o objetivo, o contexto relevante, o formato de saída e os limites. Inclua um exemplo quando o formato for difícil de descrever. Remova regras contraditórias. Diga ao assistente o que fazer quando houver falta de informações.
{{< /card >}}
{{< card title="Conhecimento: mantenha as evidências" icon="book" >}}
Use documentos aprovados e atuais com proprietários e escopo claro. Mantenha exceções próximas às suas regras. Teste se o trecho relevante é realmente recuperado antes de alterar a redação da resposta do modelo.
{{< /card >}}
{{< card title="Ferramentas: mantenha as permissões restritas" icon="tools" >}}
Dê a cada operação um propósito claro e valide entradas fora do modelo. Distinga leitura de escrita. Confirme mudanças consequentes, previna ações duplicadas e verifique o resultado antes de afirmar o sucesso.
{{< /card >}}
{{< card title="Segurança: forneça uma saída real" icon="shield" >}}
Colete apenas dados necessários, aplique o acesso antes da recuperação e trate conteúdo externo como não confiável. Explique que o assistente é automatizado. Torne a rota até uma pessoa visível e operacional.
{{< /card >}}
{{< card title="Custo: meça resultados úteis" icon="coin" >}}
Acompanhe a tarefa inteira, incluindo pesquisa, ferramentas, retentativas, revisão e retrabalho. Reduza o contexto desnecessário antes de sacrificar evidências. Compare o custo por problema resolvido com sucesso, em vez do custo por mensagem isolada.
{{< /card >}}
{{< /cards >}}

## Resolvendo confusões comuns

{{< accordion title="Adicionar conhecimento treina o modelo?" >}}
Normalmente não. A recuperação coloca documentos selecionados na solicitação atual, assim como colocar páginas de referência em uma mesa. O treinamento altera o próprio modelo. Atualizar um documento pesquisável e retreinar um modelo são operações diferentes com custos e controles diferentes.
{{< /accordion >}}
{{< accordion title="Uma chamada de ferramenta significa que a tarefa foi bem-sucedida?" >}}
Não. O modelo pode solicitar uma operação, mas o software deve validá-la e executá-la. A operação pode falhar ou ter um resultado incerto. O sucesso só deve ser relatado depois que o sistema confirmar o resultado pretendido.
{{< /accordion >}}
{{< accordion title="Uma citação torna uma resposta correta?" >}}
Não. A fonte pode estar desatualizada, fora do escopo do usuário ou não relacionada à afirmação. Verifique tanto a autoridade da fonte quanto se seu texto real sustenta a resposta. Um link com aparência credível não é evidência por si só.
{{< /accordion >}}

Próximos passos: escolha uma rota pelo material com [FAQ e caminhos de aprendizado por perfil](faq-and-learning-paths.md).

{{< quiz options="Autorização | Temperatura | Tokenização" answer="1" explanation="A Autorização determina o que um usuário identificado pode acessar ou fazer; a autenticação apenas estabelece quem ele é." >}}
Qual termo descreve decidir se um funcionário identificado pode acessar uma política restrita?
{{< /quiz >}}
