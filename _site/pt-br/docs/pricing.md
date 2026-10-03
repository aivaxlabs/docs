Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

Os preços de uso do serviço são listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo usado e o trabalho realizado.

Veja [preços de assinatura](https://aivax.net/pricing) para preços mensais dos planos e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:

- Free: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

Free, Pro e Max incluem cotas diárias separadas para embeddings RAG elegíveis, reranking Reflex, decisões semânticas Julia-1 e extração Fetch/OCR. As taxas abaixo se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por requisição completa: um item que não cabe na cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique exclusões em [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada.

## Inferência e Moderação

As taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo uso de entrada, entrada em cache e saída; seu preço por PU varia conforme o modelo e provedor usados.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e gateway de IA | Selected model and provider rates |
| Moderação de entrada | Variable price per PU; separate from the main inference charge |

## Testes de Agente

Cada teste inclui as cobranças de inferência do modelo selecionado ou do gateway de IA, além do uso de usuário simulado e juiz nas taxas do perfil selecionado.

| Descrição | Preço |
| --- | ---: |
| Modelo ou gateway de IA em teste | Regular inference rates |
| Perfil baixo - usuário simulado | Input **$0.25/M tokens**; cache **$0.025/M tokens**; output **$1.50/M tokens** |
| Perfil baixo - juiz | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$2.50/M tokens** |
| Perfil médio - usuário simulado | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil médio - juiz | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil alto - usuário simulado | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil alto - juiz | Input **$1.25/M tokens**; cache **$0.15/M tokens**; output **$4.25/M tokens** |

## RAG e Coleções

Indexação e busca são cobradas por uso de tokens. Respostas RAG geradas são cobradas separadamente da incorporação de consulta, e seu preço varia com o modelo de sumarização.

| Descrição | Preço |
| --- | ---: |
| Incorporação de texto da coleção | **$0.10/M tokens** |
| Busca semântica - falha no cache de consulta | **$0.10/M tokens** |
| Busca semântica - acerto no cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluding query rates |
| Reflex - falha no cache | **$0.015/M tokens** |
| Reflex - acerto no cache | **$0.003/M tokens** |

## Injetor de Mídia

Converter mídia em documentos RAG é cobrado por entrada, entrada em cache, saída e uso de mídia. O arquivo fonte, contexto opcional e conteúdo gerado afetam o total. As taxas dependem do tipo de mídia e volume de tokens de entrada.

| Descrição | Preço |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$1.80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Input **$0.60/M tokens**; cache **$0.06/M tokens**; output **$3.60/M tokens** |
| Áudio - até 256K tokens de entrada | Input/media **$0.60/M tokens**; cache **$0.12/M tokens**; output **$3.00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Input/media **$1.20/M tokens**; cache **$0.24/M tokens**; output **$6.00/M tokens** |
| Vídeo | Input/media **$0.45/M tokens**; cache **$0.045/M tokens**; output **$3.75/M tokens** |

## Ferramentas de Texto

Segmentação e classificação de texto são cobradas por uso de tokens.

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.10/M tokens** |

## Voz e Mídia

As taxas de geração e transcrição dependem do modelo selecionado. O preço da descrição de mídia é aproximado e depende do modelo de processamento disponível.

| Descrição | Preço |
| --- | ---: |
| Sessões de voz | Selected realtime model rates |
| Fala para texto | Varies by model |
| Texto para fala | Varies by model |
| Geração de imagem | Fixed output and reference-image tariffs by model |
| Descrições de mídia | **~$1.50/M tokens** |

A geração de imagem cobra cada saída entregue ao preço fixo de saída do modelo selecionado, mais seu preço por referência para cada referência enviada com essa saída. O processamento do prompt está incluído. Provedores com preços por token e megapixel usam estimativas arredondadas, não repasse exato de custo do provedor. Nenhuma marcação adicional de geração de imagem AIVAX ou multiplicador de conta e plano se aplica. As tarifas atuais estão listadas no catálogo de Modelos; veja [Geração de imagem](https://docs.aivax.net/pt-br/docs/generations/images.md).

## Busca na Web, OCR e Fetch

Buscas na Web e X são cobradas por busca. Busca avançada na web é cobrada por uso de tokens e varia conforme o modelo e número de interações. Extração Fetch e OCR usam Unidades de Processamento (PUs), com uma cota diária gratuita por plano. Conversão JSON guiada por esquema opcional é cobrada separadamente. As cotas de extração e taxas de PU não se aplicam à conversão JSON ou moderação.

| Descrição | Preço |
| --- | ---: |
| Busca na Web | **$5/1k searches** |
| Busca X (Twitter) | **$5/1k searches** |
| Busca avançada na web | **~$0.75/M tokens** |
| Extração Fetch e OCR - Gratuita | Base daily allowance; uncovered items **$0.15/1k PUs** |
| Extração Fetch e OCR - Pro | **10× Free** daily allowance; uncovered items **$0.05/1k PUs** |
| Extração Fetch e OCR - Max | **5× Pro** daily allowance; uncovered items **$0.02/1k PUs** |
| Conversão JSON Fetch (`responseSchema`) | Variable inference-based price per PU; charged separately, with no daily extraction allowance |

Para a [API Fetch](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), `processingUnits` relata o uso de extração de texto/OCR e `jsonProcessingUnits` relata o uso adicional de conversão JSON guiada por esquema. As PUs JSON contabilizam uso de tokens de entrada, entrada em cache e saída nas taxas do modelo e provedor de processamento; elas não são precificadas à taxa OCR do plano. O multiplicador de inferência do plano se aplica à conversão JSON. Omitir `responseSchema` ou defini‑lo como `null` desativa a conversão, relata `jsonProcessingUnits: 0` e não gera cobrança de conversão JSON.

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Descrição | Preço |
| --- | ---: |
| Armazenamento gratuito | **30 MB included**; no expansion |
| Armazenamento Pro | **2 GB included**; excess **$0.50/GB/month** |
| Armazenamento Max | **20 GB included**; excess **$0.20/GB/month** |

## Outras Ferramentas

As ferramentas a seguir não têm cobrança separada. A inferência do modelo usada para acioná‑las ainda é cobrada à sua taxa regular.

| Descrição | Preço |
| --- | ---: |
| Memória e calendário | No separate charge |
| Solicitações avançadas | No separate charge |
| Geração de documento | No separate charge |
| Geração de página web | No separate charge |
