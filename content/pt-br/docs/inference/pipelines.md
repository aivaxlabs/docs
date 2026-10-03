---
{title: Pipelines de IA,linkTitle: Pipeline de processamento,weight: 200,group: Inferência,sourceHash: legacy-unverified,aliases: [/docs/pt-br/inference/pipelines.html]}
---

# Pipelines de IA

Os pipelines do AI Gateway são as etapas de processamento que o AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar entrada, rotear modelos, truncar conversas e chamar trabalhadores externos.

A maioria dos pipelines é configurada nos parâmetros do gateway. Opções ao nível da requisição podem sobrescrever alguns parâmetros de inferência em chamadas diretas de `chat/completions`.

## RAG

RAG vincula [coleções](/docs/pt-br/rag/collections) a um AI Gateway. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reranker.
- Se referências de fragmentos são incluídas.
- Estratégia de consulta.

Quando um gateway tem coleções de conhecimento e a última mensagem do usuário contém texto, o AIVAX pode recuperar documentos correspondentes antes da chamada ao modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário. Se uma coleção vinculada tem seu próprio texto de contexto, esse contexto de coleção é adicionado às instruções do sistema.

Estratégias de consulta:

- `Plain`: Usa a última mensagem do usuário como consulta de pesquisa.
- `Concatenate`: Junta o número configurado mais recente de mensagens do usuário linha a linha e pesquisa com o texto combinado.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando pesquisar as coleções vinculadas, e os resultados da pesquisa são retornados como respostas de ferramenta.

Estratégias de reescrita adicionam custo de modelo resolvedor (veja [Pricing](/docs/pt-br/pricing)) e latência. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como "e sobre este caso?", pois o resolvedor pode transformar a conversa recente em uma consulta de pesquisa mais clara.

Definir muitos resultados de RAG aumenta o uso de tokens de entrada e pode aumentar o custo final da inferência (veja [Pricing](/docs/pt-br/pricing)). Comece com uma contagem pequena de resultados e aumente apenas quando o modelo não tiver evidência suficiente.

## Instruções

As configurações de instrução moldam o prompt voltado ao provedor:

- **Instruções do sistema**: Adicionadas ao conjunto de instruções do sistema.
- **Fontes remotas de instruções do sistema**: Obtidas de URLs configuradas e adicionadas ao conjunto de instruções do sistema.
- **Modelo de prompt do usuário**: Substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá‑la ao modelo.
- **Pré‑preenchimento do assistente**: Adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta pré‑preenchimento.

Fontes remotas de instrução são obtidas como texto com tamanho máximo de resposta de 10 MB. Sua duração de cache é configurável; o padrão é 600 segundos.

Alguns modelos não suportam pré‑preenchimento do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação integrada de modelo rejeita configurações de gateway incompatíveis quando essas limitações são conhecidas.

## Habilidades

Habilidades são pacotes de instruções sob demanda disponíveis para o modelo. Quando um gateway habilita habilidades, o AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções internas relacionadas a habilidades.

Leia mais sobre [habilidades](/docs/pt-br/features/skills).

## Pré‑processamento multimodal

O pré‑processamento multimodal converte conteúdo de mídia selecionado em texto antes da chamada ao modelo principal. As bandeiras disponíveis são `Image`, `Audio`, `Video`, `File`, `OtherFiles` e `All`.

Use pré‑processamento quando o modelo principal for texto‑primeiro ou quando quiser que o AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré‑processamento para que o modelo possa inspecioná‑la diretamente.

As descrições de mídia são armazenadas em cache por hash de conteúdo para reutilização.

## Parametrização

O pipeline de parametrização configura opções de requisição ao modelo, tais como:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Valores ao nível da requisição podem sobrescrever valores do gateway quando o endpoint suporta o parâmetro. Alguns modelos integrados rejeitam parâmetros específicos, e provedores BYOK podem ter suas próprias restrições.

## Truncamento de contexto

O pipeline de truncamento de contexto usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` está definido e a conversa excede o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro em vez de chamar o modelo.
- `Truncate`: Remove mensagens não‑sistêmicas mais antigas até que a conversa caiba.

O truncamento preserva mensagens do sistema e mantém pelo menos uma mensagem do usuário quando possível. Se a mensagem do usuário restante ainda exceder o limite, a requisição falha com um erro de tamanho de mensagem.

Em planos inferiores, o contexto de entrada efetivo pode ser limitado mesmo quando um contexto maior está configurado; veja [Plans and limits](/docs/pt-br/limits#plan-limits).

## Truncamento de mensagem de ferramenta

`ToolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido para um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isso pode reduzir o uso de contexto em conversas longas de agentes. Também pode prejudicar cadeias onde um resultado antigo de ferramenta continua importante, portanto use apenas quando o modelo puder chamar a ferramenta novamente com segurança.

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pelo AIVAX durante a inferência. Elas podem vir de:

- Ferramentas internas.
- Funções de protocolo.
- Fontes remotas de funções de protocolo.
- Fontes MCP.
- QueryFunction RAG.
- Habilidades.
- Ambiente bash opcional.

Eventos de ferramenta do lado do servidor podem ser transmitidos aos clientes como atualizações `servertool`.

## Ferramentas internas

Ferramentas internas podem ser configuradas em um gateway ou fornecidas por requisição com `builtin_tools`. As bandeiras de ferramenta interna disponíveis incluem:

