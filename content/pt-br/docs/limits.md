---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 40,group: Introduction,sourceHash: 8e10aea68e0bfeb2,aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual controla o acesso ao modelo, limites de taxa ao nível da conta, cota de armazenamento, retenção de conversação e as cotas diárias de serviço incluídas.

Para preços de assinatura comercial e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta apenas limites ao nível da conta. Limites que pertencem a um produto específico, como buscas RAG, busca na web, Testes Agentes ou Batch, são documentados na página desse produto.

## Limites da conta

Um travessão longo (`—`) indica que o plano não impõe limite. Limites específicos de modelo, gateway, provedor ou produto ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada do modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Desativado atualmente | Desativado atualmente | Desativado atualmente |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/mês | $0.20/GB/mês |
| Retenção de conversação | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

Solicitações de modelo integrado são limitadas tanto por contagem de solicitações quanto por tokens de entrada. Grupos de limite de taxa ajustam os limites de contagem:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Gratuito | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limite ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura AIVAX e usam o limite BYOK do plano.

Os limites de taxa são compartilhados entre todas as chaves de API da mesma conta. Uma solicitação que excederia uma janela ativa retorna `429 Too Many Requests`; ajuste o ritmo das solicitações e use tentativas limitadas com backoff.

Contas personalizadas usam os limites do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa do plano quando nenhum fator é definido.

## Cotas diárias incluídas de assinatura

Free, Pro e Max incluem cotas diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. Cota não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem cotas de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Incorporação de busca e inserção RAG | Cota base | 25× Gratuito | 4× Pro |
| Reclassificação com Reflex | Cota base | 5× Gratuito | 10× Pro |
| Decisões semânticas com modelos elegíveis | Cota base | 2,5× Gratuito | 2× Pro |
| Busca e extração OCR | Cota base | 10× Gratuito | 5× Pro |

As buscas RAG e inserções de documentos compartilham a cota de incorporação. Ela não cobre geração de respostas, processamento de mídia, extração ou sumarização de documentos, classificação de texto ou segmentação. Uma incorporação de consulta servida a partir do cache não a consome. Reflex usa uma cota de reclassificação separada que inclui tanto entrada em cache quanto fora de cache. A cota de decisão semântica cobre apenas modelos de decisão elegíveis; veja [Semantic Decisions](data-processing/decisions.md#usage-and-cost). A conversão opcional de JSON de busca é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: a incorporação de um documento, a incorporação de um termo de consulta individual, uma chamada de reclassificação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10% acima da capacidade base. Um item que excederia essa margem deixa a cota inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, então alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são redefinidas à meia-noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100% enquanto estiver dentro da margem. A cobertura de assinatura LLM está atualmente desativada, então a inferência de modelo de texto e a geração de respostas RAG permanecem tarifadas separadamente. As cotas não contornam requisitos de saldo ou limites de taxa. Veja [Pricing](pricing.md) para saber como os itens não cobertos são faturados. Para um passo a passo de teste de um pipeline de recuperação dentro dessas cotas, veja [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitação |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de gateway de IA, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).
