---
{title: Planos de Codificação,linkTitle: Planos de codificação,weight: 20,group: Pricing,sourceHash: 133aa1ca4e1c6a30,aliases: [/docs/pt-br/pricing/coding-plans.html]}
---

# Planos de Codificação

Os planos de codificação são assinaturas mensais baseadas em [modelos de assinatura](../inference/subscription-models/overview.md). Eles incluem uma cota de modelo de assinatura maior e limites de inferência mais altos que o Free, mantendo os limites do Free para todos os outros recursos da plataforma. Use-os para agentes de codificação, editores e ferramentas pessoais. Para RAG, armazenamento, processamento de dados e cargas de trabalho de produção, os planos Enterprise (Pro, Max e Ultimate) aumentam os limites de todos os recursos; veja [Planos e limites](plans-and-limits.md).

Uma conta tem um plano por vez. Assinar um plano de codificação substitui o plano atual.

## Planos

| | Coder Lite | Coder Plus |
| --- | --- | --- |
| Preço mensal | $8 | $39 |
| Cota mensal de modelos de assinatura | 3× a cota Pro | 15× a cota Pro, ou 3× a cota Max |
| Solicitações de modelos integrados | 30/min | 50/min |
| Tokens de entrada de modelos integrados | 5.000.000/min | 15.000.000/min |
| Solicitações BYOK | 50/min | 50/min |
| Contexto máximo | — | — |

Um travessão (`—`) significa que o plano não impõe limite. As solicitações de modelos integrados não têm limite diário.

Os preços não incluem os [impostos sobre pagamentos](product-pricing.md#taxes-on-payments). A cota funciona como a Enterprise: ela é renovada um mês após seu primeiro uso em cada ciclo, e todos os modelos de assinatura compartilham essa cota. Veja [Cota mensal de modelos de assinatura](plans-and-limits.md#monthly-subscription-model-quota).

Recargas de crédito não têm taxa de serviço. Todos os outros limites são os mesmos do Free, incluindo acesso ao modelo, comissão de inferência, armazenamento, retenção, RAG, processamento de dados e as cotas diárias incluídas. Veja a coluna Free em [Planos e limites](plans-and-limits.md).

## Escolhendo entre planos de codificação e Enterprise

Mover-se de um plano Enterprise para um plano de codificação reduz todos os limites da plataforma para os valores do Free. Antes de alternar, verifique se a conta se encaixa neles: o armazenamento acima da cota do Free bloqueia solicitações até que o uso seja reduzido, e gateways que usam modelos fora do grupo de baixo preço param de funcionar.

## Assinando

Assine ou altere usando a API de assinaturas, enviando `CoderLite` ou `CoderPlus` como o plano para [Alterar Plano](https://inference.aivax.net/apidocs/llms.txt?endpoint=POST%20%2Fapi%2Fv1%2Fsubscriptions%2Fplan). `GET /api/v1/subscriptions` lista todos os planos com sua `category`, `Enterprise` ou `Coding`.

A cobrança segue as mesmas regras dos planos Enterprise. Uma alteração para um plano com preço mensal mais alto é cobrada agora, descontando os dias não utilizados do plano atual. Uma alteração para um plano com preço mensal mais baixo entra em vigor na próxima renovação.

`GET /api/v1/accounts` relata o tipo de plano em `planType`: `Free`, `Enterprise` ou `Coding`.
