Source: https://docs.aivax.net/pt-br/docs/generations/images.html

# Geração de Imagens

Use a Geração de Imagens para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicativo. Os usos típicos incluem ilustrações preliminares para revisão editorial, mockups de produtos, variações de marketing para testes A/B e arte provisória que um designer aprimora posteriormente.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo

Selecione um modelo de geração de imagem disponível para a conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto, obtenha as opções atuais na plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estiverem disponíveis, compare-os por capacidade:

- **Imagens de referência:** apenas alguns modelos aceitam `referenceImages`.
- **Variações:** decida quantas imagens você precisa por prompt; `count` aceita de 1 a 4.
- **Tempo de espera:** as solicitações de imagem em alguns modelos levam algum tempo. Para esses casos, envie a solicitação para `https://direct.inference.aivax.net` e aumente o tempo limite do cliente, conforme descrito em [inferência de longa duração](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference).

## Gerar uma imagem

Use prompts que descrevam o resultado necessário em vez de depender de rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, o ambiente, o enquadramento e qualquer texto que deva estar presente. Uma solicitação pode conter um único prompt ou uma matriz de prompts. Cada prompt gera `count` imagens, e seus URLs retornam agrupados por prompt de entrada.

Controle a saída com estes campos opcionais:

- `size`: as dimensões da imagem, seja como uma string `"1024x1024"` ou como `{ "width": 1024, "height": 1024 }`. Cada lado deve ter entre 64 e 4096 pixels. O padrão é 1080×1920. O modelo pode ajustar o tamanho para as dimensões que suporta, portanto, verifique a imagem entregue.
- `format`: `png`, `jpeg` ou `webp`. Quando omitido, a imagem mantém o formato produzido pelo modelo.
- `quality`: um inteiro de 1 a 100 que define a qualidade de codificação do `jpeg` ou `webp`. Não tem efeito sobre `png`. Quando a imagem é convertida e `quality` é omitido, usa-se 90.

Cada grupo de prompt retorna `images`, os URLs das imagens entregues, e `outputs`, uma entrada por imagem solicitada na ordem da solicitação. Cada entrada possui o `url` da imagem, o `cost` cobrado por ela e, quando falhou, uma mensagem de `error` com um URL `null`. O `cost` do grupo é a soma cobrada para esse prompt. Uma solicitação pode ser bem-sucedida com algumas imagens falhas, portanto, verifique `outputs` em vez de assumir que `images` tem entradas `count`.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado for compatível e a saída deve seguir um sujeito, estilo ou composição existentes. As referências orientam o resultado; elas não garantem a preservação da identidade, portanto, inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo não intencional antes do lançamento. Quando o primeiro resultado estiver próximo, mas não correto, itere ajustando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — em vez de reescrever todo o prompt de uma vez.

A referência embutida é a fonte da verdade para a forma da solicitação, opções suportadas e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20images)

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Preços, limites e erros

A geração de imagens é cobrada por imagem entregue, com uma cobrança adicional por imagem de referência em alguns modelos. Saídas falhas ou não entregues não são cobradas. Cada saída é precificada pela tarifa fixa de saída do modelo selecionado, mais a tarifa por referência desse modelo para cada imagem de referência enviada com ela. O processamento do prompt está incluído. Para provedores precificados por token e megapixel, a cobrança usa estimativas arredondadas para cima, em vez de repasse exato do custo do provedor. Nenhuma taxa adicional de markup de geração de imagem da AIVAX ou multiplicador de conta e plano se aplica. As tarifas atuais para cada modelo estão listadas no catálogo de Modelos.

A ferramenta integrada de geração e edição de imagens tem um limite diário que depende do plano; consulte [Limites de ferramentas integradas e pesquisa web](https://docs.aivax.net/pt-br/docs/limits.md#built-in-tools-and-web-search).

Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
