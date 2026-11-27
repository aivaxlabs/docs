---
{title: Provedores,linkTitle: Provedores,weight: 3,group: Inference,sourceHash: a8f52ab29cdb569d,aliases: [/docs/pt-br/inference/providers.html]}
---

# Provedores

Os provedores são os serviços que realmente executam os modelos integrados que você chama por meio do AIVAX. Um único modelo pode ser oferecido por vários provedores, cada um com seu próprio preço, velocidade, capacidade e política de coleta de dados. O AIVAX escolhe entre eles de acordo com suas [preferências de roteamento](/docs/pt-br/inference/routing/setup-routing.md) e configurações da conta.

## De onde vêm os provedores

Os provedores de cada modelo estão listados na [página de Modelos](https://aivax.net/models). O AIVAX funciona como um mercado: os provedores oferecem os modelos que distribuem, e o AIVAX lista essas ofertas. Como os provedores decidem o que oferecem, um provedor pode ser adicionado ou removido de um modelo sem aviso prévio.

Alguns provedores são negociados diretamente com o AIVAX. Outros são agregadores de outros serviços, como OpenRouter, Vertex AI ou outros roteadores, e o AIVAX lista os provedores disponíveis por meio deles. Em ambos os casos, as regras da sua conta AIVAX se aplicam a todos os provedores. Por exemplo, [Apenas provedores de retenção zero de dados](/docs/pt-br/inference/routing/zdr.md) exclui qualquer provedor que não declare retenção zero de dados, independentemente de como ele é acessado.

## Coleta de dados

Os provedores podem ver o conteúdo das suas solicitações. Dependendo do provedor, os prompts e as respostas podem ser moderados, coletados, retidos ou usados para treinamento.

A página de Modelos mostra a política de coleta de dados de cada provedor. A política é declarada pelo próprio provedor; quando um provedor não declara uma, a plataforma a classifica como **desconhecida**. Essas políticas são compromissos que os provedores assumem com o AIVAX. O AIVAX não audita nem verifica se elas são seguidas.

Para manter conteúdos sensíveis longe de provedores que retêm dados:

- Ative [Apenas provedores de retenção zero de dados](/docs/pt-br/inference/routing/zdr.md) nas configurações da conta.
- Restrinja os provedores elegíveis com `allowed_providers`; consulte [Configurar roteamento de provedores](/docs/pt-br/inference/routing/setup-routing.md).
- Revise as políticas dos provedores listadas na página de Modelos antes de enviar dados pessoais, confidenciais ou regulamentados. Consulte também [Processadores de Dados](/docs/pt-br/legal/third-party-processors.md#inference).

## Preços abaixo da taxa usual do modelo

Alguns provedores cobram muito menos do que a taxa usual do modelo. Essas ofertas decorrem de acordos especiais ou servem ao modelo com capacidade reduzida. Elas podem ser obtidas de várias maneiras, como a venda de cotas excedentes, negociações diretas ou hardware dedicado.

As ofertas com desconto são geralmente atendidas por [provedores especiais](/docs/pt-br/inference/routing/special-providers.md), que são usados apenas quando sua preferência de roteamento e as configurações da conta permitem isso.

## Autenticidade do modelo

É raro que um provedor distorça qual modelo está fornecendo. O AIVAX coleta continuamente métricas anônimas sobre o desempenho, latência e capacidade de resolução de problemas de cada provedor, incluindo o envio de tarefas aleatórias, para verificar se o modelo fornecido é o anunciado. Essas verificações são aplicadas com muito mais rigor aos provedores especiais e aos provedores por trás dos modelos de assinatura.

Quando um provedor é suspeito de fornecer um modelo diferente, o AIVAX o verifica e audita imediatamente. Os provedores encontrados como não genuínos são removidos do pool de provedores imediatamente.

## Provedores especiais

[Provedores especiais](/docs/pt-br/inference/routing/special-providers.md) são frequentemente endpoints dedicados cujos operadores concordaram diretamente com o AIVAX para fornecer os modelos. Por esse motivo, eles são classificados como **ocultos**, e sua identidade não é divulgada. O AIVAX mantém o compromisso com a qualidade e autenticidade desses provedores, que estão sujeitos às verificações descritas em [Autenticidade do modelo](#model-authenticity).

## Provedores de modelos de assinatura

[Modelos de assinatura](/docs/pt-br/inference/subscription-models/overview.md) são atendidos por endpoints dedicados especiais de um pool interno de provedores, com taxas negociadas, que fornecem modelos de acordo com a disponibilidade. Essas taxas são voláteis e podem mudar de hora em hora, mas sempre permanecem abaixo das taxas originais do modelo. É por isso que a [taxa de consumo](/docs/pt-br/inference/subscription-models/overview.md#consumption-rate) de um modelo de assinatura pode mudar ao longo do tempo.
