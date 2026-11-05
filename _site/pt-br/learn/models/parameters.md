Source: https://docs.aivax.net/pt-br/learn/models/parameters.html

Imagine pedir a um colega para escrever um anúncio. Você pode solicitar uma versão convencional, convidar a usar uma redação incomum ou limitar a resposta a um parágrafo curto. Os **parâmetros** do modelo são configurações que influenciam aspectos semelhantes da geração. Eles não fornecem fatos empresariais ausentes, não concedem permissão para realizar ações e não garantem que uma resposta seja verdadeira.

Um modelo de linguagem escreve usando **tokens**, pequenas partes de texto que podem ser palavras, partes de palavras ou pontuação. Em cada etapa, ele estima os próximos tokens possíveis. Algumas configurações alteram como um token é selecionado; outras limitam quanto o modelo pode produzir. Entender essa distinção ajuda você a alterar o controle certo em vez de ajustar todas as configurações quando uma resposta decepciona.

## A temperatura controla a variação

A **temperatura** altera o quanto a geração favorece os próximos tokens mais prováveis. Um valor mais baixo concentra a escolha em torno das continuações prováveis. Um valor mais alto dá mais oportunidade às continuações menos prováveis. Pense em escolher o almoço: a baixa temperatura favorece opções familiares; a alta temperatura torna escolhas incomuns mais prováveis. Isso não significa que toda escolha incomum seja boa.

Para um assistente que extrai datas de entrega de mensagens, uma redação repetível é útil. Uma temperatura baixa é um ponto de partida sensato. Para um escritor explorando títulos de campanhas, mais variação pode produzir uma gama mais ampla de rascunhos. Mesmo assim, as alegações aprovadas sobre produtos devem permanecer fixas. A criatividade deve mudar a expressão, não inventar recursos ou promessas.

> **Demonstração interativa: Experimente: altere a dispersão das palavras possíveis.** Esta demonstração interativa está disponível na página web. Mova o controle de temperatura e faça várias amostragens. Esta ilustração simplificada usa candidatos e probabilidades inventados; ela não se conecta a um modelo real. Observe que ampliar as escolhas pode produzir variedade sem melhorar a utilidade.

Uma temperatura de zero, quando suportada, geralmente solicita a continuação mais provável em vez de um sorteio aleatório. Não a trate como uma garantia de saída idêntica. A implementação do provedor, atualizações do modelo e outros detalhes de execução ainda podem afetar os resultados. Mais importante ainda, uma resposta pode estar consistentemente errada: baixa variação não é a mesma coisa que alta precisão.

**Estilo de baixa temperatura**

**Mesmo prompt:** “Escreva uma abertura amigável para uma mensagem anunciando nosso centro de ajuda revisado.”

“O centro de ajuda revisado está pronto para ajudá-lo a encontrar respostas.”

Este rascunho ilustrativo mantém-se próximo à redação convencional.

**Estilo de temperatura mais alta**

**Mesmo prompt:** “Escreva uma abertura amigável para uma mensagem anunciando nosso centro de ajuda revisado.”

“Uma rota mais clara para as respostas começa com nosso centro de ajuda revisado.”

Este rascunho ilustrativo explora uma expressão diferente. Uma execução real ainda pode retornar redação convencional.

Observe o que a comparação não mostra: mais conhecimento factual ou melhor conformidade com políticas. Se o centro de ajuda ainda não foi lançado, nenhum dos estilos deveria anunciar que já está. Corrija a instrução ou a informação de origem antes de ajustar as configurações de amostragem. **Amostragem** é o processo de seleção entre os próximos tokens possíveis do modelo.

## O top-p limita o pool de candidatos

O **top-p**, também chamado de amostragem por núcleo, seleciona um conjunto de próximos tokens prováveis cuja probabilidade combinada atinge um limite escolhido. O modelo então faz a amostragem desse conjunto. Com um limite mais baixo, candidatos improváveis tendem a ser excluídos. Com um limite próximo a um, mais candidatos permanecem elegíveis. O conjunto pode conter números diferentes de tokens em diferentes posições da resposta.

Temperatura e top-p são controles relacionados, mas fazem coisas diferentes. A temperatura remodela a distribuição de probabilidades; o top-p reduz o conjunto do qual a amostragem ocorre. Top-p não significa “use esta porcentagem do vocabulário”, e não é uma pontuação de confiança para a resposta final. Um valor de 0,9 não significa que a resposta está 90% correta.

Para experimentos iniciais, mantenha um controle em seu padrão suportado enquanto altera o outro. Se você baixar ambos ao mesmo tempo e a resposta se tornar repetitiva, você não saberá qual mudança causou isso. Muitas equipes começam ajustando apenas a temperatura. Alguns modelos restringem ou não suportam esses controles, então verifique o modelo escolhido em vez de copiar configurações de um exemplo não relacionado.

## Max tokens define um teto, não um briefing de escrita

Um **limite de tokens de saída** capta o orçamento de geração. Dependendo do modelo e da interface, a configuração pode ser chamada `max_tokens` ou `max_completion_tokens`. Esses nomes não são universalmente intercambiáveis. Para alguns modelos de raciocínio, um orçamento de conclusão cobre o raciocínio interno bem como a resposta visível, deixando menos tokens para o texto que o usuário vê.

