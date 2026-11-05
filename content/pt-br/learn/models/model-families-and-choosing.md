---
{title: Famílias de modelos e como escolher,linkTitle: Famílias de modelos,description: "Escolha um modelo correspondendo suas capacidades, tempo de resposta, custo operacional e qualidade ao trabalho que precisa ser realizado.",weight: 10,duration: 12,objectives: ["Diferencie as categorias de tamanho, opções de hospedagem e capacidades especializadas dos modelos.","Explique a compensação entre qualidade, latência e custo.",Selecione candidatos com base nos requisitos de uma tarefa real.,Compare os candidatos com perguntas retiradas do seu próprio trabalho.],sourceHash: 630faa47c1de938e}
---

Escolher um modelo de IA é como atribuir trabalho a um colega. Você não enviaria todas as mensagens curtas dos clientes ao seu especialista mais experiente, nem pediría a um recepcionista para aprovar um contrato complexo. A pergunta útil não é “Qual modelo é mais poderoso?”, mas sim “Qual modelo pode realizar este trabalho de forma confiável, dentro do tempo e do orçamento disponíveis?”

Um **modelo** é um sistema treinado que transforma uma entrada, como uma pergunta ou uma imagem, em uma saída. Uma **família de modelos** é um grupo relacionado de modelos, frequentemente oferecido em diferentes tamanhos ou com diferentes capacidades. Os nomes das famílias são rótulos convenientes, não prova de que todos os membros se comportam da mesma maneira. Teste a versão específica que você pretende usar.

## O tamanho é um ponto de partida, não um veredito

As pessoas frequentemente descrevem os modelos como pequenos, médios ou grandes. Essas são categorias relativas, em vez de uma medida padrão da indústria. Os rótulos geralmente refletem a escala do modelo e os recursos necessários para executá-lo. Novas técnicas de treinamento podem tornar um modelo pequeno mais recente mais eficaz em uma tarefa do que um modelo grande mais antigo.

{{< cards >}}
{{< card title="Pequeno" icon="rocket" >}}
Um bom ponto de partida para trabalhos estreitos e repetitivos: classificar mensagens, extrair uma data ou reescrever uma resposta curta. Verifique o tratamento de casos incomuns.
{{< /card >}}
{{< card title="Médio" icon="cpu" >}}
Uma opção para conversas mais amplas e instruções com várias condições. Pode oferecer flexibilidade suficiente sem a sobrecarga de um modelo maior.
{{< /card >}}
{{< card title="Grande" icon="compass" >}}
Uma opção para interpretações difíceis e tarefas que envolvem vários requisitos interagentes. Sua capacidade adicional só importa se seus testes mostrarem um benefício.
{{< /card >}}
{{< /cards >}}

O tamanho sozinho não diz se um modelo pode ler imagens, chamar uma ferramenta de negócios ou seguir um formato de saída. Um modelo apenas de texto, por maior que seja, não pode inspecionar uma fotografia simplesmente porque é grande. Da mesma forma, um modelo que escreve copies de vendas elegantes pode extrair campos de faturas de forma menos confiável do que um modelo menor selecionado especificamente para essa tarefa.

Considere também as consequências de um erro, além da dificuldade. Classificar mensagens recebidas em tópicos amplos é fácil de corrigir. Interpretar mal um prazo de cancelamento pode causar uma perda financeira. Trabalhos de alto impacto precisam de verificação e limites claros de autoridade, independentemente do tamanho do modelo; comprar mais capacidade não substitui esses controles.

## Open-weight (pesos abertos) e hospedados descrevem escolhas diferentes

**Pesos** são os valores numéricos aprendidos durante o treinamento. Um modelo **open-weight** (pesos abertos) disponibiliza esses valores sob uma licença, potencialmente permitindo que uma organização o execute em sua própria infraestrutura. A licença ainda precisa ser verificada: a disponibilidade dos pesos não significa automaticamente uso comercial irrestrito ou acesso a todos os materiais de treinamento.

