Source: https://docs.aivax.net/docs/inference/voice-session.html

# Voice and Realtime

Voice Session is AIVAX's low-latency, stateful voice API. Use it for a live spoken conversation. Your client opens an authenticated WebSocket, AIVAX connects that session to a realtime inference service, and events follow the OpenAI-compatible GA Realtime JSON protocol after the upgrade.

Choose Voice Session when the caller and the assistant should speak in the same session. It supports:

- streaming audio;
- assistant speech transcripts;
- server voice activity detection (VAD);
- interruptions;
- tool calls.

Use a different API when the job is not a live conversation:

- [Audio Transcriptions](https://docs.aivax.net/docs/generations/audio-transcriptions.md) for transcription-only workloads.
- [Speech Generation](https://docs.aivax.net/docs/generations/speech.md) when the text to synthesize is already known.

## Connect securely

Open the session before you send any realtime event. Use a trusted backend when the client cannot keep the private API key secret.

Open a WebSocket upgrade request to:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Authenticate the upgrade with a **private** account API key:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

Prefer the `Authorization` header. AIVAX also accepts `?api-key=<AIVAX_API_KEY>` when the WebSocket client cannot set headers. Headers are preferred because URLs are commonly retained in logs and monitoring systems. Public API keys cannot open Voice Sessions.

> [!WARNING]
> Never place a private API key in browser JavaScript, a mobile application bundle, or a browser-visible WebSocket URL. Browsers also cannot add an `Authorization` header through the native `WebSocket` constructor.
>
> Terminate the end-user connection at your backend. Then let that trusted backend open and relay the authenticated AIVAX WebSocket.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Open%20voice%20session)

## Migrate to GA Realtime events

Use this section when an existing client still sends the legacy Voice Session envelope. After the WebSocket upgrade, exchange OpenAI-compatible GA Realtime JSON events directly.

Do not send the legacy `session_start` envelope. Do not depend on the former AIVAX-specific STT, TTS, WAV-segment, or playback-confirmation events.

The main migration changes are:

| Legacy integration | GA Realtime integration |
| --- | --- |
| Custom session-start message | `session.update` |
| Custom STT and VAD events | Native `input_audio_buffer.speech_*` events; caller transcription is currently unavailable |
| WAV response segments | Base64 PCM in `response.output_audio.delta` |
| Custom playback confirmation | Native cancel and conversation-item truncation events |
| Custom tool-call envelopes | Native function-call items and function-call outputs |
| Flat per-minute charge | Selected model's text, audio, and image token rates |

Route every event by its `type`. Audio stays base64-encoded inside JSON text messages. Do not send binary WebSocket frames.

## Configure the session

`session.update` is how you choose the gateway or model and set the voice. Send it as the first client event.

AIVAX supports the GA Realtime session fields and adds two optional selectors:

- `gateway`: an AI Gateway slug available to the authenticated account;
- `model`: `@openai/gpt-realtime-2.1` or `@openai/gpt-realtime-2.1-mini`.

The selector in the event determines the AIVAX configuration used for the session. Set the output voice at `session.audio.output.voice`. Set reasoning effort at `session.reasoning.effort`.

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "gateway": "<GATEWAY_SLUG>",
    "model": "@openai/gpt-realtime-2.1",
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

Choose the model based on the experience you need:

- `@openai/gpt-realtime-2.1` for the highest-quality realtime conversations;
- `@openai/gpt-realtime-2.1-mini` for lower-cost, lighter-weight realtime workloads.

You can also set standard GA Realtime instructions, tools, and turn-detection settings in the same update.

Before you stream audio:

- Input-transcription sessions are not currently supported. Do not configure `audio.input.transcription`. Do not depend on `conversation.item.input_audio_transcription.*` events.
- Wait for the server's session confirmation event before treating the configuration as active.
- A voice cannot be changed after the session has already produced audio. Reconnect to select a different voice.

## Stream microphone audio

Use this when the caller is speaking and the session configuration is active. Capture raw mono signed 16-bit little-endian PCM (`s16le`) at 24,000 Hz. Base64-encode each chunk in chronological byte order and append it to the input buffer:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Send small chunks continuously for low latency. Do not add WAV, RIFF, or other container headers to each chunk.

### When turn detection is enabled

Server VAD determines when the user starts and stops speaking and creates responses according to the session configuration.

### When turn detection is disabled

Control the turn explicitly with the native buffer events:

1. Send one or more `input_audio_buffer.append` events.
2. Send `input_audio_buffer.commit` when the utterance is complete.
3. Send `response.create` to request the assistant response.

Use `input_audio_buffer.clear` to discard buffered audio that should not become a conversation turn.

## Receive transcripts and audio

Handle the native GA Realtime event stream as it arrives. Do not assume one fixed sequence. Route by `type`, and keep the identifiers that tie a response to its items.

In particular:

- `input_audio_buffer.speech_started` and `input_audio_buffer.speech_stopped` report server-VAD boundaries;
- `conversation.item.input_audio_transcription.*` events are not currently emitted because input-transcription sessions are not supported;
- `response.output_audio_transcript.delta` and `response.output_audio_transcript.done` provide the assistant's spoken transcript;
- `response.output_audio.delta` carries a base64 PCM audio chunk;
- `response.output_audio.done` marks the end of an output-audio stream;
- `response.done` reports the final response status and usage;
- `error` reports a request or session error.

Decode each `response.output_audio.delta` value as raw mono signed 16-bit little-endian PCM at 24,000 Hz and queue the samples for gapless playback:

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

Event fields can evolve with the GA Realtime protocol. Ignore unknown event types or fields that your client does not use. Keep the identifiers you need to correlate responses and items.

## Handle interruptions

Use this flow when the caller speaks over the assistant. Cancellation stops generation. Truncation keeps the server conversation aligned with what the caller heard.

1. Stop or duck local playback when the confirmed `input_audio_buffer.speech_started` event arrives.
2. Send `response.cancel` if a response is still being generated.
3. Send the native conversation-item truncation event with the assistant item identifier and the amount of audio that was actually played.

Track played audio duration in the client. Do not assume every received chunk reached the speaker.

Treat already-finished response races as normal, and make cancel handling idempotent. For a client-side ledger that computes the played duration per item, and the common ways that offset goes wrong, see [handling Realtime API interruptions with conversation.item.truncate](https://aivax.net/blog/openai-realtime-api-interruptions-conversation-item-truncate/).

## Use tools

Declare client tools in the standard GA Realtime `tools` session field. Use this path when your application must run the function. When the model calls one of them:

1. Handle `response.function_call_arguments.done` using its `response_id`, `call_id`, `name`, and JSON-encoded `arguments`.
2. Execute each requested function.
3. Add one native `function_call_output` conversation item per `call_id`.
4. Send a single `response.create` after the originating `response.done` arrives and every call from that response has an output.

Tools configured as AIVAX server `InternalFunctions` execute within AIVAX and require no client action. Client-defined tools continue to be returned normally and remain the client's responsibility.

Your tool handler should:

- validate arguments;
- preserve call identifiers;
- enforce timeouts;
- return a useful error result when execution fails.

Do not wait for a client tool result that is being executed as an AIVAX server function.

## Billing and limits

Voice Sessions are billed at the selected realtime model's rates. The charge uses that model's text, audio, and image token prices. The [plan multiplier](https://docs.aivax.net/docs/pricing.md#plan-multipliers) applies.

These account rules also apply:

- Model access, balance, and inference limits follow [Plans and Limits](https://docs.aivax.net/docs/limits.md).
- Voice Sessions do not use the standalone text-to-speech and audio-transcription request quotas.
- Input transcription is not currently supported inside Voice Sessions.

## Disconnect gracefully

A Voice Session lasts only while the WebSocket is open. It is not resumable after disconnect. Close it on purpose when the conversation ends.

For a normal shutdown:

1. Stop microphone capture and stop sending audio.
2. Let any response or required tool-result exchange finish, or cancel it explicitly.
3. Stop and drain local playback as appropriate for the product experience.
4. Close the WebSocket with a normal close code.
5. Release audio devices, playback queues, pending calls, and session state.

Treat these as terminal session outcomes:

- peer closure;
- network loss;
- authentication failure;
- model errors;
- server shutdown.

Reconnecting starts a new session:

1. Open a new authenticated WebSocket.
2. Send a new `session.update`.
3. Rebuild any application context your experience requires.

Use bounded retry with backoff for transient failures. Do not automatically retry authentication or configuration errors.
