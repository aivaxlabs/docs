# Sessão de Voz

Sessão de Voz é a API de conversação por voz em tempo real e com estado da AIVAX. Um WebSocket autenticado transporta áudio do microfone, eventos de detecção de fala, transcrições, turnos de IA, segmentos WAV sintetizados, interrupções e chamadas de ferramentas executadas pelo cliente durante a vida da conversação. O agente também pode encerrar a chamada diretamente através da ferramenta `end_call` fornecida pelo servidor.

Use a Sessão de Voz quando o usuário deve poder falar naturalmente, ouvir o assistente assim que o áudio estiver pronto e interromper uma resposta falando novamente. A AIVAX possui o pipeline de fala‑para‑texto, inferência conversacional, histórico de turnos, detecção de atividade de voz no servidor, segmentação de respostas e texto‑para‑fala.

Use os endpoints independentes [Audio Transcriptions](/docs/pt-br/generations/audio-transcriptions) e [Speech Generation](/docs/pt-br/generations/speech) quando sua aplicação processa gravações completas ou já tem o texto final. Use a [Inference](/docs/pt-br/inference/inference) regular quando a interação for primeiro texto ou sua aplicação precisar orquestrar cada etapa de forma independente.

## O que uma sessão faz

Após a atualização do WebSocket, o cliente envia uma mensagem de configuração. A AIVAX valida a configuração e cria imediatamente o primeiro turno do assistente, que produz uma saudação curta baseada no Gateway de IA selecionado e no contexto opcional da sessão.

Para o restante da conexão:

1. O cliente envia continuamente quadros PCM mono, incluindo o silêncio entre falas.
2. A AIVAX detecta quando a fala começa e para.
3. Quando a fala para, a AIVAX transcreve a fala capturada.
4. A AIVAX adiciona a transcrição à conversa da sessão e inicia uma resposta de IA.
5. Segmentos WAV sintetizados são enviados assim que ficam disponíveis.
6. Se o usuário começar a falar enquanto o assistente está respondendo, a AIVAX cancela essa resposta e começa a capturar a nova fala.
7. O cliente relata a conclusão da reprodução ou o corte exato da reprodução para que a conversa retenha apenas o conteúdo do assistente que o usuário realmente ouviu.
8. Quando a conversa termina ou o chamador pede para desligar, o agente pode invocar `end_call` e a AIVAX fecha o WebSocket do servidor aproximadamente 200 ms depois.

O estado da conversa existe apenas para o WebSocket ativo. Fechar a conexão, incluindo um `end_call` do lado do servidor, encerra a sessão. Reconectar cria uma nova sessão e uma nova saudação; o protocolo não retoma uma sessão desconectada.

## Quando usar a Sessão de Voz

A Sessão de Voz é adequada para:

- assistentes conversacionais com microfone e reprodução por alto-falante;
- suporte mãos‑livres, tutoriais, intake e fluxos guiados;
- respostas de baixa latência que devem começar a tocar antes que a resposta completa seja sintetizada;
- conversas onde os usuários podem interromper o assistente naturalmente;
- agentes de voz que expõem ferramentas de propriedade da aplicação e retornam seus resultados pela mesma conexão.

Prefira outra API quando:

- precisar apenas de transcrição, sem resposta de IA;
- precisar sintetizar um texto conhecido uma única vez;
- o cliente envia gravações completas de forma assíncrona;
- precisar escolher o modelo de fala‑para‑texto ou texto‑para‑fala de forma independente;
- a única fronteira de autenticação disponível for uma chave pública de navegador.

## Endpoint e autenticação

<div class="request-item get">
    <span>GET</span>
    <span>/api/v1/voice-session</span>
</div>

Abra o endpoint de produção como:

```text
wss://inference.aivax.net/api/v1/voice-session
```

A requisição HTTP deve ser uma atualização de WebSocket autenticada com uma chave de API **privada**. Chaves de API públicas não podem abrir sessões de voz.

Autenticação preferencial:

```http
Authorization: Bearer <AIVAX_API_KEY>
```

O parâmetro de consulta padrão `?api-key=<AIVAX_API_KEY>` também é aceito, mas use‑o somente quando a biblioteca de WebSocket não puder definir cabeçalhos. Strings de consulta são comumente retidas pelo histórico do navegador, proxies reversos, logs de acesso e sistemas de monitoramento.

