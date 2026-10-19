---
{title: Preços,linkTitle: Preços,weight: 30,group: Introduction,aliases: [/docs/pt-br/platform/account-balance.html,/docs/pt-br/pricing.html],sourceHash: dc209e16698ed52d}
---

# Preços

AIVAX cobra o uso ao saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página cobre as regras compartilhadas por todos os produtos: cotas de assinatura, armazenamento, o cabeçalho de custo da solicitação, o desconto de compartilhamento de dados e os multiplicadores de plano.

Consulte [subscription pricing](https://aivax.net/pricing) para preços mensais dos planos e [Plans and limits](limits.md) para cotas a nível de conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo usado e o trabalho realizado.

## Preços dos produtos

| Área | Onde encontrar as taxas |
| --- | --- |
| Inferência e moderação | [Inference](inference/inference.md#pricing) |
| Testes Agênicos | [Agentic Tests](inference/agentic-tests.md#pricing-and-limits) |
| Voz e em tempo real | [Voice and Realtime](inference/voice-session.md#billing-and-limits) |
| Coleções RAG, pesquisa e respostas | [Collections](rag/collections.md#pricing-and-limits) |
| Injetor de mídia | [Documents](rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](rag/reflex.md#pricing-and-limits) |
| Pesquisa na web e pesquisa X | [Web Search](web-foundation/web-search.md) |
| Buscar e OCR | [Fetch and OCR](web-foundation/fetch-and-ocr.md) |
| Geração de imagens | [Image generation](generations/images.md) |
| Texto para fala e fala para texto | [Text-to-speech](generations/speech.md) and [Speech-to-text](generations/audio-transcriptions.md) |
| Descrições de mídia, decisões, classificação e segmentação | [Data processing](data-processing/media-descriptions.md) páginas |
| Ferramentas integradas e memória | [Built-in tools](tools/builtin-tools.md) |

## Cotas diárias incluídas

Free, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas elegíveis e extração Fetch/OCR. As tarifas do produto se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por solicitação completa: um item que não cabe na cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique as exclusões em [Plans and limits](limits.md#included-daily-subscription-allowances). A cobertura de assinatura de LLM está atualmente desativada. Para saber o que cada cota cobre, veja [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluído**; sem expansão |
| Armazenamento Pro | **2 GB incluído**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluído**; excedente **$0.20/GB/mês** |

## Cabeçalho de custo da solicitação

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a solicitação cobra uso do saldo da sua conta. Seu valor é o total cobrado por aquela solicitação em USD, escrito como número decimal com ponto separador, por exemplo `Consumed-Credits: 0.000184`. Já inclui o multiplicador do plano e cobre todo item cobrado durante a solicitação, como inferência, embeddings, reranking e uso de ferramentas.

O cabeçalho é omitido quando a solicitação não cobra nada, incluindo solicitações rejeitadas por validação ou totalmente cobertas por uma cota de assinatura diária. Considere um cabeçalho ausente como zero.

O valor cobre apenas as cobranças registradas antes do envio da resposta. Uso registrado posteriormente, como trabalho assíncrono [Batch](inference/batch.md), não está incluído. Respostas em streaming enviam seus cabeçalhos antes da conclusão da geração, portanto não dependa desse cabeçalho para elas; leia o uso reportado ao final do stream. Use os registros de uso da sua conta como fonte de verdade para faturamento.

## Desconto de compartilhamento de dados

Contas que habilitam [Data Sharing](data-sharing.md) recebem um desconto de 10% no uso elegível de embeddings de consulta RAG e nas operações de reranking elegíveis realizadas enquanto o compartilhamento está ativado. Outros serviços mantêm seus preços regulares.

## Multiplicadores de plano

Taxas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência |
| --- | ---: |
| Free | +25% |
| Pro | +5% |
| Max | 0% |

O uso de BYOK não é afetado pelos impostos de inferência. As páginas de produto indicam quando uma taxa está isenta do multiplicador do plano, como na geração de imagens.
