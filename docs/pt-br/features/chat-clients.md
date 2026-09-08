# Clientes de Chat

Um cliente de chat fornece uma interface de usuário através de um [AI Gateway](/docs/pt-br/inference/ai-gateway) que permite ao usuário conversar com seu assistente. Um cliente de chat está integrado à inferência do AI gateway e suporta pensamento profundo, busca, conversa de texto e envio de imagens. Os recursos de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do cliente de chat com CSS, JavaScript personalizado, cores, rótulos, botões de sugestão, origens de quadro, modos de entrada e o idioma usado pelos recursos de chat.

## Como o cliente de chat funciona

Um cliente de chat é uma camada de sessão sobre um AI Gateway. O gateway define o comportamento do assistente; o cliente de chat define como um usuário final conversa com ele, como a sessão é identificada, quanto tempo dura, quais limites são aplicados, quais recursos visuais aparecem e como as mensagens entram e saem por canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, um widget web, Telegram e WhatsApp, mas cada canal terá suas próprias regras para identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém um histórico de mensagens, contexto adicional, metadados, token de conversa e um identificador externo opcional. Quando você cria uma sessão com um `tag`, a AIVAX tenta reutilizar a sessão ativa para essa tag em vez de criar uma nova conversa. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder o contexto imediatamente. Quando a sessão não tem `tag`, ela funciona como uma conversa independente controlada pelo token de acesso gerado na criação.

O `tag` também serve como ponto de conexão entre o cliente de chat, memória, calendário, workers e integrações. Ferramentas como memória precisam de um identificador estável para saber a quem uma preferência ou informação persistente pertence. Workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. Integrações do WhatsApp e Telegram usam o ID da conversa, número de telefone ou usuário para recuperar a sessão correta. Portanto, escolha um `tag` estável, não sensível e único por usuário ou conversa.

## Criando uma sessão de chat

Uma sessão de chat é onde você cria uma conversa entre seu cliente de chat e o usuário. Você pode chamar este endpoint fornecendo contexto adicional para a conversa, como o nome do usuário, localização, etc.

Uma sessão pode ser identificada com um tag estável e não sensível para que o cliente possa continuar a conversa apropriada. Consulte a Referência de API embutida para comportamento e configuração de sessão suportados.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Web%20Chat%20Session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Ao criar uma sessão, use `extraContext` para informações que ajudam o assistente nessa conversa, mas não devem se tornar memória permanente: nome exibido, plano do cliente, idioma preferido, página de referência, produto que o usuário está visualizando, número do pedido ou estado atual do fluxo. Não use este campo para segredos, tokens internos ou dados que o modelo não deve ver. O contexto adicional vai para a inferência e pode influenciar respostas, ferramentas e workers.

Você também pode fornecer `contextLocation`, uma URL que a AIVAX carrega durante a geração da resposta e anexa ao contexto da sessão. Use-a para contexto controlado pelo servidor que pode mudar ao longo do tempo e certifique-se de que a URL seja acessível pela AIVAX.

O chat web aceita mensagens de texto e anexos. Imagens, arquivos, vídeos e áudio são materializados antes da inferência; tipos de imagem, arquivo, vídeo e áudio suportados podem ser encaminhados como conteúdo multimodal quando o modelo selecionado e a configuração do gateway o suportam. O áudio também pode ser sintetizado como resposta quando a configuração de síntese de áudio do cliente de chat está ativa. Quando um canal não pode incorporar um anexo, a AIVAX transforma o conteúdo não suportado em um aviso de anexo textual para que o assistente possa responder claramente.

## Enviando prompts da sua aplicação

Use **Send Prompt** quando sua aplicação precisa de uma resposta síncrona usando uma sessão de cliente de chat existente. A chave de acesso da sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração do AI Gateway associado.

Para inferência de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o timeout do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API de cliente de chat.

<script src="https://inference.aivax.net/apidocs?embed-target=Send%20Prompt&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Escolha o formato de entrada

O `prompt` requerido aceita texto simples, um objeto de mensagem compatível com OpenAI ou um array ordenado de objetos de mensagem. Texto simples se torna uma mensagem de usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e um array quando várias mensagens devem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para sua aplicação executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas ou o histórico de sessão anterior. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramenta, raciocínio e metadados por mensagem.

### Decida se salva a rodada

`commit` tem padrão `true`: mensagens enviadas e mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar essa rodada. Você ainda recebe a conclusão e `createdMessages`.

Isso não é uma execução de teste: a inferência ainda é cobrada e as ferramentas ainda podem executar ações. Uma solicitação posterior não terá as mensagens não confirmadas em seu histórico de sessão. Se precisar continuar esse ramo, forneça as mensagens necessárias novamente em um array `prompt` ordenado.

### Adicione contexto para uma inferência

Use `instructions` para contexto que deve se aplicar apenas à solicitação atual, como um formato de resposta temporário ou o item atualmente selecionado em sua aplicação. Aceita uma string ou um array de strings; as entradas do array são unidas com linhas em branco. Esse contexto é anexado após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Ao contrário do `extraContext` da sessão, `instructions` não é salvo como contexto de sessão, mesmo quando `commit` é `true`. Ele ainda é enviado ao modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deve ver.

### Concluir chamadas de ferramenta do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no AI Gateway e envie um prompt.  
2. Quando `toolCalls` não está vazio, execute a função solicitada em sua aplicação. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e aplique as permissões da sua aplicação antes da execução.  
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` como o `id` da chamada retornada, `name` como seu `functionName` e `content` como o resultado da ferramenta em texto. Para múltiplas chamadas, envie um array de mensagens de resultado correspondentes.  
4. Leia a próxima conclusão ou repita se solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados da ferramenta, sem duplicar aquela mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de `toolCalls` de nível superior não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir essa troca.

Para ferramentas do lado do servidor, a AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode, portanto, conter uma chamada de ferramenta do assistente, seu resultado e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência de API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados enviados do lado do cliente e múltiplas mensagens de chamadas do lado do servidor.

## Sessões de integração

AIVAX fornece integrações para clientes de chat via Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa, ID do chat ou número de telefone do usuário, dependendo do provedor. As sessões de integração têm duração padrão de três horas, a menos que os parâmetros da integração especifiquem outro valor.

Essas sessões obedecem às regras originais do cliente de chat. Além disso, sessões de chat nessas integrações têm dois comandos especiais:

- `/reset`: limpa o contexto da sessão atual.  
- `/usage`: quando `debug` está ativo no cliente de chat, exibe o uso atual do chat em tokens.

Integrações tratam o canal como a origem das mensagens, mas a inferência continua a ser realizada pelo AI Gateway associado ao cliente de chat. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor tem seus próprios detalhes de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para o mesmo objetivo operacional. Em todos os casos, as mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com inferência, e a resposta do assistente é enviada de volta via mensageiro da integração.

Use o Telegram quando precisar de um bot simples com usuários identificáveis por chat e comandos fáceis de testar. Use o WhatsApp quando o canal principal de suporte do usuário já for o telefone e a conversa precisar acontecer em um aplicativo diário. Use o widget web quando quiser incorporar o assistente em um site, produto, centro de suporte ou painel. A escolha do canal não deve mudar o conteúdo essencial do gateway, mas pode exigir ajustes no tom, tamanho da resposta, formatação e tolerância a anexos.

Antes de abrir um canal ao público, revise a configuração do cliente de chat e explique o comportamento da memória aos usuários quando aplicável. Quando uma integração não responde como esperado, primeiro verifique o gateway associado e a configuração da integração, depois tente novamente com uma mensagem simples antes de investigar recursos opcionais.