Source: https://docs.aivax.net/pt-br/docs/generations/speech.html

# Texto para Fala (TTS)

Use a Geração de Fala quando seu aplicativo já tiver o texto final e precisar de áudio reproduzível sem executar uma conclusão de chat. Usos típicos incluem narrar um artigo ou notificação, dar voz a um prompt IVR, produzir uma narração em áudio rascunho para revisão ou gerar arquivos de áudio para reprodução offline.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha a forma de entrega

O endpoint pode retornar áudio em duas formas, e a escolha certa depende do consumidor:

- **Áudio binário (`raw: true`)** — o corpo da resposta é o próprio arquivo de áudio, servido inline com seu tipo MIME. Use isso quando um player, elemento `<audio>` do navegador ou fluxo de download consumir a resposta diretamente.
- **Base64 no envelope JSON (`raw: false`)** — a resposta contém o formato, o tipo MIME e o áudio codificado em base64 dentro do envelope padrão. Use isso quando o resultado viaja por pipelines JSON, é armazenado em um banco de dados ou precisa ser inspecionado junto com metadados de cobrança.

Os formatos suportados são `mp3`, `wav` e `ogg`. Quando o consumidor aceita qualquer um deles, prefira `mp3` para payloads menores e `wav` para máxima compatibilidade com ferramentas de áudio.

## Gerar fala

Escreva o texto que está pronto para ser falado em voz alta, incluindo pontuação e formatação que comuniquem pausas ou ênfase. Expanda abreviações e numerais da maneira como devem ser ouvidos, como "doutor" em vez de "Dr." ou "vinte e vinte e seis" em vez de "2026", em vez de confiar na voz para adivinhar.

Teste a voz selecionada com conteúdo representativo antes de usá-la em produção, especialmente para nomes, abreviações ou termos especializados. As vozes diferem por modelo de fala, então confirme a voz contra o modelo que você usará em vez de assumir que as vozes de um modelo existem em outro.

A referência embutida é a fonte da verdade para modelos e vozes disponíveis, opções de solicitação, formatos de saída e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20speech)

Para permitir que um agente ou IDE compatível com MCP sintetize fala sem chamar este endpoint diretamente, use o [MCP de geração de mídia](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md). Ele retorna uma URL pública para áudio MP3 em vez de áudio inline.

## Fala ou Sessões de Voz

Use a Geração de Fala para síntese única de texto conhecido. Use [Sessões de Voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) quando a experiência for uma conversa falada interativa com interrupções, revezamento e chamadas de ferramenta. Encadear transcrição, inferência e síntese manualmente adiciona latência que a sessão em tempo real evita.

## Preços, limites e erros

O preço da geração de fala varia por modelo; as tarifas atuais estão listadas no [Catálogo de Modelos](https://aivax.net/models#text-to-speech).

As solicitações autônomas de texto para fala são limitadas por minuto, e por hora no plano Gratuito; consulte [Limites de fala](https://docs.aivax.net/pt-br/docs/limits.md#speech). As Sessões de Voz não estão sujeitas a essas cotas de solicitações autônomas; elas seguem o acesso, saldo e limites de inferência do modelo de tempo real selecionado. Revise os erros de validação relatados antes de tentar novamente uma solicitação com falha.
