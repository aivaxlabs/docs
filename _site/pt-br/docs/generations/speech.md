Source: https://docs.aivax.net/pt-br/docs/generations/speech.html

# Texto para fala (TTS)

Use Speech Generation when your application already has final text and needs playable audio without running a chat completion. Typical uses include narrating an article or notification, voicing an IVR prompt, producing a draft voice-over for review, or generating audio files for offline playback.

Authenticate requests with an AIVAX API key. See [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md) for authorization guidance.

## Escolha a forma de entrega

The endpoint can return audio in two forms, and the right choice depends on the consumer:

- **Áudio binário (`raw: true`)** — o corpo da resposta é o próprio arquivo de áudio, servido inline com seu tipo MIME. Use isso quando um player, elemento `<audio>` do navegador ou fluxo de download consome a resposta diretamente.
- **Base64 no envelope JSON (`raw: false`)** — a resposta contém o formato, tipo MIME e áudio codificado em base64 dentro do envelope padrão. Use isso quando o resultado passa por pipelines JSON, é armazenado em um banco de dados ou precisa ser inspecionado junto com metadados de faturamento.

Os formatos suportados são `mp3`, `wav` e `ogg`. Quando o consumidor aceita qualquer um deles, prefira `mp3` para cargas menores e `wav` para máxima compatibilidade com ferramentas de áudio.

## Gerar fala

Escreva o texto pronto para ser falado em voz alta, incluindo pontuação e formatação que comuniquem pausas ou . Expanda abreviações e numerais da forma como devem ser ou, como "doctor" ao invés de "Dr." ou "twenty twenty-six" ao invés de "2026", em vez de confiar que a voz adivinhe.

Teste a voz selecionada com conteúdo representativo antes de usar em produção, especialmente para nomes, abreviações ou termos especializados. As vozes variam por modelo de fala, portanto confirme a voz no modelo que você usará, em vez de presumir que as vozes de um modelo existam em outro.

A referência incorporada é a fonte de verdade para modelos e vozes disponíveis, opções de requisição, formatos de saída e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20speech)

Para permitir que um agente ou IDE compatível com MCP sintetize fala sem chamar este endpoint diretamente, use o [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md). Ele devolve uma URL pública para áudio MP3 em vez de áudio inline.

## Sessões de fala ou voz

Use a geração de fala para síntese única de texto conhecido. Use [Voice Sessions](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) quando a experiência for uma conversa falada interativa com interrupções, turnos e chamadas de ferramentas. Encadear transcrição, inferência e síntese manualmente adiciona latência que a sessão em tempo real evita.

## Preços, limites e erros

O preço da geração de fala varia por modelo; as tarifas atuais estão listadas no catálogo de Modelos.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Solicitações independentes de texto‑fala | 3/min e 40/hora | 30/min | 300/min |

As sessões de voz não estão sujeitas a esses limites de requisição independentes; elas seguem o acesso, saldo e limites de inferência do modelo em tempo real selecionado. Revise os erros de validação relatados antes de tentar novamente uma requisição falhada.
