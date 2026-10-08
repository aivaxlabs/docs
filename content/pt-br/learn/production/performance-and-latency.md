---
{title: Desempenho e latência,linkTitle: Desempenho e latência,description: "Descubra onde um agente gasta tempo e torne a espera mais curta, clara e previsível sem sacrificar a correção.",weight: 20,duration: 12,objectives: [Separe o tempo de primeira resposta do tempo total de conclusão da tarefa.,"Identifique atrasos de recuperação, modelo e ferramentas em um fluxo de trabalho do agente.",Escolha oportunidades seguras para streaming e trabalho paralelo.,Meça experiências típicas e lentas com percentis de latência.],sourceHash: ea2a95657f69217c}
---

Um recepcionista que diz “Estou verificando sua reserva” parece diferente de uma linha telefônica silenciosa. Ambos os chamadores podem esperar o mesmo tempo pela reserva, mas um sabe que a solicitação foi compreendida. Um bom agente precisa de ambos os tipos de desempenho: trabalho que termina rapidamente e uma experiência que torne qualquer espera necessária compreensível.

**Latência** é o tempo entre um evento e sua resposta. Para um agente, isso pode significar o tempo desde o envio de uma pergunta até a visualização da primeira palavra, ou o tempo até que uma ação solicitada seja confirmada. Sempre indique qual intervalo você está medindo. Uma saudação rápida não prova que a busca de pedido ou correção de conta terminou rápido.

## Siga a solicitação ao longo da sua jornada

Considere um cliente perguntando se um item entregue pode ser trocado. A aplicação recebe a mensagem, verifica acesso, procura uma política, consulta o pedido, pede ao modelo que interprete os resultados e envia a resposta. Um fluxo real pode revisitar várias etapas. Se o modelo solicitar outra ferramenta, pode haver outra rodada de leitura e resposta.

**Recuperação** é encontrar informação relevante em uma fonte de conhecimento. Pode incluir buscar documentos e ordenar os resultados por relevância. O **primeiro token** é o primeiro pequeno pedaço de texto que o modelo emite. Antes que ele apareça, o provedor pode colocar a solicitação em fila e processar sua entrada. **Geração** é a produção subsequente da resposta. **Ferramentas** são capacidades externas, como verificação de estoque ou consulta de pedido, com seus próprios tempos de espera.

{{< flow "Receber e verificar acesso | Recuperar política | Consultar pedido | Gerar resposta | Entregar resposta" >}}

Esse fluxo mostra uma sequência simples, não uma exigência de que cada etapa seja executada separadamente. Instrumente cada fronteira real: registre quando ela começa, termina ou falha. **Instrumentação** significa adicionar medições à aplicação, como colocar relógios nas estações de uma rota de entrega. Inclua tempo de rede, espera por um trabalhador disponível e preparação da resposta; caso contrário, o tempo ausente pode ser confundido com geração lenta do modelo.

{{< chart type="donut" title="Onde uma solicitação gasta tempo (ilustrativo)" unit="%" data=`[{"label":"Recuperação","value":18},{"label":"Aguardando o primeiro token do modelo","value":32},{"label":"Gerando a resposta","value":25},{"label":"Ferramentas","value":20},{"label":"Outros trabalhos da aplicação","value":5}]` caption="Partes ilustrativas para uma solicitação serial, não um benchmark. Trabalho sobreposto não pode ser simplesmente adicionado como partes de tempo decorrido separadas." >}}

A maior fatia é um ponto de partida para investigação, não prova da correção certa. Um serviço de pedidos pode ser lento apenas durante um período de pico; a geração pode dominar somente quando o agente escreve respostas desnecessariamente longas. Agrupe medições por tarefa e resultado. Combinar uma resposta curta de política com um relatório detalhado oculta diferenças úteis.

## Mostre texto útil mais cedo com streaming

**Streaming** envia uma resposta em partes à medida que é gerada, em vez de manter a resposta completa até o final. Um leitor pode começar a ler uma explicação enquanto sentenças posteriores ainda chegam. Isso costuma melhorar a percepção de rapidez, mas não necessariamente reduz o tempo necessário para terminar a resposta ou concluir uma ação externa.

