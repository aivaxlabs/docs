Source: https://docs.aivax.net/pt-br/docs/features/skills.html

# Habilidades

Habilidades (também conhecidas como habilidades) podem ser usadas para melhorar como seu agente executa tarefas específicas. Habilidades são instruções especiais que são recuperadas sob demanda, e seu agente carrega essas habilidades conforme necessário.

Idealmente, seu agente deve usar uma habilidade somente quando ela for relevante para a tarefa que está sendo realizada. Ela é inserida na conversa por meio de uma ferramenta especial, e as instruções da habilidade são adicionadas ao contexto, indicando que o agente tem contexto fornecido que pode ser usado na conversa.

## Como as habilidades funcionam?

As habilidades são principalmente fornecidas por meio de um *slug* e uma breve descrição do que a habilidade faz e quando deve ser usada. Você pode ter várias habilidades em sua conta, mas usar apenas um subconjunto delas em seu [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md). As habilidades habilitadas no AI Gateway são listadas nas instruções de sistema do modelo e a função `read_skill` é adicionada ao contexto.

Quando o modelo chama `read_skill`, ele passa um array de slugs de habilidades. As instruções das habilidades correspondentes são inseridas nas instruções de sistema da próxima rodada de contexto dentro de blocos `<activated_skill>`. Mais de uma habilidade pode ser ativada quando uma tarefa abrange múltiplos domínios, e o modelo pode chamar `read_skill` novamente com uma lista diferente quando a tarefa ativa mudar.

Para que isso funcione, o modelo base escolhido deve suportar **chamadas de função** e **instruções de sistema**.

