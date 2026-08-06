# Voice Session

Voice Session is AIVAX's realtime, stateful voice conversation API. One authenticated WebSocket carries microphone audio, speech-detection events, transcriptions, AI turns, synthesized WAV segments, interruptions, and client-executed tool calls for the lifetime of the conversation. The agent can also end the call directly through the server-provided `end_call` tool.

Use Voice Session when the user should be able to speak naturally, hear the assistant as soon as audio is ready, and interrupt an answer by speaking again. AIVAX owns the speech-to-text, conversational inference, turn history, server-side voice activity detection, response segmentation, and text-to-speech pipeline.

Use the standalone [Audio Transcriptions](/docs/generations/audio-transcriptions) and [Speech Generation](/docs/generations/speech) endpoints instead when your application processes complete recordings or already has the final text. Use regular [Inference](/docs/inference/inference) when the interaction is text-first or your application needs to orchestrate every stage independently.

## What a session does

After the WebSocket upgrade, the client sends one configuration message. AIVAX validates the configuration and immediately creates the first assistant turn, which produces a short greeting based on the selected AI Gateway and optional session context.

For the rest of the connection:

1. The client continuously sends mono PCM frames, including the silence between utterances.
2. AIVAX detects when speech starts and stops.
3. When speech stops, AIVAX transcribes the captured utterance.
4. AIVAX adds the transcript to the session conversation and starts an AI response.
5. Synthesized WAV segments are sent as soon as they become available.
6. If the user starts speaking while the assistant is responding, AIVAX cancels that response and starts capturing the new utterance.
7. The client reports playback completion or the exact playback cutoff so the conversation retains only the assistant content the user actually heard.
8. When the conversation is complete or the caller asks to hang up, the agent can invoke `end_call` and AIVAX closes the WebSocket from the server approximately 200 ms later.

The conversation state exists only for the active WebSocket. Closing the connection, including a server-side `end_call`, ends the session. Reconnecting creates a new session and a new greeting; the protocol does not resume a disconnected session.

## When to use Voice Session

Voice Session is a good fit for:

- conversational assistants with microphone and speaker playback;
- hands-free support, tutoring, intake, and guided workflows;
- low-latency answers that should begin playing before the full answer is synthesized;
- conversations where users can interrupt the assistant naturally;
- voice agents that expose application-owned tools and return their results over the same connection.

Prefer another API when:

- you need transcription only, without an AI response;
- you need to synthesize known text once;
- the client uploads complete recordings asynchronously;
- you need to choose the speech-to-text or text-to-speech model independently;
- a public browser key is your only available authentication boundary.

## Endpoint and authentication

<div class="request-item get">
    <span>GET</span>
    <span>/api/v1/voice-session</span>
</div>

Open the production endpoint as:

```text
wss://inference.aivax.net/api/v1/voice-session
```

The HTTP request must be a WebSocket upgrade authenticated with a **private** account API key. Public API keys cannot open voice sessions.

Preferred authentication:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

The standard `?api-key=<AIVAX_API_KEY>` query parameter is also accepted, but use it only when the WebSocket library cannot set headers. Query strings are commonly retained by browser history, reverse proxies, access logs, and monitoring systems.

> [!WARNING]
> Browser JavaScript cannot add an `Authorization` header to the native `WebSocket` constructor, and a private API key must never be shipped to a browser or mobile bundle. For an end-user client, terminate the browser connection at your backend and let that backend open the authenticated AIVAX WebSocket. Do not work around this boundary by placing a private key in the URL sent to the browser.

The connection can fail before the upgrade with:

- `400 Bad Request` when the request is not a valid WebSocket upgrade;
- `401 Unauthorized` when the key is missing or invalid;
- an API error when a public key is used.

AIVAX sends the plain-text `keep-alive` message every 10 seconds to keep the connection active. This is an application text message, not a JSON event or WebSocket ping control frame. Clients must ignore it before parsing server messages as JSON.

<script src="https://inference.aivax.net/apidocs?embed-target=Open%20voice%20session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Protocol at a glance

Application events in both directions are UTF-8 JSON WebSocket text messages. The only non-JSON application message is the server's plain-text `keep-alive` heartbeat, sent every 10 seconds; discard it before JSON parsing. Audio is base64-encoded inside JSON events, and the protocol does not accept binary WebSocket messages.