Um modelo **hospedado** executa na infraestrutura operada por um provedor de serviços. Você envia solicitações e recebe resultados, em vez de manter os computadores que executam o modelo. Serviços hospedados podem oferecer modelos open-weight, bem como modelos cujos pesos não são distribuídos. Portanto, “open-weight versus hospedado” não é uma distinção limpa de “ou isto ou aquilo”: um descreve o acesso ao modelo, o outro descreve como você o opera.

Executar um modelo por conta própria pode fornecer controle sobre a implantação e o manuseio de dados, mas traz responsabilidade por hardware, segurança, atualizações, capacidade e interrupções. Um serviço hospedado reduz esse trabalho operacional, mas suas políticas de dados, localização, disponibilidade e recursos suportados ainda precisam ser revisados. Nenhuma escolha é automaticamente mais barata ou mais privada em todas as situações. Compare o arranjo operacional completo, não apenas o download de um modelo ou o preço de uma solicitação.

## De propósito geral ou especializado?

Um **modelo de propósito geral** lida com uma ampla gama de tarefas, como conversa, resumo e redação. Um **modelo especializado** foca em um trabalho específico ou em um tipo particular de entrada. A especialização pode alterar tanto a qualidade do resultado quanto a forma da saída.

Modelos focados em código ajudam a criar ou interpretar software. Modelos com capacidade visual interpretam imagens. Modelos de fala convertem áudio em palavras ou palavras em áudio. Um **modelo de embedding** converte conteúdo em representações numéricas usadas para encontrar material semelhante; ele não substitui um escritor de respostas conversacionais. Um serviço pode combinar vários desses sistemas enquanto apresenta um único assistente ao usuário.

Antes de comparar a qualidade da escrita, elimine os candidatos que não podem realizar a operação necessária. O fluxo de trabalho requer fotografias? O modelo deve solicitar ações por meio de ferramentas? Ele precisa retornar campos que o software possa ler? Ele entende os idiomas dos seus clientes? Uma capacidade ausente não é algo que se resolva aumentando a configuração de criatividade.

## O triângulo qualidade–latência–custo

**Qualidade** significa atender aos requisitos da tarefa, não apenas soar polido. **Latência** significa o tempo que um usuário espera por uma resposta. **Custo** inclui o uso do modelo e qualquer trabalho adjacente, como busca de documentos, novas tentativas e revisão humana. Esses fatores interagem: uma resposta barata que precisa ser corrigida repetidamente pode custar mais no geral do que uma primeira tentativa mais robusta.

{{< chart type="bar" title="Custo relativo de processamento ilustrativo por nível" unit="unidades de custo" data=`[{"label":"Candidato pequeno","value":1},{"label":"Candidato médio","value":3},{"label":"Candidato grande","value":7}]` caption="Valores didáticos inventados, não preços ou uma relação universal. O custo real depende do modelo, da hospedagem, do comprimento da entrada, do comprimento da saída e da carga de trabalho." >}}

O triângulo é uma ferramenta de decisão, não uma lei que diga que a melhoria sempre custa mais. Um especialista bem ajustado pode melhorar tanto a velocidade quanto a qualidade. Entradas mais curtas, instruções mais claras ou documentos de origem melhores podem ajudar sem mudar os modelos. Meça todo o fluxo de trabalho antes de assumir que o modelo em si é o gargalo.

Um assistente de voz ao vivo tem pouco espaço para longas pausas. Um relatório noturno pode tolerar mais espera se o resultado for melhor. Uma fila de back-office que lida com muitos registros semelhantes pode valorizar um custo operacional previsível. Anote essas necessidades antes de testar, para que uma demonstração impressionante não altere silenciosamente os critérios de aceitação.

## Um procedimento de seleção repetível

