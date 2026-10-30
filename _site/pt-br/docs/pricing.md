Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

A AIVAX cobra o uso do saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página abrange as regras compartilhadas por todos os produtos: cotas de assinatura, armazenamento, cabeçalho de custo de solicitação, desconto por compartilhamento de dados e multiplicadores de plano.

Veja [preços de assinatura](https://aivax.net/pricing) para os preços dos planos mensais e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para as cotas em nível de conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo utilizado e o trabalho realizado.

## Preços por produto

| Área | Onde encontrar as tarifas |
| --- | --- |
| Inferência e moderação | [Inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md#pricing) |
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
| Ferramentas integradas e memória | [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) |

## Cotas diárias incluídas

Os planos Free, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking do Reflex, decisões semânticas elegíveis e extração Fetch/OCR. As tarifas do produto se aplicam quando um item medido não está coberto. A cobertura é total ou nula por item, não necessariamente por solicitação completa: um item que não pode caber dentro da cota restante e sua margem permitida será cobrado integralmente. Compare as cotas e verifique as exclusões em [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada. Para saber o que cada cota cobre, consulte [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Armazenamento

Cada plano inclui armazenamento. Excedentes dos planos Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento Free não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento Free | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excesso **$0,50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excesso **$0,20/GB/mês** |

## Cabeçalho de custo de solicitação

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a solicitação cobrou o uso do seu saldo da conta. Seu valor é o total cobrado por essa solicitação em USD, escrito como um número decimal com separador de ponto, por exemplo `Consumed-Credits: 0.000184`. Ele já inclui o multiplicador do plano e cobre todos os itens cobrados durante a solicitação, como inferência, embeddings, reranking e uso de ferramentas.

O cabeçalho é omitido quando a solicitação não cobrou nada, incluindo solicitações rejeitadas pela validação ou totalmente cobertas por uma cota diária de assinatura. Considere a ausência do cabeçalho como zero.

O valor cobre apenas as cobranças registradas antes do envio da resposta. O uso registrado posteriormente, como trabalho assíncrono em [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md), não está incluído. Respostas transmitidas (streamed) nunca incluem este cabeçalho, pois ele é adicionado após a produção da resposta. Para uma solicitação transmitida, leia o `cost` registrado com a conversa (disponível quando o registro de conversas está habilitado) ou calcule o custo a partir das contagens de tokens relatadas. Use seus registros de uso da conta como fonte da verdade para faturamento.

Analise o valor como um número de ponto flutuante. Valores muito pequenos, como `1E-05`, podem ser escritos em notação científica, e a soma de várias cobranças pode apresentar ruído de ponto flutuante nos dígitos finais.

## Desconto por compartilhamento de dados

Contas que habilitam o [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md) recebem um desconto de 10% no uso de embeddings de consulta RAG elegíveis e operações de reranking elegíveis realizadas enquanto o compartilhamento estiver habilitado. Outros serviços mantêm seus preços regulares.

## Multiplicadores de plano

As tarifas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência |
| --- | ---: |
| Free | +25% |
| Pro | +5% |
| Max | 0% |

O uso BYOK (Bring Your Own Key) não é afetado pelos impostos de inferência. As páginas de produto indicam quando uma tarifa está isenta do multiplicador do plano, como na geração de imagens.
