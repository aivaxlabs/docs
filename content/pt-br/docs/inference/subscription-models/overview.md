---
{title: Visão Geral dos Modelos de Assinatura,linkTitle: Visão geral,weight: 10,group: Inference,aliases: [/docs/pt-br/inference/subscription-models.html,/docs/pt-br/inference/subscription-models/overview.html],sourceHash: cd7b90044877c61a}
---

# Modelos de assinatura

Os modelos de assinatura são modelos de texto incluídos nos planos Pro, Max e Ultimate. Seus nomes começam com `@aivax-subscription/`. Eles utilizam a [cota mensal de modelos de assinatura](/docs/pt-br/limits.md#monthly-subscription-model-quota) do plano em vez do saldo da conta, portanto, uma solicitação a um deles nunca debita seus créditos.

Use-os como qualquer outro modelo integrado: em solicitações de API, em AI Gateways, em agentes de codificação e outras ferramentas compatíveis com OpenAI, ou para tarefas cotidianas. Os planos Free e Custom não incluem a cota.

## Modelos disponíveis

A tabela lista a janela de contexto de cada modelo e o uso incluído mensalmente, expresso como equivalente ao preço do catálogo integrado do modelo. Todos os modelos de assinatura compartilham a mesma cota.

| Modelo | Janela de contexto | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| DeepSeek V4.1 Flash<br>`@aivax-subscription/deepseek-v4.1-flash-1017` | 500K tokens | ≈ $40 | ≈ $160 | ≈ $380 |
| GLM 5.3<br>`@aivax-subscription/glm-5.3` | 500K tokens | ≈ $40 | ≈ $160 | ≈ $400 |
| GLM 5.3 Flash<br>`@aivax-subscription/glm-5.3-flash` | 500K tokens | ≈ $40 | ≈ $160 | ≈ $400 |
| Kimi K3.1 Pro<br>`@aivax-subscription/kimi-k3.1-pro` | 500K tokens | ≈ $40 | ≈ $200 | ≈ $490 |
| MiniMax M3.1 Flash<br>`@aivax-subscription/minimax-m3.1-flash` | 500K tokens | ≈ $40 | ≈ $160 | ≈ $400 |
| Qwen3.8 Max<br>`@aivax-subscription/qwen3.8-max` | 500K tokens | ≈ $40 | ≈ $190 | ≈ $460 |
| Step 5 Preview<br>`@aivax-subscription/step-5-preview` | 500K tokens | ≈ $40 | ≈ $200 | ≈ $480 |
| Grok 4.7<br>`@aivax-subscription/grok-4.7` | 500K tokens | ≈ $70 | ≈ $320 | ≈ $800 |

Os valores são aproximados. Distribuir o uso entre vários modelos de assinatura divide a mesma cota entre eles.

A janela da cota começa com a primeira solicitação que a utiliza e dura um mês: usá-la pela primeira vez em 15 de outubro renova a cota em 15 de novembro. Consulte [Cota mensal de modelos de assinatura](/docs/pt-br/limits.md#monthly-subscription-model-quota).

## Disponibilidade

Um modelo de assinatura executa o modelo que nomeia. Se uma solicitação falhar, tente novamente mais tarde ou use outro modelo de assinatura ou um modelo integrado regular.

## Quando a cota é esgotada

Quando a cota é esgotada, ou o plano não a inclui, uma solicitação a um modelo de assinatura retorna `429 Too Many Requests`. A solicitação não é roteada para um modelo fora da assinatura e nunca é cobrada no saldo da conta. Para continuar antes da renovação da cota, selecione outro modelo explicitamente; os modelos regulares são cobrados no saldo conforme suas tarifas.

## Retenção de dados

Os modelos de assinatura não têm retenção zero de dados. As prompts enviadas a eles são coletadas e mantidas por um período indeterminado. De acordo com os termos dos provedores, elas não são usadas para treinamento.

Com [Somente provedores de retenção zero de dados](/docs/pt-br/inference/routing/zdr.md) habilitado, as solicitações a modelos de assinatura falham. Não envie dados pessoais, confidenciais ou regulamentados a esses modelos, a menos que essa retenção seja aceitável. Os registros próprios da AIVAX seguem a configuração de registro de conversas da conta; consulte [Processadores de Dados](/docs/pt-br/legal/third-party-processors.md#inference).

## Identificar modelos de assinatura

Os modelos de assinatura não possuem preços por token no catálogo. Para identificá-los a partir de um aplicativo, verifique `flags.isSubscription` em `GET /api/v1/information/models.json` ou `_details.provider_model.subscription` em `GET /v1/models`. Consulte [Nomes de modelos e gateways](/docs/pt-br/inference/ai-gateways/models-and-gateway-names.md).
