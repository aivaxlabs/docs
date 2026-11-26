---
{title: Provedores Especiais,linkTitle: Provedores especiais,weight: 40,group: Routing,sourceHash: bc3b3dd75d9f1e70,aliases: [/docs/pt-br/inference/routing/special-providers.html]}
---

# Provedores especiais

Alguns modelos integrados também são oferecidos por provedores especiais, que os fornecem a preços com desconto. Provedores especiais nunca são selecionados, a menos que você opte por isso:

| Preferência de roteamento | Provedores especiais |
|---|---|
| `Balanced` (Equilibrado) | Nunca utilizados. |
| `Cheapest`, `Fastest`, `Quality` (Mais barato, Mais rápido, Qualidade) | Considerados apenas quando **Permitir provedores especiais** está habilitado nas configurações de privacidade da conta no painel. Contas novas permitem provedores especiais por padrão, e essa escolha pode ser alterada na caixa de diálogo de boas-vindas ou nas configurações da conta. |
| `Special` (Especial) | Sempre considerados, independentemente da configuração da conta. Seleciona o menor preço combinado de tokens de entrada e saída aplicável entre provedores regulares e especiais elegíveis. |

## Quando um modelo está disponível apenas por meio de provedores especiais

Quando um modelo está atualmente disponível apenas por meio de provedores especiais, as solicitações que não os permitem falham. Para continuar usando o modelo, faça uma das seguintes opções:

- Use a preferência `Special`.
- Habilite **Permitir provedores especiais** e use uma preferência diferente de `Balanced`.

As regras [Apenas provedores de retenção zero de dados](zdr.md) e `allowed_providers` ainda se aplicam aos provedores especiais.

## Retenção de dados

Provedores especiais não são provedores de retenção zero de dados e podem manter as entradas e respostas que recebem. Eles estão habilitados por padrão em contas novas: desative **Permitir provedores especiais** ou habilite [Apenas provedores de retenção zero de dados](zdr.md) quando os dados que você envia não puderem ser retidos.

## Selecionar um provedor especial diretamente

Listar a tag de um provedor especial em `allowed_providers`, ou como sufixo `#tag` no nome do modelo, direciona a ele sob qualquer preferência, incluindo `Balanced`.
