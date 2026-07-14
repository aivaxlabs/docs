# Pipelines de IA

Os pipelines do Gateway de IA são as etapas de processamento que a AIVAX aplica antes e durante a inferência. Eles podem adicionar contexto, reescrever consultas, expor ferramentas, moderar a entrada, rotear modelos, truncar conversas e chamar trabalhadores externos.

A maioria dos pipelines é configurada nos parâmetros do gateway. Opções ao nível de requisição podem sobrescrever alguns parâmetros de inferência em chamadas diretas `chat/completions`.

## RAG

RAG vincula [coleções](/docs/pt-br/rag/collections) a um Gateway de IA. O gateway controla:

- Coleções incluídas na recuperação.
- Número máximo de documentos recuperados.
- Pontuação mínima.
- Nome do reordenador.
- Se as referências de fragmentos estão incluídas.
- Estratégia de consulta.

Quando um gateway tem coleções de conhecimento e a mensagem mais recente do usuário contém texto, a AIVAX pode recuperar documentos correspondentes antes da chamada ao modelo. Para estratégias de injeção, o contexto recuperado é inserido no início da última mensagem do usuário. Se uma coleção vinculada tem seu próprio texto de contexto, esse contexto da coleção é adicionado às instruções do sistema.

Estratégias de consulta:

- `Plain`: Usa a mensagem mais recente do usuário como a consulta de busca.
- `Concatenate`: Junta o número configurado mais recente de mensagens do usuário linha por linha e busca com o texto combinado.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente em uma ou mais consultas de busca usando um modelo resolvedor.
- `QueryFunction`: Adiciona uma função de consulta ao modelo. O modelo decide quando buscar nas coleções vinculadas, e os resultados da busca são retornados como respostas de ferramenta.

Estratégias de reescrita adicionam custo e latência ao modelo resolvedor. Elas são úteis quando os usuários fazem perguntas de acompanhamento, como "e quanto a este caso?", pois o resolvedor pode transformar a conversa recente em uma consulta de busca mais clara.

Definir muitos resultados RAG aumenta o uso de tokens de entrada e pode elevar o custo final da inferência. Comece com uma contagem pequena de resultados e aumente apenas quando o modelo não tem evidência suficiente.

## Instruções

As configurações de instruções moldam o prompt voltado ao provedor:

- **System instructions**: Adicionado ao conjunto de instruções do sistema.
- **Remote system instruction sources**: Obtido a partir de URLs configuradas e adicionado ao conjunto de instruções do sistema.
- **User prompt template**: Substitui `{prompt}` pelo texto de cada mensagem do usuário antes de enviá-lo ao modelo.
- **Assistant prefill**: Adiciona conteúdo inicial do assistente antes da geração quando o modelo suporta preenchimento prévio.

Fontes de instruções remotas são obtidas como texto com tamanho máximo de resposta de 10 MB. Sua duração de cache é configurável; o padrão é 600 segundos.

Alguns modelos não suportam preenchimento prévio do assistente, temperatura, sequências de parada ou esforço de raciocínio. A validação integrada do modelo rejeita configurações de gateway incompatíveis quando essas limitações são conhecidas.

## Habilidades

Habilidades são pacotes de instruções sob demanda disponíveis para o modelo. Quando um gateway habilita habilidades, a AIVAX carrega as habilidades da conta configuradas no gateway e pode expor funções integradas relacionadas a habilidades.

Saiba mais sobre [habilidades](/docs/pt-br/features/skills).

## Pré-processamento multimodal

O pré-processamento multimodal converte o conteúdo de mídia selecionado em texto antes da chamada ao modelo principal. As flags disponíveis são `Image`, `Audio`, `Video`, `File`, `OtherFiles` e `All`.

Use o pré-processamento quando o modelo principal for principalmente texto ou quando você quiser que a AIVAX normalize a mídia em contexto textual. Para modelos multimodais diretos, envie a mídia original sem pré-processamento para que o modelo possa inspecioná‑la diretamente.

As descrições de mídia são armazenadas em cache por hash de conteúdo para reutilização.

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