Meça o **tempo até o primeiro token** desde a solicitação ao modelo até seu primeiro texto emitido, e separadamente meça o tempo desde a submissão do usuário até o primeiro conteúdo visível útil. Eles nem sempre são iguais. A recuperação pode acontecer primeiro, e um aplicativo ou intermediário de rede pode segurar partes antes de exibi‑las. Teste a experiência pelo canal real do cliente, não apenas no console do desenvolvedor.

Streaming não é adequado para toda saída. Um aplicativo que espera um registro estruturado completo pode precisar esperar até que todo o registro seja válido. Conteúdo sensível à segurança pode exigir verificação antes da exibição. Uma frase parcial que parece uma aprovação de reembolso não deve aparecer antes que a autorização seja confirmada. Se houver interrupção, marque claramente a resposta incompleta em vez de apresentá‑la como concluída.

{{< compare >}}
{{< side title="Parece rápido mas engana" tone="bad" >}}
“Sua troca foi aprovada” aparece imediatamente enquanto a verificação do pedido ainda está em andamento. Uma recusa posterior contradiz a primeira mensagem e danifica a confiança.
{{< /side >}}
{{< side title="Responsivo e preciso" tone="good" >}}
“Estou verificando o pedido e a política de troca” aparece enquanto essas etapas são executadas. A aprovação só aparece após a conclusão das verificações necessárias.
{{< /side >}}
{{< /compare >}}

## Reduza o trabalho que deve acontecer

Um modelo menor ou mais rápido pode lidar com uma etapa simples, como classificar um ticket de entrada, enquanto uma etapa mais exigente recebe um modelo que atenda às suas necessidades de qualidade. Menor não garante rapidez sob toda carga de trabalho: fila, capacidade do provedor, tamanho da entrada e comprimento da saída tudo importa. Compare candidatos nas mesmas tarefas antes de encaminhar usuários reais para eles.

Mantenha as solicitações focadas. Enviar documentos irrelevantes aumenta o trabalho de leitura, enquanto pedir um ensaio quando o cliente precisa apenas da data de entrega aumenta o trabalho de geração. Remova buscas repetidas e chamadas de ferramentas desnecessárias. Preserve o contexto necessário para decisões corretas e compare a taxa de perguntas de acompanhamento: uma resposta mais curta não é ganho se todos precisarem perguntar novamente.

**Trabalho paralelo** significa executar operações independentes ao mesmo tempo. Verificar uma política pública de envio e buscar um registro de pedido autorizado pode ser independente após as verificações de acesso necessárias. Quando ambos começam juntos, a espera combinada se aproxima da operação mais lenta do que da soma de ambas. É como pedir a dois colegas que verifiquem pastas diferentes em vez de pedir a um só que faça ambos em sequência.

Não paralelize etapas que dependem uma da outra. Um reembolso deve esperar pela aprovação, e a consulta de um pedido pode exigir primeiro a verificação de identidade do cliente. Solicitações simultâneas também podem sobrecarregar um serviço downstream ou aumentar o custo. Defina um limite para trabalho concorrente, ou seja, quantas operações podem rodar ao mesmo tempo, e garanta que cada operação tenha as permissões necessárias.

{{< cards >}}
{{< card title="Consultas independentes" icon="database" >}}
Considere execução paralela quando ambas as solicitações já têm entradas válidas e nenhuma altera o que a outra deve fazer.
{{< /card >}}
{{< card title="Ações dependentes" icon="lock" >}}
Mantenha a ordem necessária: verificar identidade, checar elegibilidade, obter aprovação, então executar a ação autorizada.
{{< /card >}}
{{< card title="Geração focada" icon="chat" >}}
Forneça ao modelo contexto relevante e um comprimento de resposta adequado. Brevidade ainda deve responder à pergunta real.
{{< /card >}}
{{< /cards >}}

