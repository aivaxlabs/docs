Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateways/models-and-gateway-names.html

# Modelos e nomes de gateways

O campo `model` de `/v1/chat/completions` seleciona o que executa a solicitação. Ele aceita três tipos de valor:

| Valor | Exemplo | Executa |
| --- | --- | --- |
| Nome do modelo integrado | `@openai/gpt-5-mini` | O modelo diretamente, sem configuração de gateway. |
| ID completo do gateway | `<GATEWAY_UUID>` | O AI Gateway com esse ID. |
| Slug do gateway | `support:50c3` | O AI Gateway cujo slug corresponde, no formato `nome:id-final`. |

Os nomes dos modelos integrados começam com `@` e seguem o padrão `@criador/nome-do-modelo`. Liste-os com `GET /v1/models`; a mesma lista inclui os gateways da sua conta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Model%20listing)

Chaves de API públicas aceitam apenas o ID completo de um gateway. Slugs e nomes de modelos integrados são rejeitados; consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).

Um nome de modelo integrado pode conter um sufixo de roteamento de provedor, como `@openai/gpt-6-luna#cheapest`. Consulte [Roteamento inline](https://docs.aivax.net/pt-br/docs/inference/routing/inline-routing.md).

## Escolha um modelo para um gateway

Valide três pontos antes de colocar um modelo em produção:

- O modelo oferece suporte às modalidades de entrada que você pretende enviar, como imagem, áudio, vídeo ou arquivo. Caso contrário, ative o [pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md).
- O modelo oferece suporte à chamada de funções se o gateway usar ferramentas, RAG `QueryFunction`, MCP, funções de protocolo, habilidades ou ferramentas integradas.
- O modelo aceita os parâmetros que você configura. Alguns modelos integrados rejeitam preenchimento prévio do assistente, temperatura, sequências de parada ou esforço de raciocínio.

## Substituir um modelo

Um gateway permite alterar o modelo por trás de um nome estável, para que as aplicações cliente não precisem ser alteradas quando um modelo for descontinuado. Você ainda precisa qualificar a substituição com seus próprios prompts e ferramentas antes de fazer a troca. Para distinguir um modelo atual de um antigo, consulte [Modelos descontinuados](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md#deprecated-models).

Consulte [fixar um ID de modelo versus usar um alias](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/) para uma lista de verificação de substituição. Para o encerramento do GPT-4o e GPT-4.1 em 14 de janeiro de 2027, consulte [como migrar para gpt-6-luna](https://aivax.net/blog/migrate-gpt-4o-and-gpt-4-1-to-gpt-6-luna/). Para o encerramento do GPT-5 e o3 em 11 de dezembro de 2026, consulte [como migrar para GPT-5.6 Sol, Terra e Luna](https://aivax.net/blog/migrate-gpt-5-and-o3-to-gpt-5-6-before-december-11/).
