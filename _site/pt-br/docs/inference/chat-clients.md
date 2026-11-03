Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients.html

# Clientes de Chat

Um cliente de chat fornece aos usuários finais uma interface para conversar com um assistente alimentado por um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md). Ele roda na inferência do gateway e suporta pensamento profundo, busca, conversa em texto e envio de imagens. Os recursos de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do cliente de chat com CSS, JavaScript personalizado, cores, rótulos, botões de sugestão, origens de quadros, modos de entrada e o idioma usado pelos recursos do chat.

## Como funciona o cliente de chat

Um cliente de chat é uma camada de sessão sobre um gateway de IA. O gateway define o comportamento do assistente; o cliente de chat define como um usuário final conversa com ele, como a sessão é identificada, quanto tempo dura, quais limites são aplicados, quais recursos visuais aparecem e como as mensagens entram e saem por canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, um widget web, Telegram e WhatsApp, mas cada canal terá suas próprias regras de identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém um histórico de mensagens, contexto adicional, metadados, token de conversa e um identificador externo opcional. Quando você cria uma sessão com um `tag`, a AIVAX tenta reutilizar a sessão ativa para esse `tag` em vez de criar uma nova conversa. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder o contexto imediatamente. Quando a sessão não tem `tag`, ela funciona como uma conversa independente controlada pelo token de acesso gerado na criação.

O `tag` também serve como ponto de conexão entre o cliente de chat, memória, workers e integrações. Ferramentas como memória precisam de um identificador estável para saber a quem uma preferência ou informação persistente pertence. Workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. As integrações do WhatsApp e Telegram usam o ID da conversa, número de telefone ou usuário para recuperar a sessão correta. Portanto, escolha um `tag` estável, não sensível e único por usuário ou conversa.

## Criando uma sessão de chat

Uma sessão de chat representa uma conversa entre seu cliente de chat e um usuário final. Quando você a cria, pode fornecer contexto adicional para a conversa, como o nome ou a localização do usuário.

Uma sessão pode ser identificada com um `tag` estável e não sensível para que o cliente possa continuar a conversa apropriada. Consulte a Referência de API incorporada para o comportamento e configuração de sessão suportados.

Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

Ao criar uma sessão, use `extraContext` para informações que ajudam o assistente nessa conversa, mas não devem se tornar memória permanente: nome exibido, plano do cliente, idioma preferido, página de referência, produto que o usuário está visualizando, número do pedido ou estado atual do fluxo. Não use este campo para segredos, tokens internos ou dados que o modelo não deve ver. O contexto adicional vai para a inferência e pode influenciar respostas, ferramentas e workers.

Você também pode fornecer `contextLocation`, uma URL que a AIVAX carrega durante a geração da resposta e anexa ao contexto da sessão. Use-a para contexto controlado pelo servidor que pode mudar ao longo do tempo e certifique-se de que a URL seja acessível pela AIVAX.

O chat web aceita mensagens de texto e anexos. Imagens, arquivos, vídeos e áudio são materializados antes da inferência; tipos suportados de imagem, arquivo, vídeo e áudio podem ser encaminhados como conteúdo multimodal quando o modelo selecionado e a configuração do gateway o suportam. O áudio também pode ser sintetizado como resposta quando a configuração de síntese de áudio do cliente de chat está ativa. Quando um canal não pode incorporar um anexo, a AIVAX converte o conteúdo não suportado em um aviso textual de anexo para que o assistente possa responder claramente.

## Enviando prompts da sua aplicação

Use **Send Prompt** quando sua aplicação precisa de uma resposta síncrona usando uma sessão de cliente de chat existente. A chave de acesso da sessão autoriza a requisição; mantenha-a privada. A requisição usa o histórico da sessão e a configuração do gateway de IA associado.

