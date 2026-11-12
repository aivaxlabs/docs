Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients.html

# Clientes de Chat

Um cliente de chat oferece aos usuários finais uma interface para conversar com um assistente alimentado por um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Ele é executado na inferência do gateway e suporta pensamento profundo, pesquisa, conversas por texto e envio de imagens. As funcionalidades de áudio dependem da integração e da configuração do cliente.

Você pode personalizar a interface do cliente de chat com CSS, JavaScript personalizado, cores, rótulos, botões de sugestão, origens de frame, modos de entrada e o idioma usado pelos recursos do chat.

## Como funciona o cliente de chat

Um cliente de chat é uma camada de sessão sobre um Gateway de IA. O gateway define o comportamento do assistente; o cliente de chat define como um usuário final conversa com ele, como a sessão é identificada, quanto tempo ela dura, quais limites são aplicados, quais recursos visuais aparecem e como as mensagens entram e saem através de canais externos. Essa separação é importante: você pode usar o mesmo gateway em uma API interna, um widget web, Telegram e WhatsApp, mas cada canal terá suas próprias regras para identidade, anexos, formatação, comandos e entrega de mensagens.

Cada sessão mantém um histórico de mensagens, contexto adicional, metadados, token de conversa e um identificador externo opcional. Ao criar uma sessão com uma `tag`, o AIVAX tenta reutilizar a sessão ativa para essa tag em vez de criar uma nova conversa. Isso permite que um usuário retorne ao widget ou envie outra mensagem pelo mesmo canal sem perder o contexto imediatamente. Quando a sessão não possui `tag`, ela funciona como uma conversa independente controlada pelo token de acesso gerado na criação.

A `tag` também serve como o ponto de conexão entre o cliente de chat, memória, workers e integrações. Ferramentas como a memória precisam de um identificador estável para saber a quem pertencem uma preferência ou informação persistente. Os workers recebem `externalUserId` para aplicar regras por usuário, por canal ou por conta externa. As integrações do WhatsApp e Telegram usam o ID da conversa, número de telefone ou usuário para recuperar a sessão correta. Portanto, escolha uma `tag` estável, não sensível e única por usuário ou conversa.

## Criando uma sessão de chat

Uma sessão de chat representa uma única conversa entre seu cliente de chat e um usuário final. Ao criá-la, você pode fornecer contexto adicional para a conversa, como o nome ou a localização do usuário.

Uma sessão pode ser identificada por uma tag estável e não sensível para que o cliente possa continuar a conversa apropriada. Consulte a Referência da API embutida para ver o comportamento e a configuração suportados da sessão.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

### Escolha onde colocar o contexto

O AIVAX aceita contexto em três lugares. Todos eles são adicionados às instruções do sistema da inferência, nesta ordem:

