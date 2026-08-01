# Transcrições de Áudio

Use transcrições de áudio para converter a fala de um arquivo de áudio em texto. O endpoint dedicado aceita áudio codificado em base64, permite selecionar um modelo de fala‑para‑texto disponível e devolve a transcrição no envelope JSON padrão da AIVAX.

Use [Descrições de Mídia](media-descriptions.md) quando precisar processar vários itens de mídia em uma única requisição, descrever áudio não falado, analisar imagens ou vídeos, ou extrair texto de documentos.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/audio/transcriptions</span>
</div>

## Requisição

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `input_audio` | `object` | Sim | Contém o áudio em base64 e seu formato. |
| `input_audio.data` | `string` | Sim | Conteúdo bruto do áudio codificado em base64. Não inclua o prefixo data-URL. |
| `input_audio.format` | `string` | Sim | Um dos `wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`. |
| `model` | `string` | Não | Identificador do modelo de fala‑para‑texto. Quando omitido, a AIVAX usa o modelo padrão atual. |
| `language` | `string` | Não | Dica de idioma passada para o modelo selecionado. Omitir para permitir detecção automática quando o modelo a suportar. |

O arquivo de áudio decodificado não pode estar vazio nem exceder 75 MB. O formato declarado deve corresponder ao áudio que a AIVAX pode decodificar.

```json
{
  "model": "x-ai/grok-stt-1.0",
  "input_audio": {
    "data": "UklGRiQAAABXQVZFZm10...",
    "format": "wav"
  },
  "language": "en"
}
```

Os modelos disponíveis, seleção padrão, formatos suportados e preços baseados em duração são publicados pelo catálogo de modelos de transcrição de áudio:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Resposta

Uma requisição bem‑sucedida devolve o contrato de transcrição estável da AIVAX dentro de `data`. A resposta não expõe campos específicos do provedor. `usage.cost` é o valor final cobrado em USD, incluindo o multiplicador aplicável da conta, e `usage.process_time` é o tempo de processamento em segundos.

```json
{
  "message": null,
  "data": {
    "text": "Transcribed speech.",
    "usage": {
      "cost": 0.000028,
      "process_time": 1.234
    }
  }
}
```

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Cobrança e erros

A transcrição é cobrada pela duração do áudio ao preço publicado do modelo selecionado. A AIVAX mede o arquivo decodificado e arredonda sua duração para cima até o segundo inteiro seguinte para fins de contabilização.

Uma requisição pode falhar quando o modelo está indisponível, o base64 ou formato é inválido, o áudio não pode ser decodificado, a conta não tem saldo positivo ou o limite de requisições é excedido. Verifique o catálogo de modelos em tempo de execução ao invés de codificar a lista de modelos disponíveis ou o modelo padrão.