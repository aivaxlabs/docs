---
{title: Medindo aderência e alucinação,linkTitle: Medir qualidade do conhecimento,description: "Avalie se as respostas de um agente seguem as evidências, cobrem as perguntas pretendidas e reconhecem o que as fontes não estabelecem.",weight: 50,duration: 12,objectives: ["Diferenciar fundamentação, alucinação e cobertura.",Construir um conjunto de perguntas com respostas esperadas revisáveis.,Comparar revisão manual com julgamento automatizado.,"Interpretar resultados de avaliação como evidência para melhoria, não como garantias."],sourceHash: e686497d0ca12c6c}
---

Um agente pode responder educadamente, citar um documento e ainda assim declarar incorretamente a regra que importa. Avaliar respostas baseadas em conhecimento significa olhar além da fluência. Você precisa perguntar se as evidências sustentam as alegações, se o agente respondeu à pergunta real e se reconheceu informações ausentes.

Pense em revisar o relatório de um colega. Um layout polido não prova que as conclusões derivam dos registros de apoio. Você inspeciona afirmações importantes, compara-as com suas fontes e distingue um resumo razoável de um salto não sustentado. A avaliação de agentes segue o mesmo princípio, mas um conjunto de perguntas repetível permite comparar versões em vez de depender de algumas conversas memoráveis.

## Nomeie o que você está medindo

**Aderência** significa seguir um requisito definido. Nesta unidade, *aderência ao conhecimento* significa que a resposta segue as evidências fornecidas. **Fundamentação** é a questão estreitamente relacionada de saber se as alegações factuais são sustentadas por essas evidências. Um agente pode seguir uma instrução de tom amigável enquanto falha na aderência ao conhecimento, portanto sempre indique qual tipo você quer dizer.

Uma **alucinação** é uma alegação factual que é inventada ou não sustentada, mas apresentada como estabelecida. Para avaliação de conhecimento, distinga uma alegação não sustentada de uma alegação contradita. Uma política pode não mencionar a velocidade de reembolso, tornando um prazo inventado não sustentado. Se a política explicitamente fornece um prazo diferente, a resposta também contradiz a fonte. Ambos importam, mas podem revelar erros diferentes.

**Cobertura** refere‑se a se o conhecimento aprovado contém respostas às perguntas pretendidas. Falta de cobertura não é necessariamente uma falha de geração. Se a fonte não descreve a compatibilidade de um produto, um “Não posso confirmar isso com as informações disponíveis” pode ser a resposta correta. Uma resposta pode estar totalmente fundamentada e ainda assim incompleta porque aborda apenas parte da pergunta.

{{< stats >}}
{{< stat value="Evidence" label="A fonte sustenta as alegações?" >}}
{{< stat value="Coverage" label="O conhecimento contém a resposta necessária?" >}}
{{< stat value="Usefulness" label="A resposta resolve a pergunta real?" >}}
{{< /stats >}}

Esses são pontos de vista complementares, não pontuações intercambiáveis. Um sistema que recusa todas as perguntas pode evitar alegações não sustentadas, mas ser inútil. Um sistema que responde tudo pode parecer útil enquanto inventa condições. Avalie o equilíbrio usando as responsabilidades reais do agente e as consequências dos erros.

## Construir um conjunto de perguntas antes de ajustar

Um **conjunto de perguntas** é uma coleção de prompts representativos ou cenários de conversa com um critério acordado para julgar o resultado. Comece com padrões de perguntas reais, reescritos para remover informações pessoais desnecessárias. Inclua perguntas rotineiras, exceções, formulações ambíguas, informações ausentes e tópicos fora do escopo do agente. Uma coleção composta apenas por perguntas fáceis dará evidência tranquilizadora, mas fraca.

Para cada caso, registre a pergunta, a versão da fonte aplicável, fatos esperados, alegações proibidas e próximos passos aceitáveis. Uma **resposta esperada** não precisa ser uma única frase exata. Pode ser uma lista de verificação: nomear a condição de elegibilidade, solicitar a versão do produto ausente e não prometer aprovação. Isso permite diferentes formulações úteis sem recompensar adições não sustentadas.

{{< steps >}}
{{< step title="Escolher casos representativos" >}}
Amostre tarefas comuns e inclua deliberadamente casos de borda consequentes. Mantenha um rótulo separado para cada tópico para que falhas não fiquem ocultas em um resultado geral.
{{< /step >}}
{{< step title="Escrever a expectativa baseada em evidências" >}}
Peça a um revisor experiente que identifique as passagens da fonte e as condições necessárias. Marque perguntas que devam levar a esclarecimento ou escalonamento.
{{< /step >}}
{{< step title="Executar e preservar o resultado" >}}
Registre a pergunta, as passagens recuperadas, a resposta e a configuração relevante. Mantenha a versão da fonte para que revisores posteriores saibam o que o agente pôde ver.
{{< /step >}}
{{< step title="Revisar e classificar falhas" >}}
Separe conhecimento ausente, recuperação falha, leitura incorreta de evidência e comunicação pobre. Atribua o reparo à parte responsável do processo.
{{< /step >}}
{{< /steps >}}

Não reescreva silenciosamente respostas esperadas para combinar com o que o agente produziu. Se a política aprovada mudar, atualize a expectativa com um motivo documentado. Mantenha alguns casos de lado enquanto melhora o sistema, depois verifique-os novamente. Esses casos mantidos ajudam a revelar se as melhorias se generalizam além dos exemplos usados repetidamente durante o ajuste.

