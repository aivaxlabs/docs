Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/account-management-mcp.html

# Gerenciamento de conta MCP

O MCP de gerenciamento de conta expõe operações selecionadas da conta AIVAX a um cliente compatível com MCP, como uma IDE, assistente de desktop, agente interno ou ambiente de automação. Ele foi projetado para operadores confiáveis e fluxos de trabalho de backend que precisam inspecionar as capacidades da conta, descobrir documentação ou chamar rotas autenticadas da API AIVAX sem sair do cliente MCP.

Isso não é o mesmo que adicionar uma [fonte MCP externa a um Gateway de IA](https://docs.aivax.net/pt-br/docs/tools/mcp.md):

- **Fonte MCP externa:** AIVAX é o cliente MCP. Seu gateway chama outro servidor durante a inferência.
- **MCP de gerenciamento de conta:** AIVAX é o servidor MCP. Seu cliente MCP se conecta à AIVAX e recebe ferramentas para operar a conta autenticada.

Use este MCP quando um agente precisar de contexto consciente da conta antes de agir, por exemplo:

- Quais modelos estão disponíveis para o plano atual.
- Como um recurso está documentado.
- O que uma rota de API retorna.
- Se um recurso da conta pode ser criado, atualizado ou inspecionado por meio da API AIVAX existente.

É especialmente útil para assistentes de suporte internos, ambientes de desenvolvimento, copilotos de administração de conta e agentes de implementação que precisam combinar busca de documentação com chamadas reais de API.

Como o MCP pode invocar funções autenticadas da AIVAX, conecte-o apenas a clientes confiáveis e use uma chave de API privada. Não exponha este servidor a usuários finais ou aplicativos do lado do navegador.

> [!NOTE]
> Não configure o MCP de gerenciamento de conta junto com o [MCP de documentação](https://docs.aivax.net/pt-br/docs/mcp-utilities/documentation-mcp.md) no mesmo cliente, a menos que você tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de conta já inclui funções de busca de documentação, portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

A solicitação deve ser autenticada com uma chave de API da conta. Use uma chave privada no cabeçalho `Authorization`:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chaves e opções de autenticação, consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).

## Exemplo de configuração

A forma exata da configuração do MCP depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint da AIVAX e envie a chave privada como um cabeçalho.

```json
{
  "servers": {
    "aivax-account": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/account-management",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

Após o cliente se conectar, ele pode listar as ferramentas expostas pelo servidor de gerenciamento de conta. Os nomes das ferramentas são estáveis e intencionalmente prefixados com `aivax_` para permanecerem claros quando misturados com ferramentas de outros servidores MCP.

## Para que você pode usá-lo

O MCP de gerenciamento de conta é útil quando um assistente precisa raciocinar sobre a conta em si, não apenas responder a um prompt de usuário final. Ele combina documentação da AIVAX, metadados de modelos e chamadas de API de conta autenticadas em um conjunto de ferramentas controlado. Usos típicos:

- **Criar e manter agentes.** Pesquise o manual, liste os modelos disponíveis para a conta, compare capacidades e disponibilidade de planos e crie ou ajuste [Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) por meio da API da conta.
- **Monitorar custos e escolhas de modelo.** Conecte dados de uso e faturamento aos metadados do modelo e à configuração do gateway para ver quais gateways ou modelos geram gastos e se um modelo menor poderia lidar com um fluxo de trabalho de baixo risco.
- **Diagnosticar erros.** Pesquise a documentação para uma rota falhando, inspecione recursos da conta e verifique causas prováveis, como uma chave de API expirada, saldo insuficiente, restrições de plano, uma coleção ausente ou uma configuração de gateway inválida.
- **Revisar conversas e prompts.** Inspeccione como um agente se comportou e sugira alterações nas instruções, descrições de ferramentas, escolha de modelo ou configuração de RAG.
- **Melhorar a qualidade do RAG.** Investigue recuperação fraca e ajuste a configuração do gateway, configurações do reranker, `top` e `minScore`, ou exponha uma coleção por meio do [collection MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).

Para fluxos de trabalho de produção, mantenha uma etapa de aprovação humana antes das gravações e conceda acesso de gravação apenas a fluxos de trabalho de manutenção confiáveis.

## Orientações de segurança

Trate este servidor MCP como uma integração administrativa. Uma chave privada conectada a ele poderá ler ou modificar recursos da conta, dependendo das rotas que o agente invoca.

Para cada cliente MCP ou automação:

- Use uma chave de API dedicada e rotule-a claramente.
- Defina uma data de expiração, quando possível.
- Rotacione a chave se o cliente for compartilhado, comprometido ou não for mais necessário.
- Armazene a chave no mecanismo de segredo do cliente MCP ou no armazenamento de configuração local, não no controle de origem.

Não conecte o MCP de gerenciamento de conta a agentes não confiáveis, clientes de chat públicos ou sessões de navegador controladas pelo usuário. Se um fluxo de trabalho precisar apenas de recuperação de uma coleção RAG, use o [collection MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md) com configuração somente leitura. Se um gateway precisar chamar suas ferramentas externas durante a inferência, configure [funções MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) ou [funções do lado do servidor](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) em vez disso.
