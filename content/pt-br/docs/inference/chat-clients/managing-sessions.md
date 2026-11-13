---
{title: Gerenciando Sessões do Cliente de Chat,linkTitle: Gerenciando sessões,weight: 20,group: Chat Clients,sourceHash: 50e09f78a140a3c6,aliases: [/docs/pt-br/inference/chat-clients/managing-sessions.html]}
---

# Gerenciando sessões do cliente de chat

Uma sessão é uma única conversa entre um cliente de chat e um usuário final. Ela armazena o histórico de mensagens, o contexto da conversa, metadados, uma chave de acesso e uma `tag` opcional que identifica o usuário ou a conversa. As sessões expiram após um tempo configurado.

O cliente web e seu aplicativo criam sessões explicitamente por meio da API. [Integrações](integrations.md) as criam automaticamente, uma por conversa no aplicativo de mensagens.

## Criar uma sessão

Crie uma sessão a partir do seu servidor, com uma chave de API privada, quando um usuário iniciar uma conversa. Você pode fornecer contexto para toda a conversa, como o nome ou a localização do usuário.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A resposta contém:

- `sessionId`: o identificador da sessão, usado para gerenciá-la com sua chave de API.
- `accessKey`: a chave que autoriza [Enviar Prompt](web-client.md#sending-prompts-from-your-application) e as outras rotas públicas da sessão.
- `talkUrl`: o link para o [chat web hospedado](web-client.md) para esta sessão.

Qualquer pessoa com a chave de acesso ou o link pode usar a sessão. Forneça-os apenas ao usuário que possui a conversa e mantenha-os fora dos logs.

`expires` define a duração da sessão em segundos, contados a partir da criação ou atualização. Aceita valores de 600 segundos (10 minutos) até 7.776.000 segundos (90 dias) e o padrão é 3.600 segundos (uma hora).

## Identificar usuários com uma tag

Sem uma `tag`, cada sessão é uma conversa independente, acessível apenas por meio de sua chave de acesso.

Com uma `tag`, o AIVAX reutiliza a sessão ativa para essa tag em vez de criar uma nova. Criar uma sessão novamente com a mesma tag retorna a mesma sessão e mantém seu histórico de mensagens, mas substitui seu contexto, expiração e metadados pelos novos valores. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder a conversa.

A `tag` também conecta a sessão a outros recursos:

- [Memória](/docs/pt-br/tools/builtin-tools.md) precisa de um identificador estável para saber a quem pertence uma preferência salva.
- [Workers do Gateway](/docs/pt-br/inference/workers.md) e [funções de protocolo](/docs/pt-br/tools/protocol-functions.md) recebem esse valor como `externalUserId`, para aplicar regras por usuário, canal ou conta externa.
- Integrações usam o ID do chat ou número de telefone como a tag, para encontrar a sessão correta para cada conversa.

Escolha uma tag que seja estável, exclusiva por usuário ou conversa e não sensível, como um ID de usuário interno em vez de um endereço de e-mail.

## Token de conversa

Cada sessão possui um token de conversa que agrupa suas trocas em uma única [conversa](/docs/pt-br/inference/chat-completions/concepts.md) armazenada. O AIVAX cria e gerencia esse token; você nunca o envia, diferentemente do `conversation_token` em [reutilização de sessão](/docs/pt-br/inference/chat-completions/session-reuse.md).

O token é renovado quando a conversa é limpa, por meio do reset do chat web ou pelo comando `/reset` nas [integrações](integrations.md#commands). As mensagens seguintes são então registradas como uma nova conversa, embora a sessão e sua `tag` permaneçam as mesmas.

Você pode ler o token no transcript da sessão, e as [funções de protocolo](/docs/pt-br/tools/protocol-functions.md) e [ferramentas MCP](/docs/pt-br/tools/mcp.md) o recebem no contexto da chamada. Use-o para correlacionar chamadas da mesma conversa, não como prova de identidade ou permissão.

## Escolher onde colocar o contexto

O AIVAX aceita contexto em três lugares. Todos eles são adicionados às instruções do sistema da inferência, nesta ordem:

| Campo | Quando se aplica | Use para |
|---|---|---|
| `extraContext` (sessão) | Toda inferência na sessão. | Contexto para toda a conversa: o canal, o nome do usuário, plano, idioma preferido ou o produto sobre o qual a conversa versa. |
| `contextLocation` (sessão) | O AIVAX busca a URL antes de cada inferência e anexa seu conteúdo após o `extraContext`. | Contexto controlado pelo servidor que pode mudar durante a conversa, como o carrinho, o status de um pedido ou o registro aberto no seu aplicativo. |
| `instructions` ([Enviar Prompt](web-client.md#add-context-for-one-inference)) | Apenas nessa solicitação, anexado após o conteúdo do `contextLocation`. | Contexto para aquele momento, como um formato de resposta temporário ou o item que o usuário acabou de selecionar. |

Nenhum deles é salvo no histórico da sessão: o modelo vê a versão mais recente em cada solicitação. Como fazem parte das instruções do sistema, que iniciam cada solicitação, alterá-las invalida o cache de prompts para todo o histórico.

Mantenha o `extraContext` estável durante a conversa. Cada alteração nele, ou no conteúdo retornado por `contextLocation`, invalida o cache de prompts para todo o histórico, o que aumenta a latência e o custo de entrada na próxima solicitação. Para informações que mudam a cada solicitação ou que não são texto, use o campo `context` do Enviar Prompt: ele vai para a última mensagem do usuário em vez das instruções do sistema, assim o histórico em cache antes dessa mensagem é mantido. Veja [Adicionar contexto descartável à última mensagem do usuário](web-client.md#add-disposable-context-to-the-last-user-message).

A mesma regra se aplica às integrações de canais: Telegram e WhatsApp colocam seu contexto fixo do canal, como regras de formatação e o nome de exibição do usuário, no `extraContext` da sessão.

Não coloque segredos, tokens internos ou dados que o modelo não deve ver em nenhum desses campos. Eles são enviados ao modelo e podem influenciar respostas, ferramentas e workers. Certifique-se de que a URL do `contextLocation` seja acessível pelo AIVAX; quando não puder ser carregada, a inferência continua sem ela e um aviso é adicionado aos logs da conta.

## Listar e encerrar sessões

Para revisar as sessões de um cliente de chat, com suas tags, carimbos de data/hora e contagens de mensagens e tokens, use **Listar Sessões de Chat Web** na referência da API.

Para encerrar uma sessão antes que ela expire, use **Excluir Sessão de Chat Web**. Sua chave de acesso e link param de funcionar imediatamente.
