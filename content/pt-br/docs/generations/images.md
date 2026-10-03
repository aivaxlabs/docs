---
{title: Geração de Imagens,linkTitle: Geração de imagens,weight: 290,group: Gerações,sourceHash: legacy-unverified,aliases: [/docs/pt-br/generations/images.html]}
---

# Geração de Imagens

Use a Geração de Imagens para criar imagens a partir de um prompt de texto em um fluxo de trabalho de aplicativo. Usos típicos incluem esboços de ilustrações para revisão editorial, maquetes de produtos, variações de marketing para testes A/B e arte de espaço reservado que um designer refina posteriormente.

Autentique solicitações com uma chave de API AIVAX. Consulte [Autenticação](/docs/pt-br/authentication) para orientações de autorização.

## Escolha um modelo

Selecione um modelo de geração de imagens disponível na conta autenticada. A disponibilidade e as capacidades do modelo podem mudar, portanto obtenha as opções atuais da plataforma em vez de depender de uma lista fixa neste guia.

Quando vários modelos estão disponíveis, decida por capacidade: se você precisa de suporte a imagens de referência (apenas alguns modelos aceitam `referenceImages`), quantas variações por prompt você precisa (`count` aceita de 1 a 4) e quanto tempo seu aplicativo pode esperar — solicitações de imagem em alguns modelos demoram, caso em que a API recomenda `direct.inference.aivax.net`.

## Gere uma imagem

Use prompts que declarem o resultado que você precisa, ao invés de confiar em rótulos visuais vagos. Inclua os detalhes importantes, como o assunto, ambiente, enquadramento e qualquer texto que deve estar presente. Uma solicitação pode conter um único prompt ou um array de prompts, e cada prompt gera `count` imagens cujas URLs são retornadas agrupadas pelo prompt de entrada.

Forneça até quatro imagens de referência HTTP(S) quando o modelo selecionado as suportar e a saída deve seguir um assunto, estilo ou composição existente. As referências orientam o resultado; elas não garantem preservação de identidade, portanto inspecione a saída antes de publicar.

Trate os ativos gerados como rascunhos e revise-os quanto à precisão, adequação à marca e conteúdo não intencional antes do lançamento. Quando o primeiro resultado estiver próximo, mas não correto, itere apertando um elemento de cada vez — detalhe do assunto, composição, restrição de estilo — ao invés de reescrever todo o prompt de uma vez.

A referência incorporada é a fonte da verdade para a forma da solicitação, opções suportadas e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para preços atuais, disponibilidade e limites de conta, veja [Preços](/docs/pt-br/pricing) e [Planos e Limites](/docs/pt-br/limits). Se uma solicitação falhar, revise o problema de validação relatado antes de tentar novamente.