{{< steps >}}
{{< step title="Defina um resultado aceitável" >}}
Descreva o trabalho, as evidências necessárias, o formato, os idiomas e os erros inaceitáveis. Decida quais ações ainda exigem uma pessoa.
{{< /step >}}
{{< step title="Filtre por capacidade e política" >}}
Verifique o suporte a mídia, ferramentas, manuseio de dados e limites práticos de entrada. Remova opções incompatíveis antes de comparar sua prosa.
{{< /step >}}
{{< step title="Comece com um candidato modesto" >}}
Tente um modelo pequeno ou médio que atenda aos requisitos. Adicione um candidato mais capaz quando a tarefa ou as falhas observadas justificarem.
{{< /step >}}
{{< step title="Teste o mesmo trabalho" >}}
Use as mesmas perguntas, documentos de origem e regras de pontuação para cada candidato. Registre a correção, o tempo de espera e o trabalho total necessário.
{{< /step >}}
{{< step title="Escolha e continue verificando" >}}
Selecione o arranjo menos custoso que atenda aos requisitos de qualidade e tempo. Verifique novamente após alterar modelos, instruções ou políticas de negócios.
{{< /step >}}
{{< /steps >}}

Use exemplos de trabalho real, com informações privadas removidas ou substituídas. Inclua solicitações comuns, solicitações vagas, informações ausentes, instruções conflitantes e casos que devem ser entregues a uma pessoa. Reserve alguns exemplos para a comparação final, em vez de ajustar repetidamente o prompt para todo o conjunto de testes. Caso contrário, você pode aprender a passar nos exemplos, em vez de servir novos clientes.

Pontue o resultado antes de olhar qual modelo o produziu, quando possível. Para suporte, verifique se a resposta segue a política atual e evita promessas inventadas. Para extração, compare cada campo necessário com a fonte. Para redação, peça a um editor para julgar se o texto é utilizável. Repita casos importantes, pois uma resposta bem-sucedida não estabelece confiabilidade.

## Combine a recomendação à tarefa

{{< tabs >}}
{{< tab title="Triagem de suporte" >}}
Comece com um candidato pequeno para atribuir mensagens a uma lista fixa de equipes. Teste mensagens com tópicos mistos e forneça uma rota de “inclaro” em vez de forçar uma categoria confiante.
{{< /tab >}}
{{< tab title="Redação de vendas" >}}
Tente um candidato de propósito geral com fatos aprovados do produto e um público-alvo claro. Compare o esforço de edição, não apenas o quão entusiasta parece o primeiro rascunho.
{{< /tab >}}
{{< tab title="Conselho interno complexo" >}}
Compare candidatos mais fortes usando os mesmos documentos de origem e processo de revisão. Exija evidências e escalonamento quando os documentos não resolverem a questão.
{{< /tab >}}
{{< /tabs >}}

Na AIVAX, escolhas de modelos reutilizáveis e instruções podem ser gerenciadas por meio de um [gateway de IA](../../docs/inference/ai-gateways/concepts.md). Relacionado: o [guia de inferência](../../docs/inference/chat-completions/concepts.md) descreve solicitações diretas de modelos e opções suportadas. Trate a configuração como parte do sistema testado: alterar o modelo por trás de um nome de assistente estável ainda pode alterar seu comportamento.

Próximos passos: aprenda como os [parâmetros](parameters.md) ajustam o comportamento do modelo que você selecionou.

{{< quiz options="Escolha o modelo maior para cada solicitação | Escolha o candidato que atenda aos requisitos de qualidade, tempo e política da sua tarefa em testes representativos | Escolha o modelo com a demonstração mais polida | Escolha apenas com base na disponibilidade de seus pesos" answer="2" explanation="A seleção de modelos é uma comparação específica da tarefa. Capacidade, confiabilidade, latência, custo operacional e requisitos de política são mais importantes do que o tamanho ou uma única resposta impressionante." >}}
Uma equipe de suporte precisa classificar mensagens de forma confiável sem fazer os clientes esperarem. Como ela deve escolher um modelo?
{{< /quiz >}}
