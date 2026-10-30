Source: https://docs.aivax.net/pt-br/docs/generations/images.html

# Geração de Imagem

Use a Geração de Imagem para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicação. Os usos típicos incluem rascunhos de ilustrações para revisão editorial, maquetes de produtos, variações de marketing para testes A/B e arte de espaço reservado que um designer refina posteriormente.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo

Selecione um modelo de geração de imagem disponível na conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto obtenha as opções atuais na plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estão disponíveis, compare-os por capacidade:

- **Imagens de referência:** apenas alguns modelos aceitam `referenceImages`.
- **Variações:** decida quantas imagens você precisa por prompt; `count` aceita de 1 a 4.
- **Tempo de espera:** solicitações de imagem em alguns modelos levam um tempo. Para esses, envie a solicitação para `https://direct.inference.aivax.net` e aumente o timeout do cliente, conforme descrito em [long-running inference](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference).

## Gere uma imagem

Use prompts que descrevem o resultado desejado em vez de depender de rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, o ambiente, a composição e qualquer texto que deve estar presente. Uma solicitação pode conter um único prompt ou um array de prompts. Cada prompt gera `count` imagens, e seus URLs são retornados agrupados pelo prompt de entrada.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída precisar seguir um assunto, estilo ou composição existente. As referências orientam o resultado; elas não garantem a preservação da identidade, portanto inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo indesejado antes do lançamento. Quando o primeiro resultado estiver próximo, mas não correto, itere apertando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — em vez de reescrever todo o prompt de uma só vez.

A referência incorporada é a fonte de verdade para a estrutura da solicitação, opções suportadas e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20images)

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Preços, limites e erros

A geração de imagem é cobrada por imagem entregue, com uma cobrança adicional por imagem de referência em alguns modelos. Saídas falhadas ou não entregues não são cobradas. Cada saída tem preço baseado na tarifa fixa de saída do modelo selecionado, mais a tarifa por referência desse modelo para cada imagem de referência enviada com ela. O processamento do prompt está incluído. Para provedores com preços por token ou megapixel, a cobrança usa estimativas arredondadas para cima em vez de repassar o custo exato do provedor. Não há markup adicional de geração de imagem AIVAX nem multiplicador de conta e plano. As tarifas atuais de cada modelo estão listadas no catálogo de Modelos.

A ferramenta integrada de geração e edição de imagem tem estes limites diários de plano:

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Geração e edição de imagem embutida | 5/day | 500/day | 5,000/day |

Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
