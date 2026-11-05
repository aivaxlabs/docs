---
{title: Desempenho e latência,linkTitle: Desempenho e latência,description: "Identifique onde um agente gasta tempo e torne as esperas mais curtas, claras e previsíveis, sem comprometer a correção.",weight: 20,duration: 12,objectives: [Separe o tempo de primeira resposta do tempo total de conclusão da tarefa.,"Identificar atrasos na recuperação, no modelo e nas ferramentas em um fluxo de trabalho de agente.",Escolha oportunidades seguras para streaming e trabalho paralelo.,Meça experiências típicas e lentas usando percentis de latência.],sourceHash: bb6846dfec5f002f}
---

Uma recepcionista que diz “Estou verificando sua reserva” tem uma sensação diferente de uma linha telefônica silenciosa. Ambos os chamadores podem esperar o mesmo tempo pela confirmação da reserva, mas um sabe que o pedido foi compreendido. Um bom agente precisa de ambos os tipos de desempenho: trabalho que é concluído prontamente e uma experiência que torna qualquer espera necessária compreensível.

**Latência** é o tempo entre um evento e sua resposta. Para um agente, isso pode significar o tempo desde o envio de uma pergunta até ver a primeira palavra, ou o tempo até que uma ação solicitada seja confirmada. Sempre indique qual intervalo você está medindo. Uma saudação rápida não prova que uma consulta de pedido ou correção de conta foi concluída rapidamente.

## Siga o pedido por toda a sua jornada

Considere um cliente perguntando se um item entregue pode ser trocado. O aplicativo recebe a mensagem, verifica o acesso, pesquisa uma política, consulta o pedido, pede ao modelo para interpretar os resultados e envia a resposta. Um fluxo de trabalho real pode retornar a várias etapas. Se o modelo solicitar outra ferramenta, pode haver outra rodada de leitura e resposta.

**Recuperação (Retrieval)** é encontrar informações relevantes em uma fonte de conhecimento. Pode incluir pesquisar documentos e classificar os resultados por relevância. O **primeiro token** é a pequena parte inicial de texto emitida pelo modelo. Antes disso aparecer, o provedor pode colocar a solicitação em fila e processar sua entrada. **Geração** é a produção subsequente da resposta. **Ferramentas (Tools)** são capacidades externas, como uma verificação de estoque ou consulta de pedido, com seus próprios tempos de espera.

{{< flow "Receber e verificar acesso | Recuperar política | Consultar pedido | Gerar resposta | Entregar resposta" >}}

Este fluxo mostra uma sequência simples, não um requisito de que cada etapa seja executada separadamente. Instrumente cada limite real: registre quando começa, termina ou falha. **Instrumentação** significa adicionar medições ao aplicativo, como colocar relógios em estações ao longo de uma rota de entrega. Inclua a viagem de rede, a espera por um trabalhador disponível e a preparação da resposta; caso contrário, o tempo perdido pode ser confundido com uma geração lenta do modelo.

{{< chart type="donut" title="Onde uma solicitação gasta seu tempo (ilustrativo)" unit="%" data=`[{"label":"Recuperação","value":18},{"label":"Espera pelo primeiro token do modelo","value":32},{"label":"Gerando a resposta","value":25},{"label":"Ferramentas","value":20},{"label":"Outro trabalho do aplicativo","value":5}]` caption="Partes ilustrativas para uma solicitação serial, não uma referência. O trabalho sobreposto não pode ser simplesmente somado como partes separadas do tempo decorrido." >}}

A fatia maior é um ponto de partida para investigação, não prova da correção correta. Um serviço de pedidos pode estar lento apenas durante um período de pico; a geração pode dominar apenas quando o agente escreve respostas desnecessariamente longas. Agrupe as medições por tarefa e resultado. Combinar uma resposta breve de política com um relatório detalhado esconde diferenças úteis.

## Mostre texto útil mais cedo com streaming

**Streaming** envia uma resposta em pedaços conforme ela é gerada, em vez de reter toda a resposta até o final. Um leitor pode começar a ler uma explicação enquanto frases posteriores ainda estão chegando. Isso muitas vezes melhora a responsividade percebida, mas não necessariamente reduz o tempo necessário para concluir a resposta ou completar uma ação externa.

