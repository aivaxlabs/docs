Source: https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.html

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto sob condições que podem ser menos transparentes do que as dos provedores regulares. Os provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` (Equilibrado) | Nunca utilizados. |
| `Cheapest` (Mais barato), `Fastest` (Mais rápido), `Quality` (Qualidade) | Considerados apenas quando **Permitir provedores especiais** estiver habilitado nas configurações de privacidade da conta no painel. Essa opção está desativada por padrão. |
| `Special` (Especial) | Sempre considerados e priorizados, independentemente da configuração da conta. |

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, as solicitações que não os permitem falham. Use a preferência `Special`, ou habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced`. [Provedores apenas de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.
