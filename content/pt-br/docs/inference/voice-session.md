---
{title: Voz e Tempo Real,linkTitle: Voz e Tempo Real,weight: 50,group: Inference,sourceHash: 55ca2dcbf7aa43c8,aliases: [/docs/pt-br/inference/voice-session.html]}
---

# Voz e Tempo Real

A Sessão de Voz é a API de voz com baixa latência e estado persistente da AIVAX. Use-a para uma conversa falada ao vivo. Seu cliente abre um WebSocket autenticado e troca eventos usando o protocolo JSON GA Realtime compatível com OpenAI.

Escolha a Sessão de Voz quando o chamador e o assistente devem falar na mesma sessão. Ela suporta:

- streaming de áudio;
- transcrições da fala do assistente;
- detecção de atividade de voz no servidor (VAD);
- interrupções;
- chamadas de ferramentas.

Use uma API diferente quando o trabalho não for uma conversa ao vivo:

- [Transcrições de Áudio](/docs/pt-br/generations/audio-transcriptions) para cargas de trabalho apenas de transcrição.
- [Geração de Fala](/docs/pt-br/generations/speech) quando o texto a ser sintetizado já é conhecido.

## Conecte-se com segurança

Abra a sessão antes de enviar qualquer evento em tempo real. Use um backend confiável quando o cliente não puder manter a chave de API privada em segredo.

Abra uma solicitação de upgrade de WebSocket para:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Autentique o upgrade com uma chave de API de conta **privada**:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

Prefira o cabeçalho `Authorization`. A AIVAX também aceita `?api-key=<AIVAX_API_KEY>` quando o cliente WebSocket não pode definir cabeçalhos. Os cabeçalhos são preferidos porque as URLs são comumente retidas em logs e sistemas de monitoramento. Chaves de API públicas não podem abrir Sessões de Voz.

> [!WARNING]
> Nunca coloque uma chave de API privada no JavaScript do navegador, em um pacote de aplicativo móvel ou em uma URL de WebSocket visível no navegador. Os navegadores também não podem adicionar um cabeçalho `Authorization` por meio do construtor nativo `WebSocket`.
>
> Encerre a conexão do usuário final no seu backend. Em seguida, deixe que esse backend confiável abra e retransmita o WebSocket autenticado da AIVAX.

<script src="https://inference.aivax.net/apidocs?embed-target=Open%20voice%20session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Migre para eventos GA Realtime

Use esta seção se seu cliente ainda enviar o envelope legado `session_start` ou depender dos antigos eventos específicos da AIVAX de STT, TTS, segmento WAV ou confirmação de reprodução. Após o upgrade do WebSocket, troque eventos JSON GA Realtime diretamente.

As principais alterações de migração são:

| Integração legada | Integração GA Realtime |
| --- | --- |
| Mensagem personalizada de início de sessão | `session.update` |
| Eventos personalizados de STT e VAD | Eventos nativos `input_audio_buffer.speech_*`; a transcrição do chamador atualmente não está disponível |
| Segmentos de resposta WAV | PCM Base64 em `response.output_audio.delta` |
| Confirmação de reprodução personalizada | Eventos nativos de cancelamento e truncamento de item de conversa |
| Envelopes personalizados de chamada de ferramenta | Itens de chamada de função e saídas de chamada de função nativas |
| Cobrança plana por minuto | Taxas de tokens de texto, áudio e imagem do modelo selecionado |

Encaminhe cada evento por seu `type`. O áudio permanece codificado em base64 dentro das mensagens de texto JSON. Não envie quadros WebSocket binários.

## Configure a sessão

`session.update` é como você escolhe o gateway ou modelo e define a voz. Envie-o como o primeiro evento do cliente.

A AIVAX suporta os campos de sessão GA Realtime e adiciona dois seletores opcionais:

- `gateway`: um slug do AI Gateway disponível para a conta autenticada;
- `model`: `@openai/gpt-realtime-2.1` ou `@openai/gpt-realtime-2.1-mini`.

O seletor no evento determina a configuração da AIVAX usada para a sessão. Defina a voz de saída em `session.audio.output.voice`. Defina o esforço de raciocínio em `session.reasoning.effort`.

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "gateway": "<GATEWAY_SLUG>",
    "model": "@openai/gpt-realtime-2.1",
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

- `@openai/gpt-realtime-2.1` para conversas em tempo real de mais alta qualidade;
- `@openai/gpt-realtime-2.1-mini` para cargas de trabalho em tempo real de menor custo e mais leves.

Você também pode definir instruções padrão, ferramentas e configurações de detecção de turno do GA Realtime na mesma atualização.

Antes de transmitir áudio:

- Sessões de transcrição de entrada não são suportadas atualmente. Não configure `audio.input.transcription`. Não dependa dos eventos `conversation.item.input_audio_transcription.*`.
- Aguarde o evento de confirmação de sessão do servidor antes de considerar a configuração ativa.
- Uma voz não pode ser alterada depois que a sessão já produziu áudio. Reconecte-se para selecionar uma voz diferente.