> [!WARNING]
> JavaScript do navegador não pode adicionar um cabeçalho `Authorization` ao construtor nativo `WebSocket`, e uma chave de API privada nunca deve ser enviada a um navegador ou pacote móvel. Para um cliente final, encerre a conexão do navegador no seu backend e deixe esse backend abrir o WebSocket autenticado da AIVAX. Não contorne essa fronteira colocando uma chave privada na URL enviada ao navegador.

A conexão pode falhar antes da atualização com:

- `400 Bad Request` quando a requisição não é uma atualização de WebSocket válida;
- `401 Unauthorized` quando a chave está ausente ou inválida;
- um erro de API quando uma chave pública é usada.

A AIVAX envia a mensagem de texto simples `keep-alive` a cada 10 segundos para manter a conexão ativa. Isso é uma mensagem de texto de aplicação, não um evento JSON ou quadro de controle ping do WebSocket. Os clientes devem ignorá‑la antes de analisar as mensagens do servidor como JSON.

<script src="https://inference.aivax.net/apidocs?embed-target=Open%20voice%20session&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Visão geral do protocolo

Eventos de aplicação em ambas as direções são mensagens de texto JSON UTF‑8 do WebSocket. A única mensagem de aplicação não‑JSON é o heartbeat de texto simples `keep-alive` do servidor, enviado a cada 10 segundos; descarte‑o antes da análise JSON. O áudio é codificado em base64 dentro dos eventos JSON, e o protocolo não aceita mensagens binárias do WebSocket.

Uma sessão típica segue este cronograma:

| Etapa | Direção | Evento | Observações |
| ---: | --- | --- | --- |
| 1 | Cliente → AIVAX | Atualização de WebSocket | Autenticar com uma chave de API privada. |
| 2 | Cliente → AIVAX | `session_start` | Configurar e iniciar a sessão. |
| 3 | AIVAX → Cliente | `response.created` | Iniciar a saudação inicial. |
| 4 | AIVAX → Cliente | `response.inference_started` | Começar a gerar a saudação. |
| 5 | AIVAX → Cliente | `response.tts_started` | Iniciar a síntese de fala. |
| 6 | AIVAX → Cliente | `output_audio` | Receber um ou mais segmentos WAV. |
| 7 | AIVAX → Cliente | `response.inference_done` | Concluir a geração da saudação. |
| 8 | AIVAX → Cliente | `response.done` | Concluir a resposta. |
| 9 | Cliente → AIVAX | `output_audio_buffer.playback_completed` | Confirmar que a reprodução terminou. |
| 10 | Cliente → AIVAX | `input_audio_buffer.append` | Enviar continuamente quadros PCM. |
| 11 | AIVAX → Cliente | `input_audio_buffer.possible_speech` | Reportar um sinal precoce de fala. |
| 12 | AIVAX → Cliente | `input_audio_buffer.speech_started` | Confirmar que a fala começou. |
| 13 | AIVAX → Cliente | `input_audio_buffer.speech_stopped` | Reportar que a fala parou. |
| 14 | AIVAX → Cliente | `input_audio_buffer.stt_started` | Iniciar a transcrição. |
| 15 | AIVAX → Cliente | `input_audio_buffer.stt_done` | Retornar a transcrição. |
| 16 | AIVAX → Cliente | `response.created` | Iniciar o turno de resposta. |
| 17 | AIVAX → Cliente | `output_audio` | Transmitir a resposta sintetizada. |
| 18 | AIVAX → Cliente | `response.done` | Concluir a resposta. |
| 19 | Cliente → AIVAX | `output_audio_buffer.playback_completed` | Confirmar que a reprodução terminou. |

O servidor pode enviar o heartbeat de texto simples `keep-alive` entre qualquer dessas etapas. Não faz parte da sequência numerada de eventos e deve ser descartado antes da análise JSON.

`possible_speech` é um sinal precoce e pode ser seguido por fala confirmada ou silêncio. Não interrompa a reprodução atual nesse evento. Um `speech_started` confirmado é o limite de interrupção.

## Iniciar a sessão

A primeira mensagem do WebSocket deve ser a configuração da sessão. Nenhum áudio ou outro evento pode ser enviado antes disso.

O envelope recomendado é:

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

Para compatibilidade, a primeira mensagem também pode conter as propriedades de configuração diretamente, sem `event_type` e `session`. Clientes novos devem usar o envelope explícito `session_start`.

