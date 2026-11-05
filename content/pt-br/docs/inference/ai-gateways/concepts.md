---
{title: Conceitos de Gateway de IA,linkTitle: Conceitos,weight: 10,group: AI Gateways,aliases: [/docs/pt-br/platform/ai-gateways.html,/docs/pt-br/inference/ai-gateway.html,/docs/pt-br/inference/ai-gateways/concepts.html],sourceHash: f17b861db7a1a433}
---

# Conceitos de Gateway de IA

Um Gateway de IA armazena uma configuração de inferência reutilizável. Passe o ID ou slug do gateway no campo `model` da solicitação, e a AIVAX aplica suas configurações de modelo, instruções, coleções RAG, ferramentas, habilidades, workers, moderação e controles de contexto antes de chamar o modelo.

Use um gateway quando o mesmo comportamento precisar ser reutilizado por vários clientes ou alterado sem a necessidade de reimplementar o aplicativo que faz a chamada. Use uma [chamada de inferência direta](/docs/pt-br/inference/chat-completions/concepts.md) quando o aplicativo controlar o modelo, prompt, ferramentas e contexto de cada solicitação.

Trate a configuração do gateway como sensível: `GET /api/v1/ai-gateways/<id>` retorna os parâmetros completos para a conta proprietária, incluindo `apiKey` em texto puro quando o gateway usa uma chave de provedor externa.

## Limite de responsabilidade

Um gateway separa dois papéis:

- **O aplicativo cliente** envia mensagens e, com uma chave privada, substituições opcionais de solicitação.
- **O administrador do gateway** controla a política operacional: qual modelo é executado, o que ele recebe, o que ele pode ler, quais ferramentas ele pode chamar e quais limites se aplicam.

Esse limite permite alterar um modelo, um prompt ou uma lista de ferramentas em um único local, enquanto todos os clientes continuam chamando o mesmo identificador. Cada recurso abaixo é opcional. Comece com um modelo e instruções do sistema, e adicione outros recursos apenas quando o caso de uso exigir: cada ferramenta, habilidade ou coleção adiciona tokens de entrada, custo e mais um caminho pelo qual o modelo pode escolher incorretamente.

As seções abaixo descrevem o que cada recurso faz e quando usá-lo. O documento [Pipeline de processamento](/docs/pt-br/inference/pipelines.md) detalha o comportamento de cada etapa.

## Modelo e provedor

O modelo do gateway é ou um modelo integrado da AIVAX ou um modelo servido pela sua própria chave de provedor (BYOK).

- **Modelos integrados** usam `baseAddress: "@integrated"` e um nome de modelo como `@openai/gpt-5-mini`. A AIVAX seleciona o provedor, cobra a conta e aplica o [roteamento de provedores](/docs/pt-br/inference/routing/setup-routing.md).
- **Modelos BYOK** usam o endereço base de um ponto de extremidade de provedor compatível com OpenAI, sua `apiKey` de provedor e o nome do modelo do provedor. A AIVAX ainda executa o pipeline do gateway, mas o provedor fatura você diretamente e o roteamento de provedores não se aplica. Solicitações BYOK usam o limite de taxa BYOK do plano; consulte [Planos e limites](/docs/pt-br/limits.md).

Use um modelo integrado, a menos que você precise de um modelo, contrato ou região que apenas sua conta de provedor ofereça. Consulte [Modelos e nomes de gateway](models-and-gateway-names.md) para saber como o modelo é identificado.

## Roteamento de modelos

O roteamento de modelos seleciona um modelo diferente para cada solicitação. O roteador de complexidade classifica a última solicitação do usuário como baixa, média ou alta complexidade e executa o modelo configurado para esse nível, com um esforço de raciocínio opcional por nível. A resposta contém o cabeçalho `X-Model-Routed-Complexity` quando um nível foi selecionado.