- Se o seu modelo não suportar chamadas de função, considere usar um [manipulador de ferramenta](https://docs.aivax.net/pt-br/docs/inference/pipelines.md) para lidar com chamadas de função.
- Se o seu modelo não suportar instruções de sistema, considere usar a flag `No system instructions`, que fornece instruções de sistema como uma mensagem de usuário.

Modelos maiores tendem a seguir instruções e chamadas de função de forma muito rigorosa. Execute testes para ver se seu modelo está alterando suas habilidades conforme necessário.

## Estrutura e operação

Uma habilidade possui `slug`, `description`, `instructions` e `options`. O `slug` é o identificador técnico usado pela conta e deve ter 64 caracteres ou menos, usando letras, números, sublinhados, pontos ou hífens. A `description` é o texto que ajuda o modelo a decidir quando essa habilidade deve ser carregada; ela precisa explicar o cenário de uso em vez de repetir o nome. As `instructions` são o conteúdo completo que será inserido quando a habilidade for ativada. No caminho de execução atual, `instructionSources` é armazenado e exportado com a configuração da habilidade, mas somente o campo `instructions` em linha é injetado quando o modelo ativa uma habilidade.

Escreva a descrição como uma regra de roteamento. Uma descrição como “habilidade legal” é fraca porque não diz quando usá‑la. Uma descrição melhor seria “use quando o usuário solicitar análise, revisão ou explicação de cláusulas contratuais em linguagem simples”. As instruções, por outro lado, devem ser operacionais: explicar como responder, quais perguntas fazer quando faltarem dados, quais ferramentas podem ser úteis, quais limites devem ser respeitados e o formato final esperado. O modelo lê a descrição para escolher a habilidade e lê as instruções para executar a tarefa.

`allowedToolsNames` faz parte da configuração da habilidade e tem a intenção de associar nomes de ferramentas em tempo de execução a uma habilidade, como `web_search`, `open_url`, `generate_image` ou `generate_web_page`. No caminho de execução atual, a lista geral de ferramentas sempre visível é a forma confiável de manter ferramentas compartilhadas visíveis quando o gateway oculta ferramentas sem uma habilidade.

Habilidades também podem ser importadas e exportadas em JSONL. Esse formato é útil para versionar habilidades, migrar configurações entre contas, manter um conjunto de habilidades em um repositório ou revisar alterações antes de publicar. Cada linha deve representar uma habilidade com pelo menos `slug` e `instructions`; `description` e `options` podem complementar a configuração. Ao importar uma habilidade com um `slug` já existente, o AIVAX atualiza a habilidade correspondente em vez de criar um duplicado.

## Como escrever habilidades?

Escrever habilidades eficazes requer clareza e especificidade nas instruções. Aqui estão as diretrizes principais:

### Estrutura da habilidade

Uma habilidade bem escrita deve conter:

1. **Slug claro e descritivo**: Use um slug curto que identifique imediatamente o propósito da habilidade, como `python_code_analysis`, `customer_support` ou `technical_translation`.
2. **Descrição concisa**: Forneça uma breve descrição (1–2 frases) que explique quando a habilidade deve ser ativada. Essa descrição é crucial porque o modelo a usa para decidir se carrega a habilidade.
3. **Instruções detalhadas**: As instruções reais devem incluir:
   - Objetivos claros da tarefa
   - Formato de resposta esperado
   - Regras específicas a seguir
   - Exemplos, quando apropriado
   - Restrições ou limitações importantes

### Boas práticas

- **Seja específico**: Evite instruções vagas. Em vez de “seja útil”, diga “forneça explicações passo a passo com exemplos de código”.
- **Use linguagem imperativa**: Comece as frases com verbos de ação (analisar, explicar, comparar, listar).
- **Mantenha o escopo limitado**: Cada habilidade deve focar em uma área de conhecimento ou tipo de tarefa específico.
- **Teste iterativamente**: Aperfeiçoe suas habilidades com base em como o modelo responde na prática.
- **Evite redundância**: Não repita informações já presentes nas instruções de sistema base.

### Exemplo de habilidade
- Nome: Análise de Desempenho de Código
- Descrição: Use quando o usuário solicitar análise de desempenho, otimização ou identificação de gargalos em código.

```markdown
- Analyze the provided code identifying possible performance bottlenecks
- Consider temporal complexity (Big O) and memory usage
- Suggest specific optimizations with code examples
- Explain the impact of each proposed optimization
- Prioritize readability and maintainability alongside performance
```

## Quando usar habilidades?

Habilidades são mais úteis em cenários específicos onde você precisa de comportamento especializado:

### Cenários ideais

**1. Expertise por domínio**  
- Terminologia técnica específica de um setor  
- Conformidade com regulamentos ou normas  
- Metodologias específicas (Scrum, ITIL, SOC 2, etc.)

**2. Mudança de tom ou estilo**  
- Serviço formal vs. casual  
- Comunicação técnica vs. simplificada  
- Personas ou papéis diferentes

**3. Processos complexos e estruturados**  
- Fluxos de trabalho de múltiplas etapas  
- Análises que seguem frameworks específicos  
- Geração de documentos com formatos rígidos

**4. Tarefas que exigem contexto extenso**  
- Quando as instruções são muito longas para ser incluídas a cada vez  
- Conhecimento que é apenas ocasionalmente relevante  
- Conjuntos de regras mutuamente exclusivos

### Quando NÃO usar habilidades

- **Instruções permanentes**: Se as instruções devem estar sempre ativas, coloque-as nas instruções de sistema base.
- **Tarefas simples**: Para respostas diretas que não exigem contexto especial.
- **Conhecimento geral**: Informações que o modelo já conhece bem não precisam ser reforçadas via habilidades.
- **Poucas ou muitas habilidades**: Busque 3–10 habilidades. Menos que isso, considere usar instruções base. Mais que isso pode confundir o modelo.

### Comparação: Habilidades vs. Instruções de Sistema

| Aspecto | Habilidades | Instruções de Sistema |
|---------|-------------|-----------------------|
| Quando aplicar | Sob demanda, quando relevante | Sempre ativo |
| Tamanho ideal | Pode ser extenso | Deve ser conciso |
| Troca de contexto | Sim, pode alternar | Não, fixo |
| Uso de tokens | Econômico (somente quando necessário) | Constante |
| Melhor para | Conhecimento especializado | Comportamento básico do agente |

### Dicas de implementação

- **Comece pequeno**: Implemente 2–3 habilidades inicialmente e expanda conforme necessário.
- **Monitore o uso**: Verifique se o modelo está ativando as habilidades corretamente.
- **Evite sobreposição**: Habilidades com descrições semelhantes podem confundir o modelo.
- **Teste transições**: Garanta que o modelo troque de habilidades quando apropriado.

## Quando escolher RAG ou instruções de sistema em vez disso

Use habilidades juntamente com [coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md) quando a tarefa precisar de conhecimento pesquisável, e com [pipelines](https://docs.aivax.net/pt-br/docs/inference/pipelines.md) quando precisar de política em tempo real ou reescrita de mensagens. Para um background mais amplo, veja o [Prompt Engineering Guide](https://www.promptingguide.ai/), [Building Production‑Ready RAG Applications](https://www.anthropic.com/index/building-effective-agents) e a [Documentação do AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md).
