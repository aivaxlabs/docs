---
{title: Habilidades,linkTitle: Habilidades,weight: 80,group: Inference,aliases: [/docs/pt-br/platform/skills.html,/docs/pt-br/features/skills.html,/docs/pt-br/inference/skills.html],sourceHash: 3810519b9e4f29a9}
---

# Habilidades

As habilidades (também conhecidas como capacidades) são instruções que seu agente carrega sob demanda para realizar tarefas específicas com mais eficiência. Utilize-as para comportamentos especializados que apenas algumas conversas exigem, em vez de manter todas as regras nas instruções do sistema.

O agente carrega uma habilidade apenas quando ela é relevante para a tarefa atual. Ele faz isso por meio da ferramenta `read_skill`, que adiciona as instruções da habilidade ao contexto da conversa.

## Como funcionam as habilidades?

Cada habilidade é identificada por um slug e uma breve descrição do que ela faz e quando deve ser usada. Sua conta pode ter muitas habilidades, e cada [AI Gateway](/docs/pt-br/inference/ai-gateway) habilita apenas o subconjunto que precisa.

No momento da inferência, o fluxo é:

1. O AIVAX lista o slug e a descrição de cada habilidade habilitada no gateway nas instruções do sistema do modelo e adiciona a função `read_skill` ao contexto. As instruções completas não são incluídas neste momento.
2. Quando uma tarefa corresponde a uma habilidade, o modelo chama `read_skill` com um array de slugs de habilidades.
3. A chamada retorna as instruções das habilidades correspondentes, cada uma envolvida nas tags `<skill:slug>` e `</skill:slug>`, onde `slug` é o próprio slug da habilidade.

O modelo pode ativar mais de uma habilidade quando uma tarefa abrange múltiplos domínios. Quando a tarefa ativa muda, ele pode chamar `read_skill` novamente com uma lista diferente.

Para que isso funcione, o modelo base escolhido deve suportar **chamadas de função** e **instruções do sistema**.

