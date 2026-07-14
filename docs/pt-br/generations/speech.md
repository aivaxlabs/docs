# Geração de Voz

Use a geração de voz quando sua aplicação já possui o texto final e precisa de áudio reproduzível sem executar uma conclusão de chat. AIVAX envia o texto para o modelo de texto‑para‑voz selecionado, converte o resultado para WAV ou MP4, registra o uso do modelo e devolve áudio binário ou base64 dentro do envelope padrão de resposta JSON.

Antes de chamar este endpoint, [crie uma chave de API](/docs/pt-br/authentication) e certifique‑se de que a conta tem saldo positivo. O nome do modelo identifica o mecanismo de voz; `voice` é específico do provedor, portanto use uma voz suportada pelo modelo selecionado.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/speech</span>
</div>

Nomes de modelos suportados são:

| Modelo | Modelo de base | Voz padrão quando omitida |
| --- | --- | --- |
| `Gpt4oTts` | `gpt-4o-mini-tts` | `nova` |
| `ElevenMultilingualV2` | `eleven-multilingual-v2` | `nova` |
| `ElevenV3` | `eleven-v3` | `nova` |
| `GrokVoice` | `x-ai/grok-voice-tts-1.0` | `Eve` |

## Comportamento da solicitação

| Propriedade | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `model` | `string` | Obrigatório | Um dos nomes de modelo suportados acima. A correspondência não diferencia maiúsculas de minúsculas. |
| `input` | `string` | Obrigatório | Texto não vazio a ser sintetizado. |
| `voice` | `string` | Padrão do modelo | Nome da voz específico do provedor. |
| `format` | `string` | `wav` | Contêiner de saída: `wav` ou `mp4`. |
| `raw` | `boolean` | `false` | Retorna áudio binário quando `true`; retorna JSON base64 quando `false`. |

Quando `raw` é `true`, o tipo de conteúdo da resposta é `audio/wav` ou `audio/mp4`, e o nome do arquivo é exposto através de `Content-Disposition`. Quando `raw` é `false`, `data.format`, `data.mimeType` e `data.data` descrevem o áudio gerado; `data.data` contém o valor base64.

O endpoint registra os custos de texto‑para‑voz retornados pelo modelo selecionado e associa o uso à chave de API autenticada. O multiplicador de comissão de plano normal [/docs/pricing#usage-billing](/docs/pt-br/pricing#usage-billing) se aplica. Atualmente não há cota de plano dedicada para geração de voz; limites de solicitação ao nível de autenticação ainda se aplicam a chaves de API públicas.

A referência de API incorporada abaixo contém os exemplos de solicitação e resposta usados pela documentação do servidor:

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20speech&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Depois de receber o JSON base64, decodifique `data.data` usando o formato em `data.format`. Se o consumidor puder transmitir ou salvar o corpo HTTP diretamente, defina `raw` como `true` para evitar a sobrecarga do base64.