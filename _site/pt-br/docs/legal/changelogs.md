Source: https://docs.aivax.net/pt-br/docs/legal/changelogs.html

# Changelogs

Alterações nos produtos, serviços e API pública da AIVAX.

Esta página lista as alterações dos últimos 14 dias. As entradas mais antigas são mantidas no [arquivo de changelogs](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md).

## Segunda-feira, 23 de novembro de 2026

Alterações:

- **Inferência — Endpoints de Respostas e Mensagens Anthropic.** Adiciona `POST /v1/responses` (também `/api/v1/responses`), seguindo a especificação Open Responses e compatível com clientes da API de Respostas da OpenAI, e `POST /v1/messages` (também `/api/v1/messages`), compatível com a API de Mensagens da Anthropic, seus SDKs e Claude Code. Ambos aceitam um nome de modelo integrado ou um Gateway de IA como `model`, suportam streaming, ferramentas de função, imagens, arquivos e raciocínio, e são cobrados como conclusões de chat. O endpoint de Respostas é stateless, então envie a conversa completa em `input`. O cabeçalho `x-api-key` também é aceito para autenticação.
- **Observabilidade — Pesquisa melhorada em conversas.** A pesquisa por texto livre agora pode ser combinada com filtros em `GET /api/v1/conversations`, que também aceita filtros `--id`, `--token` e `--rid` e retorna `conversationToken` e `requestId`. O comando CLI `conversations list` adiciona `--search`, `--id`, `--token` e `--request-id`.

## Sexta-feira, 20 de novembro de 2026

Alterações:

- **Conta — Renovação da cota de modelos de assinatura mensal.** A cota de modelos de assinatura mensal agora se renova um mês após o seu primeiro uso em cada ciclo, em vez de no dia 1º de cada mês. `resetAt` na resposta do saldo da conta mostra a próxima renovação.
- **Modelos — Novos modelos de assinatura.** Adiciona `@aivax-subscription/qwen3.8-max`, `@aivax-subscription/step-5-preview` e `@aivax-subscription/grok-4.7` ao catálogo de modelos de assinatura. Veja [Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md).
- **Gateways de IA — Alternância de acesso à internet para a ferramenta Bash virtual.** As configurações do gateway de IA agora incluem uma opção **Permitir acesso à internet** para a ferramenta Bash virtual, ativada por padrão. Desative-a para executar comandos totalmente offline.

## Quinta-feira, 19 de novembro de 2026

Alterações:

