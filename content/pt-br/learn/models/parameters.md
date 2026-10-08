---
{title: "Parâmetros: temperatura, top-p, max tokens",linkTitle: Parâmetros,description: "Ajuste as configurações do modelo para equilibrar variação, comprimento da resposta e consistência sem confundir essas configurações com a precisão factual.",weight: 20,duration: 12,objectives: ["Explique temperatura, top-p e limites de saída em linguagem simples.",Selecione configurações iniciais conservadoras para tarefas comuns.,Reconheça quando sequências de parada e penalidades podem danificar uma resposta.,Teste alterações de parâmetros sem confundir variação com correção.],sourceHash: e2df70cf8a5bb6dd}
---

Imagine pedir a um colega que escreva um anúncio. Você pode solicitar uma versão convencional, convidar uma redação incomum ou limitar a resposta a um parágrafo curto. Os **parâmetros** do modelo são configurações que influenciam aspectos semelhantes da geração. Eles não fornecem fatos ausentes da empresa, não concedem permissão para realizar ações nem garantem que uma resposta seja verdadeira.

Um modelo de linguagem escreve usando **tokens**, pequenos trechos de texto que podem ser palavras, partes de palavras ou pontuação. Em cada passo ele estima os tokens próximos possíveis. Algumas configurações mudam como um token é selecionado; outras limitam quanto o modelo pode produzir. Entender essa distinção ajuda a mudar o controle correto em vez de ajustar todas as configurações quando uma resposta decepciona.

## Temperatura controla variação

**Temperatura** altera o quão fortemente a geração favorece os tokens seguintes mais prováveis. Um valor menor concentra a escolha em continuações prováveis. Um valor maior dá mais oportunidade a continuações menos prováveis. Pense na escolha do almoço: baixa temperatura favorece opções familiares; temperatura mais alta torna escolhas incomuns mais prováveis. Isso não faz com que toda escolha incomum seja boa.

Para um assistente que extrai datas de entrega de mensagens, uma redação repetível é útil. Uma temperatura baixa é um ponto de partida sensato. Para um redator que explora manchetes de campanha, mais variação pode gerar uma gama maior de rascunhos. Mesmo assim, declarações de produto aprovadas devem permanecer fixas. A criatividade deve mudar a expressão, não inventar recursos ou promessas.

{{< demo name="temperature" title="Experimente: altere a distribuição das palavras possíveis" config=`{"prefix":"Our new service makes your work","candidates":[["easier",0.5],["simpler",0.25],["faster",0.15],["different",0.08],["purple",0.02]]}` >}}
Mova o controle de temperatura e amostre várias vezes. Esta ilustração simplificada usa candidatos e probabilidades inventados; não contata um modelo real. Observe que ampliar as escolhas pode gerar variedade sem melhorar a utilidade.
{{< /demo >}}

Uma temperatura zero, quando suportada, costuma solicitar a continuação mais provável em vez de um sorteio aleatório. Não a trate como garantia de saída idêntica. A implementação do provedor, atualizações do modelo e outros detalhes de execução ainda podem afetar os resultados. Mais importante, uma resposta pode estar consistentemente errada: baixa variação não é a mesma coisa que alta precisão.

{{< compare >}}
{{< side title="Estilo de baixa temperatura" >}}
**Mesmo prompt:** “Escreva uma abertura amigável para uma mensagem anunciando nosso centro de ajuda revisado.”

“O centro de ajuda revisado está pronto para ajudar Você a encontrar respostas.”

Este rascunho ilustrativo permanece próximo da redação convencional.
{{< /side >}}
{{< side title="Estilo de temperatura mais alta" >}}
**Mesmo prompt:** “Escreva uma abertura amigável para uma mensagem anunciando nosso centro de ajuda revisado.”

“Um caminho mais claro para respostas começa com nosso centro de ajuda revisado.”