### Propriedades de configuração

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `voice` | `string` | Sim | Voz usada para cada resposta sintetizada na sessão. A correspondência não diferencia maiúsculas de minúsculas. |
| `gateway` | `string` | Não | Slug ou identificador do Gateway de IA usado como configuração do agente. Quando omitido, a AIVAX usa o padrão atual da Sessão de Voz. A Sessão de Voz substitui o modelo principal do gateway por um modelo otimizado para conversação de baixa latência. |
| `language` | `string` ou `null` | Não | Dica de idioma encaminhada para a transcrição de fala, como `en`, `pt` ou `pt-BR`. Quando nulo, vazio ou omitido, a AIVAX usa `auto` para que o modelo de transcrição detecte o idioma falado. |
| `reasoning_effort` | `string` | Não | `minimal`, `low`, `medium` ou `high`. O padrão é `minimal`. Esforço maior pode aumentar a latência da resposta e o uso. |
| `context` | `string` | Não | Contexto adicional ao nível da sessão fornecido ao agente. Use para fatos relevantes e não secretos sobre esta chamada ou jornada do usuário. |
| `tools` | `array` | Não | Definições de ferramentas compatíveis com OpenAI. O cliente executa essas ferramentas e retorna eventos `tool_result`. |

> [!IMPORTANT]
> A Sessão de Voz não executa o modelo principal configurado do gateway. Ela preserva o gateway como configuração do agente e substitui seu modelo principal por um modelo gerenciado pela AIVAX otimizado para baixa latência. Não dependa da identidade, capacidades ou comportamento específico do modelo principal do gateway ao projetar uma integração de voz.

Vozes suportadas:

`Carina`, `Zagan`, `Helix`, `Orion`, `Luna`, `Iris`, `Altair`, `Zenith`, `Perseus`, `Helios`, `Lux`, `Kepler`, `Rigel`, `Cosmo`, `Celeste`, `Ursa`, `Sirius`, `Lumen`, `Castor`, `Naksh`, `Atlas`, `Ara`, `Eve`, `Leo`, `Rex` e `Sal`.

Se a primeira mensagem não for JSON válido, não contiver uma configuração válida, nomear uma voz ou esforço de raciocínio não suportados, ou referenciar um gateway indisponível, a AIVAX envia um evento `error` e fecha a conexão. Esteja pronto para receber eventos de resposta imediatamente após uma configuração válida, pois a saudação inicial começa automaticamente; não há um evento separado `session.ready`.

## Enviar áudio do microfone em tempo real

O evento de entrada recomendado é `input_audio_buffer.append`:

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

A propriedade pode ser nomeada `audio` ou `input_audio`; use `audio` em novas integrações.

### Contrato de quadro de áudio

