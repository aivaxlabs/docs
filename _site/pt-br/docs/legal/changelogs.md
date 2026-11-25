Source: https://docs.aivax.net/pt-br/docs/legal/changelogs.html

# Changelogs

Alterações nos produtos, serviços e na API pública da AIVAX.

Esta página lista as alterações dos últimos 14 dias. As entradas mais antigas estão mantidas no [arquivo de changelogs](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md).

## Wednesday, November 25th, 2026

Alterações:

- **Inference — Gerações assíncronas.** Adicione `"async": true` às solicitações de chat completions, Responses, Messages, processamento de dados, geração de imagem e fala, transcrição, Agentic Test, reranking, web search e web fetch para colocá-las em fila: a API responde com HTTP `202` e um ID, e você busca o resultado armazenado ou recebe um webhook quando estiver concluído. Gerencie os itens em fila em `/api/v1/async-generations`; solicitações em streaming e chaves de API pública não podem ser colocadas em fila. Veja [Async generations](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md).

## Tuesday, November 24th, 2026

Alterações que quebram compatibilidade (Breaking changes):

- **Image generation — Grok Imagine Pro e MAI-Image-2.5 Flash removidos.** `@x-ai/grok-imagine-pro` e `@microsoft/mai-image-2.5-flash` não estão mais no catálogo. Até 1º de dezembro de 2026, as solicitações e gateways que os nomeiam são atendidos por `@x-ai/grok-imagine-image-2.0` e `@microsoft/mai-image-2.7-flash`, aos preços desses modelos; atualize-os antes dessa data. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

Alterações:

- **Image generation — Novos modelos.** Adiciona `@microsoft/mai-image-2.7` ($0,029 por imagem de saída mais $0,029 por imagem de referência por saída), `@microsoft/mai-image-2.7-flash` ($0,008 mais $0,008), `@bytedance/seedream-5.5` ($0,035 mais $0,008), `@minimax/minimax-h3-image` ($0,004 mais $0,006) e `@minimax/minimax-h3-image-highspeed` ($0,008 mais $0,013). Todos eles suportam edição com imagem de referência. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).
- **Image generation — Modelos mais antigos descontinuados.** `@microsoft/mai-image-2.6`, `@microsoft/mai-image-2.6-flash` e `@openai/gpt-image-2` agora estão marcados como descontinuados. Eles continuam funcionando por enquanto; migre para `@microsoft/mai-image-2.7`, `@microsoft/mai-image-2.7-flash` ou `@openai/gpt-image-2.6-flare`.
- **Image generation — Atualização de preço do Qwen Image 2.1.** `@qwen/qwen-image-2.1` agora custa $0,042 por imagem de saída, abaixo de $0,06, mais $0,035 por imagem de referência por saída, abaixo de $0,13.

## Monday, November 23rd, 2026

Alterações:

- **Inference — Endpoints Responses e Anthropic Messages.** Adiciona `POST /v1/responses` (também `/api/v1/responses`), seguindo a especificação Open Responses e compatível com clientes da API de Respostas da OpenAI, e `POST /v1/messages` (também `/api/v1/messages`), compatível com a API de Mensagens da Anthropic, seus SDKs e Claude Code. Ambos aceitam um nome de modelo integrado ou um AI Gateway como `model`, suportam streaming, ferramentas de função, imagens, arquivos e raciocínio, e são cobrados como chat completions. O endpoint Responses é stateless, então envie a conversa completa em `input`. O cabeçalho `x-api-key` também é aceito para autenticação.
- **Observability — Pesquisa melhorada em conversas.** A pesquisa por texto livre agora pode ser combinada com filtros em `GET /api/v1/conversations`, que também aceita filtros `--id`, `--token` e `--rid` e retorna `conversationToken` e `requestId`. O comando CLI `conversations list` adiciona `--search`, `--id`, `--token` e `--request-id`.

## Friday, November 20th, 2026

Alterações:

- **Account — Renovação da cota de modelos de assinatura mensal.** A cota de modelos de assinatura mensal agora se renova um mês após seu primeiro uso em cada ciclo, em vez de no dia 1º de cada mês. `resetAt` na resposta do saldo da conta mostra a próxima renovação.
- **Models — Novos modelos de assinatura.** Adiciona `@aivax-subscription/qwen3.8-max`, `@aivax-subscription/step-5-preview` e `@aivax-subscription/grok-4.7` ao catálogo de modelos de assinatura. Veja [Subscription models](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md).
- **AI gateways — Alternância de acesso à internet para a ferramenta Bash virtual.** As configurações do gateway da IA agora incluem uma opção **Allow internet access** para a ferramenta Bash virtual, ativada por padrão. Desative-a para executar comandos totalmente offline.