Meça o **tempo até o primeiro token** desde a solicitação do modelo até seu primeiro texto emitido e meça separadamente o tempo desde o envio do usuário até o primeiro conteúdo visível útil. Esses valores nem sempre são iguais. A recuperação pode acontecer primeiro, e um aplicativo ou intermediário de rede pode reter pedaços antes de exibi-los. Teste a experiência através do canal real do cliente, não apenas no console de um desenvolvedor.

O streaming não é adequado para todas as saídas. Um aplicativo que espera um registro estruturado completo pode precisar aguardar até que todo o registro seja válido. Conteúdo sensível à segurança pode exigir verificação antes da exibição. Uma frase parcial que soa como uma aprovação de reembolso não deve aparecer antes que a autorização seja confirmada. Se houver interrupção, marque claramente uma resposta incompleta em vez de apresentá-la como concluída.

{{< compare >}}
{{< side title="Parece rápido, mas é enganoso" tone="bad" >}}
“Sua troca foi aprovada” aparece imediatamente enquanto a verificação do pedido ainda está sendo executada. Uma recusa posterior contradiz a primeira mensagem e danifica a confiança.
{{< /side >}}
{{< side title="Responsivo e preciso" tone="good" >}}
“Estou verificando o pedido e a política de troca” aparece enquanto essas etapas são executadas. A aprovação só aparece após a conclusão das verificações necessárias.
{{< /side >}}
{{< /compare >}}

## Encurte o trabalho que deve acontecer

Um modelo menor ou mais rápido pode lidar com uma etapa direta, como classificar um ticket de entrada, enquanto uma etapa mais exigente recebe um modelo que atende às suas necessidades de qualidade. Menor não garante velocidade sob todas as cargas de trabalho: filas, capacidade do provedor, tamanho da entrada e comprimento da saída são fatores importantes. Compare candidatos nas mesmas tarefas antes de direcionar usuários reais a eles.

Mantenha as solicitações focadas. Enviar documentos irrelevantes aumenta o trabalho de leitura, enquanto pedir uma redação quando o cliente precisa de uma data de entrega aumenta o trabalho de geração. Remova pesquisas repetidas desnecessárias e chamadas de ferramentas. Preserve o contexto necessário para decisões corretas e compare a taxa de perguntas de acompanhamento: uma resposta mais curta não é um ganho se todos tiverem que perguntar novamente.

**Trabalho paralelo** significa executar operações independentes ao mesmo tempo. Verificar uma política de envio pública e buscar um registro de pedido autorizado pode ser independente após as verificações de acesso necessárias. Quando ambos começam juntos, a espera combinada é mais próxima da operação mais lenta do que da soma de ambas. Isso é como pedir a dois colegas para verificar pastas diferentes em vez de pedir a um colega para fazer ambas as coisas em sequência.

Não paralelize etapas que dependem umas das outras. Um reembolso deve aguardar a aprovação, e uma consulta de pedido pode exigir uma verificação de identidade do cliente primeiro. Solicitações simultâneas também podem sobrecarregar um serviço downstream ou aumentar o custo. Defina um limite para o trabalho concorrente, significando quantas operações podem ser executadas ao mesmo tempo, e garanta que cada operação tenha as permissões de que precisa.

{{< cards >}}
{{< card title="Consultas independentes" icon="database" >}}
Considere a execução paralela quando ambas as solicitações já têm entradas válidas e nenhuma altera o que a outra deve fazer.
{{< /card >}}
{{< card title="Ações dependentes" icon="lock" >}}
Mantenha a ordem necessária: verifique a identidade, verifique a elegibilidade, obtenha a aprovação e, em seguida, execute a ação autorizada.
{{< /card >}}
{{< card title="Geração focada" icon="chat" >}}
Forneça ao modelo contexto relevante e um comprimento de resposta apropriado. A brevidade ainda deve responder à pergunta real.
{{< /card >}}
{{< /cards >}}

Relacionado: sobre o AIVAX, escolhas reutilizáveis sobre um modelo, conhecimento e ferramentas são armazenadas em um [gateway de IA](../../docs/inference/ai-gateways/concepts.md). Trate qualquer alteração de configuração como algo a ser medido, não como uma promessa de que cada conversa se tornará mais rápida.