A typical session follows this timeline:

| Step | Direction | Event | Notes |
| ---: | --- | --- | --- |
| 1 | Client → AIVAX | WebSocket upgrade | Authenticate with a private API key. |
| 2 | Client → AIVAX | `session_start` | Configure and start the session. |
| 3 | AIVAX → Client | `response.created` | Start the initial greeting. |
| 4 | AIVAX → Client | `response.inference_started` | Begin generating the greeting. |
| 5 | AIVAX → Client | `response.tts_started` | Begin speech synthesis. |
| 6 | AIVAX → Client | `output_audio` | Receive one or more WAV segments. |
| 7 | AIVAX → Client | `response.inference_done` | Finish generating the greeting. |
| 8 | AIVAX → Client | `response.done` | Finish the response. |
| 9 | Client → AIVAX | `output_audio_buffer.playback_completed` | Confirm that playback finished. |
| 10 | Client → AIVAX | `input_audio_buffer.append` | Continuously send PCM frames. |
| 11 | AIVAX → Client | `input_audio_buffer.possible_speech` | Report an early speech signal. |
| 12 | AIVAX → Client | `input_audio_buffer.speech_started` | Confirm that speech started. |
| 13 | AIVAX → Client | `input_audio_buffer.speech_stopped` | Report that speech stopped. |
| 14 | AIVAX → Client | `input_audio_buffer.stt_started` | Begin transcription. |
| 15 | AIVAX → Client | `input_audio_buffer.stt_done` | Return the transcript. |
| 16 | AIVAX → Client | `response.created` | Start the answer turn. |
| 17 | AIVAX → Client | `output_audio` | Stream the synthesized answer. |
| 18 | AIVAX → Client | `response.done` | Finish the response. |
| 19 | Client → AIVAX | `output_audio_buffer.playback_completed` | Confirm that playback finished. |

The server can send the plain-text `keep-alive` heartbeat between any of these steps. It is not part of the numbered event sequence and must be discarded before JSON parsing.

`possible_speech` is an early signal and can be followed by either confirmed speech or silence. Do not stop current playback on that event. A confirmed `speech_started` is the interruption boundary.

## Start the session

The first WebSocket message must be the session configuration. No audio or other event may be sent before it.

The recommended envelope is:

```json
{
    "event_type": "session_start",
    "session": {
        "voice": "Eve",
        "gateway": "support-assistant",
        "language": null,
        "reasoning_effort": "minimal",
        "context": "The caller is using the account recovery screen.",
        "tools": []
    }
}
```

For compatibility, the first message can also contain the configuration properties directly, without `event_type` and `session`. New clients should use the explicit `session_start` envelope.

### Configuration properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `voice` | `string` | Yes | Voice used for every synthesized response in the session. Matching is case-insensitive. |
| `gateway` | `string` | No | AI Gateway slug or identifier used as the agent configuration. When omitted, AIVAX uses the current Voice Session default. Voice Session replaces the gateway's primary model with a model optimized for low-latency conversation. |
| `language` | `string` or `null` | No | Language hint forwarded to speech transcription, such as `en`, `pt`, or `pt-BR`. When null, empty, or omitted, AIVAX uses `auto` so the transcription model detects the spoken language. |
| `reasoning_effort` | `string` | No | `minimal`, `low`, `medium`, or `high`. The default is `minimal`. Higher effort can increase response latency and usage. |
| `context` | `string` | No | Additional session-level context supplied to the agent. Use it for relevant, non-secret facts about this call or user journey. |
| `tools` | `array` | No | OpenAI-compatible client tool definitions. The client executes these tools and returns `tool_result` events. |

> [!IMPORTANT]
> Voice Session does not run the gateway's configured primary model. It preserves the gateway as the agent configuration and replaces its primary model with an AIVAX-managed model optimized for low latency. Do not rely on the gateway's primary model identity, capabilities, or model-specific behavior when designing a voice integration.

Supported voices:

