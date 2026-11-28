Source: https://docs.aivax.net/pt-br/docs/inference/providers.html

# Provedores

Os provedores são os serviços que realmente executam os modelos integrados aos quais você chama por meio do AIVAX. Um único modelo pode ser oferecido por vários provedores, cada um com seu próprio preço, velocidade, capacidade e política de coleta de dados. O AIVAX escolhe entre eles de acordo com suas [preferências de roteamento](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md) e configurações da conta.

## De onde vêm os provedores

Os provedores de cada modelo estão listados na [página de Modelos](https://aivax.net/models). O AIVAX funciona como um mercado: os provedores oferecem os modelos que distribuem, e o AIVAX lista essas ofertas. Como os provedores decidem o que oferecem, um provedor pode ser adicionado ou removido de um modelo sem aviso prévio.

Alguns provedores são negociados diretamente com o AIVAX. Outros são agregadores de outros serviços, e o AIVAX lista os provedores disponíveis por meio deles. Em ambos os casos, as regras da sua conta AIVAX se aplicam a todos os provedores. Por exemplo, [Apenas provedores de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) exclui qualquer provedor que não declare retenção zero de dados, independentemente de como ele é acessado.

## Coleta de dados

Os provedores podem ver o conteúdo das suas solicitações. Dependendo do provedor, prompts e respostas podem ser moderados, coletados, retidos ou usados para treinamento.

A página de Modelos mostra a política de coleta de dados de cada provedor. A política é declarada pelo próprio provedor; quando um provedor não declara uma, a plataforma a classifica como **desconhecida**.

Para manter conteúdos sensíveis longe de provedores que retêm dados, você controla quais provedores são elegíveis:

- Ative [Apenas provedores de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) nas configurações da conta.
- Restrinja os provedores elegíveis com `allowed_providers`; consulte [Configurar roteamento de provedores](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md).
- Revise as políticas dos provedores listadas na página de Modelos antes de enviar dados pessoais, confidenciais ou regulamentados. Consulte também [Processadores de Dados](https://docs.aivax.net/pt-br/docs/legal/third-party-processors.md#inference).

## Provedores de menor custo

Alguns provedores oferecem um modelo por um custo menor do que o habitual, por meio de acordos especiais ou hardware dedicado.

Essas ofertas geralmente são atendidas por [provedores especiais](https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.md), que são usados apenas quando sua preferência de roteamento e configurações da conta permitem isso.

## Autenticidade do modelo

O AIVAX coleta continuamente métricas anônimas sobre o desempenho, latência e capacidade de resolução de problemas de cada provedor, incluindo o envio de tarefas aleatórias, para verificar se o modelo servido é o anunciado. Essas verificações são aplicadas com muito mais rigor aos provedores especiais e aos provedores por trás dos modelos de assinatura.

Quando um provedor é suspeito de servir um modelo diferente, o AIVAX o verifica e audita imediatamente. Provedores encontrados como não genuínos são removidos do pool de provedores imediatamente.

## Provedores especiais

[Provedores especiais](https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.md) são frequentemente endpoints dedicados cujos operadores concordaram diretamente com o AIVAX para fornecer os modelos. Por esse motivo, eles são classificados como **ocultos**, e sua identidade não é divulgada. O AIVAX mantém o compromisso com a qualidade e autenticidade desses provedores, que estão sujeitos às verificações descritas em [Autenticidade do modelo](#model-authenticity).

## Provedores de modelos de assinatura

[Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md) são atendidos por endpoints dedicados especiais de um pool interno de provedores. Eles usam a [cota mensal de modelos de assinatura do seu plano](https://docs.aivax.net/pt-br/docs/pricing/plans-and-limits.md#monthly-subscription-model-quota) e estão sujeitos às verificações descritas em [Autenticidade do modelo](#model-authenticity).