## Thursday, November 19th, 2026

Alterações:

- **RAG — Limites de documentos por conta e por coleção.** Cada plano agora limita o número de documentos armazenados por conta e por coleção: Free 2.000 por conta e 1.000 por coleção, Pro 200.000 e 50.000, Max 250.000 por conta sem limite de coleção, e Ultimate 500.000 por conta sem limite de coleção. Quando um limite é atingido, a criação de um documento retorna `400 Bad Request`; exclua documentos ou faça upgrade do plano para continuar. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#rag-and-collections).

## Wednesday, November 18th, 2026

Alterações que quebram compatibilidade (Breaking changes):

- **Models — Campos de modelos de assinatura.** `GET /api/v1/information/models.json` não retorna mais `pricing[].subscriptionMultiplier` e agora retorna `flags.isSubscription`. Em `GET /v1/models`, `_details.provider_model.subscription_multiplier` é substituído pelo booleano `_details.provider_model.subscription`. Modelos de assinatura retornam arrays de precificação vazios. Atualize os clientes que leem os campos removidos para usar os novos; veja [Models and gateway names](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/models-and-gateway-names.md).
- **Audio transcriptions — Grok STT 1.0 removido.** `@x-ai/grok-stt-1.0` (também aceito como `x-ai/grok-stt-1.0`) chegou ao fim da vida útil e não está mais disponível; solicitações que o nomeiam falham agora. `@x-ai/grok-stt-2.0` o substitui como o modelo padrão de fala para texto ao mesmo preço de $0,10 por hora. Atualize as solicitações que nomeiam o modelo antigo para usar `@x-ai/grok-stt-2.0`, ou omita o modelo para usar o padrão; veja [Audio transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md).

Correções (Fixes):

- **Speech — Rótulos de preço no painel.** O painel agora mostra o preço correto para `@elevenlabs/eleven-v3`, `@elevenlabs/eleven-multilingual-v2` e GPT-4o mini TTS.
- **Models — Busca de modelos por ID com prefixo do fornecedor.** O filtro `name` em `GET /api/v1/information/models.json` e o parâmetro `filter` em `GET /v1/models` agora reconhecem nomes como `minimax-m3.1-flash` para `@minimax/m3.1-flash`.

Alterações:

- **Account — Cota de modelos de assinatura mensal.** Pro, Max e Ultimate agora incluem uma cota mensal para modelos de assinatura, cujos nomes começam com `@aivax-subscription/`. Usar esses modelos nunca debita o saldo da conta. Quando a cota se esgota, ou o plano não tem nenhuma, as solicitações a modelos de assinatura retornam `429 Too Many Requests`. Modelos de assinatura não estão disponíveis quando **Zero data retention providers only** está habilitado. Veja [Subscription models](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md).
- **Summarization and Extraction — URLs de PDF.** Uma parte `file` agora pode apontar para uma URL HTTP(S) pública de um PDF.
- **Audio transcriptions — Novos modelos e menor preço do Parakeet.** Adicionado `@nvidia/nemotron-3.5-transcribe` ($0,001 por minuto, gravações de até uma hora, 40 idiomas) e `@qwen/qwen3-asr-1.7b` ($0,027 por hora). `@nvidia/parakeet-tdt-0.6b-v3` agora custa $0,001 por minuto, abaixo de $0,0015.
- **Speech — Speechify Simba 3.5 e preços atualizados.** Adicionado `@speechify/simba-3.5`, um modelo de texto para fala que cobre 48 idiomas, a $0,0075 por 1.000 caracteres. `@fish-audio/drama-3` agora custa $0,01 por 1.000 caracteres, acima de $0,002, e `@elevenlabs/eleven-flash-v2.5` custa $0,02, acima de $0,01.

## Tuesday, November 17th, 2026

Correções (Fixes):

- **Chat clients — Metadados de sessão em integrações de mensagens.** Respostas e mensagens agendadas do WhatsApp, Telegram e outras integrações de mensagens agora carregam os metadados da sessão para servidores MCP, funções de protocolo, workers de gateway e conversas salvas, assim como as sessões de chat web já faziam.
- **Gateways — Chaves de metadados reservados do MCP.** Chaves de metadados personalizados começando com `_aiv` não fazem mais as chamadas de ferramenta MCP falharem.
- **Tools — Explicações de ferramentas com servidores MCP estritos.** Com explicações de ferramentas habilitadas, servidores MCP e funções de protocolo que rejeitam argumentos desconhecidos agora funcionam conforme o esperado. Veja [Tool explanations](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md).
- **Models — Busca de modelos com sufixos.** O filtro `name` de `GET /api/v1/information/models.json` agora ignora uma tag de provedor `#` ou um sufixo de variante `:` e retorna o modelo base correspondente.

