---
{title: Reutilização de Sessão,linkTitle: Reutilização de sessão,weight: 30,group: Inference,sourceHash: dc81ab36d624694f,aliases: [/docs/pt-br/inference/chat-completions/session-reuse.html]}
---

# Reutilização de sessão

A reutilização de sessão permite que um cliente `chat/completions` sem estado mantenha o contexto do lado do servidor de uma conversa entre as solicitações. Seu aplicativo ainda armazena e envia o histórico de mensagens; a AIVAX apenas restaura o que o histórico não consegue transportar. Para saber o que esse contexto contém, consulte [Contexto do lado do servidor](server-side-context.md).

## Reutilização de sessão e sessões de clientes de chat

A AIVAX possui dois recursos com "sessão" no nome. Eles resolvem problemas diferentes:

| | Reutilização de sessão (`conversation_token`) | [Sessão de cliente de chat](/docs/pt-br/inference/chat-clients/managing-sessions.md) |
| --- | --- | --- |
| Quem armazena o histórico de mensagens | Seu aplicativo. Ele envia o histórico completo em cada solicitação. | AIVAX. O cliente envia apenas a nova mensagem. |
| O que a AIVAX mantém | Chamadas de ferramentas e resultados das rodadas recentes do lado do servidor, por uma hora após o último uso. | Toda a conversa, contexto, metadados e limites, até que a sessão expire. |
| Endpoint | `/v1/chat/completions` | Endpoints de sessão de cliente de chat, widget da web e integrações de mensagens. |
| Identidade | Um token opaco escolhido por você ou retornado pela AIVAX. | Uma chave de acesso à sessão, opcionalmente vinculada a uma tag de usuário estável. |
| Melhor para | Back-ends, agentes e integrações de SDK que já gerenciam conversas. | Chats de usuários finais em navegadores, WhatsApp ou Telegram, onde a AIVAX gerencia a conversa. |

Uma sessão de cliente de chat gerencia seu próprio token de conversa internamente; você não envia `conversation_token` para ela. Use a reutilização de sessão quando seu aplicativo for proprietário do histórico, e use um cliente de chat quando a AIVAX deve ser proprietária dele.

## Enviar o token

Envie `conversation_token` em todas as solicitações da mesma conversa. A AIVAX o usa para restaurar o que aconteceu no lado do servidor nas rodadas anteriores e para atualizar um único registro de conversa armazenado, em vez de criar um novo para cada solicitação.

Ferramentas do lado do servidor, como [ferramentas integradas](/docs/pt-br/tools/builtin-tools), ferramentas MCP e funções de protocolo, são executadas dentro da AIVAX. Suas chamadas e resultados não são retornados a você como mensagens: a resposta contém apenas a mensagem final do assistente, com o texto de cada etapa unido. Quando você envia o histórico da conversa de volta, essas chamadas de ferramentas e resultados estão ausentes. Com o mesmo `conversation_token`, a AIVAX os insere novamente no histórico antes que o modelo seja executado, para que o modelo ainda veja os dados retornados por suas ferramentas e não repita as mesmas chamadas.

```json
{
    "model": "your-model-or-gateway-id",
    "conversation_token": "support-ticket-1042",
    "messages": [
        {
            "role": "user",
            "content": "What is the status of order 123?"
        },
        {
            "id": "aivx_k2m9x0q4tr",
            "role": "assistant",
            "content": "Order 123 was shipped yesterday and should arrive on Friday."
        },
        {
            "role": "user",
            "content": "Can you change the delivery address?"
        }
    ]
}
```

Você pode criar o token você mesmo e enviá-lo a partir da primeira solicitação da conversa; você não precisa esperar que a AIVAX retorne um. Qualquer string não vazia com 128 caracteres ou menos é aceita, sem formato obrigatório, como o ID que seu aplicativo já usa para a conversa. Os tokens são limitados à sua conta, então outra conta pode usar o mesmo valor sem compartilhar estado com o seu. Quando omitido, a AIVAX gera um token e o retorna, e você pode reutilizar o valor retornado a partir da segunda solicitação.