## Transmita áudio do microfone

Use isso quando o chamador estiver falando e a configuração da sessão estiver ativa. Capture PCM bruto mono assinado de 16 bits little-endian (`s16le`) a 24.000 Hz. Codifique em base64 cada fragmento em ordem cronológica de bytes e anexe-o ao buffer de entrada:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Envie pequenos fragmentos continuamente para baixa latência. Não adicione cabeçalhos de contêiner WAV, RIFF ou outros a cada fragmento.

### Quando a detecção de turno está habilitada

O VAD do servidor determina quando o usuário começa e para de falar e cria respostas de acordo com a configuração da sessão.

### Quando a detecção de turno está desabilitada

Controle o turno explicitamente com os eventos nativos do buffer:

1. Envie um ou mais eventos `input_audio_buffer.append`.
2. Envie `input_audio_buffer.commit` quando a utterance estiver completa.
3. Envie `response.create` para solicitar a resposta do assistente.

Use `input_audio_buffer.clear` para descartar o áudio em buffer que não deve se tornar um turno de conversa.

## Receba transcrições e áudio

Lide com o fluxo de eventos GA Realtime conforme ele chega. Encaminhe por `type` e mantenha os identificadores que vinculam uma resposta aos seus itens.

Em particular:

- `input_audio_buffer.speech_started` e `input_audio_buffer.speech_stopped` relatam limites de VAD do servidor;
- `response.output_audio_transcript.delta` e `response.output_audio_transcript.done` fornecem a transcrição falada do assistente;
- `response.output_audio.delta` carrega um fragmento de áudio PCM base64;
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

Ignore tipos de eventos e campos que seu cliente não usa.

## Lide com interrupções

Use este fluxo quando o chamador falar sobre o assistente. O cancelamento interrompe a geração. O truncamento mantém a conversa do servidor alinhada com o que o chamador ouviu.

1. Pare ou reduza o volume da reprodução local quando o evento confirmado `input_audio_buffer.speech_started` chegar.
2. Envie `response.cancel` se uma resposta ainda estiver sendo gerada.
3. Envie o evento nativo de truncamento de item de conversa com o identificador do item do assistente e a quantidade de áudio que foi realmente reproduzida.

Rastreie a duração do áudio reproduzido no cliente. Não assuma que cada fragmento recebido chegou ao alto-falante.

Torne o tratamento de cancelamento idempotente, pois a resposta já pode ter terminado. Para um livro-caixa do lado do cliente que calcula a duração reproduzida por item, e as maneiras comuns pelas quais o deslocamento falha, consulte [tratando interrupções da API Realtime com conversation.item.truncate](https://aivax.net/blog/openai-realtime-api-interruptions-conversation-item-truncate/).

## Use ferramentas

Declare ferramentas do cliente no campo de sessão `tools` padrão do GA Realtime. Use este caminho quando seu aplicativo precisar executar a função. Quando o modelo chamar uma delas:

1. Lidere com `response.function_call_arguments.done` usando seu `response_id`, `call_id`, `name` e `arguments` codificados em JSON.
2. Execute cada função solicitada.
3. Adicione um item de conversa nativo `function_call_output` por `call_id`.
4. Envie um único `response.create` após o `response.done` de origem chegar e cada chamada dessa resposta tiver uma saída.

Ferramentas que a AIVAX executa no lado do servidor não exigem ação do cliente; apenas as ferramentas definidas pelo cliente são retornadas a você.

Seu manipulador de ferramentas deve:

- validar argumentos;
- preservar identificadores de chamada;
- impor tempos limite;
- retornar um resultado de erro útil quando a execução falhar.

## Faturamento e limites

As Sessões de Voz são cobradas nas taxas do modelo de tempo real selecionado. A cobrança usa os preços de token de texto, áudio e imagem desse modelo. O [multiplicador de plano](/docs/pt-br/pricing#plan-multipliers) se aplica.

O acesso ao modelo, saldo e limites de inferência seguem [Planos e Limites](/docs/pt-br/limits). As Sessões de Voz não usam as cotas de solicitação independentes de texto-para-fala e transcrição de áudio.

## Desconecte-se graciosamente

Uma Sessão de Voz dura apenas enquanto o WebSocket estiver aberto e não pode ser retomada após uma desconexão. Feche-a intencionalmente quando a conversa terminar:

1. Pare a captura do microfone e pare de enviar áudio.
2. Deixe qualquer resposta ou troca de resultado de ferramenta necessária terminar, ou cancele-a explicitamente.
3. Pare e esvazie a reprodução local.
4. Feche o WebSocket com um código de fechamento normal.
5. Libere dispositivos de áudio, filas de reprodução, chamadas pendentes e estado da sessão.

O fechamento do par, perda de rede, falhas de autenticação e erros do modelo também encerram a sessão. Para continuar, abra um novo WebSocket autenticado, envie um novo `session.update` e reconstrua qualquer contexto de aplicativo que sua experiência exija.

Use retry limitado com backoff para falhas transitórias. Não tente novamente automaticamente erros de autenticação ou configuração.
