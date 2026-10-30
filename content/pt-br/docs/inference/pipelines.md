---
{title: Pipeline de Processamento,linkTitle: Pipeline de processamento,weight: 60,group: Inference,sourceHash: 03ed0ffc9d8b263c,aliases: [/docs/pt-br/inference/pipelines.html]}
---

# Pipeline de Processamento

Os pipelines do AI Gateway são as etapas de processamento que a AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar entradas, rotear modelos, truncar conversas e chamar trabalhadores externos (workers).

A maioria dos pipelines é configurada nos parâmetros do [AI Gateway](/docs/pt-br/inference/ai-gateway). Opções em nível de solicitação podem substituir alguns parâmetros de inferência em chamadas diretas para [`chat/completions`](/docs/pt-br/inference/inference).

## RAG

O pipeline RAG adiciona conhecimento dos seus documentos ao contexto do modelo. Ele vincula [coleções](/docs/pt-br/rag/collections) a um AI Gateway. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reranker.
- Se as referências de chunk estão incluídas.
- Estratégia de consulta.

Quando um gateway possui coleções de conhecimento e a última mensagem do usuário contém texto, a AIVAX pode recuperar documentos correspondentes antes da chamada do modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário. Se uma coleção vinculada tiver seu próprio texto de contexto, esse contexto da coleção é adicionado às instruções do sistema.

Estratégias de consulta:

- `Plain`: Usa a última mensagem do usuário como a consulta de pesquisa.
- `Concatenate`: Junta as últimas mensagens configuradas do usuário linha por linha e pesquisa com o texto combinado.
- `UserRewrite`: Reescreve as mensagens recentes do usuário em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `FullRewrite`: Reescreve as mensagens recentes do usuário e do assistente em uma ou mais consultas de pesquisa usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando pesquisar nas coleções vinculadas, e os resultados da pesquisa são retornados como respostas de ferramenta. O modelo pode restringir uma pesquisa com um [filtro de documento](/docs/pt-br/rag/document-filters) opcional.

As estratégias de reescrita adicionam custo do modelo resolvedor (veja [Preços](/docs/pt-br/pricing)) e latência. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como "e sobre este caso?", porque o resolvedor pode transformar a conversa recente em uma consulta de pesquisa mais clara.

Definir muitos resultados RAG aumenta o uso de tokens de entrada e pode aumentar o custo final de inferência (veja [Preços](/docs/pt-br/pricing)). Comece com uma pequena contagem de resultados e aumente-a apenas quando o modelo não tiver evidências suficientes.

## Instruções

As configurações de instrução moldam o prompt voltado para o provedor:

- **Instruções do sistema**: Adicionadas ao conjunto de instruções do sistema.
- **Fontes remotas de instrução do sistema**: Buscadas de URLs configurados e adicionadas ao conjunto de instruções do sistema.
- **Modelo de prompt do usuário**: Substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá-lo ao modelo.
- **Prefill do assistente**: Adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta prefill.

As fontes de instrução remota são buscadas como texto, e cada resposta pode ter no máximo 5 MB. Sua duração de cache é configurável de 0 (sem cache) a 86.400 segundos; o padrão é 600 segundos.

Se uma fonte não puder ser lida (resposta acima do limite, falha na solicitação ou URL inseguro), ela não contribui com nenhum texto e a própria solicitação não falha. Tenha em mente estas regras de falha:

- Uma busca falha (um erro HTTP como 404 ou 500, um erro de conexão, um URL privado ou uma resposta acima do limite) é armazenada em cache pela duração total do cache, assim como uma bem-sucedida.
- Não há fallback stale-if-error. Se uma fonte anteriormente boa expirar durante uma interrupção, o modelo receberá apenas o título `# <name>` sem corpo (ou nada, se a fonte não tiver nome).
- Nenhuma mensagem de erro ou registro de log é exibido quando isso acontece.

