Source: http://localhost:1313/pt-br/docs/mcp-utilities/account-management-mcp.html

# Gerenciamento de conta MCP

O gerenciamento de conta MCP expõe operações selecionadas da conta AIVAX para um cliente compatível com MCP, como uma IDE, assistente de desktop, agente interno ou ambiente de automação. Ele foi projetado para operadores confiáveis e fluxos de trabalho de back‑end que precisam inspecionar capacidades da conta, descobrir documentação ou chamar rotas de API AIVAX autenticadas sem sair do cliente MCP.

Este endpoint é diferente de configurar uma fonte MCP externa dentro de um [AI Gateway](http://localhost:1313/pt-br/docs/tools/mcp.md). Nesse fluxo, a AIVAX é o cliente MCP e seu gateway chama outro servidor durante a inferência. Com o gerenciamento de conta MCP, a AIVAX é o servidor MCP. Seu cliente MCP se conecta à AIVAX e recebe ferramentas para operar a conta autenticada.

Use este MCP quando um agente precisar de contexto relacionado à conta antes de agir: quais modelos estão disponíveis no plano atual, como uma funcionalidade está documentada, o que uma rota de API retorna ou se um recurso da conta pode ser criado, atualizado ou inspecionado através da API AIVAX existente. É especialmente útil para assistentes de suporte interno, ambientes de desenvolvimento, copilotos de administração de conta e agentes de implementação que precisam combinar busca de documentação com chamadas reais de API.

Como o MCP pode invocar funções AIVAX autenticadas, conecte‑o apenas a clientes confiáveis e use uma chave de API privada. Não exponha este servidor a usuários finais ou aplicações no navegador.

> [!NOTE]
> Não configure o gerenciamento de conta MCP junto com o [documentation MCP](http://localhost:1313/pt-br/docs/mcp-utilities/documentation-mcp.md) no mesmo cliente, a menos que tenha um motivo específico para duplicar ferramentas. O gerenciamento de conta MCP já inclui funções de busca de documentação, de adicionar ambos os servidores geralmente cria ferramentas de documentação redundantes e pode tornar a seleção de ferramentas menos previsível.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

A requisição deve autenticar com uma chave de API da conta. Use uma chave privada no cabeçalho `Authorization`:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](http://localhost:1313/pt-br/docs/authentication.md).

## Exemplo de configuração

A forma exata da configuração do MCP depende do cliente. Para clientes que aceitam uma entrada de servidor HTTP streamable, configure o endpoint AIVAX e envie a chave privada como cabeçalho.

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

Após o cliente se conectar, ele pode listar as ferramentas expostas pelo servidor de gerenciamento de conta. Os nomes das ferramentas são estáveis e intencionalmente prefixados com `aivax_` para que permaneçam claros quando misturados com ferramentas de outros servidores MCP.

## O que você pode usar

O gerenciamento de conta MCP é útil quando o assistente precisa raciocinar sobre a própria conta, não apenas responder a um prompt do usuário final. Ele fornece ao cliente MCP uma forma controlada de combinar documentação AIVAX, metadados de modelo e chamadas de API de conta autenticadas. Isso o torna adequado para agentes operacionais, copilotos de implementação e assistentes internos que precisam inspecionar como um workspace AIVAX está configurado antes de recomendar ou alterar algo.

### Criar e manter agentes

Um agente de desenvolvimento interno pode usar o MCP para ajudar a criar, revisar e ajustar [AI Gateways](http://localhost:1313/pt-br/docs/inference/ai-gateway.md). Antes de alterar um gateway, o agente pode buscar no manual AIVAX a funcionalidade relevante, listar os modelos disponíveis para a conta atual, comparar capacidades de modelo e disponibilidade de plano, e então invocar a rota de API de conta apropriada.

Isso é útil quando equipes criam assistentes para diferentes departamentos, inquilinos ou produtos. O MCP permite que o operador solicite um agente em termos de produto, como “criar um assistente de suporte para políticas de reembolso com o MCP de CRM habilitado”, enquanto o assistente de implementação verifica quais modelos, ferramentas, coleções RAG e opções de gateway estão disponíveis na conta.

Para fluxos de trabalho de produção, mantenha uma etapa de aprovação humana antes de gravar. O MCP pode ajudar a preparar a configuração, explicar trade‑offs e mostrar a ação de API que pretende executar antes de modificar o estado da conta.

### Monitorar custos e escolhas de modelo

O MCP pode ajudar um assistente de operações a investigar padrões de custo e seleção de modelo. Listando modelos e invocando rotas de API de conta para uso, faturamento, gateway ou informações de chave, o assistente pode explicar quais modelos são caros, quais rotas usam um multiplicador de assinatura e se um modelo mais barato poderia lidar com parte da carga.

Isso é especialmente útil quando uma equipe tem muitos gateways ou jobs em lote e quer entender por que o gasto mudou. Em vez de observar apenas totais, um assistente pode conectar uso a metadados de modelo, disponibilidade de plano, configuração de gateway e escolhas de funcionalidade como RAG, ferramentas, lote ou entrada multimodal.

Use isso para verificações recorrentes como “quais gateways provavelmente gerarão custo esta semana?”, “quais famílias de modelo estão sendo mais usadas?” ou “podemos mover este fluxo de trabalho de baixo risco para um modelo menor sem perder capacidades necessárias?”

### Entender erros e melhorar observabilidade

Quando uma integração falha, o gerenciamento de conta MCP pode ajudar um assistente a passar de um erro genérico para um diagnóstico útil. O assistente pode buscar documentação para a rota ou funcionalidade que falhou, inspecionar recursos da conta via chamadas de API e comparar a resposta observada com o comportamento esperado.

Por exemplo, um assistente de suporte pode investigar se a falha foi causada por uma chave de API expirada, saldo insuficiente, restrições de plano, coleção ausente, rota de provedor desativada, configuração de gateway inválida ou problema de esquema de ferramenta. O resultado é uma explicação mais clara: o que falhou, onde provavelmente falhou, quais evidências sustentam a conclusão e o que o operador deve verificar em seguida.

Esse tipo de observabilidade é mais valioso quando o assistente tem permissão para ler o estado relevante da conta, mas não para alterá‑lo automaticamente. Conceda acesso de escrita apenas a fluxos de manutenção confiáveis.

### Meta‑prompting e revisão de conversas

O MCP pode suportar fluxos de meta‑prompting onde um assistente revisa conversas anteriores, comportamento do gateway e documentação para sugerir melhorias. O objetivo não é responder novamente ao usuário original; é inspecionar como o agente se comportou e identificar o que pode ser melhorado em prompts, instruções, ferramentas, escolha de modelo ou configuração RAG.

Um agente de revisão pode procurar padrões como respostas muito longas, perguntas ausentes, seleção errada de ferramenta, loops de esclarecimento repetidos, suposições inseguras ou respostas que ignoram o contexto recuperado. Ele pode então propor mudanças concretas: uma instrução de sistema melhor, descrição de ferramenta mais restrita, esquema de saída estruturada mais forte, modelo diferente ou fonte de recuperação adicional.

Isso é útil para equipes que tratam assistentes como produtos. Em vez de ajustar prompts apenas por intuição, podem revisar interações reais e transformar as descobertas em mudanças menores de gateway ou de base de conhecimento.

### Identificar por que modelos falham em situações específicas

Algumas falhas de modelo não são causadas apenas pelo modelo. Uma resposta errada pode vir de contexto ausente, prompt fraco, resultado de recuperação ruim, ferramenta indisponível, capacidade de modelo incompatível ou esquema que permite ao modelo gerar saída ambígua.

Com o contexto da conta disponível via MCP, um assistente pode investigar essas camadas juntas. Ele pode verificar qual modelo foi selecionado, se esse modelo suporta a capacidade necessária, qual configuração de gateway estava ativa, se a coleção RAG relevante existe e qual documentação explica o comportamento esperado.

Isso ajuda a responder perguntas como “por que o assistente falha quando usuários perguntam sobre reembolsos?”, “por que este modelo ignora uma ferramenta?” ou “por que as respostas pioram quando a requisição inclui um arquivo?”. O resultado deve ser uma explicação baseada em evidências e uma correção focada, como mudar o modelo, melhorar a descrição da ferramenta, adicionar material de recuperação ou reescrever a instrução do gateway.

### Melhorar a qualidade do RAG

O gerenciamento de conta MCP também é útil para manter sistemas RAG. Um assistente pode inspecionar o comportamento da API de coleções, buscar no manual AIVAX orientações de recuperação e ajudar a comparar a configuração do gateway com o fluxo de recuperação desejado.

Use-o para investigar recuperação fraca, citações ausentes, trechos irrelevantes, buscas muito amplas, documentos de baixa qualidade ou casos em que um gateway deveria usar uma coleção mas não usa. Um assistente de manutenção de RAG pode sugerir melhor formulação de consultas, mudanças de chunking, organização de coleções, ajustes de reranker, ajustes de `top` e `minScore`, ou quando expor uma coleção via [collection MCP](http://localhost:1313/pt-br/docs/mcp-utilities/collections-mcp.md).

O melhor fluxo de trabalho é iterativo: inspecionar uma resposta falha, identificar qual contexto deveria ter sido recuperado, testar ou revisar o caminho de recuperação, atualizar documentos ou configurações do gateway e então re‑verificar o mesmo padrão de conversa.

## Orientação de segurança

Trate este servidor MCP como uma integração administrativa. Uma chave privada conectada a ele pode ler ou mutar recursos da conta dependendo das rotas que o agente invoca.

Use uma chave de API dedicada para cada cliente ou automação MCP. Rotule‑a claramente, defina uma expiração quando possível e rotacione‑a se o cliente for compartilhado, comprometido ou não mais necessário. Armazene a chave no mecanismo de segredos do cliente MCP ou em um repositório de configuração local, nunca no controle de versão.

Não conecte o gerenciamento de conta MCP a agentes não confiáveis, clientes de chat públicos ou sessões de navegador controladas pelo usuário. Se um fluxo de trabalho só precisa de recuperação de uma coleção RAG, use o [collection MCP](http://localhost:1313/pt-br/docs/mcp-utilities/collections-mcp.md) com configuração somente leitura. Se um gateway precisar chamar suas ferramentas externas durante a inferência, configure [MCP functions](http://localhost:1313/pt-br/docs/tools/mcp.md) ou [server‑side functions](http://localhost:1313/pt-br/docs/tools/protocol-functions.md) em vez disso.
