---
{title: Instruções e habilidades do sistema,linkTitle: "#2 Instruções e habilidades",description: "Pipi coloca um crachá no jarro para que o cérebro saiba quem é, então move procedimentos longos para uma prateleira de livretos rotulados que abre apenas quando necessário.",weight: 20,duration: 5,objectives: [Explicar o que é uma instrução de sistema e quando o modelo a lê.,Reconhecer por que colocar tudo na instrução de sistema se torna caro.,Descrever como as habilidades são escolhidas pela sua descrição e carregadas sob demanda.],sourceHash: 324b6537d436eb9f}
---

O cérebro do episódio 1 é brilhante, mas ainda não sabe quem é nem como se comportar. Neste episódio ele se torna o assistente da "Padaria da Pipi".

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.webp" title="AIVAX Learn #2 — System instructions and skills" lang="pt-BR" caption="Episode 2 · 1 minute 13 seconds" >}}

## O que o vídeo mostra

Pipi coloca um crachá no jarro: *"Você é o assistente da Padaria da Pipi. Seja gentil."* Esse crachá é a **instrução de sistema**: texto que informa ao modelo quem ele é e como agir. Ele é lido em cada conversa, por isso o vídeo o marca como "sempre ativo".

Então Pipi tenta colocar tudo no crachá: receitas, entregas, trocas. O crachá se transforma em um pergaminho que se desenrola até o chão, o cérebro começa a suar e um medidor de moedas sobe. Um modelo é cobrado pela quantidade de texto que lê, então uma instrução enorme que é lida em cada mensagem custa mais em cada mensagem, mesmo quando a maior parte é irrelevante.

Pipi corta o pergaminho e constrói uma prateleira com três livretos rotulados *Receitas*, *Entregas* e *Trocas*. Estes são **habilidades**: pacotes de instruções, cada um com um rótulo curto indicando para que serve.

{{< steps >}}
{{< step title="Chega uma pergunta" >}}
Um cliente pergunta: *"Vocês entregam no sábado?"*
{{< /step >}}
{{< step title="O cérebro lê os rótulos" >}}
Apenas as descrições curtas de cada habilidade são visíveis ao modelo inicialmente.
{{< /step >}}
{{< step title="Um livreto abre" >}}
O rótulo *Entregas* acende; aquele livreto voa para o jarro e suas instruções entram na conversa.
{{< /step >}}
{{< step title="O resto fica na prateleira" >}}
*Receitas* e *Trocas* não são carregadas, então não adicionam nada ao custo desta resposta.
{{< /step >}}
{{< /steps >}}

## Crachá ou livreto?

| | Instrução de sistema | Habilidade |
|---|---|---|
| Quando se aplica | Sempre | Só quando relevante |
| Tamanho ideal | Curto e focado | Pode ser longo |
| Custo | Cobrado em cada mensagem | Cobrado apenas quando carregada |
| Melhor para | Identidade, tom, regras básicas | Procedimentos especializados |

Uma boa regra prática: se algo deve valer para toda resposta, como tom, escopo ou "nunca prometer reembolsos", mantenha na instrução de sistema. Se for um procedimento para um tipo de solicitação, torne-o uma habilidade e escreva uma descrição clara, pois a descrição é o que o modelo usa para decidir se a abre.

## Aprofunde-se

- Em Learn: [Escrevendo prompts e instruções boas](../agents/writing-good-prompts-and-instructions.md), [Adicionando habilidades](../agents/adding-skills.md) e [Janela de contexto, tokens e gerenciamento de custo](../prompt-engineering/context-window-tokens-and-cost.md).
- Na Documentação: [Habilidades](../../docs/features/skills.md) descreve como as habilidades são listadas e carregadas, quando usá-las e como elas comparam com instruções de sistema. [Gateways de IA](../../docs/inference/ai-gateway.md) mostra onde ambos são configurados. [Ensinar Habilidade](../../docs/generations/teach-skill.md) cria um rascunho de habilidade a partir de uma demonstração gravada.

O próximo episódio responde a uma pergunta diferente: o que acontece quando a resposta está nos seus documentos, não nas instruções?

{{< quiz options="Coloque todas elas na instrução de sistema para que o modelo nunca perca nenhuma | Transforme cada procedimento em uma habilidade com uma descrição clara | Crie um gateway por procedimento" answer="2" explanation="Habilidades mantêm a instrução sempre ativa curta. O modelo lê apenas as descrições e carrega um procedimento quando a pergunta o requer." >}}
A Padaria da Pipi tem procedimentos longos para receitas, entregas e trocas. O que o vídeo sugere?
{{< /quiz >}}
