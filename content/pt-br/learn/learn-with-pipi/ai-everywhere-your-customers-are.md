---
{title: IA em todos os lugares onde seus clientes estão,linkTitle: "#7 Canais",description: "Os clientes escrevem no site, WhatsApp e Telegram. O Pipi mostra um único gateway atendendo todos os canais, de modo que uma regra alterada uma vez se aplica em todos os lugares.",weight: 70,duration: 5,objectives: [Explique o que é um canal.,Descreva um cliente de chat para um site.,"As integrações de mensagens se conectam ao mesmo gateway atuando como intermediários que padronizam a comunicação entre diferentes plataformas (como WhatsApp, Telegram, Instagram, etc.) e um sistema central. O gateway funciona como um ponto único de entrada e saída, permitindo que todas as mensagens sejam roteadas, processadas e gerenciadas de forma unificada, independentemente da plataforma de origem ou destino. Isso simplifica a integração, reduz a complexidade técnica e garante consistência na entrega e no recebimento de mensagens.",Reconheça por que um gateway para todos os canais mantém as respostas consistentes.],sourceHash: 75ca843ac26f2e07}
---

Os clientes estão no site, no WhatsApp e no Telegram. A primeira reação do Pipi é construir um cérebro para cada um deles. Que trabalho enorme.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/07-canais.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/07-canais.webp" title="AIVAX Learn #7 — IA em todos os lugares onde seus clientes estão" lang="pt-BR" caption="Episódio 7 · 1 minuto e 15 segundos" >}}

## O que o vídeo mostra

Três potes clonados aparecem, um por canal, e depois desaparecem. No AIVAX, há apenas um cérebro: a mesma porta de entrada (gateway) atende todos os **canais**. Um canal é simplesmente onde o cliente está conversando, e cada um é apenas uma porta diferente para o mesmo pote.

{{< cards >}}
{{< card title="Site: cliente de chat" icon="chat" >}}A janela de conversa no seu site, com suas cores, seu nome e botões de sugestão, além de um limite de mensagens para ninguém abusar.{{< /card >}}
{{< card title="WhatsApp e Telegram: integrações" icon="message" >}}A mensagem chega pelo telefone, o gateway responde e a resposta volta para a mesma conversa.{{< /card >}}
{{< card title="Um único gateway" icon="robot" >}}Instruções, conhecimento, ferramentas e segurança ficam em um só lugar e atendem todas as portas.{{< /card >}}
{{< /cards >}}

A melhor parte vem no final. Pipi altera a etiqueta do pote para *"Hoje: frete grátis!"*, e a nova resposta aparece nos três canais ao mesmo tempo. Altere uma regra uma vez, e ela se aplica em todos os lugares.

## O que muda por canal

O conteúdo do gateway deve permanecer o mesmo, mas cada canal tem seus próprios hábitos. Uma resposta no WhatsApp costuma ser mais curta, uma janela no site pode mostrar botões, e cada canal identifica o cliente de maneira diferente: uma sessão no site, um número de telefone ou ID de chat em aplicativos de mensagem. No AIVAX, o cliente de chat lida com esses detalhes da sessão, enquanto o gateway mantém o comportamento.

{{< flow "Site · WhatsApp · Telegram | Cliente de chat ou integração | Mesmo gateway de IA | Resposta de volta no mesmo canal" >}}

## Aprofunde-se

- Em Aprender: [Integrando canais: WhatsApp, chat web, e-mail, voz](../tools-and-integrations/integrating-channels.md), [Webhooks, eventos e automações](../tools-and-integrations/webhooks-events-and-automations.md) e [Agente de suporte ao cliente, passo a passo](../guides/customer-support-agent.md).
- Na Documentação: [Clientes de chat](../../docs/inference/chat-clients.md) explica sessões, limites, aparência e as integrações do Telegram e WhatsApp. [Gateways de IA](../../docs/inference/ai-gateways/concepts.md) é onde o comportamento compartilhado reside.

Isso encerra a série até agora. Pipi vai tirar uma soneca; os outros módulos de Aprendizado cobrem cada uma dessas ideias em profundidade.

{{< quiz options="Atualize as instruções em cada canal separadamente | Altere uma vez no gateway, e todo canal usa a nova regra | Crie um novo gateway para a promoção" answer="2" explanation="Todos os canais são portas para o mesmo gateway, então uma única alteração alcança o site, o WhatsApp e o Telegram juntos." >}}
A padaria inicia uma promoção de frete grátis. De acordo com o vídeo, como você atualiza o assistente?
{{< /quiz >}}
