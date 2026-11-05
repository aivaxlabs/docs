---
{title: Instruções do sistema e habilidades,linkTitle: "#2 Instruções e habilidades",description: "Pipi cola um crachá no frasco para que o cérebro saiba de quem se trata, e depois armazena os procedimentos longos em uma prateleira de cadernos rotulados, que ele só abre quando necessário.",weight: 20,duration: 5,objectives: ["Um sistema é um conjunto de partes interconectadas que formam um todo complexo e organizado. Ele pode ser natural, como o corpo humano ou o ecossistema de uma floresta, ou artificial, como um computador, um carro ou um software. Os sistemas são caracterizados por suas entradas (informações ou recursos que entram no sistema), processos (as transformações que ocorrem dentro do sistema) e saídas (os resultados ou produtos gerados pelo sistema). Além disso, os sistemas possuem fronteiras que os separam do ambiente externo e podem incluir mecanismos de feedback para ajustar seu comportamento com base nas condições internas ou externas.",Reconheça por que colocar tudo nas instruções do sistema se torna caro.,Descreva como as habilidades são selecionadas com base em suas descrições e carregadas sob demanda.],sourceHash: 550e9bb86b41c5c3}
---

O cérebro do episódio 1 é brilhante, mas ainda não sabe quem ele é ou como se comportar. Neste episódio, ele se torna o assistente da "Padaria da Pipi".

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.webp" title="AIVAX Learn #2 — Instruções de sistema e habilidades" lang="pt-BR" caption="Episódio 2 · 1 minuto e 13 segundos" >}}

## O que o vídeo mostra

Pipi cola uma etiqueta no pote: *"Você é o assistente da Padaria da Pipi. Seja gentil."* Essa etiqueta é a **instrução de sistema**: texto que diz ao modelo quem ele é e como agir. Ela é lida em toda conversa, por isso o vídeo a marca como "sempre ativa".

Em seguida, Pipi tenta colocar tudo na etiqueta: receitas, entregas, trocas. A etiqueta vira um pergaminho que se desenrola até o chão, o cérebro começa a suar e um medidor de moedas sobe. Um modelo é cobrado pela quantidade de texto que ele lê, então uma instrução enorme que é lida em cada mensagem custa mais a cada mensagem, mesmo quando a maior parte dela é irrelevante.

Pipi corta o pergaminho e constrói uma prateleira com três livretos rotulados *Receitas*, *Entregas* e *Trocas*. Estes são os **skills** (habilidades): pacotes de instruções, cada um com um rótulo curto dizendo para que serve.

{{< steps >}}
{{< step title="Uma pergunta chega" >}}
Um cliente pergunta: *"Vocês entregam aos sábados?"*
{{< /step >}}
{{< step title="O cérebro lê os rótulos" >}}
Apenas as descrições curtas de cada habilidade estão visíveis para o modelo inicialmente.
{{< /step >}}
{{< step title="Um livrete se abre" >}}
O rótulo *Entregas* acende; esse livrete voa para dentro do pote e suas instruções entram na conversa.
{{< /step >}}
{{< step title="O resto fica na prateleira" >}}
*Receitas* e *Trocas* não são carregados, então eles não adicionam custo a esta resposta.
{{< /step >}}
{{< /steps >}}

## Etiqueta ou livrete?

| | Instrução de sistema | Habilidade (Skill) |
|---|---|---|
| Quando se aplica | Sempre | Apenas quando relevante |
| Tamanho ideal | Curto e focado | Pode ser longo |
| Custo | Pago em cada mensagem | Pago apenas quando carregado |
| Melhor para | Identidade, tom, regras base | Procedimentos especializados |

Uma boa regra prática: se algo deve valer para todas as respostas, como tom, escopo ou "nunca prometa reembolsos", mantenha-o na instrução de sistema. Se for um procedimento para um tipo específico de solicitação, torne-o uma habilidade e escreva uma descrição clara, pois é a descrição que o modelo usa para decidir se deve abri-la.

## Aprofunde-se

- No Learn: [Escrevendo prompts e instruções boas](../agents/writing-good-prompts-and-instructions.md), [Adicionando habilidades](../agents/adding-skills.md) e [Janela de contexto, tokens e gerenciamento de custos](../prompt-engineering/context-window-tokens-and-cost.md).
- Na Documentação: [Habilidades (Skills)](../../docs/inference/skills.md) cobre como as habilidades são listadas e carregadas, quando usá-las e como elas se comparam às instruções de sistema. [Gateways de IA](../../docs/inference/ai-gateways/concepts.md) mostra onde ambas são configuradas. [Ensinar Habilidade (Teach Skill)](../../docs/inference/skills.md) rascunha uma habilidade a partir de uma demonstração gravada.

O próximo episódio responde a uma pergunta diferente: o que acontece quando a resposta está nos seus documentos, não nas instruções?

{{< quiz options="Coloque tudo na instrução de sistema para que o modelo nunca perca nenhum | Transforme cada procedimento em uma habilidade com uma descrição clara | Crie um gateway por procedimento" answer="2" explanation="As habilidades mantêm a instrução sempre ativa curta. O modelo lê apenas as descrições e carrega um procedimento quando uma pergunta precisa dele." >}}
A Padaria da Pipi tem procedimentos longos para receitas, entregas e trocas. O que o vídeo sugere?
{{< /quiz >}}
