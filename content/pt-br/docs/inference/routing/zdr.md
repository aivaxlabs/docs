---
{title: Provedores de Retenção Zero de Dados,linkTitle: ZDR,weight: 30,group: Routing,sourceHash: def0714c29ed63b2,aliases: [/docs/pt-br/inference/routing/zdr.html]}
---

# Apenas provedores com retenção zero de dados

Ative a opção **Apenas provedores com retenção zero de dados** nas configurações da conta no painel para rotear apenas inferências de texto com modelos integrados para provedores que declaram retenção zero de dados para prompts. A classificação é baseada na política de retenção de dados declarada por cada provedor.

## Como isso afeta o roteamento

Os provedores que não são classificados como tendo retenção zero de dados são excluídos antes que `allowed_providers` e `preset` sejam aplicados. Quando não há nenhum provedor com retenção zero de dados disponível para o modelo, a solicitação falha em vez de fazer fallback para outro provedor. Nesse caso, escolha um modelo com um provedor de retenção zero de dados ou desative a opção.

## O que isso não altera

A opção se aplica à inferência de texto. Ela não altera o registro de conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.

## Etapas da plataforma

As etapas da plataforma executadas ao redor de uma solicitação, como moderação de conteúdo, roteador de complexidade e reescrita de consultas RAG, sempre usam um provedor com retenção zero de dados, independentemente de a opção da conta estar ativada ou não. Se nenhum estiver disponível para uma delas, a solicitação falha e pode ser retryada mais tarde.
