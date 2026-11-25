---
{title: Registros de alterações,linkTitle: Registros de alterações,weight: 40,group: Legal documents,aliases: [/docs/pt-br/changelogs.html,/docs/pt-br/legal/changelogs.html],sourceHash: c37e06822edfd103}
---

# Changelogs

Alterações nos produtos, serviços e API pública da AIVAX.

Esta página lista as alterações dos últimos 14 dias. As entradas mais antigas são mantidas no [arquivo de changelogs](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md).

## Alterações futuras

Alterações anunciadas que entrarão em vigor em uma data futura e podem exigir ação.

- **Modelos — Nomes antigos de modelos deixarão de funcionar em 1º de dezembro de 2026.** Os nomes de modelos substituídos na renomeação de 1º de novembro de 2026, aliases de decisão sem `:latest`, `@x-ai/grok-imagine-pro` e `@microsoft/mai-image-2.5-flash` serão rejeitados, e os gateways de IA salvos que ainda armazenam um nome antigo de modelo de linguagem falharão até serem atualizados. Gateways que armazenam um nome antigo de modelo de imagem não podem mais ser salvos, e sua ferramenta de chat de imagens muda para `@black-forest-labs/flux-schnell`; substitua os nomes anteriores pelos retornados pelos catálogos de modelos, conforme mostrado na [entrada de 1º de novembro de 2026](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md#sunday-november-1st-2026) e na entrada de 24 de novembro abaixo.
- **Clientes de chat — URLs de webhook de mensagens antigos deixarão de funcionar em 1º de dezembro de 2026.** URLs de webhook do Telegram, Z-API, Evolution API e Kapso sem a chave de integração serão rejeitados. Copie a nova URL nas configurações de integração e atualize-a no provedor, ou use **Atualizar hooks** para o Telegram; consulte [URLs de Webhook](/docs/pt-br/inference/chat-clients/integrations.md#webhook-urls).

## Wednesday, November 25th, 2026

Alterações:

- **Inferência — Gerações assíncronas.** Adicione `"async": true` às conclusões de chat, Respostas, Mensagens, processamento de dados, geração de imagens e fala, transcrição, Agentic Test, reranking, pesquisa web e solicitações de busca web para colocá-las em fila: a API responde com HTTP `202` e um ID, e você busca o resultado armazenado ou recebe um webhook quando terminar. Gerencie os itens em fila em `/api/v1/async-generations`; solicitações em streaming e chaves de API pública não podem ser colocadas em fila. Consulte [Gerações assíncronas](/docs/pt-br/inference/batch/async-generations.md).

## Tuesday, November 24th, 2026

Alterações disruptivas (Breaking changes):

- **Geração de imagens — Grok Imagine Pro e MAI-Image-2.5 Flash removidos.** `@x-ai/grok-imagine-pro` e `@microsoft/mai-image-2.5-flash` não estão mais no catálogo. Até 1º de dezembro de 2026, solicitações e gateways que os mencionam são atendidos por `@x-ai/grok-imagine-image-2.0` e `@microsoft/mai-image-2.7-flash`, aos preços desses modelos; atualize-os antes dessa data. Consulte [Geração de imagens](/docs/pt-br/generations/images.md).

Alterações:

- **Geração de imagens — Novos modelos.** Adiciona `@microsoft/mai-image-2.7` ($0,029 por imagem de saída mais $0,025 por imagem de referência por saída), `@microsoft/mai-image-2.7-flash` ($0,008 mais $0,008), `@bytedance/seedream-5.5` ($0,035 mais $0,008), `@minimax/minimax-h3-image` ($0,004 mais $0,006) e `@minimax/minimax-h3-image-highspeed` ($0,008 mais $0,013). Todos eles suportam edição de imagem de referência. Consulte [Geração de imagens](/docs/pt-br/generations/images.md).
- **Geração de imagens — Modelos mais antigos descontinuados.** `@microsoft/mai-image-2.6`, `@microsoft/mai-image-2.6-flash` e `@openai/gpt-image-2` agora estão marcados como descontinuados. Eles continuam funcionando por enquanto; migre para `@microsoft/mai-image-2.7`, `@microsoft/mai-image-2.7-flash` ou `@openai/gpt-image-2.6-flare`.
- **Geração de imagens — Atualização de preço do Qwen Image 2.1.** `@qwen/qwen-image-2.1` agora custa $0,042 por imagem de saída, abaixo de $0,06, mais $0,035 por imagem de referência por saída, abaixo de $0,13.

## Monday, November 23rd, 2026

Alterações:

- **Inferência — Endpoints de Respostas e Mensagens Anthropic.** Adiciona `POST /v1/responses` (também `/api/v1/responses`), seguindo a especificação Open Responses e compatível com clientes da API de Respostas da OpenAI, e `POST /v1/messages` (também `/api/v1/messages`), compatível com a API de Mensagens da Anthropic, seus SDKs e Claude Code. Ambos aceitam um nome de modelo integrado ou um Gateway de IA como `model`, suportam streaming, ferramentas de função, imagens, arquivos e raciocínio, e são cobrados como conclusões de chat. O endpoint de Respostas é stateless, então envie a conversa completa em `input`. O cabeçalho `x-api-key` também é aceito para autenticação.
- **Observabilidade — Pesquisa de conversas aprimorada.** A pesquisa de texto livre agora pode ser combinada com filtros em `GET /api/v1/conversations`, que também aceita filtros `--id`, `--token` e `--rid` e retorna `conversationToken` e `requestId`. O comando CLI `conversations list` adiciona `--search`, `--id`, `--token` e `--request-id`.

## Friday, November 20th, 2026

Alterações:

- **Conta — Renovação mensal da cota de modelos de assinatura.** A cota de modelos de assinatura mensal agora se renova um mês após seu primeiro uso em cada ciclo, em vez de no dia 1º de cada mês. `resetAt` na resposta do saldo da conta mostra a próxima renovação.
- **Modelos — Novos modelos de assinatura.** Adiciona `@aivax-subscription/qwen3.8-max`, `@aivax-subscription/step-5-preview` e `@aivax-subscription/grok-4.7` ao catálogo de modelos de assinatura. Consulte [Modelos de assinatura](/docs/pt-br/inference/subscription-models/overview.md).
- **Gateways de IA — Alternância de acesso à internet para a ferramenta Bash virtual.** As configurações do gateway de IA agora incluem uma opção **Permitir acesso à internet** para a ferramenta Bash virtual, ativada por padrão. Desative-a para executar comandos totalmente offline.

## Thursday, November 19th, 2026

Alterações:

- **RAG — Limites de documentos por conta e por coleção.** Cada plano agora limita o número de documentos armazenados por conta e por coleção: Free 2.000 por conta e 1.000 por coleção, Pro 200.000 e 50.000, Max 250.000 por conta sem limite de conta, e Ultimate 500.000 por coleção sem limite de conta. Quando um limite é atingido, a criação de um documento retorna `400 Bad Request`; exclua documentos ou faça upgrade do plano para continuar. Consulte [Planos e Limites](/docs/pt-br/limits.md#rag-and-collections).

## Wednesday, November 18th, 2026

Alterações disruptivas (Breaking changes):

- **Modelos — Campos de modelos de assinatura.** `GET /api/v1/information/models.json` não retorna mais `pricing[].subscriptionMultiplier` e agora retorna `flags.isSubscription`. Em `GET /v1/models`, `_details.provider_model.subscription_multiplier` é substituído pelo booleano `_details.provider_model.subscription`. Modelos de assinatura retornam arrays de precificação vazios. Atualize clientes que leem os campos removidos para usar os novos; consulte [Nomes de modelos e gateways](/docs/pt-br/inference/ai-gateways/models-and-gateway-names.md).
- **Transcrições de áudio — Grok STT 1.0 removido.** `@x-ai/grok-stt-1.0` (também aceito como `x-ai/grok-stt-1.0`) chegou ao fim da vida útil e não está mais disponível; solicitações que o mencionam agora falham. `@x-ai/grok-stt-2.0` o substitui como o modelo padrão de fala para texto ao mesmo preço de $0,10 por hora. Atualize solicitações que mencionam o modelo antigo para usar `@x-ai/grok-stt-2.0`, ou omita o modelo para usar o padrão; consulte [Transcrições de áudio](/docs/pt-br/generations/audio-transcriptions.md).

Correções:

- **Fala — Rótulos de preço no painel.** O painel agora mostra o preço correto para `@elevenlabs/eleven-v3`, `@elevenlabs/eleven-multilingual-v2` e TTS GPT-4o mini.
- **Modelos — Busca de modelos por ID com prefixo de fornecedor.** O filtro `name` em `GET /api/v1/information/models.json` e o parâmetro `filter` em `GET /v1/models` agora reconhecem nomes como `minimax-m3.1-flash` para `@minimax/m3.1-flash`.

Alterações:

- **Conta — Cota mensal de modelos de assinatura.** Pro, Max e Ultimate agora incluem uma cota mensal para modelos de assinatura, cujos nomes começam com `@aivax-subscription/`. Usar esses modelos nunca debita o saldo da conta. Quando a cota se esgota, ou o plano não tem nenhuma, solicitações a modelos de assinatura retornam `429 Too Many Requests`. Modelos de assinatura não estão disponíveis quando **Zero data retention providers only** está habilitado. Consulte [Modelos de assinatura](/docs/pt-br/inference/subscription-models/overview.md).
- **Resumo e Extração — URLs de PDF.** Uma parte `file` agora pode apontar para um URL HTTP(S) público de um PDF.
- **Transcrições de áudio — Novos modelos e menor preço do Parakeet.** Adicionado `@nvidia/nemotron-3.5-transcribe` ($0,001 por minuto, gravações de até uma hora, 40 idiomas) e `@qwen/qwen3-asr-1.7b` ($0,027 por hora). `@nvidia/parakeet-tdt-0.6b-v3` agora custa $0,001 por minuto, abaixo de $0,0015.
- **Fala — Speechify Simba 3.5 e preços atualizados.** Adicionado `@speechify/simba-3.5`, um modelo de texto para fala que cobre 48 idiomas, a $0,0075 por 1.000 caracteres. `@fish-audio/drama-3` agora custa $0,01 por 1.000 caracteres, acima de $0,002, e `@elevenlabs/eleven-flash-v2.5` custa $0,02, acima de $0,01.

## Tuesday, November 17th, 2026

Correções:

- **Clientes de chat — Metadados de sessão em integrações de mensagens.** Respostas e mensagens agendadas do WhatsApp, Telegram e outras integrações de mensagens agora carregam os metadados da sessão para servidores MCP, funções de protocolo, workers de gateway e conversas salvas, assim como as sessões de chat web já faziam.
- **Gateways — Chaves de metadados reservados do MCP.** Chaves de metadados personalizados começando com `_aiv` não fazem mais as chamadas de ferramenta MCP falharem.
- **Ferramentas — Explicações de ferramentas com servidores MCP estritos.** Com explicações de ferramentas habilitadas, servidores MCP e funções de protocolo que rejeitam argumentos desconhecidos agora funcionam conforme o esperado. Consulte [Explicações de ferramentas](/docs/pt-br/inference/response-rendering/tool-explanations.md).
- **Modelos — Busca de modelos com sufixos.** O filtro `name` de `GET /api/v1/information/models.json` agora ignora uma tag de provedor `#` ou um sufixo de variante `:` e retorna o modelo base correspondente.

Alterações:

- **Modelos — GPT-6.2 Astra e GPT-6.2 Sol.** Adiciona `@openai/gpt-6.2-astra`, `@openai/gpt-6.2-astra:pro`, `@openai/gpt-6.2-sol` e `@openai/gpt-6.2-sol:pro`, com raciocínio, entrada de imagem e arquivo, chamada de ferramentas e saída estruturada. `@model-router/openai:frontier` agora roteia para `@openai/gpt-6.2-astra` em vez de `@openai/gpt-6-astra`; selecione `@openai/gpt-6-astra` diretamente para manter o modelo anterior.
- **Decisões — Liquid d1.2 e d1.2-ultra.** Adiciona `@liquid/d1.2` e `@liquid/d1.2-ultra`, com contexto de 64K, entrada de imagem e perguntas sim/não, múltipla escolha e pontuação. `@liquid/d:latest` agora resolve para `@liquid/d1.2` em vez de `@liquid/d1.1`. Verifique os preços na [lista de modelos de decisão](/docs/pt-br/data-processing/decisions.md#discover-models-programmatically).
- **Gateways — Metadados em toda solicitação MCP.** A AIVAX agora envia o contexto de chamada e metadados personalizados em `params._meta` de toda solicitação a um servidor MCP, incluindo `initialize`, `tools/list`, `skills/list` e `resources/read`, não apenas `tools/call`. Consulte [Metadados enviados com solicitações MCP](/docs/pt-br/tools/mcp.md#metadata-sent-with-mcp-requests).
- **Clientes de chat — Raciocínio e atividade de ferramentas no chat hospedado.** O chat web hospedado agora mostra raciocínio e chamadas de ferramentas em blocos expansíveis, ocultos quando a **Visibilidade de chamadas de ferramentas** (`showToolCalls`) está desligada. Consulte [Publicar o chat hospedado](/docs/pt-br/inference/chat-clients/web-client.md#publish-the-hosted-chat) e [Explicações de ferramentas](/docs/pt-br/inference/response-rendering/tool-explanations.md).

## Monday, November 16th, 2026

Correções:

- **Conta — Recargas pagas com método de pagamento salvo.** Adicionar créditos não abre mais uma aba de navegador vazia quando um método de pagamento salvo liquida o pagamento imediatamente. O painel confirma o pagamento.

Alterações:

- **Conta — Impostos brasileiros sobre pagamentos.** Novos pagamentos, incluindo recargas de crédito e assinaturas, agora incluem impostos brasileiros adicionados sobre o valor devido. O painel mostra o total antes de você confirmar, e os recibos listam cada imposto. Consulte [Impostos sobre pagamentos](/docs/pt-br/pricing.md#taxes-on-payments).
- **Conta — Faturas de serviço.** Faturas de serviço (nota fiscal de serviços) podem ser baixadas na aba Faturas de Analytics, e você é notificado quando uma é emitida. Os dados de uso retornam o link em `serviceInvoiceLocation`.
- **Decisões — Entrada de conversa e mídia.** Solicitações de decisão agora aceitam `input`, um array de mensagens de conversa, em vez de `state`. Partes de imagem, áudio, vídeo e documento são avaliadas em modelos que as suportam. Consulte [Enviar mídia](/docs/pt-br/data-processing/decisions.md#send-media).
- **Roteamento — Etapas auxiliares em provedores de retenção zero.** Moderação de conteúdo, roteador de complexidade, reescrita de consulta RAG, resumos de áudio de cliente de chat, instruções de voz de fala e Injetor de Mídia agora sempre são executados em provedores de retenção zero. Consulte **Zero data retention providers only**.
- **Analytics — Totais de pagamento no relatório mensal.** O relatório mensal agora soma os pagamentos confirmados no mês, com seus impostos e taxas, retornados em `payments` por Get Monthly Usage Report.
- **RAG — Reranker Reflex v1.5.** O endpoint de rerank aceita `@aivax/reflex-v1.5`, uma opção de maior precisão para `@aivax/reflex-v1`. Ele classifica até 15.000 documentos por solicitação, retorna até 50 resultados e custa $0,015 por 1M tokens de entrada. Consulte [Reranking](/docs/pt-br/rag/reranking.md).

## Friday, November 13th, 2026

Alterações disruptivas (Breaking changes):

- **Clientes de chat — `allowedFrameOrigins` removido.** A opção obsoleta `allowedFrameOrigins` do cliente de chat não é mais retornada quando você lê um cliente de chat. Solicitações que ainda a enviam continuam funcionando, e o valor é ignorado. Consulte [Publicar o chat hospedado](/docs/pt-br/inference/chat-clients/web-client.md#publish-the-hosted-chat).

Correções:

- **Batch — Trabalhos retomam após o limite diário de itens.** Trabalhos pausados pelo limite diário de itens do plano agora retomam automaticamente após a reinicialização do limite. Consulte [Limites de Batch e Agentic Tests](/docs/pt-br/limits.md#batch-and-agentic-tests).
- **Clientes de chat — Contagem de tokens de sessão após Send Prompt.** Sessões que recebem mensagens através do Send Prompt agora relatam sua contagem de tokens na listagem de sessões.

Alterações:

- **Clientes de chat — Inserir mensagens em uma sessão.** O novo endpoint `POST /api/v1/web-chat-client/<chat-client-id>/sessions/insert-message` anexa mensagens de usuário, assistente ou ferramenta a uma sessão ativa, identificada por `sessionId` ou `tag`, sem executar inferência. As mensagens inseridas são usadas como contexto pela próxima prompt.

## Thursday, November 12th, 2026

Alterações disruptivas (Breaking changes):

- **Geração de imagens — DreamShaper 8 LCM removido.** `@lykon/dreamshaper-8-lcm` não está mais disponível, e solicitações que o mencionam são rejeitadas. Escolha outro modelo de texto para imagem, como `@black-forest-labs/flux-schnell`. Consulte [Geração de imagens](/docs/pt-br/generations/images.md).

Alterações:

- **Clientes de chat — Contexto descartável no Send Prompt.** Send Prompt aceita um novo campo `context` com partes de conteúdo de texto ou compatíveis com OpenAI, incluindo imagens, áudio, vídeo e arquivos. O contexto se aplica apenas a essa solicitação e não é salvo no histórico da sessão. Consulte [Adicionar contexto descartável à última mensagem do usuário](/docs/pt-br/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).
- **Geração de imagens — GPT Image 2.6 Flare e Sunburst.** Adiciona `@openai/gpt-image-2.6-flare`, para geração rápida, e `@openai/gpt-image-2.6-sunburst`, para composições detalhadas. Ambos suportam edição de imagem de referência e são precificados em $0,025 por imagem de saída mais $0,025 por imagem de referência por saída.
- **Geração de imagens — Modelos mais antigos descontinuados.** `@openai/gpt-image-2.5-flare`, `@openai/gpt-image-2.5-sunburst` e `@openai/gpt-image-1-mini` agora estão marcados como descontinuados. Eles continuam funcionando por enquanto; migre para `@openai/gpt-image-2.6-flare`, `@openai/gpt-image-2.6-sunburst` ou `@openai/gpt-image-2`.
- **Geração de imagens — Preços menores.** `@bytedance/seedream-5-pro` agora custa $0,035 por imagem de saída, abaixo de $0,09, e `@recraft/recraft-v4.1-flash` custa $0,007, abaixo de $0,008.

## Wednesday, November 11th, 2026

Correções:

- **Conta — Recargas de crédito adicionam o valor escolhido ao saldo.** Uma recarga agora adiciona exatamente o valor que você escolhe ao seu saldo; as taxas são cobradas separadamente. Consulte [Recargas de crédito](/docs/pt-br/pricing.md#credit-top-ups).

Alterações:

- **Painel — Página inicial redesenhada.** A página inicial do painel agora mostra seu saldo de crédito, tendências de uso das últimas 24 horas a 90 dias e atalhos para os principais produtos.
- **Gateways de IA — Novos eventos de worker `tool.fetched` e `message.completed`.** Os workers de gateway agora recebem `tool.fetched` após uma ferramenta do lado do servidor retornar seu resultado, e podem manter, bloquear ou substituir esse resultado com uma ação `tool.fetched.response`. Os workers também recebem `message.completed` após cada inferência terminar, com as mensagens, erros e uso. Consulte [Workers de Gateway](/docs/pt-br/inference/workers.md).
- **Conta — Sem taxa de serviço em recargas de crédito para Pro, Max e Ultimate.** Adicionar créditos no Pro, Max e Ultimate não inclui mais a taxa de serviço. Consulte [Recargas de crédito](/docs/pt-br/pricing.md#credit-top-ups).
- **Conta — Teto diário na comissão de inferência.** A comissão de inferência do plano na inferência de modelo integrado é agora limitada a $1,50 por dia no Free, $1,20 no Pro e $1,00 no Max. Após o teto ser atingido, a inferência de modelo naquele dia é cobrada apenas nas taxas do modelo. Consulte [Multiplicadores de plano](/docs/pt-br/pricing.md#plan-multipliers).
