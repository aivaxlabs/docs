Source: https://docs.aivax.net/pt-br/docs/generations/images.html

# Geração de Imagens

Use a Geração de Imagens para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicação. Os usos típicos incluem ilustrações preliminares para revisão editorial, maquetes de produtos, variações de marketing para testes A/B e arte de espaço reservado que um designer refina posteriormente.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo

Selecione um modelo de geração de imagens disponível para a conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto obtenha as opções atuais na plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estão disponíveis, decida por capacidade: se você precisa de suporte a imagens de referência (apenas alguns modelos aceitam `referenceImages`), quantas variações por prompt você precisa (`count` aceita de 1 a 4) e quanto tempo sua aplicação pode aguardar — solicitações de imagem em alguns modelos demoram, caso em que a API recomenda `direct.inference.aivax.net`.

## Gerar uma imagem

Use prompts que indiquem o resultado desejado em vez de confiar em rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, ambiente, enquadramento e qualquer texto que deve estar presente. Uma solicitação pode conter um único prompt ou um array de prompts, e cada prompt gera `count` imagens cujas URLs são retornadas agrupadas pelo prompt de entrada.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída deve seguir um assunto, estilo ou composição existente. As referências orientam o resultado; elas não garantem a preservação da identidade, portanto inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo não intencional antes do lançamento. Quando o primeiro resultado estiver próximo, mas não correto, itere apertando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — ao invés de reescrever todo o prompt de uma vez.

A referência incorporada é a fonte de verdade para a estrutura da solicitação, opções suportadas e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20images)

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Preços, limites e erros

A geração de imagens é cobrada por imagem entregue, com uma cobrança adicional por imagem de referência em alguns modelos. Saídas falhas ou não entregues não são cobradas. Consulte [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md#voice-and-media) para saber como a cobrança é calculada e o catálogo de Modelos para a tarifa de cada modelo.

Para disponibilidade e limites da conta, veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md). Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
