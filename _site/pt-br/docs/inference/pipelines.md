Source: https://docs.aivax.net/pt-br/docs/inference/pipelines.html

# Pipelines de IA

Os pipelines do AI Gateway são as etapas de processamento que a AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar entrada, rotear modelos, truncar conversas e chamar trabalhadores externos.

Maioria dos pipelines são configurados nos parâmetros do gateway. Opções ao nível de requisição podem sobrescrever alguns parâmetros de inferência em chamadas diretas `chat/completions`.

## RAG

RAG vincula [coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md) a um AI Gateway. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reranker.
- Se referências de blocos são incluídas.
- Estratégia de consulta.

Quando um gateway possui coleções de conhecimento e a última mensagem do usuário contém texto, a AIVAX pode recuperar documentos correspondentes antes da chamada ao modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário. Se uma coleção vinculada tem seu próprio texto de contexto, esse contexto da coleção é adicionado às instruções do sistema.

Estratégias de consulta:

- `Plain`: Usa a última mensagem do usuário como consulta de pesquisa.
- `Concatenate`: Junta o número configurado mais recente de mensagens do usuário linha a linha e pesquisa com o texto combinado.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando pesquisar nas coleções vinculadas, e os resultados da pesquisa são retornados como respostas de ferramenta. O modelo pode restringir uma pesquisa com um [filtro de documento](https://docs.aivax.net/pt-br/docs/filters/document-filters.md) opcional.

Estratégias de reescrita adicionam custo de modelo resolvedor (veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md)) e latência. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como “e sobre este caso?”, pois o resolvedor pode transformar a conversa recente em uma consulta de pesquisa mais clara.

Definir muitos resultados RAG aumenta o uso de tokens de entrada e pode elevar o custo final de inferência (veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md)). Comece com uma contagem pequena de resultados e aumente apenas quando o modelo não tem evidência suficiente.

## Instruções

As configurações de instrução moldam o prompt voltado ao provedor:

- **Instruções do sistema**: adicionadas ao conjunto de instruções do sistema.
- **Fontes remotas de instruções do sistema**: buscadas a partir de URLs configuradas e adicionadas ao conjunto de instruções do sistema.
- **Modelo de prompt do usuário**: substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá-lo ao modelo.
- **Pré-preenchimento do assistente**: adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta pré-preenchimento.

Fontes remotas de instruções são buscadas como texto com tamanho máximo de resposta de 10 MB. Sua duração de cache é configurável; o padrão é 600 segundos.

Alguns modelos não suportam pré‑préenchimento do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação de modelo integrado rejeita configurações de gateway incompatíveis quando essas limitações são conhecidas.

## Habilidades

Habilidades são pacotes de instrução sob demanda disponíveis para o modelo. Quando um gateway habilita habilidades, a AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções internas relacionadas à habilidade.