O limite não é uma promessa de que o modelo escreverá exatamente essa quantidade. Ele pode terminar cedo ou atingir o teto antes de terminar uma frase. Um teto muito pequeno pode cortar uma qualificação importante ou deixar um resultado legível por máquina incompleto. Um teto muito grande permite uma geração mais longa; não força o modelo a usá-la.

Peça o comprimento desejado em linguagem comum e defina um orçamento com margem para uma resposta completa. “Dê um resumo curto seguido pelo responsável pela ação” descreve o resultado melhor do que um limite de tokens sozinho. Meça as saídas típicas em seus idiomas reais: um token não é um número fixo de caracteres ou palavras, e textos diferentes podem consumir quantidades diferentes.

- **Instrução** — “Use um parágrafo curto e declare o que está faltando.” Isso descreve a forma e o propósito da resposta.

- **Orçamento de geração** — O limite de saída restringe quanto o modelo pode gerar. Deixe espaço suficiente para uma resposta completa e qualquer orçamento de raciocínio suportado.

- **Verificação de conclusão** — Seu aplicativo verifica se a geração terminou normalmente e se o resultado necessário está completo antes de usá-lo.

Para um extrator de back-office, um resultado encurtado deve ser tratado como incompleto, não aceito silenciosamente porque contém alguns campos plausíveis. Para uma resposta voltada ao cliente, o aplicativo deve evitar apresentar uma frase quebrada como uma recomendação concluída. Aumentar o teto pode ajudar com o truncamento, mas não corrigirá um pedido pouco claro que encoraja detalhes desnecessários.

## Configurações iniciais por caso de uso

Os seguintes são pontos de partida qualitativos, não padrões universais de produto. Use a faixa suportada pelo modelo e altere uma configuração de cada vez. Onde um modelo tem comportamento de amostragem fixo, concentre-se em instruções e avaliação em vez de tentar forçar valores não suportados.

| Caso de uso | Direção da Temperatura | Abordagem inicial do Top-p | Abordagem do Orçamento de Saída |
| --- | --- | --- | --- |
| Extrair campos de uma fatura | Baixa | Deixe no padrão suportado | Suficiente para todos os campos necessários |
| Responder a partir de um documento de política | Baixa | Deixe no padrão suportado | Suficiente para resposta, evidência e incerteza |
| Rascunhar uma resposta ao cliente | Baixa a moderada | Deixe inalterado inicialmente | Correspondente ao formato de resposta solicitado |
| Explorar títulos de marketing | Moderada a mais alta | Ajuste apenas se os testes justificarem | Suficiente para as alternativas solicitadas |
| Analisar um problema de múltiplos passos | Siga a orientação do modelo | Siga a orientação do modelo | Permita raciocínio e a resposta final |

Comece com uma linha de base salva: uma configuração à qual você pode retornar. Mantenha o prompt, o material de origem e os casos de teste fixos enquanto compara uma mudança. Avalie várias saídas, incluindo casosawkward (desajeitados). Caso contrário, uma resposta sortuda pode parecer uma melhoria, ou uma mudança no documento de origem pode ser confundida com um benefício da temperatura.

## Sequências de parada e penalidades

Uma **sequência de parada** é um trecho de texto configurado que diz à geração para parar quando aparece, onde o modelo suporta isso. Isso pode ajudar em protocolos de texto cuidadosamente projetados. Também pode cortar uma resposta válida prematuramente se o mesmo texto ocorrer naturalmente. Usar uma palavra comum ou marca de pontuação como marcador de parada é especialmente arriscado.

**Penalidades de presença** geralmente desencorajam o uso de tokens que já apareceram; **penalidades de frequência** geralmente desencorajam-nos mais conforme se repetem. O comportamento exato e as faixas suportadas variam. Esses controles podem reduzir a prosa repetitiva, mas a repetição legítima importa em nomes, linguagem jurídica e saída baseada em campos. Comece com os padrões suportados, a menos que a repetição seja um problema mensurado.

**Devo aumentar as penalidades sempre que a resposta se repete?**

Não imediatamente. Primeiro, verifique se o prompt pede o mesmo ponto várias vezes ou se passagens duplicadas da fonte encorajam a repetição. Uma penalidade pode suprimir termos necessários sem resolver o problema subjacente da instrução. Teste a mudança em casos onde um nome de produto ou rótulo de campo deve aparecer novamente.

No AIVAX, essas configurações fazem parte dos [parâmetros de inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md) suportados e da [configuração de gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) reutilizável. Relacionado: verifique esses guias para restrições específicas do modelo em vez de assumir que todo parâmetro funciona para cada modelo.

Próximos passos: explore [multimodalidade](https://docs.aivax.net/pt-br/learn/models/multimodality.md), onde as entradas e saídas se estendem além do texto.

**Verifique seu conhecimento.** Um assistente fornece uma regra de reembolso errada, mas com confiança. Qual é a primeira resposta mais útil?

1. Aumente a temperatura para que o modelo saiba mais fatos
2. Reduza o orçamento de tokens até que a resposta seja curta
3. Forneça a política correta e teste a precisão, depois ajuste a variação separadamente
4. Defina o top-p para a porcentagem de precisão desejada

Answer: option 3. As configurações de amostragem influenciam a variação, não o conhecimento ou a verdade. Informações de origem corretas e avaliação abordam erros factuais; limites de saída e top-p não são controles de precisão.