| Propriedade | Valor exigido | Observações |
| --- | --- | --- |
| `sequence` | Inteiro crescente | Deve ser maior que todo ` enviado anteriormente nesta conexão WebSocket. Comece em `0` e incremente uma vez por quadro. Não reinicie entre falas. |
| `format` | `pcm_s16le` | PCM bruto assinado de 16 bits little‑endian. Não inclua cabeçalho WAV. |
| `sample_rate` | `16000` | Reamostra a entrada do microfone antes de enviá‑la. |
| `channels` | `1` | Converta entrada estéreo para mono. |
| `data` | String base64 não vazia | Após decodificação, a contagem de bytes deve ser par porque cada amostra ocupa dois bytes. |

Envie quadros continuamente enquanto a captura do microfone está ativa, incluindo silêncio. Não espere o usuário terminar de falar e não envie um evento “commit” do lado do cliente: a AIVAX detecta o limite da fala e a confirma automaticamente.

Um quadro de 32 ms contém 512 amostras, ou 1 024 bytes antes da codificação base64. Esse é um tamanho de quadro prático porque oferece entrega em tempo real suave sem enviar mensagens excessivamente pequenas. Outros tamanhos de quadros não vazios e pares são aceitos e armazenados em buffer entre mensagens.

Mantenha um único produtor de quadros de microfone ou serialize o acesso ao so. Se dois produtores assíncronos entrarem em competição, seus valores `sequence` podem chegar fora de ordem e causar `invalid_audio_frame`.

### Capturando o formato PCM correto

A saída do `MediaRecorder` do navegador normalmente é WebM/Opus comprimido, não PCM bruto, e não pode ser enviada diretamente. Capture amostras através de um audio worklet ou API de áudio nativa, então:

1. converta para um canal;
2. reamostra para 16 000 Hz;
3. limite cada amostra ponto flutuante a `[-1, 1]`;
4. converta para PCM assinada de 16 bits little‑endian;
5. codifique em base64 os bytes resultantes;
6. envie quadros em ordem de sequência monotonicamente crescente.

Não rotule áudio comprimido como `pcm_s16le`; o quadro pode passar na validação básica de forma, mas produzirá detecção de fala e transcrição inutilizáveis.

## Eventos de detecção de fala e transcrição

A AIVAX envia os seguintes eventos enquanto processa entrada em tempo real.

### `input_audio_buffer.possible_speech`

Um sinal precoce e tentativo de atividade de voz:

```json
{
    "event_type": "input_audio_buffer.possible_speech",
    "sequence": 42,
    "probability": 0.72
}
```

Use apenas para feedback sutil de UI, como mudar o indicador de microfone. Não é um limite de fala confirmado e não deve limpar a reprodução do assistente.

### `input_audio_buffer.speech_started`

Fala confirmada:

```json
{
    "event_type": "input_audio_buffer.speech_started",
    "sequence": 48,
    "probability": 0.91
}
```

Neste ponto, trate o usuário como interrompendo qualquer resposta ativa. A AIVAX cancela o turno ativo e, quando aplicável, segue com `response.cancelled` e `output_audio_cancelled`. Pare a reprodução imediatamente quando o evento de cancelamento chegar; não continue reproduzindo segmentos já enfileirados.

### `input_audio_buffer.speech_stopped`

A fala atual terminou e foi confirmada para transcrição:

```json
{
    "event_type": "input_audio_buffer.speech_stopped",
    "sequence": 77,
    "probability": 0.12
}
```

O cliente não precisa enviar outro evento para confirmar o buffer.

### `input_audio_buffer.stt_started`

A transcrição começou para a fala confirmada:

```json
{
    "event_type": "input_audio_buffer.stt_started",
    "sequence": 77
}
```

Use este evento para um estado “transcrevendo”. Não inicie uma resposta de IA localmente.

### `input_audio_buffer.stt_done`

Transcrição concluída:

```json
{
    "event_type": "input_audio_buffer.stt_done",
    "sequence": 77,
    "transcript": "Can you help me reset my password?"
}
```

Exiba ou registre a transcrição se seu produto exigir. Quando a transcrição não está vazia, a AIVAX a adiciona automaticamente à conversa e inicia a próxima resposta. Uma transcrição vazia não cria um turno de resposta.

O `sequence` nesses eventos identifica o quadro de áudio cliente mais recente envolvido no limite detectado. Não é a mesma sequência da sequência de eventos de resposta ordenados descrita abaixo.

## Receber e reproduzir respostas do assistente

Cada resposta pertence a um `turn_id` numérico e a um `response_id` string.

- `turn_id` identifica a tentativa de geração do lado do servidor dentro desta conexão.
- `response_id` identifica a resposta reproduzível do assistente e é a chave que o cliente deve usar para filas de reprodução, reconhecimentos de conclusão e truncamento.
- `sequence` aparece em payloads de resposta ordenados como `output_audio` e `tool_call`. Começa em `0` para cada turno de resposta e aumenta nesses payloads.

Eventos de ciclo de vida podem ser intercalados com trabalho de áudio. Use `response_id` para correlação e preserve a ordem de chegada do WebSocket. Para payloads que carregam `sequence`, verifique se os valores aumentam dentro da resposta. Payloads de áudio e chamada de ferramenta compartilham esse contador, portanto um salto entre dois valores de sequência de áudio pode representar um `tool_call`; não espere outro evento de áudio para preenchê‑lo.

### `response.created`

Um turno de resposta foi criado:

```json
{
    "event_type": "response.created",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

Crie o estado de resposta do cliente e a fila de reprodução aqui.

### `response.inference_started`

O agente começou a gerar a resposta:

```json
{
    "event_type": "response.inference_started",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

### `response.inference_done`

O fluxo de inferência terminou. A síntese de áudio ainda pode estar finalizando, portanto isso não é um sinal de reprodução concluída:

```json
{
    "event_type": "response.inference_done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

### `response.tts_started`

A AIVAX começou a sintetizar áudio reproduzível:

```json
{
    "event_type": "response.tts_started",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

Quando `kind` é `tool_preamble`, o áudio explica uma ação de ferramenta futura em vez de entregar a resposta final.

### `output_audio`

Um segmento WAV reproduzível está pronto:

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

Decodifique `output_audio.data` de base64 e enfileire o arquivo WAV completo. Cada evento é um segmento WAV reproduzível de forma independente; não concatene strings base64 nem presuma que um evento contém a resposta completa. Preserve a ordem de chegada do WebSocket e verifique se `sequence` aumenta para o mesmo `response_id`.

`duration_ms` é a duração do segmento calculada pelo servidor e é útil para contabilidade de reprodução. Para truncamento preciso, prefira a posição real reproduzida pelo player de mídia e use durações apenas como fallback.

Um evento `output_audio` pode incluir:

```json
{
    "kind": "tool_preamble"
}
```

Áudio de pré‑ámbulo de ferramenta pertence à mesma linha de tempo de reprodução ordenada. Inclua sua duração reproduzida ao relatar `audio_end_ms`, embora a AIVAX exclua esse pré‑ámbulo ao decidir quais frases de resposta permanecem no histórico da conversa.

### `response.tts_done`

A AIVAX concluiu a fase de síntese de pré‑ámbulo de ferramenta:

```json
{
    "event_type": "response.tts_done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>",
    "kind": "tool_preamble"
}
```

Este evento é atualmente emitido para uma resposta de ferramenta do cliente. Use `response.done`, não `response.tts_done`, como limite geral do ciclo de vida da resposta.

### `response.done`

A AIVAX terminou de produzir eventos para esta resposta:

```json
{
    "event_type": "response.done",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

`response.done` significa que o servidor não adicionará mais conteúdo a essa resposta. Não **significa** que o usuário ouviu todo o áudio enfileirado. Continue a reprodução, então envie `output_audio_buffer.playback_completed` após o segmento final realmente terminar.

## Confirmar reprodução

Quando todo o áudio enfileirado para uma resposta foi reproduzido com sucesso, envie:

```json
{
    "event_type": "output_audio_buffer.playback_completed",
    "response_id": "<RESPONSE_ID>"
}
```

Envie uma vez por `response_id` concluído, após a reprodução — não quando `response.done` chega e não apenas quando todos os arquivos WAV foram baixados. Isso permite que a AIVAX descarte o rastreamento temporário de reprodução para essa resposta.

Não envie este evento para uma resposta que foi cancelada antes da reprodução concluir. Relate o corte real com `conversation.item.truncate` em vez disso.

## Lidar com interrupções e truncamento

A Sessão de Voz suporta barge‑in: o usuário pode falar sobre uma resposta ativa do assistente.

Quando a fala confirmada interrompe uma resposta, a AIVAX envia:

```json
{
    "event_type": "response.cancelled",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

e:

```json
{
    "event_type": "output_audio_cancelled",
    "turn_id": 3,
    "response_id": "<RESPONSE_ID>"
}
```

Ao receber `output_audio_cancelled`:

1. pare o áudio atualmente reproduzido para esse `response_id` imediatamente;
2. descarte todo segmento enfileirado mas não reproduzido para essa resposta;
3. meça quantos milissegundos da linha de tempo da resposta foram realmente ouvidos;
4. envie `conversation.item.truncate` com esse corte.

Evento recomendado:

```json
{
    "event_type": "conversation.item.truncate",
    "truncate": {
        "response_id": "<RESPONSE_ID>",
        "audio_end_ms": 1840
    }
}
```

A forma plana também é aceita:

```json
{
    "event_type": "conversation.item.truncate",
    "response_id": "<RESPONSE_ID>",
    "audio_end_ms": 1840
}
```

`audio_end_ms` é o tempo de reprodução decorrido não‑negativo desde o início da linha de tempo de áudio da resposta, incluindo qualquer pré‑ámbulo de ferramenta que foi reproduzido. Não é tempo de relógio real nem a duração apenas do segmento WAV atual.

A AIVAX reconhece a atualização:

```json
{
    "event_type": "conversation.item.truncated",
    "response_id": "<RESPONSE_ID>",
    "audio_end_ms": 1840
}
```

Por que o truncamento importa: o áudio pode ser gerado e adicionado ao turno do assistente antes que o usuário o ouça. Relatar o corte real impede que frases não ouvidas influenciem respostas posteriores como se tivessem sido faladas. Se a reprodução nunca começou, envie `audio_end_ms: 0`.

Um player robusto deve manter, por `response_id`:

- duração concluída de segmentos totalmente reproduzidos;
- posição de reprodução do segmento atual;
- se a resposta foi cancelada;
- segmentos enfileirados indexados por `sequence`;
- a maior sequência contígua já consumida.

Calcule o corte como a duração do segmento concluído mais a posição real dentro do segmento interrompido.

## Ferramentas executadas pelo cliente

A configuração opcional `tools` permite que o modelo solicite uma ação que seu cliente ou backend possui. As definições usam o formato de ferramenta de função do OpenAI:

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

Quando o modelo seleciona uma ferramenta do cliente, a AIVAX pode primeiro enviar áudio de pré‑ámbulo de ferramenta, então envia:

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

Trate `content` como saída de modelo não confiável, mesmo que seja baseada no seu esquema. Valide tipos, valores permitidos, autorização do usuário e regras de negócio antes de executar a ação. Ignore ou remova `_tool_reason` e `_tool_goal` antes da validação estrita de esquema se sua aplicação não os definir; são metadados conversacionais usados para explicar a ação.

Retorne o resultado como string:

```json
{
    "event_type": "tool_result",
    "tool_result": {
        "id": "<TOOL_CALL_ID>",
        "result": "{\"status\":\"shipped\",\"estimated_delivery\":\"2026-08-08\"}"
    }
}
```

Regras importantes para ferramentas:

- ecoar exatamente o `tool_call.id` em `tool_result.id`;
- enviar um resultado para cada chamada de ferramenta pendente;
- quando várias chamadas são emitidas, a AIVAX aguarda todos os resultados chegarem antes de iniciar a resposta de acompanhamento;
- `result` deve ser uma string; serialize dados estruturados para JSON primeiro;
- mantenha os resultados concisos e exclua segredos que o modelo não precise;
- retorne falhas de aplicação como uma string de resultado clara para que o modelo possa explicar ou se recuperar delas;
- não tente novamente a mesma ferramenta com efeitos colaterais após reconexão;
- se o usuário começar a falar, chamadas de ferramenta pendentes podem ser canceladas e resultados posteriores podem ser rejeitados como `unknown_tool_call`.

A resposta contendo a solicitação de ferramenta ainda termina com `response.done`. A resposta de acompanhamento após todos os resultados de ferramenta é uma nova resposta com um novo `turn_id` e `response_id`.

## Encerramento de chamada do lado do servidor

Cada Sessão de Voz fornece automaticamente ao agente uma ferramenta `end_call` além das ferramentas do cliente configuradas em `session.tools`. Use as instruções do gateway ou o contexto da sessão para dizer ao agente quando encerrar a chamada é apropriado, por exemplo, após o chamador dizer adeus ou pedir explicitamente para desligar.

`end_call` é executado inteiramente pela AIVAX:

- os clientes não devem adicioná‑la a `session.tools`;
- a AIVAX não emite um evento `tool_call` para ela;
- os clientes não enviam um `tool_result` para ela;
- o servidor fecha o WebSocket aproximadamente 200 ms depois que o agente a invoca.

Trate isso como um fechamento remoto normal. Pare a captura do microfone e a reprodução e limpe o estado escopo da sessão no manipulador de fechamento do WebSocket. O pequeno atraso é apenas uma margem de término ordenado; não dependa de outro evento de resposta ou segmento de áudio final chegando antes do fechamento.

## Entrada WAV completa

`input_audio` é um caminho de compatibilidade para clientes que já possuem uma gravação WAV completa:

```json
{
    "event_type": "input_audio",
    "input_audio": {
        "format": "wav",
        "data": "<BASE64_WAV_FILE>"
    }
}
```

O payload decodificado deve ser um arquivo RIFF/WAVE válido com no máximo 75 MB. A AIVAX transcreve como uma única fala e inicia automaticamente uma resposta.

Use este caminho apenas para gravações completas. Ele não fornece limites de fala em tempo real no servidor e usa `sequence: 0` nos eventos de ciclo de vida de transcrição. Não o misture com uma fala em tempo real ativa. Prefira `input_audio_buffer.append` para conversas interativas, menor latência percebida e comportamento de barge‑in.

## Referência de eventos cliente‑para‑servidor

| Evento | Quando enviar | Payload obrigatório |
| --- | --- | --- |
| `session_start` | Exatamente uma vez, como a primeira mensagem do WebSocket. | `session.voice`; opcional `gateway`, `language`, `reasoning_effort`, `context` e `tools`. |
| `input_audio_buffer.append` | Continuamente enquanto a captura de microfone em tempo real está ativa. | `audio.sequence`, `format`, `sample_rate`, `channels` e `data` base64. |
| `input_audio` | Uma vez por fala WAV legada completa. | `input_audio.format: "wav"` e `data` base64. |
| `output_audio_buffer.playback_completed` | Após o segmento de áudio final de uma resposta realmente terminar de reproduzir. | `response_id`. |
| `conversation.item.truncate` | Após reprodução cancelada ou interrompida. | `response_id` e `audio_end_ms` decorrido. |
| `tool_result` | Após executar uma chamada de ferramenta pendente do cliente. | `tool_result.id` correspondente e `result` string. |

Não há evento cliente para confirmar um buffer de entrada em tempo real, solicitar a saudação inicial, criar manualmente uma resposta normal ou cancelar uma resposta. Limites de fala e interrupção conduzem essas ações automaticamente.

## Referência de eventos servidor‑para‑cliente

| Evento | Significado | Ação importante |
| --- | --- | --- |
| `input_audio_buffer.possible_speech` | Atividade de voz tentativa. | Atualizar UI apenas; não interromper a reprodução. |
| `input_audio_buffer.speech_started` | Fala do usuário confirmada. | Marcar microfone ativo e esperar cancelamento da resposta. |
| `input_audio_buffer.speech_stopped` | Fala confirmada. | Mostrar estado de processamento; não enviar evento de commit. |
| `input_audio_buffer.stt_started` | Transcrição iniciada. | Opcionalmente mostrar “transcrevendo”. |
| `input_audio_buffer.stt_done` | Transcrição disponível. | Exibir a transcrição; a AIVAX inicia a resposta automaticamente quando não vazia. |
| `response.created` | Nova identidade de resposta alocada. | Criar estado e fila de reprodução. |
| `response.inference_started` | Geração de agente iniciada. | Opcionalmente mostrar “pensando”. |
| `response.inference_done` | Geração de agente concluída. | Não tratar como conclusão de áudio. |
| `response.tts_started` | Síntese de áudio iniciada. | Preparar o player; inspecionar `kind` opcional. |
| `output_audio` | Um segmento WAV completo. | Decodificar, ordenar por `sequence`, enfileirar e reproduzir. |
| `response.tts_done` | Síntese de pré‑ámbulo de ferramenta concluída. | Informacional; aguardar `response.done`. |
| `tool_call` | Ação solicitada pelo cliente. | Validar, autorizar, executar e enviar `tool_result`. |
| `response.done` | Servidor terminou de produzir esta resposta. | Finalizar fila de reprodução, então reconhecer conclusão. |
| `response.cancelled` | Geração ativa foi cancelada por fala. | Parar trabalho de UI relacionado à resposta. |
| `output_audio_cancelled` | Reprodução enfileirada está obsoleta. | Parar/limpar áudio e relatar truncamento. |
| `conversation.item.truncated` | Corte de reprodução registrado. | Liberar registro de truncamento. |
| `error` | Erro de sessão, evento, transcrição ou turno. | Inspecionar `error.code`; decidir se continua ou reconecta. |

## Eventos de erro

Erros usam este envelope:

```json
{
    "event_type": "error",
    "error": {
        "code": "invalid_audio_frame",
        "message": "Realtime audio must be mono PCM signed 16-bit little-endian at 16000 Hz."
    }
}
```

| Código | Causa | Recuperação |
| --- | --- | --- |
| `invalid_session` | A primeira mensagem não é um objeto de configuração válido. | Corrija o handshake e reconecte; a AIVAX fecha esta conexão. |
| `invalid_reasoning_effort` | Esforço de raciocínio não suportado. | Use `minimal`, `low`, `medium` ou `high`, então reconecte. |
| `invalid_voice` | Voz não suportada. | Selecione uma voz listada, então reconecte. |
| `gateway_unavailable` | O gateway solicitado não pode ser resolvido para a conta. | Verifique o identificador do gateway e acesso, então reconecte. |
| `invalid_event` | Uma mensagem pós‑handshake não é um objeto JSON. | Corrija a serialização; a sessão pode continuar. |
| `unsupported_event` | `event_type` desconhecido ou ausente. | Envie um dos eventos de cliente documentados. |
| `invalid_audio_frame` | Base64, formato, taxa de amostragem, canais, contagem de bytes ou sequência não crescente inválidos. | Corrija captura/ordenação antes de enviar mais quadros em tempo real. |
| `invalid_audio` | Payload WAV completo ausente ou inválido, ou payload acima de 75 MB. | Envie um arquivo RIFF/WAVE válido ou use PCM em tempo real. |
| `unsupported_audio_format` | Entrada de arquivo completo não declarada como WAV. | Converta para WAV ou use PCM em tempo real. |
| `transcription_failed` | A fala confirmada não pôde ser transcrita. | Mantenha a conexão aberta; informe o usuário e capture uma nova fala. |
| `invalid_tool_result` | Objeto `tool_result` ausente. | Envie o envelope documentado. |
| `unknown_tool_call` | O ID não está pendente, já foi respondido ou foi cancelado. | Não reenvie; reconcilie o estado pendente do cliente. |
| `turn_failed` | A resposta atual de IA ou fala não pôde ser concluída. | Mantenha a conexão aberta quando possível e permita outra fala; reconecte após falhas repetidas. |

Erros de configuração são terminais porque ocorrem antes da sessão iniciar. Erros de eventos em tempo de execução são normalmente recuperáveis e não exigem fechar o socket por si só. Fechamento de transporte, falha de autenticação ou falhas repetidas de turno devem mover o cliente para um estado desconectado.

## Integração Node.js de referência

O exemplo a seguir demonstra a máquina de estados do protocolo com o pacote `ws`. Ele intencionalmente deixa a captura de microfone e a reprodução de áudio específicas da plataforma para funções adaptadoras; essas partes diferem substancialmente entre navegadores, aplicações desktop, sistemas telefônicos e runtimes móveis.

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

Se adaptadores devem preservar estes invariantes:

- `startPcmCapture` emite PCM mono s16le exatamente a 16 kHz;
- apenas um caminho atribui e envia `inputSequence`;
- cada resposta encadeia a reprodução através de sua promessa `playback` para que callbacks de mensagem não reproduzam segmentos simultaneamente;
- `lastSequence` avança tanto para payloads de áudio quanto de chamada de ferramenta porque compartilham uma sequência de resposta;
- `playWav` resolve após o segmento realmente ter sido reproduzido, não após ter sido enfileirado;
- `stopPlaybackAndGetElapsedMs` retorna o tempo decorrido ao longo da linha de tempo completa da resposta;
- `executeAuthorizedTool` valida argumentos e aplica a autorização do usuário atual;
- o fechamento do socket, incluindo o fechamento iniciado por `end_call`, encerra captura, reprodução e trabalho pendente da aplicação.

O exemplo serializa a reprodução aguardando cada segmento WAV. Uma UI de produção pode usar um worker de reprodução dedicado, mas deve manter a mesma ordenação, cancelamento e semânticas de conclusão.

## Reconexão e orientações de ciclo de vida

Trate o WebSocket como um recurso com escopo de sessão:

- abra‑o somente quando a experiência de voz estiver ativa;
- envie a configuração imediatamente após `open`;
- inicie quadros de microfone somente depois que a configuração foi enviada;
- pare a captura do microfone antes de fechar intencionalmente o socket;
- limpe filas de áudio e chamadas de ferramenta pendentes quando o socket fechar;
- trate um fechamento de servidor após `end_call` como término de sessão intencional, não como falha de reconexão automática;
- use backoff exponencial com jitter para falhas de transporte inesperadas;
- não reproduza automaticamente quadros de áudio ou resultados de ferramentas da conexão anterior;
- informe ao usuário que uma reconexão inicia uma nova conversa;
- crie uma nova sequência de entrada começando em `0` somente para o novo WebSocket.

Não tente novamente erros de configuração terminais sem mudar a configuração. Para falhas de rede transitórias, limite as tentativas e forneça um controle de reconexão explícito para que o usuário não fique preso em um loop invisível.

## Checklist de produção

Antes de enviar, verifique se a integração:

- mantém a chave de API privada em um backend confiável;
- envia a configuração como a primeira e única mensagem `session_start`;
- ignora o heartbeat de texto simples `keep-alive` antes de analisar eventos JSON;
- captura PCM mono s16le verdadeiro a 16 kHz;
- mantém `sequence` de entrada estritamente crescente durante toda a conexão;
- continua enviando silêncio para que limites de fala do servidor possam ser concluídos;
- decodifica cada evento `output_audio` como um arquivo WAV independente;
- ordena payloads de resposta por seu `sequence` escopo de resposta;
- separa filas de reprodução por `response_id`;
- não confunde `response.done` com conclusão de reprodução;
- envia a conclusão da reprodução somente após o usuário ouvir o segmento final;
- para o áudio imediatamente ao receber `output_audio_cancelled`;
- relata o corte real da reprodução através de `conversation.item.truncate`;
- valida e autoriza cada chamada de ferramenta do cliente;
- retorna cada resultado de ferramenta pendente com o ID exato da chamada;
- trata `error`, `error` de socket e `close` de socket de forma independente;
- limpa o estado da sessão ao desconectar em vez de reproduzir trabalho antigo;
- evita registrar chaves de API, áudio bruto do microfone, transcrições ou resultados de ferramentas, a menos que o produto tenha uma política explícita de retenção e privacidade.