Use-o quando a maioria das solicitações for simples, mas algumas precisarem de um modelo mais forte, para que você não pague o preço do modelo mais forte em todas as solicitações. Não o use quando todas as respostas devem vir do mesmo modelo para consistência ou conformidade.

O roteamento de modelos difere do [roteamento de provedores](/docs/pt-br/inference/routing/setup-routing.md), que mantém o modelo e escolhe qual provedor o atende.

## Instruções

As configurações de instrução moldam o prompt que o modelo recebe:

| Recurso | O que faz | Quando usar |
| --- | --- | --- |
| Instruções do sistema | Texto adicionado às instruções do sistema de cada solicitação. | Sempre. Descreva o papel, o público-alvo, as fontes de verdade e os limites. |
| Fontes remotas de instrução | URLs buscadas como texto e anexadas às instruções do sistema, com cache configurável. | Instruções mantidas em outro sistema, como um CMS ou repositório, que precisam mudar sem editar o gateway. |
| Modelo de prompt do usuário | Substitui `{prompt}` pelo texto de cada mensagem do usuário. | Cada mensagem do usuário deve ser envolvida na mesma estrutura, como uma descrição fixa de tarefa. |
| Pré-preenchimento do assistente | Texto inicial do assistente colocado antes da geração. | A resposta deve começar com um formato fixo. Alguns modelos não suportam pré-preenchimento. |