- Se o seu modelo não suportar chamadas de função, considere usar um [manipulador de ferramentas](/docs/pt-br/inference/pipelines#function-interpreter) para lidar com as chamadas de função.
- Se o seu modelo não suportar instruções do sistema, considere usar o sinalizador `No system instructions`, que fornece as instruções do sistema como uma mensagem do usuário.

Modelos maiores tendem a seguir instruções e chamadas de função de forma muito estrita. Execute testes para confirmar que seu modelo carrega as habilidades corretas e as alterna quando a tarefa muda.

## Estrutura e operação

Uma habilidade possui `slug`, `description`, `instructions` e `options`:

- `slug`: O identificador técnico usado pela conta. Deve ter 64 caracteres ou menos, usando letras, números, underscores, pontos ou hífens.
- `description`: O texto que ajuda o modelo a decidir quando carregar a habilidade. Explique o cenário de uso em vez de repetir o nome.
- `instructions`: O conteúdo completo inserido quando a habilidade é ativada.

`instructionSources` é armazenado e exportado com a configuração da habilidade, mas apenas o campo inline `instructions` é injetado quando o modelo ativa uma habilidade.

Escreva a descrição como uma regra de roteamento. Uma descrição como “habilidade jurídica” é fraca porque não diz quando usá-la. Uma descrição melhor seria “use quando o usuário pedir análise, revisão ou explicação de cláusulas contratuais em linguagem simples.”

As instruções, por outro lado, devem ser operacionais: explique como responder, quais perguntas fazer quando os dados estiverem faltando, quais ferramentas podem ser úteis, quais limites devem ser respeitados e o formato final esperado. O modelo lê a descrição para escolher a habilidade e lê as instruções para executar a tarefa.

`allowedToolsNames` faz parte da configuração da habilidade e associa nomes de ferramentas em tempo de execução a uma habilidade, como `web_search`, `open_url`, `generate_image` ou `generate_web_page`. Quando o gateway oculta ferramentas sem uma habilidade, essas ferramentas ficam disponíveis após o modelo ativar a habilidade com `read_skill`.

Apenas as habilidades da chamada `read_skill` bem-sucedida mais recente estão ativas; uma chamada bloqueada por um trabalhador do gateway ou rejeitada como inválida não as expõe. Use a lista geral de ferramentas sempre visível para ferramentas que devem permanecer disponíveis independentemente da habilidade ativa.

### Importar e exportar habilidades

As habilidades podem ser importadas e exportadas em JSONL. Este formato é útil para versionamento de habilidades, migração de configurações entre contas, manutenção de um conjunto de habilidades em um repositório ou revisão de alterações antes da publicação. Cada linha deve representar uma habilidade com pelo menos `slug` e `instructions`; `description` e `options` podem complementar a configuração. Ao importar uma habilidade com um `slug` existente, o AIVAX atualiza a habilidade correspondente em vez de criar um duplicado.

## Como escrever habilidades?

Habilidades eficazes têm uma descrição de roteamento clara e instruções específicas. Use as diretrizes a seguir.

### Estrutura da habilidade

Uma habilidade bem escrita deve conter:

1. **Slug claro e descritivo**: Use um slug curto que identifique imediatamente o propósito da habilidade, como `python_code_analysis`, `customer_support` ou `technical_translation`.

2. **Descrição concisa**: Forneça uma breve descrição (1–2 frases) que explique quando a habilidade deve ser ativada. Esta descrição é crucial porque o modelo a usa para decidir se carrega a habilidade.

3. **Instruções detalhadas**: As instruções reais devem incluir:
   - Objetivos claros da tarefa
   - Formato de resposta esperado
   - Regras específicas a seguir
   - Exemplos, quando apropriado
   - Restrições ou limitações importantes

### Melhores práticas

- **Seja específico**: Evite instruções vagas. Em vez de “seja útil”, diga “forneça explicações passo a passo com exemplos de código”.
- **Use linguagem imperativa**: Comece frases com verbos de ação (analyze, explain, compare, list).
- **Mantenha o escopo limitado**: Cada habilidade deve focar em uma área de conhecimento específica ou tipo de tarefa.
- **Teste iterativamente**: Refine suas habilidades com base na resposta do modelo na prática.
- **Evite redundância**: Não repita informações já presentes nas instruções do sistema base.

### Exemplo de habilidade

- Nome: Análise de Desempenho de Código
- Descrição: Use quando o usuário pedir análise de desempenho, otimização ou identificação de gargalos em código.
- Instruções:

```markdown
- Analise o código fornecido identificando possíveis gargalos de desempenho
- Considere a complexidade temporal (Big O) e o uso de memória
- Sugira otimizações específicas com exemplos de código
- Explique o impacto de cada otimização proposta
- Priorize legibilidade e manutenibilidade junto com o desempenho
```

## Quando usar habilidades?

As habilidades são mais úteis quando o agente precisa de comportamento especializado apenas em algumas conversas.

### Cenários ideais

**1. Especialização específica de domínio**
- Terminologia técnica específica de uma indústria
- Conformidade com regulamentações ou padrões
- Metodologias específicas (Scrum, ITIL, SOC 2, etc.)

**2. Mudança de tom ou estilo**
- Serviço formal vs. casual
- Comunicação técnica vs. simplificada
- Diferentes personas ou papéis

**3. Processos complexos e estruturados**
- Fluxos de trabalho em várias etapas
- Análises que seguem estruturas específicas
- Geração de documentos com formatos rigorosos

**4. Tarefas que exigem contexto extensivo**
- Quando as instruções são longas demais para serem incluídas toda vez
- Conhecimento que é relevante apenas ocasionalmente
- Múltiplos conjuntos de regras mutuamente exclusivos

### Quando NÃO usar habilidades

- **Instruções permanentes**: Se as instruções devem estar sempre ativas, coloque-as nas instruções do sistema base.
- **Tarefas simples**: Para respostas diretas que não requerem contexto especial.
- **Conhecimento geral**: Informações que o modelo já conhece bem não precisam ser reforçadas por meio de habilidades.
- **Poucas ou muitas habilidades**: Busque ter entre 3 e 10 habilidades. Menos que isso, considere usar instruções base. Mais que isso pode confundir o modelo.

### Comparação: Habilidades vs. Instruções do Sistema

| Aspecto | Habilidades | Instruções do Sistema |
|--------|-------------|-----------------------|
| Quando aplicar | Sob demanda, quando relevante | Sempre ativas |
| Tamanho ideal | Pode ser extenso | Deve ser conciso |
| Troca de contexto | Sim, pode alternar | Não, fixo |
| Uso de tokens | Econômico (apenas quando necessário) | Constante |
| Melhor para | Conhecimento especializado | Comportamento base do agente |

### Dicas de implementação

- **Comece pequeno**: Implemente inicialmente 2–3 habilidades e expanda conforme necessário.
- **Monitore o uso**: Verifique se o modelo está ativando as habilidades corretamente.
- **Evite sobreposição**: Habilidades com descrições semelhantes podem confundir o modelo.
- **Teste transições**: Certifique-se de que o modelo troca de habilidades quando apropriado.

## Combine habilidades com RAG e pipelines

Use habilidades junto com [coleções](/docs/pt-br/rag/collections) quando a tarefa precisar de conhecimento pesquisável, e com [pipelines](/docs/pt-br/inference/pipelines) quando precisar de política em tempo de evento ou reescrita de mensagens. Para um contexto mais amplo, consulte o [Prompt Engineering Guide](https://www.promptingguide.ai/), [Building effective agents](https://www.anthropic.com/index/building-effective-agents) e a [Documentação do AI Gateway](/docs/pt-br/inference/ai-gateway).
