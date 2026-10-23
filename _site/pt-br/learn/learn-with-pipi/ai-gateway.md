Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/ai-gateway.html

No primeiro episódio, a Pipi apresenta o desenho que toda a série reutiliza: um cérebro rosa dentro de um pote de vidro. O cérebro é o modelo de linguagem. Tudo que a Pipi constrói ao redor do pote é o gateway.

[Video: AIVAX Learn #1 — O que é um gateway de IA?](https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 1 · 1 minuto*


## O que o vídeo mostra

Um **modelo de linguagem grande** (LLM) é um software treinado com uma enorme quantidade de texto. Ele lê, escreve e responde quase tudo, por isso a Pipi o chama de cérebro brilhante. Por si só, porém, ele tem três lacunas: não conhece sua empresa, não segue suas regras e não pode usar nenhuma ferramenta.

Três balões de pergunta flutuam até o pote: "Minha empresa?", "Regras?", "Ferramentas?", e cada um se esvazia. A Pipi coloca um capacete de segurança e monta uma máquina ao redor do pote, uma parte por palavra:


- **Instructions** — Quem é o assistente e como ele deve se comportar, lido em cada conversa.

- **Knowledge** — Seus documentos, para que as respostas venham de fatos e não de suposições.

- **Tools** — Ações que o modelo pode solicitar, como buscar um pedido.

- **Safety** — Moderação e regras que mantêm as respostas dentro dos limites.

- **Costs** — Limites e rastreamento de uso para que os gastos permaneçam previsíveis.




A máquina fica verde. Então vem a reviravolta: a Pipi retira o cérebro rosa e conecta um azul. A máquina continua funcionando.

## Por que a reviravolta importa

Novos modelos aparecem a cada poucos meses, e a melhor escolha para uma tarefa muda com o tempo. Quando instruções, conhecimento, ferramentas e segurança vivem no gateway ao invés do código da sua aplicação, mudar o modelo é uma alteração de configuração. Seu site, seu número de WhatsApp e suas ferramentas internas continuam chamando o mesmo gateway.

Sua aplicação → gateway de IA (instruções, conhecimento, ferramentas, segurança, custos) → Modelo de linguagem → Resposta


No AIVAX, você envia o ID do gateway no campo `model` de uma requisição compatível com OpenAI, e o AIVAX aplica tudo que está armazenado nele. A pessoa que gerencia o gateway controla o comportamento; a aplicação apenas envia mensagens.

## Aprofunde-se

- No Learn: [O que é um LLM](https://docs.aivax.net/pt-br/learn/agents/what-is-an-llm.md), [De LLMs para agentes](https://docs.aivax.net/pt-br/learn/agents/from-llms-to-agents.md) e [Famílias de modelos e como escolher](https://docs.aivax.net/pt-br/learn/models/model-families-and-choosing.md).
- Na Documentação: [Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) explica o que um gateway armazena e uma configuração de produção recomendada. O [Visão geral](https://docs.aivax.net/pt-br/docs/overview.md) mostra quando chamar um modelo diretamente.

O próximo episódio abre a primeira parte da máquina: o emblema de instruções e a prateleira de habilidades.

**Verifique seu conhecimento.** Na máquina da Pipi, o que o gateway faz?

1. O gateway treina um novo modelo com seus dados
2. O gateway armazena instruções, conhecimento, ferramentas e segurança ao redor do modelo, permitindo que o modelo seja trocado
3. O gateway é uma versão mais rápida do mesmo modelo

Answer: option 2. O gateway não altera o modelo em si. Ele mantém a configuração ao seu redor, o que permite que a Pipi troque o cérebro e a máquina continue funcionando.
