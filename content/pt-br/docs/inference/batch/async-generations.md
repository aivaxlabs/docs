---
{title: Gerações Assíncronas,linkTitle: Gerações assíncronas,weight: 20,group: Batch Processing,sourceHash: 7d56e254ee408663,aliases: [/docs/pt-br/inference/batch/async-generations.html]}
---

# Gerações Assíncronas

As gerações assíncronas enfileiram uma única solicitação de API e a executam em segundo plano. Em vez de manter uma conexão aberta até que o resultado esteja pronto, você recebe um ID e, em seguida, busca o resultado armazenado mais tarde ou permite que a AIVAX notifique seu serviço quando terminar.

Use gerações assíncronas quando uma solicitação for lenta, quando um chamador não puder manter uma conexão aberta ou quando muitas solicitações independentes devem ser executadas sem controle de concorrência no lado do cliente. Use [Workflows em lote](workflows.md) quando a mesma instrução deve ser aplicada a uma lista de entradas com validação, tentativas repetidas (retries) e exportação.

## Enfileirar uma solicitação

Adicione `async` ao corpo de qualquer [solicitação suportada](#supported-endpoints). O restante do corpo é igual ao da solicitação síncrona.

```json
{
  "model": "@openai/gpt-6-luna#cheapest",
  "messages": [{ "role": "user", "content": "Summarize this report." }],
  "async": true
}
```

Nada é gerado enquanto a solicitação estiver aberta. A AIVAX a valida, enfileira e retorna HTTP `202`:

```json
{
  "message": "The generation was queued.",
  "data": {
    "async_generation": {
      "id": "<generation-id>",
      "status": "pending"
    }
  }
}
```

Guarde o `id`: ele identifica o item na [API de gerenciamento](#manage-queued-generations).

### Opções

Use a forma de objeto para marcar o item, registrar webhooks ou alterar o tempo limite:

```json
{
  "async": {
    "enabled": true,
    "tags": ["nightly-report", "customer-42"],
    "webhooks": ["https://example.com/hooks/async-generations"],
    "timeout": 300
  }
}
```

| Campo | Descrição |
| --- | --- |
| `enabled` | Defina como `true` para enfileirar a solicitação. |
| `tags` | Até 16 rótulos, cada um com 1–64 caracteres. Use-os para encontrar itens posteriormente. |
| `webhooks` | Até 4 URLs HTTP ou HTTPS públicos notificados quando o item estiver concluído. Consulte [Webhooks](#webhooks). |
| `timeout` | Segundos permitidos para cada tentativa de execução, de 10 a 3.600. O padrão é 3.600. |

`"async": true` é o mesmo que `{ "enabled": true }`. As tags também podem ser enviadas como um array `async_tags` de nível superior.

### Restrições

- `async` não pode ser combinado com `stream: true`; a solicitação falhará com `400`.
- O enfileiramento não está disponível com [chaves de API públicas](/docs/pt-br/authentication.md#public-keys).
- Uma conta pode desativar o recurso com o parâmetro de conta **Async generations**, que está ativado por padrão. Enquanto estiver desativado, as solicitações de enfileiramento falharão com `403`, e os itens já enfileirados aguardarão até que seja reativado.
- Cada plano limita quantos itens uma conta pode enfileirar por hora; acima desse limite, o enfileiramento retornará `429`. Consulte [Limites de testes em lote e agênticos](/docs/pt-br/limits.md#batch-and-agentic-tests).
- Um corpo de solicitação acima de 12 MB será rejeitado com `400`.

## Endpoints suportados

O mesmo campo `async` funciona nestas solicitações:

| Produto | Endpoint |
| --- | --- |
| [Completions de chat](/docs/pt-br/inference/chat-completions/concepts.md#async-generation) | `POST /v1/chat/completions` |
| [Respostas e Mensagens](/docs/pt-br/inference/ai-gateways/using-sdks.md#async-generation) | `POST /v1/responses`, `POST /v1/messages` |
| [Decisões semânticas](/docs/pt-br/data-processing/decisions.md#async-generation) | `POST /api/v1/generations/decisions` |
| [Extração](/docs/pt-br/data-processing/extraction.md#async-generation) | `POST /api/v1/generations/extract` |
| [Resumo](/docs/pt-br/data-processing/summarization.md#async-generation) | `POST /api/v1/generations/summarize` |
| [Traduções](/docs/pt-br/data-processing/translations.md#async-generation) | `POST /api/v1/generations/translate` |
| [Segmentação de texto](/docs/pt-br/data-processing/text-segmentation.md#async-generation) | `POST /api/v1/generations/segment` |
| [Classificação de texto](/docs/pt-br/data-processing/classification.md#async-generation) | `POST /api/v1/generations/classify` |
| [Geração de imagens](/docs/pt-br/generations/images.md#async-generation) | `POST /api/v1/generations/images` |
| [Fala para texto](/docs/pt-br/generations/audio-transcriptions.md#async-generation) | `POST /api/v1/generations/audio/transcriptions` |
| [Texto para fala](/docs/pt-br/generations/speech.md#async-generation) | `POST /api/v1/generations/speech` |
| [Testes Agênticos](/docs/pt-br/inference/agentic-tests.md#async-generation) | `POST /api/v1/generations/agentic-tests` |
| [Rerankers](/docs/pt-br/rag/reranking.md#async-generation) | `POST /api/v1/generations/rerank` |
| [Pesquisa na Web](/docs/pt-br/web-foundation/web-search.md#async-generation) | `POST /api/v1/web/search` |
| [Busca e OCR](/docs/pt-br/web-foundation/fetch-and-ocr.md#async-generation) | `POST /api/v1/web/fetch` |

## Como um item é executado

Os itens enfileirados são executados em segundo plano; não dependa deles terminarem na ordem em que foram enfileirados.

Quando um item é executado, a AIVAX executa a solicitação original exatamente como enviada: o mesmo endpoint e o mesmo corpo. O resultado é armazenado com o código de status HTTP original, tipo de conteúdo e custo, para que uma geração falha seja armazenada como um resultado falho, em vez de como um erro da plataforma.

Um item passa por estes status:

| Status | Significado |
| --- | --- |
| `pending` | Enfileirado e aguardando execução. |
| `retrying` | Uma tentativa anterior falhou com um erro retryable e outra tentativa está agendada. |
| `processing` | Executando agora. |
| `done` | Finalizado. O resultado armazenado pode ser um sucesso ou um erro; verifique seu código de status. |
| `cancelled` | Cancelado por você. Ele não será executado novamente. |

### Tentativas repetidas (Retries)

Falhas temporárias são retryadas automaticamente. Quando as tentativas se esgotam, o item termina como `done` com o código de status de erro da última tentativa.

Outros resultados são finais:

- Uma tentativa que excede seu `timeout` é armazenada com status `408` e não é retryada.
- Uma resposta maior que 12 MB não é armazenada; o item termina com status `507`.
- Quando a chave de API que enfileirou o item foi excluída ou expirou antes do item ser executado, o item termina com status `401`.

### Retenção

Os itens são excluídos automaticamente:

| Item | Excluído |
| --- | --- |
| `pending` ou `retrying` | 15 dias após a criação. |
| `cancelled` | 1 hora após o cancelamento. |
| `done` | 90 dias após a conclusão. |

Busque e armazene os resultados de que você precisa antes que eles expirem.

Um item mantém sua solicitação e resposta durante os períodos acima, mesmo quando o registro de conversas está desativado para a conta. Exclua itens de que você não precisa mais com a [API de gerenciamento](#manage-queued-generations).

## Webhooks

Quando um item atinge `done`, a AIVAX envia uma solicitação `POST` com um corpo JSON para cada URL em `webhooks`:

```json
{
  "id": "<generation-id>",
  "status": "done"
}
```

A notificação não carrega nenhum resultado nem desfecho, então `done` também cobre um erro armazenado. Use o `id` para [buscar o resultado](#manage-queued-generations) com sua chave de API e verifique seu código de status.

As URLs dos webhooks devem ser URLs HTTP ou HTTPS públicos. Quando a conta possui uma chave de hook, cada solicitação inclui `X-Request-Nonce`; verifique-o conforme descrito em [Autenticação de Hook](/docs/pt-br/authentication.md#hook-authentication) antes de confiar na notificação.

A entrega não é retryada. Se o seu serviço puder ficar indisponível, também faça polling no [endpoint de lista](#manage-queued-generations) para itens `done`.

Para um exemplo em Python que coleta resultados por tag, re-enfileira apenas as falhas e verifica o nonce do webhook, consulte [API LLM Assíncrona: enfileire a solicitação, obtenha um ID, busque o resultado mais tarde](https://aivax.net/blog/async-llm-api-queue-request-fetch-result-later/).

## Gerenciar gerações enfileiradas

Autentique solicitações de gerenciamento com uma chave de API da AIVAX. Todas as rotas estão sob `/api/v1/async-generations`.

| Solicitação | Descrição |
| --- | --- |
| `GET /api/v1/async-generations` | Lista itens como resumos, sem corpos de solicitação ou resposta. Filtre com `status`, `tags` (separados por vírgula; um item deve ter todos eles), `limit` (padrão 50, máximo 100) e `offset`. |
| `GET /api/v1/async-generations/<id>` | Retorna o item com sua solicitação e resposta. Corpos JSON são incorporados como JSON; outros conteúdos são retornados como base64. |
| `GET /api/v1/async-generations/<id>/response` | Retorna a resposta armazenada tal como foi produzida, com seu código de status e tipo de conteúdo originais. Use-a para consumir o resultado como se a solicitação tivesse sido síncrona. Retorna `404` até que o item tenha uma resposta armazenada. |
| `PUT /api/v1/async-generations/<id>/cancel` | Cancela um item que está `pending`, `retrying` ou `done` com um código de status de erro. Qualquer outro item retorna `409`. |
| `PUT /api/v1/async-generations/cancel?scope=<scope>` | Cancela em massa. `scope` é `pending`, `failed` ou `all`. |
| `DELETE /api/v1/async-generations/<id>` | Exclui um item. Retorna `409` enquanto estiver `processing`. |

Por exemplo, para listar os itens finalizados marcados para um trabalho noturno:

```text
GET /api/v1/async-generations?status=done&tags=nightly-report&limit=100
```

## Preços

Uma solicitação enfileirada custa o mesmo que a solicitação síncrona equivalente, e seu custo é armazenado junto com o resultado.

## Reduzir custos

O trabalho enfileirado raramente precisa do provedor mais rápido, portanto, as gerações assíncronas usam a [preferência de roteamento](/docs/pt-br/inference/routing/setup-routing.md) `Cheapest` por padrão. `Cheapest` pode selecionar [provedores especiais](/docs/pt-br/inference/routing/special-providers.md), que não são provedores de retenção zero de dados. Para favorecer velocidade ou qualidade para um item enfileirado, defina a preferência explicitamente com `routing_options.preset` ou um [sufixo de nome de modelo](/docs/pt-br/inference/routing/inline-routing.md):

```json
{
  "model": "@openai/gpt-6-luna",
  "routing_options": { "preset": "Fastest" },
  "messages": [{ "role": "user", "content": "Classify this ticket." }],
  "async": { "enabled": true, "tags": ["triage"] }
}
```
