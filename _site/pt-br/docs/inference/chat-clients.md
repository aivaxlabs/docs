Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients.html

# Clientes de Chat

Um cliente de chat oferece aos usuários finais uma interface para conversar com um assistente alimentado por um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Ele é executado na inferência do gateway e suporta pensamento profundo, pesquisa, conversas por texto e envio de imagens. As funcionalidades de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do cliente de chat com CSS, JavaScript personalizado, cores, rótulos, botões de sugestão, origens de frame, modos de entrada e o idioma usado pelos recursos do chat.

## Como funciona o cliente de chat

Um cliente de chat é uma camada de sessão sobre um Gateway de IA. O gateway define o comportamento do assistente; o cliente de chat define como um usuário final conversa com ele, como a sessão é identificada, quanto tempo ela dura, quais limites são aplicados, quais recursos visuais aparecem e como as mensagens entram e saem através de canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, um widget web, Telegram e WhatsApp, mas cada canal terá suas próprias regras para identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém um histórico de mensagens, contexto adicional, metadados, token de conversa e um identificador externo opcional. Ao criar uma sessão com uma `tag`, o AIVAX tenta reutilizar a sessão ativa para essa tag em vez de criar uma nova conversa. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder imediatamente o contexto. Quando a sessão não possui `tag`, ela funciona como uma conversa independente controlada pelo token de acesso gerado na criação.

A `tag` também serve como o ponto de conexão entre o cliente de chat, memória, workers e integrações. Ferramentas como a memória precisam de um identificador estável para saber a quem pertencem uma preferência ou informação persistente. Os workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. As integrações do WhatsApp e do Telegram usam o ID da conversa, número de telefone ou usuário para recuperar a sessão correta. Portanto, escolha uma `tag` estável, não sensível e única por usuário ou conversa.

## Criando uma sessão de chat

Uma sessão de chat representa uma conversa entre seu cliente de chat e um usuário final. Ao criá-la, você pode fornecer contexto adicional para a conversa, como o nome ou a localização do usuário.

Uma sessão pode ser identificada por uma tag estável e não sensível para que o cliente possa continuar a conversa apropriada. Consulte a Referência da API embutida para ver o comportamento e a configuração suportados da sessão.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

Ao criar uma sessão, use `extraContext` para informações que ajudam o assistente naquela conversa, mas que não devem se tornar memória permanente: nome exibido, plano do cliente, idioma preferido, página de referência, produto que o usuário está visualizando, número do pedido ou estado atual do fluxo. Não use este campo para segredos, tokens internos ou dados que o modelo não deve ver. O contexto adicional entra na inferência e pode influenciar respostas, ferramentas e workers.

Você também pode fornecer `contextLocation`, uma URL que o AIVAX carrega durante a geração de resposta e anexa ao contexto da sessão. Use-a para contexto controlado pelo servidor que pode mudar ao longo do tempo e certifique-se de que a URL seja acessível pelo AIVAX.

O chat web aceita mensagens de texto e anexos. Imagens, arquivos, vídeos e áudio são materializados antes da inferência; os tipos suportados de imagem, arquivo, vídeo e áudio podem ser encaminhados como conteúdo multimodal quando o modelo selecionado e a configuração do gateway os suportam. O áudio também pode ser sintetizado como resposta quando a configuração de síntese de áudio do cliente de chat estiver ativa. Quando um canal não pode incorporar um anexo, o AIVAX converte o conteúdo não suportado em um aviso de anexo textual para que o assistente possa responder claramente.

## Enviando prompts do seu aplicativo

Use **Enviar Prompt** quando seu aplicativo precisar de uma resposta síncrona usando uma sessão de cliente de chat existente. A chave de acesso à sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração associada do Gateway de IA.

