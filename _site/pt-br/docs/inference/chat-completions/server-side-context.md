Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/server-side-context.html

# Contexto do lado do servidor

`chat/completions` é sem estado: cada solicitação carrega a conversa que precisa, e o AIVAX não mantém um histórico de mensagens para você. No entanto, parte do contexto com o qual o modelo trabalha é criada ou adicionada no servidor e nunca aparece nas mensagens que você envia ou recebe. Esta página explica qual é esse contexto, para que você possa prever o que o modelo vê.

## O que o AIVAX adiciona antes da execução do modelo

Antes de cada geração, o AIVAX pode adicionar contexto que sua solicitação não continha:

| Contexto | Fonte | Retornado para você |
| --- | --- | --- |
| Instruções do sistema e fontes de instruções remotas | [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#instructions) | Não |
| Documentos recuperados | Coleções [RAG](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md#rag) do Gateway | Não, a menos que o modelo as cite |
| Instruções de habilidades | [Skills](https://docs.aivax.net/pt-br/docs/inference/skills.md) que o modelo carrega | Não |
| Definições de ferramentas | Ferramentas do Gateway, fontes MCP, funções de protocolo, `builtin_tools` | Não |
| Descrições de mídia | [Pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md) | Não |
| Contexto adicionado por um worker | [Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) | Não |

Este contexto é reconstruído em cada solicitação a partir da configuração atual do gateway. Alterar o gateway altera a próxima solicitação; ele não reescreve respostas anteriores.

## O que o AIVAX cria durante a solicitação

Quando o modelo chama uma [ferramenta do lado do servidor](https://docs.aivax.net/pt-br/docs/inference/chat-completions/mcp-and-protocol-functions.md), o AIVAX a executa e adiciona a chamada e seu resultado à conversa antes de gerar novamente. Uma única solicitação pode conter muitas dessas etapas. A resposta retorna apenas a mensagem final do assistente, com o texto de todas as etapas unidas; as chamadas de ferramenta e seus resultados não são retornados como mensagens.

Com streaming, você pode observar essas etapas conforme elas acontecem através dos eventos `servertool` e reasoning, mas eles ainda não fazem parte das `messages` finais que você enviaria de volta. Consulte [Streaming](https://docs.aivax.net/pt-br/docs/inference/chat-completions/streaming.md).

## Manter o contexto entre rodadas

Como as chamadas de ferramenta e seus resultados não são retornados, o histórico que você envia na próxima rodada os falta. Sem eles, o modelo pode perder dados que já obteve e chamar as mesmas ferramentas novamente.

Envie o mesmo `conversation_token` em cada solicitação da conversa, e o AIVAX restaurará essas chamadas de ferramenta e resultados no histórico antes da execução do modelo. O estado restaurado expira uma hora após seu último uso. Consulte [Reutilização de sessão](https://docs.aivax.net/pt-br/docs/inference/chat-completions/session-reuse.md) para as regras do token e como o AIVAX corresponde às rodadas armazenadas.

Ferramentas do lado do cliente são diferentes: suas chamadas são retornadas para você, e seu aplicativo envia seus resultados de volta como mensagens `tool`, então elas sempre fazem parte do histórico que você controla. Consulte [Tools](https://docs.aivax.net/pt-br/docs/inference/chat-completions/tools.md).

## O que não é mantido

- **O histórico de mensagens.** Seu aplicativo o armazena e o envia em cada solicitação. Se o AIVAX deve armazená-lo, use uma [sessão de cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md).
- **Reasoning.** A reutilização de sessão restaura chamadas de ferramenta e resultados, não reasoning. Envie de volta a resposta final do assistente, não o transcript de reasoning; consulte [Exemplo bruto de múltiplas rodadas](https://docs.aivax.net/pt-br/docs/inference/response-rendering/raw-multi-turn-example.md).
- **Memória de longo prazo.** Fatos que o assistente deve lembrar entre conversas requerem a [ferramenta de memória](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory).

## Registros de conversa

Quando o registro de conversas está habilitado, o AIVAX armazena um registro da conversa para observabilidade, e solicitações com o mesmo `conversation_token` atualizam o mesmo registro. Este registro é para inspeção e auditoria; ele não é usado como contexto para solicitações posteriores. Consulte [Registros de resposta e conversa](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#response-and-conversation-records).