- `DateTime` — data e hora atuais através de `get_date_time`; configure `dateTimeTimeZone` nas opções da ferramenta interna (padrão: `America/Los_Angeles`, horário do Pacífico).

- `WebSearch`
- `AdvancedWebUsage` (desativado; retorna uma resposta indisponível. Veja [Changelogs](../changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Calendar`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Built-in tools](/docs/pt-br/tools/builtin-tools).

## MCP e funções de protocolo

Ferramentas listadas por uma fonte MCP ficam disponíveis ao modelo com seus esquemas declarados. Resultados de ferramenta MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportado.

Funções de protocolo expõem callbacks HTTP ou URLs de callback do AIVAX como ferramentas chamáveis pelo modelo. Fontes remotas de funções de protocolo são obtidas e armazenadas em cache antes que suas ferramentas fiquem disponíveis ao modelo.

Veja [Protocol functions](/docs/pt-br/tools/protocol-functions) e [MCP](/docs/pt-br/tools/mcp).

## Interpretador de funções

Um manipulador de ferramenta pode adicionar comportamento de chamada de ferramenta para modelos que não produzem chamadas nativas de forma confiável. Valores suportados são:

- `native` ou `null`: Usa chamada nativa de ferramenta do modelo.
- `react.v1.selfcall`: Usa o manipulador de auto‑chamada estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falha no tempo de inferência.

## Moderação

A moderação é um filtro de entrada que roda antes do modelo principal. Quando ao menos uma categoria de moderação está habilitada, o AIVAX envia a conversa textual disponível a um modelo de salvaguarda. O modelo de salvaguarda avalia a última solicitação do usuário no contexto estabelecido pela conversa e devolve uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do gateway | O que o salvaguarda avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo a dano físico. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Temas políticos** | `politicalThreshold` | Persuasão política, campanha, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, automutilação ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de sobrescrever instruções, revelar instruções protegidas, exfiltrar dados ou injetar prompts. |

### Entendendo níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade**, não a pontuação da salvaguarda em si. Um nível mais alto reduz a pontuação necessária para bloquear a entrada.

| Nível de sensibilidade | Pontuações de salvaguarda que bloqueiam |
| ---: | --- |
| `0` | Categoria desativada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o corte de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de salvaguarda de `0` nunca bloqueia. Configure cada categoria independentemente; a requisição é bloqueada quando qualquer categoria habilitada atinge seu corte.

### Adicionar regras específicas do gateway

**Regras de moderação adicionais** permitem que um administrador de gateway descreva políticas que não são totalmente expressas pelas descrições de categoria internas. A salvaguarda lê essas regras junto com a política interna e as usa para calibrar todas as cinco pontuações.

Por exemplo:

```text
Allow users to describe accidents and injuries when asking for insurance coverage or assistance.
Treat requests for instructions to cause an accident or harm someone as dangerous content.
```

Regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam diretamente uma entrada. Pelo menos uma categoria deve ter um nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação da salvaguarda possa gerar uma decisão de bloqueio.

Escreva regras como declarações de política curtas com casos explicitamente permitidos e proibidos. Não inclua segredos, credenciais ou dados operacionais privados, pois as regras são armazenadas com a configuração do gateway e enviadas ao modelo de salvaguarda durante a moderação.

O fragmento de gateway a seguir habilita diferentes níveis de sensibilidade e fornece orientações específicas ao domínio para a salvaguarda. Os valores são um exemplo, não uma baseline recomendada para produção:

```json
{
  "moderationParameters": {
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Permitir descrições de acidentes e lesões para suporte de seguro. Tratar instruções para causar acidentes ou machucar alguém como conteúdo perigoso."
  }
}
```

### O que acontece quando uma entrada é bloqueada

Quando qualquer categoria habilitada atinge seu corte:

1. O AIVAX marca as mensagens originais da conversa como indisponíveis para a requisição de inferência principal.
2. O AIVAX as substitui por uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa em vez de responder à requisição original.

A recusa é gerada pelo modelo; a moderação não devolve um corpo de resposta fixo. Se a salvaguarda não puder produzir um resultado de moderação válido, a requisição falha antes que a conclusão normal seja gerada.

### Contexto e limitações atuais

A salvaguarda recebe o histórico de conversa disponível, não apenas a última mensagem. Papéis e textos das mensagens são preservados como dados de conversa serializados não confiáveis, de modo que instruções dentro da conversa não podem substituir a política da salvaguarda. Se a conversa exceder a janela de contexto da salvaguarda, o contexto mais antigo pode ser truncado.

A moderação atualmente se aplica apenas ao texto de entrada:

- Saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdo de arquivos não são analisados. A salvaguarda recebe apenas um marcador indicando que mídia estava presente.
- Autorização de ferramenta ou trabalhador ainda requer política ao nível da aplicação; a moderação não é um mecanismo de autorização.
- A moderação adiciona uma inferência de salvaguarda antes da inferência principal, o que acrescenta latência e uso de moderação cobrável.

Use a moderação para políticas de segurança amplas. Use trabalhadores quando a decisão depender de identidade externa, estado da conta ou política específica de negócio.

## Trabalhadores

Configure eventos de trabalhador e detalhes de endpoint nos parâmetros do gateway; implemente o comportamento do evento em seu endpoint externo. Veja [AI Workers](/docs/pt-br/inference/workers).
