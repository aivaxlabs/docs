---
{title: Provedores Especiais,linkTitle: Provedores especiais,weight: 40,group: Routing,sourceHash: cd064868b2e3a4bf,aliases: [/docs/pt-br/inference/routing/special-providers.html]}
---

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto sob condições que podem ser menos transparentes do que as dos provedores regulares. Provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` (Equilibrado) | Nunca utilizados. |
| `Cheapest`, `Fastest`, `Quality` (Mais barato, Mais rápido, Qualidade) | Considerados apenas quando **Permitir provedores especiais** está habilitado nas configurações de privacidade da conta no painel. Contas novas permitem provedores especiais por padrão, e essa escolha pode ser alterada na caixa de diálogo de boas-vindas ou nas configurações da conta. |
| `Special` (Especial) | Sempre considerados, independentemente da configuração da conta. Seleciona o menor preço combinado de tokens de entrada e saída aplicável entre provedores regulares e especiais elegíveis, quebrando empates pelo tempo de atividade relatado e, em seguida, por falhas recentes. |

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, as solicitações que não os permitem falham. Use a preferência `Special` (Especial), ou habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced` (Equilibrado). [Provedores apenas de retenção zero de dados](zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.

Listar a tag de um provedor especial em `allowed_providers`, ou como sufixo `#tag` no nome do modelo, direciona a ele sob qualquer preferência, incluindo `Balanced` (Equilibrado).
