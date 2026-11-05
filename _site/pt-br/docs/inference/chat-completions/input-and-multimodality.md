Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/input-and-multimodality.html

# Entrada e multimodalidade

Envie a conversa em `messages`, utilizando os papéis do OpenAI `system`, `user`, `assistant` e `tool`. Com um Gateway de IA, as instruções de sistema do gateway são adicionadas às mensagens `system` que você envia.

## Partes de conteúdo

A AIVAX aceita partes de conteúdo de mensagens compatíveis com o OpenAI para texto, imagens, áudio, vídeos e arquivos. O modelo selecionado deve suportar a modalidade, a menos que você solicite à AIVAX [pré-processar a mídia em texto](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md).

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Descreva brevemente estas entradas."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,<CONTEÚDO_BASE64_PNG>",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "<CONTEÚDO_BASE64_WAV>",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "documento.pdf",
                        "file_data": "data:application/pdf;base64,<CONTEÚDO_BASE64_PDF>"
                    }
                }
            ]
        }
    ]
}
```

Mapeamentos de partes de conteúdo suportados:

- `text`: Texto simples.
- `image_url`: Conteúdo de imagem. `image_url.url` pode ser uma URL externa ou uma URL de dados base64. `image_url.detail` pode ser `low`, `high` ou `auto` quando o modelo oferece suporte.
- `video_url`: Conteúdo de vídeo. `video_url.url` pode ser uma URL externa ou uma URL de dados base64. Prefira URLs para vídeos grandes.
- `input_audio`: Conteúdo de áudio. `input_audio.data` são dados de áudio em base64 e `input_audio.format` nomeia o formato.
- `file`: Conteúdo de arquivo. `file.filename` nomeia o arquivo e `file.file_data` pode ser uma URL externa ou uma URL de dados base64.

Para entrada de vídeo, envie uma parte de conteúdo `video_url`. O exemplo a seguir usa uma URL de dados base64; para vídeos grandes, prefira uma URL publicamente acessível:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Resuma as ações principais neste vídeo e identifique quaisquer riscos de segurança visíveis."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "data:video/mp4;base64,<CONTEÚDO_BASE64_MP4>"
                    }
                }
            ]
        }
    ]
}
```

Os links externos devem ser acessíveis à AIVAX sem autenticação, restrições de firewall ou renderização apenas via JavaScript. A inferência pode falhar devido a downloads com falha, redirecionamentos, URLs bloqueadas, formatos não suportados ou limites de tamanho específicos do provedor.

## Atalho de prompt

Para uma solicitação simples apenas de texto, você pode enviar `prompt` em vez de `messages`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Diga olá"
}
```

## Requisitos de mídia

Solicitações com mídia exigem um saldo mínimo na conta: arquivos e vídeos precisam de um saldo maior do que imagens e áudio. A mídia é cobrada pelo modelo selecionado de acordo com suas taxas de entrada. Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de usar mídia em produção.

Quando o modelo selecionado não suporta uma modalidade, converta a mídia em texto usando [pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md).

## Quando uma solicitação multimodal falha

Reduza o escopo do problema:

1. Teste uma mensagem de texto simples com o mesmo modelo.
2. Teste um pequeno anexo.
3. Teste o mesmo anexo com `multimodal_resolver`.
4. Revise a URL, o formato, o tamanho e o suporte de modalidade do modelo.