## Limite a espera e lide com falhas honestamente

Um **timeout (tempo limite)** é um limite para quanto tempo uma operação pode esperar. Dê limites sensíveis a ferramentas individuais dentro de um prazo geral para a tarefa. Sem um prazo geral, vários retries (tentativas) podem atender cada um ao seu próprio limite enquanto o usuário espera muito tempo. Um **retry (tentativa)** repete uma tentativa falhada; um **fallback (plano B)** usa uma rota alternativa quando a rota preferida não está disponível.

Um timeout nem sempre significa que nada aconteceu. Um pagamento ou criação de ticket pode ter sido bem-sucedido mesmo que sua confirmação tenha sido perdida. Verifique seu status antes de tentar a ação novamente, usando controles de prevenção de duplicidade onde disponíveis. Ofereça um próximo passo seguro quando você não puder estabelecer o resultado. [Erros, tentativas e planos B](../advanced-agents/errors-retries-and-fallbacks.md) explica como evitar transformar um atraso em efeitos colaterais repetidos.

## Meça a experiência comum e a lenta

Um **percentil** descreve onde um valor cai em um conjunto ordenado de medições. **p50**, a mediana, é o ponto em ou abaixo do qual metade das solicitações medidas cai. **p95** é o ponto em ou abaixo do qual 95% caem; as solicitações restantes são mais lentas. Essas medidas distinguem uma experiência normal de uma lenta melhor do que uma única média pode.

Relate o período de observação, o tamanho da amostra e o que aconteceu com as solicitações com timeout ou falhas. Excluir todas as falhas pode fazer com que o desempenho pareça mais saudável do que é. Compare cargas de trabalho semelhantes e inspecione o comportamento de primeiro uso separadamente do trabalho repetido que se beneficia do cache. Use [Métricas](../quality/metrics.md) para combinar medições de tempo com sucesso e confiabilidade, em vez de recompensar apenas a velocidade.

{{< steps >}}
{{< step title="Defina a experiência" >}}
Escolha um intervalo, como o primeiro conteúdo útil ou a conclusão confirmada da tarefa, e concorde sobre o que significa uma espera aceitável para essa tarefa.
{{< /step >}}
{{< step title="Meça a rota completa" >}}
Capture os tempos das etapas junto com a duração total, falhas e categorias de solicitação. Encontre qual etapa causa casos lentos.
{{< /step >}}
{{< step title="Teste uma melhoria" >}}
Tente uma solicitação focada, consultas paralelas elegíveis ou streaming. Verifique a precisão da tarefa e a carga downstream, bem como a velocidade.
{{< /step >}}
{{< step title="Observe o uso real" >}}
Compare p50 e p95 após uma implantação limitada. Mantenha a configuração anterior disponível se a confiabilidade ou a segurança piorarem.
{{< /step >}}
{{< /steps >}}

Um indicador de “digitando…” é um reconhecimento útil, não um substituto para o progresso. Prefira mensagens verdadeiras, como “O serviço de pedidos está demorando mais do que o habitual”, quando esse estado for conhecido. Não invente uma porcentagem de conclusão ou um tempo de conclusão. Para trabalhos mais longos, permita o cancelamento onde suportado e explique se parar a espera não pode desfazer uma ação já realizada.

Próximos passos: torne as alterações de desempenho rastreáveis e reversíveis com [Versionamento de prompts, agentes e conhecimento](versioning.md).

{{< quiz options="Transmitir uma aprovação antes que a verificação de elegibilidade termine | Medir apenas solicitações bem-sucedidas e ignorar timeouts | Executar consultas autorizadas e independentes em paralelo e medir o tempo total de conclusão | Dar a cada ferramenta tempo de espera ilimitado" answer="3" explanation="Consultas independentes podem se sobrepor com segurança quando suas entradas e permissões estão prontas. Medir o tempo de conclusão verifica o benefício; aprovações, ações dependentes e relatórios de falhas ainda precisam de suas salvaguardas normais." >}}
Qual mudança pode reduzir a espera sem pular as verificações necessárias?
{{< /quiz >}}