- **RAG — Limites de documentos por conta e por coleção.** Cada plano agora limita o número de documentos armazenados por conta e por coleção: Grátis 2.000 por conta e 1.000 por coleção, Pro 200.000 e 50.000, Max 250.000 por conta sem limite de coleção, e Ultimate 500.000 por conta sem limite de coleção. Quando um limite é atingido, a criação de um documento retorna `400 Bad Request`; exclua documentos ou atualize o plano para continuar. Veja [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md#rag-and-collections).

## Quarta-feira, 18 de novembro de 2026

Alterações disruptivas:

- **Modelos — Campos de modelos de assinatura.** `GET /api/v1/information/models.json` não retorna mais `pricing[].subscriptionMultiplier` e agora retorna `flags.isSubscription`. Em `GET /v1/models`, `_details.provider_model.subscription_multiplier` é substituído pelo booleano `_details.provider_model.subscription`. Modelos de assinatura retornam arrays de preços vazios. Atualize os clientes que leem os campos removidos para usar os novos; veja [Nomes de modelos e gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/models-and-gateway-names.md).
- **Transcrições de áudio — Grok STT 1.0 removido.** `@x-ai/grok-stt-1.0` (também aceito como `x-ai/grok-stt-1.0`) chegou ao fim da vida útil e não está mais disponível; solicitações que o nomeiam falham agora. `@x-ai/grok-stt-2.0` o substitui como o modelo padrão de fala para texto ao mesmo preço de $0,10 por hora. Atualize as solicitações que nomeiam o modelo antigo para usar `@x-ai/grok-stt-2.0`, ou omita o modelo para usar o padrão; veja [Transcrições de áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md).

Correções:

- **Fala — Rótulos de preço no painel.** O painel agora mostra o preço correto para `@elevenlabs/eleven-v3`, `@elevenlabs/eleven-multilingual-v2` e GPT-4o mini TTS.
- **Modelos — Busca de modelos por ID com prefixo de fornecedor.** O filtro `name` em `GET /api/v1/information/models.json` e o parâmetro `filter` em `GET /v1/models` agora reconhecem nomes como `minimax-m3.1-flash` para `@minimax/m3.1-flash`.

Alterações:

- **Conta — Cota de modelos de assinatura mensal.** Pro, Max e Ultimate agora incluem uma cota mensal para modelos de assinatura, cujos nomes começam com `@aivax-subscription/`. Usar esses modelos nunca debita o saldo da conta. Quando a cota se esgota, ou o plano não tem nenhuma, solicitações a modelos de assinatura retornam `429 Too Many Requests`. Modelos de assinatura não estão disponíveis quando **Apenas provedores de retenção zero de dados** está habilitado. Veja [Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md).
- **Resumo e Extração — URLs de PDF.** Uma parte `file` agora pode apontar para um URL HTTP(S) público de um PDF.
- **Transcrições de áudio — Novos modelos e menor preço do Parakeet.** Adicionado `@nvidia/nemotron-3.5-transcribe` ($0,001 por minuto, gravações de até uma hora, 40 idiomas) e `@qwen/qwen3-asr-1.7b` ($0,027 por hora). `@nvidia/parakeet-tdt-0.6b-v3` agora custa $0,001 por minuto, abaixo de $0,0015.
- **Fala — Speechify Simba 3.5 e preços atualizados.** Adicionado `@speechify/simba-3.5`, um modelo de texto para fala que cobre 48 idiomas, a $0,0075 por 1.000 caracteres. `@fish-audio/drama-3` agora custa $0,01 por 1.000 caracteres, acima de $0,002, e `@elevenlabs/eleven-flash-v2.5` custa $0,02, acima de $0,01.

## Terça-feira, 17 de novembro de 2026

Correções:

- **Clientes de chat — Metadados de sessão em integrações de mensagens.** Respostas e mensagens agendadas do WhatsApp, Telegram e outras integrações de mensagens agora carregam os metadados da sessão para servidores MCP, funções de protocolo, workers de gateway e conversas salvas, assim como as sessões de chat web já faziam.
- **Gateways — Chaves de metadados reservadas do MCP.** Chaves de metadados personalizadas começando com `_aiv` não fazem mais chamadas de ferramentas MCP falharem.
- **Ferramentas — Explicações de ferramentas com servidores MCP estritos.** Com explicações de ferramentas habilitadas, servidores MCP e funções de protocolo que rejeitam argumentos desconhecidos agora funcionam conforme o esperado. Veja [Explicações de ferramentas](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md).
- **Modelos — Busca de modelos com sufixos.** O filtro `name` de `GET /api/v1/information/models.json` agora ignora uma tag de provedor `#` ou um sufixo de variante `:` e retorna o modelo base correspondente.

Alterações:

- **Modelos — GPT-6.2 Astra e GPT-6.2 Sol.** Adiciona `@openai/gpt-6.2-astra`, `@openai/gpt-6.2-astra:pro`, `@openai/gpt-6.2-sol` e `@openai/gpt-6.2-sol:pro`, com raciocínio, entrada de imagem e arquivo, chamada de ferramentas e saída estruturada. `@model-router/openai:frontier` agora roteia para `@openai/gpt-6.2-astra` em vez de `@openai/gpt-6-astra`; selecione `@openai/gpt-6-astra` diretamente para manter o modelo anterior.
- **Decisões — Liquid d1.2 e d1.2-ultra.** Adiciona `@liquid/d1.2` e `@liquid/d1.2-ultra`, com contexto de 64K, entrada de imagem e perguntas de sim/não, múltipla escolha e pontuação. `@liquid/d:latest` agora resolve para `@liquid/d1.2` em vez de `@liquid/d1.1`. Verifique os preços na [lista de modelos de decisão](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#discover-models-programmatically).
- **Gateways — Metadados em toda solicitação MCP.** A AIVAX agora envia o contexto de chamada e metadados personalizados em `params._meta` de toda solicitação a um servidor MCP, incluindo `initialize`, `tools/list`, `skills/list` e `resources/read`, não apenas `tools/call`. Veja [Metadados enviados com solicitações MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md#metadata-sent-with-mcp-requests).
- **Clientes de chat — Raciocínio e atividade de ferramentas no chat hospedado.** O chat web hospedado agora mostra raciocínio e chamadas de ferramentas em blocos expansíveis, ocultos quando a **Visibilidade de chamadas de ferramentas** (`showToolCalls`) está desligada. Veja [Publicar o chat hospedado](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat) e [Explicações de ferramentas](https://docs.aivax.net/pt-br/docs/inference/response-rendering/tool-explanations.md).

## Segunda-feira, 16 de novembro de 2026

Correções:

- **Conta — Recargas pagas com método de pagamento salvo.** Adicionar créditos não abre mais uma aba de navegador vazia quando um método de pagamento salvo liquida o pagamento imediatamente. O painel confirma o pagamento.

Alterações:

- **Conta — Impostos brasileiros sobre pagamentos.** Novos pagamentos, incluindo recargas de crédito e assinaturas, agora incluem impostos brasileiros adicionados sobre o valor devido. O painel mostra o total antes da confirmação, e os recibos listam cada imposto. Veja [Impostos sobre pagamentos](https://docs.aivax.net/pt-br/docs/pricing.md#taxes-on-payments).
- **Conta — Notas fiscais de serviço.** Notas fiscais de serviço podem ser baixadas na aba Faturas do Analytics, e você é notificado quando uma é emitida. Os dados de uso retornam o link em `serviceInvoiceLocation`.
- **Decisões — Entrada de conversa e mídia.** Solicitações de decisão agora aceitam `input`, um array de mensagens de conversa, em vez de `state`. Partes de imagem, áudio, vídeo e documento são avaliadas em modelos que as suportam. Veja [Enviar mídia](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#send-media).
- **Roteamento — Etapas auxiliares em provedores de retenção zero de dados.** Moderação de conteúdo, roteador de complexidade, reescrita de consulta RAG, resumos de áudio do cliente de chat, instruções de voz de fala e Injetor de Mídia agora sempre são executados em provedores de retenção zero de dados. Veja [Apenas provedores de retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md).
- **Analytics — Totais de pagamento no relatório mensal.** O relatório mensal agora soma os pagamentos confirmados no mês, com seus impostos e taxas, retornados em `payments` pelo Get Monthly Usage Report.
- **RAG — Reranker Reflex v1.5.** O endpoint de rerank aceita `@aivax/reflex-v1.5`, uma opção de maior precisão para `@aivax/reflex-v1`. Ele classifica até 15.000 documentos por solicitação, retorna até 50 resultados e custa $0,015 por 1M de tokens de entrada. Veja [Reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md).

## Sexta-feira, 13 de novembro de 2026

Alterações disruptivas:

- **Clientes de chat — `allowedFrameOrigins` removido.** A opção obsoleta `allowedFrameOrigins` do cliente de chat não é mais retornada quando você lê um cliente de chat. Solicitações que ainda a enviam continuam funcionando, e o valor é ignorado. Veja [Publicar o chat hospedado](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat).

Correções:

- **Batch — Trabalhos retomam após o limite diário de itens.** Trabalhos pausados pelo limite diário de itens do plano agora retomam automaticamente após a reinicialização do limite. Veja [Limites de Batch e Testes Agênticos](https://docs.aivax.net/pt-br/docs/limits.md#batch-and-agentic-tests).
- **Clientes de chat — Contagem de tokens de sessão após Send Prompt.** Sessões que recebem mensagens através do Send Prompt agora relatam sua contagem de tokens na listagem de sessões.

Alterações:

- **Clientes de chat — Inserir mensagens em uma sessão.** O novo endpoint `POST /api/v1/web-chat-client/<chat-client-id>/sessions/insert-message` anexa mensagens de usuário, assistente ou ferramenta a uma sessão ativa, identificada por `sessionId` ou `tag`, sem executar inferência. As mensagens inseridas são usadas como contexto pela próxima prompt.

## Quinta-feira, 12 de novembro de 2026

Alterações disruptivas:

- **Geração de imagens — DreamShaper 8 LCM removido.** `@lykon/dreamshaper-8-lcm` não está mais disponível, e solicitações que o nomeiam são rejeitadas. Escolha outro modelo de texto para imagem, como `@black-forest-labs/flux-schnell`. Veja [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md).

Alterações:

- **Clientes de chat — Contexto descartável no Send Prompt.** Send Prompt aceita um novo campo `context` com partes de conteúdo de texto ou compatíveis com OpenAI, incluindo imagens, áudio, vídeo e arquivos. O contexto se aplica apenas a essa solicitação e não é salvo no histórico da sessão. Veja [Adicionar contexto descartável à última mensagem do usuário](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).
- **Geração de imagens — GPT Image 2.6 Flare e Sunburst.** Adiciona `@openai/gpt-image-2.6-flare`, para geração rápida, e `@openai/gpt-image-2.6-sunburst`, para composições detalhadas. Ambos suportam edição de imagem de referência e são precificados em $0,025 por imagem de saída mais $0,025 por imagem de referência por saída.
- **Geração de imagens — Modelos mais antigos depreciados.** `@openai/gpt-image-2.5-flare`, `@openai/gpt-image-2.5-sunburst` e `@openai/gpt-image-1-mini` agora são marcados como depreciados. Eles continuam funcionando por enquanto; migre para `@openai/gpt-image-2.6-flare`, `@openai/gpt-image-2.6-sunburst` ou `@openai/gpt-image-2`.
- **Geração de imagens — Preços menores.** `@bytedance/seedream-5-pro` agora custa $0,035 por imagem de saída, abaixo de $0,09, e `@recraft/recraft-v4.1-flash` custa $0,007, abaixo de $0,008.

## Quarta-feira, 11 de novembro de 2026

Correções:

- **Conta — Recargas de crédito adicionam o valor escolhido ao saldo.** Uma recarga agora adiciona exatamente o valor que você escolhe ao seu saldo; as taxas são cobradas separadamente. Veja [Recargas de crédito](https://docs.aivax.net/pt-br/docs/pricing.md#credit-top-ups).

Alterações:

- **Painel — Página inicial redesenhada.** A página inicial do painel agora mostra seu saldo de crédito, tendências de uso dos últimos 24 horas a 90 dias e atalhos para os principais produtos.
- **Gateways de IA — Novos eventos de worker `tool.fetched` e `message.completed`.** Workers de gateway agora recebem `tool.fetched` após uma ferramenta do lado do servidor retornar seu resultado, e podem manter, bloquear ou substituir esse resultado com uma ação `tool.fetched.response`. Workers também recebem `message.completed` após cada inferência terminar, com as mensagens, erros e uso. Veja [Workers de Gateway](https://docs.aivax.net/pt-br/docs/inference/workers.md).
- **Conta — Sem taxa de serviço em recargas de crédito para Pro, Max e Ultimate.** Adicionar créditos no Pro, Max e Ultimate não inclui mais a taxa de serviço. Veja [Recargas de crédito](https://docs.aivax.net/pt-br/docs/pricing.md#credit-top-ups).
- **Conta — Teto diário na comissão de inferência.** A comissão de inferência do plano na inferência de modelos integrados agora é limitada a $1,50 por dia no Grátis, $1,20 no Pro e $1,00 no Max. Após o teto ser atingido, a inferência de modelos naquele dia é cobrada apenas nas taxas do modelo. Veja [Multiplicadores de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers).

## Terça-feira, 10 de novembro de 2026

Alterações disruptivas:

- **Clientes de chat — Novas URLs de webhook para integrações de mensagens.** Integrações do Telegram, Z-API, Evolution API e Kapso agora têm uma URL de webhook que contém uma chave gerada para cada integração. Copie a nova URL das configurações de integração no painel e atualize-a no provedor, ou use **Atualizar hooks** para o Telegram. URLs atuais continuam funcionando até 1º de dezembro de 2026 e são rejeitados após essa data. Você pode rotacionar a chave a qualquer momento com **Rotacionar chave de webhook** ou `POST /api/v1/web-chat-client/<id>/integrations/<name>/hook-key`; a URL anterior deixa de funcionar imediatamente. Webhooks do Telegram registrados com a nova URL também exigem o token secreto que **Atualizar hooks** configura. Veja [Clientes de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/integrations.md#webhook-urls).
- **Clientes de chat — Alterar contexto volta para as instruções do sistema.** A alteração de 9 de novembro foi revertida: o conteúdo carregado a partir do `contextLocation` de uma sessão e as `instructions` de `POST /api/v1/public/chat-clients/<access-key>/prompt` são novamente anexadas às instruções do sistema, após o `extraContext` da sessão, em vez de serem enviadas como uma mensagem do usuário após a última mensagem do usuário. `instructions` novamente aceita apenas uma string ou um array de strings, unidas com linhas em branco; partes de conteúdo como imagens e arquivos não são mais aceitas. Veja [Escolher onde colocar o contexto](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).
- **Clientes de chat — Assinaturas de webhook do Kapso são verificadas.** Quando a **Chave secreta de webhook** está definida em uma integração Kapso, solicitações cujo `X-Webhook-Signature` não corresponde são rejeitadas. Deixe-o vazio se você não configurou um segredo no Kapso.

Correções:

- **Modelos de linguagem — Presets de roteamento inválidos são rejeitados.** Valores numéricos em `routing_preset` ou `routing_options.preset` que não correspondem a uma opção de roteamento agora retornam um erro de validação.
- **Modelos de linguagem — Roteamento consciente do contexto.** O roteamento agora seleciona apenas provedores cuja janela de contexto se adapta à entrada da solicitação.

Alterações:

- **Processamento de dados — Patches no refinamento de instruções.** Cada item de `suggestedFixes` retornado por `POST /api/v1/generations/instruction-refinement` agora tem um array `patches` com o conserto como diffs unificados contra os itens de contexto enviados na solicitação, para que você possa visualizar e aplicar um conserto diretamente. Veja [Refinamento de Instrução](https://docs.aivax.net/pt-br/docs/data-processing/instruction-refinement.md).
- **Clientes de chat — Chaves de acesso de sessão mais longas.** Novas sessões de cliente de chat recebem chaves de acesso mais longas. Chaves existentes continuam funcionando.
- **Conversas — Recusas de moderação são identificadas na lista de conversas.** Conversas recusadas pela moderação do gateway de IA agora mostram um rótulo **Moderado** com as categorias violadas na lista de conversas do painel, em vez de **Erro**. `GET /api/v1/conversations` as retorna no novo campo `moderationCategories`.

## Segunda-feira, 9 de novembro de 2026

Alterações disruptivas:

- **Clientes de chat — Alterar contexto não vai mais para as instruções do sistema.** O conteúdo carregado a partir do `contextLocation` de uma sessão e as `instructions` de `POST /api/v1/public/chat-clients/<access-key>/prompt` agora são enviados como uma mensagem do usuário logo após a última mensagem do usuário, em vez de serem anexados às instruções do sistema. Nenhum deles é salvo no histórico da sessão ou retornado em `createdMessages`, e alterá-los em cada solicitação não invalida mais o cache de prompt da conversa. Modelos geralmente dão menos peso às mensagens do usuário do que às instruções do sistema: se você usou `instructions` ou `contextLocation` para regras que o assistente deve seguir sempre, mova essas regras para o `extraContext` da sessão ou para as instruções do gateway de IA. `extraContext` permanece inalterado e fica nas instruções do sistema. `instructions` agora também aceita uma parte de conteúdo compatível com OpenAI ou um array delas, incluindo imagens e arquivos; strings e arrays de strings continuam funcionando, mas os itens do array são agora enviados como partes de texto separadas em vez de serem unidos com linhas em branco. Veja [Escolher onde colocar o contexto](https://docs.aivax.net/pt-br/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).

Correções:

- **Modelos de linguagem — Falha automática do provedor.** Quando um provedor falha antes de responder, a solicitação continua em outro provedor elegível. Para permitir fallback quando `allowed_providers` lista um único provedor, adicione `"*"` como o último item. Veja [Configuração de roteamento](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md).

Alterações:

- **Clientes de chat — Streaming e opções de inferência no Send Prompt.** `POST /api/v1/public/chat-clients/<access-key>/prompt` aceita `stream: true` para retornar eventos enviados pelo servidor com texto, raciocínio e atualizações de ferramentas, seguidos por um evento `result` com o corpo de resposta usual. O novo objeto `inferenceOptions` substitui `reasoningEffort`, `renderingMode` (`default` ou `textual_blocks`) e `toolInvocationExplanations` para uma solicitação, e o novo campo `tools` adiciona ferramentas do lado do cliente compatíveis com OpenAI que estão disponíveis apenas para essa solicitação. Veja [Enviando prompts do seu aplicativo](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#sending-prompts-from-your-application).
- **Processamento de dados — Refinamento de instrução.** O novo endpoint `POST /api/v1/generations/instruction-refinement` revisa instruções do sistema, prompts, habilidades, descrições de ferramentas e conhecimento contra diretrizes de engenharia de prompt da documentação dos fornecedores de modelos. A visualização `micro` revisa a redação de cada item, e a visualização `macro` revisa como os itens funcionam juntos como um agente. Retorna uma pontuação geral, achados priorizados e sugestões de correção. Veja [Refinamento de Instrução](https://docs.aivax.net/pt-br/docs/data-processing/instruction-refinement.md).
