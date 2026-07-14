# Habilidades

Habilidades (também conhecidas como competências) podem ser usadas para melhorar como seu agente executa tarefas específicas. Habilidades são instruções especiais que são recuperadas sob demanda, e seu agente carrega essas habilidades conforme necessário.

Idealmente, seu agente deve usar uma habilidade apenas quando ela for relevante para a tarefa que está executando. Ela é incorporada à conversa por meio de uma ferramenta especial, e as instruções da habilidade são adicionadas ao contexto, indicando que o agente tem contexto fornecido no contexto que pode ser usado na conversa.

## Como as habilidades funcionam?

Habilidades são fornecidas principalmente por meio de um slug e uma breve descrição do que a habilidade é e quando deve ser usada. Você pode ter várias habilidades em sua conta, mas usar apenas um subconjunto delas em seu [AI Gateway](/docs/pt-br/inference/ai-gateway). As habilidades habilitadas no AI Gateway são listadas nas instruções do sistema do modelo e a função `read_skill` é adicionada ao contexto.

Quando o modelo chama `read_skill`, ele passa um array de slugs de habilidades. As instruções das habilidades correspondentes são inseridas nas instruções do sistema da próxima rodada de contexto dentro de blocos `<activated_skill>`. Mais de uma habilidade pode ser ativada quando uma tarefa abrange múltiplos domínios, e o modelo pode chamar `read_skill` novamente com uma lista diferente quando a tarefa ativa mudar.

Para que isso funcione, o modelo base escolhido deve suportar **chamadas de função** e **instruções do sistema**.

- Se o seu modelo não suportar chamadas de função, considere usar um [manipulador de ferramentas](/docs/pt-br/inference/pipelines) para lidar com chamadas de função.
- Se o seu modelo não suportar instruções do sistema, considere usar a flag `No system instructions`, que fornece instruções do sistema como uma mensagem de usuário.

Modelos maiores tendem a seguir as instruções e chamadas de função de forma muito rígida. Execute testes para ver se seu modelo está alterando suas habilidades conforme necessário.

## Estrutura e operação

Uma habilidade tem `slug`, `description`, `instructions` e `options`. O `slug` é o identificador técnico usado pela conta e deve ter 64 caracteres ou menos, usando letras, números, sublinhados, pontos ou hífens. A `description` é o texto que ajuda o modelo a decidir quando essa habilidade deve ser carregada; ela precisa explicar o cenário de uso em vez de repetir o nome. As `instructions` são o conteúdo completo que será inserido quando a habilidade for ativada. No caminho de tempo de execução atual, `instructionSources` é armazenado e exportado com a configuração da habilidade, mas apenas o campo `instructions` inline é injetado quando o modelo ativa uma habilidade.

Escreva a descrição como uma regra de roteamento. Uma descrição como “habilidade legal” é fraca porque não indica quando usar. Uma descrição melhor seria “use quando o usuário solicitar análise, revisão ou explicação de cláusulas contratuais em linguagem simples”. As instruções, por outro lado, devem ser operacionais: explicar como responder, quais perguntas fazer quando dados estão ausentes, quais ferramentas podem ser úteis, quais limites devem ser respeitados e o formato final esperado. O modelo lê a descrição para escolher a habilidade e lê as instruções para executar a tarefa.

`allowedToolsNames` faz parte da configuração da habilidade e tem a intenção de associar nomes de ferramentas em tempo de execução a uma habilidade, como `web_search`, `open_url`, `generate_image` ou `generate_web_page`. No caminho de tempo de execução atual, a lista geral de ferramentas sempre visível é a forma confiável de manter as ferramentas compartilhadas visíveis quando o gateway oculta ferramentas sem uma habilidade.

Habilidades também podem ser importadas e exportadas em JSONL. Esse formato é útil para versionar habilidades, migrar configurações entre contas, manter um conjunto de habilidades em um repositório ou revisar mudanças antes de publicar. Cada linha deve representar uma habilidade com pelo menos `slug` e `instructions`; `description` e `options` podem complementar a configuração. Ao importar uma habilidade com um `slug` existente, o AIVAX atualiza a habilidade correspondente em vez de criar um duplicado.

## Como escrever habilidades?

Escrever habilidades eficazes requer clareza e especificidade nas instruções. Aqui estão as principais diretrizes:

### Estrutura da habilidade

Uma habilidade bem escrita deve conter:

1. **Slug claro e descritivo**: Use um slug curto que identifique imediatamente o propósito da habilidade, como `python_code_analysis`, `customer_support` ou `technical_translation`.