Para inferência de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o tempo limite do cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API de cliente de chat; veja [pontos de extremidade disponíveis no host direto](https://docs.aivax.net/pt-br/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Escolha o formato de entrada

O `prompt` requerido aceita texto simples, um objeto de mensagem compatível com OpenAI ou um array ordenado de objetos de mensagem. Texto simples se torna uma mensagem de usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e um array quando várias mensagens precisam ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramentas.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para sua aplicação executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta requisição, em ordem de geração — não as mensagens enviadas ou o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramentas, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`, não uma concatenação do turno: após uma chamada de ferramenta, ele contém apenas a resposta final. Ele recorre ao texto acumulado da inferência quando a última mensagem do assistente está ausente ou vazia, portanto um turno apenas com chamada de ferramenta pode retornar um `completionText` vazio — verifique `toolCalls` para decidir se continua.

### Decida se salva o turno

`commit` tem padrão `true`: mensagens enviadas e mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência pontual contra o histórico atual sem salvar aquele turno. Você ainda recebe a conclusão e `createdMessages`.

Isso não é uma execução de teste: a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não comprometidas permanecem fora do histórico de sessões posterior — para continuar esse ramo, reenvie-as em um array `prompt` ordenado.

### Adicione contexto para uma inferência

Use `instructions` para contexto que deve ser aplicado apenas à requisição atual, como um formato de resposta temporário ou o item atualmente selecionado na sua aplicação. Ele aceita uma string ou um array de strings; as entradas do array são unidas por linhas em branco. Esse contexto é anexado após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Ao contrário do `extraContext` da sessão, `instructions` não é salvo como contexto de sessão, mesmo quando `commit` é `true`. Ele ainda é enviado ao modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deve ver.

### Concluir chamadas de ferramentas do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no gateway de IA e envie um prompt.  
2. Quando `toolCalls` não estiver vazio, execute a função solicitada na sua aplicação. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e aplique as permissões da sua aplicação antes da execução.  
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` como o `id` da chamada retornada, `name` como seu `functionName` e `content` como o resultado da ferramenta em texto. Para múltiplas chamadas, envie um array de mensagens de resultado correspondentes.  
4. Leia a próxima conclusão ou repita se solicitar mais ferramentas.

Com o padrão `commit: true`, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados da ferramenta, sem duplicar aquela mensagem do assistente. Se a requisição anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de `toolCalls` de nível superior não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir essa troca.

Para ferramentas do lado do servidor, a AIVAX executa as ferramentas e continua a geração dentro da mesma requisição. `createdMessages` pode, portanto, conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência de API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados enviados do lado do cliente e múltiplas mensagens de chamadas do lado do servidor.

## Sessões de integração

AIVAX oferece integrações para clientes de chat via Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa, ID do chat ou número de telefone do usuário, dependendo do provedor. As sessões de integração têm, por padrão, duração de três horas, a menos que os parâmetros da integração especifiquem outro valor.

Essas sessões obedecem às regras originais do cliente de chat. Além disso, as sessões de chat nessas integrações têm dois comandos especiais:

- `/reset`: limpa o contexto da sessão atual.  
- `/usage`: quando `debug` está ativo no cliente de chat, exibe o uso atual do chat em tokens.

Integrações tratam o canal como a origem das mensagens, mas a inferência continua a ser realizada pelo gateway de IA associado ao cliente de chat. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor tem seus próprios detalhes de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para o mesmo objetivo operacional. Em todos os casos, as mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com inferência e a resposta do assistente é enviada de volta via mensageiro da integração.

Use Telegram quando precisar de um bot simples com usuários identificáveis por chat e comandos fáceis de testar. Use WhatsApp quando o canal principal de suporte do usuário já for o telefone e a conversa precisar acontecer em um aplicativo diário. Use o widget web quando quiser incorporar o assistente em um site, produto, centro de suporte ou painel. A escolha do canal não deve mudar o conteúdo essencial do gateway, mas pode exigir ajustes de tom, tamanho da resposta, formatação e tolerância a anexos.

Antes de abrir um canal ao público, revise a configuração do cliente de chat e explique o comportamento da memória aos usuários quando aplicável. Quando uma integração não responde como esperado, primeiro verifique a configuração do gateway e da integração associados, então tente novamente com uma mensagem simples antes de investigar capacidades opcionais.

Trate a memória persistente separadamente do histórico de sessão. Veja [o guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) para revisar o contexto armazenado e testar sua influência nas conversas.

Para os próximos passos, revise [configuração do gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) e [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md), especialmente o limite entre acesso público ao chat e credenciais de API.
