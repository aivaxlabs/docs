Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.html

# Visão geral dos clientes de chat

Um cliente de chat publica uma [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) para os usuários finais. Ele oferece um local para conversar com o assistente — seja um chat web hospedado, seu próprio aplicativo, Telegram ou WhatsApp — enquanto a gateway continua respondendo com seu modelo, instruções, ferramentas e conhecimento. Os clientes de chat suportam conversas por texto, raciocínio profundo (deep thinking), busca e envio de imagens. As funcionalidades de áudio dependem do canal e da configuração do cliente.

## Como funciona um cliente de chat

Um cliente de chat é uma camada de sessão sobre uma AI Gateway. Eles têm funções separadas:

- **A AI Gateway** define o que o assistente faz: modelo, instruções, ferramentas, RAG e habilidades.
- **O cliente de chat** define como os usuários finais acessam o assistente: como uma conversa é identificada, quanto tempo ela dura, quais limites se aplicam, qual é a aparência da interface e como as mensagens entram e saem em cada canal.

Devido a essa divisão, uma única gateway pode atender uma API interna, um widget web, Telegram e WhatsApp simultaneamente. Cada canal mantém suas próprias regras para identidade, anexos, formatação, comandos e entrega de mensagens.

Cada conversa é uma [sessão](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md). Uma sessão armazena o histórico de mensagens, o contexto da conversa e metadados, expirando após um tempo configurado.

## Escolha um canal

| Canal | Use-o quando | Guia |
|---|---|---|
| Cliente Web | Você deseja incorporar o assistente em um site, produto, centro de suporte ou painel, ou chamá-lo a partir do seu próprio aplicativo. | [Cliente Web](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md) |
| Telegram | Você precisa de um bot simples com usuários identificados por chat e comandos fáceis de testar. | [Integrações](https://docs.aivax.net/pt-br/docs/inference/chat-clients/integrations.md) |
| WhatsApp | O principal canal de suporte dos seus usuários já é o telefone, através da Z-API, Evolution API ou Kapso. | [Integrações](https://docs.aivax.net/pt-br/docs/inference/chat-clients/integrations.md) |

O canal não deve alterar o que a gateway sabe ou faz. Ainda assim, pode ser necessário ajustar tom, comprimento da resposta, formatação e os anexos aceitos.

## Criar um cliente de chat

Crie o cliente de chat, vincule-o a uma AI Gateway e configure seus limites, interface e integrações. Você pode fazer isso no painel ou por meio da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Client)

Para alterar um cliente existente, use **Editar Cliente de Chat Web** na referência da API. Envie apenas os campos que deseja atualizar; os campos omitidos mantêm seus valores atuais.

As opções que são durações, como `messageDebounceInterval`, `maxScheduledIgnoredZone` e a `sessionDuration` das integrações, são números de segundos.

## Limites

Dois limites se aplicam a todas as sessões do cliente de chat, em todos os canais:

| Limite | Padrão | O que acontece ao atingi-lo |
|---|---|---|
| `messagesPerHour` | 20 | Novas mensagens dessa sessão são rejeitadas até que a janela de uma hora permita novamente. |
| `maxMessages` | 500 | A sessão não pode receber mais mensagens, e o usuário deve iniciar uma nova conversa. |

No cliente web, uma mensagem rejeitada retorna um erro. Nas integrações, o usuário recebe uma mensagem do sistema no chat explicando o limite.

Defina ambos deliberadamente. Valores muito permissivos aumentam o custo e a exposição a abusos; valores muito restritivos prejudicam a experiência do usuário.

## Antes de ir para o público

- Revise a configuração da gateway e do cliente de chat, e teste o canal com uma mensagem simples primeiro.
- Mantenha as chaves de API no seu servidor. Os usuários finais recebem apenas a chave de acesso à sessão ou o link, nunca suas credenciais de conta. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para entender a distinção entre acesso ao chat público e credenciais de API.
- Se a gateway usar memória persistente, explique aos usuários o que ela armazena. A memória é separada do histórico da sessão: ela sobrevive à sessão e está vinculada à tag da sessão. Consulte [o guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) para revisar o contexto armazenado e testar sua influência em várias conversas.
- Quando um canal não responde conforme o esperado, verifique a gateway vinculada e a configuração da integração, depois tente novamente com uma mensagem simples antes de investigar recursos opcionais.

## Próximos passos

- [Gerenciando sessões](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md): crie sessões, identifique usuários e escolha onde colocar o contexto.
- [Cliente Web](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md): personalize e incorpore o chat hospedado, ou envie prompts a partir do seu aplicativo.
- [Integrações](https://docs.aivax.net/pt-br/docs/inference/chat-clients/integrations.md): conecte Telegram e WhatsApp.
