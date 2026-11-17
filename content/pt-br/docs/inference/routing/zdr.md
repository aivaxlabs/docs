---
{title: Provedores de Retenção Zero de Dados,linkTitle: ZDR,weight: 30,group: Routing,sourceHash: ad9b19a6d84d9451,aliases: [/docs/pt-br/inference/routing/zdr.html]}
---

# Apenas provedores com retenção zero de dados

Ative a opção **Apenas provedores com retenção zero de dados** nas configurações da conta no painel para direcionar apenas as inferências de texto com modelos integrados para provedores que não retêm prompts. Os provedores que não possuem retenção zero de dados são excluídos antes que `allowed_providers` e `preset` sejam aplicados. Quando não há nenhum provedor com retenção zero de dados disponível para o modelo, a solicitação falha em vez de fazer fallback para outro provedor; escolha um modelo com um provedor de retenção zero de dados ou desative essa opção.

Essa opção aplica-se apenas à inferência de texto. Ela não altera o registro das conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.

As etapas da plataforma executadas antes ou durante uma solicitação sempre usam um provedor com retenção zero de dados, independentemente de a opção da conta estar ativada: moderação de conteúdo, roteador de complexidade, reescrita de consultas RAG, leitura em voz alta do resumo pelos clientes de chat, reescrita de texto com instruções de voz para geração de fala e Media Injector. Desativar a opção não move essas etapas para outro provedor. Quando não há um provedor com retenção zero de dados disponível para uma delas, a solicitação falha e deve ser tentada novamente mais tarde.
