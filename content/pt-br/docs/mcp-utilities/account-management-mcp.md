---
{title: Gerenciamento de conta MCP,linkTitle: Gerenciamento de conta MCP,weight: 30,group: MCP Utilities,aliases: [/docs/pt-br/platform/analytics.html,/docs/pt-br/platform/logs.html,/docs/pt-br/tools/account-management-mcp.html,/docs/pt-br/mcp-utilities/account-management-mcp.html],sourceHash: 5edf659edf3794e7}
---

# Gerenciamento de conta MCP

O MCP de gerenciamento de conta expõe operações selecionadas da conta AIVAX a um cliente compatível com MCP, como uma IDE, assistente de desktop, agente interno ou ambiente de automação. Ele foi projetado para operadores confiáveis e fluxos de trabalho de back-end que precisam inspecionar as capacidades da conta, descobrir documentação ou chamar rotas autenticadas da API AIVAX sem sair do cliente MCP.

Isso não é o mesmo que adicionar uma [fonte MCP externa a um Gateway AI](/docs/pt-br/tools/mcp):

- **Fonte MCP externa:** AIVAX é o cliente MCP. Seu gateway chama outro servidor durante a inferência.
- **MCP de gerenciamento de conta:** AIVAX é o servidor MCP. Seu cliente MCP se conecta ao AIVAX e recebe ferramentas para operar a conta autenticada.

Use este MCP quando um agente precisar de contexto consciente da conta antes de agir, por exemplo:

- Quais modelos estão disponíveis para o plano atual.
- Como um recurso é documentado.
- O que uma rota de API retorna.
- Se um recurso da conta pode ser criado, atualizado ou inspecionado por meio da API AIVAX existente.

É especialmente útil para assistentes de suporte internos, ambientes de desenvolvimento, copilotos de administração de contas e agentes de implementação que precisam combinar pesquisa de documentação com chamadas reais de API.

Como o MCP pode invocar funções autenticadas do AIVAX, conecte-o apenas a clientes confiáveis e use uma chave de API privada. Não exponha este servidor aos usuários finais ou aplicativos do lado do navegador.

> [!NOTE]
> Não configure o MCP de gerenciamento de conta junto com o [MCP de documentação](/docs/pt-br/mcp-utilities/documentation-mcp) no mesmo cliente, a menos que você tenha um motivo específico para duplicar ferramentas. O MCP de gerenciamento de conta já inclui funções de pesquisa de documentação, portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

A solicitação deve ser autenticada com uma chave de API da conta. Use uma chave privada com o cabeçalho `Authorization`:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chaves e opções de autenticação, consulte [Autenticação](/docs/pt-br/authentication).

## Exemplo de configuração

A forma exata da configuração do MCP depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint do AIVAX e envie a chave privada como um cabeçalho.

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

Após a conexão do cliente, ele pode listar as ferramentas expostas pelo servidor de gerenciamento de conta. Os nomes das ferramentas são estáveis e intencionalmente prefixados com `aivax_` para permanecerem claros quando misturados com ferramentas de outros servidores MCP.

## Para que você pode usá-lo

O MCP de gerenciamento de conta é útil quando o assistente precisa raciocinar sobre a própria conta, não apenas responder a um prompt de usuário final. Ele combina documentação do AIVAX, metadados de modelos e chamadas de API de conta autenticadas em um conjunto de ferramentas controlado. Os cenários abaixo mostram usos típicos; em cada um deles, o assistente inspeciona como a conta está configurada antes de recomendar ou alterar algo.

### Criar e manter agentes

Um agente de desenvolvimento interno pode usar o MCP para ajudar a criar, revisar e ajustar [Gateways AI](/docs/pt-br/inference/ai-gateway). Antes de alterar um gateway, o agente pode pesquisar o manual do AIVAX para encontrar o recurso relevante, listar os modelos disponíveis para a conta atual, comparar as capacidades dos modelos e a disponibilidade do plano e, em seguida, invocar a rota de API da conta apropriada.

Isso é útil quando as equipes criam frequentemente assistentes para diferentes departamentos, inquilinos ou produtos. O MCP permite que o operador peça um agente em termos de produto, como "criar um assistente de suporte para políticas de reembolso com o MCP CRM habilitado", enquanto o assistente de implementação verifica quais modelos, ferramentas, coleções RAG e opções de gateway estão disponíveis na conta.

Para fluxos de trabalho de produção, mantenha uma etapa de aprovação humana antes das gravações. O MCP pode ajudar a preparar a configuração, explicar as compensações e mostrar a ação da API que pretende realizar antes de modificar o estado da conta.

### Monitorar custos e escolhas de modelos

O MCP pode ajudar um assistente de operações a investigar padrões de custo e seleção de modelos. Listando modelos e invocando rotas de API da conta para informações de uso, faturamento, gateway ou chave, o assistente pode explicar quais modelos são caros, quais rotas usam um multiplicador de assinatura e se um modelo mais barato poderia lidar com parte da carga de trabalho.

Isso é especialmente útil quando uma equipe tem muitos gateways ou trabalhos em lote e deseja entender por que os gastos mudaram. Em vez de olhar apenas para os totais, um assistente pode conectar o uso aos metadados do modelo, disponibilidade do plano, configuração do gateway e escolhas de recursos, como RAG, ferramentas, processamento em lote ou entrada multimodal.

Use isso para verificações recorrentes, como "quais gateways provavelmente gerarão custos esta semana?", "quais famílias de modelos estão sendo usadas com mais frequência?" ou "podemos mover esse fluxo de trabalho de baixo risco para um modelo menor sem perder as capacidades necessárias?".

