# Preços

Os preços de uso do serviço são listados abaixo em USD. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam com o modelo usado e o trabalho realizado.

Consulte [preço de assinatura](https://aivax.net/pricing) para preços dos planos mensais e [Planos e limites](limits.md) para cotas. As taxas de uso estão sujeitas ao multiplicador do plano:
- Gratuito: **+25%** nos impostos de inferência;
- Pro: **+5%** nos impostos de inferência;
- Max: **0%** nos impostos de inferência.

BYOK não são afetados pelos impostos de inferência.

## Inferência e Moderação

Taxas de inferência dependem do modelo selecionado, provedor, tamanho da entrada e tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo entrada, entrada em cache e uso de saída; seu preço por PU varia com o modelo e provedor usados.

| Description | Pricing |
| --- | ---: |
| Inferência de modelo de IA e Gateway de IA | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da cobrança principal de inferência |

## Testes de Agente

Cada teste inclui as cobranças de inferência do modelo selecionado ou do Gateway de IA, mais o uso de usuário simulado e juiz nas taxas do perfil selecionado.

| Description | Pricing |
| --- | ---: |
| Modelo ou Gateway de IA em teste | Taxas de inferência regulares |
| Perfil baixo - usuário simulado | Input **$0.25/M tokens**; cache **$0.025/M tokens**; output **$1.50/M tokens** |
| Perfil baixo - juiz | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$2.50/M tokens** |
| Perfil médio - usuário simulado | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil médio - juiz | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil alto - usuário simulado | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Perfil alto - juiz | Input **$1.25/M tokens**; cache **$0.15/M tokens**; output **$4.25/M tokens** |

## RAG e Coleções

Indexação e busca são cobradas por uso de tokens. Respostas RAG geradas são cobradas separadamente da incorporação de consulta, e seu preço varia com o modelo de sumarização.

| Description | Pricing |
| --- | ---: |
| Incorporação de texto da coleção | **$0.015/M tokens** |
| Busca semântica - falha no cache de consulta | **$0.015/M tokens** |
| Busca semântica - acerto no cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluindo taxas de consulta |
| Reflex - falha no cache | **$0.015/M tokens** |
| Reflex - acerto no cache | **$0.003/M tokens** |

## Injetor de Mídia

Converter mídia em documentos RAG é cobrado por entrada, entrada em cache, saída e uso de mídia. O arquivo fonte, o contexto opcional e o conteúdo gerado afetam o total. As taxas dependem do tipo de mídia e do volume de tokens de entrada.

| Description | Pricing |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$1.80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Input **$0.60/M tokens**; cache **$0.06/M tokens**; output **$3.60/M tokens** |
| Áudio - até 256K tokens de entrada | Input/media **$0.60/M tokens**; cache **$0.12/M tokens**; output **$3.00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Input/media **$1.20/M tokens**; cache **$0.24/M tokens**; output **$6.00/M tokens** |
| Vídeo | Input/media **$0.45/M tokens**; cache **$0.045/M tokens**; output **$3.75/M tokens** |

## Ferramentas de Texto

Segmentação e classificação de texto são cobradas por uso de tokens.

| Description | Pricing |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.015/M tokens** |

## Voz e Mídia

Taxas de geração e transcrição dependem do modelo selecionado. O preço de descrições de mídia é aproximado e depende do modelo de processamento disponível.

| Description | Pricing |
| --- | ---: |
| Sessões de voz | Taxas do modelo em tempo real selecionado |
| Fala para texto | Varia de acordo com o modelo |
| Texto para fala | Varia de acordo com o modelo |
| Geração de imagem | Varia de acordo com o modelo |
| Descrições de mídia | **~$1.50/M tokens** |

## Busca na Web, OCR e Busca

Buscas na Web e X são cobradas por busca. Busca avançada na web é cobrada por uso de tokens e varia com o modelo e o número de interações. Busca e extração de OCR utilizam Unidades de Processamento (PUs), com uma quota diária gratuita por plano. Essas quotas e taxas de PU não se aplicam à moderação.

| Description | Pricing |
| --- | ---: |
| Busca na Web | **$5/1k searches** |
| Busca X (Twitter) | **$5/1k searches** |
| Busca avançada na web | **~$0.75/M tokens** |
| Busca e extração de OCR - Gratuito | **1,000 PUs/day free**, then **$0.15/1k PUs** |
| Busca e extração de OCR - Pro | **10,000 PUs/day free**, then **$0.05/1k PUs** |
| Busca e extração de OCR - Max | **50,000 PUs/day free**, then **$0.02/1k PUs** |

## Armazenamento

Cada plano inclui armazenamento. Excedentes dos planos Pro e Max são cobrados por hora nas taxas mensais abaixo; o armazenamento gratuito não pode ser expandido.

| Description | Pricing |
| --- | ---: |
| Armazenamento gratuito | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excedente **$0.50/GB/mês** |
| Armazenamento Max | **20 GB incluídos**; excedente **$0.20/GB/mês** |

## Outras Ferramentas

As ferramentas a seguir não têm cobrança separada. A inferência do modelo usada para invocá-las ainda é cobrada à sua taxa regular.

| Description | Pricing |
| --- | ---: |
| Memória e calendário | Sem cobrança separada |
| Solicitações avançadas | Sem cobrança separada |
| Geração de documento | Sem cobrança separada |
| Geração de página web | Sem cobrança separada |