`Carina`, `Zagan`, `Helix`, `Orion`, `Luna`, `Iris`, `Altair`, `Zenith`, `Perseus`, `Helios`, `Lux`, `Kepler`, `Rigel`, `Cosmo`, `Celeste`, `Ursa`, `Sirius`, `Lumen`, `Castor`, `Naksh`, `Atlas`, `Ara`, `Eve`, `Leo`, `Rex`, and `Sal`.

If the first message is not valid JSON, does not contain a valid configuration, names an unsupported voice or reasoning effort, or references an unavailable gateway, AIVAX sends an `error` event and closes the connection. Be ready to receive response events immediately after a valid configuration because the initial greeting starts automatically; there is no separate `session.ready` event.

## Send realtime microphone audio

The recommended input event is `input_audio_buffer.append`:

```json
{
    "event_type": "input_audio_buffer.append",
    "audio": {
        "sequence": 42,
        "format": "pcm_s16le",
        "sample_rate": 16000,
        "channels": 1,
        "data": "<BASE64_PCM_FRAME>"
    }
}
```

The property can be named `audio` or `input_audio`; use `audio` in new integrations.

### Audio frame contract

| Property | Required value | Notes |
| --- | --- | --- |
| `sequence` | Increasing integer | Must be greater than every previously sent realtime audio sequence in this WebSocket. Start at `0` and increment once per frame. Do not reset it between utterances. |
| `format` | `pcm_s16le` | Raw signed 16-bit little-endian PCM. Do not include a WAV header. |
| `sample_rate` | `16000` | Resample microphone input before sending it. |
| `channels` | `1` | Downmix stereo input to mono. |
| `data` | Non-empty base64 string | After decoding, the byte count must be even because each sample occupies two bytes. |

Send frames continuously while microphone capture is active, including silence. Do not wait for the user to finish speaking and do not send a client-side “commit” event: AIVAX detects the utterance boundary and commits it automatically.

A 32 ms frame contains 512 samples, or 1,024 bytes before base64 encoding. This is a practical frame size because it gives smooth realtime delivery without sending excessively small messages. Other non-empty, even frame sizes are accepted and buffered across messages.

Keep a single producer for microphone frames or serialize access to the socket. If two asynchronous producers race, their `sequence` values can arrive out of order and cause `invalid_audio_frame`.

### Capturing the correct PCM format

Browser `MediaRecorder` output is normally compressed WebM/Opus, not raw PCM, and cannot be sent directly. Capture samples through an audio worklet or native audio API, then:

1. downmix to one channel;
2. resample to 16,000 Hz;
3. clamp each floating-point sample to `[-1, 1]`;
4. convert it to signed 16-bit little-endian;
5. base64-encode the resulting bytes;
6. send frames in monotonically increasing sequence order.

Do not label compressed audio as `pcm_s16le`; the frame can pass basic shape validation but produce unusable speech detection and transcription.

## Speech detection and transcription events

AIVAX sends the following events while processing realtime input.

### `input_audio_buffer.possible_speech`

An early, tentative voice-activity signal:

```json
{
    "event_type": "input_audio_buffer.possible_speech",
    "sequence": 42,
    "probability": 0.72
}
```

Use it only for subtle UI feedback, such as changing a microphone indicator. It is not a committed speech boundary and must not clear assistant playback.

### `input_audio_buffer.speech_started`

Speech has been confirmed:

```json
{
    "event_type": "input_audio_buffer.speech_started",
    "sequence": 48,
    "probability": 0.91
}
```

At this point, treat the user as interrupting any active answer. AIVAX cancels the active turn and, when applicable, follows with `response.cancelled` and `output_audio_cancelled`. Stop playback immediately when the cancellation event arrives; do not continue playing already queued segments.

### `input_audio_buffer.speech_stopped`

The current utterance has ended and was committed for transcription:

```json
{
    "event_type": "input_audio_buffer.speech_stopped",
    "sequence": 77,
    "probability": 0.12
}
```

The client does not need to send another event to commit the buffer.

### `input_audio_buffer.stt_started`

Transcription has started for the committed utterance:

```json
{
    "event_type": "input_audio_buffer.stt_started",
    "sequence": 77
}
```

Use this event for a “transcribing” state. Do not start an AI response locally.

### `input_audio_buffer.stt_done`

Transcription finished:

```json
{
    "event_type": "input_audio_buffer.stt_done",
    "sequence": 77,
    "transcript": "Can you help me reset my password?"
}
```

