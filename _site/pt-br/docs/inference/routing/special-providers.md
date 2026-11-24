Source: https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.html

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto. Provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` | Nunca utilizados. |
| `Cheapest`, `Fastest`, `Quality` | Considerados apenas quando **Permitir provedores especiais** está habilitado nas configurações de privacidade da conta no painel. Contas novas permitem provedores especiais por padrão, e essa escolha pode ser alterada na caixa de boas-vindas ou nas configurações da conta. |
| `Special` | Sempre considerados, independentemente da configuração da conta. Seleciona o menor preço combinado de tokens de entrada e saída aplicável entre provedores regulares e especiais elegíveis. |

## Quando um modelo está disponível apenas por meio de provedores especiais

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, as solicitações que não os permitem falham. Para continuar usando o modelo, faça uma das seguintes opções:

- Use a preferência `Special`.
- Habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced`.

As regras de [provedores apenas com retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.

## Selecionar um provedor especial diretamente

Listar a tag de um provedor especial em `allowed_providers`, ou como sufixo `#tag` no nome do modelo, direciona a ele sob qualquer preferência, incluindo `Balanced`.
