Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

Os preços de uso do serviço estão listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo usado e o trabalho realizado.

Consulte [subscription pricing](https://aivax.net/pricing) para preços dos planos mensais e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:
- Free: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

Free, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas Julia-1 e extração Fetch/OCR. As taxas abaixo se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por solicitação completa: um item que não pode caber na cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique as exclusões em [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). A cobertura de assinatura de LLM está atualmente desativada.

## Inferência e Moderação

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo uso de entrada, entrada em cache e saída; seu preço por PU varia conforme o modelo e provedor usados.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e AI Gateway | Tarifas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da taxa principal de inferência |

## Decisões semânticas

As taxas de modelo de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes dos ajustes de conta e plano. Tokens de saída não têm custo no catálogo atual de modelos de decisão. Julia-1 é elegível à cota diária descrita em [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances); outros modelos de decisão são cobrados normalmente.

| Modelo | Preço de entrada por milhão de tokens |
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

Consulte [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) para seleção de modelo e como o uso de entrada é medido.

## Testes Agentes

Cada teste inclui as cobranças de inferência do modelo selecionado ou AI Gateway, além do uso de usuário simulado e juiz nas taxas do perfil selecionado.

| Descrição | Preço |
| --- | ---: |
| Modelo ou AI Gateway em teste | Tarifas de inferência regulares |
| Perfil baixo - usuário simulado | Entrada **$0.25/M tokens**; cache **$0.025/M tokens**; saída **$1.50/M tokens** |
| Perfil baixo - juiz | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$2.50/M tokens** |
| Perfil médio - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil médio - juiz | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - juiz | Entrada **$1.25/M tokens**; cache **$0.15/M tokens**; saída **$4.25/M tokens** |

## RAG e Coleções

Indexação e busca são cobradas por uso de tokens. Respostas RAG geradas são cobradas separadamente da incorporação de consulta, e seu preço varia conforme o modelo de sumarização.

| Descrição | Preço |
| --- | ---: |
| Incorporação de texto da coleção | **$0.10/M tokens** |
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

Segmentação e classificação de texto são cobradas por uso de tokens.

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.10/M tokens** |

## Voz e Mídia

As taxas de geração e transcrição dependem do modelo selecionado. O preço de descrições de mídia é aproximado e depende do modelo de processamento disponível.

| Descrição | Preço |
| --- | ---: |
| Sessões de voz | Tarifas do modelo em tempo real selecionado |
| Conversão de fala para texto | Varia conforme o modelo |
| Conversão de texto para fala | Varia conforme o modelo |
| Geração de imagens | Tarifas fixas de saída e imagem de referência por modelo |
| Descrições de mídia | **~$1.50/M tokens** |

A geração de imagens cobra cada saída entregue ao preço de saída fixo do modelo selecionado, mais seu preço por referência para cada referência enviada com aquela saída. O processamento do prompt está incluído. Provedores com preços por token ou megapixel utilizam estimativas arredondadas, não repasse exato de custo do provedor. Não há markup adicional de geração de imagens AIVAX nem multiplicador de conta e plano. As tarifas atuais estão listadas no catálogo de Modelos; veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

## Busca na Web, OCR e Fetch

Buscas na Web e X são cobradas por busca. Busca avançada na Web é cobrada por uso de tokens e varia com o modelo e número de interações. Extração Fetch e OCR usam Unidades de Processamento (PUs), com uma cota diária gratuita por plano. Conversão opcional de JSON guiada por esquema é cobrada separadamente. As cotas de extração e taxas de PU não se aplicam à conversão de JSON ou moderação.

| Descrição | Preço |
| --- | ---: |
| Busca na Web | **$5/1k buscas** |
| Busca X (Twitter) | **$5/1k buscas** |
| Busca avançada na Web | **~$0.75/M tokens** |
| Extração Fetch e OCR - Gratuita | Cota diária base; itens não cobertos **$0.15/1k PUs** |
| Extração Fetch e OCR - Pro | **10× Gratuita** cota diária; itens não cobertos **$0.05/1k PUs** |
| Extração Fetch e OCR - Max | **5× Pro** cota diária; itens não cobertos **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Preço variável baseado em inferência por PU; cobrado separadamente, sem cota diária de extração |

Para a [Fetch API](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), `processingUnits` relata uso de extração de texto/OCR e `jsonProcessingUnits` relata o uso adicional de conversão de JSON guiada por esquema. As PUs de JSON contabilizam uso de tokens de entrada, entrada em cache e saída nas taxas do modelo e provedor de processamento; elas não são precificadas à taxa de OCR do plano. O multiplicador de inferência do plano aplica‑se à conversão de JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão de JSON.

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas tarifas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excedente **$0.20/GB/mês** |

## Desconto por Coleta de Dados

Contas que habilitam [Data collecting](https://docs.aivax.net/pt-br/docs/data-collecting.md) recebem um desconto de 10% no uso elegível de incorporação de consulta RAG e nas operações de reranking elegíveis realizadas enquanto a coleta está habilitada. Outros serviços mantêm seus preços regulares.

## Outras Ferramentas

As ferramentas a seguir não têm cobrança separada. A inferência de modelo usada para invocá‑las ainda é cobrada à sua taxa regular.

| Descrição | Preço |
| --- | ---: |
| Memória e calendário | Sem cobrança separada |
| Solicitações avançadas | Sem cobrança separada |
| Geração de documentos | Sem cobrança separada |
| Geração de página web | Sem cobrança separada
