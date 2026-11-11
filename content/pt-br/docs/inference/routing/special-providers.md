---
{title: Provedores Especiais,linkTitle: Provedores especiais,weight: 40,group: Routing,sourceHash: d89b1b796057beaa,aliases: [/docs/pt-br/inference/routing/special-providers.html]}
---

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto sob condições que podem ser menos transparentes do que as dos provedores regulares. Provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` | Nunca utilizados. |
| `Cheapest`, `Fastest`, `Quality` | Considerados apenas quando **Allow special providers** está habilitado nas configurações de privacidade da conta no painel. Essa opção vem desativada por padrão. |
| `Special` | Sempre considerados, independentemente da configuração da conta. Seleciona o menor preço combinado de tokens de entrada e saída aplicável entre provedores regulares e especiais elegíveis, quebrando empates pelo tempo de atividade relatado e, em seguida, por falhas recentes. |

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, as solicitações que não os permitem falham. Use a preferência `Special`, ou habilite **Allow special providers** e use uma preferência diferente de `Balanced`. [Zero data retention providers only](zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.

Listar a tag de um provedor especial em `allowed_providers`, ou como sufixo `#tag` no nome do modelo, direciona para ele sob qualquer preferência, incluindo `Balanced`.
