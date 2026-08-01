# Gerenciamento de conta MCP

O gerenciamento de conta MCP expõe operações selecionadas de conta AIVAX para um cliente compatível com MCP, como um IDE, assistente de desktop, agente interno ou ambiente de automação. É projetado para operadores de confiança e fluxos de trabalho de backend que precisam inspecionar capacidades da conta, descobrir documentação ou chamar rotas de API AIVAX autenticadas sem sair do cliente MCP.

Este endpoint é diferente de configurar uma fonte externa de MCP dentro de um [AI Gateway](/docs/pt-br/tools/mcp). Nesse fluxo, AIVAX é o cliente MCP e seu gateway chama outro servidor durante a inferência. Com o gerenciamento de conta MCP, AIVAX é o servidor MCP. Seu cliente MCP se conecta ao AIVAX e recebe ferramentas para operar a conta autenticada.

Use este MCP quando um agente precisa de contexto consciente da conta antes de agir: quais modelos estão disponíveis no plano atual, como um recurso está documentado, o que uma rota de API devolve ou se um recurso de conta pode ser criado, atualizado ou inspecionado através da API AIVAX existente. É especialmente útil para assistentes de suporte interno, ambientes de desenvolvimento, copilotos de administração de conta e agentes de implementação que precisam combinar consulta de documentação com chamadas reais de API.

Como o MCP pode invocar funções AIVAX autenticadas, conecte‑o apenas a clientes confiáveis e use uma chave de API privada. Não exponha este servidor a usuários finais ou aplicações do lado do navegador.

> [!NOTE]
> Não configure o gerenciamento de conta MCP junto com o [documentation MCP](/docs/pt-br/mcp-utilities/documentation-mcp) no mesmo cliente, a menos que tenha um motivo específico para duplicar ferramentas. O gerenciamento de conta MCP já inclui funções de busca em documentação, portanto, adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

A solicitação deve autenticar com uma chave de API de conta. Use uma chave privada com o cabeçalho `Authorization`:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](/docs/pt-br/authentication).

## Exemplo de configuração

A forma exata da configuração do MCP depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP Streamable, configure o endpoint AIVAX e envie a chave privada como cabeçalho.

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

Depois que o cliente se conectar, ele pode listar as ferramentas expostas pelo servidor de gerenciamento de conta. Os nomes das ferramentas são estáveis e intencionalmente prefixados com `aivax_` para que permaneçam claros quando misturados com ferramentas de outros servidores MCP.

## O que você pode usar para

O gerenciamento de conta MCP é útil quando o assistente precisa raciocinar sobre a própria conta, não apenas responder a um prompt de usuário final. Ele fornece ao cliente MCP uma maneira controlada de combinar documentação AIVAX, metadados de modelo e chamadas de API de conta autenticadas. Isso o torna adequado para agentes operacionais, copilotos de implementação e assistentes internos que precisam inspecionar como um workspace AIVAX está configurado antes de recomendar ou mudar algo.

### Criar e manter agentes

Um agente interno de desenvolvimento pode usar o MCP para ajudar a criar, revisar e ajustar [AI Gateways](/docs/pt-br/inference/ai-gateway). Antes de mudar um gateway, o agente pode buscar no manual AIVAX o recurso relevante, listar modelos disponíveis para a conta atual, comparar capacidades de modelo e disponibilidade de plano, então invocar a rota de API de conta apropriada.

Isso é útil quando equipes criam assistentes com frequência para diferentes departamentos, locatários ou produtos. O MCP permite que o operador solicite um agente em termos de produto, como “criar um assistente de suporte para políticas de reembolso com o CRM MCP habilitado”, enquanto o assistente de implementação verifica quais modelos, ferramentas, coleções RAG e opções de gateway estão disponíveis na conta.

Para fluxos de trabalho de produção, mantenha uma etapa de aprovação humana antes de gravações. O MCP pode ajudar a preparar a configuração, explicar os trade‑offs e mostrar a ação de API que pretende executar antes de modificar o estado da conta.

### Monitorar custos e escolhas de modelo

O MCP pode ajudar um assistente de operações a investigar padrões de custo e seleção de modelo. Listando modelos e invocando rotas de API de conta para uso, faturamento, gateway ou informações de chave, o assistente pode explicar quais modelos são caros, quais rotas usam um multiplicador de assinatura e se um modelo mais barato poderia lidar com parte da carga de trabalho.

Isso é especialmente útil quando uma equipe tem muitos gateways ou jobs em lote e quer entender por que o gasto mudou. Em vez de observar apenas os totais, um assistente pode conectar uso a metadados de modelo, disponibilidade de plano, configuração de gateway e escolhas de recursos como RAG, ferramentas, lote ou entrada multimodal.

Use isso para verificações recorrentes como “quais gateways provavelmente gerarão custo esta semana?”, “quais famílias de modelo estão sendo mais usadas?” ou “podemos mover este fluxo de trabalho de baixo risco para um modelo menor sem perder capacidades necessárias?”

### Entender erros e melhorar observabilidade

