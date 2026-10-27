Source: https://docs.aivax.net/pt-br/docs/inference/voice-session.html

# Voz e Em Tempo Real

Voice Session é a API de voz com baixa latência e estado da AIVAX. Seu cliente se conecta a um endpoint WebSocket autenticado da AIVAX, e a AIVAX conecta a sessão a um serviço de inferência em tempo real. Após a atualização da conexão, os eventos seguem o protocolo JSON GA Realtime compatível com OpenAI.

Use Voice Session para conversas faladas naturais com áudio em streaming, transcrições de fala do assistente, detecção de atividade de voz (VAD) no servidor, interrupções e chamadas de ferramentas. Use [Audio Transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para cargas de trabalho apenas de transcrição ou [Speech Generation](https://docs.aivax.net/pt-br/docs/generations/speech.md) quando o texto a ser sintetizado já for conhecido.

## Conectar com segurança

Abra uma requisição de atualização de WebSocket para:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Autentique a atualização com uma chave de API de conta **privada**:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

O parâmetro de consulta `?api-key=<AIVAX_API_KEY>` também é aceito quando o cliente WebSocket não pode definir cabeçalhos, mas os cabeçalhos são preferidos porque URLs geralmente são mantidas em logs e sistemas de monitoramento. Chaves de API públicas não podem abrir Voice Sessions.

> [!WARNING]
> Nunca coloque uma chave de API privada em JavaScript de navegador, em um pacote de aplicativo móvel ou em uma URL de WebSocket visível ao navegador. Navegadores também não podem adicionar um cabeçalho `Authorization` através do construtor nativo `WebSocket`. Termine a conexão do usuário final no seu backend e, então, deixe esse backend confiável abrir e retransmitir o WebSocket autenticado da AIVAX.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Open%20voice%20session)

## Migrar para eventos GA Realtime

Após a atualização do WebSocket, troque eventos JSON GA Realtime compatíveis com OpenAI diretamente. Não envie o envelope legado `session_start` nem dependa dos antigos eventos específicos da AIVAX de STT, TTS, segmento WAV ou confirmação de reprodução.

As principais mudanças de migração são:

| Integração legada | Integração GA Realtime |
| --- | --- |
| Mensagem personalizada de início de sessão | `session.update` |
| Eventos personalizados de STT e VAD | Eventos nativos `input_audio_buffer.speech_*`; transcrição do chamador não está disponível |
| Segmentos de resposta WAV | PCM Base64 em `response.output_audio.delta` |
| Confirmação de reprodução personalizada | Eventos nativos de cancelamento e truncamento de item de conversa |
| Envelopes de chamada de ferramenta personalizados | Itens nativos de chamada de função e saídas de chamada de função |
| Cobrança plana por minuto | Taxas de token de texto, áudio e imagem do modelo selecionado |

Use a propriedade `type` para rotear cada evento. O áudio permanece codificado em base64 dentro de mensagens de texto JSON; não envie quadros binários de WebSocket.

## Configurar a sessão

Envie `session.update` como o primeiro evento do cliente. A AIVAX suporta os campos de sessão GA Realtime e adiciona dois seletores opcionais:

- `gateway`: um slug de **gateway de IA** disponível para a conta autenticada;
- `model`: `gpt-realtime-2.1` ou `gpt-realtime-2.1-mini`.

O seletor fornecido no evento determina a configuração da AIVAX usada para a sessão. Configure a voz de saída em `session.audio.output.voice` e o esforço de raciocínio em `session.reasoning.effort`.

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "gateway": "<GATEWAY_SLUG>",
    "model": "gpt-realtime-2.1",
    "instructions": "Help the caller complete the requested task.",
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

- `gpt-realtime-2.1` para as conversas em tempo real de maior qualidade;
- `gpt-realtime-2.1-mini` para cargas de trabalho em tempo real mais leves e de menor custo.

Você também pode fornecer instruções GA Realtime padrão, ferramentas e configurações de detecção de turno na mesma atualização. Sessões de transcrição de entrada ainda não são suportadas, portanto não configure `audio.input.transcription` nem dependa de eventos `conversation.item.input_audio_transcription.*`. Aguarde o evento de confirmação da sessão do servidor antes de tratar a configuração como ativa. A voz não pode ser alterada após a sessão já ter gerado áudio; reconecte‑se para selecionar uma voz diferente.

## Transmitir áudio do microfone

Capture o áudio do microfone como PCM mono assinado de 16 bits little‑endian (`s16le`) a 24.000 Hz. Codifique cada bloco em base64 na ordem cronológica de bytes e anexe ao buffer de entrada:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Envie blocos pequenos continuamente para baixa latência. Não adicione cabeçalhos WAV, RIFF ou de outros contêineres a cada bloco. Se a detecção automática de turno estiver habilitada, o VAD do servidor determina quando o usuário começa e para de falar e cria respostas de acordo com a configuração da sessão.

Se a detecção de turno estiver desativada, controle o turno explicitamente com os eventos nativos do buffer:

1. Envie um ou mais eventos `input_audio_buffer.append`.
2. Envie `input_audio_buffer.commit` quando a fala estiver completa.
3. Envie `response.create` para solicitar a resposta do assistente.

Use `input_audio_buffer.clear` para descartar áudio em buffer que não deve se tornar um turno de conversa.

## Receber transcrições e áudio

Manipule o stream de eventos GA Realtime nativo ao invés de assumir uma sequência fixa. Em particular:

- `input_audio_buffer.speech_started` e `input_audio_buffer.speech_stopped` relatam limites do VAD do servidor;
- eventos `conversation.item.input_audio_transcription.*` não são emitidos atualmente porque sessões de transcrição de entrada não são suportadas;
- `response.output_audio_transcript.delta` e `response.output_audio_transcript.done` fornecem a transcrição falada do assistente;
- `response.output_audio.delta` transporta um bloco de áudio PCM em base64;
- `response.output_audio.done` marca o fim de um stream de áudio de saída;
- `response.done` relata o status final da resposta e o uso;
- `error` relata um erro de requisição ou de sessão.

Decodifique cada valor `response.output_audio.delta` como PCM mono assinado de 16 bits little‑endian a 24.000 Hz e enfileire as amostras para reprodução sem intervalos:

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

Os campos dos eventos podem evoluir com o protocolo GA Realtime. Roteie por `type`, mantenha os identificadores necessários para correlacionar respostas e itens, e ignore tipos ou campos de evento desconhecidos que seu cliente não utiliza.

## Tratar interrupções

Quando o chamador fala sobre o assistente:

1. Interrompa ou diminua a reprodução local quando o evento confirmado `input_audio_buffer.speech_started` chegar.
2. Envie `response.cancel` se uma resposta ainda estiver sendo gerada.
3. Envie o evento nativo de truncamento de item de conversa com o identificador do item do assistente e a quantidade de áudio que foi realmente reproduzida.

O cancelamento interrompe a geração; o truncamento mantém a conversa do servidor alinhada ao que o chamador ouviu. Acompanhe a duração do áudio reproduzido no cliente ao invés de supor que cada bloco recebido chegou ao alto-falante. Trate corridas de resposta já finalizadas como normais e torne o tratamento de cancelamento idempotente.

## Usar ferramentas

Declare ferramentas do cliente através do campo de sessão GA Realtime padrão `tools`. Quando o modelo chamar uma delas:

1. Manipule `response.function_call_arguments.done` usando seu `response_id`, `call_id`, `name` e `arguments` codificado em JSON.
2. Execute cada função solicitada.
3. Adicione um item de conversa nativo `function_call_output` por `call_id`.
4. Envie um único `response.create` após o `response.done` originário chegar e cada chamada daquela resposta possuir uma saída.

Ferramentas configuradas como `InternalFunctions` do servidor AIVAX são executadas dentro da AIVAX e não requerem ação do cliente. Ferramentas definidas pelo cliente continuam sendo retornadas normalmente e permanecem sob responsabilidade do cliente.

Seu manipulador de ferramenta deve validar argumentos, preservar identificadores de chamada, impor limites de tempo e retornar um erro útil quando a execução falhar. Não aguarde um resultado de ferramenta cliente que está sendo executado como função do servidor AIVAX.

## Cobrança e limites

Voice Sessions são cobradas nas taxas do modelo em tempo real selecionado, usando seus preços de token de texto, áudio e imagem. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

Voice Sessions estão sujeitas ao acesso ao modelo, saldo e limites de inferência aplicáveis à conta (veja [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md)), não aos limites de solicitações autônomas de texto‑para‑fala e transcrição de áudio. Transcrição de entrada não é suportada atualmente dentro de Voice Sessions.

## Desconectar graciosamente

Uma Voice Session dura apenas enquanto o WebSocket está ativo. Não é possível retomar após a desconexão.

Para um encerramento normal:

1. Pare a captura do microfone e pare de enviar áudio.
2. Deixe qualquer troca de resposta ou resultado de ferramenta necessária terminar, ou cancele-a explicitamente.
3. Pare e esvazie a reprodução local conforme adequado à experiência do produto.
4. Feche o WebSocket com um código de fechamento normal.
5. Libere dispositivos de áudio, filas de reprodução, chamadas pendentes e estado da sessão.

Manipule o fechamento do par, perda de rede, falha de autenticação, erros de modelo e encerramento do servidor como resultados terminais da sessão. Reconectar inicia uma nova sessão: abra um novo WebSocket autenticado, envie um novo `session.update` e reconstrua qualquer contexto de aplicação que sua experiência exigir. Use tentativa limitada com backoff para falhas transitórias, mas não repita automaticamente autenticação ou erros de configuração.
