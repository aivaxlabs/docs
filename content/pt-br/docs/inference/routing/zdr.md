---
{title: Provedores de Retenção Zero de Dados,linkTitle: ZDR,weight: 30,group: Routing,sourceHash: 11fcbad113931046,aliases: [/docs/pt-br/inference/routing/zdr.html]}
---

# Apenas provedores com retenção zero de dados

Ative a opção **Apenas provedores com retenção zero de dados** nas configurações da conta no painel para direcionar apenas as inferências de texto com modelos integrados para provedores que não retêm prompts. Os provedores que não possuem retenção zero de dados são excluídos antes que `allowed_providers` e `preset` sejam aplicados. Quando não há nenhum provedor com retenção zero de dados disponível para o modelo, a solicitação falha em vez de fazer fallback para outro provedor; escolha um modelo com um provedor de retenção zero de dados ou desative essa opção.

Essa opção aplica-se apenas à inferência de texto. Ela não altera o registro das conversas; use `allow_logging` ou a configuração de registro de conversas da conta para isso.
