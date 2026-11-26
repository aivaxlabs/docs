---
{title: Cliente de Chat Web,linkTitle: Cliente web,weight: 30,group: Chat Clients,sourceHash: 64f5c188f8d15605,aliases: [/docs/pt-br/inference/chat-clients/web-client.html]}
---

# Cliente de Chat Web

O cliente web é a parte do cliente de chat voltada para o navegador. Você pode usá-lo de duas maneiras:

- **Chat web hospedado:** envie o usuário para a `talkUrl` da sessão ou incorpore-o em um iframe. A AIVAX serve a interface, e você personaliza como ela parece e o que aceita.
- **Sua própria interface:** mantenha a interface do seu aplicativo e envie cada mensagem para a sessão usando [Enviar Prompt](#enviando-prompts-do-seu-aplicativo).

Ambos começam com uma [sessão](managing-sessions.md) criada pelo seu servidor.

## Publicar o chat hospedado

A chave de acesso e o link de uma sessão são suas credenciais, então crie sessões no seu servidor e entregue o resultado apenas ao navegador do usuário:

1. **Crie o cliente de chat** uma vez, vinculado ao seu Gateway de IA. Veja [Criar um cliente de chat](overview.md#create-a-chat-client).
2. **Crie uma sessão** do seu servidor quando um usuário abrir o chat, com sua chave de API privada. Envie um `tag` estável para continuar a conversa anterior do usuário. Veja [Criar uma sessão](managing-sessions.md#create-a-session).
3. **Retorne o `talkUrl`** na resposta para a página que exibe o chat. Não retorne sua chave de API.
4. **Abra ou incorpore o link.** Envie o usuário para ele ou carregue-o em um iframe:

```html
<iframe
    src="<talk-url>"
    title="Chat de suporte"
    allow="microphone; clipboard-write"
    style="width: 100%; height: 640px; border: 0;">
</iframe>
```

A permissão `microphone` só é necessária quando `Audio` está em `inputModes`.

Quando a sessão expira, o link deixa de funcionar. Crie ou atualize a sessão novamente com o mesmo `tag` para obter um link funcional que mantém a conversa.

## Personalizar o chat hospedado

Defina estas opções na configuração do cliente de chat:

| Opção | O que controla |
|---|---|
| `pageTitle`, `primaryColor`, `logoImageUrl` | Título da página, cor principal e logotipo. |
| `helloLabel`, `helloSubLabel`, `textAreaPlaceholder` | Saudação exibida antes da primeira mensagem e o placeholder da caixa de mensagens. |
| `suggestionButtons` | Botões com prompts prontos, cada um com um `label` e o `prompt` que envia. |
| `languageCode` | Idioma da interface do chat. |
| `customStyles`, `customScripts` | Seu próprio CSS e JavaScript, adicionados à página hospedada. |
| `showToolCalls` | Exibe os blocos de raciocínio e atividade de ferramentas na conversa. Quando desativado, os blocos ficam ocultos e apenas a linha de status mostra o que o assistente está fazendo. Ativo por padrão. |
| `debug` | Exibe informações de diagnóstico para solução de problemas e habilita `/usage` nas integrações. Desativado por padrão; desative novamente após o uso. |

## Anexos e áudio

`inputModes` seleciona o que os usuários podem anexar: `Image`, `Document` e `Audio`. Habilite `uploadUnsupportedFiles` para também aceitar tipos de arquivo que a AIVAX não consegue ler, enviados como arquivos genéricos.

Imagens, arquivos, vídeos e áudio anexados são processados antes da inferência. Eles são encaminhados como conteúdo multimodal quando o modelo e a configuração do gateway os suportam. Quando um canal não consegue passar um anexo adiante, a AIVAX o substitui por um aviso de texto, para que o assistente ainda possa responder claramente.

Para responder com áudio, defina `audioSynthesisSource` como o `name` de um modelo de texto para fala, conforme listado por **Get Speech Models** na referência da API. O padrão, `None`, desativa as respostas de áudio. Opcionalmente, defina `audioSynthesisVoice` e `audioSynthesisInstruction` para escolher a voz e como ela fala. Habilite `summarizeTextBeforeAudioSynthesis` para ler um resumo de respostas longas em vez do texto completo. As respostas de áudio estão disponíveis apenas no chat web hospedado, não em integrações. Consulte [Speech](/docs/pt-br/generations/speech.md) para vozes e preços.

## Enviando prompts do seu aplicativo

Use **Send Prompt** quando seu aplicativo precisar de uma resposta usando uma sessão de cliente de chat existente. A chave de acesso da sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração associada do Gateway de IA.

Para inferência de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net`. Configure o tempo limite do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API do cliente de chat; consulte [endpoints disponíveis no host direto](/docs/pt-br/overview.md#endpoints-available-on-the-direct-host).

<script src="https://inference.aivax.net/apidocs?embed-target=Send%20Prompt&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Escolher o formato de entrada

O `prompt` obrigatório aceita texto simples, um objeto de mensagem compatível com OpenAI ou uma matriz ordenada de objetos de mensagem. Texto simples se torna uma mensagem de usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas e uma matriz quando várias mensagens precisarem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para seu aplicativo executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas nem o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`: após uma chamada de ferramenta, ele contém apenas a resposta final. Uma rodada apenas de chamada de ferramenta pode retornar um `completionText` vazio, então verifique `toolCalls` para decidir se deve continuar.

### Decidir se salva a rodada

`commit` é padrão `true`: as mensagens enviadas e as mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar essa rodada. Você ainda recebe a conclusão e `createdMessages`.

Esta não é uma simulação: a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não comprometidas permanecem fora do histórico posterior da sessão — para continuar esse ramal, reenvie-as em uma matriz `prompt` ordenada.

### Adicionar contexto para uma inferência

Use `instructions` para contexto que deve aplicar-se apenas à solicitação atual, como um formato de resposta temporário ou o item atualmente selecionado no seu aplicativo. Aceita uma string ou uma matriz de strings; as entradas da matriz são unidas com linhas em branco. Este contexto é anexado às instruções do sistema após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Ao contrário do `extraContext` da sessão, `instructions` não é salvo como contexto da sessão, mesmo quando `commit` é `true`. Ele ainda é enviado para o modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deve ver. Para contexto que deve durar a conversa inteira, use o `extraContext` da sessão; consulte [Escolher onde colocar o contexto](managing-sessions.md#choose-where-to-put-context).

```json
{
    "prompt": "Is this item still available?",
    "instructions": [
        "The user is viewing product SKU 4471.",
        "Answer in one sentence."
    ]
}
```

### Adicionar contexto descartável à última mensagem do usuário

Use `context` para fornecer ao modelo material que pertence apenas à rodada atual, como uma captura de tela do que o usuário está vendo, um documento que ele selecionou, um pequeno clipe de áudio ou texto extraído do seu aplicativo. Aceita:

- uma string, que se torna uma parte de texto;
- uma parte de conteúdo compatível com OpenAI: `text`, `image_url`, `input_audio`, `video_url` ou `file`;
- uma matriz misturando strings e partes de conteúdo.

As partes são inseridas no início da última mensagem do usuário da conversa, antes do conteúdo do próprio usuário. Quando uma ferramenta retornou mídia em uma etapa anterior, o contexto ainda vai para a mensagem escrita pelo usuário, não pela saída da ferramenta.

O contexto é descartável: nunca é salvo no histórico da sessão ou na conversa armazenada, mesmo quando `commit` é `true`, e não é retornado em `createdMessages`. Envie-o novamente em cada solicitação que precisar dele. As partes de mídia seguem as mesmas regras dos anexos em `prompt`: são encaminhadas como conteúdo multimodal ou convertidas em texto de acordo com o modelo e as configurações multimodais do gateway, e esse processamento é cobrado normalmente.

`context` é a maneira amigável ao cache de enviar informações variáveis. Ao contrário de `extraContext` e `instructions`, ele não altera as instruções do sistema, portanto, a parte em cache da conversa é mantida até a última mensagem do usuário. Como todos os outros campos de contexto, é enviado para o modelo: não inclua segredos ou dados que o modelo não deve ver.

Use `context` para informações, não para instruções. Por ser parte da mensagem do usuário, o modelo trata isso como entrada do usuário: diretrizes como "ignorar regras anteriores" ou "sempre responder em JSON" podem ser ignoradas ou interpretadas como uma tentativa de jailbreak e recusadas. Coloque regras de comportamento, formatos de resposta e outras diretrizes em `instructions` ou no `extraContext` da sessão, que são adicionados às instruções do sistema.

```json
{
    "prompt": "Is this item still available?",
    "context": [
        "The user is viewing product SKU <sku>.",
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

Erros detectados antes do início da transmissão, como saldo insuficiente ou limite de mensagens excedido, ainda são retornados como erros HTTP regulares. `commit` funciona da mesma forma em ambos os modos: a rodada é salva antes que o evento `result` seja enviado.

### Ajustar a inferência

Use `inferenceOptions` para substituir algumas configurações do Gateway de IA para uma solicitação. Campos omitidos mantêm a configuração do gateway.

- `reasoningEffort`: o esforço de raciocínio, como `none`, `low`, `medium` ou `high`, quando o modelo suporta.
- `renderingMode`: `default` ou `textual_blocks`. Com `textual_blocks`, o raciocínio e a atividade de ferramentas do lado do servidor são colocados como blocos textuais dentro do texto de conclusão; consulte [Diretrizes de apresentação do chat](/docs/pt-br/inference/response-rendering/chat-presentation-guidance.md#response-rendering-mode).
- `toolInvocationExplanations`: se o modelo deve explicar por que chama cada ferramenta do lado do servidor; consulte [Explicações de ferramentas](/docs/pt-br/inference/response-rendering/tool-explanations.md).

```json
{
    "prompt": "Find the latest release notes.",
    "stream": true,
    "inferenceOptions": {
        "reasoningEffort": "low",
        "toolInvocationExplanations": true
    }
}
```

### Completar chamadas de ferramentas do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no Gateway de IA, ou envie-a no campo `tools` da solicitação, e envie um prompt.
2. Quando `toolCalls` não estiver vazio, execute a função solicitada no seu aplicativo. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e aplique as permissões do seu aplicativo antes da execução.
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` como o `id` da chamada retornada, `name` como seu `functionName` e `content` como o resultado da ferramenta como texto. Para múltiplas chamadas, envie uma matriz de mensagens de resultado correspondentes.
4. Leia a próxima conclusão ou repita se solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados das ferramentas, sem duplicar essa mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de nível superior `toolCalls` não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir esse intercâmbio.

### Adicionar ferramentas do lado do cliente para uma solicitação

Use o campo `tools` da solicitação para ferramentas do lado do cliente que se aplicam apenas a essa inferência, como uma ação disponível na tela em que o usuário está. Aceita ferramentas de função compatíveis com OpenAI, adicionadas às ferramentas do Gateway de IA apenas para essa solicitação; elas não são salvas na sessão. Elas permanecem visíveis mesmo quando o gateway oculta ferramentas sem habilidade, e seus nomes não devem repetir um nome de ferramenta do gateway. Envie os mesmos `tools` novamente na solicitação que submete os resultados, para que o modelo possa chamá-los novamente na próxima etapa.

```json
{
    "prompt": "Add this item to my cart.",
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "add_to_cart",
                "description": "Adds the product the user is viewing to the cart.",
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

### Ferramentas do lado do servidor na resposta

Para ferramentas do lado do servidor, a AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode portanto conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência da API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados do lado do cliente submetidos e múltiplas mensagens de chamada do lado do servidor.

## Outras rotas de sessão

Com a chave de acesso da sessão, seu aplicativo também pode usar estas rotas, descritas na referência da API:

- **Get Session Info** retorna as mensagens e a configuração do cliente, para renderizar a conversa em sua própria interface.
- **Retry Last Message** remove tudo após a última mensagem do usuário, para que o usuário possa tentar novamente a partir daí.
- **Download Session Transcript** exporta as mensagens, contexto, metadados e token de conversa como JSON.
