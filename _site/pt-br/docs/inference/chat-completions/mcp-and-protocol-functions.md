Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/mcp-and-protocol-functions.html

# MCP e funções de protocolo na inferência

As ferramentas MCP e as funções de protocolo são ferramentas do lado do servidor que chamam seus sistemas. O AIVAX lista ou carrega suas definições, as oferece ao modelo e chama seu servidor quando o modelo seleciona uma delas. Seu aplicativo cliente não as executa e não vê suas chamadas como mensagens.

| | [Fontes MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) | [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) |
| --- | --- | --- |
| O que você executa | Um servidor MCP com HTTP Streamable | Um endpoint HTTP por função, ou uma URL de fonte que lista funções |
| Definições de ferramentas | Descobertas a partir da lista de ferramentas do servidor | Declaradas no gateway, ou retornadas por uma fonte de função |
| Resultados | Texto, imagens e áudio | Texto |
| Melhor para | Catálogos de ferramentas, sistemas que já falam MCP, ferramentas compartilhadas por vários agentes | Uma ou poucas ações específicas |

## Onde configurá-los

As fontes MCP e as funções de protocolo são configuradas em um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#tools). A solicitação `chat/completions` não possui campo para adicioná-los, portanto, chame o gateway por seu ID ou slug para usá-los.

Um [worker](https://docs.aivax.net/pt-br/docs/inference/workers.md) pode adicionar uma fonte MCP ou uma ferramenta para uma única solicitação durante o evento `message.received`. Use-o quando as ferramentas disponíveis dependerem do usuário, como ferramentas vinculadas à conta do usuário.

## O que acontece durante a solicitação

1. Antes que o modelo seja executado, o AIVAX carrega as definições das ferramentas. As listas de ferramentas MCP e as fontes de função são armazenadas em cache; consulte [Armazenamento em cache](https://docs.aivax.net/pt-br/docs/inference/chat-completions/caching.md#remote-definitions).
2. Quando o modelo chama uma dessas ferramentas, o AIVAX chama seu servidor com os argumentos.
3. O resultado é adicionado à conversa e o modelo continua.
4. Com streaming, cada chamada produz eventos `servertool` com os estados `Created`, seguidos por `Completed` ou `Failed`; consulte [Streaming](https://docs.aivax.net/pt-br/docs/inference/chat-completions/streaming.md#server-side-tool-events).

As chamadas de ferramentas e os resultados não são retornados como mensagens. Envie o mesmo `conversation_token` na próxima rodada para que o modelo mantenha seus resultados; consulte [Contexto do lado do servidor](https://docs.aivax.net/pt-br/docs/inference/chat-completions/server-side-context.md).

Retorne texto de erro claro de sua ferramenta quando uma ação não puder ser concluída, para que o modelo possa explicar a falha ou tentar outro caminho. Um [worker](https://docs.aivax.net/pt-br/docs/inference/workers.md) pode substituir o resultado de uma chamada de ferramenta através do evento `tool.called`.

## Chaves públicas

Solicitações autenticadas com uma chave de API pública não usam as fontes MCP ou funções de protocolo do gateway. Chame um gateway com essas ferramentas do seu servidor usando uma chave privada, ou por meio de um [cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md).