Alguns modelos não suportam prefill do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação integrada do modelo rejeita configurações incompatíveis do gateway quando essas limitações são conhecidas.

## Habilidades (Skills)

Habilidades são pacotes de instrução sob demanda disponíveis para o modelo. Use-as para instruções especializadas que apenas algumas tarefas precisam. Quando um gateway habilita habilidades, a AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções integradas relacionadas a habilidades.

Leia mais sobre [habilidades](/docs/pt-br/inference/skills).

## Pré-processamento multimodal

O pré-processamento multimodal converte mídia selecionada em texto antes da chamada principal do modelo. Cada tipo de conteúdo (imagens, áudio, vídeo e arquivos) usa seu próprio mecanismo: um modelo multimodal menor (`InferenceLow`) ou maior (`InferenceHigh`), OCR para imagens e arquivos, ou fala para texto para áudio. Veja [Pré-processamento multimodal](/docs/pt-br/inference/inference#multimodal-pre-processing) para os mecanismos aceitos.

A configuração do gateway `multimodalResolverParameters` substitui as sinalizações `enabledMultimodalFeatures` obsoletas. Gateways que ainda usam as sinalizações continuam funcionando com os mecanismos equivalentes até que `multimodalResolverParameters` seja definido.

Use o pré-processamento quando o modelo principal for focado em texto ou quando você quiser que a AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré-processamento para que o modelo possa inspecioná-la diretamente.

Os resultados são armazenados em cache por conteúdo e mecanismo para reutilização.

## Parametrização

O pipeline de parametrização define opções padrão de solicitação do modelo para o gateway, como:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Valores em nível de solicitação podem substituir valores do gateway quando o endpoint suporta o parâmetro. `frequency_penalty` é configurado apenas no gateway e não é substituído por solicitação. Alguns modelos integrados rejeitam parâmetros específicos, e provedores BYOK podem ter suas próprias restrições.

## Truncamento de contexto

O truncamento de contexto mantém conversas longas dentro de um tamanho máximo de entrada. Ele usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` está definido e a conversa excede o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro em vez de chamar o modelo.
- `Truncate`: Remove as mensagens não-sistema mais antigas até que as mensagens restantes da conversa se encaixem. A solicitação continua mesmo se o prompt, incluindo instruções do sistema e contexto RAG recuperado, ainda exceder o limite.
- `TruncateHard`: Trunca como acima, mas falha na solicitação com um erro de tamanho de mensagem se o prompt ainda exceder o limite depois disso.

O truncamento preserva mensagens do sistema e mantém pelo menos uma mensagem do usuário quando possível.

Em planos inferiores, o contexto de entrada efetivo pode ser limitado mesmo quando um contexto maior está configurado; veja [Planos e limites](/docs/pt-br/limits#account-limits).

## Truncamento de mensagens de ferramenta

`ToolContextCount` controla quantas mensagens de resposta de ferramenta recentes mantêm seu conteúdo original. Quando definido como um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isso pode reduzir o uso de contexto em conversas agênticas longas. Também pode prejudicar cadeias onde um resultado de ferramenta antigo permanece importante, então use-o apenas quando o modelo puder chamar a ferramenta novamente com segurança.

Reescrever mensagens de ferramenta mais antigas também altera o prefixo da solicitação, o que pode diminuir a taxa de acerto do cache de prompts; para verificar isso no seu próprio uso, veja [por que uma taxa de acerto de cache de prompts é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pela AIVAX durante a inferência. Elas podem vir de:

- Ferramentas integradas.
- Funções de protocolo.
- Fontes remotas de funções de protocolo.
- Fontes MCP.
- RAG QueryFunction.
- Habilidades (Skills).
- Ambiente bash opcional.

Eventos de ferramentas do lado do servidor podem ser transmitidos para clientes como atualizações `servertool`.

## Ferramentas integradas

Ferramentas integradas podem ser configuradas em um gateway ou fornecidas por solicitação com `builtin_tools`. As sinalizações de ferramentas integradas disponíveis incluem:

- `DateTime` — data e hora atuais através de `get_date_time`, no fuso horário do gateway (`parameters.timeZone`, padrão `America/Sao_Paulo`).

- `WebSearch`
- `AdvancedWebUsage` (desativado; retorna uma resposta indisponível. Veja [Changelogs](../legal/changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Ferramentas integradas](/docs/pt-br/tools/builtin-tools).

## Funções MCP e de protocolo

Ferramentas listadas por uma fonte MCP ficam disponíveis para o modelo com seus esquemas declarados. Os resultados das ferramentas MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportados.

Funções de protocolo expõem callbacks HTTP ou URLs de callback da AIVAX como ferramentas chamáveis por modelos. Fontes remotas de funções de protocolo são buscadas e armazenadas em cache antes que suas ferramentas estejam disponíveis para o modelo.

Veja [Funções de protocolo](/docs/pt-br/tools/protocol-functions) e [MCP](/docs/pt-br/tools/mcp).

## Interpretador de funções

O interpretador de funções, também chamado de manipulador de ferramentas, adiciona comportamento de chamada de ferramentas para modelos que não produzem chamadas nativas de ferramentas de forma confiável. Os valores suportados são:

- `native` ou `null`: Use chamadas de ferramentas nativas do modelo.
- `react.v1.selfcall`: Use o manipulador de auto-chamada estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falhará no momento da inferência.

## Moderação

A moderação aplica políticas de segurança às solicitações do usuário antes que o modelo principal as responda. Use-a para bloquear solicitações inseguras ou fora da política.

O campo `moderationParameters.mode` seleciona como a moderação é executada:

- `LayeredGuardrail` (padrão): Um modelo de salvaguarda independente analisa o texto de entrada da conversa antes do modelo principal. Conversas sinalizadas são bloqueadas, e o modelo principal responde com uma recusa. O uso de moderação é cobrado conforme descrito em [Preços de inferência](inference.md#pricing).
- `SelfAssessment`: Nenhum modelo de salvaguarda separado é executado, portanto, não há cobrança de análise de moderação. O modelo principal recebe instruções de moderação construídas a partir dos mesmos níveis de sensibilidade de categoria e regras adicionais, além de uma ferramenta de recusa interna. Quando o modelo julga que a solicitação mais recente atinge o limite de uma categoria habilitada, ele chama a ferramenta com um motivo, as categorias violadas e uma mensagem final para o usuário. A inferência termina imediatamente, outras chamadas de ferramentas dessa rodada são ignoradas, a mensagem final é retornada como a resposta do assistente, e a resposta é marcada como uma recusa. A solicitação é rejeitada quando o modelo selecionado não suporta chamadas de ferramentas.

Como `SelfAssessment` depende do julgamento do modelo principal em vez de um classificador independente, ela troca latência e custo menores por isolamento mais fraco: não é uma camada independente, e a qualidade da aplicação depende do modelo.

No modo `LayeredGuardrail`, quando pelo menos uma categoria de moderação está habilitada, a AIVAX envia o texto disponível da conversa para um modelo de salvaguarda. A salvaguarda avalia a solicitação mais recente do usuário no contexto estabelecido pela conversa e retorna uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do Gateway | O que a salvaguarda avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo a danos físicos. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Tópicos políticos** | `politicalThreshold` | Persuasão política, campanha, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, autolesão ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de sobrescrever instruções, revelar instruções protegidas, exfiltrar dados ou injetar prompts. |

### Entenda os níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade**, não a pontuação da salvaguarda em si. Um nível mais alto reduz a pontuação necessária para bloquear a entrada.

| Nível de sensibilidade | Pontuações da salvaguarda que bloqueiam |
| ---: | --- |
| `0` | Categoria desabilitada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o corte de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de salvaguarda de `0` nunca bloqueia. Configure cada categoria independentemente; a solicitação é bloqueada quando qualquer categoria habilitada atinge seu corte.

No modo `SelfAssessment`, os mesmos níveis de sensibilidade definem o limite que o modelo principal deve aplicar, embora não haja pontuação numérica de salvaguarda.

### Adicione regras específicas do gateway

**Regras adicionais de moderação** permitem que um administrador do gateway descreva políticas que não estão totalmente expressas pelas descrições das categorias integradas. A salvaguarda lê essas regras junto com a política integrada e as usa para calibrar todas as cinco pontuações. No modo `SelfAssessment`, o modelo principal recebe as mesmas regras com suas instruções de moderação.

Por exemplo:

```text
Permita que os usuários descrevam acidentes e ferimentos ao solicitar cobertura ou assistência de seguro.
Trate solicitações de instruções para causar um acidente ou prejudicar alguém como conteúdo perigoso.
```

Regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam uma entrada diretamente. Pelo menos uma categoria deve ter um nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação da salvaguarda possa produzir uma decisão de bloqueio.

Escreva regras como declarações de política curtas com casos explícitos permitidos e proibidos. Não inclua segredos, credenciais ou dados operacionais privados, pois as regras são armazenadas com a configuração do gateway e enviadas ao modelo de salvaguarda durante a moderação.

O seguinte fragmento de gateway habilita diferentes níveis de sensibilidade e fornece orientação específica do domínio à salvaguarda. Os valores são um exemplo, não uma linha de base recomendada para produção:

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

1. A AIVAX marca as mensagens originais da conversa como indisponíveis para a solicitação de inferência principal.
2. A AIVAX as substitui por uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa em vez de responder à solicitação original.

A recusa é gerada pelo modelo; a moderação não retorna um corpo de resposta fixo. No modo `SelfAssessment`, o modelo principal produz a recusa ele mesmo por meio da ferramenta de recusa, conforme descrito acima.

No modo `LayeredGuardrail`, se todos os modelos de moderação falharem em produzir um resultado válido, a solicitação não é rejeitada. O modelo principal recebe em vez disso instruções estritas derivadas das categorias configuradas, níveis de sensibilidade e regras adicionais, e aplica a política ele mesmo. Se seu aplicativo deve falhar fechado quando a moderação estiver indisponível, imponha isso no seu aplicativo ou em um worker.

### Contexto e limitações atuais

No modo `LayeredGuardrail`, a salvaguarda recebe o histórico de conversa disponível, não apenas a mensagem mais recente. Os papéis e o texto das mensagens são preservados como dados de conversa serializados não confiáveis para reduzir a chance de que instruções dentro da conversa substituam a política da salvaguarda. Se a conversa exceder a janela de contexto da salvaguarda, o contexto mais antigo pode ser truncado.

A moderação atualmente aplica-se apenas ao texto de entrada:

- A saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdos de arquivo não são analisados. A salvaguarda recebe apenas um marcador indicando que havia mídia presente.
- A autorização de ferramentas ou workers ainda requer política em nível de aplicativo; a moderação não é um mecanismo de autorização.
- No modo `LayeredGuardrail`, a moderação adiciona uma inferência de salvaguarda antes da inferência principal, o que adiciona latência e uso de moderação faturável (veja [Preços de inferência](inference.md#pricing)). O modo `SelfAssessment` não adiciona inferência separada.

Use a moderação para políticas amplas de segurança. Use workers quando a decisão depender de identidade externa, estado da conta ou política específica do negócio.

Para um guia de decisão sobre prompts do sistema, uma etapa de moderação separada e autorização, veja [Moderação de entrada LLM: prompt do sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/).

## Workers

Workers chamam seu endpoint externo durante eventos do gateway, para que seu próprio código possa permitir, parar ou alterar a solicitação. Configure eventos de worker e detalhes do endpoint nos parâmetros do gateway e implemente o comportamento do evento no seu endpoint. Veja [AI Workers](/docs/pt-br/inference/workers).