Display or log the transcript if your product requires it. When the transcript is non-empty, AIVAX automatically adds it to the conversation and starts the next response. An empty transcript does not create a response turn.

The `sequence` on these events identifies the most recent client audio frame involved in the detected boundary. It is not the same sequence as the ordered response-event sequence described below.

## Receive and play assistant responses

Every response belongs to a numeric `turn_id` and a string `response_id`.

- `turn_id` identifies the server-side generation attempt within this connection.
- `response_id` identifies the playable assistant response and is the key the client should use for playback queues, completion acknowledgements, and truncation.
- `sequence` appears on ordered response payloads such as `output_audio` and `tool_call`. It starts at `0` for each response turn and increases across those payloads.

Lifecycle events can be interleaved with audio work. Use `response_id` for correlation and preserve WebSocket arrival order. For payloads that carry `sequence`, verify that values increase within the response. Audio and tool-call payloads share this counter, so a gap between two audio sequence values can represent a `tool_call`; do not wait for another audio event to fill it.

### `response.created`

A response turn was created:

```json
{
    "event_type": "response.created",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

Create the client-side response state and playback queue here.

### `response.inference_started`

The agent has started generating the response:

```json
{
    "event_type": "response.inference_started",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

### `response.inference_done`

The inference stream has finished. Audio synthesis can still be finishing, so this is not a playback-complete signal:

```json
{
    "event_type": "response.inference_done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

### `response.tts_started`

AIVAX started synthesizing playable audio:

```json
{
    "event_type": "response.tts_started",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

When `kind` is `tool_preamble`, the audio explains an upcoming tool action rather than delivering the final answer.

### `output_audio`

A playable WAV segment is ready:

```json
{
    "event_type": "output_audio",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>",
    "sequence": 0,
    "output_audio": {
        "data": "<BASE64_WAV_DATA>",
        "format": "wav",
        "duration_ms": 1380
    }
}
```

Decode `output_audio.data` from base64 and enqueue the complete WAV file. Each event is an independently playable WAV segment; do not concatenate base64 strings or assume that one event contains the full answer. Preserve WebSocket arrival order and verify that `sequence` increases for the same `response_id`.

`duration_ms` is the server-calculated segment duration and is useful for playback accounting. For accurate truncation, prefer the media player's actual played position and use durations only as a fallback.

An `output_audio` event can include:

```json
{
    "kind": "tool_preamble"
}
```

Tool preamble audio belongs in the same ordered playback timeline. Include its played duration when reporting `audio_end_ms`, even though AIVAX excludes that preamble when deciding which answer sentences remain in conversation history.

### `response.tts_done`

AIVAX finished the tool-preamble synthesis phase:

```json
{
    "event_type": "response.tts_done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>",
    "kind": "tool_preamble"
}
```

This event is currently emitted for a client-tool response. Use `response.done`, not `response.tts_done`, as the general response lifecycle boundary.

### `response.done`

AIVAX has finished producing events for this response:

```json
{
    "event_type": "response.done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

`response.done` means the server will not add more content to that response. It does **not** mean the user has heard all queued audio. Continue playback, then send `output_audio_buffer.playback_completed` after the final segment actually ends.

## Confirm playback

When all queued audio for a response has played successfully, send:

```json
{
    "event_type": "output_audio_buffer.playback_completed",
    "response_id": "<RESPONSE_ID>"
}
```

Send it once per completed `response_id`, after playback—not when `response.done` arrives and not merely when all WAV files have been downloaded. This lets AIVAX discard temporary playback tracking for that response.

Do not send this event for a response that was cancelled before playback completed. Report the actual cutoff with `conversation.item.truncate` instead.

## Handle interruptions and truncation

Voice Session supports barge-in: the user can speak over an active assistant response.

When confirmed speech interrupts a response, AIVAX sends:

```json
{
    "event_type": "response.cancelled",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

and:

```json
{
    "event_type": "output_audio_cancelled",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

On `output_audio_cancelled`:

1. stop the currently playing audio for that `response_id` immediately;
2. discard every queued but unplayed segment for that response;
3. measure how many milliseconds from the response timeline were actually heard;
4. send `conversation.item.truncate` with that cutoff.

Recommended event:

```json
{
    "event_type": "conversation.item.truncate",
    "truncate": {
        "response_id": "<RESPONSE_ID>",
        "audio_end_ms": 1840
    }
}
```

The flat equivalent is also accepted:

```json
{
    "event_type": "conversation.item.truncate",
    "response_id": "<RESPONSE_ID>",
    "audio_end_ms": 1840
}
```

`audio_end_ms` is the non-negative elapsed playback time from the beginning of the response audio timeline, including any tool preamble that was played. It is not wall-clock time and not the duration of only the current WAV segment.

AIVAX acknowledges the update:

```json
{
    "event_type": "conversation.item.truncated",
    "response_id": "<RESPONSE_ID>",
    "audio_end_ms": 1840
}
```

Why truncation matters: audio can be generated and added to the assistant turn before the user hears it. Reporting the actual cutoff prevents unheard sentences from influencing later answers as though they had been spoken. If playback never started, send `audio_end_ms: 0`.

A robust player should maintain, per `response_id`:

- completed duration of fully played segments;
- current segment playback position;
- whether the response has been cancelled;
- queued segments keyed by `sequence`;
- the highest contiguous sequence already consumed.

Calculate the cutoff as completed segment duration plus the actual position inside the interrupted segment.

## Client-executed tools

The optional `tools` configuration lets the model request an action that your client or backend owns. Definitions use the OpenAI function-tool shape:

```json
{
    "event_type": "session_start",
    "session": {
        "voice": "Eve",
        "gateway": "support-assistant",
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "lookup_order",
                    "description": "Look up an order visible to the authenticated caller.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_number": {
                                "type": "string",
                                "description": "The order number provided by the caller."
                            }
                        },
                        "required": ["order_number"],
                        "additionalProperties": false
                    }
                }
            }
        ]
    }
}
```

When the model selects a client tool, AIVAX can first send tool-preamble audio, then sends:

```json
{
    "event_type": "tool_call",
    "turn_id": 4,
    "response_id": "<RESPONSE_ID>",
    "sequence": 1,
    "tool_call": {
        "id": "<TOOL_CALL_ID>",
        "name": "lookup_order",
        "content": {
            "order_number": "A-1042"
        }
    }
}
```

Treat `content` as untrusted model output even though it is based on your schema. Validate types, allowed values, user authorization, and business rules before executing the action. Ignore or remove `_tool_reason` and `_tool_goal` before strict schema validation if your application does not define them; they are conversational metadata used to explain the action.

Return the result as a string:

```json
{
    "event_type": "tool_result",
    "tool_result": {
        "id": "<TOOL_CALL_ID>",
        "result": "{\"status\":\"shipped\",\"estimated_delivery\":\"2026-08-08\"}"
    }
}
```

Important tool rules:

- echo the exact `tool_call.id` in `tool_result.id`;
- send one result for every outstanding tool call;
- when several calls are emitted, AIVAX waits until all results arrive before starting the follow-up answer;
- `result` must be a string; serialize structured data to JSON first;
- keep results concise and exclude secrets the model does not need;
- return application failures as a clear result string so the model can explain or recover from them;
- do not retry the same side-effecting tool blindly after reconnecting;
- if the user starts speaking, pending tool calls can be cancelled and later results can be rejected as `unknown_tool_call`.

The response containing the tool request still ends with `response.done`. The follow-up answer after all tool results is a new response with a new `turn_id` and `response_id`.

## Server-side call termination

Every Voice Session automatically gives the agent an `end_call` tool in addition to the client tools configured in `session.tools`. Use the gateway instructions or session context to tell the agent when ending a call is appropriate, for example after the caller says goodbye or explicitly asks to hang up.

`end_call` is executed entirely by AIVAX:

- clients must not add it to `session.tools`;
- AIVAX does not emit a `tool_call` event for it;
- clients do not send a `tool_result` for it;
- the server closes the WebSocket approximately 200 ms after the agent invokes it.

Treat this as a normal remote close. Stop microphone capture and playback and clear session-scoped state in the WebSocket close handler. The short delay is only an orderly termination margin; do not rely on another response event or final audio segment arriving before closure.

## Complete-file WAV input

`input_audio` is a compatibility path for clients that already have a complete WAV recording:

```json
{
    "event_type": "input_audio",
    "input_audio": {
        "format": "wav",
        "data": "<BASE64_WAV_FILE>"
    }
}
```

The decoded payload must be a valid RIFF/WAVE file no larger than 75 MB. AIVAX transcribes it as one utterance and starts a response automatically.

Use this path only for complete recordings. It does not provide realtime server-side speech boundaries and uses `sequence: 0` in transcription lifecycle events. Do not mix it with an active realtime utterance. Prefer `input_audio_buffer.append` for interactive conversations, lower perceived latency, and barge-in behavior.

## Client-to-server event reference

| Event | When to send | Required payload |
| --- | --- | --- |
| `session_start` | Exactly once, as the first WebSocket message. | `session.voice`; optional `gateway`, `language`, `reasoning_effort`, `context`, and `tools`. |
| `input_audio_buffer.append` | Continuously while realtime microphone capture is active. | `audio.sequence`, `format`, `sample_rate`, `channels`, and base64 `data`. |
| `input_audio` | Once per complete legacy WAV utterance. | `input_audio.format: "wav"` and base64 `data`. |
| `output_audio_buffer.playback_completed` | After the final audio segment for one response actually finishes playing. | `response_id`. |
| `conversation.item.truncate` | After cancelled or otherwise interrupted playback. | `response_id` and elapsed `audio_end_ms`. |
| `tool_result` | After executing one outstanding client tool call. | Matching `tool_result.id` and string `result`. |

There is no client event to commit a realtime input buffer, request the initial greeting, manually create a normal response, or cancel a response. Speech boundaries and interruption drive those actions automatically.

## Server-to-client event reference

| Event | Meaning | Important action |
| --- | --- | --- |
| `input_audio_buffer.possible_speech` | Tentative voice activity. | Update UI only; do not interrupt playback. |
| `input_audio_buffer.speech_started` | Confirmed user speech. | Mark microphone active and expect active response cancellation. |
| `input_audio_buffer.speech_stopped` | Utterance committed. | Show a processing state; send no commit event. |
| `input_audio_buffer.stt_started` | Transcription started. | Optionally show “transcribing”. |
| `input_audio_buffer.stt_done` | Transcript available. | Display the transcript; AIVAX starts the response automatically when non-empty. |
| `response.created` | New response identity allocated. | Create response and playback state. |
| `response.inference_started` | Agent generation started. | Optionally show “thinking”. |
| `response.inference_done` | Agent generation ended. | Do not treat as audio completion. |
| `response.tts_started` | Audio synthesis started. | Prepare the player; inspect optional `kind`. |
| `output_audio` | One complete WAV segment. | Decode, order by `sequence`, enqueue, and play. |
| `response.tts_done` | Tool-preamble synthesis ended. | Informational; wait for `response.done`. |
| `tool_call` | Client action requested. | Validate, authorize, execute, and send `tool_result`. |
| `response.done` | Server finished producing this response. | Finish queued playback, then acknowledge completion. |
| `response.cancelled` | Active generation was cancelled by speech. | Stop response-related UI work. |
| `output_audio_cancelled` | Queued playback is obsolete. | Stop/clear audio and report truncation. |
| `conversation.item.truncated` | Playback cutoff was recorded. | Release truncation bookkeeping. |
| `error` | Session, event, transcription, or turn error. | Inspect `error.code`; decide whether to continue or reconnect. |

## Error events

Errors use this envelope:

```json
{
    "event_type": "error",
    "error": {
        "code": "invalid_audio_frame",
        "message": "Realtime audio must be mono PCM signed 16-bit little-endian at 16000 Hz."
    }
}
```

| Code | Cause | Recovery |
| --- | --- | --- |
| `invalid_session` | The first message is not a valid configuration object. | Fix the handshake and reconnect; AIVAX closes this connection. |
| `invalid_reasoning_effort` | Unsupported reasoning effort. | Use `minimal`, `low`, `medium`, or `high`, then reconnect. |
| `invalid_voice` | Unsupported voice. | Select a listed voice, then reconnect. |
| `gateway_unavailable` | The requested gateway cannot be resolved for the account. | Check the gateway identifier and access, then reconnect. |
| `invalid_event` | A post-handshake message is not a JSON object. | Fix serialization; the session can continue. |
| `unsupported_event` | Unknown or missing `event_type`. | Send one of the documented client events. |
| `invalid_audio_frame` | Invalid base64, format, sample rate, channels, byte count, or non-increasing sequence. | Fix capture/ordering before sending more realtime frames. |
| `invalid_audio` | Missing or invalid complete WAV payload, or payload over 75 MB. | Send a valid RIFF/WAVE file or use realtime PCM. |
| `unsupported_audio_format` | Complete-file input is not declared as WAV. | Convert it to WAV or use realtime PCM. |
| `transcription_failed` | The committed utterance could not be transcribed. | Keep the connection open; tell the user and capture a new utterance. |
| `invalid_tool_result` | Missing `tool_result` object. | Send the documented envelope. |
| `unknown_tool_call` | The ID is not outstanding, was already answered, or was cancelled. | Do not resend it; reconcile client pending-call state. |
| `turn_failed` | The current AI or speech response could not complete. | Keep the connection open when possible and allow another utterance; reconnect after repeated failures. |

Configuration errors are terminal because they occur before the session starts. Runtime event errors are normally recoverable and do not by themselves require closing the socket. Transport closure, authentication failure, or repeated turn failures should move the client to a disconnected state.

## Reference Node.js integration

The following example demonstrates the protocol state machine with the `ws` package. It intentionally leaves microphone capture and platform-specific audio playback behind adapter functions; those parts differ substantially between browsers, desktop applications, telephony systems, and mobile runtimes.

```javascript
import WebSocket from "ws";

