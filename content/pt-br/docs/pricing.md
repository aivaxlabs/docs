---
{title: Preços,linkTitle: Preços,weight: 40,group: Introduction,aliases: [/docs/pt-br/platform/account-balance.html,/docs/pt-br/pricing.html],sourceHash: 12e946ac44d33548}
---

# Preços

Os preços de uso do serviço são listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam com o modelo usado e o trabalho realizado.

Consulte [subscription pricing](https://aivax.net/pricing) para preços de planos mensais e [Plans and limits](limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:
- Gratuito: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

Gratuito, Pro e Max incluem permissões diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas Julia-1 e extração Fetch/OCR. As taxas abaixo se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por requisição completa: um item que não cabe na margem de e e sua margem permitida é cobrado integralmente. Compare as permissões e verifique exclusões em [Plans and limits](limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada.

## Inferência e Moderação

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo uso de entrada, entrada em cache e saída; seu preço por PU varia com o modelo e provedor usados.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e AI Gateway | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da taxa principal de inferência |

## Decisões semânticas

As taxas de modelo de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes de ajustes de conta e plano. Tokens de saída não têm cobrança no catálogo atual de modelos de decisão. Julia-1 tem direito à permissão diária descrita em [Plans and limits](limits.md#included-daily-subscription-allowances); outros modelos de decisão são cobrados normalmente.

| Modelo | Preço de entrada por milhões de tokens |
| --- | ---: |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |
| `@upstage/solar-decide` | **$0.050** |
| `@cloudflare/clef` | **$0.240** |
| `@cloudflare/clef-flash` | **$0.090** |
| `@liquid/d1` | **$0.040** |
| `@perplexity/pplx-decider-v1-27b` | **$0.040** |
| `@openai/gpt-6-luna-decisions` | **$0.100** |
| `@microsoft/microsoft-decision-1` | **$0.042** |
| `@nace-ai/drex-v1.5` | **$0.040** |
| `@cloudflare/clef-omni` | **$0.150** |

Consulte [Semantic decisions](generations/decisions.md) para seleção de modelo e como o uso de entrada é medido.

## Testes de agente

Cada teste inclui as cobranças de inferência do modelo ou AI Gateway selecionado, mais uso simulado de usuário e juiz nos das do perfil selecionado.

| Descrição | Preço |
| --- | ---: |
| Modelo ou AI Gateway em teste | Taxas regulares de inferência |
| Perfil baixo - usuário simulado | Entrada **$0.25/M tokens**; cache **$0.025/M tokens**; saída **$1.50/M tokens** |
| Perfil baixo - juiz | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$2.50/M tokens** |
| Perfil médio - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil médio - juiz | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - juiz | Entrada **$1.25/M tokens**; cache **$0.15/M tokens**; saída **$4.25/M tokens** |

## RAG e Coleções

Indexação e busca são cobradas por uso de tokens. Respostas RAG geradas são cobradas separadamente do embedding de consulta, e seu preço varia com o modelo de sumarização.

| Descrição | Preço |
| --- | ---: |
| Embedding de texto da coleção | **$0.10/M tokens** |
| Busca semântica - falha de cache de consulta | **$0.10/M tokens** |
| Busca semântica - acerto de cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluindo taxas de consulta |
| Reflex - falha de cache | **$0.015/M tokens** |
| Reflex - acerto de cache | **$0.003/M tokens** |

## Injetor de mídia

Converter mídia em documentos RAG é cobrado por entrada, entrada em cache, saída e uso de mídia. O arquivo fonte, contexto opcional e conteúdo gerado afetam o total. As taxas dependem do tipo de mídia e volume de tokens de entrada.

| Descrição | Preço |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$1.80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Entrada **$0.60/M tokens**; cache **$0.06/M tokens**; saída **$3.60/M tokens** |
| Áudio - até 256K tokens de entrada | Entrada/mídia **$0.60/M tokens**; cache **$0.12/M tokens**; saída **$3.00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Entrada/mídia **$1.20/M tokens**; cache **$0.24/M tokens**; saída **$6.00/M tokens** |
| Vídeo | Entrada/mídia **$0.45/M tokens**; cache **$0.045/M tokens**; saída **$3.75/M tokens** |

## Ferramentas de texto

Segmentação e classificação de texto são cobradas por uso de tokens.

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.10/M tokens** |

## Voz e mídia

As taxas de geração e transcrição dependem do modelo selecionado. O preço de descrições de mídia é aproximado e depende do modelo de processamento disponível.

| Descrição | Preço |
| --- | ---: |
| Sessões de voz | Taxas do modelo em tempo real selecionado |
| Conversão de fala para texto | Varia conforme o modelo |
| Conversão de texto para fala | Varia conforme o modelo |
| Geração de imagem | Tarifas fixas de saída e imagem de referência por modelo |
| Descrições de mídia | **~$1.50/M tokens** |

A cobrança de geração de imagem cobra cada saída entregue ao preço fixo de saída do modelo selecionado, mais seu preço por referência para cada referência enviada com essa saída. O processamento do prompt está incluído. Provedores que cobram por token ou megapixel usam estimativas arredondadas, não repassam exatamente o custo do provedor. Não há markup adicional de geração de imagem AIVAX nem multiplicador de conta e plano. As tarifas atuais estão listadas no catálogo de Modelos; veja [Image generation](generations/images.md).

## Busca na web, OCR e Fetch

Buscas na web e no X são cobradas por busca. A busca avançada na web é cobrada por uso de tokens e varia com o modelo e número de interações. Fetch e extração OCR usam Unidades de Processamento (PUs), com uma permissão diária gratuita por plano. A conversão opcional de JSON guiada por esquema é cobrada separadamente. As permissões de extração e taxas de PU não se aplicam à conversão JSON ou moderação.

| Descrição | Preço |
| --- | ---: |
| Busca na web | **$5/1k buscas** |
| Busca no X (Twitter) | **$5/1k buscas** |
| Busca avançada na web | **~$0.75/M tokens** |
| Fetch e extração OCR - Gratuito | Permissão diária base; itens não cobertos **$0.15/1k PUs** |
| Fetch e extração OCR - Pro | **10× Gratuito** permissão diária; itens não cobertos **$0.05/1k PUs** |
| Fetch e extração OCR - Max | **5× Pro** permissão diária; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem permissão diária de extração |

Para a [Fetch API](web-foundation/fetch-and-ocr.md), `processingUnits` relata uso de extração de texto/OCR e `jsonProcessingUnits` relata o uso adicional de conversão JSON guiada por esquema. Os PUs JSON contabilizam entrada, entrada em cache e uso de tokens de saída nas taxas do modelo de processamento e provedor; eles não são precificados na taxa OCR do plano. O multiplicador de inferência do plano aplica‑se à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON.

## Armazenamento

Cada plano inclui armazenamento. Excedentes nos planos Pro e Max são cobrados por hora nas tarifas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excedente **$0.20/GB/mês** |

## Desconto de coleta de dados

Contas que habilitam [Data collecting](data-collecting.md) recebem 10% de desconto no uso elegível de embedding de consulta RAG e nas operações de reranking elegíveis realizadas enquanto a coleta está habilitada. Outros serviços mantêm seus preços regulares.

## Outras ferramentas

As ferramentas abaixo não têm cobrança separada, mas operações de memória incidem nas taxas RAG listadas abaixo. A inferência do modelo usada para invocá‑las ainda é cobrada à sua taxa regular.

| Descrição | Preço |
| --- | ---: |
| [Memory](tools/builtin-tools.md#memory) | Salvar ou substituir conteúdo: embedding de documento; busca semântica `query`: embedding de consulta RAG; busca `filter`: sem custo de embedding; reranking `rrf`: sem custo |
| Solicitações avançadas | Sem cobrança separada |
| Geração de documento | Sem cobrança separada |
| Geração de página web | Sem cobrança separada |
