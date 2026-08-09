# Voice Session

Voice Session is AIVAX's low-latency, stateful voice API. It keeps the authenticated AIVAX WebSocket endpoint while connecting to a realtime inference service. Events follow the OpenAI-compatible GA Realtime JSON protocol after the connection is upgraded.

Use Voice Session for natural spoken conversations with streaming audio, assistant speech transcripts, server voice activity detection (VAD), interruptions, and tool calls. Use [Audio Transcriptions](/docs/generations/audio-transcriptions) for transcription-only workloads or [Speech Generation](/docs/generations/speech) when the text to synthesize is already known.

## Connect securely

Open a WebSocket upgrade request to:

```text
wss://inference.aivax.net/api/v1/voice-session
```

Authenticate the upgrade with a **private** account API key:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

The `?api-key=<AIVAX_API_KEY>` query parameter is also accepted when the WebSocket client cannot set headers, but headers are preferred because URLs are commonly retained in logs and monitoring systems. Public API keys cannot open Voice Sessions.

> [!WARNING]
> Never place a private API key in browser JavaScript, a mobile application bundle, or a browser-visible WebSocket URL. Browsers also cannot add an `Authorization` header through the native `WebSocket` constructor. Terminate the end-user connection at your backend, then let that trusted backend open and relay the authenticated AIVAX WebSocket.

<script src="https://inference.aivax.net/apidocs?embed-target=Open%20voice%20session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Migrate to GA Realtime events

After the WebSocket upgrade, exchange OpenAI-compatible GA Realtime JSON events directly. Do not send the legacy `session_start` envelope or depend on the former AIVAX-specific STT, TTS, WAV-segment, or playback-confirmation events.

The main migration changes are:

| Legacy integration | GA Realtime integration |
| --- | --- |
| Custom session-start message | `session.update` |
| Custom STT and VAD events | Native `input_audio_buffer.speech_*` events; caller transcription is currently unavailable |
| WAV response segments | Base64 PCM in `response.output_audio.delta` |
| Custom playback confirmation | Native cancel and conversation-item truncation events |
| Custom tool-call envelopes | Native function-call items and function-call outputs |
| Flat per-minute charge | Selected model's text, audio, and image token rates |

Use the `type` property to route every event. Audio remains base64-encoded inside JSON text messages; do not send binary WebSocket frames.

## Configure the session

Send `session.update` as the first client event. AIVAX supports the GA Realtime session fields and adds two optional selectors:

- `gateway`: an AI Gateway slug available to the authenticated account;
- `model`: `gpt-realtime-2.1` or `gpt-realtime-2.1-mini`.

The selector supplied in the event determines the AIVAX configuration used for the session. Configure the output voice at `session.audio.output.voice` and reasoning effort at `session.reasoning.effort`.

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

Choose the model based on the experience you need:

- `gpt-realtime-2.1` for the highest-quality realtime conversations;
- `gpt-realtime-2.1-mini` for lower-cost, lighter-weight realtime workloads.

You can also provide standard GA Realtime instructions, tools, and turn-detection settings in the same update. Input-transcription sessions are not currently supported, so do not configure `audio.input.transcription` or depend on `conversation.item.input_audio_transcription.*` events. Wait for the server's session confirmation event before treating the configuration as active. A voice cannot be changed after the session has already produced audio; reconnect to select a different voice.

## Stream microphone audio

Capture raw mono signed 16-bit little-endian PCM (`s16le`) at 24,000 Hz, base64-encode each chunk in chronological byte order, and append it to the input buffer:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<BASE64_PCM_24KHZ_AUDIO>"
}
```

Send small chunks continuously for low latency. Do not add WAV, RIFF, or other container headers to each chunk. If automatic turn detection is enabled, server VAD determines when the user starts and stops speaking and creates responses according to the session configuration.

If turn detection is disabled, control the turn explicitly with the native buffer events:

1. Send one or more `input_audio_buffer.append` events.
2. Send `input_audio_buffer.commit` when the utterance is complete.
3. Send `response.create` to request the assistant response.

Use `input_audio_buffer.clear` to discard buffered audio that should not become a conversation turn.

## Receive transcripts and audio

Handle the native GA Realtime event stream rather than assuming one fixed sequence. In particular:

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

Event fields can evolve with the GA Realtime protocol. Route by `type`, retain the identifiers needed to correlate responses and items, and ignore unknown event types or fields that your client does not use.

## Handle interruptions

When the caller speaks over the assistant:

1. Stop or duck local playback when the confirmed `input_audio_buffer.speech_started` event arrives.
2. Send `response.cancel` if a response is still being generated.
3. Send the native conversation-item truncation event with the assistant item identifier and the amount of audio that was actually played.

Cancellation stops generation; truncation keeps the server conversation aligned with what the caller heard. Track played audio duration in the client rather than assuming every received chunk reached the speaker. Treat already-finished response races as normal and make cancel handling idempotent.

## Use tools

Declare client tools through the standard GA Realtime `tools` session field. Handle `response.function_call_arguments.done` using its `response_id`, `call_id`, `name`, and JSON-encoded `arguments`. Execute each requested function, add one native `function_call_output` conversation item per `call_id`, then send a single `response.create` after the originating `response.done` and every call from that response has an output.

Tools configured as AIVAX server `InternalFunctions` execute within AIVAX and require no client action. Client-defined tools continue to be returned normally and remain the client's responsibility.

Your tool handler should validate arguments, preserve call identifiers, enforce timeouts, and return a useful error result when execution fails. Do not wait for a client tool result that is being executed as an AIVAX server function.

## Billing and limits

Voice Sessions are not billed at a flat per-minute price. Usage is metered using the selected realtime model's text, audio, and image token rates, as applicable. The final `response.done` event includes response usage that clients can record for observability; account billing remains authoritative.

Model access, account balance, and applicable inference limits still apply. See [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits).

## Disconnect gracefully

A Voice Session lasts only for the active WebSocket. It is not resumable after disconnecting.

For a normal shutdown:

1. Stop microphone capture and stop sending audio.
2. Let any response or required tool-result exchange finish, or cancel it explicitly.
3. Stop and drain local playback as appropriate for the product experience.
4. Close the WebSocket with a normal close code.
5. Release audio devices, playback queues, pending calls, and session state.

Handle peer closure, network loss, authentication failure, model errors, and server shutdown as terminal session outcomes. Reconnecting starts a new session: open a new authenticated WebSocket, send a new `session.update`, and rebuild any application context your experience requires. Use bounded retry with backoff for transient failures, but do not automatically retry authentication or configuration errors.
