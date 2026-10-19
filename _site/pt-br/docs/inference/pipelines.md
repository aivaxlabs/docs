Source: https://docs.aivax.net/pt-br/docs/inference/pipelines.html

# Pipeline de Processamento

Os pipelines do gateway de IA são as etapas de processamento que a AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar a entrada, rotear modelos, truncar conversas e chamar trabalhadores externos.

A maioria dos pipelines é configurada nos parâmetros do gateway. Opções ao nível de requisição podem sobrescrever alguns parâmetros de inferência em chamadas diretas `chat/completions`.

## RAG

RAG vincula [collections](https://docs.aivax.net/pt-br/docs/rag/collections.md) a um gateway de IA. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reranker.
- Se referências de fragmentos são incluídas.
- Estratégia de consulta.

Quando um gateway possui coleções de conhecimento e a mensagem mais recente do usuário contém texto, a AIVAX pode recuperar documentos correspondentes antes da chamada ao modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário. Se uma coleção vinculada tem seu próprio texto de contexto, esse contexto da coleção é adicionado às instruções de sistema.

Estratégias de consulta:

- `Plain`: Usa a mensagem mais recente do usuário como consulta de busca.
- `Concatenate`: Junta o número configurado mais recente de mensagens do usuário linha a linha e busca com o texto combinado.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente em uma ou mais consultas de busca usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando buscar nas coleções vinculadas, e os resultados da busca são retornados como respostas de ferramenta. O modelo pode restringir uma busca com um [filtro de documento](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) opcional.

Estratégias de reescrita adicionam custo de modelo resolvedor (veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md)) e latência. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como “e sobre este caso?”, pois o resolvedor pode transformar a conversa recente em uma consulta de busca mais clara.

Definir muitos resultados de RAG aumenta o uso de tokens de entrada e pode elevar o custo final da inferência (veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md)). Comece com um número pequeno de resultados e aumente apenas quando o modelo não tiver evidência suficiente.

## Instruções

As configurações de instruções moldam o prompt voltado ao provedor:

- **Instruções de sistema**: adicionadas ao conjunto de instruções de sistema.
- **Fontes remotas de instruções de sistema**: obtidas a partir de URLs configuradas e adicionadas ao conjunto de instruções de sistema.
- **Modelo de prompt do usuário**: substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá‑la ao modelo.
- **Pré‑preenchimento do assistente**: adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta pré‑preenchimento.

Fontes remotas de instruções são obtidas como texto, e cada resposta pode ter no máximo 5 MB. Se uma fonte não puder ser lida (resposta acima do limite, falha na requisição ou URL insegura), ela não contribui com texto e a própria requisição não falha. A duração do cache é configurável de 0 (sem cache) a 86 400 segundos; o padrão é 600 segundos.

Alguns modelos não suportam pré‑preenchimento do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação integrada de modelo rejeita configurações de gateway incompatíveis quando essas limitações são conhecidas.

## Habilidades

Habilidades são pacotes de instruções sob demanda disponíveis para o modelo. Quando um gateway habilita habilidades, a AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções internas relacionadas a habilidades.

