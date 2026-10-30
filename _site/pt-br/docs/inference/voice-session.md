Source: https://docs.aivax.net/pt-br/docs/inference/voice-session.html

# Voz e Tempo Real

A Sessão de Voz é a API de voz com baixa latência e estado persistente da AIVAX. Seu cliente se conecta a um ponto de extremidade WebSocket autenticado da AIVAX, e a AIVAX conecta a sessão a um serviço de inferência em tempo real. Após a atualização da conexão, os eventos seguem o protocolo JSON GA Realtime compatível com OpenAI.

Use a Sessão de Voz para conversas faladas naturais com áudio em streaming, transcrições da fala do assistente, detecção de atividade de voz (VAD) no servidor, interrupções e chamadas de ferramentas. Use [Transcrições de Áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para cargas de trabalho apenas de transcrição ou [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) quando o texto a ser sintetizado já for conhecido.

## Conecte-se com segurança

Abra uma solicitação de atualização WebSocket para:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Autentique a atualização com uma chave de API de conta **privada**:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

O parâmetro de consulta `?api-key=<AIVAX_API_KEY>` também é aceito quando o cliente WebSocket não pode definir cabeçalhos, mas os cabeçalhos são preferidos porque as URLs são comumente retidas em logs e sistemas de monitoramento. Chaves de API públicas não podem abrir Sessões de Voz.

> [!WARNING]
> Nunca coloque uma chave de API privada no JavaScript do navegador, em um pacote de aplicativo móvel ou em uma URL WebSocket visível pelo navegador. Os navegadores também não podem adicionar um cabeçalho `Authorization` por meio do construtor nativo `WebSocket`. Encerre a conexão do usuário final em seu backend, deixe que esse backend confiável abra e retransmita o WebSocket autenticado da AIVAX.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Open%20voice%20session)

## Migre para eventos GA Realtime

Após a atualização do WebSocket, troque eventos JSON GA Realtime compatíveis com OpenAI diretamente. Não envie o envelope legado `session_start` nem dependa dos antigos eventos específicos da AIVAX de STT, TTS, segmento WAV ou confirmação de reprodução.

As principais alterações de migração são:

| Integração legada | Integração GA Realtime |
| --- | --- |
| Mensagem personalizada de início de sessão | `session.update` |
| Eventos personalizados de STT e VAD | Eventos nativos `input_audio_buffer.speech_*`; a transcrição do interlocutor atualmente não está disponível |
| Segmentos de resposta WAV | PCM Base64 em `response.output_audio.delta` |
| Confirmação de reprodução personalizada | Eventos nativos de cancelamento e truncamento de item de conversa |
| Envelopes personalizados de chamada de ferramenta | Itens de chamada de função e saídas de chamada de função nativas |
| Cobrança plana por minuto | Taxas de token de texto, áudio e imagem do modelo selecionado |

Use a propriedade `type` para rotear cada evento. O áudio permanece codificado em base64 dentro de mensagens de texto JSON; não envie quadros WebSocket binários.

## Configure a sessão

Envie `session.update` como o primeiro evento do cliente. A AIVAX suporta os campos de sessão GA Realtime e adiciona dois seletores opcionais:

- `gateway`: um slug do Gateway de IA disponível para a conta autenticada;
- `model`: `gpt-realtime-2.1` ou `gpt-realtime-2.1-mini`.