| Campo | Quando se aplica | Use-o para |
|---|---|---|
| `extraContext` (sessão) | Cada inferência na sessão. | Contexto para toda a conversa: o canal, o nome do usuário, plano, idioma preferido ou o produto sobre o qual a conversa é. |
| `contextLocation` (sessão) | O AIVAX busca a URL antes de cada inferência e anexa seu conteúdo após `extraContext`. | Contexto controlado pelo servidor que pode mudar durante a conversa, como o carrinho, o status de um pedido ou o registro aberto em seu aplicativo. |
| `instructions` ([Enviar Prompt](#adicionar-contexto-para-uma-inferencia)) | Apenas esse pedido, anexado após o conteúdo de `contextLocation`. | Contexto para aquele momento, como um formato de resposta temporário ou o item que o usuário acabou de selecionar. |

Nenhum deles é salvo no histórico da sessão: o modelo vê a versão mais recente em cada solicitação. Como fazem parte das instruções do sistema, que iniciam cada solicitação, alterá-las invalida o cache de prompt para todo o histórico.

Mantenha `extraContext` estável durante a conversa. Cada alteração nele, ou no conteúdo retornado por `contextLocation`, invalida o cache de prompt para todo o histórico, o que aumenta a latência e o custo de entrada na próxima solicitação. Para informações que mudam a cada solicitação ou que não são texto, use o campo `context` do Enviar Prompt: ele vai para a última mensagem do usuário em vez das instruções do sistema, mantendo assim o histórico em cache antes dessa mensagem. Veja [Adicionar contexto descartável à última mensagem do usuário](#adicionar-contexto-descartavel-a-ultima-mensagem-do-usuario).

A mesma regra se aplica às integrações de canal: Telegram e WhatsApp colocam seu contexto fixo de canal, como regras de formatação e o nome de exibição do usuário, no `extraContext` da sessão.

Não coloque segredos, tokens internos ou dados que o modelo não deve ver em nenhum desses campos. Eles são enviados ao modelo e podem influenciar respostas, ferramentas e workers. Certifique-se de que a URL de `contextLocation` seja acessível pelo AIVAX; quando não puder ser carregada, a inferência continua sem ela e um aviso é adicionado aos logs da conta.

O chat web aceita mensagens de texto e anexos. Imagens, arquivos, vídeos e áudio são materializados antes da inferência; os tipos suportados de imagem, arquivo, vídeo e áudio podem ser encaminhados como conteúdo multimodal quando o modelo selecionado e a configuração do gateway os suportarem. O áudio também pode ser sintetizado como resposta quando a configuração de síntese de áudio do cliente de chat estiver ativa. Quando um canal não pode incorporar um anexo, o AIVAX converte o conteúdo não suportado em um aviso de anexo textual para que o assistente possa responder claramente.

## Enviando prompts do seu aplicativo

Use **Enviar Prompt** quando seu aplicativo precisar de uma resposta usando uma sessão de cliente de chat existente. A chave de acesso da sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração do Gateway de IA associado.

Para inferências de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o timeout do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API do cliente de chat; veja [endpoints disponíveis no host direto](https://docs.aivax.net/pt-br/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Escolha o formato de entrada

O `prompt` obrigatório aceita texto simples, um objeto de mensagem compatível com OpenAI ou uma matriz ordenada de objetos de mensagem. Texto simples torna-se uma mensagem do usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e uma matriz quando várias mensagens devem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para seu aplicativo executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas nem o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`, não uma concatenação do turno: após uma chamada de ferramenta, ele contém apenas a resposta final. Ele retorna ao texto de inferência acumulado quando a última mensagem do assistente está ausente ou vazia, portanto, um turno apenas de chamada de ferramenta pode retornar um `completionText` vazio — verifique `toolCalls` para decidir se deve continuar.

### Decida se deseja salvar o turno

`commit` padrão é `true`: as mensagens enviadas e as mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar esse turno. Você ainda recebe a conclusão e `createdMessages`.

Esta não é uma simulação: a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não confirmadas ficam fora do histórico posterior da sessão — para continuar esse ramo, reenvie-as em uma matriz `prompt` ordenada.

### Adicionar contexto para uma inferência

Use `instructions` para contexto que deve se aplicar apenas à solicitação atual, como um formato de resposta temporário ou o item atualmente selecionado em seu aplicativo. Ele aceita uma string ou uma matriz de strings; as entradas da matriz são unidas com linhas em branco. Esse contexto é anexado às instruções do sistema após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Diferente do `extraContext` da sessão, `instructions` não é salvo como contexto da sessão, mesmo quando `commit` é `true`. Ele ainda é enviado ao modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deve ver. Para contexto que deve durar toda a conversa, use o `extraContext` da sessão; veja [Escolha onde colocar o contexto](#escolha-onde-colocar-o-contexto).

```json
{
    "prompt": "Este item ainda está disponível?",
    "instructions": [
        "O usuário está visualizando o SKU do produto 4471.",
        "Responda em uma frase."
    ]
}
```

### Adicionar contexto descartável à última mensagem do usuário

Use `context` para fornecer ao modelo material que pertence apenas ao turno atual, como uma captura de tela do que o usuário está vendo, um documento que ele selecionou, um pequeno clipe de áudio ou texto extraído do seu aplicativo. Ele aceita:

- uma string, que se torna uma parte de texto;
- uma parte de conteúdo compatível com OpenAI: `text`, `image_url`, `input_audio`, `video_url` ou `file`;
- uma matriz misturando strings e partes de conteúdo.

As partes são inseridas no início da última mensagem do usuário da conversa, antes do próprio conteúdo do usuário. Quando uma ferramenta retornou mídia em uma etapa anterior, o contexto ainda vai para a mensagem escrita pelo usuário, não pela saída da ferramenta.

O contexto é descartável: nunca é salvo no histórico da sessão ou na conversa armazenada, mesmo quando `commit` é `true`, e não é retornado em `createdMessages`. Envie-o novamente em cada solicitação que precisar dele. As partes de mídia seguem as mesmas regras que os anexos em `prompt`: elas são encaminhadas como conteúdo multimodal ou convertidas em texto de acordo com o modelo e as configurações multimodais do gateway, e esse processamento é cobrado normalmente.

`context` é a maneira amigável ao cache de enviar informações mutáveis. Diferente de `extraContext` e `instructions`, ele não altera as instruções do sistema, então a parte em cache da conversa é mantida até a última mensagem do usuário. Como todos os outros campos de contexto, ele é enviado ao modelo: não inclua segredos ou dados que o modelo não deve ver.

Use `context` para informações, não para instruções. Por fazer parte da mensagem do usuário, o modelo trata isso como entrada do usuário: diretivas como "ignorar regras anteriores" ou "sempre responda em JSON" podem ser ignoradas ou interpretadas como uma tentativa de jailbreak e recusadas. Coloque regras de comportamento, formatos de resposta e outras diretivas em `instructions` ou no `extraContext` da sessão, que são adicionados às instruções do sistema.

```json
{
    "prompt": "Este item ainda está disponível?",
    "context": [
        "O usuário está visualizando o SKU do produto <sku>.",
        {
            "type": "image_url",
            "image_url": { "url": "https://example.com/product.png" }
        }
    ]
}
```

### Transmitir a resposta

Defina `stream: true` para receber a resposta como eventos enviados pelo servidor em vez de um único corpo JSON. Cada linha `data` é um objeto JSON com `type` e `data`:

- `text`: um delta de texto de conclusão em `content`. Quando `replace` é `true`, substitua o texto recebido até agora em vez de anexar.
- `reasoning`: um delta de raciocínio em `content`, quando o modelo expõe raciocínio.
- `tool`: uma atualização de ferramenta do lado do servidor com `toolName`, `toolId`, `toolArguments` e `update` (como `Created` ou `Finished`).
- `result`: o corpo final, com os mesmos campos da resposta não transmitida. É o último evento de uma solicitação bem-sucedida.
- `error`: um erro que ocorreu após o início da transmissão, com uma `message`. Substitui `result`.

Erros detectados antes do início da transmissão, como saldo insuficiente ou limite de mensagens excedido, ainda são retornados como erros HTTP regulares. `commit` funciona da mesma forma em ambos os modos: o turno é salvo antes que o evento `result` seja enviado.

### Ajustar a inferência

Use `inferenceOptions` para substituir algumas configurações do Gateway de IA para uma solicitação. Campos omitidos mantêm a configuração do gateway.

- `reasoningEffort`: o esforço de raciocínio, como `none`, `low`, `medium` ou `high`, quando o modelo suporta.
- `renderingMode`: `default` ou `textual_blocks`. Com `textual_blocks`, o raciocínio e a atividade de ferramentas do lado do servidor são colocados como blocos textuais dentro do texto de conclusão; veja [Orientações de apresentação do chat](https://docs.aivax.net/pt-br/docs/inference/response-rendering/chat-presentation-guidance.md#modo-de-renderizacao-da-resposta).
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

1. Configure a ferramenta do lado do cliente desejada no Gateway de IA, ou envie-a no campo `tools` da solicitação, e envie um prompt.
2. Quando `toolCalls` não estiver vazio, execute a função solicitada em seu aplicativo. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e imponha as permissões do seu aplicativo antes da execução.
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` para o `id` da chamada retornada, `name` para seu `functionName` e `content` para o resultado da ferramenta como texto. Para múltiplas chamadas, envie uma matriz de mensagens de resultado correspondentes.
4. Leia a próxima conclusão ou repita se solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados da ferramenta, sem duplicar essa mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de nível superior `toolCalls` não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir esse intercâmbio.

Use o campo `tools` da solicitação para ferramentas do lado do cliente que se aplicam apenas a essa inferência, como uma ação disponível na tela em que o usuário está. Ela aceita ferramentas de função compatíveis com OpenAI, adicionadas às ferramentas do Gateway de IA apenas para essa solicitação; elas não são salvas na sessão. Elas permanecem visíveis mesmo quando o gateway oculta ferramentas sem habilidade, e seus nomes não devem repetir um nome de ferramenta do gateway. Envie os mesmos `tools` novamente na solicitação que envia os resultados, para que o modelo possa chamá-los novamente na próxima etapa.

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

Para ferramentas do lado do servidor, o AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode portanto conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência da API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados do lado do cliente enviados e múltiplas mensagens de chamada do lado do servidor.

## Sessões de integração

O AIVAX fornece integrações para clientes de chat via Telegram e WhatsApp, incluindo [Z-Api](https://www.z-api.io/), Evolution API e Kapso. Cada conversa em um aplicativo é uma sessão individual, identificada pelo ID da conversa, ID do chat ou número de telefone do usuário, dependendo do provedor. Sessões de integração têm duração padrão de três horas, a menos que os parâmetros de integração especifiquem outro valor.

Essas sessões obedecem às regras originais do cliente de chat. Além disso, sessões de chat nessas integrações têm dois comandos especiais:

- `/reset`: limpa o contexto da sessão atual.
- `/usage`: quando `debug` está ativo no cliente de chat, exibe o uso atual do chat em tokens.

As integrações tratam o canal como a fonte das mensagens, mas a inferência continua sendo realizada pelo Gateway de IA associado ao cliente de chat. No Telegram, a conversa recebe instruções adicionais sobre formatação e comportamento esperado do canal. No WhatsApp, cada provedor tem seus próprios detalhes de webhook, download de mídia e envio de resposta; Z-Api, Evolution API e Kapso são caminhos diferentes para o mesmo objetivo operacional. Em todos os casos, as mensagens do usuário entram na sessão, são materializadas como mensagens compatíveis com inferência e a resposta do assistente é enviada de volta via o mensageiro da integração.

### URLs de Webhook

Cada integração tem sua própria URL de webhook, que você copia das configurações de integração no painel. A URL contém uma chave de webhook gerada para essa integração, então trate-a como um segredo. Use **Rotacionar chave de webhook** para substituir a chave: a URL anterior deixa de funcionar imediatamente, então atualize a URL no provedor logo após a rotação. Para o Telegram, a rotação da chave também atualiza os hooks do bot.

Alguns provedores também podem provar que uma solicitação veio deles:

- **Telegram:** **Atualizar hooks** registra o webhook com um token secreto, e mensagens sem ele são rejeitadas.
- **Kapso:** defina **Chave secreta do webhook** para o segredo do seu webhook do Kapso. Solicitações cuja assinatura não corresponde são rejeitadas.
- **Z-API** e **Evolution API:** esses provedores não assinam solicitações de webhook, então a chave de webhook na URL é o que os autoriza.

URLs de webhook sem uma chave de webhook continuam funcionando até 1º de dezembro de 2026. Após essa data, elas são rejeitadas. Copie a URL atual do painel e atualize-a no provedor, ou use **Atualizar hooks** para o Telegram, antes dessa data.

Use o Telegram quando você precisar de um bot simples com usuários identificáveis por chat e comandos fáceis de testar. Use o WhatsApp quando o canal principal de suporte do usuário já for o telefone e a conversa precisar acontecer em um aplicativo diário. Use o widget web quando quiser incorporar o assistente em um site, produto, centro de suporte ou painel. A escolha do canal não deve alterar o conteúdo essencial do gateway, mas pode exigir ajustes no tom, tamanho da resposta, formatação e tolerância a anexos.

Antes de abrir um canal ao público, revise a configuração do cliente de chat e explique o comportamento da memória aos usuários quando aplicável. Quando uma integração não responde como esperado, primeiro verifique a configuração do gateway e da integração associados, depois tente novamente com uma mensagem simples antes de investigar recursos opcionais.

Trate a memória persistente separadamente do histórico da sessão. Veja [o guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) para revisar o contexto armazenado e testar sua influência em todas as conversas.

Para os próximos passos, revise [Configuração do Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md), especialmente a fronteira entre o acesso público ao chat e as credenciais da API.
