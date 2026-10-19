Source: https://docs.aivax.net/pt-br/docs/limits.html

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual controla o acesso ao modelo, limites de taxa ao nível da conta, cota de armazenamento, retenção de conversas e cotas diárias de serviço incluídas.

Para preços de assinatura comercial e pacotes de plano, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta apenas limites ao nível da conta. Limites que pertencem a um produto específico, como buscas RAG, busca na web, Testes Agenticos ou Batch, são documentados na página desse produto.

## Limites de conta

Um travessão (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou produto ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Low-price models | All models | All models |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min and 500/day | 200/min | — |
| Tokens de entrada de modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 input tokens | — | — |
| Cobertura de assinatura LLM | Currently disabled | Currently disabled | Currently disabled |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversas | 2 hours | 2 days | 30 days |
| Nível de suporte | Email | Priority | Dedicated |

Solicitações de modelo integrado são limitadas tanto pelo número de solicitações quanto pelos tokens de entrada. Grupos de limite de taxa de modelo ajustam os limiares de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limiar |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura AIVAX e utilizam o limite BYOK do plano.

Limites de taxa são compartilhados entre todas as chaves de API da mesma conta. Uma solicitação que ultrapassaria uma janela ativa retorna `429 Too Many Requests`; espaçe as solicitações e use tentativas limitadas com backoff.

Contas personalizadas usam os limites do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa de plano quando nenhum fator é definido.

## Cotas diárias incluídas de assinatura

Free, Pro e Max incluem cotas diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. Cota não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem cotas de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Busca RAG e embeddings de inserção | Cota base | 25× Free | 4× Pro |
| Reclassificação com Reflex | Cota base | 5× Free | 10× Pro |
| Decisões semânticas com modelos elegíveis | Cota base | 2.5× Free | 2× Pro |
| Busca e extração OCR | Cota base | 10× Free | 5× Pro |

Buscas RAG e inserções de documentos compartilham a cota de embedding. Ela não cobre geração de respostas, processamento de mídia, classificação de texto ou segmentação. Um embedding de consulta servido a partir do cache não o consome. Reflex usa uma cota de reclassificação separada que inclui entrada em cache e sem cache. A cota de decisão semântica cobre apenas modelos de decisão elegíveis; veja [Decisões Semânticas](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#usage-and-cost). A conversão opcional de JSON de busca é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, o embedding de um termo de consulta individual, uma chamada de reclassificação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas taxas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10 % acima de sua capacidade base. Um item que excederia essa margem deixa a cota inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são redefinidas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100 % dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de modelo de texto e a geração de respostas RAG permanecem cobradas separadamente. As cotas não contornam requisitos de saldo ou limites de taxa. Veja [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para saber como itens não cobertos são faturados. Para um passo‑a‑passo de teste de um pipeline de recuperação dentro dessas cotas, veja [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Chaves de API pública

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitação |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hour, 1,000/day |
| Global por chave | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global por chave | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e completações de chat. Para completações de chat, chaves públicas também requerem um UUID completo de gateway de IA, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Veja [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).
