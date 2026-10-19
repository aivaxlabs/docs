---
{title: Geração de Imagens,linkTitle: geração de imagens,weight: 10,group: Media generation,sourceHash: 17f0ea275ffdd494,aliases: [/docs/pt-br/generations/images.html]}
---

# Geração de Imagens

Use a Geração de Imagens para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicativo. Usos típicos incluem rascunhos de ilustrações para revisão editorial, maquetes de produtos, variações de marketing para testes A/B e arte de espaço reservado que um designer refina posteriormente.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](/docs/pt-br/authentication) para orientações de autorização.

## Escolher um modelo

Selecione um modelo de geração de imagens disponível para a conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto obtenha as opções atuais da plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estão disponíveis, compare-os por capacidade:

- **Reference images:** apenas alguns modelos aceitam `referenceImages`.
- **Variations:** decida quantas imagens você precisa por prompt; `count` aceita de 1 a 4.
- **Wait time:** solicitações de imagens em alguns modelos demoram um pouco. Para esses, a API recomenda `direct.inference.aivax.net`.

## Gerar uma imagem

Use prompts que declarem o resultado que você precisa, em vez de depender de rótulos visuais vagos. Inclua os detalhes importantes, como assunto, ambiente, enquadramento e qualquer texto que deve estar presente. Uma solicitação pode conter um único prompt ou um array de prompts. Cada prompt gera `count` imagens, e seus URLs são retornados agrupados por prompt de entrada.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída precisar seguir um assunto, estilo ou composição existentes. As referências orientam o resultado; elas não garantem a preservação da identidade, portanto inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo não intencional antes da liberação. Quando o primeiro resultado estiver próximo, não correto, itere afinando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — em vez de reescrever todo o prompt de uma só vez.

A referência incorporada é a fonte da verdade para a forma da solicitação, opções suportadas e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](/docs/pt-br/mcp-utilities/media-generation-mcp).

## Preços, limites e erros

A geração de imagens é cobrada por imagem entregue, com um custo adicional por imagem de referência em alguns modelos. Saídas falhas ou não entregues não são cobradas. Cada saída tem preço baseado na tarifa fixa de saída do modelo selecionado, mais a tarifa por referência desse modelo para cada imagem de referência enviada com ela. O processamento do prompt está incluído. Para provedores com preço por token ou megapixel, a cobrança usa estimativas arredondadas para cima, em vez de repassar o custo exato do provedor. Não há markup adicional de geração de imagens AIVAX nem multiplicador de conta e plano. As tarifas atuais de cada modelo estão listadas no catálogo de Modelos.

A ferramenta integrada de geração e edição de imagens tem os seguintes limites diários de plano:

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Geração e edição de imagens embutidas | 5/dia | 500/dia | 5.000/dia |

Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
