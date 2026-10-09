Source: https://docs.aivax.net/pt-br/learn/models/model-families-and-choosing.html

Escolher um modelo de IA é como atribuir trabalho a um colega. Você não enviaria toda mensagem curta de cliente ao seu especialista mais experiente, nem pediria a um recepcionista que aprovasse um contrato complicado. A pergunta útil não é “Qual modelo é o mais poderoso?” mas “Qual modelo pode fazer este trabalho de forma confiável, dentro do tempo e orçamento disponíveis?”

Um **modelo** é um sistema treinado que transforma uma entrada, como uma pergunta ou imagem, em uma saída. Uma **família de modelo** é um grupo relacionado de modelos, frequentemente oferecido em tamanhos diferentes ou com capacidades distintas. Os nomes das famílias são rótulos convenientes, não prova de que todos os membros se comportam da mesma forma. Teste a versão específica que pretende usar.

## Tamanho é um ponto de partida, não um veredicto

As pessoas costumam descrever os modelos como pequeno, médio ou grande. Essas são categorias relativas, não uma medida da indústria. Os rótulos geralmente refletem a escala do modelo e os recursos necessários para executá-lo. Novas técnicas de treinamento podem tornar um modelo pequeno mais recente mais eficaz em uma tarefa do que um modelo grande mais antigo.


- **Pequeno** — Um ponto de partida útil para trabalho estreito e repetitivo: classificar mensagens, extrair uma data ou reescrever uma resposta curta. Verifique como lida com casos incomuns.

- **Médio** — Um candidato para conversas mais amplas e instruções com várias condições. Pode oferecer flexibilidade suficiente sem a sobrecarga de um modelo maior.

- **Grande** — Um candidato para interpretação difícil e tarefas que envolvem vários requisitos interativos. Sua capacidade adicional só importa se seus testes demonstrarem um benefício.




O tamanho sozinho não indica se um modelo pode ler imagens, chamar uma ferramenta de negócios ou seguir um formato de saída. Um modelo grande apenas de texto não pode inspecionar uma fotografia simplesmente porque é grande. Da mesma forma, um modelo que escreve textos de vendas elegantes pode extrair campos de fatura com menos confiabilidade do que um modelo menor escolhido para essa tarefa.

Considere as consequências de um erro assim como a dificuldade. Classificar mensagens recebidas em tópicos amplos é fácil de corrigir. Interpretar erroneamente um prazo de cancelamento pode causar uma perda financeira. Trabalhos de alto impacto precisam de verificação e limites de autoridade claros, independentemente do tamanho do modelo; adquirir mais capacidade não substitui esses controles.

## Peso aberto e hospedado descrevem escolhas diferentes

**Pesos** são os valores numéricos aprendidos durante o treinamento. Um modelo **open-weight** disponibiliza esses valores sob uma licença, potencialmente permitindo que uma organização o execute em sua própria infraestrutura. A licença ainda precisa ser verificada: a disponibilidade dos pesos não significa automaticamente uso comercial irrestrito ou acesso a todo o material de treinamento.

Um modelo **hosted** roda em infraestrutura operada por um provedor de serviço. Você envia solicitações e recebe resultados ao invés de manter os computadores que executam o modelo. Serviços hospedados podem oferecer modelos de peso aberto assim como modelos cujos pesos não são distribuídos. “Open-weight versus hosted” não é, portanto, uma distinção clara de um ou outro: um descreve o acesso ao modelo, o outro descreve como você o opera.

Executar um modelo por conta própria pode proporcionar controle sobre implantação e manipulação de dados, mas traz responsabilidade por hardware, segurança, atualizações, capacidade e interrupções. Um serviço hospedado reduz esse trabalho operacional, mas suas políticas de dados, localização, disponibilidade e recursos suportados ainda precisam ser revisados. Nenhuma escolha é automaticamente mais barata ou mais privada em todas as situações. Compare o arranjo operacional completo, não apenas o download do modelo ou o preço por solicitação.

## Uso geral ou especializado?

Um **modelo de uso geral** lida com uma ampla variedade de tarefas, como conversa, sumarização e redação. Um **modelo especializado** foca em um trabalho específico ou em um tipo particular de entrada. A especialização pode mudar tanto a qualidade do resultado quanto a forma da saída.

Modelos focados em código ajudam a criar ou interpretar software. Modelos com capacidade de visão interpretam imagens. Modelos de fala transformam áudio em palavras ou palavras em áudio. Um **modelo de embedding** converte conteúdo em representações numéricas usadas para encontrar material similar; não é substituto de um escritor de respostas conversacionais. Um serviço pode combinar vários desses sistemas enquanto apresenta um único assistente ao usuário.

Antes de comparar a qualidade da escrita, elimine candidatos que não podem executar a operação requerida. O fluxo de trabalho requer fotografias? O modelo deve solicitar ações através de ferramentas? Ele precisa retornar campos que o software possa ler? Ele entende os idiomas dos seus clientes? Uma capacidade ausente não é algo a ser resolvido aumentando a configuração de criatividade.

## O triângulo qualidade‑latência‑custo

