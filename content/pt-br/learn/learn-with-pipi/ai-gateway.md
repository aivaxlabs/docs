---
{title: O que é um gateway de IA?,linkTitle: "#1 gateway de IA",description: "Pipi mostra por que um modelo de linguagem sozinho é apenas um cérebro brilhante em um pote, e como um gateway cria tudo ao seu redor.",weight: 10,duration: 5,objectives: [Diferenciar um modelo de linguagem do gateway que o envolve.,Nomear as cinco coisas que um gateway adiciona a um modelo.,Explicar por que um gateway permite trocar modelos sem reconstruir o resto.],sourceHash: fbb86bf5f3c357d6}
---

No primeiro episódio, a Pipi apresenta o desenho que toda a série reutiliza: um cérebro rosa dentro de um pote de vidro. O cérebro é o modelo de linguagem. Tudo que a Pipi constrói ao redor do pote é o gateway.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.webp" title="AIVAX Learn #1 — O que é um gateway de IA?" lang="pt-BR" caption="Episódio 1 · 1 minuto" >}}

## O que o vídeo mostra

Um **modelo de linguagem grande** (LLM) é um software treinado com uma enorme quantidade de texto. Ele lê, escreve e responde quase tudo, por isso a Pipi o chama de cérebro brilhante. Por si só, porém, ele tem três lacunas: não conhece sua empresa, não segue suas regras e não pode usar nenhuma ferramenta.

Três balões de pergunta flutuam até o pote: "Minha empresa?", "Regras?", "Ferramentas?", e cada um se esvazia. A Pipi coloca um capacete de segurança e monta uma máquina ao redor do pote, uma parte por palavra:

{{< cards >}}
{{< card title="Instructions" icon="list-check" >}}Quem é o assistente e como ele deve se comportar, lido em cada conversa.{{< /card >}}
{{< card title="Knowledge" icon="book" >}}Seus documentos, para que as respostas venham de fatos e não de suposições.{{< /card >}}
{{< card title="Tools" icon="tools" >}}Ações que o modelo pode solicitar, como buscar um pedido.{{< /card >}}
{{< card title="Safety" icon="shield" >}}Moderação e regras que mantêm as respostas dentro dos limites.{{< /card >}}
{{< card title="Costs" icon="coin" >}}Limites e rastreamento de uso para que os gastos permaneçam previsíveis.{{< /card >}}
{{< /cards >}}

A máquina fica verde. Então vem a reviravolta: a Pipi retira o cérebro rosa e conecta um azul. A máquina continua funcionando.

## Por que a reviravolta importa

Novos modelos aparecem a cada poucos meses, e a melhor escolha para uma tarefa muda com o tempo. Quando instruções, conhecimento, ferramentas e segurança vivem no gateway ao invés do código da sua aplicação, mudar o modelo é uma alteração de configuração. Seu site, seu número de WhatsApp e suas ferramentas internas continuam chamando o mesmo gateway.

{{< flow "Sua aplicação | gateway de IA (instruções, conhecimento, ferramentas, segurança, custos) | Modelo de linguagem | Resposta" >}}

No AIVAX, você envia o ID do gateway no campo `model` de uma requisição compatível com OpenAI, e o AIVAX aplica tudo que está armazenado nele. A pessoa que gerencia o gateway controla o comportamento; a aplicação apenas envia mensagens.

## Aprofunde-se

- No Learn: [O que é um LLM](../agents/what-is-an-llm.md), [De LLMs para agentes](../agents/from-llms-to-agents.md) e [Famílias de modelos e como escolher](../models/model-families-and-choosing.md).
- Na Documentação: [Gateways de IA](../../docs/inference/ai-gateway.md) explica o que um gateway armazena e uma configuração de produção recomendada. O [Visão geral](../../docs/overview.md) mostra quando chamar um modelo diretamente.

O próximo episódio abre a primeira parte da máquina: o emblema de instruções e a prateleira de habilidades.

{{< quiz options="O gateway treina um novo modelo com seus dados | O gateway armazena instruções, conhecimento, ferramentas e segurança ao redor do modelo, permitindo que o modelo seja trocado | O gateway é uma versão mais rápida do mesmo modelo" answer="2" explanation="O gateway não altera o modelo em si. Ele mantém a configuração ao seu redor, o que permite que a Pipi troque o cérebro e a máquina continue funcionando." >}}
Na máquina da Pipi, o que o gateway faz?
{{< /quiz >}}
