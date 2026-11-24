Source: https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.html

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto. Provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` | Nunca utilizados. |
| `Cheapest`, `Fastest`, `Quality` | Considerados apenas quando **Permitir provedores especiais** está habilitado nas configurações de privacidade da conta no painel. Contas novas permitem provedores especiais por padrão, e essa escolha pode ser alterada na caixa de diálogo de boas-vindas ou nas configurações da conta. |
| `Special` | Sempre considerados, independentemente da configuração da conta. Seleciona o menor preço combinado de tokens de entrada e saída aplicável entre provedores regulares e especiais elegíveis. |

Quando um modelo está disponível atualmente apenas por meio de provedores especiais, as solicitações que não os permitem falham. Use a preferência `Special`, ou habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced`. [Provedores apenas de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.

Listar a tag de um provedor especial em `allowed_providers`, ou como sufixo `#tag` no nome do modelo, direciona para ele sob qualquer preferência, incluindo `Balanced`.