const apiKey = process.env.AIVAX_API_KEY;
if (!apiKey) {
    throw new Error("Set AIVAX_API_KEY to a private account API key.");
}

const socket = new WebSocket(
    "wss://inference.aivax.net/api/v1/voice-session",
    { headers: { Authorization: `Bearer ${apiKey}` } }
);

let inputSequence = 0;
const responses = new Map();
const pendingTools = new Map();

socket.on("open", () => {
    send({
        event_type: "session_start",
        session: {
            voice: "Eve",
            gateway: "support-assistant",
            language: null,
            reasoning_effort: "minimal",
            context: "The caller is using the account recovery screen.",
            tools: []
        }
    });

    startPcmCapture((pcmS16le) => {
        send({
            event_type: "input_audio_buffer.append",
            audio: {
                sequence: inputSequence++,
                format: "pcm_s16le",
                sample_rate: 16000,
                channels: 1,
                data: Buffer.from(pcmS16le).toString("base64")
            }
        });
    });
});

socket.on("message", async (raw, isBinary) => {
    if (isBinary) {
        console.error("Unexpected binary WebSocket message");
        return;
    }

    const message = raw.toString("utf8");
    if (message === "keep-alive") {
        return;
    }

    const event = JSON.parse(message);

    switch (event.event_type) {
        case "response.created":
            responses.set(event.response_id, {
                lastSequence: -1,
                playedMs: 0,
                cancelled: false,
                serverDone: false,
                playback: Promise.resolve()
            });
            break;

        case "output_audio": {
            const state = responses.get(event.response_id);
            if (!state || state.cancelled) break;
            if (event.sequence <= state.lastSequence) {
                throw new Error("Non-increasing response sequence");
            }

            state.lastSequence = event.sequence;
            const wav = Buffer.from(event.output_audio.data, "base64");
            const durationMs = event.output_audio.duration_ms;
            state.playback = state.playback.then(async () => {
                if (state.cancelled) return;
                await playWav(event.response_id, wav);
                state.playedMs += durationMs;
            });
            break;
        }

        case "response.done": {
            const state = responses.get(event.response_id);
            if (!state) break;

            state.serverDone = true;
            await state.playback;
            await acknowledgeIfPlaybackFinished(event.response_id);
            break;
        }

        case "output_audio_cancelled": {
            const state = responses.get(event.response_id);
            if (!state) break;

            state.cancelled = true;
            const audioEndMs = await stopPlaybackAndGetElapsedMs(event.response_id);
            send({
                event_type: "conversation.item.truncate",
                truncate: {
                    response_id: event.response_id,
                    audio_end_ms: Math.max(0, Math.round(audioEndMs))
                }
            });
            break;
        }

        case "tool_call": {
            const state = responses.get(event.response_id);
            if (state) {
                if (event.sequence <= state.lastSequence) {
                    throw new Error("Non-increasing response sequence");
                }
                state.lastSequence = event.sequence;
            }

            pendingTools.set(event.tool_call.id, event.tool_call);
            try {
                const result = await executeAuthorizedTool(
                    event.tool_call.name,
                    event.tool_call.content
                );
                send({
                    event_type: "tool_result",
                    tool_result: {
                        id: event.tool_call.id,
                        result: typeof result === "string"
                            ? result
                            : JSON.stringify(result)
                    }
                });
            } finally {
                pendingTools.delete(event.tool_call.id);
            }
            break;
        }

        case "input_audio_buffer.stt_done":
            console.log("User:", event.transcript);
            break;

        case "error":
            console.error(`Voice Session ${event.error.code}: ${event.error.message}`);
            break;
    }
});