Alterações:

- **Models — GPT-6.2 Astra e GPT-6.2 Sol.** Adiciona `@openai/gpt-6.2-astra`, `@openai/gpt-6.2-astra:pro`, `@openai/gpt-6.2-sol` e `@openai/gpt-6.2-sol:pro`, com raciocínio, entrada de imagem e arquivo, chamada de ferramentas e saída estruturada. `@model-router/openai:frontier` agora roteia para `@openai/gpt-6.2-astra` em vez de `@openai/gpt-6-astra`; selecione `@openai/gpt-6-astra` diretamente para manter o modelo anterior.
- **Decisions — Liquid d1.2 e d1.2-ultra.** Adiciona `@liquid/d1.2` e `@liquid/d1.2-ultra`, com contexto de 64K, entrada de imagem e perguntas sim/não, múltipla escolha e pontuação. `@liquid/d:latest` agora resolve para `@liquid/d1.2` em vez de `@liquid/d1.1`. Verifique os preços na [lista de modelos de decisão](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#discover-models-programmatically).
- **Gateways — Metadados em toda solicitação MCP.** A AIVAX agora envia o contexto de chamada e metadados personalizados em `params._meta` de toda solicitação a um servidor MCP, incluindo `initialize`, `tools/list`, `skills/list` e `resources/read`, não apenas `tools/call`. Veja [Metadata sent with MCP requests](https://docs.aivax.net/pt-br/docs/tools/mcp.md#metadata-sent-with-mcp-requests).
- **Chat clients — Raciocínio e atividade de ferramentas no chat hospedado.** O chat web hospedado agora mostra raciocínio e chamadas de ferramentas em blocos expansíveis, ocultos quando a **Visibilidade de chamada de ferramenta** (`showToolCalls`) está desligada. Veja [Publish the hosted chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat) e [Tool explanations](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md).

## Monday, November 16th, 2026

Correções (Fixes):

- **Account — Recargas pagas com método de pagamento salvo.** Adicionar créditos não abre mais uma aba de navegador vazia quando um método de pagamento salvo liquida o pagamento imediatamente. O painel confirma o pagamento.

Alterações:

- **Account — Impostos brasileiros sobre pagamentos.** Novos pagamentos, incluindo recargas de crédito e assinaturas, agora incluem impostos brasileiros adicionados ao valor devido. O painel mostra o total antes de você confirmar, e os recibos listam cada imposto. Veja [Taxes on payments](https://docs.aivax.net/pt-br/docs/pricing.md#taxes-on-payments).
- **Account — Faturas de serviço.** Faturas de serviço (nota fiscal de serviços) podem ser baixadas na aba Faturas de Analytics, e você é notificado quando uma é emitida. Os dados de uso retornam o link em `serviceInvoiceLocation`.
- **Decisions — Entrada de conversa e mídia.** Solicitações de decisão agora aceitam `input`, um array de mensagens de conversa, em vez de `state`. Partes de imagem, áudio, vídeo e documento são avaliadas em modelos que as suportam. Veja [Send media](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#send-media).
- **Routing — Etapas auxiliares em provedores de retenção zero de dados.** Moderação de conteúdo, roteador de complexidade, reescrita de consulta RAG, resumos de áudio do cliente de chat, instruções de voz de fala e Media Injector agora sempre executam em provedores de retenção zero de dados. Veja [Zero data retention providers only](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md).
- **Analytics — Totais de pagamento no relatório mensal.** O relatório mensal agora soma os pagamentos confirmados no mês, com seus impostos e taxas, retornados em `payments` por Get Monthly Usage Report.
- **RAG — Reranker Reflex v1.5.** O endpoint de rerank aceita `@aivax/reflex-v1.5`, uma opção de maior precisão para `@aivax/reflex-v1`. Ele classifica até 15.000 documentos por solicitação, retorna até 50 resultados e custa $0,015 por 1M de tokens de entrada. Veja [Reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md).

## Friday, November 13th, 2026

Alterações que quebram compatibilidade (Breaking changes):

- **Chat clients — `allowedFrameOrigins` removido.** A opção obsoleta `allowedFrameOrigins` do cliente de chat não é mais retornada quando você lê um cliente de chat. Solicitações que ainda a enviam continuam funcionando, e o valor é ignorado. Veja [Publish the hosted chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat).

Correções (Fixes):

- **Batch — Jobs retomados após o limite diário de itens.** Jobs pausados pelo limite diário de itens do plano agora retomam automaticamente após a reinicialização do limite. Veja [Batch and Agentic Tests limits](https://docs.aivax.net/pt-br/docs/limits.md#batch-and-agentic-tests).
- **Chat clients — Contagem de tokens de sessão após Send Prompt.** Sessões que recebem mensagens através do Send Prompt agora relatam sua contagem de tokens na listagem de sessões.

Alterações:

- **Chat clients — Inserir mensagens em uma sessão.** O novo endpoint `POST /api/v1/web-chat-client/<chat-client-id>/sessions/insert-message` anexa mensagens de usuário, assistente ou ferramenta a uma sessão ativa, identificada por `sessionId` ou `tag`, sem executar inferência. As mensagens inseridas são usadas como contexto pela próxima prompt.

## Thursday, November 12th, 2026

Alterações que quebram compatibilidade (Breaking changes):

- **Image generation — DreamShaper 8 LCM removido.** `@lykon/dreamshaper-8-lcm` não está mais disponível, e solicitações que o nomeiam são rejeitadas. Escolha outro modelo de texto para imagem, como `@black-forest-labs/flux-schnell`. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

Alterações:

- **Chat clients — Contexto descartável no Send Prompt.** Send Prompt aceita um novo campo `context` com partes de conteúdo de texto ou compatíveis com OpenAI, incluindo imagens, áudio, vídeo e arquivos. O contexto se aplica apenas a essa solicitação e não é salvo no histórico da sessão. Veja [Add disposable context to the last user message](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).
- **Image generation — GPT Image 2.6 Flare e Sunburst.** Adiciona `@openai/gpt-image-2.6-flare`, para geração rápida, e `@openai/gpt-image-2.6-sunburst`, para composições detalhadas. Ambos suportam edição com imagem de referência e são precificados em $0,025 por imagem de saída mais $0,025 por imagem de referência por saída.
- **Image generation — Modelos mais antigos descontinuados.** `@openai/gpt-image-2.5-flare`, `@openai/gpt-image-2.5-sunburst` e `@openai/gpt-image-1-mini` agora estão marcados como descontinuados. Eles continuam funcionando por enquanto; migre para `@openai/gpt-image-2.6-flare`, `@openai/gpt-image-2.6-sunburst` ou `@openai/gpt-image-2`.
- **Image generation — Preços menores.** `@bytedance/seedream-5-pro` agora custa $0,035 por imagem de saída, abaixo de $0,09, e `@recraft/recraft-v4.1-flash` custa $0,007, abaixo de $0,008.

## Wednesday, November 11th, 2026

Correções (Fixes):

- **Account — Recargas de crédito adicionam o valor escolhido ao saldo.** Uma recarga agora adiciona exatamente o valor que você escolhe ao seu saldo; as taxas são cobradas separadamente. Veja [Credit top-ups](https://docs.aivax.net/pt-br/docs/pricing.md#credit-top-ups).

Alterações:

- **Dashboard — Página inicial redesenhada.** A página inicial do dashboard agora mostra seu saldo de crédito, tendências de uso das últimas 24 horas a 90 dias e atalhos para os principais produtos.
- **AI Gateways — Novos eventos de worker `tool.fetched` e `message.completed`.** Os workers do gateway agora recebem `tool.fetched` após uma ferramenta do lado do servidor retornar seu resultado, e podem manter, bloquear ou substituir esse resultado com uma ação `tool.fetched.response`. Os workers também recebem `message.completed` após cada inferência terminar, com as mensagens, erros e uso. Veja [Gateway Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md).
- **Account — Sem taxa de serviço em recargas de crédito para Pro, Max e Ultimate.** Adicionar créditos no Pro, Max e Ultimate não inclui mais a taxa de serviço. Veja [Credit top-ups](https://docs.aivax.net/pt-br/docs/pricing.md#credit-top-ups).
- **Account — Teto diário na comissão de inferência.** A comissão de inferência do plano na inferência de modelos integrados agora é limitada a $1,50 por dia no Free, $1,20 no Pro e $1,00 no Max. Após o teto ser atingido, a inferência do modelo naquele dia é cobrada apenas nas taxas do modelo. Veja [Plan multipliers](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers).
