---
{title: Geração de Imagens,linkTitle: Geração de imagens,weight: 10,group: Media generation,sourceHash: 7ea9a2ada5c885eb,aliases: [/docs/pt-br/generations/images.html]}
---

# Geração de Imagens

Use a Geração de Imagens para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicativo. Os usos típicos incluem ilustrações preliminares para revisão editorial, mockups de produtos, variações de marketing para testes A/B e arte temporária que um designer aperfeiçoa posteriormente.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](/docs/pt-br/authentication) para orientações sobre autorização.

## Escolha um modelo

Selecione um modelo de geração de imagem disponível para a conta autenticada. A disponibilidade e as capacidades dos modelos podem mudar, portanto, obtenha as opções atuais da plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estiverem disponíveis, compare-os por capacidade:

- **Imagens de referência:** apenas alguns modelos aceitam `referenceImages`.
- **Variações:** decida quantas imagens você precisa por prompt; `count` aceita valores de 1 a 4.
- **Tempo de espera:** as solicitações de imagem em alguns modelos levam um tempo considerável. Para esses casos, envie a solicitação para `https://direct.inference.aivax.net` e aumente o tempo limite do cliente, conforme descrito em [inferência de longa duração](../overview.md#long-running-inference).

## Gerar uma imagem

Use prompts que descrevam o resultado necessário, em vez de depender de rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, o ambiente, o enquadramento e qualquer texto que deva estar presente. Uma solicitação pode conter um único prompt ou uma matriz de prompts. Cada prompt gera `count` imagens, e seus URLs retornam agrupados por prompt de entrada.

Controle a saída com estes campos opcionais:

- `size`: as dimensões da imagem, seja como uma string `"1024x1024"` ou como `{ "width": 1024, "height": 1920 }`. Cada lado deve ter entre 64 e 4096 pixels. O padrão é 1080×1920. O modelo pode ajustar o tamanho para uma dimensão que suporte.
- `format`: `png`, `jpeg` ou `webp`. Quando omitido, a imagem mantém o formato produzido pelo modelo.
- `quality`: um inteiro de 1 a 100 que define a qualidade de codificação do `jpeg` ou `webp`. Não tem efeito sobre `png`. Quando a imagem é convertida e `quality` é omitido, usa-se 90.

Cada grupo de prompt retorna `images`, os URLs das imagens entregues, e `outputs`, uma entrada por imagem solicitada na ordem da solicitação. Cada entrada contém o `url` da imagem, o `cost` cobrado por ela e, quando falhou, uma mensagem de `error` com um URL nulo. O `cost` do grupo é a soma cobrada para aquele prompt. Uma solicitação pode ser bem-sucedida mesmo com algumas imagens falhas, portanto, verifique `outputs`.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída precisar seguir um assunto, estilo ou composição existentes. As referências orientam o resultado; elas não garantem a preservação da identidade, portanto, inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo não intencional antes do lançamento. Quando o primeiro resultado estiver próximo, mas não perfeito, itere ajustando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — em vez de reescrever todo o prompt de uma só vez.

A referência embutida é a fonte da verdade para a forma da solicitação, as opções suportadas e os campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para permitir que um agente ou IDE compatível com MCP gere imagens sem chamar este endpoint diretamente, use o [Media generation MCP](/docs/pt-br/mcp-utilities/media-generation-mcp). Para uma configuração do Claude Code, consulte [gerar imagens no Claude Code com um servidor MCP](https://aivax.net/blog/generate-images-and-speech-from-claude-code-with-mcp/).

## Preços, limites e erros

A geração de imagens é cobrada por imagem entregue, com uma cobrança adicional por imagem de referência em alguns modelos. Saídas falhas ou não entregues não são cobradas. O processamento do prompt está incluído, e nenhum multiplicador de conta ou plano se aplica. As tarifas atuais para cada modelo estão listadas no catálogo de Modelos.

A ferramenta integrada de geração e edição de imagens possui um limite diário que depende do plano; consulte [Limites de ferramentas integradas e pesquisa na web](/docs/pt-br/limits.md#built-in-tools-and-web-search).

Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