### Entender erros e melhorar a observabilidade

Quando uma integração falha, o MCP de gerenciamento de conta pode ajudar um assistente a passar de um erro genérico para um diagnóstico útil. O assistente pode pesquisar a documentação para a rota ou recurso com falha, inspecionar os recursos da conta por meio de chamadas de API e comparar a resposta observada com o comportamento esperado.

Por exemplo, um assistente de suporte pode investigar se uma falha é causada por uma chave de API expirada, saldo insuficiente, restrições de plano, uma coleção ausente, uma rota de provedor desativada, uma configuração de gateway inválida ou um problema de esquema de ferramenta. O resultado é uma explicação mais clara: o que falhou, onde provavelmente falhou, quais evidências sustentam essa conclusão e o que o operador deve verificar em seguida.

Esse tipo de observabilidade é mais valioso quando o assistente tem permissão para ler o estado relevante da conta, mas não alterá-lo automaticamente. Dê acesso de gravação apenas a fluxos de trabalho de manutenção confiáveis.

### Meta-prompting e revisão de conversas

O MCP pode suportar fluxos de trabalho de meta-prompting, nos quais um assistente revisa conversas anteriores, comportamento do gateway e documentação para sugerir melhorias. O objetivo não é responder novamente ao usuário original; é inspecionar como o agente se comportou e identificar o que pode ser melhorado em prompts, instruções, ferramentas, escolha de modelo ou configuração de RAG.

Um agente de revisão pode procurar padrões, como respostas muito longas, perguntas ausentes, seleção incorreta de ferramentas, loops repetidos de esclarecimento, suposições inseguras ou respostas que ignoram o contexto recuperado. Em seguida, pode propor mudanças concretas: uma instrução de sistema melhor, uma descrição de ferramenta mais específica, um esquema de saída estruturada mais forte, um modelo diferente ou uma fonte de recuperação adicionada.

Isso é útil para equipes que tratam assistentes como produtos. Em vez de ajustar prompts apenas por intuição, elas podem revisar interações reais e transformar as descobertas em alterações menores no gateway ou na base de conhecimento.

### Identificar por que os modelos falham em situações específicas

Algumas falhas de modelo não são causadas apenas pelo modelo. Uma resposta errada pode vir de contexto ausente, um prompt fraco, um resultado de recuperação ruim, uma ferramenta indisponível, uma capacidade de modelo incompatível ou um esquema que permite ao modelo produzir uma saída ambígua.

Com o contexto da conta disponível por meio do MCP, um assistente pode investigar essas camadas juntas. Ele pode verificar qual modelo foi selecionado, se esse modelo suporta a capacidade necessária, qual configuração de gateway estava ativa, se a coleção RAG relevante existe e qual documentação explica o comportamento esperado.

Isso ajuda a responder perguntas como "por que o assistente falha quando os usuários perguntam sobre reembolsos?", "por que este modelo ignora uma ferramenta?" ou "por que as respostas pioram quando a solicitação inclui um arquivo?". O resultado deve ser uma explicação baseada em evidências e uma correção focada, como alterar o modelo, melhorar a descrição da ferramenta, adicionar material de recuperação ou reescrever a instrução do gateway.

### Melhorar a qualidade do RAG

O MCP de gerenciamento de conta também é útil para manter sistemas RAG. Um assistente pode inspecionar o comportamento relacionado à coleção via API, pesquisar a documentação do AIVAX para orientações de recuperação e ajudar a comparar a configuração do gateway com o fluxo de recuperação pretendido.

Use-o para investigar recuperação fraca, citações ausentes, trechos irrelevantes, pesquisas muito amplas, documentos de baixa qualidade ou casos em que um gateway deveria usar uma coleção, mas não usa. Um assistente de manutenção de RAG pode sugerir uma formulação de consulta melhor, alterações no chunking, organização da coleção, configurações de reranker, ajustes em `top` e `minScore`, ou quando expor uma coleção por meio do [collection MCP](/docs/pt-br/mcp-utilities/collections-mcp).

O melhor fluxo de trabalho é iterativo: inspecione uma resposta com falha, identifique qual contexto deveria ter sido recuperado, teste ou revise o caminho de recuperação, atualize documentos ou configurações do gateway e, em seguida, verifique novamente o mesmo padrão de conversa.

## Diretrizes de segurança

Trate este servidor MCP como uma integração administrativa. Uma chave privada conectada a ele pode ser capaz de ler ou mutar recursos da conta, dependendo das rotas que o agente invoca.

Para cada cliente MCP ou automação:

- Use uma chave de API dedicada e rotule-a claramente.
- Defina uma data de expiração, quando possível.
- Rodeie a chave se o cliente for compartilhado, comprometido ou não for mais necessário.
- Armazene a chave no mecanismo de segredo do cliente MCP ou no armazenamento de configuração local, não no controle de origem.

Não conecte o MCP de gerenciamento de conta a agentes não confiáveis, clientes de chat públicos ou sessões de navegador controladas pelo usuário. Se um fluxo de trabalho precisar apenas de recuperação de uma coleção RAG, use o [collection MCP](/docs/pt-br/mcp-utilities/collections-mcp) com configuração somente leitura. Se um gateway precisar chamar suas ferramentas externas durante a inferência, configure [funções MCP](/docs/pt-br/tools/mcp) ou [funções do lado do servidor](/docs/pt-br/tools/protocol-functions) em vez disso.