Saiba mais sobre [habilidades](https://docs.aivax.net/pt-br/docs/features/skills.md).

## Pré-processamento multimodal

O pré-processamento multimodal converte conteúdo de mídia selecionado em texto antes da chamada ao modelo principal. Cada tipo de conteúdo (imagens, áudio, vídeo e arquivos) usa seu próprio mecanismo: um modelo multimodal menor (`InferenceLow`) ou maior (`InferenceHigh`), OCR para imagens e arquivos, ou conversão de fala para texto para áudio. Veja [Pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/inference.md#multimodal-pre-processing) para os mecanismos aceitos.

A configuração do gateway `multimodalResolverParameters` substitui as flags depreciadas `enabledMultimodalFeatures`. Gateways que ainda usam as flags continuam funcionando com os mecanismos equivalentes até que `multimodalResolverParameters` seja definido.

Use pré-processamento quando o modelo principal for texto‑primeiro ou quando você quiser que a AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré-processamento para que o modelo possa inspecioná‑la diretamente.

Os resultados da inferência são armazenados em cache por conteúdo e mecanismo para reutilização. OCR e conversão de fala para texto são cobrados a cada uso.

## Parametrização

O pipeline de parametrização configura opções de requisição do modelo, como:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Valores ao nível de requisição podem sobrescrever valores do gateway quando o endpoint suporta o parâmetro. Alguns modelos integrados rejeitam parâmetros específicos, e provedores BYOK podem ter suas próprias restrições.

## Truncamento de contexto

O pipeline de truncamento de contexto usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` está definido e a conversa excede o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro ao invés de chamar o modelo.
- `Truncate`: Remove mensagens não‑sistêmicas mais antigas até que a conversa caiba.

O truncamento preserva mensagens do sistema e mantém ao menos uma mensagem do usuário quando possível. Se a mensagem do usuário restante ainda exceder o limite, a requisição falha com um erro de tamanho de mensagem.

Em planos inferiores, o contexto de entrada efetivo pode ser limitado mesmo quando um contexto maior está configurado; veja [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#plan-limits).

## Truncamento de mensagens de ferramenta

`ToolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido para um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isto pode reduzir o uso de contexto em conversas agenticas longas. Também pode prejudicar cadeias onde um resultado de ferramenta antigo permanece importante, portanto use apenas quando o modelo puder chamar a ferramenta novamente com segurança.

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pela AIVAX durante a inferência. Elas podem provir de:

- Ferramentas internas.
- Funções de protocolo.
- Fontes remotas de funções de protocolo.
- Fontes MCP.
- QueryFunction RAG.
- Habilidades.
- Ambiente bash opcional.

Eventos de ferramentas do lado do servidor podem ser transmitidos para clientes como atualizações `servertool`.

## Ferramentas internas

Ferramentas internas podem ser configuradas em um gateway ou fornecidas por requisição com `builtin_tools`. Flags de ferramentas internas disponíveis incluem:

- `DateTime` — data e hora atuais através de `get_date_time`; configure `dateTimeTimeZone` nas opções de ferramenta interna (padrão: `America/Los_Angeles`, Horário do Pacífico).  
- `WebSearch`
- `AdvancedWebUsage` (desabilitado; retorna uma resposta indisponível. Veja [Changelogs](https://docs.aivax.net/pt-br/docs/changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Calendar`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Ferramentas internas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

## MCP e funções de protocolo

Ferramentas listadas por uma fonte MCP tornam‑se disponíveis ao modelo com seus esquemas declarados. Resultados de ferramentas MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportado.

Funções de protocolo expõem callbacks HTTP ou URLs de callback da AIVAX como ferramentas chamáveis pelo modelo. Fontes remotas de funções de protocolo são buscadas e armazenadas em cache antes que suas ferramentas se tornem disponíveis ao modelo.

Veja [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) e [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

## Interpretador de funções

Um manipulador de ferramenta pode adicionar comportamento de chamada de ferramenta para modelos que não produzem chamadas de ferramenta nativas de forma confiável. Valores suportados são:

- `native` ou `null`: Usa chamada de ferramenta nativa do modelo.
- `react.v1.selfcall`: Usa o manipulador de auto‑chamada ao estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falha no momento da inferência.

## Moderação

A moderação é um filtro de entrada que roda antes do modelo principal. Quando ao menos uma categoria de moderação está habilitada, a AIVAX envia a conversa textual disponível para um modelo de proteção. O modelo de proteção avalia a última solicitação do usuário no contexto estabelecido pela conversa e retorna uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do gateway | O que o modelo de proteção avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo a danos físicos. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Tópicos políticos** | `politicalThreshold` | Persuasão política, campanha, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, autoagressão ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de sobrescrever instruções, revelar instruções protegidas, extrair dados ou injetar prompts. |

### Entender níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade**, não a pontuação do modelo de proteção em si. Um nível maior diminui a pontuação necessária para bloquear a entrada.

| Nível de sensibilidade | Pontuações do modelo de proteção que bloqueiam |
| ---: | --- |
| `0` | Categoria desativada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o limite de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de `0` nunca bloqueia. Configure cada categoria de forma independente; a requisição é bloqueada quando qualquer categoria habilitada atinge seu limite.

### Adicionar regras específicas do gateway

**Regras adicionais de moderação** permitem que um administrador de gateway descreva políticas que não são totalmente expressas pelas descrições das categorias internas. O modelo de proteção lê essas regras juntamente com a política interna e as usa para calibrar as cinco pontuações.

Por exemplo:

```text
Permitir que os usuários descrevam acidentes e lesões ao solicitar cobertura ou assistência de seguro.
Tratar solicitações de instruções para causar um acidente ou ferir alguém como conteúdo perigoso.
```

Regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam uma entrada diretamente. Pelo menos uma categoria deve ter um nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação do modelo de proteção possa gerar uma decisão de bloqueio.

Escreva regras como declarações curtas de política com casos explícitos permitidos e proibidos. Não inclua segredos, credenciais ou dados operacionais privados porque as regras são armazenadas com a configuração do gateway e enviadas ao modelo de proteção durante a moderação.

O fragmento de gateway a seguir habilita diferentes níveis de sensibilidade e fornece orientações específicas de domínio ao modelo de proteção. Os valores são um exemplo, não um baseline recomendado para produção:

```json
{
  "moderationParameters": {
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Allow descriptions of accidents and injuries for insurance support. Treat instructions to cause accidents or harm someone as dangerous content."
  }
}
```

### O que acontece quando uma entrada é bloqueada

Quando qualquer categoria habilitada atinge seu limite:

1. AIVAX marca as mensagens originais da conversa como indisponíveis para a requisição de inferência principal.
2. AIVAX as substitui por uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa ao invés de responder à requisição original.

A recusa é gerada pelo modelo; a moderação não retorna um corpo de resposta fixo. Se todos os modelos de moderação falharem em produzir um resultado válido, a requisição não é rejeitada. O modelo principal recebe, em vez disso, instruções rígidas derivadas das categorias configuradas, níveis de sensibilidade e regras adicionais, e aplica a política por conta própria. Se sua aplicação precisar falhar fechada quando a moderação estiver indisponível, imponha isso na sua aplicação ou em um trabalhador.

### Contexto e limitações atuais

O modelo de proteção recebe o histórico de conversa disponível, não apenas a mensagem mais recente. Papéis e textos das mensagens são preservados como dados de conversa serializados não confiáveis para reduzir a chance de que instruções dentro da conversa sobrescrevam a política de proteção. Se a conversa exceder a janela de contexto do modelo de proteção, o contexto mais antigo pode ser truncado.

A moderação atualmente se aplica apenas ao texto de entrada:

- Saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdos de arquivos não são analisados. O modelo de proteção recebe apenas um marcador indicando que havia mídia presente.
- Autorização de ferramenta ou trabalhador ainda requer política ao nível da aplicação; a moderação não é um mecanismo de autorização.
- A moderação adiciona uma inferência de proteção antes da inferência principal, o que acrescenta latência e uso de moderação faturável.

Use a moderação para políticas de segurança amplas. Use trabalhadores quando a decisão depende de identidade externa, estado da conta ou política específica de negócio.

Para um guia de decisão sobre prompts de sistema, uma etapa de moderação separada e autorização, veja [Moderação de entrada LLM: prompt de sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/).

## Trabalhadores

Configure eventos de trabalhador e detalhes do endpoint nos parâmetros do gateway; implemente o comportamento do evento no seu endpoint externo. Veja [AI Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md).