Este rascunho ilustrativo explora uma expressão diferente. Uma execução real ainda pode devolver uma redação convencional.
{{< /side >}}
{{< /compare >}}

Observe o que a comparação não mostra: mais conhecimento factual ou melhor conformidade de política. Se o centro de ajuda ainda não foi lançado, nenhum estilo deve anunciá‑lo. Corrija a instrução ou a informação de origem antes de ajustar as configurações de amostragem. **Amostragem** é o processo de selecionar entre os tokens próximos possíveis do modelo.

## Top-p limita o conjunto de candidatos

**Top-p**, também chamado de amostragem por núcleo, seleciona um conjunto de tokens próximos prováveis cuja probabilidade combinada atinge um limite escolhido. O modelo então amostra desse conjunto. Com um limite mais baixo, candidatos improváveis tendem a ser excluídos. Com um limite próximo de um, mais candidatos permanecem elegíveis. O conjunto pode conter números diferentes de tokens em posições diferentes da resposta.

Temperatura e top‑p são controles relacionados, mas fazem coisas diferentes. A temperatura remodela a distribuição de probabilidades; o top‑p recorta o conjunto do qual ocorre a amostragem. Top‑p não significa “usar esta porcentagem do vocabulário”, e não é uma pontuação de confiança para a resposta final. Um valor de 0,9 não significa que a resposta está 90 % correta.

Para experimentos iniciais, mantenha um controle em seu padrão suportado enquanto altera o outro. Se você baixar ambos ao mesmo tempo e a resposta ficar repetitiva, não saberá qual mudança a causou. Muitas equipes começam ajustando apenas a temperatura. Alguns modelos restringem ou não suportam esses controles, portanto verifique o modelo escolhido em vez de copiar configurações de um exemplo não relacionado.

## Max tokens define um teto, não um briefing de escrita

Um **limite de tokens de saída** impõe o orçamento de geração. Dependendo do modelo e da interface, a configuração pode ser chamada `max_tokens` ou `max_completion_tokens`. Esses nomes não são universalmente intercambiáveis. Para alguns modelos de raciocínio, um orçamento de conclusão cobre o raciocínio interno assim como a resposta visível, deixando menos tokens para o texto que o usuário vê.

O limite não é uma promessa de que o modelo escreverá exatamente essa quantidade. Ele pode terminar antes, ou atingir o teto antes de concluir uma frase. Um teto muito pequeno pode cortar uma qualificação importante ou deixar um resultado legível por máquina incompleto. Um teto muito grande permite geração mais longa; ele não obriga o modelo a usá‑lo.

Peça o comprimento desejado em linguagem comum, depois defina um orçamento com espaço para uma resposta completa. “Forneça um resumo curto seguido pelo responsável pela ação” descreve o resultado melhor do que apenas um limite de tokens. Meça saídas típicas nas suas línguas reais: um token não é um número fixo de caracteres ou palavras, e textos diferentes podem consumir quantidades diferentes.

{{< cards >}}
{{< card title="Instrução" icon="message" >}}
“Use um parágrafo curto e indique o que está faltando.” Isso descreve a forma e o propósito da resposta.
{{< /card >}}
{{< card title="Orçamento de geração" icon="settings" >}}
O limite de saída restringe quanto o modelo pode gerar. Deixe espaço suficiente para uma resposta completa e qualquer orçamento de raciocínio suportado.
{{< /card >}}
{{< card title="Verificação de conclusão" icon="list-check" >}}
Sua aplicação verifica se a geração terminou normalmente e se o resultado requerido está completo antes de usá‑lo.
{{< /card >}}
{{< /cards >}}

Para um extrator de back‑office, um resultado encurtado deve ser tratado como incompleto, não aceito silenciosamente apenas porque contém alguns campos plausíveis. Para uma resposta voltada ao cliente, a aplicação deve evitar apresentar uma frase quebrada como recomendação finalizada. Aumentar o teto pode ajudar com truncamento, mas não corrigirá uma solicitação pouco clara que incentiva detalhes desnecessários.