Quando uma integração falha, o gerenciamento de conta MCP pode ajudar um assistente a passar de um erro genérico para um diagnóstico útil. O assistente pode buscar documentação para a rota ou recurso que falhou, inspecionar recursos de conta por meio de chamadas de API e comparar a resposta observada com o comportamento esperado.

Por exemplo, um assistente de suporte pode investigar se uma falha foi causada por uma chave de API expirou, saldo insuficiente, restrições de plano, coleção ausente, rota de provedor desativada, configuração de gateway inválida ou problema de esquema de ferramenta. O resultado é uma explicação mais clara: o que falhou, onde provavelmente falhou, quais evidências sustentam essa conclusão e o que o operador deve verificar a seguir.

Esse tipo de observabilidade é mais valioso quando o assistente tem permissão para ler o estado relevante da conta, mas não para alterá‑lo automaticamente. Conceda acesso de escrita apenas a fluxos de manutenção confiáveis.

### Meta‑prompting e revisão de conversa

O MCP pode apoiar fluxos de meta‑prompting onde um assistente revisa conversas anteriores, comportamento de gateway e documentação para sugerir melhorias. O objetivo não é responder novamente ao usuário original; é inspecionar como o agente se comportou e identificar o que pode ser melhorado em prompts, instruções, ferramentas, escolha de modelo ou configuração RAG.

Um agente de revisão pode procurar padrões como respostas excessivamente longas, perguntas ausentes, seleção de ferramenta errada, loops de clarificação repetidos, suposições inseguras ou respostas que ignoram o contexto recuperado. Em seguida, pode propor mudanças concretas: uma instrução de sistema melhor, uma descrição de ferramenta mais estreita, um esquema de saída estruturada mais forte, um modelo diferente ou uma fonte de recuperação adicional.

Isso é útil para equipes que tratam assistentes como produtos. Em vez de ajustar prompts apenas por intuição, podem revisar interações reais e transformar as constatações em mudanças menores de gateway ou de base de conhecimento.

### Identificar por que modelos falham em situações específicas

Algumas falhas de modelo não são causadas apenas pelo modelo. Uma resposta errada pode vir de contexto ausente, prompt fraco, resultado de recuperação ruim, ferramenta indisponível, capacidade de modelo incompatível ou esquema que permite ao modelo gerar saída ambígua.

Com o contexto de conta disponível via MCP, um assistente pode investigar essas camadas juntas. Ele pode verificar qual modelo foi selecionado, se esse modelo suporta a capacidade necessária, qual configuração de gateway estava ativa, se a coleção RAG relevante existe e qual documentação explica o comportamento esperado.

Isso ajuda a responder perguntas como “por que o assistente falha quando usuários perguntam sobre reembolsos?”, “por que este modelo ignora uma ferramenta?” ou “por que as respostas pioram quando a solicitação inclui um arquivo?”. O resultado deve ser uma explicação baseada em evidências e uma correção focada, como mudar o modelo, melhorar a descrição da ferramenta, adicionar material de recuperação ou reescrever a instrução do gateway.

### Melhorar a qualidade do RAG

O gerenciamento de conta MCP também é útil para manter sistemas RAG. Um assistente pode inspecionar o comportamento da API de coleção, buscar na documentação AIVAX orientações de recuperação e ajudar a comparar a configuração do gateway com o fluxo de recuperação pretendido.

Use-o para investigar recuperação fraca, citações ausentes, trechos irrelevantes, buscas excessivamente amplas, documentos de baixa qualidade ou casos em que um gateway deveria usar uma coleção mas não o faz. Um assistente de manutenção RAG pode sugerir melhor formulação de consultas, mudanças de segmentação, organização de coleções, ajustes de reranker, ajustes de `top` e `minScore`, ou quando expor uma coleção através do [collection MCP](/docs/pt-br/rag/semantic-search#mcp).

O melhor fluxo de trabalho é iterativo: inspecionar uma resposta falha, identificar qual contexto deveria ter sido recuperado, testar ou revisar o caminho de recuperação, atualizar documentos ou configurações de gateway e então re‑verificar o mesmo padrão de conversa.

## Orientação de segurança

Trate este servidor MCP como uma integração administrativa. Uma chave privada conectada a ele pode ler ou modificar recursos de conta dependendo das rotas que o agente invoca.

Use uma chave de API dedicada para cada cliente ou automação MCP. Rotule-a claramente, defina um prazo de validade quando possível e rotacione‑a se o cliente for compartilhado, comprometido ou não mais necessário. Armazene a chave no mecanismo de segredos do cliente MCP ou em um repositório de configuração local, não no controle de versão.

Não conecte o gerenciamento de conta MCP a agentes não confiáveis, clientes de chat público ou sessões de navegador controladas por usuários. Se um fluxo de trabalho só precisar de recuperação de uma coleção RAG, use o [collection MCP](/docs/pt-br/rag/semantic-search#mcp) com configuração somente leitura. Se um gateway precisar chamar suas ferramentas externas durante a inferência, configure [MCP functions](/docs/pt-br/tools/mcp) ou [server‑side functions](/docs/pt-br/tools/protocol-functions) em vez disso.