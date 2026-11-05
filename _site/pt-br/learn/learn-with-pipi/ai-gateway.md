Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/ai-gateway.html

No primeiro episódio, Pipi apresenta o desenho que toda a série reutiliza: um cérebro rosa dentro de um frasco de vidro. O cérebro é o modelo de linguagem. Tudo o que Pipi constrói ao redor do frasco é o gateway.

[Video: AIVAX Learn #1 — O que é um gateway de IA?](https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 1 · 1 minuto*

## O que o vídeo mostra

Um **modelo de linguagem grande** (LLM) é um software treinado com uma enorme quantidade de texto. Ele lê, escreve e responde a praticamente qualquer coisa, razão pela qual Pipi o chama de um cérebro brilhante. Por si só, porém, ele tem três lacunas: não conhece sua empresa, não segue suas regras e não pode usar nenhuma ferramenta.

Três balões de pergunta flutuam até o frasco: "Minha empresa?", "Regras?", "Ferramentas?", e cada um deles esvazia. Pipi coloca um capacete de obra e monta uma máquina ao redor do frasco, uma parte por palavra:

- **Instruções** — Quem é o assistente e como ele deve se comportar, lido em todas as conversas.

- **Conhecimento** — Seus documentos, para que as respostas venham de fatos em vez de suposições.

- **Ferramentas** — Ações que o modelo pode solicitar, como consultar um pedido.

- **Segurança** — Moderação e regras que mantêm as respostas dentro dos limites.

- **Custos** — Limites e rastreamento de uso para que os gastos permaneçam previsíveis.

A máquina fica verde. Então vem a reviravolta: Pipi tira o cérebro rosa e conecta um azul. A máquina continua funcionando.

## Por que a reviravolta importa

Novos modelos surgem a cada poucos meses, e a melhor escolha para uma tarefa muda com o tempo. Quando instruções, conhecimento, ferramentas e segurança estão no gateway, e não no código da sua aplicação, alterar o modelo é apenas uma mudança de configuração. Seu site, seu número do WhatsApp e suas ferramentas internas continuam chamando o mesmo gateway.

Sua aplicação → Gateway de IA (instruções, conhecimento, ferramentas, segurança, custos) → Modelo de linguagem → Resposta

Na AIVAX, você envia o ID do gateway no campo `model` de uma solicitação compatível com OpenAI, e a AIVAX aplica tudo o que está armazenado nele. Quem gerencia o gateway controla o comportamento; a aplicação apenas envia mensagens.

## Aprofunde-se

- Em Aprender: [O que é um LLM](https://docs.aivax.net/pt-br/learn/agents/what-is-an-llm.md), [De LLMs a agentes](https://docs.aivax.net/pt-br/learn/agents/from-llms-to-agents.md) e [Famílias de modelos e como escolher](https://docs.aivax.net/pt-br/learn/models/model-families-and-choosing.md).
- Na Documentação: [Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) explica o que um gateway armazena e uma configuração recomendada para produção. O [Visão geral](https://docs.aivax.net/pt-br/docs/overview.md) mostra quando chamar um modelo diretamente.

O próximo episódio abre a primeira parte da máquina: o crachá de instruções e a prateleira de habilidades.

**Verifique seu conhecimento.** Na máquina de Pipi, o que o gateway faz?

1. O gateway treina um novo modelo com seus dados
2. O gateway armazena instruções, conhecimento, ferramentas e segurança ao redor do modelo, permitindo que o modelo seja substituído
3. O gateway é uma versão mais rápida do mesmo modelo

Answer: option 2. O gateway não altera o modelo em si. Ele mantém a configuração ao redor dele, é por isso que Pipi pode trocar o cérebro e a máquina continua funcionando.