## Configurações iniciais por caso de uso

A seguir estão pontos de partida qualitativos, não padrões de produto universais. Use a faixa suportada pelo modelo e altere uma configuração por vez. Quando um modelo tem comportamento de amostragem fixo, concentre‑se nas instruções e avaliação em vez de tentar forçar valores não suportados.

| Caso de uso | Direção da temperatura | Abordagem inicial do top‑p | Abordagem do orçamento de saída |
| --- | --- | --- | --- |
| Extrair campos de uma fatura | Baixa | Manter o padrão suportado | Suficiente para cada campo requerido |
| Responder a partir de um documento de política | Baixa | Manter o padrão suportado | Suficiente para resposta, evidência e incerteza |
| Rascunhar resposta ao cliente | Baixa a moderada | Manter inalterado inicialmente | Correspondente ao formato de resposta solicitado |
| Explorar manchetes de marketing | Moderada a alta | Ajustar apenas se os testes justificarem | Suficiente para as alternativas solicitadas |
| Analisar problema de múltiplas etapas | Seguir a orientação do modelo | Seguir a orientação do modelo | Permitir raciocínio e resposta final |

Comece com um baseline salvo: uma configuração à qual você pode retornar. Mantenha o prompt, o material de origem e os casos de teste fixos ao comparar uma mudança. Avalie várias saídas, incluindo casos embaraçosos. Caso contrário, uma resposta afortunada pode parecer uma melhoria, ou uma mudança no documento‑fonte pode ser confundida com um benefício da temperatura.

## Sequências de parada e penalidades

Uma **sequência de parada** é um trecho de texto configurado que indica ao modelo que deve parar quando ele aparece, onde o modelo a suporta. Isso pode ajudar em protocolos de texto cuidadosamente projetados. Também pode cortar uma resposta válida se o mesmo texto ocorrer naturalmente. Usar uma palavra comum ou sinal de pontuação como marcador de parada é especialmente arriscado.

**Penalidades de presença** geralmente desencorajam o uso de tokens que já apareceram; **penalidades de frequência** geralmente os desencorajam mais à medida que se repetem. O comportamento exato e as faixas suportadas variam. Esses controles podem reduzir prosa repetitiva, mas repetições legítimas importam em nomes, linguagem jurídica e saída baseada em campos. Comece com os padrões suportados a menos que a repetição seja um problema mensurado.

{{< accordion title="Devo aumentar as penalidades sempre que a resposta se repete?" >}}
Não imediatamente. Primeiro verifique se o prompt pede o mesmo ponto várias vezes ou se trechos de origem duplicados incentivam a repetição. Uma penalidade pode suprimir termos necessários sem resolver o problema da instrução subjacente. Teste a mudança em casos onde um nome de produto ou rótulo de campo deve aparecer novamente.
{{< /accordion >}}

Na AIVAX, essas configurações fazem parte dos [parâmetros de inferência](../../docs/inference/inference.md) suportados e da [configuração de gateway de IA reutilizável](../../docs/inference/ai-gateway.md). Relacionado: consulte esses guias para restrições específicas do modelo ao invés de presumir que todo parâmetro funciona em todos os modelos.

Próximo passo: explore a [multimodalidade](multimodality.md), onde as entradas e saídas vão além do texto.

{{< quiz options="Aumentar a temperatura para que o modelo saiba mais fatos | Reduzir o orçamento de tokens até que a resposta seja curta | Fornecer a política correta e testar a precisão, depois ajustar a variação separadamente | Definir top‑p para a porcentagem de precisão desejada" answer="3" explanation="Configurações de amostragem influenciam a variação, não o conhecimento ou a verdade. Informação correta de origem e avaliação corrigem erros factuais; limites de saída e top‑p não são controles de precisão." >}}
Um assistente fornece uma regra de reembolso confiante, mas errada. Qual é a resposta inicial mais útil?
{{< /quiz >}}
