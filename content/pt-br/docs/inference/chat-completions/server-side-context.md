---
{title: Contexto do lado do servidor,linkTitle: Contexto do lado do servidor,weight: 20,group: Inference,sourceHash: f96c9a2e8a97f731,aliases: [/docs/pt-br/inference/chat-completions/server-side-context.html]}
---

# Contexto do lado do servidor

`chat/completions` é sem estado: cada solicitação carrega a conversa que precisa, e o AIVAX não mantém um histórico de mensagens para você. No entanto, parte do contexto com o qual o modelo trabalha é criada ou adicionada no servidor e nunca aparece nas mensagens que você envia ou recebe. Esta página explica qual é esse contexto, para que você possa prever o que o modelo vê.

## O que o AIVAX adiciona antes da execução do modelo

Antes de cada geração, o AIVAX pode adicionar contexto que sua solicitação não continha:

| Contexto | Fonte | Retornado para você |
| --- | --- | --- |
| Instruções do sistema e fontes de instruções remotas | [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md#instructions) | Não |
| Documentos recuperados | Coleções [RAG](/docs/pt-br/inference/chat-completions/processing-pipeline.md#rag) do Gateway | Não, a menos que o modelo as cite |
| Instruções de habilidades | [Skills](/docs/pt-br/inference/skills.md) que o modelo carrega | Não |
| Definições de ferramentas | Ferramentas do Gateway, fontes MCP, funções de protocolo, `builtin_tools` | Não |
| Descrições de mídia | [Pré-processamento multimodal](multimodal-pre-processing.md) | Não |
| Contexto adicionado por um worker | [Workers](/docs/pt-br/inference/workers.md) | Não |

Este contexto é reconstruído em cada solicitação com base na configuração atual do gateway. Alterar o gateway altera a próxima solicitação; ele não reescreve respostas anteriores.

## O que o AIVAX cria durante a solicitação

Quando o modelo chama uma [ferramenta do lado do servidor](mcp-and-protocol-functions.md), o AIVAX a executa e adiciona a chamada e seu resultado à conversa antes de gerar novamente. Uma única solicitação pode conter muitas dessas etapas. A resposta retorna apenas a mensagem final do assistente, com o texto de todas as etapas unidas; as chamadas de ferramenta e seus resultados não são retornados como mensagens.

Com streaming, você pode observar essas etapas conforme acontecem através dos eventos `servertool` e reasoning, mas elas ainda não fazem parte das `messages` finais que você enviaria de volta. Consulte [Streaming](streaming.md).

## Manter o contexto entre rodadas

Como as chamadas de ferramenta e seus resultados não são retornados, o histórico que você envia na próxima rodada os falta. Sem eles, o modelo pode perder dados que já obteve e chamar as mesmas ferramentas novamente.

Envie o mesmo `conversation_token` em cada solicitação da conversa, e o AIVAX restaurará essas chamadas de ferramenta e resultados no histórico antes da execução do modelo. O estado restaurado expira uma hora após seu último uso. Consulte [Reutilização de sessão](session-reuse.md) para as regras do token e como o AIVAX corresponde às rodadas armazenadas.

Ferramentas do lado do cliente são diferentes: suas chamadas são retornadas para você, e seu aplicativo envia seus resultados de volta como mensagens `tool`, portanto, elas sempre fazem parte do histórico que você controla. Consulte [Ferramentas](tools.md).

## O que não é mantido

- **O histórico de mensagens.** Seu aplicativo o armazena e o envia em cada solicitação. Se o AIVAX deve armazená-lo, use uma [sessão de cliente de chat](/docs/pt-br/inference/chat-clients.md).
- **Reasoning (Raciocínio).** A reutilização de sessão restaura chamadas de ferramenta e resultados, não reasoning. Envie de volta a resposta final do assistente, não o transcript do raciocínio; consulte [Exemplo bruto de múltiplas rodadas](/docs/pt-br/inference/response-rendering/raw-multi-turn-example.md).
- **Memória de longo prazo.** Fatos que o assistente deve lembrar entre conversas exigem a [ferramenta de memória](/docs/pt-br/tools/builtin-tools.md#memory).

## Registros de conversa

Quando o registro de conversas está habilitado, o AIVAX armazena um registro da conversa para observabilidade, e solicitações com o mesmo `conversation_token` atualizam o mesmo registro. Este registro é para inspeção e auditoria; ele não é usado como contexto para solicitações posteriores. Consulte [Registros de resposta e conversa](concepts.md#response-and-conversation-records).
