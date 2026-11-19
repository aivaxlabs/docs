Source: https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.html

# Modelos de assinatura

Os modelos de assinatura são modelos de texto incluídos nos planos Pro, Max e Ultimate. Seus nomes começam com `@aivax-subscription/`. Eles utilizam a [cota de modelo de assinatura mensal](https://docs.aivax.net/pt-br/docs/limits.md#monthly-subscription-model-quota) do plano em vez do saldo da conta, portanto, uma solicitação a um deles nunca debita seus créditos.

Use-os como qualquer outro modelo integrado: em solicitações de API, em AI Gateways, em agentes de codificação e outras ferramentas compatíveis com OpenAI, ou para tarefas cotidianas. Os planos Free e Custom não incluem a cota.

## Modelos disponíveis

A tabela lista a janela de contexto de cada modelo e o uso incluído mensalmente, expresso como equivalente ao preço do catálogo integrado do modelo. Todos os modelos de assinatura compartilham a mesma cota.

| Modelo | Janela de contexto | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| DeepSeek V4.1 Flash<br>`@aivax-subscription/deepseek-v4.1-flash-1017` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $380<br>12.5× Pro |
| GLM 5.3<br>`@aivax-subscription/glm-5.3` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |
| GLM 5.3 Flash<br>`@aivax-subscription/glm-5.3-flash` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |
| Kimi K3.1 Pro<br>`@aivax-subscription/kimi-k3.1-pro` | 500K tokens | ≈ $40 | ≈ $200<br>5× Pro | ≈ $490<br>12.5× Pro |
| MiniMax M3.1 Flash<br>`@aivax-subscription/minimax-m3.1-flash` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |

Cada valor assume que toda a cota mensal é gasta nesse modelo com uma mistura típica de tokens de entrada, entrada em cache e saída, e é arredondado para cima para o próximo múltiplo de $10. Os valores são estimativas, não quantias garantidas. Dividir o uso entre vários modelos de assinatura divide a mesma cota entre eles.

A cota é renovada no início de cada mês civil. A resposta do saldo da conta relata isso apenas como uma porcentagem usada; consulte [Cota de modelo de assinatura mensal](https://docs.aivax.net/pt-br/docs/limits.md#monthly-subscription-model-quota).

## Taxa de consumo

Os modelos de assinatura são fornecidos por fornecedores por meio de acordos diretos que cobrem o preço original dos modelos. A taxa na qual um modelo consome a cota segue esses acordos, portanto, é dinâmica e pode mudar diariamente, além de poder flutuar durante o dia. Você pode notar que o mesmo modelo usa ligeiramente mais ou ligeiramente menos de sua cota para solicitações semelhantes. Os equivalentes incluídos acima mudam conforme isso.

## Disponibilidade

Um modelo de assinatura executa o modelo que nomeia. A AIVAX verifica rigorosamente os modelos entregues por seus fornecedores contra os modelos contratados.

Um modelo de assinatura pode ficar indisponível por um período indeterminado quando seu fornecedor tem demanda excessiva. As solicitações falham enquanto estiverem indisponíveis; use outro modelo de assinatura ou um modelo integrado regular enquanto isso.

## Quando a cota se esgota

Quando a cota se esgota, ou o plano não a inclui, uma solicitação a um modelo de assinatura retorna `429 Too Many Requests`. A solicitação não é roteada para um modelo fora da assinatura e nunca é cobrada no saldo da conta. Para continuar antes que a cota seja renovada, selecione outro modelo explicitamente; os modelos regulares são cobrados no saldo nas suas taxas.

## Retenção de dados

Os modelos de assinatura não têm retenção zero de dados. Seus fornecedores coletam prompts e os mantêm por um período indeterminado para moderação e controle interno. Os prompts não são usados para treinamento.

Com [Somente provedores de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) habilitado, as solicitações a modelos de assinatura falham. Não envie dados pessoais, confidenciais ou regulamentados a esses modelos, a menos que essa retenção seja aceitável. Os próprios registros da AIVAX seguem a configuração de registro de conversas da conta; consulte [Processadores de Dados](https://docs.aivax.net/pt-br/docs/legal/third-party-processors.md#inference).

## Identificar modelos de assinatura

Os modelos de assinatura não têm preços por token no catálogo. Para identificá-los a partir de um aplicativo, verifique `flags.isSubscription` em `GET /api/v1/information/models.json` ou `_details.provider_model.subscription` em `GET /v1/models`. Consulte [Nomes de modelos e gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/models-and-gateway-names.md).