Escreva instruções sobre comportamento, não sobre configurações que o gateway já controla, como limites de truncamento ou a lista de ferramentas. Consulte [Instruções](/docs/pt-br/inference/pipelines.md#instructions) para o limite de tamanho da fonte remota e regras de falha.

## Parâmetros do modelo

O gateway pode definir valores padrão para `temperature`, `top_p`, `presence_penalty`, `frequency_penalty`, `stop`, `max_completion_tokens`, `reasoning_effort`, `verbosity` e `seed`. Solicitações enviadas com uma chave privada podem substituir a maioria deles; consulte [Substituir valores do gateway](using-an-ai-gateway.md#override-gateway-values).

Defina parâmetros no gateway quando o comportamento deve ser igual para todos os clientes, por exemplo, uma temperatura baixa para um assistente de extração. Alguns modelos integrados rejeitam parâmetros como temperatura, sequências de parada ou esforço de raciocínio; a AIVAX rejeita a configuração do gateway quando a limitação é conhecida.

## Janela de contexto e truncamento

`contextMaximumSize` limita o número aproximado de tokens de entrada enviados ao modelo, e `contextOverflowAction` decide o que acontece quando uma conversa excede esse limite:

- `Throw` retorna um erro em vez de chamar o modelo. Este é o padrão.
- `Truncate` remove as mensagens não-sistema mais antigas até que a conversa se encaixe, depois continua.
- `TruncateHard` truncar como `Truncate`, mas falhará na solicitação se o prompt ainda não se encaixar.

Use o truncamento para chats de longa duração nos quais as rodadas antigas perdem relevância, como conversas de suporte. Mantenha `Throw` quando cada mensagem for importante, como em uma revisão de documentos, para que o aplicativo decida o que remover. No plano Gratuito, o contexto de entrada é limitado independentemente desta configuração; consulte [Limites](/docs/pt-br/inference/chat-completions/limits.md).

## Truncamento de mensagens de ferramentas

`toolContextCount` mantém apenas os resultados de ferramentas mais recentes intactos. Mensagens de ferramentas mais antigas permanecem na conversa, mas seu conteúdo é substituído por uma nota curta pedindo ao modelo que chame a ferramenta novamente.

Use-o em conversas agênticas longas cujas ferramentas retornam grandes payloads que são relevantes apenas uma vez, como resultados de pesquisa. Evite-o quando um resultado de ferramenta inicial permanecer importante posteriormente. Reescrever mensagens antigas também altera o prefixo do prompt, o que pode reduzir o [cache de prompts](/docs/pt-br/inference/chat-completions/caching.md).

## Flags

Flags alteram como a AIVAX prepara a solicitação do provedor para modelos com comportamento específico. Configure-as em **Flags e switches de normalização** no editor de gateways ou em `parameters.flags`.

| Flag | Efeito | Quando usar |
| --- | --- | --- |
| `DisableMultiModalInput` | Imagens, áudio, vídeo e arquivos não são enviados ao modelo, mesmo quando ele os suporta. | O gateway deve permanecer apenas texto, por motivos de custo ou política. |
| `ThinkingProcess` | Declara que o modelo raciocina internamente sem retornar seus tokens de raciocínio. | Um modelo que raciocina, mas oculta seu raciocínio. |
| `DiffusingStream` | Declara que o modelo é um modelo de difusão cuja saída é refinada como um todo, em vez de produzida token por token. | Apenas modelos de difusão. |
| `PreserveThinkingTokens` | Mantém os blocos `<think>` das mensagens anteriores do assistente na conversa enviada ao modelo. | Modelos que precisam de seu raciocínio anterior para continuar uma tarefa de múltiplas etapas. |
| `RewriteToolCallsAsUserMessages` | Reescreve chamadas de ferramentas e resultados de ferramentas como mensagens de conversa plain. | Modelos ou provedores que rejeitam o formato nativo de mensagem de ferramenta. |
| `StrictUserAssistantTurns` | Aplica alternância estrita entre mensagens de usuário e assistente. Isso desativa mensagens de ferramentas. | Modelos que falham quando duas mensagens com o mesmo papel estão adjacentes. |
| `DisableReasoningSummary` | Interrompe o streaming de conteúdo de raciocínio para o cliente. | Clientes que nunca devem receber raciocínio. |

Flags compensam limitações de modelos. Deixe-os não definidos, a menos que você observe o problema que uma flag resolve.

## Pré-processamento multimodal

O pré-processamento multimodal converte imagens, áudio, vídeo e arquivos em texto antes que o modelo principal seja executado. Cada tipo de mídia usa seu próprio mecanismo: um modelo multimodal menor ou maior, OCR ou fala-para-texto.

Use-o quando o modelo principal for apenas texto, ou quando um modelo mais barato puder descrever a mídia uma vez e um modelo de texto mais forte puder raciocinar sobre a descrição. Não o use quando o modelo principal precisar ver a mídia original, como ao comparar detalhes visuais. Consulte [Pré-processamento multimodal](/docs/pt-br/inference/chat-completions/multimodal-pre-processing.md) para os mecanismos e sua cobrança.

## Conhecimento (RAG)

Um gateway pode vincular [coleções](/docs/pt-br/rag/collections.md) para que o modelo responda com base em seus documentos. O gateway controla o limite de resultados, pontuação mínima, reranker, comportamento de referência e estratégia de consulta. Escolha a estratégia pelo tipo de conversa:

- `Plain` pesquisa com a última mensagem do usuário. Use-o para perguntas isoladas.
- `Concatenate` junta mensagens recentes do usuário. Use-o quando os usuários dividem uma pergunta em várias mensagens.
- `UserRewrite` e `FullRewrite` reescrevem mensagens recentes em consultas de pesquisa com um modelo resolvedor. Use-os quando perguntas de acompanhamento dependem de rodadas anteriores, ao custo de uma inferência extra.
- `QueryFunction` dá ao modelo uma ferramenta de pesquisa para que ele decida quando pesquisar. Use-o quando muitas mensagens não precisarem de recuperação. Requer um modelo com chamada de ferramentas.

Consulte [RAG](/docs/pt-br/inference/pipelines.md#rag) para o comportamento completo.

## Ferramentas

Ferramentas permitem que o modelo aja e leia dados em tempo real. Um gateway pode expor vários tipos:

| Tipo | Executado por | Quando usar |
| --- | --- | --- |
| [Ferramentas integradas](/docs/pt-br/tools/builtin-tools.md) | AIVAX | Capacidades comuns: data e hora, pesquisa na web, abertura de URLs, código, memória e geração de imagem, documento ou página. |
| [Fontes MCP](/docs/pt-br/tools/mcp.md) | Seu servidor MCP, chamado pela AIVAX | Você já tem um servidor MCP ou um catálogo de ferramentas de negócios compartilhadas por vários agentes. |
| [Funções de protocolo](/docs/pt-br/tools/protocol-functions.md) | Seu callback HTTP, chamado pela AIVAX | Uma ou poucas ações específicas, sem executar um servidor MCP completo. |
| [Shell](/docs/pt-br/tools/shell.md) | Sandbox da AIVAX | Tarefas mais fáceis de expressar como comandos, ou muitas ferramentas movidas atrás de uma linha de comando. |
| `tools` brutos | Seu aplicativo cliente | O cliente deve executar a ação si mesmo; consulte [Ferramentas](/docs/pt-br/inference/chat-completions/tools.md). |

Ferramentas integradas, ferramentas MCP, funções de protocolo e o shell são ferramentas do lado do servidor: a AIVAX as executa durante a solicitação e retorna apenas a resposta final. Habilite apenas ferramentas com um papel claro e dê a elas nomes específicos e esquemas restritivos.

## Habilidades

[Habilidades](/docs/pt-br/inference/skills.md) são pacotes de instruções que o modelo carrega sob demanda. Use-as para procedimentos especializados que apenas algumas solicitações precisam, para que seu texto não ocupe as instruções do sistema de cada solicitação.

## Manipulador de ferramentas

O manipulador de ferramentas adiciona chamada de ferramentas para modelos que não produzem chamadas de ferramentas nativas confiáveis. `native` ou nenhum valor usa a chamada de ferramentas nativa do modelo; `react.v1.selfcall` usa um manipulador estilo ReAct.

Use o manipulador apenas quando um modelo que você deve usar falhar em chamar ferramentas nativamente. Modelos com chamada de ferramentas nativa são mais confiáveis sem ele.

## Explicações de ferramentas

`toolInvocationExplanations` pede ao modelo que explique cada chamada de ferramenta do lado do servidor com um motivo curto e objetivo, que a AIVAX retorna junto com o evento da ferramenta. Use-o quando o cliente mostrar a atividade da ferramenta aos usuários finais. Consulte [Explicações de ferramentas](/docs/pt-br/inference/response-rendering/tool-explanations.md).

## Moderação

A moderação de entrada avalia a conversa textual antes que o modelo principal seja executado e faz o modelo recusar solicitações que alcancem a sensibilidade configurada em uma categoria. Use-a para políticas de segurança amplas em assistentes voltados para o usuário. Ela não modera a saída ou mídia, e não é um mecanismo de autorização. Consulte [Moderação](/docs/pt-br/inference/pipelines.md#moderation).

## Workers

[Workers](/docs/pt-br/inference/workers.md) chamam seu endpoint durante eventos do gateway, para que seu código possa bloquear uma mensagem, reescrever o contexto, adicionar ferramentas ou substituir um resultado de ferramenta. Use-os quando uma decisão depender de dados que apenas seu sistema possui, como o estado da conta do usuário. O worker executa no caminho crítico, então mantenha-o rápido e determinístico.

## Fuso horário

`timeZone` define o fuso horário IANA que o modelo usa para ler e escrever datas. Ele se aplica a `get_date_time`, ferramentas de agendamento e o shell, e o padrão é `America/Sao_Paulo`. Defina-o para o fuso horário dos seus usuários; uma solicitação pode substituí-lo com `time_zone`.

## Preços

Um gateway não tem taxa separada. As solicitações são cobradas pelo modelo e pelos recursos que o gateway usa: tokens de inferência, reescrita ou inferências de pré-processamento, moderação, ferramentas e RAG. Consulte [Preços de inferência](/docs/pt-br/inference/chat-completions/concepts.md#pricing).
