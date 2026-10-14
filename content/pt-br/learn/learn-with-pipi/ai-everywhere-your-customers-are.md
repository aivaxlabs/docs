---
{title: IA em todo lugar onde seus clientes estão,linkTitle: "#7 Canais",description: "Os clientes escrevem no site, WhatsApp e Telegram. A Pipi mostra um gateway que serve todos os canais, então uma regra alterada uma vez se aplica em todo lugar.",weight: 70,duration: 5,objectives: [Explicar o que é um canal.,Descrever um cliente de chat para um site.,Explicar como as integrações de mensagens se conectam ao mesmo gateway.,Reconhecer por que um gateway para todos os canais mantém as respostas consistentes.],sourceHash: ff0739a1cf98974e}
---

Os clientes estão no site, no WhatsApp, no Telegram. A primeira reação da Pipi é construir um cérebro para cada um deles. Que trabalho enorme.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/07-canais.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/07-canais.webp" title="AIVAX Learn #7 — AI everywhere your customers are" lang="pt-BR" caption="Episódio 7 · 1 minuto e 15 segundos" >}}

## O que o vídeo mostra

Três frascos clonados aparecem, um por canal, e depois desaparecem. No AIVAX é um único cérebro: o mesmo gateway serve todo **canal**. Um canal é simplesmente onde o cliente está conversando, e cada um é apenas uma porta diferente para o mesmo frasco.

{{< cards >}}
{{< card title="Site: cliente de chat" icon="chat" >}}A janela de conversa no seu site, com sua cor, seu nome e botões de sugestão, mais um limite de mensagens para que ninguém abuse.{{< /card >}}
{{< card title="WhatsApp e Telegram: integrações" icon="message" >}}A mensagem chega do telefone, o gateway responde, e a resposta volta para a mesma conversa.{{< /card >}}
{{< card title="Um gateway" icon="robot" >}}Instruções, conhecimento, ferramentas e segurança vivem em um só lugar e atendem a todas as portas.{{< /card >}}
{{< /cards >}}

A melhor parte vem ao final. A Pipi muda o selo no frasco para *"Hoje: frete grátis!"*, e a nova resposta aparece nos três canais simultaneamente. Altere uma regra uma vez, e ela se aplica em todo lugar.

## O que muda por canal

O conteúdo do gateway deve permanecer o mesmo, mas cada canal tem seus próprios hábitos. Uma resposta no WhatsApp costuma ser mais curta, a janela do site pode mostrar botões, e cada canal identifica o cliente de forma diferente: uma sessão no site, um número de telefone ou ID de chat nos aplicativos de mensagem. No AIVAX, o cliente de chat lida com esses detalhes de sessão, enquanto o gateway mantém o comportamento.

{{< flow "Site · WhatsApp · Telegram | Cliente de chat ou integração | Mesmo gateway de IA | Responder no mesmo canal" >}}

## Aprofunde‑se

- Na Learn: [Integração de canais: WhatsApp, chat web, e‑mail, voz](../tools-and-integrations/integrating-channels.md), [Webhooks, eventos e automações](../tools-and-integrations/webhooks-events-and-automations.md) e [Agente de suporte ao cliente, passo a passo](../guides/customer-support-agent.md).
- Na Documentação: [Clientes de chat](../../docs/features/chat-clients.md) explica sessões, limites, aparência e as integrações do Telegram e WhatsApp. [Gateways de IA](../../docs/inference/ai-gateway.md) é onde o comportamento compartilhado reside.

Isso encerra a série até agora. A Pipi vai tirar um cochilo; os outros módulos Learn cobrem cada uma dessas ideias em profundidade.

{{< quiz options="Atualizar as instruções em cada canal separadamente | Alterar uma vez no gateway, e cada canal usa a nova regra | Criar um novo gateway para a promoção" answer="2" explanation="Todos os canais são portas para o mesmo gateway, então uma única mudança atinge o site, WhatsApp e Telegram juntos." >}}
A padaria inicia uma promoção de frete grátis. De acordo com o vídeo, como você atualiza o assistente?
{{< /quiz >}}
