Source: http://localhost:1313/pt-br/docs/generations/speech.html

# Geração de Voz

Use a Geração de Voz quando seu aplicativo já tem o texto final e precisa de áudio reproduzível sem executar uma conclusão de chat. Os usos típicos incluem narrar um artigo ou notificação, dar voz a um prompt de IVR, produzir um rascunho de locução para revisão ou gerar arquivos de áudio para reprodução offline.

Autentique solicitações com uma chave de API AIVAX. Consulte [Autenticação](http://localhost:1313/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha a forma de entrega

O endpoint pode retornar áudio em duas formas, e a escolha correta depende do consumidor:

- **Áudio binário (`raw: true`)** — o corpo da resposta é o próprio arquivo de áudio, servido inline com seu tipo MIME. Use isso quando um player, elemento `<audio>` do navegador ou fluxo de download consome a resposta diretamente.
- **Base64 no envelope JSON (`raw: false`)** — a resposta contém o formato, o tipo MIME e o áudio codificado em base64 dentro do envelope padrão. Use isso quando o resultado passa por pipelines JSON, é armazenado em um banco de dados ou precisa ser inspecionado junto com metadados de faturamento.

Formatos suportados são `mp3`, `wav` e `ogg`. Quando o consumidor aceita qualquer um deles, prefira `mp3` para cargas menores e `wav` para compatibilidade máxima com ferramentas de áudio.

## Gerar fala

Escreva texto que esteja pronto para ser falado em voz alta, incluindo pontuação e formatação que comuniquem pausas ou ênfase. Expanda abreviações e numerais da forma como devem ser ouvidos ("vinte e vinte e seis", "doutor" em vez de "Dr.") ao invés de confiar que a voz adivinhe.

Teste a voz selecionada com conteúdo representativo antes de usá-la em produção, especialmente para nomes, abreviações ou termos especializados. As vozes diferem por modelo de fala, portanto confirme a voz em relação ao modelo que você usará, ao invés de supor que as vozes de um modelo existam em outro.

A referência embutida é a fonte de verdade para modelos e vozes disponíveis, opções de solicitação, formatos de saída e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20speech)

Para permitir que um agente ou IDE compatível com MCP sintetize fala sem chamar diretamente este endpoint, use o [Geração de mídia MCP](http://localhost:1313/pt-br/docs/mcp-utilities/media-generation-mcp.md). Ele retorna uma URL pública para áudio MP3 ao invés de áudio inline.

## Sessões de fala ou voz

Use a Geração de Voz para síntese única de texto conhecido. Use [Sessões de Voz](http://localhost:1313/pt-br/docs/inference/voice-session.md) quando a experiência for uma conversa falada interativa com interrupções, troca de turnos e chamadas de ferramentas — encadear transcrição, inferência e síntese manualmente adiciona latência que a sessão em tempo real evita.

## Preços, limites e erros

Para preços, disponibilidade e limites de conta atuais, veja [Pricing](http://localhost:1313/pt-br/docs/pricing.md) e [Plans and Limits](http://localhost:1313/pt-br/docs/limits.md). Revise os erros de validação relatados antes de tentar novamente uma solicitação com falha.
