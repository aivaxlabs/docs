Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients.html

# Clientes de Chat

Um cliente de chat oferece aos usuários finais uma interface para conversar com um assistente alimentado por um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Ele é executado na inferência do gateway e suporta pensamento profundo, busca, conversas por texto e envio de imagens. As funcionalidades de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do cliente de chat com CSS, JavaScript personalizado, cores, rótulos, botões de sugestão, origens de frame, modos de entrada e o idioma usado pelos recursos do chat.

## Como o cliente de chat funciona

Um cliente de chat é uma camada de sessão sobre um AI Gateway. O gateway define o comportamento do assistente; o cliente de chat define como um usuário final conversa com ele, como a sessão é identificada, quanto tempo ela dura, quais limites são aplicados, quais recursos visuais aparecem e como as mensagens entram e saem através de canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, um widget web, Telegram e WhatsApp, mas cada canal terá suas próprias regras para identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém um histórico de mensagens, contexto adicional, metadados, token de conversa e um identificador externo opcional. Ao criar uma sessão com uma `tag`, o AIVAX tenta reutilizar a sessão ativa para essa tag em vez de criar uma nova conversa. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder o contexto imediatamente. Quando a sessão não possui `tag`, ela funciona como uma conversa independente controlada pelo token de acesso gerado na criação.

A `tag` também serve como o ponto de conexão entre o cliente de chat, memória, workers e integrações. Ferramentas como a memória precisam de um identificador estável para saber a quem pertencem uma preferência ou informação persistente. Os workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. As integrações do WhatsApp e do Telegram usam o ID da conversa, número de telefone ou usuário para recuperar a sessão correta. Portanto, escolha uma `tag` estável, não sensível e única por usuário ou conversa.

## Criando uma sessão de chat

Uma sessão de chat representa uma única conversa entre seu cliente de chat e um usuário final. Ao criá-la, você pode fornecer contexto adicional para a conversa, como o nome ou a localização do usuário.

Uma sessão pode ser identificada por uma tag estável e não sensível para que o cliente possa continuar a conversa apropriada. Consulte a Referência de API embutida para ver o comportamento e a configuração suportados da sessão.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

### Escolha onde colocar o contexto

O AIVAX aceita contexto em três lugares. Cada um alcança o modelo em uma posição diferente, e essa posição decide qual é o custo e quanto tempo ele dura:

