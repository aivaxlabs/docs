Source: https://docs.aivax.net/pt-br/docs/legal/changelogs.html

# Registro de alterações

Alterações técnicas que afetam produtos, serviços ou a API pública da AIVAX. As datas indicam quando as entradas foram adicionadas ou atualizadas, não datas confirmadas de implantação em produção. Cada item identifica o produto ou serviço afetado; manutenção sem efeito visível ao usuário é omitida.

## Segunda‐feira, 26 de outubro de 2026

Alterações:

- **Modelos de linguagem — Mais modelos listam seus esforços de raciocínio.** `modelInformation.reasoningEfforts` em `GET /api/v1/information/models.json` e na caixa de diálogo de detalhes do modelo na página de Modelos do painel, agora listam os níveis aceitos para `@qwen/qwen3.8-max`, `@qwen/qwen3.8-flash`, `@qwen/qwen3.8-omni-flash`, `@anthropic/claude-4.5-opus`, `@openai/o3`, `@openai/o3-mini`, `@openai/o4-mini`, `@google/gemini-2.5-pro`, `@google/gemini-2.5-flash`, `@google/gemini-2.5-flash-lite`, `@bytedance/seed-2.1-turbo` e `@nvidia/nemotron-3.5-super-vl`. As solicitações e os gateways permanecem inalterados.

- **Processamento de dados — Novo ponto de extremidade de Extração.** `POST /api/v1/generations/extract` lê textos, documentos JPEG, PNG, TIFF e PDF e devolve um objeto JSON por documento, formatado de acordo com o `responseSchema` exigido, na ordem de entrada. Cada propriedade do esquema corresponde a um campo a ser localizado, e sua descrição é o critério de busca; `$ref` e `$defs` não são suportados. Imagens e arquivos aceitam URLs de dados base64 ou URLs públicas de até 5 MB, e outros tipos de conteúdo são rejeitados. Apenas tokens de entrada são cobrados, a $0,04 por milhão. Também é possível executá‐lo a partir da aba **Extraction** na página **Generations** do painel. Consulte [Extraction](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md).

- **Processamento de dados — Novo ponto de extremidade de Resumo.** `POST /api/v1/generations/summarize` aceita os mesmos tipos de documento e devolve uma string de resumo por documento, opcionalmente guiada por `instructions`. Apenas tokens de entrada são cobrados, a $0,04 por milhão. Extração e Resumo compartilham um limite por documento de 10 por minuto e 300 por dia no plano Free, 200 por minuto no Pro e 2 500 por minuto no Max. Também pode ser executado a partir da aba **Summarization** na página **Generations** do painel. Consulte [Summarization](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md).