**Qualidade** significa atender aos requisitos da tarefa, não apenas soar polido. **Latência** significa quanto tempo o usuário espera por uma resposta. **Custo** inclui o uso do modelo e quaisquer trabalhos auxiliares, como busca de documentos, tentativas repetidas e revisão humana. Esses fatores interagem: uma resposta barata que precisa de correções recorrentes pode custar mais no total do que uma tentativa inicial mais forte.


**Custo relativo ilustrativo de processamento por nível**

| Item | Value |
| --- | --- |
| Candidato pequeno | 1unidades de custo |
| Candidato médio | 3unidades de custo |
| Candidato grande | 7unidades de custo |

Valores de ensino inventados, não preços ou relação universal. O custo real depende do modelo, hospedagem, comprimento da entrada, comprimento da saída e carga de trabalho.



O triângulo é uma ajuda de decisão, não uma lei que diz que a melhoria sempre custa mais. Um especialista bem adequado pode melhorar tanto a velocidade quanto a qualidade. Entradas mais curtas, instruções mais claras ou documentos de origem melhores podem ajudar sem mudar os modelos. Meça todo o fluxo de trabalho antes de assumir que o modelo em si é o gargalo.

Um assistente de voz ao vivo tem pouca margem para longas pausas. Um relatório noturno pode tolerar mais espera se o resultado for melhor. Uma fila de back-office que lida com muitos registros semelhantes pode valorizar um custo operacional previsível. Anote essas necessidades antes de testar, para que uma demonstração impressionante não altere silenciosamente os critérios de aceitação.

## Um procedimento de seleção repetível


1. **Definir um resultado aceitável**

Descreva o trabalho, evidências necessárias, formato, idiomas e erros inaceitáveis. Decida quais ações ainda requerem uma pessoa.


2. **Filtrar por capacidade e política**

Verifique suporte a mídia, ferramentas, manipulação de dados e limites práticos de entrada. Remova opções incompatíveis antes de comparar seus textos.


3. **Começar com um candidato modesto**

Experimente um modelo pequeno ou médio que atenda aos requisitos. Adicione um candidato mais capaz quando a tarefa ou falhas observadas justificarem.


4. **Testar o mesmo trabalho**

Use as mesmas perguntas, documentos de origem e regras de pontuação para cada candidato. Registre a correção, tempo de espera e trabalho total necessário.


5. **Escolher e continuar verificando**

Selecione o arranjo menos custoso que atenda aos requisitos de qualidade e tempo. Reavalie após mudar modelos, instruções ou políticas de negócios.





Use exemplos de trabalho real, com informações privadas removidas ou substituídas. Inclua solicitações ordinárias, solicitações vagas, informações ausentes, instruções conflitantes e casos que devem ser encaminhados a uma pessoa. Reserve alguns exemplos para a comparação final ao invés de ajustar repetidamente o prompt para todo o conjunto de teste. Caso contrário, você pode aprender a passar nos exemplos em vez de atender novos clientes.

Avalie o resultado antes de observar qual modelo o produziu, quando prático. Para suporte, verifique se a resposta segue a política atual e evita promessas inventadas. Para extração, compare cada campo exigido com a fonte. Para redação, peça a um editor que julgue se o texto é utilizável. Repita casos importantes porque uma resposta bem-sucedida não estabelece confiabilidade.

## Combine a recomendação à tarefa


**Triagem de suporte**

Comece com um candidato pequeno para atribuir mensagens a uma lista fixa de equipes. Teste mensagens com tópicos mistos e forneça uma rota “incerta” ao invés de forçar uma categoria confiante.


**Redação de vendas**

Experimente um candidato de uso geral com fatos de produto aprovados e um público claro. Compare o esforço de edição, não apenas o quão entusiasmado o primeiro rascunho soa.


**Conselho interno complexo**

Compare candidatos mais fortes usando os mesmos documentos de origem e processo de revisão. Exija evidência e escalonamento quando os documentos não resolverem a questão.





No AIVAX, escolhas reutilizáveis de modelo e instruções podem ser gerenciadas através de um [AI gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md). Relacionado: o [guia de inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md) descreve solicitações diretas ao modelo e opções suportadas. Considere a configuração como parte do sistema testado: mudar o modelo por trás de um nome de assistente estável ainda pode mudar seu comportamento.

Próximo passo: aprenda como [parâmetros](https://docs.aivax.net/pt-br/learn/models/parameters.md) ajustam o comportamento do modelo que você selecionou.

**Verifique seu conhecimento.** Uma equipe de suporte precisa classificar mensagens de forma confiável sem fazer os clientes esperarem. Como ela deve escolher um modelo?

1. Escolha o maior modelo para cada solicitação
2. Escolha o candidato que atenda aos requisitos de qualidade, tempo e política da sua tarefa em testes representativos
3. Escolha o modelo com a demonstração mais polida
4. Escolha apenas com base na disponibilidade de seus pesos

Answer: option 2. A seleção de modelo é uma comparação específica da tarefa. Capacidade, confiabilidade, latência, custo operacional e requisitos de política são mais importantes que tamanho ou uma única resposta impressionante.