Relacionado: no AIVAX, escolhas reutilizáveis sobre modelo, conhecimento e ferramentas são armazenadas em um [AI gateway](../../docs/inference/ai-gateway.md). Trate qualquer mudança de configuração como algo a ser medido, não como promessa de que toda conversa ficará mais rápida.

## Limite a espera e trate falhas com honestidade

Um **timeout** é um limite de quanto tempo uma operação pode esperar. Dê limites sensatos aos ferramentas individuais dentro de um prazo geral para a tarefa. Sem um prazo geral, várias tentativas podem atender seus próprios limites enquanto o usuário espera muito tempo. Um **retry** repete uma tentativa falhada; um **fallback** usa uma rota alternativa quando a rota preferida está indisponível.

Um timeout nem sempre significa que nada aconteceu. Um pagamento ou criação de ticket pode ter sido bem‑sucedido mesmo que sua confirmação tenha se perdido. Verifique seu status antes de tentar a ação novamente, usando controles de prevenção de duplicatas quando disponíveis. Ofereça um próximo passo seguro quando não for possível estabelecer o resultado. [Errors, retries and fallbacks](../advanced-agents/errors-retries-and-fallbacks.md) explica como evitar transformar um atraso em efeitos colaterais repetidos.

## Meça a experiência ordinária e a lenta

Um **percentil** descreve onde um valor se posiciona em um conjunto ordenado de medições. **p50**, a mediana, é o ponto em que metade das solicitações medidas está abaixo. **p95** é o ponto em que 95 % está abaixo; as solicitações restantes são mais lentas. Essas medidas distinguem melhor uma experiência normal de uma lenta do que uma média única.

Reporte o período de observação, tamanho da amostra e o que aconteceu com solicitações expiradas ou falhas. Excluir todas as falhas pode fazer a performance parecer mais saudável do que realmente é. Compare cargas de trabalho semelhantes e inspecione o comportamento de primeiro uso separadamente do trabalho repetido que se beneficia de cache. Use [Metrics](../quality/metrics.md) para combinar medições de tempo com sucesso e confiabilidade, em vez de recompensar apenas velocidade.

{{< steps >}}
{{< step title="Definir a experiência" >}}
Escolha um intervalo como conteúdo útil inicial ou conclusão de tarefa confirmada, e concorde o que espera tempo aceitável para essa tarefa.
{{< /step >}}
{{< step title="Medir a rota completa" >}}
Capture os tempos das etapas junto com a duração total, falhas e categorias de solicitação. Identifique qual etapa causa os casos lentos.
{{< /step >}}
{{< step title="Testar uma melhoria" >}}
Experimente uma solicitação focada, buscas paralelas elegíveis ou streaming. Verifique a precisão da tarefa e a carga downstream, além da velocidade.
{{< /step >}}
{{< step title="Observar o uso real" >}}
Compare p50 e p95 após um lançamento limitado. Mantenha a configuração anterior disponível se a confiabilidade ou segurança piorar.
{{< /step >}}
{{< /steps >}}

Um indicador de “digitando…” é um reconhecimento útil, não substituto de progresso. Prefira mensagens verdadeiras como “O serviço de pedidos está demorando mais que o habitual” quando esse estado for conhecido. Não invente um percentual concluído ou um tempo de conclusão. Para trabalhos mais longos, permita cancelamento quando suportado e explique se interromper a espera não puder desfazer uma ação já executada.

Próximo passo: torne as mudanças de desempenho rastreáveis e reversíveis com [Versioning prompts, agents and knowledge](versioning.md).

{{< quiz options="Streamar uma aprovação antes que a verificação de elegibilidade termine | Medir apenas solicitações bem‑sucedidas e ignorar timeouts | Executar consultas autorizadas e independentes em paralelo e medir o tempo total de conclusão | Dar a cada ferramenta tempo de espera ilimitado" answer="3" explanation="Consultas independentes podem se sobrepor com segurança quando suas entradas e permissões já estão prontas. Medir o tempo de conclusão verifica o benefício; aprovações, ações dependentes e relatórios de falha ainda precisam de suas salvaguardas normais." >}}
Qual mudança pode reduzir a espera sem pular verificações necessárias?
{{< /quiz >}}