## Revise as alegações, não o tom

Considere uma política fictícia de workshop: visitantes podem participar de sessões introdutórias, mas é necessário reservar. A pergunta é se um amigo pode chegar sem reserva. Um revisor deve inspecionar tanto a permissão quanto sua condição.

{{< compare >}}
{{< side title="Parece útil mas falha" tone="bad" >}}
“Sim, seu amigo é bem‑vindo. Basta chegar com ele que a equipe vai abrir espaço.”
A resposta preserva o acesso do visitante, mas inventa uma exceção à reserva.
{{< /side >}}
{{< side title="Segue a evidência" tone="good" >}}
“Visitantes são bem‑vindos nas sessões introdutórias, mas a reserva é necessária. Não posso confirmar um lugar sem reserva.”
A resposta mantém a restrição e não transforma elegibilidade em lugar garantido.
{{< /side >}}
{{< /compare >}}

Uma citação à página do workshop não repararia a primeira resposta. A fonte deve sustentar a alegação feita, não apenas compartilhar o tópico. Revisores também devem verificar omissões: deixar de fora uma restrição pode enganar mesmo quando cada frase restante é tecnicamente verdadeira.

## Combine pessoas e juízes automatizados

**Revisão manual** significa que uma pessoa aplica os critérios de avaliação. É particularmente útil para criar o conjunto de perguntas inicial, resolver casos disputados e revisar respostas de alta consequência. Peça aos revisores que expliquem uma falha com a alegação não sustentada e a passagem de fonte relevante. Isso torna o feedback acionável e ajuda diferentes revisores a aplicar o mesmo padrão.

Um **juiz automatizado** é um software, frequentemente outro modelo de linguagem, que avalia uma resposta contra critérios e evidências. Ele pode revisar muitos casos de forma consistente o para identificar padrões, mas também pode interpretar erroneamente uma regra, favorecer formulações fluentes ou aceitar uma explicação fabricada. Concordância com um juiz não é prova independente de verdade.

Forneça ao juiz os critérios esperados e as evidências adequadas. Compare periodicamente suas decisões com a revisão humana, especialmente após mudar o juiz, instruções ou material fonte. Se revisores discordarem, inspecione o critério antes de concluir que o agente está errado. Um requisito vago como “responder bem” produz avaliação pouco confiável, quem quer que a faça.

Relacionado: AIVAX [Agentic Tests](../../docs/inference/agentic-tests.md) avalia conversas completas usando um usuário simulado e um juiz independente. Use esse recurso para resultados conversacionais, enquanto ainda verifica a qualidade das evidências e critérios fornecidos à avaliação. [Testing and evaluating agents](../quality/testing-and-evaluating-agents.md) cobre o processo de teste mais amplo.

## Leia métricas como tendências

Uma **métrica** é uma medida definida calculada a partir de observações. Por exemplo, você pode relatar a proporção de respostas revisadas cujas alegações factuais são todas sustentadas. Declare o que conta como aprovação e se a medida é calculada por alegação, por resposta ou por conversa. Esses denominadores, os totais contados, produzem números diferentes.

{{< chart type="line" title="Respostas totalmente fundamentadas ao longo das revisões (ilustrativo)" unit="%" data=`{"labels":["Baseline","Source cleanup","Retrieval adjustment","Instruction revision"],"series":[{"name":"Respostas revisadas aprovadas","values":[62,75,79,86]}]}` caption="Resultados fictícios no mesmo conjunto de perguntas e rubrica. A linha ascendente não é um benchmark de produto nem garantia de que cada mudança melhora todos os tópicos." >}}

Compare revisões usando os mesmos casos e regras de revisão quando possível. Se você adicionar perguntas mais difíceis, uma pontuação menor pode refletir um teste melhor ao invés de um agente pior. Divida os resultados por tópico e gravidade da falha. Uma média em melhoria pode esconder uma nova falha em uma exceção de política com consequências graves.

Também acompanhe respostas úteis, recusas adequadas e falhas de recuperação. [Metrics](../quality/metrics.md) explica como escolher medidas que reflitam o trabalho. Repita casos selecionados quando o comportamento variar e evite tratar uma pequena amostra como previsão precisa de todas as conversas futuras.

## Transforme constatações em reparos

Quando o fato esperado está ausente do conhecimento, atribua uma tarefa de conteúdo. Quando ele existe mas não foi recuperado, investigue a busca e a estrutura do documento. Quando foi recuperado mas a resposta altera seu significado, inspecione instruções e comportamento da resposta. Re‑teste o caso com falha e casos relacionados após o reparo para que resolver uma pergunta não quebre outra.

Próximo passo: melhorar quais evidências chegam ao modelo em [Retrieval strategies](retrieval-strategies.md).

{{< quiz options="A resposta contém uma citação e soa confiante | Cada alegação factual segue a evidência aplicável, e as condições necessárias são preservadas | A resposta usa as mesmas palavras da resposta esperada | O agente nunca diz que a informação está ausente" answer="2" explanation="A fundamentação depende do suporte às alegações e do tratamento fiel das condições. Citações, formulações idênticas e confiança não são evidência suficiente de correção." >}}
Qual padrão de revisão testa melhor a aderência ao conhecimento?
{{< /quiz >}}
