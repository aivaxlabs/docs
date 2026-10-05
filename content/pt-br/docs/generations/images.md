---
{title: Geração de Imagem,linkTitle: geração de imagem,weight: 300,group: Generations,sourceHash: 5b3b0139101c4bc0,aliases: [/docs/pt-br/generations/images.html]}
---

# Geração de Imagem

Use a Geração de Imagem para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicativo. Usos típicos incluem rascunhos de ilustrações para revisão editorial, maquetes de produtos, variações de marketing para testes A/B e arte de espaço reservado que um designer refina depois.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](/docs/pt-br/authentication) para orientações de autorização.

## Escolha um modelo

Selecione um modelo de geração de imagem disponível para a conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto obtenha as opções atuais da plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estiverem disponíveis, decida pela capacidade: se você precisa de suporte a imagem de referência (apenas alguns modelos aceitam `referenceImages`), quantas variações por prompt você precisa (`count` aceita de 1 a 4) e quanto tempo seu aplicativo pode aguardar — solicitações de imagem em alguns modelos demoram, caso em que a API recomenda `direct.inference.aivax.net`.

## Gere uma imagem

Use prompts que descrevam o resultado que você precisa, em vez de depender de rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, ambiente, enquadramento e qualquer texto que deve estar presente. Uma solicitação pode conter um único prompt ou um array de prompts, e cada prompt gera `count` imagens cujas URLs são retornadas agrupadas por prompt de entrada.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída precisar seguir um assunto, estilo ou composição existentes. As referências orientam o resultado; elas não garantem preservação de identidade, portanto inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo indesejado antes do lançamento. Quando o primeiro resultado estiver próximo, não correto, itere apertando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — em vez de reescrever todo o prompt de uma só vez.

A referência incorporada é a fonte de verdade para a forma da solicitação, opções suportadas e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](/docs/pt-br/mcp-utilities/media-generation-mcp).

## Preços, limites e erros

O catálogo de Modelos lista um preço fixo por imagem de saída e, quando aplicável, um preço por imagem de referência. A cobrança é o número de saídas entregues multiplicado pelo preço de saída mais o preço de referência para cada referência enviada com cada saída. Por exemplo, duas saídas usando três referências custam `2 × (preço de saída + 3 × preço de referência)`. Um preço de referência zero significa que as referências não têm cobrança separada.

Essas tarifas usam estimativas arredondadas onde o provedor cobra tokens ou megapixels; elas não são a cobrança exata do provedor por cada solicitação. O processamento do prompt está incluído na tarifa de saída, sem cobrança de token separada. Não há marcação de geração de imagem AIVAX ou multiplicador de preço de conta e plano. Apenas imagens entregues contam para a cobrança de imagem.

Para preços atuais, disponibilidade e limites de conta, veja [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits). Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
