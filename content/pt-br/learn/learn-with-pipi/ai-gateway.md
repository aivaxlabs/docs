---
{title: O que é um gateway de IA?,linkTitle: "#1 Gateway de IA",description: "Pipi mostra por que um modelo de linguagem sozinho é apenas um cérebro brilhante em uma jarra, e como um gateway constrói tudo ao seu redor.",weight: 10,duration: 5,objectives: [Explique a diferença entre um modelo de linguagem e o gateway que o envolve.,"Os cinco elementos que um gateway adiciona a um modelo são:\n\n1. **Condição de entrada**: Define as condições necessárias para que o fluxo possa prosseguir através do gateway.\n2. **Condição de saída**: Especifica as condições sob as quais o fluxo pode seguir por um determinado caminho após o gateway.\n3. **Comportamento de sincronização**: Controla como múltiplos fluxos de entrada ou saída são combinados ou divididos (por exemplo, em gateways paralelos).\n4. **Comportamento de exclusão mútua**: Garante que apenas um entre vários caminhos possíveis seja escolhido com base em condições mutuamente exclusivas.\n5. **Comportamento de agregação**: Agrega resultados de múltiplos fluxos antes de permitir que o processo continue, garantindo que todas as tarefas concluídas sejam consideradas.","Um gateway permite que você troque modelos sem reconstruir o restante do sistema porque atua como uma camada de abstração entre a aplicação e os diferentes modelos de IA. Ele padroniza a interface de comunicação, expondo um único endpoint ou protocolo consistente (como REST ou gRPC) para todas as operações, independentemente do modelo subjacente.\n\nIsso significa que:\n\n1. **Desacoplamento**: A aplicação cliente não precisa saber qual modelo está sendo usado em tempo de execução. Ela só envia requisições no formato esperado pelo gateway.\n2. **Configuração centralizada**: A troca de modelo é feita apenas na configuração do gateway (por exemplo, alterando o nome do modelo ou o provedor), sem alterar o código da aplicação.\n3. **Compatibilidade de interface**: O gateway traduz as respostas dos diversos modelos para um formato unificado, garantindo que a aplicação continue funcionando mesmo após a mudança.\n\nAssim, a flexibilidade vem do isolamento das mudanças: só o gateway precisa ser atualizado com a nova configuração do modelo, enquanto o resto do ecossistema permanece intacto."],sourceHash: 2d5fc9ce2a5d013f}
---

No primeiro episódio, Pipi apresenta o desenho que toda a série reutiliza: um cérebro rosa dentro de um frasco de vidro. O cérebro é o modelo de linguagem. Tudo o que Pipi constrói ao redor do frasco é o gateway.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.webp" title="AIVAX Learn #1 — O que é um gateway de IA?" lang="pt-BR" caption="Episódio 1 · 1 minuto" >}}

## O que o vídeo mostra

Um **modelo de linguagem grande** (LLM) é um software treinado com uma enorme quantidade de texto. Ele lê, escreve e responde a praticamente qualquer coisa, razão pela qual Pipi o chama de um cérebro brilhante. Por si só, porém, ele tem três lacunas: não conhece sua empresa, não segue suas regras e não pode usar nenhuma ferramenta.

Três balões de pergunta flutuam até o frasco: "Minha empresa?", "Regras?", "Ferramentas?", e cada um deles esvazia. Pipi coloca um capacete de obra e monta uma máquina ao redor do frasco, uma parte por palavra:

{{< cards >}}
{{< card title="Instruções" icon="list-check" >}}Quem é o assistente e como ele deve se comportar, lido em todas as conversas.{{< /card >}}
{{< card title="Conhecimento" icon="book" >}}Seus documentos, para que as respostas venham de fatos em vez de suposições.{{< /card >}}
{{< card title="Ferramentas" icon="tools" >}}Ações que o modelo pode solicitar, como consultar um pedido.{{< /card >}}
{{< card title="Segurança" icon="shield" >}}Moderação e regras que mantêm as respostas dentro dos limites.{{< /card >}}
{{< card title="Custos" icon="coin" >}}Limites e rastreamento de uso para que os gastos permaneçam previsíveis.{{< /card >}}
{{< /cards >}}

A máquina fica verde. Então vem a reviravolta: Pipi tira o cérebro rosa e conecta um azul. A máquina continua funcionando.

## Por que a reviravolta importa

Novos modelos surgem a cada poucos meses, e a melhor escolha para uma tarefa muda com o tempo. Quando instruções, conhecimento, ferramentas e segurança estão no gateway, e não no código da sua aplicação, alterar o modelo é apenas uma mudança de configuração. Seu site, seu número do WhatsApp e suas ferramentas internas continuam chamando o mesmo gateway.

{{< flow "Sua aplicação | Gateway de IA (instruções, conhecimento, ferramentas, segurança, custos) | Modelo de linguagem | Resposta" >}}

Na AIVAX, você envia o ID do gateway no campo `model` de uma solicitação compatível com OpenAI, e a AIVAX aplica tudo o que está armazenado nele. Quem gerencia o gateway controla o comportamento; a aplicação apenas envia mensagens.

## Aprofunde-se

- Em Aprender: [O que é um LLM](../agents/what-is-an-llm.md), [De LLMs a agentes](../agents/from-llms-to-agents.md) e [Famílias de modelos e como escolher](../models/model-families-and-choosing.md).
- Na Documentação: [Gateways de IA](../../docs/inference/ai-gateways/concepts.md) explica o que um gateway armazena e uma configuração recomendada para produção. O [Visão geral](../../docs/overview.md) mostra quando chamar um modelo diretamente.

O próximo episódio abre a primeira parte da máquina: o crachá de instruções e a prateleira de habilidades.

{{< quiz options="O gateway treina um novo modelo com seus dados | O gateway armazena instruções, conhecimento, ferramentas e segurança ao redor do modelo, permitindo que o modelo seja substituído | O gateway é uma versão mais rápida do mesmo modelo" answer="2" explanation="O gateway não altera o modelo em si. Ele mantém a configuração ao redor dele, é por isso que Pipi pode trocar o cérebro e a máquina continua funcionando." >}}
Na máquina de Pipi, o que o gateway faz?
{{< /quiz >}}