Para inferências de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o tempo limite do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API de cliente de chat; consulte [endpoints disponíveis no host direto](https://docs.aivax.net/pt-br/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Escolha o formato de entrada

O `prompt` obrigatório aceita texto simples, um objeto de mensagem compatível com OpenAI ou uma matriz ordenada de objetos de mensagem. Texto simples torna-se uma mensagem do usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e uma matriz quando várias mensagens precisarem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para seu aplicativo executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas nem o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`, não uma concatenação da virada: após uma chamada de ferramenta, ele contém apenas a resposta final. Ele retorna ao texto de inferência acumulado quando a última mensagem do assistente está ausente ou vazia, portanto, uma virada apenas de chamada de ferramenta pode retornar um `completionText` vazio — verifique `toolCalls` para decidir se deve continuar.

### Decida se deseja salvar a virada

`commit` padrão é `true`: as mensagens enviadas e as mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar essa virada. Você ainda recebe a conclusão e `createdMessages`.

Esta não é uma simulação (dry run): a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não comprometidas ficam fora do histórico posterior da sessão — para continuar esse ramo, reenvie-as em uma matriz `prompt` ordenada.

### Adicionar contexto para uma inferência

Use `instructions` para contexto que deve se aplicar apenas à solicitação atual, como um formato de resposta temporário ou o item atualmente selecionado em seu aplicativo. Ele aceita uma string ou uma matriz de strings; as entradas da matriz são unidas com linhas em branco. Este contexto é anexado após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Diferente do `extraContext` da sessão, `instructions` não é salvo como contexto da sessão, mesmo quando `commit` é `true`. Ele ainda é enviado ao modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deve ver.

### Completar chamadas de ferramentas do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no Gateway de IA e envie um prompt.
2. Quando `toolCalls` for diferente de vazio, execute a função solicitada em seu aplicativo. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e aplique as permissões do seu aplicativo antes da execução.
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` para o `id` da chamada retornada, `name` para seu `functionName` e `content` para o resultado da ferramenta como texto. Para múltiplas chamadas, envie uma matriz de mensagens de resultado correspondentes.
4. Leia a próxima conclusão ou repita se ela solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados das ferramentas, sem duplicar essa mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de nível superior `toolCalls` não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir essa troca.

Para ferramentas do lado do servidor, o AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode, portanto, conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência da API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados do lado do cliente enviados e múltiplas mensagens de chamada do lado do servidor.

## Sessões de integração

O AIVAX fornece integrações para clientes de chat via Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa, ID do chat ou número de telefone do usuário, dependendo do provedor. Sessões de integração têm por padrão uma duração de três horas, a menos que os parâmetros de integração especifiquem outro valor.

Essas sessões obedecem às regras originais do cliente de chat. Além disso, sessões de chat nessas integrações possuem dois comandos especiais:

- `/reset`: limpa o contexto da sessão atual.
- `/usage`: quando `debug` está ativo no cliente de chat, exibe o uso atual do chat em tokens.

As integrações tratam o canal como a fonte das mensagens, mas a inferência continua sendo realizada pelo Gateway de IA associado ao cliente de chat. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor tem seus próprios detalhes de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para o mesmo objetivo operacional. Em todos os casos, as mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com inferência e a resposta do assistente é enviada de volta por meio do messenger da integração.

Use o Telegram quando você precisar de um bot simples com usuários identificáveis por chat e comandos fáceis de testar. Use o WhatsApp quando o canal principal de suporte do usuário já for o telefone e a conversa precisar acontecer em um aplicativo diário. Use o widget web quando quiser incorporar o assistente em um site, produto, centro de suporte ou painel. A escolha do canal não deve alterar o conteúdo essencial do gateway, mas pode exigir ajustes no tom, tamanho da resposta, formatação e tolerância a anexos.

Antes de abrir um canal para o público, revise a configuração do cliente de chat e explique o comportamento da memória aos usuários quando aplicável. Quando uma integração não responde conforme o esperado, verifique primeiro a configuração do gateway e da integração associados, depois tente novamente com uma mensagem simples antes de investigar recursos opcionais.

Trate a memória persistente separadamente do histórico da sessão. Consulte [o guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) para revisar o contexto armazenado e testar sua influência em todas as conversas.

Para os próximos passos, revise [Configuração do Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md), especialmente a fronteira entre o acesso de chat público e as credenciais de API.
