Source: http://localhost:1313/pt-br/learn/quality/metrics.html

A **métrica** é uma medida definida consistentemente usada para entender o desempenho. Para um agente, “bom” tem vários significados: dar uma resposta correta, concluir o trabalho rapidamente, usar recursos de forma responsável e ajudar a pessoa que solicitou. Essas qualidades podem se mover em direções diferentes. Uma resposta mais curta pode chegar mais rápido, mas deixar de fora uma condição crucial. Uma conversa mais longa pode custar mais e ainda prevenir um erro caro.

Pense em operar um serviço de entrega. O horário de chegada importa, mas entregar o pacote errado rapidamente não é sucesso. Da mesma forma, um painel de agente não deve celebrar a velocidade enquanto ignora a correção. Comece com a tarefa para a qual o agente existe, decida como a conclusão bem‑sucedida se parece e, em seguida, selecione as medições. Um **dashboard** é simplesmente uma visualização compartilhada dessas medições ao longo de um período declarado.

## Entenda as quatro perspectivas

- **Precisão** — O agente fornece a informação correta e completa a tarefa exigida sob as regras declaradas? Avalie contra expectativas verificadas.

- **Latência** — Quanto tempo a pessoa espera? Meça um intervalo claramente definido, como enviar uma mensagem até receber uma resposta completa.

- **Custo** — Quais recursos são consumidos para entregar o resultado? Inclua tentativas falhas, serviços conectados e trabalho humano quando relevante.

- **Satisfação** — Quão útil e compreensível foi a experiência para a pessoa que a utilizou? Colete feedback, reconhecendo quem não respondeu.

**Precisão** precisa de uma definição que se ajuste à tarefa. Para extrair campos de fatura, compare cada campo obrigatório com uma referência verificada. Para suporte, revise se a resposta segue a política e aborda a pergunta. Para um agente de reserva, verifique a reserva e a confirmação necessária. Uma medida comum é a proporção de casos avaliados que atendem a todos os critérios exigidos. Sempre indique quais casos foram avaliados e o que contou como aprovação.

