Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

AIVAX cobra o uso ao saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página cobre as regras compartilhadas por todos os produtos: limites de assinatura, armazenamento, cabeçalho de custo da requisição, desconto por compartilhamento de dados e multiplicadores de plano.

Consulte [subscription pricing](https://aivax.net/pricing) para preços mensais de planos e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) para cotas ao nível da conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo usado e o trabalho realizado.

## Preços dos produtos

| Área | Onde encontrar as tarifas |
| --- | --- |
| Inferência e moderação | [Inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md#pricing) |
| Testes de Agente | [Testes de Agente](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#pricing-and-limits) |
| Voz e Tempo Real | [Voz e Tempo Real](https://docs.aivax.net/pt-br/docs/inference/voice-session.md#billing-and-limits) |
| Coleções RAG, busca e respostas | [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md#pricing-and-limits) |
| Injetor de mídia | [Documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md#pricing-and-limits) |
| Busca na web e busca X | [Busca na web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) |
| Buscar e OCR | [Buscar e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) |
| Geração de imagens | [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) |
| Texto-para-fala e fala-para-texto | [Texto-para-fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) e [Fala-para-texto](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) |
| Descrições de mídia, decisões, classificação e segmentação | [Processamento de dados](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) páginas |
| Extração de documento e sumarização | [Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md) e [Sumarização](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) |
| Traduções | [Traduções](https://docs.aivax.net/pt-br/docs/data-processing/translations.md) |
| Ferramentas integradas e memória | [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) |

## Limites diários incluídos

Free, Pro e Max incluem limites diários separados para embeddings RAG elegíveis, reranking Reflex, decisões semânticas elegíveis e extração Fetch/OCR. As tarifas dos produtos se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por requisição completa: um item que não cabe dentro do limite restante e sua margem permitida é cobrado integralmente. Compare os limites e verifique exclusões em [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada. Para saber o que cada limite cobre, veja [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas tarifas mensais abaixo; o armazenamento Free não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento Free | **30 MB incluído**; sem expansão |
| Armazenamento Pro | **2 GB incluído**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluído**; excedente **$0.20/GB/mês** |

## Cabeçalho de custo da requisição

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a requisição cobra uso do seu saldo da conta. Seu valor é o total cobrado por essa requisição em USD, escrito como número decimal com ponto como separador, por exemplo `Consumed-Credits: 0.000184`. Já inclui o multiplicador de plano e cobre todos os itens cobrados durante a requisição, como inferência, embeddings, reranking e uso de ferramentas.

O cabeçalho é omitido quando a requisição não cobra nada, incluindo requisições rejeitadas por validação ou totalmente cobertas por um limite diário de assinatura. Considere um cabeçalho ausente como zero.

O valor cobre apenas cobranças registradas antes do envio da resposta. Uso registrado posteriormente, como trabalho assíncrono [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md), não está incluído. Respostas em streaming enviam seus cabeçalhos antes da conclusão da geração, portanto não dependa desse cabeçalho para elas; leia o uso relatado ao final do stream. Use os registros de uso da sua conta como fonte de verdade para a faturação.

## Desconto por compartilhamento de dados

Contas que habilitam [Data Sharing](https://docs.aivax.net/pt-br/docs/data-sharing.md) recebem um desconto de 10% no uso elegível de embeddings de consulta RAG e nas operações de reranking elegíveis realizadas enquanto o compartilhamento está habilitado. Outros serviços mantêm seus preços regulares.

## Multiplicadores de plano

As tarifas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência |
| --- | ---: |
| Free | +25% |
| Pro | +5% |
| Max | 0% |

O uso de BYOK não é afetado pelos impostos de inferência. As páginas dos produtos indicam quando uma tarifa está isenta do multiplicador de plano, como na geração de imagens.