- **Processamento de dados — Novo ponto de extremidade de Traduções.** `POST /api/v1/generations/translate` traduz texto, o texto visível em imagens e a fala em áudio para qualquer `toLanguage`, devolvendo uma string traduzida por documento, na ordem de entrada. `fromLanguage` é opcional e, quando omitido, é detectado a partir do conteúdo. O uso é cobrado em unidades de processamento. Limites: 30 solicitações por minuto e 300 por dia no Free, 200 por minuto no Pro e 2 500 por minuto no Max. Também pode ser executado a partir da aba **Translation** na página **Generations** do painel. Consulte [Translations](https://docs.aivax.net/pt-br/docs/data-processing/translations.md).

- **Processamento de dados — Orientação mais clara entre Extração, Busca e Descrições de Mídia.** As páginas **Media Descriptions**, **Fetch** e **OCR** agora explicam quando usar cada serviço. Consulte [Extraction, Fetch, or Media Descriptions](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md#extraction-fetch-or-media-descriptions).

- **Conta — Autenticação de dois fatores no console e recuperação de login.** A página **My account** do console possui uma aba **Security**. Os titulares de conta podem adicionar um ou mais aplicativos autenticadores; o código QR e o segredo são mostrados apenas até que o código de seis dígitos seja confirmado, e o login solicita um código apenas depois que pelo menos um autenticador tenha sido confirmado. Alternar para uma conta salva solicita o mesmo código quando essa conta tem autenticação de dois fatores. `POST /api/v1/auth/login` aceita `totpCode` e devolve `requiresTwoFactor` em vez de uma sessão quando o código ainda é necessário. Contas sem autenticador permanecem inalteradas, e chaves de API não são afetadas. A página de login tem link para suporte da conta, onde **Recover login key** envia um link de login de uso único com validade de uma hora e um link de redefinição de chave de login após solicitar o e‐mail de registro. A confirmação é a mesma, independentemente de o e‐mail pertencer a uma conta. O link de redefinição e **Reset login key** em **Security** criam uma nova chave de login, enviam‐na por e‐mail e desconectam a conta de todas as sessões do console. Eles não revogam chaves de API nem desativam a autenticação de dois fatores. Desativar a autenticação de dois fatores sem um código atual do autenticador é tratado pelo [AIVAX support](https://aivax.net/contact/). Consulte [Console sign-in](https://docs.aivax.net/pt-br/docs/authentication.md#console-sign-in).

- **MCP — Escolher quais ferramentas de Collections MCP são expostas.** O Collections MCP aceita o cabeçalho opcional `X-Mcp-Enabled-Tools` com uma lista separada por vírgulas de `search`, `write` e `delete`, de modo que um cliente possa, por exemplo, adicionar e buscar documentos sem poder excluí‐los. `write` e `delete` ainda requerem `X-Mcp-Allow-Write: yes`. Sem o cabeçalho, as ferramentas expostas permanecem inalteradas. Consulte [Collections and RAG MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md#select-which-tools-are-exposed).

## Domingo, 25 de outubro de 2026

Alterações que quebram compatibilidade:

- **Modelos de linguagem — O alias do roteador MiniMax agora seleciona M3.1 Flash.** `@model-router/minimax:latest` agora seleciona `@minimax/m3.1-flash` em vez de `@minimax/m3`. O novo modelo aceita texto, imagens e vídeo, melhora resultados de agentes, codificação e cibersegurança em relação ao M3, e seu preço atual na lista OpenRouter é $0,15 por milhão de tokens de entrada e $0,60 por milhão de tokens de saída, menor que o M3. Use `@minimax/m3` diretamente para continuar usando o modelo anterior.

Alterações:

- **RAG — Novos pontos de extremidade de busca.** Adicionados `POST /api/v2/query` (consultar coleções), `POST /api/v2/query/similar` (encontrar documentos semelhantes) e `POST /api/v2/query/browse` (navegar documentos). As consultas agora retornam resultados paginados com um pool de candidatos reutilizável, similaridade, reclassificação e pontuações finais separadas, ordenação por pontuação, data de criação, atualização ou indexação, ou nome, e filtros por coleção. Páginas subsequentes de uma consulta não são cobradas novamente. A busca de documentos semelhantes usa o vetor armazenado de um documento indexado, e a navegação lista documentos indexados na ordem de inserção, opcionalmente filtrados; nenhum tem custo de incorporação ou reclassificação. Uma reclassificação combinada com ordenação diferente de pontuação é rejeitada. Todos os três pontos de extremidade também estão disponíveis no host direto. Consulte [Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).

- **RAG — Ponto de extremidade de busca anterior depreciado.** `POST /api/v1/query` continua funcionando para integrações existentes, mas está depreciado. Para migrar, envie `terms` para `POST /api/v2/query`, substitua `top` por `limit` e `includeReferences` por `"include": ["content", "metadata", "references"]`, e leia os resultados de `data.results[].document` e `data.results[].scores`. Solicitações sem termos de busca são redirecionadas para `POST /api/v2/query/browse`, que retorna os documentos mais antigos primeiro, a menos que `sort` esteja definido.

## Sexta‐feira, 23 de outubro de 2026

Alterações que quebram compatibilidade:

- **Modelos de linguagem — Aliases de roteador agora selecionam modelos mais recentes.** `@model-router/kimi:latest` agora seleciona `@moonshotai/kimi-k3.1-pro` em vez de `@moonshotai/kimi-k3`. O novo modelo aceita texto, imagens e vídeo. Seu preço atual na lista OpenRouter é $2 por milhão de tokens de entrada e $10 por milhão de tokens de saída, superior ao Kimi K3. `@model-router/mercury:latest` agora seleciona `@inception/mercury-3` em vez de `@inception/mercury-2.5`. `@model-router/pareto:latest` agora seleciona `@unbiased/pareto-26.10` em vez de `@unbiased/pareto-26.9`. Pareto 26.10 não aceita saída estruturada; continue chamando `@unbiased/pareto-26.9` quando uma solicitação precisar de `response_format`. Os modelos anteriores permanecem disponíveis sob seus próprios identificadores.

- **Geração de imagens — Amazon Nova Canvas removido.** `nova-canvas` não está mais no catálogo de imagens. Uma requisição de API de imagem que o menciona é rejeitada, e salvar um gateway que ainda armazena esse nome falha na validação. Se um gateway já o armazena, a ferramenta de imagem do chat recorre ao modelo de imagem padrão, FLUX Schnell (`flux`). Escolha outro modelo de imagem listado se esse fallback não for adequado.

Correções:

- **Modelos de linguagem — Endpoints Xiaomi aposentados não são mais selecionados.** Os modelos depreciados `@xiaomi/mimo-v2.5` e `@xiaomi/mimo-v2.5-pro` não roteam mais para a API direta da Xiaomi, que foi encerrada em 21 de outubro de 2026. As solicitações usam os provedores restantes. Ambos os modelos permanecem depreciados.

Alterações:

- **Modelos de linguagem — Novos modelos e entrada de vídeo.** Adicionados `@moonshotai/kimi-k3.1-pro`, `@minimax/m3.1-flash`, `@inception/mercury-3` e `@unbiased/pareto-26.10`. `@moonshotai/kimi-k3` agora aceita vídeo além de texto e imagens.

- **Modelos de linguagem — Preço de entrada em cache no Groq.** Tokens de entrada em cache para `@openai/gpt-oss-20b` no Groq são cobrados a $0,037 por milhão de tokens. Esse preço no Groq não havia sido definido antes, portanto esses tokens não eram cobrados como entrada em cache.

- **Geração de imagens — FLUX.3 Image Klein.** Adicionado `flux-3-image-klein`, incluindo imagens de referência, com preço estimado de $0,019 por imagem de saída para o tamanho padrão do provedor.

- **Decisões — Novos modelos de decisão de texto.** Adicionados `@perplexity/pplx-decider-v1.2` ($0,02 por milhão de tokens de entrada), `@perplexity/pplx-decider-flash-v1.2` ($0,01), `@nace-ai/drex-max` ($0,06), `@respan/span-02` ($0,01) e `@liquid/d1-ultra` ($0,042). Aliases existentes permanecem inalterados: `@perplexity/pplx-decider` ainda resolve para Decider V1.1.

## Segunda‐feira, 19 de outubro de 2026

Alterações que quebram compatibilidade:

- **Gateways — Um fuso horário por gateway.** Gateways de IA agora têm um parâmetro `timeZone` (identificador IANA, padrão `America/Sao_Paulo`) usado para toda data que o modelo lê ou grava: `get_date_time`, ferramentas de agendamento e o ambiente bash. Ele substitui `builtinFunctionsOptions.dateTimeTimeZone` (padrão anterior `America/Los_Angeles`) e `bashOptions.timeZone` (padrão anterior `UTC`), que não são mais lidos. Gateways e fluxos de trabalho Batch que dependiam dos padrões antigos agora reportam horário de São Paulo; defina `timeZone` no gateway para manter outro fuso. Em `/v1/chat/completions`, envie `time_zone` em vez de `builtin_tools.options.dateTimeTimeZone` para sobrescrever o fuso em uma única solicitação. No painel, a configuração mudou para **Date and time** na aba **Parameters + Tuning** do gateway e foi removida das opções da ferramenta Batch. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

Correções:

- **Clientes de chat — Mensagens agendadas não são mais executadas junto a uma resposta.** Nas integrações Telegram e WhatsApp, uma mensagem agendada que se torna pendente enquanto o assistente ainda está respondendo a mesma conversa agora aguarda a conclusão da resposta em vez de gerar uma segunda resposta em paralelo. Mensagens recebidas durante uma resposta também aguardam e são respondidas depois. Anteriormente, ambas as execuções podiam atuar na mesma conversa, e uma resposta poderia ser descartada do histórico. Uma mensagem agendada atrasada ainda é enviada se a conversa ficar livre dentro de 30 minutos do horário programado.

Alterações:

- **Clientes de chat — Agendamento usa o fuso horário do gateway.** `schedule_assistant_message` agora lê horários sem deslocamento UTC no fuso horário do gateway, `create_recurring_job` avalia expressões cron nesse fuso, e `list_scheduled_jobs` devolve horários agendados nele. Antes, eles usavam o fuso horário do servidor. Horários com deslocamento UTC explícito mantêm o instante exato. `get_date_time` agora está sempre disponível ao lado das ferramentas de agendamento. Defina o `timeZone` do gateway para o fuso horário dos seus usuários para que lembretes disparem no horário local esperado. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

## Domingo, 18 de outubro de 2026

Alterações:

- **RAG — Mais detalhes na lista de documentos da coleção.** A tabela de documentos de uma coleção agora mostra a data de criação, a data da última atualização e a contagem aproximada de tokens de cada documento, e rola horizontalmente quando as colunas não cabem. Linhas com mais de três tags mostram as três primeiras e um selo **+N more**; passe o mouse sobre ele para ver as tags restantes. `GET /api/v1/collections/{collection-id}/documents` também devolve `createdAt` e `approximateTokenCount` para cada documento. Consulte [Collections](https://docs.aivax.net/pt-br/docs/rag/documents.md).

- **RAG — Documentos formatados no playground de busca.** O playground de busca da coleção renderiza o conteúdo de documentos retornados e referenciados como Markdown, no mesmo layout usado por mensagens de conversa, e adiciona um botão **Read docs** ao lado de **View code** que abre a [documentação de busca semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).

- **Conta — Distintivo de plano personalizado.** Contas em um plano Custom agora mostram um distintivo de plano com o mesmo tamanho e estilo dos distintivos Free, Pro e Max.

## Sábado, 17 de outubro de 2026

Alterações:

- **Batch — Roteamento otimizado para custos em fluxos que não usam um gateway de IA.** Fluxos que processam itens com um modelo integrado ao invés de um gateway de IA sempre usam a preferência de roteamento `Cheapest`, selecionando o provedor disponível com o menor preço de tokens de entrada e saída para aquele modelo. O padrão `Balanced` não se aplica mais nesse caso, portanto itens podem ser roteados para um provedor diferente do anterior. Para manter a preferência padrão ou escolher `Fastest` ou `Quality`, use um gateway de IA com essa preferência de roteamento no fluxo. Consulte [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md#model-and-routing).

## Sexta‐feira, 16 de outubro de 2026

Correções:

- **Gateways — Chamadas bloqueadas de `read_skill` mantêm a habilidade ativa.** Quando um gateway oculta ferramentas sem uma habilidade, uma chamada `read_skill` bloqueada por um trabalhador do gateway ou rejeitada como inválida não remove mais as ferramentas da habilidade ativada pela chamada bem‐sucedida anterior. Apenas chamadas bem‐sucedidas de `read_skill` alteram as habilidades ativas. Consulte [Skills](https://docs.aivax.net/pt-br/docs/inference/skills.md#structure-and-operation).

- **Ferramentas embutidas — Data e hora atuais retornam JSON.** `get_date_time` agora devolve o objeto JSON documentado com os campos `date`, `time`, `day_of_week`, `time_zone`, `utc_offset` e `date_time`. Antes devolvia um resumo de texto com layout diferente. Instruções ou trabalhadores que analisam o texto anterior devem ler esses campos em vez disso. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

Alterações:

- **Conta — Assinaturas Self‐service Pro e Max.** A página **My account** agora mostra o estado da assinatura sob o plano atual e oferece **Subscribe to plan** em contas Free, **Cancel subscription** e **Change plan** em contas pagas, e **Resubscribe** enquanto um cancelamento está pendente. A seleção de plano mostra Pro e Max lado a lado com seu preço mensal, recursos principais e o valor devido hoje ou a data de início da downgrade. Planos são comprados para o mês calendário: uma primeira compra ou upgrade é cobrada agora pelos dias restantes do mês, menos a parte não utilizada do que já foi pago pelo mês corrente, e entra em vigor assim que o pagamento é confirmado; downgrade ou cancelamento entra em vigor na próxima renovação, no primeiro dia do mês. Renovações são cobradas automaticamente no primeiro dia de cada mês usando o método de pagamento salvo; enquanto uma renovação está pendente, um lembrete é enviado a cada dois dias até o décimo dia, após o qual a conta volta ao plano Free. Planos personalizados são gerenciados pela equipe AIVAX e não podem ser alterados pela página. As mesmas operações estão disponíveis via `GET /api/v1/subscriptions`, `POST /api/v1/subscriptions/plan`, `POST /api/v1/subscriptions/cancel` e `POST /api/v1/subscriptions/resubscribe`. Consulte [subscription pricing](https://aivax.net/pricing) e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md).

- **Conta — Métodos de pagamento salvos.** Contas pagas podem abrir **Payment methods** a partir da página **My account** para adicionar, remover ou definir o cartão padrão usado para renovações automáticas, ou listá‐los via `GET /api/v1/subscriptions/payment-methods`.

- **Conta — Créditos e assinaturas são pagos via Mixtic.** A caixa de diálogo **Add credits** não pede mais um método de pagamento: compras de crédito e cobranças de assinatura usam links de pagamento Mixtic ou o método de pagamento salvo, e as taxas mostradas antes do pagamento refletem esse provedor. `POST /api/v1/payments` e `GET /api/v1/payments` agora ignoram o campo `method` e o parâmetro de consulta; métodos desconhecidos não são mais rejeitados. Faturas não pagas criadas nas últimas 24 horas também são verificadas com a Mixtic a cada poucos minutos, de modo que uma fatura paga seja confirmada mesmo quando a notificação de pagamento não chega.

- **Analytics — Tipo de fatura, link de pagamento e recibo.** A aba **Invoices** agora indica se cada fatura é compra de crédito ou pagamento de assinatura, um link **Pay** enquanto a fatura está aberta e não expirou, e um link **Receipt** assim que for paga. `GET /api/v1/information/balance` devolve os mesmos dados nos campos `type`, `paymentLocation` e `receiptLocation` de cada fatura. Faturas de assinatura não pagas são removidas quando expiram e não podem mais ser pagas.

## Quinta‐feira, 15 de outubro de 2026

Alterações que quebram compatibilidade:

- **Modelos — Modelos aposentados removidos.** `@anthropic/claude-4-sonnet`, `@anthropic/claude-3-haiku`, `@kwaipilot/kat-coder-pro-v2.5`, `@kwaipilot/kat-coder-air-v2.5`, `@nex-agi/nex-n2-pro`, `@nex-agi/nex-n2-mini`, `@qwen/qwen3-max`, `@qwen/qwen3-coder-plus` e `@unbiased/pareto` não estão mais disponíveis porque foram aposentados ou não são mais servidos upstream. Troque por um modelo atual da mesma família, por exemplo `@unbiased/pareto-26.9` em vez de `@unbiased/pareto`.

- **Transcrição — Qwen3 ASR Flash removido.** `qwen/qwen3-asr-flash-2026-02-10` não está mais disponível porque não tem provedor ativo. Use `qwen/qwen3-asr-0.6b` ou outro modelo de transcrição.

- **Modelos — `@openai/gpt-5.4-pro` agora usa o modelo Pro.** O modelo antes rodava e era cobrado como GPT‐5.4. Agora roteia para GPT‐5.4 Pro e é cobrado a $30 de entrada e $180 de saída por 1 M de tokens. Revise orçamentos para gateways que o utilizam.

Alterações:

- **Modelos — Novos modelos de texto.** Adicionados `@meta/muse-spark-open`, `@nvidia/nemotron-3.5-super-vl`, `@openai/gpt-6.1-sol:pro`, `@qwen/qwen3.8-omni-flash`, `@inclusionai/ling-3.1-flash`, `@stepfun/step-5-preview` (preview), `@sakana/fugu-ultra-v2` e `@bytedance/seed-2.1-turbo`. Consulte a página de modelos do painel para capacidades e preços.

- **Modelos — Modelos depreciados.** Gemini 2.5 Pro, Flash e Flash‐Lite, Xiaomi MiMo V2.5 e V2.5 Pro, Qwen3.5 9B, Poolside Laguna XS 2.1 e S 2.1, GLM 4.7, Claude 4.5 Sonnet, Claude 4.1 Opus, GPT‐5, GPT‐5 mini, GPT‐5 nano, GPT‐5.1, GPT‐5.3 Codex, GPT‐5.4 nano, Gemini 3 Flash, Gemini 3.5 Flash e Gemini 3.7 Flash agora estão marcados como depreciados. Alguns estão programados para aposentadoria pelos provedores nas próximas semanas, portanto migre para um modelo mais recente.

- **Modelos — Atualizações de provedor e data de lançamento.** `@minimax/m2.7` e `@qwen/qwen3.8-max` agora roteam para suas versões atuais de provedor, `@openai/gpt-6-astra:pro` usa a versão Pro dedicada, e vários modelos receberam datas de lançamento corrigidas ou adicionadas. Groq não serve mais alguns modelos Llama, Qwen e Kimi; esses modelos permanecem disponíveis por outros provedores.

- **Geração de imagens — Novos modelos.** Adicionados `flux-3-image`, `nanobanana-2.1`, `seedream-5-flash` e `qwen-image-2.1-turbo`. `mai-image-2.5-flash` e `nova-canvas` são depreciados; `mai-image-2.5-flash` agora é um alias de `mai-image-2.6-flash` upstream, e `nova-canvas` não aparece mais listado pelo seu provedor.

- **Transcrição — Novos modelos.** Adicionados `nvidia/nemotron-3.5-asr-streaming-multilingual-0.6b` e `qwen/qwen3-asr-0.6b`. O nome de exibição de `x-ai/grok-stt-1.0` passa a ser "SpaceXAI: Grok STT 1.0"; seu identificador e status padrão permanecem inalterados.

- **Síntese de fala — ElevenLabs Flash v2.5 e Fish Audio Drama 3.** Adicionados ElevenLabs Flash v2.5 (`ElevenFlash`) e Fish Audio Drama 3 (`FishDrama3`) como fontes de síntese de fala. Drama 3 aceita direção de fala entre colchetes, como `[whispering]`, e usa a voz padrão do provedor quando nenhuma é solicitada.

- **Re‐ranking — Voyage Rerank 3.** Adicionados `@voyageai/rerank-3` ($0,05 por 1 M de tokens) e `@voyageai/rerank-3-lite` ($0,02 por 1 M de tokens), ambos com contexto de 32 K.

- **Decisões semânticas — Novos modelos e atualização de preços.** Adicionados `@nace-ai/drex-v2.0`, `@upstage/solar-decide-flash`, `@scaledown/classify-1` e `@inception/mercury-decide`. O preço de entrada de `@liquid/d1` cai de $0,04 para $0,02 por 1 M de tokens, enquanto `@upstage/solar-decide` sobe de $0,05 para $0,10 por 1 M de tokens. O contexto de `@cloudflare/clef-flash` passa a ser 24 K e o de `@typesafe/jev` passa a ser 262 144 tokens.

## Quarta‐feira, 14 de outubro de 2026

Correções:

- **Gateways — Ferramentas de habilidade visíveis quando ferramentas sem habilidade são ocultadas.** Quando um gateway oculta ferramentas sem uma habilidade, as ferramentas listadas em `allowedToolsNames` de uma habilidade agora ficam disponíveis após o modelo ativar essa habilidade com `read_skill`. Antes, apenas as ferramentas sempre visíveis e `read_skill` eram oferecidas. Apenas as habilidades da chamada `read_skill` bem‐sucedida mais recente contam como ativas, de modo que uma chamada bloqueada por um trabalhador do gateway ou rejeitada como inválida não expõe as ferramentas da habilidade. Consulte [Skills](https://docs.aivax.net/pt-br/docs/inference/skills.md#structure-and-operation).

## Terça‐feira, 13 de outubro de 2026

Alterações:

- **Modelos — Esforços de raciocínio suportados.** `GET /api/v1/information/models.json` agora devolve `modelInformation.reasoningEfforts` para cada modelo, listando os níveis de esforço de raciocínio que o modelo aceita, como `low`, `medium`, `high`, `xhigh` ou `max`. A lista está vazia quando os níveis suportados são desconhecidos. A caixa de diálogo de detalhes do modelo na página de Modelos do painel mostra esses níveis quando o modelo tem ao menos um.

## Sábado, 10 de outubro de 2026

Alterações:

- **RAG — Importação JSONL via WebSocket.** Um novo ponto de extremidade **Index Documents (JSONL WebSocket)** substitui o upload multipart JSONL para novas integrações. Clientes enviam linhas JSONL UTF‐8 via WebSocket e finalizam com uma linha `END`. A cada 100 linhas são verificadas contra saldo, armazenamento e acesso à coleção, salvas e enfileiradas para indexação, com mensagens de progresso relatando linhas comprometidas. Cada importação aceita 10× o limite de linhas JSONL por solicitação do plano; os outros limites de inserção permanecem inalterados. Cada mensagem deve chegar dentro de 30 segundos, e apenas uma importação por coleção roda por vez. O ponto de extremidade multipart **Index Documents (JSONL)** continua disponível, mas está depreciado. Consulte [Batch Import](https://docs.aivax.net/pt-br/docs/rag/documents.md#batch-import).

- **API — Cabeçalho de resposta `Consumed-Credits` documentado.** Respostas que cobram uso incluem `Consumed-Credits` com o custo total da solicitação em USD, incluindo o multiplicador do plano. É omitido quando nada foi cobrado e não cobre respostas em streaming ou uso registrado após a resposta. Consulte [Request cost header](https://docs.aivax.net/pt-br/docs/pricing.md#request-cost-header).

- **Conta — Apenas provedores de retenção zero de dados.** A página de configurações da conta tem uma nova opção **Zero data retention providers only**, desativada por padrão. Quando ativada, inferência de texto com modelos integrados é roteada apenas para provedores que não retêm prompts, e outros provedores são excluídos. Solicitações falham quando o modelo não tem provedor de retenção zero disponível. A opção não altera o registro de conversas. Consulte [Zero data retention providers only](https://docs.aivax.net/pt-br/docs/inference/inference.md#zero-data-retention-providers-only).

- **Decisões semânticas — Perplexity Decider V1.1, atualização de preço e limite.** `@perplexity/pplx-decider-v1.1-27b` substitui o Perplexity Decider V1, que não está mais disponível upstream; o nome anterior `@perplexity/pplx-decider-v1-27b` continua funcionando e agora resolve para V1.1. Seu preço de entrada cai de $0,04 para $0,02 por 1 M de tokens. O preço de entrada de `@cloudflare/clef-flash` cai de $0,09 para $0,038 por 1 M de tokens, e o limite de contexto de `@typesafe/jev-1.13` aumenta de 32 768 para 64 000 tokens. Consulte [Decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md).

- **Inferência — `allow_logging` por solicitação.** Compleções de chat aceitam `allow_logging`. Defina como `false` para manter aquela solicitação fora dos logs de conversas da conta; o padrão é `true` e não pode habilitar o registro quando está desativado para a conta. Consulte [Response and conversation records](https://docs.aivax.net/pt-br/docs/inference/inference.md#response-and-conversation-records).

## Sexta‐feira, 9 de outubro de 2026

Alterações que quebram compatibilidade:

- **Clientes de chat — Data local não é mais adicionada às conversas web.** Mensagens enviadas do chat web hospedado não adicionam mais uma mensagem de sistema com a data local do usuário e fuso horário no início da conversa, e o ponto de extremidade do cliente público de chat ignora os campos `userLocalTime` e `userTimeZone`. Isso mantém o início da conversa estável entre turnos, melhorando o cache de prompts. Gateways que precisam da data ou hora atuais devem habilitar a ferramenta embutida `DateTime`, que devolve a data e hora atuais no fuso configurado quando o modelo a chama. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

- **Gateways — Instruções de sistema seguem a ordem de declaração.** As partes das instruções de sistema de um gateway de IA agora são combinadas na ordem em que são declaradas: a instrução própria do gateway primeiro, seguida pelas instruções do servidor MCP, fontes remotas de instrução de sistema na ordem configurada e instruções adicionadas durante a solicitação. Antes, essas partes podiam aparecer em ordem inversa, e fontes remotas eram adicionadas na ordem em que concluíam o carregamento. Solicitações idênticas agora produzem as mesmas instruções de sistema, o que melhora o cache de prompts. Gateways cujas instruções dependem da ordem relativa anterior devem revisar suas instruções.

- **Ferramentas embutidas — Calendário removido.** O sinalizador `Calendar` e as ferramentas `appointment_create`, `appointment_search`, `appointment_find`, `appointment_update` e `appointment_delete` são removidos da API e do painel. Gateways e fluxos de trabalho Batch existentes têm o sinalizador removido automaticamente. Solicitações contendo `Calendar` em `builtin_tools.tools` agora falham; remova o sinalizador e atualize instruções que dependem de ferramentas de agendamento. Texto de lembrete migrado não substitui calendário ou serviço de agendamento.

- **Memória — Chamadas e gerenciamento de ferramentas alterados.** `Remember` agora expõe apenas `memory_save` e `memory_search`. Substitua chamadas `memory_update` e `memory_remove` por `memory_save` usando um ID e conteúdo, ou um ID sem conteúdo para excluir. `memory_clear` foi removido. A API de Memórias (`/api/v1/memories`, incluindo listagem, obtenção, exclusão e geração de prompt de migração) e a página de Memórias do painel foram removidas; gerencie registros via [Collections and Documents APIs](https://docs.aivax.net/pt-br/docs/rag/collections.md) e páginas do painel. Excluir `@memories` apaga todas as memórias dos usuários na conta.

- **Gateways — Recuperação e visibilidade de memória alteradas.** Memórias não são mais adicionadas automaticamente às instruções de sistema: atualize prompts para chamar `memory_search` explicitamente. A opção `include_all_memory_context` / `IncludeAllMemoryContext` foi removida e é ignorada se enviada. `allowSharedMemory` continua controlando se um gateway vê as memórias do usuário de outros gateways ou apenas as suas; memórias migradas não têm gateway e são visíveis apenas para gateways com memória compartilhada. A expiração agora é opcional: `memory_save` aceita `expiresInDays` (1–365), e memórias salvas sem isso nunca expiram, enquanto o padrão antigo era 30 dias. Revise suposições de acesso e necessidades de retenção. Consulte [Memory](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory).

Alterações:

- **Modelos — Três novos modelos de decisão semântica.** Adicionados `@microsoft/microsoft-decision-1` (Microsoft‐Decision‐1), `@nace-ai/drex-v1.5` (Nace.AI Drex v1.5) e `@cloudflare/clef-omni` (Cloudflare Clef Omni) ao catálogo de decisões semânticas. Todos suportam perguntas `noul`, `choice` e `score` e são cobrados por token de entrada a $0,042, $0,04 e $0,15 por milhão de tokens, respectivamente, sem cobrança de token de saída. Não são cobertos pela cota diária de decisão semântica. Consulte [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) e [Pricing](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#usage-and-cost).

- **Decisões semânticas — Entrada de imagem.** Modelos de decisão que aceitam imagens (`@cloudflare/clef`, `@cloudflare/clef-flash`, `@cloudflare/clef-omni` e `@openai/gpt-6-luna-decisions`) agora aceitam imagens em `state` como partes `image_url` com URLs de dados base64 `image/png`, `image/jpeg` ou `image/webp`, no mesmo formato do OpenRouter. Modelos Clef aceitam até 4 imagens e GPT‐6 Luna Decisions até 128; outros modelos rejeitam imagens com `400`. `GET /api/v1/information/decisions-models.json` agora devolve `maxImages` para cada modelo. Consulte [Send images](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#send-images).

- **Memória — Armazenamento e busca em coleção.** Memórias são armazenadas como documentos na coleção `@memories` da conta, criados na primeira gravação, com metadados de usuário e conversa. `memory_search` aceita exatamente um `query` semântico ou um `filter` de documento, retornando até 10 resultados restritos ao usuário atual. Buscas semânticas usam reclassificação `rrf` sem custo; buscas por filtro retornam as correspondências mais recentes sem cobranças de incorporação. Salvamentos e atualizações incidem cobranças de incorporação de documento, buscas semânticas incidem cobranças de incorporação de consulta, e ambas as ferramentas usam os limites RAG da conta e retornam erros de ferramenta quando saldo ou limites de taxa impedem o acesso. Aguarde alguns segundos para indexação após gravações. Consulte [Memory](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Memória — Registros existentes migrados.** Memórias não expiradas foram movidas para `@memories`, preservando IDs, identificadores de usuário, datas de criação e expiração, com `conversation_token` definido como `null`. Lembretes de calendário não expirados tornaram‐se memórias de texto no formato `Reminder at <date> (<n> minutes): <description>`. Registros migrados são re‐indexados e incidem cobranças de incorporação de documento. Revise a coleção e atualize integrações que usavam os recursos de memória ou calendário removidos.

## Quinta‐feira, 8 de outubro de 2026

Alterações:

- **Documentação — Nova seção Learn.** O site de documentação agora inclui [Learn](https://docs.aivax.net/pt-br/learn/index.md), um conjunto de 11 módulos e 63 unidades curtas que explicam agentes de IA desde conceitos básicos até produção para leitores sem background em computação: o que é um agente, modelos de linguagem, prompts e contexto, seleção e parâmetros de modelo, ferramentas e integrações, conhecimento e RAG, fluxos avançados, avaliação e observabilidade, segurança e conformidade, custo e escala, e casos de uso práticos. As unidades incluem exemplos interativos, tutoriais passo a passo, tabelas comparativas, gráficos e quizzes curtos, e cada uma pode ser marcada como concluída no navegador. Três caminhos de aprendizado sugeridos (Beginner, Developer, Business) agrupam os módulos por objetivo. Learn está disponível em inglês e português e está incluído na busca do site.

- **Modelos — Claude Haiku 5.5 adicionado.** Adicionado `@anthropic/claude-5.5-haiku` (Claude Haiku 5.5), sucessor direto do Claude Haiku 4.5, ao catálogo de modelos de texto. Suporta entrada de imagem e arquivo e chamada de ferramentas, com janela de contexto de 1 M de tokens. O alias `@model-router/claude:budget` agora seleciona Claude Haiku 5.5, substituindo Claude Haiku 4.5. Aplicações que usam esse alias podem notar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

- **Inferência — Seleção de provedor com `routing_options`.** Compleções de chat aceitam `routing_options` com `preset` (`Balanced`, `Cheapest`, `Fastest` ou `Quality`) e `allowed_providers`, uma lista ordenada de tags de provedor como `["azure-us", "azure-eu", "*"]`. AIVAX tenta cada tag na ordem e passa para a próxima apenas quando nenhum provedor correspondente está disponível; `"*"` combina com qualquer provedor. `allowed_providers` tem padrão `["*"]`, e lista vazia é rejeitada. Sem `"*"`, a solicitação falha quando nenhum dos provedores listados está disponível. `routing_preset` está depreciado: ainda funciona, mas use `routing_options.preset`. Gateways de IA aceitam a mesma lista ordenada em `parameters.allowedProviders` (padrão `["*"]`), editável no editor do gateway em **Allowed providers** para modelos integrados; valores de solicitação sobrescrevem isso apenas para aquela solicitação. Consulte [Provider routing](https://docs.aivax.net/pt-br/docs/inference/inference.md#provider-routing).

- **Inferência — Provedor servido nas respostas.** Respostas de completions de chat e cada bloco de streaming incluem um campo `provider` ao lado de `model` com a tag do provedor que atendeu um modelo integrado. É `null` para gateways que usam credenciais próprias de provedor.

- **Modelos — `filter` em `GET /v1/models`.** A lista de modelos aceita um parâmetro de consulta opcional `filter` com um nome de modelo e devolve apenas as entradas correspondentes: o nome exato ou seus snapshots datados, ordenados do mais próximo. Sem ele, a lista permanece inalterada.

- **Modelos — Tags de provedor.** Os detalhes do provedor na página de Modelos do painel mostram a tag de cada provedor com um botão de copiar, e `GET /v1/models` a devolve como `tag` em cada entrada de provedor. Provedores em diferentes regiões ou variantes têm tags distintas, como `azure-us` e `azure-eu`.

## Quarta‐feira, 7 de outubro de 2026

Alterações que quebram compatibilidade:

- **Inferência — Pré‐processamento de `File` e `OtherFiles` agora cobre todo arquivo.** Gateways e solicitações que habilitam apenas a flag multimodal `OtherFiles` agora convertem arquivos PDF com OCR ao invés de enviá‐los ao modelo principal sem alterações. Aqueles que habilitam apenas a flag `File` agora convertem arquivos não‐PDF com OCR também, cobrados em Unidades de Processamento. Gateways e solicitações com ambas as flags ou `All` não são afetados. Para deixar arquivos inalterados, defina `multimodal_resolver` (ou `multimodalResolverParameters` do gateway) sem um `fileEngine`; nenhum tipo de arquivo será pré‐processado.

Alterações:

- **Inferência — Motores de resolução multimodal por mídia.** Compleções de chat aceitam `multimodal_resolver`, e gateways de IA aceitam `multimodalResolverParameters`, com campos `imageEngine`, `audioEngine`, `videoEngine` e `fileEngine`. Cada um seleciona como aquele tipo de conteúdo é convertido em texto antes da inferência: `InferenceLow` (modelo multimodal menor; `Inference` é um alias), `InferenceHigh` (modelo maior, mais preciso, custo maior), `Ocr` para imagens e arquivos (cobrado em Unidades de Processamento, como Fetch e OCR) ou `Stt` para áudio (speech‐to‐text, cobrado por segundo). OCR aceita URIs de dados base64 e URLs públicas. Os resultados de cada motor são armazenados em cache por conteúdo e motor, de modo que mídia repetida não é cobrada novamente. As flags `multimodal_preprocess` e a configuração `enabledMultimodalFeatures` do gateway estão depreciadas, mas continuam funcionando com os motores equivalentes; as novas configurações prevalecem quando presentes. O editor de gateway agora configura um motor por tipo de conteúdo. Consulte [Multimodal pre‐processing](https://docs.aivax.net/pt-br/docs/inference/inference.md#multimodal-pre-processing).

- **RAG — Filtros de documento no Collections MCP e na ferramenta de consulta do gateway.** A ferramenta de busca do Collections MCP e a ferramenta `query` de gateways de IA usando a estratégia de consulta `QueryFunction` aceitam um argumento opcional `filter` com a mesma sintaxe do campo `filter` da busca semântica, como `tags has "faq" and updatedAt >= now-30d`. Filtros são aplicados antes que os termos de busca sejam incorporados; quando nenhum documento corresponde, a ferramenta devolve nenhum resultado sem cobrança de incorporação ou busca. Um filtro inválido é retornado ao modelo como erro de ferramenta. O RAG automático ainda não aplica filtros. Consulte [Document Filters](https://docs.aivax.net/pt-br/docs/rag/document-filters.md).

## Terça‐feira, 6 de outubro de 2026

Alterações:

- **RAG — Segmentação de texto mais rápida sem sanitização.** Solicitações `POST /api/v1/generations/segment` com `sanitize` omitido ou `false` não usam mais um modelo de linguagem. Limites agora são escolhidos a partir da estrutura do documento (títulos, listas, tabelas, blocos de código, parágrafos e finais de frase) e da similaridade semântica de trechos vizinhos, mirando segmentos de cerca de 300 tokens. Segmentos cobrem todo o documento na ordem original sem sobreposição e mantêm quebras de linha originais; um limite pode cair ao final de uma frase dentro de uma linha. Documentos com cerca de 300 tokens ou menos são retornados como um único segmento. O formato de resposta, cotas e preço por token permanecem inalterados; `usage.processing_units` agora relata os tokens dos documentos enviados. Solicitações com `sanitize: true` mantêm o comportamento anterior. Consulte [Text segmentation](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md).

- **Modelos — Seis novos modelos de decisão semântica.** Adicionados `@upstage/solar-decide` (Upstage Solar Decide), `@cloudflare/clef` (Cloudflare Clef), `@cloudflare/clef-flash` (Cloudflare Clef Flash), `@liquid/d1` (LiquidAI d1), `@perplexity/pplx-decider-v1-27b` (Perplexity Decider V1 27B) e `@openai/gpt-6-luna-decisions` (OpenAI GPT‐6 Luna Decisions) ao catálogo de decisões semânticas. Todos suportam perguntas `noul`, `choice` e `score` via `POST /api/v1/generations/decisions` e são cobrados por token de entrada nas taxas publicadas, sem cobrança de token de saída, com ajustes de conta e plano ainda aplicáveis. Não são cobertos pela cota diária de decisão semântica, que permanece limitada ao Julia‐1. Identificadores de modelo existentes permanecem inalterados. Consulte [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) e [Pricing](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#usage-and-cost).

## Segunda‐feira, 5 de outubro de 2026

Alterações que quebram compatibilidade:

- **Gateways — Um fuso horário por gateway.** Gateways de IA agora têm um parâmetro `timeZone` (identificador IANA, padrão `America/Sao_Paulo`) usado para toda data que o modelo lê ou grava: `get_date_time`, ferramentas de agendamento e o ambiente bash. Ele substitui `builtinFunctionsOptions.dateTimeTimeZone` (padrão anterior `America/Los_Angeles`) e `bashOptions.timeZone` (padrão anterior `UTC`), que não são mais lidos. Gateways e fluxos de trabalho Batch que dependiam dos padrões antigos agora reportam horário de São Paulo; defina `timeZone` no gateway para manter outro fuso. Em `/v1/chat/completions`, envie `time_zone` em vez de `builtin_tools.options.dateTimeTimeZone` para sobrescrever o fuso em uma única solicitação. No painel, a configuração mudou para **Date and time** na aba **Parameters + Tuning** do gateway e foi removida das opções da ferramenta Batch. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

- **Chat — Mensagens agendadas não são mais executadas junto a uma resposta.** Nas integrações Telegram e WhatsApp, uma mensagem agendada que se torna pendente enquanto o assistente ainda está respondendo a mesma conversa agora aguarda a conclusão da resposta em vez de gerar uma segunda resposta em paralelo. Mensagens recebidas durante uma resposta também aguardam e são respondidas depois. Anteriormente, ambas as execuções podiam atuar na mesma conversa, e uma resposta poderia ser descartada do histórico. Uma mensagem agendada atrasada ainda é enviada se a conversa ficar livre dentro de 30 minutos do horário programado.

- **Chat — Agendamento usa o fuso horário do gateway.** `schedule_assistant_message` agora lê horários sem deslocamento UTC no fuso horário do gateway, `create_recurring_job` avalia expressões cron nesse fuso, e `list_scheduled_jobs` devolve horários agendados nele. Antes, eles usavam o fuso horário do servidor. Horários com deslocamento UTC explícito mantêm o instante exato. `get_date_time` agora está sempre disponível ao lado das ferramentas de agendamento. Defina o `timeZone` do gateway para o fuso horário dos seus usuários para que lembretes disparem no horário local esperado. Consulte [Current Date and Time](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#current-date-and-time).

- **Chat — Ferramentas de calendário removidas.** O sinalizador `Calendar` e as ferramentas `appointment_create`, `appointment_search`, `appointment_find`, `appointment_update` e `appointment_delete` foram removidos da API e do painel. Gateways e fluxos de trabalho Batch existentes têm o sinalizador removido automaticamente. Solicitações contendo `Calendar` em `builtin_tools.tools` agora falham; remova o sinalizador e atualize instruções que dependem de ferramentas de agendamento. Texto de lembrete migrado não substitui calendário ou serviço de agendamento.

- **Memória — Chamadas e gerenciamento de ferramentas alterados.** `Remember` agora expõe apenas `memory_save` e `memory_search`. Substitua chamadas `memory_update` e `memory_remove` por `memory_save` usando um ID e conteúdo, ou um ID sem conteúdo para excluir. `memory_clear` foi removido. A API de Memórias (`/api/v1/memories`, incluindo listagem, obtenção, exclusão e geração de prompt de migração) e a página de Memórias do painel foram removidas; gerencie registros via [Collections and Documents APIs](https://docs.aivax.net/pt-br/docs/rag/collections.md) e páginas do painel. Excluir `@memories` apaga todas as memórias dos usuários na conta.

- **Gateways — Recuperação e visibilidade de memória alteradas.** Memórias não são mais adicionadas automaticamente às instruções de sistema: atualize prompts para chamar `memory_search` explicitamente. A opção `include_all_memory_context` / `IncludeAllMemoryContext` foi removida e é ignorada se enviada. `allowSharedMemory` continua controlando se um gateway vê as memórias do usuário de outros gateways ou apenas as suas; memórias migradas não têm gateway e são visíveis apenas para gateways com memória compartilhada. A expiração agora é opcional: `memory_save` aceita `expiresInDays` (1–365), e memórias salvas sem isso nunca expiram, enquanto o padrão antigo era 30 dias. Revise suposições de acesso e necessidades de retenção. Consulte [Memory](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory).

Alterações:

- **Modelos — Três novos modelos de decisão semântica.** Adicionados `@microsoft/microsoft-decision-1` (Microsoft‐Decision‐1), `@nace-ai/drex-v1.5` (Nace.AI Drex v1.5) e `@cloudflare/clef-omni` (Cloudflare Clef Omni) ao catálogo de decisões semânticas. Todos suportam perguntas `noul`, `choice` e `score` e são cobrados por token de entrada a $0,042, $0,04 e $0,15 por milhão de tokens, respectivamente, sem cobrança de token de saída. Não são cobertos pela cota diária de decisão semântica. Consulte [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) e [Pricing](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#usage-and-cost).

- **Decisões semânticas — Entrada de imagem.** Modelos de decisão que aceitam imagens (`@cloudflare/clef`, `@cloudflare/clef-flash`, `@cloudflare/clef-omni` e `@openai/gpt-6-luna-decisions`) agora aceitam imagens em `state` como partes `image_url` com URLs de dados base64 `image/png`, `image/jpeg` ou `image/webp`, no mesmo formato do OpenRouter. Modelos Clef aceitam até 4 imagens e GPT‐6 Luna Decisions até 128; outros modelos rejeitam imagens com `400`. `GET /api/v1/information/decisions-models.json` agora devolve `maxImages` para cada modelo. Consulte [Send images](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#send-images).

- **Memória — Armazenamento e busca em coleção.** Memórias são armazenadas como documentos na coleção `@memories` da conta, criados na primeira gravação, com metadados de usuário e conversa. `memory_search` aceita exatamente um `query` semântico ou um `filter` de documento, retornando até 10 resultados restritos ao usuário atual. Buscas semânticas usam reclassificação `rrf` sem custo; buscas por filtro retornam as correspondências mais recentes sem cobranças de incorporação. Salvamentos e atualizações incidem cobranças de incorporação de documento, buscas semânticas incidem cobranças de incorporação de consulta, e ambas as ferramentas usam os limites RAG da conta e retornam erros de ferramenta quando saldo ou limites de taxa impedem o acesso. Aguarde alguns segundos para indexação após gravações. Consulte [Memory](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Memória — Registros existentes migrados.** Memórias não expiradas foram movidas para `@memories`, preservando IDs, identificadores de usuário, datas de criação e expiração, com `conversation_token` definido como `null`. Lembretes de calendário não expirados tornaram‐se memórias de texto no formato `Reminder at <date> (<n> minutes): <description>`. Registros migrados são re‐indexados e incidem cobranças de incorporação de documento. Revise a coleção e atualize integrações que usavam os recursos de memória ou calendário removidos.

## Sábado, 3 de outubro de 2026

Alterações:

- **Documentação — Experiência de leitura e busca atualizada.** A documentação adiciona busca específica por idioma, temas claro e escuro, navegação móvel e um menu de página para visualização ou cópia de Markdown. Agentes de IA podem usar o índice de documentação e arquivos de texto completo. URLs de documentação existentes continuam resolvendo; alguns guias antigos redirecionam para a documentação atual do produto.

## Sexta‐feira, 2 de outubro de 2026

Alterações:

- **Modelos — Claude Sonnet 5.5 e GPT‐6.1 Sol adicionados.** Adicionados `@anthropic/claude-5.5-sonnet` (Claude Sonnet 5.5), sucessor direto do Claude Sonnet 5, e `@openai/gpt-6.1-sol` (GPT‐6.1 Sol), uma atualização do GPT‐6 Sol, ao catálogo de modelos de texto. Ambos suportam pensamento, entrada de imagem e arquivo e chamada de ferramentas; GPT‐6.1 Sol também suporta saída estruturada. Os aliases `@model-router/claude:mid` e `@model-router/openai:mid` agora selecionam Claude Sonnet 5.5 e GPT‐6.1 Sol, substituindo Claude Sonnet 5 e GPT‐6 Sol, respectivamente. Aplicações que usam esses aliases podem notar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Quinta‐feira, 1 de outubro de 2026

Alterações que quebram compatibilidade:

- **API — Códigos de status de erro refletem a origem da falha.** Falhas não são mais todas retornadas como `400 Bad Request` por endpoints de conta, RAG, web e geração. Solicitações inválidas ainda retornam `400`, e falhas de autenticação, saldo e permissão que antes surgiam como `400` agora retornam `401`, `402` ou `403`. Falhas inesperadas da AIVAX retornam `500 Internal Server Error` com mensagem genérica, e serviços externos indisponíveis, incluindo provedores de modelo, retornam `503 Service Unavailable` com cabeçalho `Retry-After`. Em endpoints compatíveis com OpenAI, o campo `code` de erro agora é `invalid_request_error`, `service_unavailable` ou `server_error` ao invés de sempre `server_error`. Clientes que tratam toda resposta não‐2xx como erro de solicitação devem tentar novamente em respostas `500` e `503`, obedecendo `Retry-After`. Consulte [Troubleshoot the first request](https://docs.aivax.net/pt-br/docs/inference/inference.md#troubleshoot-requests).

Correções:

- **Compleções de chat — Declarações de ferramenta malformadas rejeitadas como solicitações inválidas.** Solicitações cujas entradas `tools` têm campos ausentes ou com tipo incorreto agora retornam `400 Bad Request` ao invés de erro de servidor.

- **Gateways — Ferramenta Bash relata opções inválidas ao modelo.** Opções ou valores desconhecidos que não correspondem aos parâmetros de uma ferramenta agora retornam um erro de comando que o modelo pode corrigir, ao invés de falhar a chamada da ferramenta.

Alterações:

- **Utilitários MCP — Media generation MCP.** Um novo servidor MCP hospedado em `https://inference.aivax.net/v1/mcp/media-generation` expõe `list_models`, `generate_image` e `generate_speech` para clientes compatíveis com MCP. `list_models` aceita um `type` de `image` ou `audio`; imagens geradas e fala MP3 são devolvidas como URLs públicas. Use o cabeçalho opcional `X-Mcp-Enabled-Tools` para escolher quais ferramentas o cliente vê. Gerações usam a mesma precificação e limites das APIs de Image Generation e Speech Generation e requerem saldo positivo. Consulte [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Quarta‐feira, 28 de setembro de 2026

Correções:

- **Gateways — Ajuda da ferramenta Bash aceita parâmetros anuláveis.** Solicitar ajuda para ferramentas cujos parâmetros aceitam múltiplos tipos, incluindo `null`, não falha mais ao listar seus argumentos. A ajuda preserva os tipos aceitos e caminhos de parâmetros aninhados. Nenhuma mudança no esquema da ferramenta é necessária.

- **Integrações de chat — Notificações de falha restauradas.** Conversas em streaming e não‐streaming novamente tentam enviar “System: something went wrong. Please, try again later.” após uma falha irrecuperável de geração, tentativas de recuperação esgotadas ou um turno que não envia mensagem. Uma falha final é relatada mesmo que uma resposta parcial tenha sido entregue anteriormente. A entrega de notificações ainda depende da disponibilidade do serviço de mensagens.

Alterações:

- **Gateways / MCP — Instruções de sistema e habilidades remotas.** Fontes MCP podem incluir instruções de sistema e documentos de habilidade raiz junto com ferramentas, incluindo fontes adicionadas por trabalhadores. Ambas as opções padrão são habilitadas; defina `allowClientInstructions` ou `allowRemoteSkills` como `false` para excluir esse conteúdo. A descoberta de habilidades requer que o servidor remoto anuncie capacidades compatíveis; habilidades de conta permanecem disponíveis. O conteúdo de habilidades remotas é verificado quanto ao tamanho anunciado, digest e frontmatter. Habilidades dinâmicas, que suportam arquivos, scripts e servidores que exigem o protocolo de descoberta mais recente, não são suportadas. Consulte [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md#server-instructions-and-remote-skills) para limites de compatibilidade e confiança.

- **Gateways — Seleção de fuso horário.** A configuração de data e hora atuais agora oferece um menu suspenso de fuso horário agrupado por região, incluindo UTC. Fusos horários salvos previamente são preservados ao reabrir a configuração.

- **Modelos — Sete novos modelos de texto.** Adicionados `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime` e `@fireworks/ember-1` como modelos de texto selecionáveis, cobrados por provedor nas taxas de token publicadas, com ajustes de conta e plano ainda aplicáveis. Modelos Upstage e Fireworks agora exibem seus ícones de provedor ao invés do fallback genérico. Identificadores de modelo existentes permanecem inalterados.

## Terça‐feira, 27 de setembro de 2026

Alterações:

- **Telegram — Progresso de ferramenta compacto.** Respostas transmitidas mostram apenas o último preâmbulo de ferramenta no indicador de pensamento quando a visibilidade de chamada de ferramenta está habilitada, ao invés de acumular blocos de nomes de ferramenta na resposta. A resposta final não contém blocos de progresso de ferramenta. Outros canais de mensagem e respostas não transmitidas permanecem inalterados.

- **Gateways — Seleção da ferramenta Bash.** A lista de ferramentas Bash agora inclui um atalho para `get_date_time` (Current date and time). Listas de inclusão e exclusão aceitam padrões curinga sem distinção de maiúsculas/minúsculas: `*` combina qualquer número de caracteres, como em `something_*`, e `?` combina um caractere. Nomes de ferramentas exatos permanecem suportados.

- **Decisões semânticas e Testes de Agente — Limites de taxa de conta.** Limites por minuto de conta se aplicam a solicitações de decisão semântica e novas execuções de Testes de Agente; avaliações manuais, agendadas e diretas compartilham o limite de execuções de teste. Solicitações acima do limite retornam HTTP 429, enquanto testes agendados aguardam a próxima verificação de agendamento. Clientes devem espaçar solicitações e tentar novamente após o intervalo de limite de taxa. Limites de inferência existentes ainda se aplicam. Consulte [Plans and Limits](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#account-rate-limits), [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#account-rate-limits) e [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#run-and-inspect-a-test).

- **Modelos — Preços de síntese de fala consistentes.** Preços do catálogo de texto‐para‐fala agora derivam das mesmas taxas por caractere usadas para calcular o uso de síntese, exibidos por 1 000 caracteres. Identificadores de modelo e taxas de faturamento permanecem inalterados.

- **Modelos — Preços de transcrição comparáveis.** Preços de modelos de fala‐para‐texto são exibidos de forma consistente em USD por minuto, convertendo taxas horárias e por segundo para comparação sem alterar taxas de faturamento ou medição de duração.

- **Geração de imagens — Preço fixo de saída e referência.** Geração de imagens usa um preço fixo por saída entregue mais um preço por referência para cada saída. Modelos cujos provedores cobram por tokens ou megapixels agora usam estimativas arredondadas ao invés de cobranças de token medida. O processamento do prompt está incluído na estimativa de saída; modelos sem cobrança separada de referência listam taxa de referência zero. Estes são tarifas fixas, não recibos do consumo real do provedor. Cobranças de imagem não incluem mais a margem de marcação de geração de imagens da AIVAX nem os multiplicadores de preço de conta e plano. Consulte [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Modelos — Cobertura de assinatura.** A página Modelos agora inclui uma coluna “Subscription Usage” para rerankers e modelos de decisão semântica. “Included” indica modelos elegíveis para a cota diária do plano; “Excluded” indica modelos sem cobertura. Elegibilidade não indica a cota restante da conta. Ambos os catálogos de serviço expõem essa elegibilidade como `subscriptionUsage`.

- **Assinaturas — Cotas diárias incluídas.** Assinaturas Free, Pro e Max incluem cotas diárias separadas para embeddings de busca e inserção RAG, entrada Reflex (incluindo entrada em cache) e decisões semânticas Julia‐1. Cada item medido é totalmente incluído ou cobrado nas taxas normais; uma solicitação com múltiplos itens pode combinar uso incluído e pago. Isso também se aplica à extração OCR, substituindo cobertura parcial. Itens incluídos aparecem no consumo da assinatura sem entradas de histórico de faturamento de custo zero; indicadores de uso podem exceder a cota base dentro da margem permitida. Itens não cobertos mantêm registros de faturamento normais. `includesSubscriptionModels` é false enquanto assinaturas de inferência estão desativadas; cobertura de assinatura LLM permanece desativada. O limite diário de tempo de processamento Reflex permanece separado, e contas de revendedor não recebem cotas de assinatura. Consulte [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

## Sábado, 26 de setembro de 2026

Alterações que quebram compatibilidade:

- **Geração de imagens — Modelos depreciados removidos.** Removidos `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL` e `Meina-Mix` dos modelos disponíveis. Solicitações de API que usem esses identificadores agora falham; selecione um modelo ativo. A geração de imagens embutida usa `flux-schnell` quando nenhum modelo válido está configurado, substituindo o padrão depreciado `AbsoluteReality`. Revise configurações salvas; estilo e preço de saída diferem.

Alterações:

- **Geração de imagens — Modelos Pollinations adicionais.** Adicionados 16 modelos oficiais de imagem raster, incluindo FLUX 1.1 Pro e variantes FLUX 2, variantes MAI Image, GPT Image 2.5 Flare e Sunburst, Qwen Image 2.1 e 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM e Seedream 5 Pro, com pré‐visualizações geradas no seletor de imagens. Modelos comunitários e SVG são excluídos. O catálogo exibe as unidades de faturamento. Consulte a entrada de 27 de setembro para a mudança subsequente de faturamento de preço fixo. Gerações falhas não são contadas como imagens entregues. Consulte [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Modelos — Catálogos de serviço.** A página Modelos agora inclui tabelas para geração de imagens, speech‐to‐text, text‐to‐speech, reranking e decisões semânticas, com descrições fornecidas pelo backend, datas de lançamento, preços base em USD com unidades de faturamento e um menu **Actions** em cada tabela de modelo de serviço para copiar nomes de modelo e abrir documentação de integração. Nomes de modelo exibem um rótulo amigável quando disponível, enquanto copiam o identificador aceito pela API. A precificação usa unidades de entrada, entrada em cache, saída, imagem, caractere e duração separadas por setas quando aplicável, com taxas completas e unidades disponíveis na tooltip. Catálogos são ordenados do mais recente ao mais antigo. Datas de catálogo OpenRouter e nomes amigáveis complementam metadados de lançamento ausentes; datas de catálogo são rotuladas explicitamente ao invés de apresentadas como datas de lançamento do fabricante. Modelos sem data permanecem ao final. Falhas de solicitação de catálogo podem ser repetidas independentemente. Os catálogos públicos expõem esses detalhes, incluindo o novo catálogo `GET /api/v1/information/speech-models.json`. Ajustes de preço de conta e plano ainda se aplicam. Consulte [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md).

- **Privacidade — Divulgações judiciais e retenção esclarecidas.** A [Privacy Policy](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md) e os [Terms of Use](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md) especificam ordens judiciais brasileiras para divulgação, solicitações estrangeiras para preservar logs existentes por até 1 ano, e até 1 ano de logs técnicos e metadados. Clarificam que o conteúdo da conversa é coletado somente quando Conversa está habilitada para a solicitação ou conta, e que recursos de conta e backups disponíveis de até 3 meses podem ser divulgados sob ordem judicial brasileira. A licença de conteúdo nos Termos está expressamente sujeita a esses limites.

- **Gerações — Modelos de decisão adicionais.** O guia [Semantic decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) explica tipos de perguntas e interpretação de respostas. O ponto de extremidade público `GET /api/v1/information/decisions-models.json` lista nomes canônicos, aliases, tipos de pergunta suportados, comprimentos de contexto, datas de lançamento e preços base por token. Adicionados `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b` e `@supersonic-labs/julia-1` como opções de modelo para decisões semânticas. Julia‐1 suporta `choice`, `score` e `noul`; seu uso de entrada inclui o estado repetido para cada pergunta. Ajustes de preço de conta e plano existentes se aplicam, e identificadores e formatos de solicitação permanecem inalterados. Consulte [Plans and Limits](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#model-specific-limits) e [Pricing](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md#usage-and-cost) para limites e taxas atuais.

## Terça‐feira, 22 de setembro de 2026

Alterações:

- **Modelos — GPT‐6 Sol e Luna adicionados.** Adicionados `@openai/gpt-6-sol` e `@openai/gpt-6-luna`, incluindo suas variantes de raciocínio `:pro`. Os aliases `@model-router/openai:mid` e `@model-router/openai:budget` agora selecionam GPT‐6 Sol e GPT‐6 Luna, respectivamente. Aplicações que usam esses aliases podem notar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Segunda‐feira, 21 de setembro de 2026

Alterações que quebram compatibilidade:

- **Gateways — Moderação fora do tópico foi removida.** O limite dedicado fora do tópico não bloqueia mais solicitações que se desviam do propósito da conversa. Se sua aplicação depende dessa verificação, revise suas restrições de tópico antes de adotar a mudança; as categorias de moderação restantes não são um substituto equivalente.

- **Ferramentas embutidas — Pesquisa avançada na web desativada.** A ferramenta `AdvancedWebUsage` devolve uma resposta indisponível ao invés de realizar pesquisa. Remova dependências dessa ferramenta de instruções e fluxos de trabalho. A pesquisa padrão [Web Search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) e extração de URL permanecem alternativas separadas, não equivalentes à pesquisa de múltiplas etapas.

- **Modelos — Identificador do modelo Mercury 2.5 alterado.** Substitua `@inception/mercury-2.5-preview` por `@inception/mercury-2.5` em solicitações e configurações de gateway. O identificador de preview não está mais listado, e o substituto não está mais marcado como preview.

- **Gateways / MCP — Nomes de ferramentas MCP são qualificados pela fonte.** Ferramentas de diferentes fontes MCP não compartilham mais um nome não qualificado no gateway. Revise instruções de gateway, regras de seleção de ferramentas e trabalhadores que correspondem a nomes exatos de ferramenta. O nome original da ferramenta no servidor MCP conectado permanece inalterado. Consulte [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

Correções:

- **Coleções, Gateways e Gerações — Disponibilidade de modelo de serviço.** Geração de respostas de coleção, roteamento de gateway, utilidades de chat e serviços de processamento de mídia evitam selecionar modelos temporariamente indisponíveis. Skill de Ensino e pré‐processamento multimodal podem tentar outro modelo disponível após falha recuperável; o sucesso ainda depende da disponibilidade do serviço.

- **Teach Skill — Cálculo de uso.** Cobranças de processamento do Teach Skill usam o preço do modelo associado à solicitação concluída, inclusive quando uma nova tentativa muda o modelo usado. Consulte [Teach Skill](https://docs.aivax.net/pt-br/docs/inference/skills.md) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Fetch e OCR — Extração de página mais confiável.** Solicitações de conteúdo de página canceladas ou expiradas não deixam mais a extração de página em execução indefinidamente. Isso resolve casos onde a extração de conteúdo web poderia travar.

- **Clientes de chat — Resposta final e histórico de mensagens.** `completionText` agora seleciona a resposta final gerada do assistente ao invés de combinar com texto de assistente anterior durante o uso de ferramentas. O campo de resposta `createdMessages` adicional preserva mensagens recém‐geradas em ordem, incluindo interações de ferramenta; mensagens enviadas não são repetidas. Use esse campo quando precisar do turno completo gerado.

- **Gateways / MCP — Resultados estruturados de MCP são mantidos.** Assistentes recebem conteúdo de resultado estruturado além de blocos de conteúdo suportados, evitando perda de informação quando uma ferramenta MCP devolve saída estruturada.

- **Fetch e OCR — X post extraction.** Melhorada a extração de texto legível de links públicos de posts X. Disponibilidade de conteúdo e restrições de acesso ainda se aplicam.

- **Fetch e OCR — Normalização de texto simples alterada.** Conversão para texto simples não colapsa mais espaços internos nem normaliza caracteres Unicode. Espaços ao redor ainda podem ser aparados nos resultados de extração. Aplicações que comparam texto extraído exatamente ou requerem espaçamento normalizado devem fazer essa normalização por conta própria.

Alterações:

- **Fetch e OCR — Extração estruturada opcional.** Forneça `responseSchema` para converter conteúdo extraído em JSON. Resultados adicionam `extractedObject` e `jsonProcessingUnits` mantendo `extractedText` em caso de sucesso. Sem um esquema, os novos campos são nulos e zero respectivamente. Conversão JSON é cobrada separadamente da extração e não está coberta pela cota diária de extração. Consulte [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).

- **Gerações — Decisões semânticas.** Avalie múltiplas perguntas nomeadas contra um estado JSON compartilhado usando `noul` (critérios verdadeiro/falso), `choice` ou `score`. Respostas incluem respostas nomeadas, uso de tokens e custo. O serviço requer saldo positivo, e seu uso de tokens contribui para os totais de uso da conta.

- **Ferramentas embutidas — Data e hora atuais.** A opção `DateTime` permite que assistentes solicitem data, hora, dia da semana, fuso horário e deslocamento UTC atuais. Defina `dateTimeTimeZone` para o fuso desejado; o padrão é `America/Los_Angeles`, com ajustes de horário de verão, independente do fuso horário do navegador. Fusos horários inválidos são rejeitados.

- **Modelos — Opções de modelo adicionais.** Adicionados GLM‐5.3‐FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo‐V2.6‐Pro, MiMo‐V2.6‐Flash, MiMo‐V2.6‐Pro‐UltraSpeed e Grok 4.7 ao catálogo de inferência. Os aliases frontier, mid e budget da Xiaomi agora selecionam modelos MiMo V2.6, enquanto `@model-router/grok:latest` seleciona Grok 4.7. Usuários de alias podem notar diferenças de qualidade de resposta, latência e custo; disponibilidade e capacidades suportadas dependem do modelo selecionado e do plano da conta.

- **Inferência — Recuperação de falhas transitórias.** Solicitações de inferência podem fazer tentativas adicionais de recuperação quando um provedor está temporariamente indisponível. Isso pode evitar algumas solicitações falhas, mas também pode aumentar o tempo de resposta antes que um erro seja retornado.

- **Avi Assistant — Modelo padrão atualizado.** O assistente do console AIVAX muda seu modelo padrão, o que pode alterar estilo de resposta, latência e custo de uso. Isso não altera o modelo selecionado nos seus próprios gateways.

- **Documentação — Orientação de serviço atualizada.** Visão geral da documentação da API e orientações do Avi Assistant cobrem sessões de voz, testes de agente, classificação, segmentação, reranking e extração web, com links de documentação atuais e orientação de faturamento específica por serviço. Trata‐se de uma atualização de orientação, não da introdução desses serviços.

- **Modelos — DeepSeek V4.1 Flash adicionado.** O catálogo de inferência inclui `@deepseek/deepseek-v4.1-flash` com suporte a chamada de ferramentas. Verifique disponibilidade de modelo e elegibilidade de plano antes de selecioná‐lo.

- **Modelos — Seleções de roteador atualizadas.** `@model-router/deepseek:latest` e `@model-router/deepseek:budget` agora selecionam DeepSeek V4.1 Flash. Aplicações que usam esses aliases podem notar diferenças de qualidade de resposta, latência e custo sem mudar o alias. Adicionados `@model-router/claude:frontier-mythos` e `@model-router/mercury:latest` como opções adicionais.

- **Clientes de chat — Entrada de prompt estruturada.** Prompts síncronos de cliente de chat aceitam texto simples, uma única mensagem ou um array ordenado de mensagens, incluindo chamadas de ferramenta do assistente e resultados de ferramenta correspondentes. Entrada de mensagem única permanece suportada. `instructions` opcional adiciona contexto àquela solicitação sem substituir o contexto da sessão salva. Consulte [Chat clients](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md).

- **Clientes de chat — Turnos sem persistência de sessão.** Defina `commit` como false para gerar uma resposta sem salvar as mensagens enviadas e geradas no histórico da sessão. O padrão permanece true. Isso não é uma pré‐visualização gratuita: inferência e ações de ferramenta ainda são executadas. Para continuar uma interação de ferramenta não confirmada, envie a mensagem de chamada de ferramenta do assistente junto com seus resultados de ferramenta.

- **Testes de Agente — Notificações de teste opcionais.** Preferências de notificação da conta podem habilitar resumos semanais de teste e alertas quando um teste atinge três falhas consecutivas. Isso complementa notificações de falha e recuperação existentes. Consulte [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

- **Fetch e OCR — Conteúdo web renderizado.** Extração HTML suporta conteúdo de página renderizado, melhorando a cobertura de páginas cujo texto legível depende de scripts. Renderização é cobrada em unidades de processamento; isso não garante acesso a todos os sites ou páginas restritas. Consulte [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).