socket.on("close", () => {
    stopPcmCapture();
    stopAllPlayback();
    responses.clear();
    pendingTools.clear();
});

socket.on("error", (error) => {
    console.error("Voice Session transport error:", error);
});

function send(event) {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(event));
}

async function acknowledgeIfPlaybackFinished(responseId) {
    const state = responses.get(responseId);
    if (!state || state.cancelled || !state.serverDone) return;
    if (isResponsePlaying(responseId)) return;

    send({
        event_type: "output_audio_buffer.playback_completed",
        response_id: responseId
    });
    responses.delete(responseId);
}
```

Your adapters must preserve these invariants:

- `startPcmCapture` emits mono PCM s16le at exactly 16 kHz;
- only one path assigns and sends `inputSequence`;
- each response chains playback through its `playback` promise so message callbacks cannot play segments concurrently;
- `lastSequence` advances for both audio and tool-call payloads because they share one response sequence;
- `playWav` resolves after the segment has actually played, not after it was queued;
- `stopPlaybackAndGetElapsedMs` returns elapsed time across the full response timeline;
- `executeAuthorizedTool` validates arguments and applies the current user's authorization;
- socket closure, including closure initiated by `end_call`, stops capture, playback, and pending application work.

The sample serializes playback by awaiting each WAV segment. A production UI can use a dedicated playback worker, but it must retain the same ordering, cancellation, and completion semantics.

## Reconnection and lifecycle guidance

Treat the WebSocket as a session-scoped resource:

- open it only when the voice experience is active;
- send configuration immediately after `open`;
- start microphone frames only after configuration has been sent;
- stop microphone capture before intentionally closing the socket;
- clear audio queues and pending tool calls when the socket closes;
- treat a server close after `end_call` as an intentional session end rather than an automatic-reconnect failure;
- use exponential backoff with jitter for unexpected transport failures;
- do not automatically replay audio frames or tool results from the previous connection;
- show the user that a reconnect starts a new conversation;
- create a new input sequence beginning at `0` only for the new WebSocket.

Do not retry terminal configuration errors without changing the configuration. For transient network failures, cap retries and provide an explicit reconnect control so the user is not trapped in an invisible loop.

## Production checklist

Before shipping, verify that the integration:

- keeps the private API key on a trusted backend;
- sends the configuration as the first and only session-start message;
- ignores the plain-text `keep-alive` heartbeat before parsing JSON events;
- captures true mono PCM s16le at 16 kHz;
- keeps input `sequence` strictly increasing for the whole connection;
- continues sending silence so server-side speech boundaries can complete;
- decodes each `output_audio` event as an independent WAV file;
- orders response payloads by their response-scoped `sequence`;
- separates playback queues by `response_id`;
- does not confuse `response.done` with playback completion;
- sends playback completion only after the user hears the final segment;
- stops audio immediately on `output_audio_cancelled`;
- reports the actual playback cutoff through `conversation.item.truncate`;
- validates and authorizes every client tool call;
- returns every outstanding tool result with the exact call ID;
- handles `error`, socket `error`, and socket `close` independently;
- clears session state on disconnect instead of replaying stale work;
- avoids logging API keys, raw microphone audio, transcripts, or tool results unless the product has an explicit retention and privacy policy.
