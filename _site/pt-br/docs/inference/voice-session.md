Source: https://docs.aivax.net/pt-br/docs/inference/voice-session.html

# Sessão de Voz

Sessão de Voz é a API de voz com baixa latência e com estado da AIVAX. Ela mantém o endpoint WebSocket autenticado da AIVAX ao conectar-se a um serviço de inferência em tempo real. Os eventos seguem o protocolo JSON GA Realtime compatível com OpenAI após a conexão ser atualizada.

Use a Sessão de Voz para conversas faladas naturais com áudio em streaming, transcrições de fala do assistente, detecção de atividade de voz (VAD) no servidor, interrupções e chamadas de ferramentas. Use [Audio Transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para cargas de trabalho apenas de transcrição ou [Speech Generation](https://docs.aivax.net/pt-br/docs/generations/speech.md) quando o texto a ser sintetizado já for conhecido.

## Conectar com segurança

Abra uma solicitação de upgrade de WebSocket para:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Autentique o upgrade com uma **chave de API privada** da conta:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

O parâmetro de consulta `?api-key=<AIVAX_API_KEY>` também é aceito quando o cliente WebSocket não pode definir cabeçalhos, mas os cabeçalhos são preferidos porque as URLs são comumente registradas em logs e sistemas de monitoramento. Chaves de API públicas não podem abrir Sessões de Voz.

> [!WARNING]
> Nunca coloque uma chave de API privada em JavaScript de navegador, em um pacote de aplicativo móvel ou em uma URL de WebSocket visível ao navegador. Navegadores também não podem adicionar um cabeçalho `Authorization` através do construtor nativo `WebSocket`. Termine a conexão do usuário final em seu backend e, em seguida, deixe esse backend confiável abrir e retransmitir o WebSocket autenticado da AIVAX.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Open%20voice%20session)

## Migrar para eventos GA Realtime

Após o upgrade do WebSocket, troque eventos JSON GA Realtime compatíveis com OpenAI diretamente. Não envie o envelope legado `session_start` nem dependa dos antigos eventos específicos da AIVAX de STT, TTS, segmento WAV ou confirmação de reprodução.

As principais mudanças de migração são:

| Integração legada | Integração GA Realtime |
| --- | --- |
| Mensagem de início de sessão personalizada | `session.update` |
| Eventos personalizados de STT e VAD | Eventos nativos `input_audio_buffer.speech_*`; a transcrição do chamador está atualmente indisponível |
| Segmentos de resposta WAV | PCM Base64 em `response.output_audio.delta` |
| Confirmação de reprodução personalizada | Eventos nativos de cancelamento e truncamento de item de conversa |
| Envelopes de chamada de ferramenta personalizados | Itens de chamada de função nativos e saídas de chamada de função |
| Cobrança fixa por minuto | Taxas de token de texto, áudio e imagem do modelo selecionado |

Use a propriedade `type` para rotear cada evento. O áudio permanece codificado em base64 dentro das mensagens JSON de texto; não envie quadros binários de WebSocket.

## Configurar a sessão

Envie `session.update` como o primeiro evento do cliente. AIVAX suporta os campos de sessão GA Realtime e adiciona dois seletores opcionais:

- `gateway`: um slug de AI Gateway disponível para a conta autenticada;
- `model`: `gpt-realtime-2.1` ou `gpt-realtime-2.1-mini`.

O seletor fornecido no evento determina a configuração da AIVAX usada para a sessão. Configure a voz de saída em `session.audio.output.voice` e o esforço de raciocínio em `session.reasoning.effort`.

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "gateway": "<GATEWAY_SLUG>",
    "model": "gpt-realtime-2.1",
    "instructions": "Ajude o chamador a concluir a tarefa solicitada.",
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

- `gpt-realtime-2.1` para conversas em tempo real da mais alta qualidade;
- `gpt-realtime-2.1-mini` para cargas de trabalho em tempo real de menor custo e mais leves.

Você também pode fornecer instruções padrão GA Realtime, ferramentas e configurações de detecção de turno na mesma atualização. Sessões de transcrição de entrada não são suportadas atualmente, portanto não configure `audio.input.transcription` nem dependa de eventos `conversation.item.input_audio_transcription.*`. Aguarde o evento de confirmação de sessão do servidor antes de considerar a configuração como ativa. Uma voz não pode ser alterada após a sessão já ter produzido áudio; reconecte‑se para selecionar uma voz diferente.

## Transmitir áudio do microfone

Capture PCM mono assinado de 16 bits little‑endian (`s16le`) em 24 000 Hz, codifique cada fragmento em base64 na ordem cronológica de bytes e anexe ao buffer de entrada:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Envie fragmentos pequenos continuamente para baixa latência. Não adicione cabeçalhos WAV, RIFF ou de outros contêineres a cada fragmento. Se a detecção automática de turno estiver habilitada, o VAD do servidor determina quando o usuário começa e para de falar e cria respostas de acordo com a configuração da sessão.

Se a detecção de turno estiver desativada, controle o turno explicitamente com os eventos nativos do buffer:

1. Envie um ou mais eventos `input_audio_buffer.append`.
2. Envie `input_audio_buffer.commit` quando a fala estiver completa.
3. Envie `response.create` para solicitar a resposta do assistente.

Use `input_audio_buffer.clear` para descartar áudio armazenado que não deve se tornar um turno de conversa.

## Receber transcrições e áudio

Manipule o fluxo de eventos nativo GA Realtime em vez de assumir uma sequência fixa. Em particular:

- `input_audio_buffer.speech_started` e `input_audio_buffer.speech_stopped` relatam limites do VAD do servidor;
- Eventos `conversation.item.input_audio_transcription.*` não são emitidos atualmente porque sessões de transcrição de entrada não são suportadas;
- `response.output_audio_transcript.delta` e `response.output_audio_transcript.done` fornecem a transcrição falada do assistente;
- `response.output_audio.delta` transporta um fragmento de áudio PCM em base64;
- `response.output_audio.done` marca o fim de um fluxo de áudio de saída;
- `response.done` relata o status final da resposta e o uso;
- `error` relata um erro de solicitação ou de sessão.

Decodifique cada valor `response.output_audio.delta` como PCM mono assinado de 16 bits little‑endian em 24 000 Hz e enfileire as amostras para reprodução sem lacunas:

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

Os campos dos eventos podem evoluir com o protocolo GA Realtime. Roteie por `type`, mantenha os identificadores necessários para correlacionar respostas e itens e ignore tipos ou campos de evento desconhecidos que seu cliente não utiliza.

## Tratar interrupções

Quando o chamador fala sobre o assistente:

1. Interrompa ou diminua a reprodução local quando o evento confirmado `input_audio_buffer.speech_started` chegar.
2. Envie `response.cancel` se uma resposta ainda estiver sendo gerada.
3. Envie o evento nativo de truncamento de item de conversa com o identificador do item do assistente e a quantidade de áudio que foi realmente reproduzida.

O cancelamento interrompe a geração; o truncamento mantém a conversa do servidor alinhada com o que o chamador ouviu. Acompanhe a duração do áudio reproduzido no cliente em vez de supor que cada fragmento recebido chegou ao alto-falante. Trate corridas de resposta já finalizadas como normais e torne o tratamento de cancelamento idempotente.

## Usar ferramentas

Declare ferramentas do cliente através do campo de sessão padrão GA Realtime `tools`. Manipule `response.function_call_arguments.done` usando seu `response_id`, `call_id`, `name` e `arguments` codificado em JSON. Execute cada função solicitada, adicione um item de conversa nativo `function_call_output` por `call_id` e, em seguida, envie um único `response.create` após o `response.done` originário e depois que cada chamada dessa resposta tiver uma saída.

Ferramentas configuradas como `InternalFunctions` do servidor AIVAX são executadas dentro da AIVAX e não requerem ação do cliente. Ferramentas definidas pelo cliente continuam a ser retornadas normalmente e permanecem sob responsabilidade do cliente.

Seu manipulador de ferramentas deve validar argumentos, preservar identificadores de chamada, aplicar limites de tempo e retornar um erro útil quando a execução falhar. Não aguarde um resultado de ferramenta do cliente que está sendo executado como função do servidor AIVAX.

## Faturamento e limites

Para preços, disponibilidade e limites de conta atuais, veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).

## Desconectar graciosamente

Uma Sessão de Voz dura apenas enquanto o WebSocket está ativo. Não é possível retomar após a desconexão.

Para um encerramento normal:

1. Interrompa a captura do microfone e pare de enviar áudio.
2. Deixe que qualquer troca de resposta ou resultado de ferramenta necessária termine, ou cancele-a explicitamente.
3. Interrompa e esvazie a reprodução local conforme adequado para a experiência do produto.
4. Feche o WebSocket com um código de encerramento normal.
5. Libere dispositivos de áudio, filas de reprodução, chamadas pendentes e o estado da sessão.

Manipule fechamento de peer, perda de rede, falha de autenticação, erros de modelo e encerramento do servidor como resultados terminais da sessão. Reconectar inicia uma nova sessão: abra um novo WebSocket autenticado, envie um novo `session.update` e reconstrua qualquer contexto de aplicação que sua experiência exija. Use tentativa limitada com backoff para falhas transitórias, mas não repita automaticamente autenticação ou erros de configuração.
