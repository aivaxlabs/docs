Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/system-instructions-and-skills.html

O cérebro do episódio 1 é brilhante, mas ainda não sabe quem é nem como se comportar. Neste episódio ele se torna o assistente da "Padaria da Pipi".

[Video: AIVAX Learn #2 — Instruções de sistema e habilidades](https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 2 · 1 minuto 13 segundos*


## O que o vídeo mostra

Pipi coloca um crachá no pote: *"Você é o assistente da Padaria da Pipi. Seja gentil."* Esse crachá é a **instrução de sistema**: texto que informa ao modelo quem ele é e como deve agir. Ele é lido em toda conversa, por isso o vídeo marca como "sempre ativo".

Então a Pipi tenta colocar tudo no crachá: receitas, entregas, trocas. O crachá se transforma em um pergaminho que se desenrola até o chão, o cérebro começa a suar e um medidor de moedas sobe. Um modelo é cobrado pela quantidade de texto que lê, então uma instrução enorme que é lida em cada mensagem custa mais em cada mensagem, mesmo quando a maior parte dela é irrelevante.

Pipi corta o pergaminho e constrói uma prateleira com três folhetos rotulados *Receitas*, *Entregas* e *Trocas*. Estes são **habilidades**: pacotes de instruções, cada um com um rótulo curto indicando para que serve.


1. **Chega uma pergunta**

Um cliente pergunta: *"Você entrega no sábado?"*


2. **O cérebro lê os rótulos**

Apenas as descrições curtas de cada habilidade são visíveis ao modelo inicialmente.


3. **Um folheto abre**

O rótulo *Entregas* acende; aquele folheto voa para o pote e suas instruções entram na conversa.


4. **O resto fica na prateleira**

*Receitas* e *Trocas* não são carregadas, portanto não adicionam nada ao custo desta resposta.





## Crachá ou folheto?

| | Instrução de sistema | Habilidade |
|---|---|---|
| Quando se aplica | Sempre | Somente quando relevante |
| Tamanho ideal | Curto e focado | Pode ser longo |
| Custo | Cobrado em cada mensagem | Cobrado somente quando carregado |
| Melhor para | Identidade, tom, regras básicas | Procedimentos especializados |

Uma boa regra prática: se algo deve valer para toda resposta, como tom, escopo ou "nunca prometer reembolsos", mantenha na instrução de sistema. Se for um procedimento para um tipo de solicitação, transforme em habilidade e escreva uma descrição clara, pois a descrição é o que o modelo usa para decidir se a abre.

## Aprofunde-se

- Na seção Learn: [Escrevendo boas instruções e prompts](https://docs.aivax.net/pt-br/learn/agents/writing-good-prompts-and-instructions.md), [Adicionando habilidades](https://docs.aivax.net/pt-br/learn/agents/adding-skills.md) e [Janela de contexto, tokens e gerenciamento de custos](https://docs.aivax.net/pt-br/learn/prompt-engineering/context-window-tokens-and-cost.md).
- Na Documentação: [Habilidades](https://docs.aivax.net/pt-br/docs/inference/skills.md) descreve como as habilidades são listadas e carregadas, quando usá-las e como elas comparam com instruções de sistema. [Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) mostra onde ambos são configurados. [Ensinar Habilidade](https://docs.aivax.net/pt-br/docs/inference/skills.md) cria um rascunho de uma demonstração gravada.

O próximo episódio responde a uma pergunta diferente: o que acontece quando a resposta está nos seus documentos, não nas instruções?

**Verifique seu conhecimento.** A Padaria da Pipi tem procedimentos longos para receitas, entregas e trocas. O que o vídeo sugere?

1. Coloque tudo na instrução de sistema para que o modelo nunca perca nada
2. Transforme cada procedimento em uma habilidade com uma descrição clara
3. Crie um gateway por procedimento

Answer: option 2. Habilidades mantêm a instrução sempre ativa curta. O modelo lê apenas as descrições e carrega um procedimento quando uma pergunta o requer.
