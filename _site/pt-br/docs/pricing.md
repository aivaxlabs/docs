Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

Os preços de uso do serviço são listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo usado e o trabalho realizado.

Consulte [subscription pricing](https://aivax.net/pricing) para preços de planos mensais e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:
- Free: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

Free, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas Julia-1 e extração Fetch/OCR. As taxas abaixo se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por requisição completa: um item que não cabe na cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique as exclusões em [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada.

## Inferência e Moderação

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo uso de entrada, entrada em cache e saída; seu preço por PU varia conforme o modelo e provedor usados.

| Description | Pricing |
| --- | ---: |
| Inferência de modelo de IA e Gateway de IA | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da taxa principal de inferência |

## Decisões semânticas

As taxas de modelo de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes de ajustes de conta e plano. Tokens de saída não têm custo no catálogo atual de modelos de decisão. Julia-1 tem direito à cota diária descrita em [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances); outros modelos de decisão são cobrados normalmente.

| Model | Preço de entrada por milhão de tokens |
| --- | ---: |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |
| `@upstage/solar-decide` | **$0.050** |
| `@cloudflare/clef` | **$0.240** |
| `@cloudflare/clef-flash` | **$0.038** |
| `@liquid/d1` | **$0.040** |
| `@perplexity/pplx-decider-v1.1-27b` | **$0.020** |
| `@openai/gpt-6-luna-decisions` | **$0.100** |
| `@microsoft/microsoft-decision-1` | **$0.042** |
| `@nace-ai/drex-v1.5` | **$0.040** |
| `@cloudflare/clef-omni` | **$0.150** |

Consulte [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) para seleção de modelo e como o uso de entrada é medido.

## Testes de agente

Cada teste inclui as cobranças de inferência do modelo ou do Gateway de IA selecionado, mais o uso simulado de usuário e juiz nas taxas do perfil selecionado.

| Description | Pricing |
| --- | ---: |
| Modelo ou Gateway de IA em teste | Taxas regulares de inferência |
| Perfil baixo - usuário simulado | Entrada **$0.25/M tokens**; cache **$0.025/M tokens**; saída **$1.50/M tokens** |
| Perfil baixo - juiz | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$2.50/M tokens** |
| Perfil médio - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil médio - juiz | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - juiz | Entrada **$1.25/M tokens**; cache **$0.15/M tokens**; saída **$4.25/M tokens** |

## RAG e Coleções

Indexação e busca são cobradas por uso de tokens. Respostas RAG geradas são cobradas separadamente do embedding de consulta, e seu preço varia conforme o modelo de sumarização.

| Description | Pricing |
| --- | ---: |
| Embedding de texto da coleção | **$0.10/M tokens** |
| Busca semântica - falta de cache de consulta | **$0.10/M tokens** |
| Busca semântica - acerto de cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluindo taxas de consulta |
| Reflex - falta de cache | **$0.015/M tokens** |
| Reflex - acerto de cache | **$0.003/M tokens** |

## Injetor de mídia

Converter mídia em documentos RAG é cobrado por entrada, entrada em cache, saída e uso de mídia. O arquivo fonte, contexto opcional e conteúdo gerado afetam o total. As taxas dependem do tipo de mídia e volume de tokens de entrada.

| Description | Pricing |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$1.80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Entrada **$0.60/M tokens**; cache **$0.06/M tokens**; saída **$3.60/M tokens** |
| Áudio - até 256K tokens de entrada | Entrada/mídia **$0.60/M tokens**; cache **$0.12/M tokens**; saída **$3.00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Entrada/mídia **$1.20/M tokens**; cache **$0.24/M tokens**; saída **$6.00/M tokens** |
| Vídeo | Entrada/mídia **$0.45/M tokens**; cache **$0.045/M tokens**; saída **$3.75/M tokens** |

## Ferramentas de texto

Segmentação e classificação de texto são cobradas por uso de tokens.

| Description | Pricing |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.10/M tokens** |

## Voz e mídia

As taxas de geração e transcrição dependem do modelo selecionado. O preço de descrições de mídia é aproximado e depende do modelo de processamento disponível.

| Description | Pricing |
| --- | ---: |
| Sessões de voz | Taxas do modelo em tempo real selecionado |
| Fala para texto | Varia conforme o modelo |
| Texto para fala | Varia conforme o modelo |
| Geração de imagem | Tarifas fixas de saída e imagem de referência por modelo |
| Descrições de mídia | **~$1.50/M tokens** |

A geração de imagem cobra cada saída entregue ao preço fixo de saída do modelo selecionado, mais seu preço por referência para cada referência enviada com essa saída. O processamento do prompt está incluído. Provedores que cobram por token ou megapixel usam estimativas arredondadas, não repassam o custo exato do provedor. Não há markup adicional de geração de imagem AIVAX nem multiplicador de conta e plano. As tarifas atuais estão listadas no catálogo de Modelos; veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

## Busca na web, OCR e Fetch

Buscas na web e X são cobradas por busca. Busca avançada na web é cobrada por uso de tokens e varia conforme o modelo e número de interações. Extração Fetch e OCR usam Unidades de Processamento (PUs), com uma cota diária gratuita por plano. Conversão JSON guiada por esquema opcional é cobrada separadamente. As cotas de extração e taxas de PU não se aplicam à conversão JSON ou moderação.

| Description | Pricing |
| --- | ---: |
| Busca na web | **$5/1k buscas** |
| Busca X (Twitter) | **$5/1k buscas** |
| Busca avançada na web | **~$0.75/M tokens** |
| Extração Fetch e OCR - Gratuita | Cota diária base; itens não cobertos **$0.15/1k PUs** |
| Extração Fetch e OCR - Pro | **10× Gratuita** cota diária; itens não cobertos **$0.05/1k PUs** |
| Extração Fetch e OCR - Max | **5× Pro** cota diária; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem cota diária de extração |

Para a [Fetch API](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), `processingUnits` relata o uso de extração de texto/OCR e `jsonProcessingUnits` relata o uso adicional de conversão JSON guiada por esquema. As PUs JSON consideram entrada, entrada em cache e uso de tokens de saída nas taxas do modelo e provedor de processamento; elas não são precificadas na taxa OCR do plano. O multiplicador de inferência do plano se aplica à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON.

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Description | Pricing |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excedente **$0.20/GB/mês** |

## Cabeçalho de custo da requisição

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a requisição cobrou uso ao saldo da sua conta. Seu valor é o total cobrado por aquela requisição em USD, escrito como número decimal com ponto como separador, por exemplo `Consumed-Credits: 0.000184`. Já inclui o multiplicador do plano e cobre todo item cobrado durante a requisição, como inferência, embeddings, reranking e uso de ferramentas.

O cabeçalho é omitido quando a requisição não cobrou nada, incluindo requisições rejeitadas por validação ou totalmente cobertas por uma cota diária de assinatura. Considere um cabeçalho ausente como zero.

O valor cobre apenas cobranças registradas antes do envio da resposta. Uso registrado depois, como trabalho assíncrono [Batch](https://docs.aivax.net/pt-br/docs/features/batch.md), não está incluído. Respostas em streaming enviam seus cabeçalhos antes da geração concluir, portanto não dependa deste cabeçalho para elas; leia o uso relatado ao final do stream. Use os registros de uso da sua conta como fonte de verdade para faturamento.

## Desconto de coleta de dados

Contas que habilitam [Data collecting](https://docs.aivax.net/pt-br/docs/data-collecting.md) recebem um desconto de 10 % no uso elegível de embedding de consulta RAG e nas operações de reranking elegíveis realizadas enquanto a coleta está habilitada. Outros serviços mantêm seus preços regulares.

## Outras ferramentas

As ferramentas a seguir não têm cobrança separada, mas operações de memória incorrem nas cobranças RAG listadas abaixo. A inferência do modelo usada para invocá‑las ainda é cobrada à sua taxa regular.

| Description | Pricing |
| --- | ---: |
| [Memory](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory) | Salvar ou substituir conteúdo: embedding de documento; busca semântica `query`: embedding de consulta RAG; busca `filter`: sem custo de embedding; reranking `rrf`: sem custo |
| Requisições avançadas | Sem taxa separada |
| Geração de documento | Sem taxa separada |
| Geração de página web | Sem taxa separada |