Cada resposta retorna dois valores:

| Campo | Onde | Uso |
| --- | --- | --- |
| `conversation_token` | Raiz da resposta. Ao transmitir (streaming), o último chunk antes de `[DONE]`. | Envie-o na próxima solicitação da conversa. |
| ID da mensagem (`aivx_...`) | O `id` da resposta e `choices[].message.id`. Ao transmitir, o `id` de cada chunk, incluindo chunks de ferramenta e erro. | Recomendado. Armazene-o com a mensagem do assistente e envie-o de volta como o `id` dessa mensagem. |

A AIVAX corresponde às mensagens do assistente que você envia de volta às suas rodadas armazenadas nesta ordem:

1. O `id` da mensagem do assistente, quando você o envia.
2. Os IDs das chamadas de ferramentas que ele carrega, quando a rodada também solicitou ferramentas do seu cliente.
3. O texto da mensagem, dentro do mesmo `conversation_token`.

A correspondência por `id` é a mais confiável. A correspondência por texto é um fallback para clientes que descartam o `id`, e pode falhar sem um erro, por exemplo, quando o texto foi alterado ou quando duas respostas na mesma conversa têm o mesmo texto. Quando nenhuma correspondência é encontrada, a mensagem é usada exatamente como você a enviou.

## Requisitos do cliente

- **Use um token por conversa.** Reutilizar um token entre conversas, usuários ou ramificações diferentes pode restaurar resultados de ferramentas de outra conversa. Gere um novo token quando uma nova conversa começar e não use valores que os usuários possam adivinhar ou escolher.
- **Não compartilhe tokens entre usuários finais.** O token não é uma credencial, mas qualquer pessoa que possa chamar sua conta com ele pode continuar o contexto armazenado dessa conversa.
- **Armazene e reenvie o `id` da mensagem.** Salve o ID `aivx_...` de cada mensagem do assistente que você receber e envie-o de volta como o `id` dessa mensagem em solicitações posteriores. Esta é a maneira recomendada de restaurar uma rodada e continua funcionando quando o texto sozinho não pode identificá-la.
- **Reenvie exatamente o conteúdo retornado pela AIVAX.** Mantenha o texto completo de cada mensagem do assistente conforme você a recebeu, incluindo o texto que o modelo escreveu antes de chamar ferramentas, unido em uma única mensagem do assistente. Não divida-a em várias mensagens, remova partes dela ou reescreva, traduza ou resuma-a. A correspondência por texto ignora apenas espaços em branco. Quando `rendering_mode` é `textual_blocks`, o conteúdo mistura blocos de raciocínio e resposta, portanto, apenas o `id` pode identificar a rodada.
- **Preserve os IDs de chamada de ferramentas.** Quando uma resposta solicitar ferramentas do seu cliente, reenvie os mesmos valores de `tool_calls[].id` e responda a cada um com uma mensagem `tool`.
- **Gerencie o estado expirado.** O estado do lado do servidor de uma rodada expira após uma hora sem uso. Após isso, ou quando não puder ser encontrado, a conversa continua normalmente, mas o modelo já não vê os resultados dessas ferramentas do lado do servidor anteriores.
- **Não reenvie ferramentas restauradas você mesmo.** Você não precisa reconstruir chamadas de ferramentas ou resultados do lado do servidor. Se seu histórico já contiver eles com os mesmos IDs, a AIVAX não os adicionará novamente.

`idempotency_key` é um alias obsoleto de `conversation_token`. Ainda funciona, mas novas integrações devem usar `conversation_token`. Quando ambos são enviados, eles devem ter o mesmo valor; caso contrário, a solicitação falha com `400 Bad Request`.

Para manter o estado da conversa em sua aplicação e a configuração do gateway na AIVAX, consulte [migrando threads de Assistants para Responses](https://aivax.net/blog/migrating-from-openai-assistants-without-rebuilding-the-same-coupling/).