O fornecido no evento determina a configuração da AIVAX usada para a sessão. Configure a voz de saída em `session.audio.output.voice` e o esforço de raciocínio em `session.reasoning.effort`.

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "gateway": "<GATEWAY_SLUG>",
    "model": "gpt-realtime-2.1",
    "instructions": "Ajude o interlocutor a concluir a tarefa solicitada.",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "turn_detection": {
          "type": "server_vad"
        }
      },
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "marin"
      }
    },
    "reasoning": {
      "effort": "low"
    }
  }
}
```

Escolha o modelo com base na experiência que você precisa:

- `gpt-realtime-2.1` para conversas em tempo real de mais alta qualidade;
- `gpt-realtime-2.1-mini` para cargas de trabalho em tempo real de menor custo e mais leves.

Você também pode fornecer instruções padrão, ferramentas e configurações de detecção de turno do GA Realtime na mesma atualização. Sessões de transcrição de entrada não são suportadas atualmente, portanto, não configure `audio.input.transcription` nem dependa dos eventos `conversation.item.input_audio_transcription.*`. Aguarde o evento de confirmação de sessão do servidor antes de considerar a configuração ativa. Uma voz não pode ser alterada após a sessão já ter produzido áudio; reconecte-se para selecionar uma voz diferente.

## Transmita áudio do microfone

Capture o áudio do microfone como PCM bruto mono assinado de 16 bits little-endian (`s16le`) a 24.000 Hz. Codifique em base64 cada chunk em ordem cronológica de bytes e anexe-o ao buffer de entrada:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Envie chunks pequenos continuamente para baixa latência. Não adicione cabeçalhos de contêiner WAV, RIFF ou outros a cada chunk. Se a detecção automática de turno estiver habilitada, o VAD do servidor determina quando o usuário começa e para de falar e cria respostas de acordo com a configuração da sessão.

Se a detecção de turno estiver desabilitada, controle o turno explicitamente com os eventos nativos do buffer:

1. Envie um ou mais eventos `input_audio_buffer.append`.
2. Envie `input_audio_buffer.commit` quando a utterance estiver completa.
3. Envie `response.create` para solicitar a resposta do assistente.

Use `input_audio_buffer.clear` para descartar o áudio em buffer que não deve se tornar um turno de conversa.

## Receba transcrições e áudio

Lide com o fluxo de eventos nativos do GA Realtime em vez de assumir uma sequência fixa. Em particular:

- `input_audio_buffer.speech_started` e `input_audio_buffer.speech_stopped` relatam limites do VAD do servidor;
- os eventos `conversation.item.input_audio_transcription.*` não são emitidos atualmente porque sessões de transcrição de entrada não são suportadas;
- `response.output_audio_transcript.delta` e `response.output_audio_transcript.done` fornecem a transcrição falada do assistente;
- `response.output_audio.delta` carrega um chunk de áudio PCM base64;
- `response.output_audio.done` marca o fim de um fluxo de áudio de saída;
- `response.done` relata o status final da resposta e o uso;
- `error` relata um erro de solicitação ou sessão.

Decodifique cada valor `response.output_audio.delta` como PCM bruto mono assinado de 16 bits little-endian a 24.000 Hz e enfileire as amostras para reprodução sem lacunas:

```json
{
  "type": "response.output_audio.delta",
  "response_id": "<RESPONSE_ID>",
  "item_id": "<ITEM_ID>",
  "output_index": 0,
  "content_index": 0,
  "delta": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Os campos de evento podem evoluir com o protocolo GA Realtime. Roteie por `type`, retenha os identificadores necessários para correlacionar respostas e itens, e ignore tipos ou campos de evento desconhecidos que seu cliente não usa.

## Lide com interrupções

Quando o interlocutor fala sobre o assistente:

1. Pare ou reduza o volume da reprodução local quando o evento confirmado `input_audio_buffer.speech_started` chegar.
2. Envie `response.cancel` se uma resposta ainda estiver sendo gerada.
3. Envie o evento nativo de truncamento de item de conversa com o identificador do item do assistente e a quantidade de áudio que foi realmente reproduzida.

O cancelamento interrompe a geração; o truncamento mantém a conversa do servidor alinhada com o que o interlocutor ouviu. Acompanhe a duração do áudio reproduzido no cliente em vez de assumir que cada chunk recebido chegou ao alto-falante. Trate corridas de resposta já concluídas como normais e torne o tratamento de cancelamento idempotente. Para um livro-caixa do lado do cliente que calcula a duração reproduzida por item, e as maneiras comuns pelas quais o deslocamento dá errado, consulte [tratando interrupções da API Realtime com conversation.item.truncate](https://aivax.net/blog/openai-realtime-api-interruptions-conversation-item-truncate/).

## Use ferramentas

Declare ferramentas do cliente por meio do campo de sessão `tools` padrão do GA Realtime. Quando o modelo chama uma delas:

1. Lidere com `response.function_call_arguments.done` usando seu `response_id`, `call_id`, `name` e `arguments` codificados em JSON.
2. Execute cada função solicitada.
3. Adicione um item de conversa nativo `function_call_output` por `call_id`.
4. Envie um único `response.create` após a chegada do `response.done` originário e todas as chamadas dessa resposta tiverem uma saída.

Ferramentas configuradas como `InternalFunctions` do servidor AIVAX executam dentro da AIVAX e não exigem ação do cliente. Ferramentas definidas pelo cliente continuam sendo retornadas normalmente e permanecem sob responsabilidade do cliente.

Seu manipulador de ferramentas deve validar argumentos, preservar identificadores de chamada, impor tempos limite e retornar um resultado de erro útil quando a execução falhar. Não aguarde um resultado de ferramenta do cliente que esteja sendo executado como uma função do servidor AIVAX.

## Faturamento e limites

As Sessões de Voz são faturadas nas taxas do modelo de tempo real selecionado, usando seus preços de token de texto, áudio e imagem. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

As Sessões de Voz estão sujeitas ao acesso ao modelo aplicável, saldo e limites de inferência da conta (consulte [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md)), e não às cotas de solicitação independentes de texto-para-fala e transcrição de áudio. A transcrição de entrada não é atualmente suportada dentro das Sessões de Voz.

## Desconecte-se gracefulmente

Uma Sessão de Voz dura apenas enquanto o WebSocket estiver ativo. Ela não é retomável após a desconexão.

Para um desligamento normal:

1. Pare a captura do microfone e pare de enviar áudio.
2. Deixe qualquer resposta ou troca de resultado de ferramenta necessária terminar, ou cancele-a explicitamente.
3. Pare e esvazie a reprodução local conforme apropriado para a experiência do produto.
4. Feche o WebSocket com um código de fechamento normal.
5. Libere dispositivos de áudio, filas de reprodução, chamadas pendentes e estado da sessão.

Trate o fechamento do peer, perda de rede, falha de autenticação, erros de modelo e desligamento do servidor como resultados finais da sessão. Reconectar-se inicia uma nova sessão: abra um novo WebSocket autenticado, envie um novo `session.update` e reconstrua qualquer contexto de aplicativo que sua experiência exija. Use retry limitado com backoff para falhas transitórias, mas não tente novamente automaticamente erros de autenticação ou configuração.
