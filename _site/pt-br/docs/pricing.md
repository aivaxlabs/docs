Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

A AIVAX cobra o uso do saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página abrange as regras compartilhadas por todos os produtos.

Veja [preços de assinatura](https://aivax.net/pricing) para os preços dos planos mensais e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para as cotas em nível de conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo utilizado e o trabalho realizado.

## Preços por produto

| Área | Onde encontrar as tarifas |
| --- | --- |
| Inferência e moderação | [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#pricing) |
| Testes Agentic | [Testes Agentic](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#pricing-and-limits) |
| Voz e Realtime | [Voz e Realtime](https://docs.aivax.net/pt-br/docs/inference/voice-session.md#billing-and-limits) |
| Coleções RAG, busca e respostas | [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md#pricing-and-limits) |
| Media Injector | [Documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md#pricing-and-limits) |
| Busca na web e busca no X | [Busca na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) |
| Fetch e OCR | [Fetch e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) |
| Geração de imagens | [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) |
| Texto para fala e fala para texto | [Texto para fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) e [Fala para texto](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) |
| Descrições de mídia, decisões, classificação e segmentação | Páginas de [Processamento de dados](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) |
| Extração e resumo de documentos | [Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md) e [Resumo](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) |
| Traduções | [Traduções](https://docs.aivax.net/pt-br/docs/data-processing/translations.md) |
| Ferramentas e memória integradas | [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) |

## Cotas diárias incluídas

Todos os planos incluem cotas diárias para embeddings RAG, reclassificação Reflex, decisões semânticas e extração Fetch/OCR. O uso além da cota é cobrado nas tarifas do produto. Compare as cotas em [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). Essas cotas não cobrem a inferência de modelos de texto; veja [Modelos de assinatura](#modelos-de-assinatura).

## Modelos de assinatura

Pro, Max e Ultimate incluem uma cota mensal para modelos de assinatura, que são os modelos do catálogo cujos nomes começam com `@aivax-subscription/`. Usá-los nunca debita o saldo da conta; outros modelos são cobrados conforme suas tarifas. Quando a cota se esgota, ou em planos sem uma, as solicitações aos modelos de assinatura retornam `429 Too Many Requests`. Veja [Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md) e [Cota mensal de modelos de assinatura](https://docs.aivax.net/pt-br/docs/limits.md#monthly-subscription-model-quota).

## Armazenamento

Cada plano inclui armazenamento. No Pro, Max e Ultimate, o armazenamento além da quantidade incluída é cobrado pelas tarifas mensais abaixo; o armazenamento Free não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento Free | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excesso **$0,50/GB/mês** |
| Armazenamento Max | **10 GB incluídos**; excesso **$0,30/GB/mês** |
| Armazenamento Ultimate | **20 GB incluídos**; excesso **$0,20/GB/mês** |

## Cabeçalho de custo da solicitação

As respostas da API incluem um cabeçalho `Consumed-Credits` com o total cobrado pela solicitação em USD, por exemplo `Consumed-Credits: 0.000184`. O valor inclui o multiplicador do plano e todos os itens cobrados durante a solicitação. O cabeçalho é omitido quando nada foi cobrado; considere a ausência do cabeçalho como zero.

Respostas transmitidas (streamed) e trabalhos assíncronos, como [Batch](https://docs.aivax.net/pt-br/docs/inference/batch/workflows.md), não incluem esse cabeçalho. Use os registros de uso da sua conta como fonte da verdade para faturamento.

## Desconto por Compartilhamento de Dados

Contas que ativam o [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md) recebem um desconto de 10% nos embeddings de consulta RAG e na reclassificação enquanto o compartilhamento estiver habilitado.

## Multiplicadores de plano

As tarifas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência | Teto diário de inferência de modelos |
| --- | ---: | ---: |
| Free | +25% | $1,50 |
| Pro | +5% | $1,20 |
| Max | +2% | $1,00 |
| Ultimate | 0% | Não aplicável |

Uma vez que o imposto de inferência do dia atinge o teto, a inferência adicional de modelos naquele dia é cobrada apenas nas tarifas do modelo. Outros serviços incluem o multiplicador do plano em suas próprias tarifas.

O uso BYOK não é afetado pelos impostos de inferência. As páginas do produto indicam quando uma tarifa está isenta do multiplicador do plano, como na geração de imagens.

## Recargas de créditos

Adicionar créditos cobra o valor escolhido por você mais a taxa do processador de pagamentos e os [impostos sobre pagamentos](#impostos-sobre-pagamentos). Apenas o valor escolhido é adicionado ao seu saldo. No Free, uma taxa de serviço de 5% do valor, com um mínimo de $0,20, também é adicionada; planos pagos não pagam taxa de serviço. O painel mostra o total antes de você confirmar o pagamento.

## Impostos sobre pagamentos

Todo pagamento, incluindo recargas de créditos e assinaturas, inclui impostos brasileiros adicionados ao montante devido: cerca de 11,33% do total em impostos sobre serviços e 2% em IOF. Por exemplo, um pagamento de assinatura de $19,00 cobra $21,92. Os preços listados dos planos não incluem impostos, e cada recibo os lista.
