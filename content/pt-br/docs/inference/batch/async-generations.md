---
{title: Gerações Assíncronas,linkTitle: Gerações assíncronas,weight: 20,group: Batch Processing,sourceHash: cd074617c50cd492,aliases: [/docs/pt-br/inference/batch/async-generations.html]}
---

# Gerações Assíncronas

As gerações assíncronas colocam uma única solicitação de API em fila e a executam em segundo plano. Em vez de manter uma conexão aberta até que o resultado esteja pronto, você recebe um ID e, em seguida, busca o resultado armazenado mais tarde ou permite que o AIVAX notifique seu serviço quando estiver concluído.

Use gerações assíncronas quando uma solicitação for lenta, quando um chamador não puder manter uma conexão aberta ou quando muitas solicitações independentes devem ser executadas sem controle de concorrência no lado do cliente. Use [Workflows em lote](workflows.md) quando a mesma instrução deve ser aplicada a uma lista de entradas com validação, tentativas repetidas e exportação.

## Colocar uma solicitação em fila

Adicione `async` ao corpo de qualquer [solicitação suportada](#supported-endpoints). O restante do corpo é igual ao da solicitação síncrona.

```json
{
  "model": "@openai/gpt-6-luna#cheapest",
  "messages": [{ "role": "user", "content": "Summarize this report." }],
  "async": true
}
```

Nada é gerado enquanto a solicitação estiver aberta. O AIVAX a valida, coloca em fila e retorna HTTP `202`:

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

Use a forma de objeto para rotular o item, registrar webhooks ou alterar o tempo limite:

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
| `enabled` | Defina como `true` para colocar a solicitação em fila. |
| `tags` | Até 16 rótulos, cada um com 1–64 caracteres. Use-os para encontrar itens posteriormente. |
| `webhooks` | Até 4 URLs HTTP ou HTTPS públicos notificados quando o item estiver concluído. Consulte [Webhooks](#webhooks). |
| `timeout` | Segundos permitidos para cada tentativa de execução, de 10 a 3.600. O padrão é 3.600. |

`"async": true` é o mesmo que `{ "enabled": true }`. As tags também podem ser enviadas como um array `async_tags` de nível superior.

### Restrições

- `async` não pode ser combinado com `stream: true`; a solicitação falha com `400`.
- A colocação em fila não está disponível com [chaves de API públicas](/docs/pt-br/authentication.md#public-keys).
- Uma conta pode desativar o recurso com o parâmetro de conta **Gerações assíncronas**, que está ativado por padrão. Enquanto estiver desativado, as solicitações de colocação em fila falham com `403`, e os itens já colocados em fila aguardam até que seja reativado.
- Cada plano limita quantos itens uma conta pode colocar em fila por hora. Consulte [Limites de testes em lote e agênticos](/docs/pt-br/limits.md#batch-and-agentic-tests).

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

Os itens em fila são executados na ordem em que foram colocados.

Quando um item é executado, o AIVAX executa a solicitação original exatamente como enviada: o mesmo endpoint e o mesmo corpo. O resultado é armazenado com o código de status HTTP original, tipo de conteúdo e custo, para que uma geração com falha seja armazenada como um resultado com erro, em vez de como um erro da plataforma.

Um item passa pelos seguintes status:

| Status | Significado |
| --- | --- |
| `pending` | Em fila e aguardando execução. |
| `retrying` | Uma tentativa anterior falhou com um erro retryable e outra tentativa está agendada. |
| `processing` | Executando agora. |
| `done` | Concluído. O resultado armazenado pode ser um sucesso ou um erro; verifique seu código de status. |
| `cancelled` | Cancelado por você. Não será executado novamente. |

### Tentativas repetidas (Retries)

Essas falhas são retryadas até 3 vezes:

- saldo insuficiente;
- limitação de taxa (rate limiting);
- serviço indisponível ou outros erros de servidor (`5xx`).

Quando as tentativas repetidas se esgotam, o item termina como `done` com o código de status de erro da última tentativa. Mantenha o saldo da conta recarregado antes de colocar grandes volumes de trabalho em fila.

Outros resultados são finais:

- Uma tentativa que excede seu `timeout` é armazenada com status `408` e não é retryada.
- Uma resposta maior que 12 MB não é armazenada; o item termina com status `507`.
- Quando a chave de API que colocou o item em fila foi excluída ou expirou antes que o item fosse executado, o item termina com status `401`.

### Retenção

Os itens são excluídos automaticamente:

| Item | Excluído |
| --- | --- |
| `pending` ou `retrying` | 15 dias após a criação. |
| `cancelled` | 1 hora após o cancelamento. |
| `done` | 90 dias após a conclusão. |

Busque e armazene os resultados de que você precisa antes que eles expirem.

## Webhooks

Quando um item atinge `done`, o AIVAX envia uma solicitação `POST` com um corpo JSON para cada URL em `webhooks`:

```json
{
  "id": "<generation-id>",
  "status": "done"
}
```

A notificação não carrega nenhum resultado nem desfecho, portanto `done` também cobre um erro armazenado. Use o `id` para [buscar o resultado](#manage-queued-generations) com sua chave de API e verifique seu código de status.

As URLs dos webhooks devem ser URLs HTTP ou HTTPS públicos. Quando a conta possui uma chave de hook, cada solicitação inclui `X-Request-Nonce`; verifique-a conforme descrito em [Autenticação de Hook](/docs/pt-br/authentication.md#hook-authentication) antes de confiar na notificação.

A entrega não é retryada. Se o seu serviço puder ficar indisponível, também faça polling do [endpoint de lista](#manage-queued-generations) para itens `done`.

Para um exemplo em Python que coleta os resultados por tag, reenfileira só as falhas e verifica o nonce do webhook, veja [Async LLM API: queue the request, get an ID, fetch the result later](https://aivax.net/blog/async-llm-api-queue-request-fetch-result-later/).

## Gerenciar gerações em fila

Autentique solicitações de gerenciamento com uma chave de API do AIVAX. Todas as rotas estão sob `/api/v1/async-generations`.

| Solicitação | Descrição |
| --- | --- |
| `GET /api/v1/async-generations` | Lista itens como resumos, sem corpos de solicitação ou resposta. Filtre com `status`, `tags` (separados por vírgula; um item deve ter todos eles), `limit` (padrão 50, máximo 100) e `offset`. |
| `GET /api/v1/async-generations/<id>` | Retorna o item com sua solicitação e resposta. Corpos JSON são incorporados como JSON; outros conteúdos são retornados como base64. |
| `GET /api/v1/async-generations/<id>/response` | Retorna a resposta armazenada conforme foi produzida, com seu código de status e tipo de conteúdo originais. Use-a para consumir o resultado como se a solicitação tivesse sido síncrona. |
| `PUT /api/v1/async-generations/<id>/cancel` | Cancela um item que está `pending`, `retrying` ou `done` com um código de status de erro. Qualquer outro item retorna `409`. |
| `PUT /api/v1/async-generations/cancel?scope=<scope>` | Cancela em massa. `scope` é `pending`, `failed` ou `all`. |
| `DELETE /api/v1/async-generations/<id>` | Exclui um item. Retorna `409` enquanto estiver `processing`. |

Por exemplo, para listar os itens concluídos rotulados para um trabalho noturno:

```text
GET /api/v1/async-generations?status=done&tags=nightly-report&limit=100
```

## Reduzir custos

O trabalho em fila raramente precisa do provedor mais rápido. Combine gerações assíncronas com roteamento mais barato: adicione o sufixo `#cheapest` a um nome de modelo integrado ou defina `routing_options.preset` como `Cheapest`. Consulte [Roteamento inline](/docs/pt-br/inference/routing/inline-routing.md) e [Configuração de roteamento de provedor](/docs/pt-br/inference/routing/setup-routing.md).

```json
{
  "model": "@openai/gpt-6-luna",
  "routing_options": { "preset": "Cheapest" },
  "messages": [{ "role": "user", "content": "Classify this ticket." }],
  "async": { "enabled": true, "tags": ["triage"] }
}
```
