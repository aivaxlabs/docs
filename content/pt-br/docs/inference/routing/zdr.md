---
{title: Provedores de Retenção Zero de Dados,linkTitle: ZDR,weight: 30,group: Routing,sourceHash: b9ebb0e3aafdc212,aliases: [/docs/pt-br/inference/routing/zdr.html]}
---

# Apenas provedores com retenção zero de dados

Ative **Apenas provedores com retenção zero de dados** nas configurações da conta no painel para rotear apenas a inferência de texto com modelos integrados para provedores que declaram retenção zero de dados para os prompts. Os provedores que não são classificados como de retenção zero de dados são excluídos antes que `allowed_providers` e `preset` sejam aplicados. Quando não há um provedor com retenção zero de dados disponível para o modelo, a solicitação falha em vez de fazer fallback para outro provedor; escolha um modelo com um provedor de retenção zero de dados ou desative a opção.

A classificação de retenção zero de dados reflete o que cada provedor ou agregador declara. A AIVAX não audita, verifica nem garante que terceiros não colem, retenham ou utilizem prompts, e não é responsável pelo descumprimento por parte de terceiros dessas declarações.

A opção aplica-se à inferência de texto. Ela não altera o registro de conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.

As etapas da plataforma que são executadas antes ou durante uma solicitação sempre usam um provedor com retenção zero de dados, independentemente de a opção da conta estar ativada: moderação de conteúdo, roteador de complexidade, reescrita de consultas RAG, leitura do resumo pelos clientes de chat, reescrita de texto com instruções de voz para geração de fala e Media Injector. Desativar a opção não move essas etapas para outro provedor. Quando não há um provedor com retenção zero de dados disponível para uma delas, a solicitação falha e deve ser tentada novamente mais tarde.