Leia mais sobre [skills](https://docs.aivax.net/pt-br/docs/inference/skills.md).

## Pré‑processamento multimodal

O pré‑processamento multimodal converte conteúdo de mídia selecionado em texto antes da chamada ao modelo principal. Cada tipo de conteúdo (imagens, áudio, vídeo e arquivos) usa seu próprio motor: um modelo multimodal menor (`InferenceLow`) ou maior (`InferenceHigh`), OCR para imagens e arquivos, ou fala‑para‑texto para áudio. Consulte [Multimodal pre-processing](https://docs.aivax.net/pt-br/docs/inference/inference.md#multimodal-pre-processing) para os motores aceitos.

A configuração do gateway `multimodalResolverParameters` substitui as flags obsoletas `enabledMultimodalFeatures`. Gateways que ainda usam as flags continuam funcionando com os motores equivalentes até que `multimodalResolverParameters` seja definido.

Use pré‑processamento quando o modelo principal for texto‑primeiro ou quando quiser que a AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré‑processamento para que o modelo possa inspecioná‑la diretamente.

Os resultados são armazenados em cache por conteúdo e motor para reutilização.

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

Valores ao nível de requisição podem sobrescrever valores do gateway quando o ponto de extremidade suporta o parâmetro. `frequency_penalty` é configurado apenas no gateway e não é sobrescrito por requisição. Alguns modelos integrados rejeitam parâmetros específicos, e provedores BYOK podem ter suas próprias restrições.

## Truncamento de contexto

O pipeline de truncamento de contexto usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` é definido e a conversa ultrapassa o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro ao invés de chamar o modelo.
- `Truncate`: Remove as mensagens não‑sistêm mais mais antigas até que as mensagens restantes da conversa caibam. A requisição continua mesmo se o prompt, incluindo instruções de sistema e contexto RAG recuperado, ainda ultrapassar o limite.
- `TruncateHard`: Trunca como acima, mas falha a requisição com um erro de tamanho de mensagem se o prompt ainda exceder o limite depois.

O truncamento preserva mensagens de sistema e mantém ao menos uma mensagem do usuário quando possível.

Em planos inferiores, o contexto de entrada efetivo pode ser limitado mesmo quando um contexto maior está configurado; veja [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md#account-limits).

## Truncamento de mensagens de ferramenta

`ToolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido para um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isso pode reduzir o uso de contexto em conversas agenticas longas. Também pode prejudicar cadeias onde um resultado antigo de ferramenta ainda é importante, portanto use apenas quando o modelo puder chamar a ferramenta novamente com segurança. Reescrever mensagens antigas de ferramenta também altera o prefixo da requisição, o que pode reduzir a taxa de acerto do cache de prompt; para verificar isso no seu uso, veja [why a prompt cache hit rate is low](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pela AIVAX durante a inferência. Elas podem originar de:

- Ferramentas internas.
- Funções de protocolo.
- Fontes remotas de funções de protocolo.
- Fontes MCP.
- QueryFunction RAG.
- Habilidades.
- Ambiente bash opcional.

Eventos de ferramentas do lado do servidor podem ser transmitidos aos clientes como atualizações `servertool`.

## Ferramentas internas

Ferramentas internas podem ser configuradas em um gateway ou fornecidas por requisição com `builtin_tools`. As flags de ferramentas internas disponíveis incluem:

- `DateTime` — data e hora atuais através de `get_date_time`; configure `dateTimeTimeZone` nas opções de ferramenta interna (padrão: `America/Los_Angeles`, Horário do Pacífico).

- `WebSearch`
- `AdvancedWebUsage` (desabilitado; retorna resposta indisponível. Veja [Changelogs](https://docs.aivax.net/pt-br/docs/legal/changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Built-in tools](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md).

## MCP e funções de protocolo

Ferramentas listadas por uma fonte MCP ficam disponíveis ao modelo com seus esquemas declarados. Resultados de ferramentas MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportado.

Funções de protocolo expõem callbacks HTTP ou URLs de callback da AIVAX como ferramentas chamáveis pelo modelo. Fontes remotas de funções de protocolo são obtidas e armazenadas em cache antes que suas ferramentas fiquem disponíveis ao modelo.

Veja [Protocol functions](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) e [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

## Interpretador de funções

Um manipulador de ferramenta pode adicionar comportamento de chamada de ferramenta para modelos que não produzem chamadas nativas de forma confiável. Valores suportados são:

- `native` ou `null`: Usa chamada nativa de ferramenta do modelo.
- `react.v1.selfcall`: Usa o manipulador de auto‑chamada estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falha no tempo de inferência.

## Moderação

A moderação é um filtro de entrada que roda antes do modelo principal. Quando ao menos uma categoria de moderação está habilitada, a AIVAX envia a conversa textual disponível a um modelo de proteção. O modelo de proteção avalia a última solicitação do usuário no contexto estabelecido pela conversa e devolve uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do gateway | O que o modelo de proteção avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo a dano físico. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Temas políticos** | `politicalThreshold` | Persuasão política, campanha, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, auto‑dano ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de sobrescrever instruções, revelar instruções protegidas, extrair dados ou injetar prompts. |

### Entendendo os níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade**, não a pontuação do modelo de proteção. Um nível mais alto diminui a pontuação necessária para bloquear a entrada.

| Nível de sensibilidade | Pontuações do modelo de proteção que bloqueiam |
| ---: | --- |
| `0` | Categoria desativada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o corte de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de `0` nunca bloqueia. Configure cada categoria independentemente; a requisição é bloqueada quando qualquer categoria habilitada atinge seu corte.

### Adicionar regras específicas do gateway

**Regras de moderação adicionais** permitem que um administrador de gateway descreva políticas que não são totalmente expressas pelas descrições de categoria internas. O modelo de proteção lê essas regras junto com a política interna e as usa para calibrar as cinco pontuações.

Exemplo:

```text
Allow users to describe accidents and injuries when asking for insurance coverage or assistance.
Treat requests for instructions to cause an accident or harm someone as dangerous content.
```

Regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam diretamente uma entrada. Pelo menos uma categoria deve ter nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação do modelo de proteção possa gerar uma decisão de bloqueio.

Escreva regras como declarações curtas de política com casos explícitos permitidos e proibidos. Não inclua segredos, credenciais ou dados operacionais privados, pois as regras são armazenadas com a configuração do gateway e enviadas ao modelo de proteção durante a moderação.

O fragmento de gateway a seguir habilita diferentes níveis de sensibilidade e fornece orientações específicas ao domínio para o modelo de proteção. Os valores são um exemplo, não uma baseline recomendada para produção:

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

Quando qualquer categoria habilitada atinge seu corte:

1. A AIVAX marca as mensagens originais da conversa como indisponíveis para a requisição de inferência principal.
2. A AIVAX as substitui por uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa ao invés de responder à solicitação original.

A recusa é gerada pelo modelo; a moderação não devolve um corpo de resposta fixo. Se todo modelo de moderação falhar ao produzir um resultado válido, a requisição não é rejeitada. O modelo principal recebe instruções rígidas derivadas das categorias configuradas, níveis de sensibilidade e regras adicionais, e aplica a política por conta própria. Se sua aplicação precisar falhar fechadamente quando a moderação estiver indisponível, imponha isso na sua aplicação ou em um trabalhador.

### Contexto e limitações atuais

O modelo de proteção recebe o histórico de conversa disponível, não apenas a mensagem mais recente. Papéis de mensagem e texto são preservados como dados de conversa serializados não confiáveis para reduzir a chance de que instruções dentro da conversa sobrescrevam a política de proteção. Se a conversa exceder a janela de contexto da proteção, o contexto mais antigo pode ser truncado.

A moderação atualmente se aplica apenas ao texto de entrada:

- Saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdo de arquivos não são analisados. O modelo de proteção recebe apenas um marcador indicando que mídia estava presente.
- Autorização de ferramenta ou trabalhador ainda requer política ao nível da aplicação; a moderação não é um mecanismo de autorização.
- A moderação adiciona uma inferência de proteção antes da inferência principal, o que aumenta a latência e o uso de moderação cobrável (veja [Inference pricing](https://docs.aivax.net/pt-br/docs/inference/inference.md#pricing)).

Use a moderação para políticas de segurança amplas. Use trabalhadores quando a decisão depender de identidade externa, estado da conta ou política específica de negócio.

Para um guia de decisão sobre prompts de sistema, etapa de moderação separada e autorização, veja [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/).

## Trabalhadores

Configure eventos de trabalhador e detalhes de endpoint nos parâmetros do gateway; implemente o comportamento do evento em seu endpoint externo. Veja [AI Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md).
