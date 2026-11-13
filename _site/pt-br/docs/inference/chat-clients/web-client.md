Source: https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.html

# Cliente de Chat Web

O cliente web é a parte do cliente de chat voltada para o navegador. Você pode usá-lo de duas maneiras:

- **Chat web hospedado:** envie o usuário para o `talkUrl` da sessão ou incorpore-o em um iframe. A AIVAX serve a interface, e você personaliza como ela parece e o que aceita.
- **Sua própria interface:** mantenha a UI do seu aplicativo e envie cada mensagem para a sessão com [Enviar Prompt](#enviando-prompts-do-seu-aplicativo).

Ambos começam com uma [sessão](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md) criada pelo seu servidor.

## Publicar o chat hospedado

A chave de acesso e o link de uma sessão são suas credenciais, então crie sessões no seu servidor e entregue o resultado apenas ao navegador do usuário:

1. **Crie o cliente de chat** uma vez, vinculado ao seu Gateway de IA. Veja [Criar um cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.md#create-a-chat-client).
2. **Crie uma sessão** a partir do seu servidor quando um usuário abrir o chat, com sua chave de API privada. Envie um `tag` estável para continuar a conversa anterior do usuário. Veja [Criar uma sessão](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md#create-a-session).
3. **Retorne o `talkUrl`** na resposta para a página que exibe o chat. Não retorne sua chave de API.
4. **Abra ou incorpore o link.** Envie o usuário para ele ou carregue-o em um iframe:

```html
<iframe
    src="<talk-url>"
    title="Suporte de chat"
    allow="microphone; clipboard-write"
    style="width: 100%; height: 640px; border: 0;">
</iframe>
```

A permissão `microphone` só é necessária quando `Audio` está em `inputModes`. Quando a sessão expira, o link para de funcionar: crie ou atualize a sessão novamente com o mesmo `tag` para obter um link funcional que mantenha a conversa.

## Personalizar o chat hospedado

Defina estas opções na configuração do cliente de chat:

| Opção | O que controla |
|---|---|
| `pageTitle`, `primaryColor`, `logoImageUrl` | Título da página, cor principal e logotipo. |
| `helloLabel`, `helloSubLabel`, `textAreaPlaceholder` | Saudação exibida antes da primeira mensagem e o espaço reservado (placeholder) da caixa de mensagens. |
| `suggestionButtons` | Botões com prompts prontos, cada um com um `label` e o `prompt` que envia. |
| `languageCode` | Idioma da interface do chat. |
| `customStyles`, `customScripts` | Seu próprio CSS e JavaScript, adicionados à página hospedada. |
| `showToolCalls` | Mostra a atividade das ferramentas na conversa. Ligado por padrão. |
| `debug` | Mostra informações de diagnóstico para solução de problemas e habilita `/usage` nas integrações. Desligado por padrão; desligue-o novamente após o uso. |

## Anexos e áudio

`inputModes` seleciona o que os usuários podem anexar: `Image`, `Document` e `Audio`. Ative `uploadUnsupportedFiles` para também aceitar tipos de arquivo que a AIVAX não consegue ler, enviados como arquivos genéricos.

Imagens, arquivos, vídeos e áudio anexados são processados antes da inferência. Eles são encaminhados como conteúdo multimodal quando o modelo e a configuração do gateway os suportam. Quando um canal não consegue passar um anexo adiante, a AIVAX o substitui por um aviso em texto, para que o assistente ainda possa responder claramente.

Para responder com áudio, defina `audioSynthesisSource` como o `name` de um modelo de texto para fala, conforme listado por **Get Speech Models** na referência da API. O padrão, `None`, desliga as respostas de áudio. Opcionalmente, defina `audioSynthesisVoice` e `audioSynthesisInstruction` para escolher a voz e como ela fala. Ative `summarizeTextBeforeAudioSynthesis` para ler um resumo de respostas longas em vez do texto completo. As respostas de áudio estão disponíveis apenas no chat web hospedado, não em integrações. Veja [Speech](https://docs.aivax.net/pt-br/docs/generations/speech.md) para vozes e preços.

## Enviando prompts do seu aplicativo

Use **Send Prompt** quando seu aplicativo precisar de uma resposta usando uma sessão de cliente de chat existente. A chave de acesso da sessão autoriza a solicitação; mantenha-a privada. A solicitação usa o histórico da sessão e a configuração associada do Gateway de IA.

Para inferências de longa duração, envie `POST /api/v1/public/chat-clients/<access-key>/prompt` para `https://direct.inference.aivax.net` para contornar o caminho do Cloudflare Tunnel. Configure o tempo limite do seu cliente HTTP para a duração esperada da geração. O domínio direto expõe rotas selecionadas, não toda a API do cliente de chat; veja [endpoints disponíveis no host direto](https://docs.aivax.net/pt-br/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Escolher o formato de entrada

O `prompt` obrigatório aceita texto simples, um objeto de mensagem compatível com OpenAI ou um array ordenado de objetos de mensagem. Texto simples se torna uma mensagem do usuário. Use objetos de mensagem para conteúdo multimodal ou resultados de ferramentas, e um array quando várias mensagens devem ser fornecidas juntas. Pelo menos uma mensagem deve conter conteúdo ou chamadas de ferramenta.

A resposta contém `completionText`, `reasoning` quando disponível, `toolCalls` para seu aplicativo executar, `usage` e `createdMessages`. O último campo contém apenas as mensagens geradas durante esta solicitação, em ordem de geração — não as mensagens enviadas nem o histórico anterior da sessão. Suas mensagens usam o formato compatível com OpenAI e podem incluir chamadas de ferramenta, resultados de ferramentas, raciocínio e metadados por mensagem.

`completionText` é o texto da última mensagem do assistente em `createdMessages`, não uma concatenação do turno: após uma chamada de ferramenta, ele contém apenas a resposta final. Ele retorna ao texto de inferência acumulado quando a última mensagem do assistente está ausente ou vazia, portanto, um turno apenas de chamada de ferramenta pode retornar um `completionText` vazio — verifique `toolCalls` para decidir se deve continuar.

### Decidir se salva o turno

`commit` vem como padrão `true`: as mensagens enviadas e as mensagens geradas são salvas na sessão. Use `commit: false` para uma inferência única contra o histórico atual sem salvar esse turno. Você ainda recebe a conclusão e `createdMessages`.

Esta não é uma simulação (dry run): a inferência ainda é cobrada e as ferramentas ainda podem agir. Mensagens não comprometidas ficam fora do histórico posterior da sessão — para continuar esse ramo, reenvie-as em um array `prompt` ordenado.

### Adicionar contexto para uma inferência

Use `instructions` para contexto que deve aplicar-se apenas à solicitação atual, como um formato de resposta temporário ou o item atualmente selecionado no seu aplicativo. Aceita uma string ou um array de strings; as entradas do array são unidas com linhas em branco. Este contexto é anexado às instruções do sistema após o `extraContext` da sessão e qualquer contexto carregado de `contextLocation`.

Ao contrário do `extraContext` da sessão, `instructions` não é salvo como contexto da sessão, mesmo quando `commit` é `true`. Ele ainda é enviado ao modelo e pode influenciar respostas e ferramentas; não inclua segredos ou dados que o modelo não deveria ver. Para contexto que deve durar toda a conversa, use o `extraContext` da sessão; veja [Escolher onde colocar o contexto](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).

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

Use `context` para fornecer ao modelo material que pertence apenas ao turno atual, como uma captura de tela do que o usuário está vendo, um documento que ele selecionou, um pequeno clipe de áudio ou texto extraído do seu aplicativo. Aceita:

- uma string, que se torna uma parte de texto;
- uma parte de conteúdo compatível com OpenAI: `text`, `image_url`, `input_audio`, `video_url` ou `file`;
- um array misturando strings e partes de conteúdo.

As partes são inseridas no início da última mensagem do usuário da conversa, antes do conteúdo do próprio usuário. Quando uma ferramenta retornou mídia em uma etapa anterior, o contexto ainda vai para a mensagem escrita pelo usuário, não pela saída da ferramenta.

O contexto é descartável: nunca é salvo no histórico da sessão ou na conversa armazenada, mesmo quando `commit` é `true`, e não é retornado em `createdMessages`. Envie-o novamente em cada solicitação que precisar dele. As partes de mídia seguem as mesmas regras que os anexos em `prompt`: elas são encaminhadas como conteúdo multimodal ou convertidas em texto de acordo com o modelo e as configurações multimodais do gateway, e esse processamento é cobrado normalmente.

`context` é a maneira amigável ao cache de enviar informações mutáveis. Ao contrário de `extraContext` e `instructions`, ele não altera as instruções do sistema, portanto, a parte em cache da conversa é mantida até a última mensagem do usuário. Como todo outro campo de contexto, é enviado ao modelo: não inclua segredos ou dados que o modelo não deveria ver.

Use `context` para informações, não para instruções. Por fazer parte da mensagem do usuário, o modelo trata isso como entrada do usuário: diretrizes como "ignorar regras anteriores" ou "sempre responda em JSON" podem ser ignoradas ou interpretadas como uma tentativa de jailbreak e recusadas. Coloque regras de comportamento, formatos de resposta e outras diretrizes em `instructions` ou no `extraContext` da sessão, que são adicionados às instruções do sistema.

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

Quando o provedor do modelo falha temporariamente antes de enviar qualquer saída, a AIVAX retrya a solicitação automaticamente, até três vezes.

### Completar chamadas de ferramentas do lado do cliente

1. Configure a ferramenta desejada do lado do cliente no Gateway de IA, ou envie-a no campo `tools` da solicitação, e envie um prompt.
2. Quando `toolCalls` não estiver vazio, execute a função solicitada no seu aplicativo. Cada entrada expõe `id`, `functionName`, `contents` (argumentos codificados em JSON) e `isProtocolFunction`. Valide os argumentos e imponha as permissões do seu aplicativo antes da execução.
3. Envie um novo prompt com uma mensagem `role: "tool"`. Defina `tool_call_id` como o `id` da chamada retornada, `name` como seu `functionName` e `content` como o resultado da ferramenta como texto. Para múltiplas chamadas, envie um array de mensagens de resultado correspondentes.
4. Leia a próxima conclusão ou repita se solicitar mais ferramentas.

Com o `commit: true` padrão, a mensagem de chamada de ferramenta do assistente já está na sessão: envie apenas os resultados da ferramenta, sem duplicar essa mensagem do assistente. Se a solicitação anterior usou `commit: false`, inclua as mensagens de conversa não salvas — incluindo a mensagem do assistente contendo `tool_calls` — antes dos resultados. As entradas de nível superior `toolCalls` não são objetos de mensagem; use as mensagens compatíveis com OpenAI em `createdMessages` ao reconstruir esse intercâmbio.

Use o campo `tools` da solicitação para ferramentas do lado do cliente que se aplicam apenas a essa inferência, como uma ação disponível na tela em que o usuário está. Ela aceita ferramentas de função compatíveis com OpenAI, adicionadas às ferramentas do Gateway de IA apenas para essa solicitação; elas não são salvas na sessão. Elas permanecem visíveis mesmo quando o gateway oculta ferramentas sem uma habilidade, e seus nomes não devem repetir um nome de ferramenta do gateway. Envie os mesmos `tools` novamente na solicitação que submete os resultados, para que o modelo possa chamá-los novamente na próxima etapa.

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

Para ferramentas do lado do servidor, a AIVAX executa as ferramentas e continua a geração dentro da mesma solicitação. `createdMessages` pode portanto conter uma chamada de ferramenta do assistente, seu resultado de ferramenta e a resposta final do assistente, enquanto `toolCalls` de nível superior está vazio. Não execute essas chamadas do lado do servidor novamente. A referência da API acima inclui exemplos para conclusões simples, chamadas do lado do cliente, resultados do lado do cliente submetidos e múltiplas mensagens de chamada do lado do servidor.

## Outras rotas de sessão

Com a chave de acesso da sessão, seu aplicativo também pode usar estas rotas, descritas na referência da API:

- **Get Session Info** retorna as mensagens e a configuração do cliente, para renderizar a conversa na sua própria interface.
- **Retry Last Message** remove tudo após a última mensagem do usuário, para que o usuário possa tentar novamente a partir daí.
- **Download Session Transcript** exporta as mensagens, contexto, metadados e token da conversa como JSON.