2. **Descrição concisa**: Forneça uma descrição breve (1–2 frases) que explique quando a habilidade deve ser ativada. Essa descrição é crucial porque o modelo a usa para decidir se carrega a habilidade.

3. **Instruções detalhadas**: As instruções reais devem incluir:
   - Objetivos claros da tarefa
   - Formato de resposta esperado
   - Regras específicas a seguir
   - Exemplos quando apropriado
   - Restrições ou limitações importantes

### Melhores práticas

- **Seja específico**: Evite instruções vagas. Em vez de “ser útil”, diga “forneça explicações passo a passo com exemplos de código.”
- **Use linguagem imperativa**: Comece as frases com verbos de ação (analisar, explicar, comparar, listar).
- **Mantenha o escopo limitado**: Cada habilidade deve se concentrar em uma área de conhecimento específica ou tipo de tarefa.
- **Teste iterativamente**: Refine suas habilidades com base em como o modelo responde na prática.
- **Evite redundância**: Não repita informações já presentes nas instruções base do sistema.

### Exemplo de habilidade
- Nome: Análise de Desempenho de Código
- Descrição: Use quando o usuário solicitar análise de desempenho, otimização ou identificação de gargalos em código.

```markdown
- Analise o código fornecido identificando possíveis gargalos de desempenho
- Considere a complexidade temporal (Big O) e o uso de memória
- Sugira otimizações específicas com exemplos de código
- Explique o impacto de cada otimização proposta
- Priorize legibilidade e manutenção junto com desempenho
```

## Quando usar habilidades?

Habilidades são mais úteis em cenários específicos onde você precisa de comportamento especializado:

### Cenários ideais

**1. Expertise específica de domínio**
- Terminologia técnica específica de um setor
- Conformidade com regulamentos ou padrões
- Metodologias específicas (Scrum, ITIL, SOC 2, etc.)

**2. Mudança de tom ou estilo**
- Serviço formal vs. casual
- Comunicação técnica vs. simplificada
- Personas ou papéis diferentes

**3. Processos complexos e estruturados**
- Fluxos de trabalho multi‑etapa
- Análises que seguem frameworks específicos
- Geração de documentos com formatos rígidos

**4. Tarefas que requerem contexto extenso**
- Quando as instruções são muito longas para incluir a cada vez
- Conhecimento que é apenas ocasionalmente relevante
- Vários conjuntos de regras mutuamente exclusivos

### Quando NÃO usar habilidades

- **Instruções permanentes**: Se as instruções devem estar sempre ativas, coloque-as nas instruções base do sistema.
- **Tarefas simples**: Para respostas diretas que não requerem contexto especial.
- **Conhecimento geral**: Informações que o modelo já conhece bem não precisam ser reforçadas via habilidades.
- **Poucas ou muitas habilidades**: Mire em 3–10 habilidades. Menos que isso, considere usar instruções base. Mais que isso pode confundir o modelo.

### Comparação: Habilidades vs. Instruções do Sistema

| Aspecto | Habilidades | Instruções do Sistema |
|--------|--------|----------------------|
| Quando aplicar | Sob demanda, quando relevante | Sempre ativo |
| Tamanho ideal | Pode ser extenso | Deve ser conciso |
| Troca de contexto | Sim, pode alternar | Não, fixo |
| Uso de tokens | Econômo (somente quando necessário) | Constante |
| Melhor para | Conhecimento especializado | Comportamento base do agente |

### Dicas de implementação

- **Comece pequeno**: Implemente 2–3 habilidades inicialmente e expanda conforme necessário.
- **Monitore o uso**: Verifique se o modelo está ativando habilidades corretamente.
- **Evite sobreposição**: Habilidades com descrições semelhantes podem confundir o modelo.
- **Teste transições**: Garanta que o modelo troque de habilidades quando apropriado.

## Comparando Habilidades, RAG e Prompt de Sistema

Para entender melhor quando e como usar habilidades em comparação com outras técnicas como **RAG (Geração Aumentada por Recuperação)** e **Prompt de Sistema (Instruções do Sistema)**, use as orientações nesta página juntamente com a documentação de [collections](/docs/pt-br/rag/collections) e [pipelines](/docs/pt-br/inference/pipelines).

Veja também:
- [Guia de Engenharia de Prompt](https://www.promptingguide.ai/)
- [Construindo Aplicações RAG Prontas para Produção](https://www.anthropic.com/index/building-effective-agents)
- [Documentação do AI Gateway](/docs/pt-br/inference/ai-gateway)