| Campo | Para onde vai | Use-o para |
|---|---|---|
| `extraContext` (sessão) | Adicionado às instruções do sistema de toda inferência na sessão. | Contexto que idealmente não muda durante a conversa: o canal, o nome do usuário, plano, idioma preferido ou o produto sobre o qual a conversa é. |
| `contextLocation` (sessão) | O AIVAX busca a URL antes de cada inferência e envia seu conteúdo logo após a última mensagem do usuário. | Contexto externo que pode mudar enquanto a conversa avança, como o carrinho, o status de um pedido ou o registro aberto no seu aplicativo. |
| `instructions` ([Enviar Prompt](#add-context-for-one-inference)) | Enviado logo após a última mensagem do usuário, após o conteúdo do `contextLocation`, apenas para essa solicitação. | Contexto para aquele momento que não será reutilizado no resto da conversa, como um formato de resposta temporário ou o item que o usuário acabou de selecionar. |

Mantenha o `extraContext` estável. As instruções do sistema são o início de cada solicitação, então alterá-las invalida o cache de prompt para todo o histórico. O conteúdo enviado após a última mensagem do usuário não afeta o cache de mensagens anteriores, o que torna o `contextLocation` e os `instructions` o local certo para qualquer coisa que varie. Nenhum deles é salvo no histórico da sessão: o modelo vê a versão mais recente em cada solicitação e versões anteriores não são repetidas.

A mesma regra se aplica às integrações de canal: Telegram e WhatsApp colocam seu contexto fixo do canal, como regras de formatação e o nome de exibição do usuário, no `extraContext` da sessão.

Não coloque segredos, tokens internos ou dados que o modelo não deve ver em nenhum desses campos. Eles são enviados ao modelo e podem influenciar respostas, ferramentas e workers. Certifique-se de que a URL do `contextLocation` seja acessível pelo AIVAX; quando não puder ser carregada, a inferência continua sem ela e um aviso é adicionado aos logs da conta.

O chat web aceita mensagens de texto e anexos. Imagens, arquivos, vídeos e áudio são materializados antes da inferência; os tipos suportados de imagem, arquivo, vídeo e áudio podem ser encaminhados como conteúdo multimodal quando o modelo selecionado e a configuração do gateway os suportarem. O áudio também pode ser sintetizado como resposta quando a configuração de síntese de áudio do cliente de chat estiver ativa. Quando um canal não pode incorporar um anexo, o AIVAX converte o conteúdo não suportado em um aviso de anexo textual para que o assistente possa responder claramente.

## Enviando prompts do seu aplicativo

Use **Enviar Prompt** quando seu aplicativo precisar de uma resposta usando uma sessão de cliente de chat existente. A chave de acesso à sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração do AI Gateway associada.

Para inferências de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o timeout do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API do cliente de chat; veja [endpoints disponíveis no host direto](https://docs.aivax.net/pt-br/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Escolha o formato de entrada

O `prompt` obrigatório aceita texto simples, um objeto de mensagem compatível com OpenAI ou uma matriz ordenada de objetos de mensagem. Texto simples torna-se uma mensagem do usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e uma matriz quando várias mensagens devem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para seu aplicativo executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas nem o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`, não uma concatenação do turno: após uma chamada de ferramenta, ele contém apenas a resposta final. Ele retorna ao texto de inferência acumulado quando a última mensagem do assistente está ausente ou vazia, portanto, um turno apenas de chamada de ferramenta pode retornar um `completionText` vazio — verifique `toolCalls` para decidir se deve continuar.

### Decida se deseja salvar o turno

`commit` padrão é `true`: as mensagens enviadas e as mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar esse turno. Você ainda recebe a conclusão e `createdMessages`.

Esta não é uma simulação: a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não comprometidas ficam fora do histórico posterior da sessão — para continuar esse ramo, reenvie-as em uma matriz `prompt` ordenada.

### Adicionar contexto para uma inferência

Use `instructions` para contexto que se aplica apenas à solicitação atual e não será reutilizado no resto da conversa, como um formato de resposta temporário ou o item atualmente selecionado no seu aplicativo. Ele aceita texto, uma parte de conteúdo compatível com OpenAI ou uma matriz delas, para que você também possa enviar uma imagem ou um arquivo apenas para essa solicitação.

O AIVAX envia este conteúdo como uma mensagem do usuário logo após a última mensagem do usuário, após qualquer conteúdo carregado do `contextLocation`. Ele não é salvo no histórico da sessão, mesmo quando `commit` é `true`, e não é retornado em `createdMessages`. Como vem após o histórico, alterá-lo em cada solicitação não invalida o cache de prompt das mensagens anteriores. Para contexto que deve durar a conversa inteira, use o `extraContext` da sessão; veja [Escolha onde colocar o contexto](#choose-where-to-put-context).

```json
{
    "prompt": "Este item ainda está disponível?",
    "instructions": [
        "O usuário está visualizando o SKU do produto 4471.",
        { "type": "image_url", "image_url": { "url": "https://example.com/sku-4471.png" } }
    ]
}
```

### Transmitir a resposta

Defina `stream: true` para receber a resposta como eventos enviados pelo servidor em vez de um único corpo JSON. Cada linha `data` é um objeto JSON com `type` e `data`:

- `text`: um delta de texto de conclusão em `content`. Quando `replace` é `true`, substitua o texto recebido até agora em vez de anexar.
- `reasoning`: um delta de raciocínio em `content`, quando o modelo expõe raciocínio.
- `tool`: uma atualização de ferramenta do lado do servidor com `toolName`, `toolId`, `toolArguments` e `update` (como `Created` ou `Finished`).
- `result`: o corpo final, com os mesmos campos da resposta não transmitida. É o último evento de uma solicitação bem-sucedida.
- `error`: um erro que ocorreu após o início do stream, com uma `message`. Ele substitui `result`.

Erros detectados antes do início do stream, como saldo insuficiente ou limite de mensagens excedido, ainda são retornados como erros HTTP regulares. `commit` funciona da mesma maneira em ambos os modos: o turno é salvo antes que o evento `result` seja enviado.

### Ajustar a inferência

Use `inferenceOptions` para substituir algumas configurações do AI Gateway para uma solicitação. Campos omitidos mantêm a configuração do gateway.

- `reasoningEffort`: o esforço de raciocínio, como `none`, `low`, `medium` ou `high`, quando o modelo suporta.
- `renderingMode`: `default` ou `textual_blocks`. Com `textual_blocks`, o raciocínio e a atividade de ferramentas do lado do servidor são colocados como blocos textuais dentro do texto de conclusão; veja [Diretrizes de apresentação do chat](https://docs.aivax.net/pt-br/docs/inference/response-rendering/chat-presentation-guidance.md#response-rendering-mode).
- `toolInvocationExplanations`: se o modelo deve explicar por que chama cada ferramenta do lado do servidor; veja [Explicações de ferramentas](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md).

```json
{
    "prompt": "Encontre as notas de lançamento mais recentes.",
    "stream": true,
    "inferenceOptions": {
        "reasoningEffort": "low",
        "toolInvocationExplanations": true
    }
}
```

Quando o provedor do modelo falha temporariamente antes de enviar qualquer saída, o AIVAX retrya a solicitação automaticamente, até três vezes.

### Completar chamadas de ferramentas do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no AI Gateway, ou envie-a no campo `tools` da solicitação, e envie um prompt.
2. Quando `toolCalls` não estiver vazio, execute a função solicitada no seu aplicativo. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e aplique as permissões do seu aplicativo antes da execução.
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` para o `id` da chamada retornada, `name` para seu `functionName` e `content` para o resultado da ferramenta como texto. Para múltiplas chamadas, envie uma matriz de mensagens de resultado correspondentes.
4. Leia a próxima conclusão, ou repita se solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados das ferramentas, sem duplicar essa mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de nível superior `toolCalls` não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir essa troca.

Use o campo `tools` da solicitação para ferramentas do lado do cliente que se aplicam apenas àquela inferência, como uma ação disponível na tela em que o usuário está. Ela aceita ferramentas de função compatíveis com OpenAI, adicionadas às ferramentas do AI Gateway apenas para essa solicitação; elas não são salvas na sessão. Elas permanecem visíveis mesmo quando o gateway oculta ferramentas sem uma habilidade, e seus nomes não devem repetir um nome de ferramenta do gateway. Envie os mesmos `tools` novamente na solicitação que submete os resultados, para que o modelo possa chamá-los novamente na próxima etapa.

```json
{
    "prompt": "Adicione este item ao meu carrinho.",
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "add_to_cart",
                "description": "Adiciona o produto que o usuário está visualizando ao carrinho.",
                "parameters": {
                    "type": "object",
                    "properties": { "quantity": { "type": "integer" } },
                    "required": [ "quantity" ]
                }
            }
        }
    ]
}
```

Para ferramentas do lado do servidor, o AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode portanto conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência de API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados do lado do cliente submetidos e múltiplas mensagens de chamada do lado do servidor.

## Sessões de integração

O AIVAX fornece integrações para clientes de chat via Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa, ID do chat ou número de telefone do usuário, dependendo do provedor. Sessões de integração têm por padrão uma duração de três horas, a menos que os parâmetros de integração especifiquem outro valor.

Essas sessões obedecem às regras originais do cliente de chat. Além disso, sessões de chat nessas integrações têm dois comandos especiais:

- `/reset`: limpa o contexto da sessão atual.
- `/usage`: quando `debug` está ativo no cliente de chat, exibe o uso atual do chat em tokens.

As integrações tratam o canal como a fonte de mensagens, mas a inferência continua sendo realizada pelo AI Gateway associado ao cliente de chat. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor tem seus próprios detalhes de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para o mesmo objetivo operacional. Em todos os casos, as mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com inferência, e a resposta do assistente é enviada de volta via o mensageiro da integração.

Use o Telegram quando você precisar de um bot simples com usuários identificáveis por chat e comandos fáceis de testar. Use o WhatsApp quando o canal principal de suporte do usuário já for o telefone e a conversa precisar acontecer em um aplicativo diário. Use o widget web quando quiser incorporar o assistente em um site, produto, centro de suporte ou painel. A escolha do canal não deve alterar o conteúdo essencial do gateway, mas pode exigir ajustes no tom, tamanho da resposta, formatação e tolerância a anexos.

Antes de abrir um canal ao público, revise a configuração do cliente de chat e explique o comportamento da memória aos usuários quando aplicável. Quando uma integração não responde como esperado, verifique primeiro a configuração do gateway e da integração associados, depois tente novamente com uma mensagem simples antes de investigar capacidades opcionais.

Trate a memória persistente separadamente do histórico da sessão. Veja [o guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) para revisar o contexto armazenado e testar sua influência através das conversas.

Para os próximos passos, revise [Configuração do AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md), especialmente a fronteira entre o acesso público ao chat e as credenciais de API.