Não confunda precisão com confiança na escrita. Nem deve comparar duas pontuações calculadas com regras diferentes. Um agente avaliado apenas pela formulação factual tem um teste mais fácil do que um avaliado por formulação, permissões e ações concluídas. Use [testing and evaluating agents](http://localhost:1313/pt-br/learn/quality/testing-and-evaluating-agents.md) para estabelecer uma lista de verificação estável. Relate falhas graves separadamente, mesmo que a taxa geral de aprovação seja alta.

**Latência** significa tempo de espera decorrido. Meça onde o usuário a experimenta, não apenas dentro do modelo. O atraso total pode incluir busca de documentos, contato com um sistema empresarial e novas tentativas de uma solicitação falha. Se o texto aparecer gradualmente, diferencie o tempo até o primeiro texto visível do tempo até uma resposta completa e útil. Começar rápido pode tranquilizar alguém, mas um “Concluído” prematuro nunca deve implicar que uma ação inacabada teve sucesso.

**Custo** deve descrever um resultado, não apenas uma única resposta do modelo. Uma solicitação barata que requer tentativas repetidas e correção humana pode ser cara no total. Acompanhe o custo operacional total e o custo por tarefa concluída, com definição clara de conclusão. Declare se o cálculo inclui busca de documentos, ferramentas, avaliação, armazenamento e revisão humana. Mantenha as categorias visíveis para que uma mudança na contabilidade não seja confundida com uma mudança na eficiência.

**Satisfação** é a avaliação do usuário sobre a experiência. Uma classificação curta ou pergunta como “Isso resolveu seu problema?” pode ajudar, assim como revisar reclamações e contatos de acompanhamento. Satisfação não substitui correção: um usuário pode gostar de uma resposta errada, ou discordar de uma recusa correta. Registre quantas pessoas foram convidadas a responder e quantas realmente responderam; usuários silenciosos não podem ser automaticamente contados como satisfeitos.

## Leia percentis como posições em uma fila

Uma média combina todas as medições em um único número, o que pode esconder experiências incomumente lentas. Um **percentil** descreve uma posição quando as medições são organizadas do menor para o maior. **p50**, também chamado de mediana, é o meio: cerca de metade das observações estão iguais ou abaixo dele. **p95** descreve um valor no qual cerca de noventa e cinco por cento das observações caem. Ajuda a expor o extremo mais lento da experiência.

Imagine alinhar solicitações concluídas da mais rápida à mais lenta. A solicitação do meio informa sobre uma espera ordinária; uma solicitação próximo do extremo lento informa sobre uma espera frustrante. Nenhum é o máximo, e p95 não significa que todo usuário receberá uma resposta antes desse tempo. Inclua o número de observações e o período de medição, pois um percentil de uma amostra pequena é instável.

- **p50** — A observação do meio

- **p95** — Uma visão do extremo mais lento

- **Maximum** — O caso mais lento observado, não uma garantia

**Tempo de espera de resposta completa (ilustrativo)**

| Item | Value |
| --- | --- |
| Version A p50 | 3seconds |
| Version A p95 | 12seconds |
| Version B p50 | 4seconds |
| Version B p95 | 7seconds |

Observações inventadas mostram por que a espera típica e a espera do extremo lento podem mover-se em direções opostas. Estes não são benchmarks de produto.

Nesta comparação ilustrativa, a versão B torna a experiência média mais lenta, mas melhora o extremo lento. Se isso é desejável depende da promessa do serviço e da tarefa. Também conte solicitações que falharam ou expiraram. Excluí‑las do gráfico sem uma medida de falha separada pode fazer um serviço não confiável parecer rápido, pois suas piores experiências desaparecem do cálculo.

## Defina metas para um trabalho específico

Uma **meta** é o nível que você pretende alcançar; uma **métrica de guarda** é uma medição que não deve se tornar inaceitável enquanto você otimiza outra coisa. Para um assistente de vendas, uma meta primária pode ser a qualificação bem‑sucedida usando os critérios acordados. Guardas podem cobrir promessas enganosas, contato não autorizado e espera excessiva. Decida essas regras antes de escolher qual versão parece melhor.

As metas a seguir são pontos de partida qualitativos, não garantias universais de serviço. Transforme‑as em requisitos locais mensuráveis com as pessoas responsáveis pelo trabalho. Um processo de back‑office que roda durante a noite tem necessidades de tempo diferentes de uma pessoa que espera durante uma conversa de suporte. As consequências de um erro devem influenciar requisitos de revisão e escalonamento, não apenas a pontuação exibida em um gráfico.

| Caso de uso | Evidência primária | Expectativa de tempo | Guarda importante |
| --- | --- | --- | --- |
| Suporte ao cliente | Resolução correta ou escalonamento adequado | Feedback conversacional rápido | Nenhuma exceção de política inventada |
| Qualificação de vendas | Necessidades obrigatórias capturadas com precisão | Manter a conversa fluindo | Nenhuma promessa comercial não suportada |
| Assistente interno de conhecimento | Resposta suportada por documentos atuais | Resposta útil enquanto o colaborador trabalha | Respeitar restrições de acesso |
| Processamento de back‑office | Registros corretos produzidos e verificados | Concluir dentro da janela de trabalho acordada | Nenhuma alteração não autorizada |

**Otimizar um número**

Escolha a resposta mais barata e comemore menor gasto, mesmo que clientes repitam perguntas e a equipe repare mais erros.

**Otimizar o resultado**

Compare o custo por tarefa concluída com sucesso enquanto verifica precisão, tempo de espera, segurança e esforço de correção humana.

## Construa um painel que apoie decisões

Mantenha o painel pequeno o suficiente para ser lido, mas mostre definições ao lado dos valores. Inclua o período, tamanho da amostra, versão do agente e se os resultados vieram de testes ou de usuários reais. Separe grupos importantes, como canal de conversa, idioma e tipo de tarefa. Caso contrário, um influxo de perguntas fáceis pode fazer a precisão geral subir mesmo quando o agente piorou em cada tarefa difícil.

Mostre tendências ao lado dos valores recentes e marque lançamentos ou mudanças nas regras de medição. Uma tendência é uma sequência de medições ao longo do tempo; ajuda a distinguir uma mudança persistente de uma flutuação breve. Vincule resultados preocupantes a exemplos seguros de privacidade para que a equipe possa investigar. Atribua um responsável a cada medida importante e uma ação a cada alerta, em vez de coletar números que ninguém usa.

**Related on AIVAX:** [Agentic Tests](http://localhost:1313/pt-br/docs/inference/agentic-tests.md) provide evaluation outcomes for configured scenarios. Use those as one source of quality evidence alongside your application's timings, business outcomes and user feedback. A test result and a customer-satisfaction response answer different questions and should remain distinguishable.

**What's next:** Learn how to investigate the numbers in [Logs, traces and monitoring](http://localhost:1313/pt-br/learn/quality/logs-traces-and-monitoring.md).

**Verifique seu conhecimento.** O que a latência p95 indica?

1. p95 é a espera mais longa possível
2. p95 significa que o agente está correto na maioria das vezes
3. Cerca de noventa e cinco por cento das esperas medidas estão iguais ou abaixo desse valor
4. Cada solicitação leva exatamente esse tempo

Answer: option 3. Um percentil de latência descreve a distribuição dos tempos de espera observados. Não é nem uma pontuação de precisão nem uma garantia sobre solicitações futuras.
