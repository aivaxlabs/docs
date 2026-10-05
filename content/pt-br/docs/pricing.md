---
{title: Preços,linkTitle: Preços,weight: 40,group: Introduction,aliases: [/docs/pt-br/platform/account-balance.html,/docs/pt-br/pricing.html],sourceHash: 8f415dad49eb5ecb}
---

# Preços

Os preços de uso do serviço são listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam com o modelo usado e o trabalho realizado.

Consulte [subscription pricing](https://aivax.net/pricing) para preços de planos mensais e [Plans and limits](limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:
- Gratuito: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

Gratuito, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas Julia-1 e extração Fetch/OCR. As taxas abaixo se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por requisição completa: um item que não cabe na cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique exclusões em [Plans and limits](limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada.

## Inferência e Moderação

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), abrangendo uso de entrada, entrada em cache e saída; seu preço por PU varia com o modelo e provedor usados.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e AI Gateway | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da cobrança principal de inferência |

## Decisões Semânticas

As taxas dos modelos de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes dos ajustes de conta e plano. Tokens de saída não têm custo no catálogo atual de modelos de decisão. Julia-1 tem direito à cota diária descrita em [Plans and limits](limits.md#included-daily-subscription-allowances); outros modelos de decisão são cobrados normalmente.

| Modelo | Preço de entrada por milhão de tokens |
| --- | ---: |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |

Consulte [Semantic decisions](generations/decisions.md) para seleção de modelo e como o uso de entrada é medido.

## Testes de Agente

Cada teste inclui as cobranças de inferência do modelo ou AI Gateway selecionado, mais o uso simulado de usuário e juiz nas taxas do perfil selecionado.

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

Indexação e busca são cobradas por uso de token. Respostas RAG geradas são cobradas separadamente da incor de consulta, e seu preço varia com o modelo de sumarização.

| Descrição | Preço |
| --- | ---: |
| Embedding de texto da coleção | **$0.10/M tokens** |
| Busca semântica - falha de cache de consulta | **$0.10/M tokens** |
| Busca semântica - acerto de cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluindo taxas de consulta |
| Reflex - falha de cache | **$0.015/M tokens** |
| Reflex - acerto de cache | **$0.003/M tokens** |

## Injetor de Mídia

Converter mídia em documentos RAG é cobrado por entrada, entrada em cache, saída e uso de mídia. O arquivo fonte, contexto opcional e conteúdo gerado afetam o total. As taxas dependem do tipo de mídia e volume de tokens de entrada.

| Descrição | Preço |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$1.80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Entrada **$0.60/M tokens**; cache **$0.06/M tokens**; saída **$3.60/M tokens** |
| Áudio - até 256K tokens de entrada | Entrada/mídia **$0.60/M tokens**; cache **$0.12/M tokens**; saída **$3.00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Entrada/mídia **$1.20/M tokens**; cache **$0.24/M tokens**; saída **$6.00/M tokens** |
| Vídeo | Entrada/mídia **$0.45/M tokens**; cache **$0.045/M tokens**; saída **$3.75/M tokens** |

## Ferramentas de Texto

Segmentação e classificação de texto são cobradas por uso de token.

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.10/M tokens** |

## Voz e Mídia

As taxas de geração e transcrição dependem do modelo selecionado. O preço de descrições de mídia é aproximado e depende do modelo de processamento disponível.

| Descrição | Preço |
| --- | ---: |
| Sessões de voz | Taxas do modelo em tempo real selecionado |
| Conversão fala‑texto | Varia conforme o modelo |
| Conversão texto‑fala | Varia conforme o modelo |
| Geração de imagens | Tarifas fixas de saída e imagem de referência por modelo |
| Descrições de mídia | **~$1.50/M tokens** |

A geração de imagens cobra cada saída entregue ao preço fixo de saída do modelo selecionado, mais seu preço por referência para cada referência enviada com essa saída. O processamento do prompt está incluído. Provedores que cobram por token ou megapixel usam estimativas arredondadas para cima, não repassando o custo exato do provedor. Não há markup adicional de geração de imagens AIVAX nem multiplicador de conta e plano. As tarifas atuais estão listadas no catálogo de Modelos; veja [Image generation](generations/images.md).

## Busca na Web, OCR e Fetch

Buscas na web e no X são cobradas por busca. Busca avançada na web é cobrada por uso de token e varia com o modelo e número de interações. Extração Fetch e OCR usam Unidades de Processamento (PUs), com uma cota diária gratuita por plano. Conversão opcional de JSON guiada por esquema é cobrada separadamente. As cotas de extração e taxas de PU não se aplicam à conversão JSON nem à moderação.

| Descrição | Preço |
| --- | ---: |
| Busca na web | **$5/1k buscas** |
| Busca no X (Twitter) | **$5/1k buscas** |
| Busca avançada na web | **~$0.75/M tokens** |
| Extração Fetch e OCR - Gratuita | Cota diária base; itens não cobertos **$0.15/1k PUs** |
| Extração Fetch e OCR - Pro | Cota diária **10× Gratuita**; itens não cobertos **$0.05/1k PUs** |
| Extração Fetch e OCR - Max | Cota diária **5× Pro**; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem cota diária de extração |

Para a [Fetch API](web-foundation/fetch-and-ocr.md), `processingUnits` relata o uso de extração de texto/OCR e `jsonProcessingUnits` relata o uso adicional de conversão JSON guiada por esquema. As PUs de JSON consideram uso de token de entrada, entrada em cache e saída nas taxas do modelo e provedor de processamento; elas não são precificadas na taxa de OCR do plano. O multiplicador de inferência do plano se aplica à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON.

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excedente **$0.20/GB/mês** |

## Outras Ferramentas

As ferramentas a seguir não têm cobrança separada. A inferência do modelo usada para acioná‑las ainda é cobrada à sua taxa regular.

| Descrição | Preço |
| --- | ---: |
| Memória e calendário | Sem cobrança separada |
| Solicitações avançadas | Sem cobrança separada |
| Geração de documentos | Sem cobrança separada |
| Geração de página web | Sem cobrança separada |
