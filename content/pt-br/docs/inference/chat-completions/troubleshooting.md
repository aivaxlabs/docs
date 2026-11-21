---
{title: Solução de Problemas de Inferência,linkTitle: Solução de problemas,weight: 150,group: Inference,sourceHash: f9297103e48ac7e5,aliases: [/docs/pt-br/inference/chat-completions/troubleshooting.html]}
---

# Solução de problemas de inferência

A AIVAX utiliza dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta da AIVAX contendo um erro ou um valor `data` bem-sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou gateway e remova parâmetros não suportados da solicitação. Um identificador de recurso malformado no caminho é uma solicitação inválida, não um erro do servidor. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada por meio da configuração do SDK. |
| `402 Payment Required` | Revise [Preços](/docs/pt-br/pricing.md) e confirme se a conta está pronta para uma cobrança. |
| `403 Forbidden` | Confirme se o tipo de chave, o modelo ou o recurso selecionado permite essa operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Planos e limites](/docs/pt-br/limits.md) antes de aumentar o volume de solicitações. Se a mensagem indicar que a cota do modelo de assinatura foi esgotada, ela será renovada um mês após a primeira solicitação que a utilizou; use outro modelo enquanto isso. Consulte [Cota mensal do modelo de assinatura](/docs/pt-br/limits.md#monthly-subscription-model-quota). |
| `500 Internal Server Error` | Ocorreu uma falha inesperada na AIVAX. Tente novamente mais tarde; a resposta não inclui detalhes internos. |
| `503 Service Unavailable` | Um serviço do qual a AIVAX depende está temporariamente indisponível. Tente novamente após o intervalo indicado no cabeçalho `Retry-After`. |
| `524` ou tempo limite do proxy | A solicitação demorou mais do que o permitido pelo proxy enquanto a AIVAX ainda a processava. Envie-a para o [host de inferência direto](/docs/pt-br/overview.md#long-running-inference) com um tempo limite de cliente maior. |

Se a solicitação continuar falhando, verifique nesta ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. A chave de API está disponível para seu processo e é uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada, para que você possa isolar problemas de configuração.

## Erros durante o streaming

Após o início de um stream, o status HTTP já é `200`. Uma falha é relatada como um último chunk com `finish_reason: "error"` e um objeto `error` contendo `code` e `message`, seguido por `[DONE]`. Verifique esse chunk em vez de confiar no código de status; consulte [Streaming](streaming.md#errors-during-a-stream).

Para modelos integrados, os detalhes do erro do provedor não são retornados; a mensagem indica que o provedor está indisponível. Para gateways que usam sua própria chave de provedor, a mensagem de erro do provedor é retornada conforme está.

## Problemas comuns

| Sintoma | O que verificar |
| --- | --- |
| O modelo ignora uma imagem, áudio ou arquivo. | O modelo pode não suportar essa modalidade, ou o gateway possui `DisableMultiModalInput`. Consulte [Entrada e multimodalidade](input-and-multimodality.md#when-a-multimodal-request-fails). |
| `Failed to generate a valid JSON response.` | O JSON Healing atingiu seu limite de tentativas. Simplifique o esquema ou as instruções antes de aumentar `max_attempts`; consulte [JSON Healing](/docs/pt-br/inference/structured-responses/json-healing.md). |
| O modelo repete chamadas de ferramentas de rodadas anteriores. | A solicitação não reutiliza o mesmo `conversation_token`, ou o estado expirou. Consulte [Reutilização de sessão](session-reuse.md). |
| `The 'X' parameter is not allowed with public API keys.` | Chaves públicas aceitam um conjunto reduzido de campos. Consulte [Limites](limits.md#public-api-keys). |
| Uma conversa falha subitamente com um erro de tamanho de mensagem. | A conversa excedeu o limite de contexto do gateway ou o teto do plano Gratuito. Consulte [Limites](limits.md#context-window). |
| Uma solicitação roteada falha embora o modelo exista. | Não resta nenhum provedor elegível após o roteamento, ZDR ou regras de provedores especiais. Consulte [Configuração de roteamento](/docs/pt-br/inference/routing/setup-routing.md). |