## Truncação de contexto

O pipeline de truncação de contexto usa uma contagem aproximada de tokens. Quando `ContextMaximumSize` está definido e a conversa excede o limite, o gateway segue `ContextOverflowAction`:

- `Throw`: Retorna um erro ao invés de chamar o modelo.
- `Truncate`: Remove mensagens não‑sistema mais antigas até que a conversa caiba.

A truncação preserva mensagens do sistema e mantém ao menos uma mensagem do usuário quando possível. Se a mensagem de usuário restante ainda exceder o limite, a requisição falha com um erro de tamanho de mensagem.

No plano gratuito, o contexto de entrada efetivo é limitado a 65 536 tokens mesmo quando um contexto maior está configurado.

## Truncação de mensagens de ferramenta

`ToolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido para um valor maior que zero, mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[tool response truncated - call this tool again]
```

Isso pode reduzir o uso de contexto em conversas agenticas longas. Também pode prejudicar cadeias onde um resultado antigo de ferramenta permanece importante, portanto use apenas quando o modelo puder chamar a ferramenta novamente com segurança.

## Ferramentas do lado do servidor

Ferramentas do lado do servidor são funções internas executadas pela AIVAX durante a inferência. Elas podem vir de:

- Ferramentas integradas.
- Funções de protocolo.
- Fontes de funções de protocolo remotas.
- Fontes MCP.
- QueryFunction RAG.
- Habilidades.
- Ambiente bash opcional.

Eventos de ferramentas do lado do servidor podem ser transmitidos aos clientes como atualizações `servertool`.

## Ferramentas integradas

Ferramentas integradas podem ser configuradas em um gateway ou fornecidas por requisição com `builtin_tools`. Flags de ferramentas integradas disponíveis incluem:

- `WebSearch`
- `AdvancedWebUsage`
- `OpenUrl`
- `Code`
- `Request`
- `Calendar`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

Veja [Ferramentas integradas](/docs/pt-br/tools/builtin-tools).

## MCP e funções de protocolo

Ferramentas listadas por uma fonte MCP tornam‑se disponíveis ao modelo com seus esquemas declarados. Resultados de ferramentas MCP podem incluir texto, imagens e áudio; resultados de mídia são anexados à conversa como mensagens adicionais quando suportado.

Funções de protocolo expõem callbacks HTTP ou URLs de callback da AIVAX como ferramentas chamáveis pelo modelo. Fontes de funções de protocolo remotas são obtidas e armazenadas em cache antes que suas ferramentas se tornem disponíveis ao modelo.

Veja [Funções de protocolo](/docs/pt-br/tools/protocol-functions) e [MCP](/docs/pt-br/tools/mcp).

## Interpretador de funções

Um manipulador de ferramenta pode adicionar comportamento de chamada de ferramenta para modelos que não produzem chamadas nativas de forma confiável. Valores suportados são:

- `native` ou `null`: Usa chamada de ferramenta nativa do modelo.
- `react.v1.selfcall`: Usa o manipulador de autochamada estilo ReAct.

Se um nome de manipulador não for reconhecido, a configuração do gateway falha no momento da inferência.

## Moderação

A moderação executa um modelo resolvedor sobre a conversa e pontua categorias para violência, conteúdo sexualmente explícito, conteúdo político, conteúdo perigoso e tentativas de jailbreak. Se os limites configurados forem excedidos, a AIVAX marca as mensagens originais da conversa como não encaminhadas e pede ao modelo que responda que não pode interagir com esse conteúdo.

Use a moderação para política de segurança abrangente. Use trabalhadores quando a decisão depende de identidade externa, estado da conta ou política específica de negócio.

## Trabalhadores

Trabalhadores são hooks HTTP externos chamados durante a execução do gateway. Eles podem parar um evento, deixá‑lo continuar, reescrever o contexto da mensagem, adicionar ferramentas, adicionar instruções do sistema ou substituir um resultado de ferramenta do lado do servidor.

Saiba mais sobre [Trabalhadores de IA](/docs/pt-br/inference/workers).