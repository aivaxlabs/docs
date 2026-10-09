Source: https://docs.aivax.net/pt-br/docs/changelogs.html

# Registros de alterações

Alterações técnicas que afetam produtos, serviços ou a API pública da AIVAX. As datas identificam quando as entradas foram adicionadas ou atualizadas, não datas confirmadas de implantação em produção. Cada item identifica o produto ou serviço afetado; manutenção sem efeito visível ao usuário é omitida.

## Quinta-feira, 8 de outubro de 2026

Mudanças:

- **Documentation — New Learn section.** O site de documentação agora inclui [Learn](https://docs.aivax.net/pt-br/learn/index.md), um conjunto de 11 módulos e 63 unidades curtas que explicam agentes de IA desde os primeiros conceitos até a produção para leitores sem background de computação: o que é um agente, modelos de linguagem, prompts e contexto, seleção e parâmetros de modelo, ferramentas e integrações, conhecimento e RAG, fluxos de trabalho avançados, avaliação e observabilidade, segurança e conformidade, custo e escala, e estudos de caso práticos. As unidades incluem exemplos interativos, tutoriais passo a passo, tabelas comparativas, gráficos e quizzes curtos, e cada uma pode ser marcada como concluída no navegador. Três caminhos de aprendizagem sugeridos (Beginner, Developer, Business) agrupam os módulos por objetivo. Learn está disponível em inglês e português e está incluído na busca do site.

## Quarta-feira, 7 de outubro de 2026

Mudanças que quebram compatibilidade:

- **Inference — `File` and `OtherFiles` pre-processing now cover every file.** Gateways e requisições que habilitam apenas o sinalizador multimodal `OtherFiles` agora convertem arquivos PDF com OCR em vez de enviá‑los ao modelo principal sem alterações. Aqueles que habilitam apenas o sinalizador `File` agora convertem arquivos não‑PDF com OCR também, sendo cobrados em Unidades de Processamento. Gateways e requisições com ambos os sinalizadores ou `All` não são afetados. Para deixar arquivos inalterados, configure `multimodal_resolver` (ou o `multimodalResolverParameters` do gateway) sem um `fileEngine`; nenhum tipo de arquivo será pré‑processado.

Mudanças:

- **Inference — Per-media multimodal resolver engines.** As conclusões de chat aceitam `multimodal_resolver`, e os gateways de IA aceitam `multimodalResolverParameters`, com campos `imageEngine`, `audioEngine`, `videoEngine` e `fileEngine`. Cada um seleciona como aquele tipo de conteúdo é convertido em texto antes da inferência: `InferenceLow` (modelo multimodal menor; `Inference` é um alias), `InferenceHigh` (modelo multimodal maior e mais preciso, com custo maior), `Ocr` para imagens e arquivos (cobrado em Unidades de Processamento, como Fetch e OCR) ou `Stt` para áudio (speech‑to‑text, cobrado por segundo). OCR aceita URIs de dados base64 e URLs públicas. Resultados de inferência são armazenados em cache por motor; OCR e speech‑to‑text são cobrados a cada uso. As flags `multimodal_preprocess` e a configuração `enabledMultimodalFeatures` do gateway estão depreciadas, mas continuam funcionando com os motores equivalentes; as novas configurações têm precedência quando presentes. O editor de gateway agora configura um motor por tipo de conteúdo. Veja [Multimodal pre-processing](https://docs.aivax.net/pt-br/docs/inference/inference.md#multimodal-pre-processing).

- **RAG — Document filters in the Collections MCP and the gateway query tool.** A ferramenta de busca do Collections MCP e a ferramenta `query` dos gateways de IA que usam a estratégia de consulta `QueryFunction` aceitam um argumento opcional `filter` com a mesma sintaxe do campo `filter` da busca semântica, como `tags has "faq" and updatedAt >= now-30d`. Os filtros são aplicados antes que os termos de busca sejam incorporados; quando nenhum documento corresponde, a ferramenta devolve nenhum resultado sem custos de incorporação ou busca. Um filtro inválido é retornado ao modelo como erro de ferramenta. O RAG automático ainda não aplica filtros. Veja [Document Filters](https://docs.aivax.net/pt-br/docs/filters/document-filters.md).

## Terça-feira, 6 de outubro de 2026

Mudanças:

- **RAG — Faster text segmentation without sanitization.** Requisições `POST /api/v1/generations/segment` com `sanitize` omitido ou `false` não utilizam mais um modelo de linguagem. Limites são agora escolhidos a partir da estrutura do documento (títulos, listas, tabelas, blocos de código, parágrafos e fins de frase) e da similaridade semântica de trechos vizinhos, visando segmentos de cerca de 300 tokens. Segmentos cobrem todo o documento na ordem de origem sem sobreposição e mantêm quebras de linha originais; um limite pode cair ao final de uma frase dentro de uma linha. Documentos com cerca de 300 tokens ou menos são retornados como um único segmento. O formato de resposta, cotas e preço por token permanecem inalterados; `usage.processing_units` agora relata os tokens dos documentos enviados. Requisições com `sanitize: true` mantêm o comportamento anterior. Veja [Text segmentation](https://docs.aivax.net/pt-br/docs/rag/text-segmentation.md).

- **Models — Six new semantic decision models.** Adiciona `@upstage/solar-decide` (Upstage Solar Decide), `@cloudflare/clef` (Cloudflare Clef), `@cloudflare/clef-flash` (Cloudflare Clef Flash), `@liquid/d1` (LiquidAI d1), `@perplexity/pplx-decider-v1-27b` (Perplexity Decider V1 27B) e `@openai/gpt-6-luna-decisions` (OpenAI GPT‑6 Luna Decisions) ao catálogo de decisões semânticas. Todos os seis suportam perguntas `noul`, `choice` e `score` via `POST /api/v1/generations/decisions` e são cobrados por token de entrada nas taxas publicadas, sem custo de token de saída, com ajustes de conta e plano existentes ainda aplicáveis. Eles não são cobertos pela cota diária de decisões semânticas, que continua limitada a Julia‑1. Identificadores de modelo existentes permanecem inalterados. Veja [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md#semantic-decisions).

## Segunda-feira, 5 de outubro de 2026

Mudanças que quebram compatibilidade:

- **Chat clients — Current date and time are no longer added to the instructions.** Integrações Telegram e WhatsApp, incluindo mensagens agendadas, não adicionam mais a data e hora do servidor às instruções do modelo. Modelos devem obter a hora atual por meio de uma ferramenta. Para manter comportamento sensível a datas, como lembretes, habilite a função embutida de data e hora ou o shell (`date` command) no gateway de IA usado pelo cliente de chat.

- **Account — Reseller plan renamed to Custom.** Contas no plano Reseller agora relatam o plano como `Custom` em vez de `Reseller` nas respostas da API, como no endpoint de saldo, e no cabeçalho de resposta `X-Authenticated-Account-Plan`. Integrações que comparam o nome do plano com `Reseller` devem aceitar `Custom`. Contas Custom podem ter limites de taxa definidos como múltiplo dos limites do plano Pro; contas sem múltiplo configurado continuam sem limites de taxa de plano. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).

Correções:

- **AI gateways — Shell tool commands without parameters now run.** No shell do gateway, chamar uma ferramenta sem parâmetros, como `list_scheduled_jobs`, agora a executa em vez de imprimir sua ajuda. Use `--help` para visualizar a ajuda.

- **Collections — De-duplication no longer stops before removing documents.** Uma tarefa de desduplicação que encontrou documentos duplicados podia parar com zero documentos removidos e sem arquivos de backup, pois a gravação do backup falhou. Essas tarefas agora salvam os arquivos de backup, removem os duplicados e incluem os links de download na notificação de conclusão. Tarefas que pararam dessa forma não removeram nenhum documento; inicie uma nova tarefa para tentar novamente.

Mudanças:

- **Conversations — Provider and routing details.** Conversas agora registram o provedor que serviu a resposta mais recente, sua política de coleta de dados, a variante do modelo (`fast`, `flex` ou `priority`) quando usada, e a opção de roteamento usada para selecionar o provedor. O endpoint View Conversation devolve esses dados nos campos `providerName`, `providerDataCollection`, `modelVariant` e `routingOption`, e o endpoint List Conversations devolve `providerName`, `modelVariant` e `routingOption`. Esses campos são `null` para gateways que usam credenciais próprias de provedor e para conversas armazenadas antes desta mudança. A lista de conversas no painel mostra as colunas Provider, Routing e Variant; Provider exibe BYOK quando nenhum provedor foi registrado. A tabela rola horizontalmente, e as ações das linhas permanecem visíveis.

- **AI gateways — Time zone and culture for the shell.** As opções do shell do gateway aceitam `timeZone`, um fuso horário IANA como `America/Sao_Paulo`, e `culture`, como `pt-BR`. O comando `date` usa o fuso horário para sua saída e para datas sem deslocamento explícito, e usa a cultura para nomes de dia e mês. Os padrões permanecem UTC e cultura invariável; `date -u` sempre imprime UTC.

- **RAG — Document filters for semantic search and answer generation.** Os endpoints de busca semântica e geração de respostas aceitam um campo opcional `filter` que restringe a busca a documentos que correspondam a condições de nome, conteúdo, tags, datas de criação e atualização ou metadados, como `tags has "finance" and createdAt >= now-30d`. O campo aceita uma string ou um array de strings combinadas com `and`. Os filtros são aplicados antes que os termos de busca sejam incorporados; quando nenhum documento corresponde, a requisição devolve um resultado vazio sem custos de incorporação ou busca. Filtros inválidos retornam `400 Bad Request` com a posição do erro. Filtros ainda não estão disponíveis no RAG de gateway ou no Collections MCP. Veja [Document Filters](https://docs.aivax.net/pt-br/docs/filters/document-filters.md).

- **RAG — Filters and visual results in the collection playground.** O playground de coleção tem uma seção Filters onde cada linha é um filtro de documento; todas as linhas devem corresponder e são enviadas como o array `filter`. Resultados podem ser visualizados como Visual, mostrando a resposta gerada e cada documento com sua pontuação, metadados e documentos referenciados, ou como JSON bruto. O playground agora usa o reranker `rrf` por padrão; ainda é possível escolher outro reranker.

## Sábado, 3 de outubro de 2026

Mudanças:

- **Documentation — Updated reading and search experience.** A documentação adiciona busca específica por idioma, temas claro e escuro, navegação móvel e um menu de página para visualizar ou copiar Markdown. Agentes de IA podem usar o índice de documentação e arquivos de texto completo. URLs de documentação existentes continuam resolvendo; alguns guias mais antigos redirecionam para a documentação atual do produto.

## Sexta-feira, 2 de outubro de 2026

Mudanças:

- **Models — Claude Sonnet 5.5 and GPT-6.1 Sol added.** Adiciona `@anthropic/claude-5.5-sonnet` (Claude Sonnet 5.5), sucessor direto do Claude Sonnet 5, e `@openai/gpt-6.1-sol` (GPT‑6.1 Sol), uma atualização do GPT‑6 Sol, ao catálogo de modelos de texto. Ambos suportam pensamento, entrada de imagem e arquivo e chamada de ferramenta; GPT‑6.1 Sol também suporta saída estruturada. Os aliases `@model-router/claude:mid` e `@model-router/openai:mid` agora selecionam Claude Sonnet 5.5 e GPT‑6.1 Sol, substituindo Claude Sonnet 5 e GPT‑6 Sol, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Quinta-feira, 1 de outubro de 2026

Mudanças que quebram compatibilidade:

- **API — Error status codes reflect the failure source.** Falhas não são mais todas retornadas como `400 Bad Request` pelos endpoints de conta, RAG, web e geração. Requisições inválidas ainda retornam `400`, e falhas de autenticação, saldo e permissão que antes surgiam como `400` agora retornam `401`, `402` ou `403`. Falhas inesperadas da AIVAX retornam `500 Internal Server Error` com mensagem genérica, e serviços externos indisponíveis, incluindo provedores de modelo, retornam `503 Service Unavailable` com cabeçalho `Retry-After`. Em endpoints compatíveis com OpenAI, o código de erro agora é `invalid_request_error`, `service_unavailable` ou `server_error` em vez de sempre `server_error`. Clientes que tratam toda resposta não‑2xx como erro de requisição devem tentar novamente respostas `500` e `503`, obedecendo `Retry-After`. Veja [Troubleshoot the first request](https://docs.aivax.net/pt-br/docs/getting-started.md#troubleshoot-the-first-request).

Correções:

- **Chat completions — Malformed tool declarations rejected as invalid requests.** Requisições cujas entradas `tools` têm campos ausentes ou tipados incorretamente agora retornam `400 Bad Request` em vez de erro de servidor.

- **Gateways — Bash tool reports invalid options to the model.** Opções ou valores desconhecidos que não correspondem aos parâmetros de uma ferramenta agora retornam um erro de comando que o modelo pode corrigir, em vez de falhar a chamada da ferramenta.

Mudanças:

- **MCP utilities — Media generation MCP.** Um novo servidor MCP hospedado em `https://inference.aivax.net/v1/mcp/media-generation` expõe `list_models`, `generate_image` e `generate_speech` para clientes compatíveis com MCP. `list_models` aceita um `type` de `image` ou `audio`; imagens geradas e fala MP3 são devolvidas como URLs públicas. Use o cabeçalho opcional `X-Mcp-Enabled-Tools` para escolher quais ferramentas o cliente vê. Gerações usam a mesma precificação e limites das APIs de Geração de Imagem e Geração de Fala e requerem saldo positivo. Veja [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Segunda-feira, 28 de setembro de 2026

Correções:

- **Gateways — Bash tool help accepts nullable parameters.** Solicitar ajuda para ferramentas cujos parâmetros aceitam múltiplos tipos, incluindo `null`, não falha mais ao listar seus argumentos. A ajuda preserva os tipos aceitos e os caminhos de parâmetros aninhados. Nenhuma mudança no esquema da ferramenta é necessária.

- **Chat integrations — Failure notifications restored.** Conversas em streaming e não‑streaming novamente tentam enviar “System: something went wrong. Please, try again later.” após uma falha irrecuperável de geração, tentativas de recuperação esgotadas ou um turno que não envia mensagem. Uma falha final é relatada mesmo se uma resposta parcial anterior foi entregue. A entrega de notificações ainda depende da disponibilidade do serviço de mensagem.

Mudanças:

- **Gateways / MCP — Server instructions and remote skills.** Fontes MCP podem incluir instruções de servidor e documentos de skill raiz junto com ferramentas, incluindo fontes adicionadas por workers. Ambas as opções são habilitadas por padrão; defina `allowClientInstructions` ou `allowRemoteSkills` como `false` para excluir esse conteúdo. A descoberta de skill requer que o servidor remoto anuncie capacidades compatíveis; skills de conta permanecem disponíveis. O conteúdo de skill remoto é verificado quanto ao tamanho anunciado, digest e frontmatter. Skills dinâmicas, arquivos de suporte, scripts e servidores que exigem o protocolo de descoberta mais recente não são suportados. Veja [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md#server-instructions-and-remote-skills) para limites de compatibilidade e confiança.

- **Gateways — Time zone selection.** A configuração de data e hora atual agora oferece um menu suspenso de fusos horários agrupados por região, incluindo UTC. Fusos horários salvos permanecem preservados ao reabrir a configuração.

- **Models — Seven new text models.** Adiciona `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime` e `@fireworks/ember-1` como modelos de texto selecionáveis, cobrados por provedor nas taxas de token publicadas, com ajustes de conta e plano existentes ainda aplicáveis. Modelos Upstage e Fireworks agora exibem seus ícones de provedor em vez do fallback genérico. Identificadores de modelo existentes permanecem inalterados.

## Domingo, 27 de setembro de 2026

Mudanças:

- **Telegram — Compact tool progress.** Respostas em streaming mostram apenas o último preâmbulo de ferramenta no indicador de pensamento quando a visibilidade de chamada de ferramenta está habilitada, ao invés de acumular blocos de nomes de ferramenta na resposta. A resposta final não contém blocos de progresso de ferramenta. Outros canais de mensagem e respostas não‑streamed permanecem inalterados.

- **Gateways — Bash tool selection.** A lista de ferramentas Bash agora inclui um atalho para `get_date_time` (Current date and time). Listas de inclusão e exclusão aceitam padrões curinga sem diferenciação de maiúsculas/minúsculas: `*` corresponde a qualquer número de caracteres, como em `something_*`, e `?` corresponde a um caractere. Nomes de ferramenta exatos permanecem suportados.

- **Semantic decisions and Agentic Tests — Account rate limits.** Limites por minuto por conta aplicam‑se a requisições de decisão semântica e novas execuções de Testes Agenticos; avaliações manuais, agendadas e diretas compartilham o limite de execuções de teste. Requisições acima do limite retornam HTTP 429, enquanto testes agendados aguardam uma verificação de agendamento posterior. Clientes devem espaçar requisições e tentar novamente após o término da janela de limite de taxa. Limites de inferência existentes ainda se aplicam. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-and-agentic-test-rate-limits), [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md#account-rate-limits) e [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#run-and-inspect-a-test).

- **Models — Consistent speech synthesis prices.** Preços do catálogo de texto‑para‑fala agora derivam das mesmas taxas por caractere usadas para calcular o uso de síntese, exibidos por 1 000 caracteres. Identificadores de modelo e taxas de cobrança permanecem inalterados.

- **Models — Comparable transcription prices.** Preços de modelos de fala‑para‑texto são exibidos de forma consistente em USD por minuto, convertendo taxas horárias e por segundo para comparação sem alterar taxas de cobrança ou medição de duração.

- **Image generation — Fixed output and reference prices.** Geração de imagem usa um preço fixo por saída entregue mais um preço por referência para cada saída. Modelos cujos provedores cobram por tokens ou megapixels agora utilizam estimativas arredondadas ao invés de cobranças de token metered. O processamento de prompt está incluído na estimativa de saída; modelos sem cobrança de referência separada listam taxa de referência zero. Estes são tarifas fixas, não recibos do consumo real do provedor. Cobranças de imagem não incluem mais a marcação de geração de imagem da AIVAX nem multiplicadores de preço de conta e plano. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Models — Subscription coverage.** A página Models agora inclui uma coluna “Subscription Usage” para rerankers e modelos de decisão semântica. “Included” identifica modelos elegíveis às cotas diárias do plano; “Excluded” identifica modelos sem cobertura. Elegibilidade não indica a cota restante da conta. Ambos os catálogos de serviço expõem essa elegibilidade como `subscriptionUsage`.

- **Subscriptions — Included daily usage allowances.** Assinaturas Free, Pro e Max incluem cotas diárias separadas para busca RAG e inserção de embeddings, entrada Reflex (incluindo entrada em cache) e decisões semânticas Julia‑1. Cada item medido é totalmente incluído ou cobrado nas taxas normais; uma requisição com múltiplos itens pode combinar uso incluído e pago. Isso também se aplica à extração OCR, substituindo cobertura parcial. Itens incluídos aparecem no consumo da assinatura sem entradas de histórico de cobrança de custo zero; indicadores de uso podem exceder a cota base dentro da margem permitida. Itens não cobertos mantêm registros de cobrança normais. `includesSubscriptionModels` é falso enquanto assinaturas de inferência estão desativadas; cobertura de assinatura LLM permanece desativada. O limite diário de tempo de processamento do Reflex permanece separado, e contas revendedoras não recebem cotas de assinatura. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

## Sábado, 26 de setembro de 2026

Mudanças que quebram compatibilidade:

- **Image generation — Deprecated models removed.** Remove `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL` e `Meina-Mix` dos modelos disponíveis. Requisições de API diretas usando esses identificadores agora falham; selecione um modelo ativo em vez disso. A geração de imagem embutida usa `flux-schnell` quando nenhum modelo válido está configurado, substituindo o padrão depreciado `AbsoluteReality`. Revise configurações salvas; estilo de saída e preços diferem.

Mudanças:

- **Image generation — Additional Pollinations models.** Adiciona 16 modelos oficiais de imagens raster, incluindo variantes FLUX 1.1 Pro e FLUX 2, variantes MAI Image, GPT Image 2.5 Flare e Sunburst, Qwen Image 2.1 e 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM e Seedream 5 Pro, com pré‑visualizações geradas por modelo no seletor de imagens. Modelos da comunidade e SVG são excluídos. O catálogo exibe as unidades de cobrança. Veja a entrada de 27 de setembro para a mudança subsequente de cobrança fixa. Gerações que falham não são contadas como imagens entregues. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Models — Service model catalogs.** A página Models agora inclui tabelas para geração de imagem, fala‑para‑texto, texto‑para‑fala, reranking e decisões semânticas, com descrições fornecidas pelo backend, datas de lançamento, preço base em USD com unidades de cobrança e um menu de Ações em cada tabela de modelo de serviço para copiar nomes de modelo e abrir documentação de integração. Nomes de modelo mostram um rótulo amigável quando disponível enquanto copiam o identificador aceito pela API. A precificação usa unidades compactas de input, cached‑input, output, image, character e duration separadas por setas quando aplicável, com taxas completas e unidades disponíveis no tooltip. Catálogos são ordenados do mais recente ao mais antigo. Datas e nomes amigáveis do catálogo OpenRouter complementam metadados de lançamento ausentes; datas de catálogo são rotuladas explicitamente ao invés de apresentadas como datas de lançamento do fabricante. Modelos sem nenhuma data permanecem por último. Requisições de catálogo falhas podem ser tentadas novamente de forma independente. Os catálogos de informações públicas expõem esses detalhes, incluindo o novo catálogo `GET /api/v1/information/speech-models.json`. Ajustes de preço de conta e plano ainda se aplicam. Veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md).

- **Privacy — Judicial disclosure and retention clarified.** A [Privacy Policy](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md) e os [Terms of Use](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md) especificam ordens judiciais brasileiras para divulgação, solicitações estrangeiras para preservar logs existentes por até 1 ano e até 1 ano de logs técnicos e metadados. Clarificam que o conteúdo da conversa é coletado apenas quando Conversas está habilitado para a requisição ou conta, e que recursos de conta disponíveis e backups de até 3 meses podem ser divulgados sob ordem judicial brasileira. A licença de conteúdo nos Termos está expressamente sujeita a esses limites.

- **Generations — Additional decision models.** O guia de [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) explica tipos de perguntas e interpretação de respostas. O endpoint público `GET /api/v1/information/decisions-models.json` lista nomes canônicos, aliases, tipos de perguntas suportados, comprimentos de contexto, datas de lançamento e preços base por token. Adiciona `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b` e `@supersonic-labs/julia-1` como opções de modelo para decisões semânticas. Julia‑1 suporta `choice`, `score` e `noul`; seu uso de entrada inclui o estado repetido para cada pergunta. Ajustes de preço de conta e plano existentes se aplicam, e identificadores de modelo e formatos de requisição permanecem inalterados. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-model-limits) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md#semantic-decisions) para limites e taxas atuais.

## Terça-feira, 22 de setembro de 2026

Mudanças:

- **Models — GPT-6 Sol and Luna added.** Adiciona `@openai/gpt-6-sol` e `@openai/gpt-6-luna`, incluindo suas variantes de raciocínio `:pro`. Os aliases `@model-router/openai:mid` e `@model-router/openai:budget` agora selecionam GPT‑6 Sol e GPT‑6 Luna, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Segunda-feira, 21 de setembro de 2026

Mudanças que quebram compatibilidade:

- **Gateways — Off-topic moderation is being removed.** O limite dedicado a off‑topic não bloqueará mais requisições que se desviem do propósito da conversa. Se sua aplicação depende dessa verificação, revise suas restrições de tópico antes de adotar esta mudança; as categorias de moderação restantes não são um substituto equivalente.

- **Built-in tools — Advanced web research is being disabled.** A ferramenta `AdvancedWebUsage` retornará uma resposta indisponível ao invés de realizar a pesquisa. Remova a dependência dessa ferramenta das instruções e fluxos de trabalho do gateway. A [Web Search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) padrão e a extração de URL permanecem alternativas separadas, não substitutos equivalentes para pesquisa em múltiplas etapas.

- **Models — Mercury 2.5 model identifier changed.** Substitua `@inception/mercury-2.5-preview` por `@inception/mercury-2.5` em requisições e configurações de gateway. O identificador de pré‑visualização não está mais listado, e o substituto não está mais marcado como pré‑visualização.

- **Gateways / MCP — MCP tool names are source-qualified.** Ferramentas de fontes MCP diferentes não compartilham mais um nome não qualificado no gateway. Revise instruções do gateway, regras de seleção de ferramentas e workers que correspondem a nomes de ferramenta exatos. O nome original da ferramenta no servidor MCP conectado permanece inalterado. Veja [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

Correções:

- **Collections, Gateways, and Generations — Service model availability.** Geração de respostas de coleção, roteamento de gateway, utilitários de chat e serviços de processamento de mídia evitam selecionar modelos temporariamente indisponíveis. Teach Skill e pré‑processamento multimodal podem tentar outro modelo disponível após uma falha recuperável; o sucesso ainda depende da disponibilidade do serviço.

- **Teach Skill — Usage calculation.** Cobranças de processamento do Teach Skill usam a precificação do modelo associada à requisição concluída, inclusive quando uma tentativa de nova tentativa altera o modelo usado. Veja [Teach Skill](https://docs.aivax.net/pt-br/docs/generations/teach-skill.md) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Fetch and OCR — More reliable page extraction.** Requisições de conteúdo de página canceladas ou expiradas não deixam mais a extração de página em execução indefinidamente. Isso resolve casos onde a extração de conteúdo web poderia travar.

- **Chat clients — Final reply and message history.** `completionText` agora seleciona a resposta final gerada pelo assistente ao invés de combinar com texto de assistente anterior durante o uso de ferramentas. O campo de resposta `createdMessages` adicionado preserva mensagens recém‑geradas em ordem, incluindo interações de ferramenta; mensagens enviadas não são repetidas. Use este campo quando precisar do turno completo gerado.

- **Gateways / MCP — Structured MCP results are retained.** Assistentes recebem conteúdo de resultado estruturado além dos blocos de conteúdo suportados, evitando perda de informação quando uma ferramenta MCP retorna saída estruturada.

- **Fetch and OCR — X post extraction.** Melhorada a extração de texto legível de links de postagens públicas do X. Disponibilidade de conteúdo e restrições de acesso ainda se aplicam.

- **Fetch and OCR — Plain-text normalization changed.** Conversão para texto simples não colapsa mais espaços internos nem normaliza caracteres Unicode. Espaços circundantes ainda podem ser aparados nos resultados de extração. Aplicações que comparam texto extraído exatamente ou requerem espaçamento normalizado devem realizar essa normalização por conta própria.

Mudanças:

- **Fetch and OCR — Optional structured extraction.** Forneça `responseSchema` para converter o conteúdo extraído em JSON. Resultados adicionam `extractedObject` e `jsonProcessingUnits` mantendo `extractedText` em caso de sucesso. Sem um esquema, os novos campos são nulos e zero respectivamente. Conversão para JSON é cobrada separadamente da extração e não está coberta pela cota diária de extração. Veja [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).

- **Generations — Semantic decisions.** Avalie múltiplas perguntas nomeadas contra um estado JSON compartilhado usando `noul` (critério verdadeiro/falso), `choice` ou `score`. Respostas incluem respostas nomeadas, uso de tokens e custo. O serviço requer saldo positivo, e seu uso de tokens contribui para os totais de uso da conta.

- **Built-in tools — Current date and time.** A opção `DateTime` permite que assistentes solicitem a data, hora, dia da semana, fuso horário e deslocamento UTC atuais. Defina `dateTimeTimeZone` para o fuso horário desejado; o padrão é `America/Los_Angeles`, com ajustes de horário de verão, independente do fuso horário do navegador. Fusos horários inválidos são rejeitados.

- **Models — Additional model choices.** Adiciona GLM‑5.3‑FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo‑V2.6‑Pro, MiMo‑V2.6‑Flash, MiMo‑V2.6‑Pro‑UltraSpeed e Grok 4.7 ao catálogo de inferência. Os aliases frontier, mid e budget da Xiaomi agora selecionam modelos MiMo V2.6, enquanto `@model-router/grok:latest` seleciona Grok 4.7. Usuários de alias podem observar diferentes qualidade de resposta, latência e custo; disponibilidade e capacidades suportadas dependem do modelo selecionado e do plano da conta.

- **Inference — Transient-failure recovery.** Requisições de inferência podem fazer tentativas de recuperação adicionais quando um provedor está temporariamente indisponível. Isso pode evitar algumas requisições falhas, mas também pode aumentar o tempo de resposta antes que um erro seja retornado.

- **Avi Assistant — Updated default model.** O assistente de console da AIVAX altera seu modelo padrão, o que pode mudar o estilo da resposta, latência e custo de uso. Isso não altera o modelo selecionado em seus próprios gateways.

- **Documentation — Updated service guidance.** A visão geral da documentação da API e a orientação do Avi Assistant cobrem sessões de voz, testes agenticos, classificação, segmentação, reranking e extração web, com links de documentação atuais e orientações de cobrança específicas por serviço. Esta é uma atualização de orientação, não a introdução desses serviços.

- **Models — DeepSeek V4.1 Flash added.** O catálogo de inferência inclui `@deepseek/deepseek-v4.1-flash` com suporte a chamada de ferramenta. Verifique disponibilidade de modelo e elegibilidade de plano antes de selecioná‑lo.

- **Models — Router selections updated.** `@model-router/deepseek:latest` e `@model-router/deepseek:budget` agora selecionam DeepSeek V4.1 Flash. Aplicações que usam esses aliases podem observar diferentes qualidade de resposta, latência e custo sem mudar o alias. Adiciona `@model-router/claude:frontier-mythos` e `@model-router/mercury:latest` como opções adicionais.

- **Chat clients — Structured prompt input.** Prompts síncronos de cliente de chat aceitam texto simples, uma única mensagem ou um array ordenado de mensagens, incluindo chamadas de ferramenta do assistente e resultados de ferramenta correspondentes. Entrada de mensagem única existente permanece suportada. `instructions` opcional adiciona contexto para aquela requisição sem substituir o contexto da sessão salvo. Veja [Chat clients](https://docs.aivax.net/pt-br/docs/features/chat-clients.md).

- **Chat clients — Turns without session persistence.** Defina `commit` como false para gerar uma resposta sem salvar as mensagens enviadas e geradas no histórico da sessão. O padrão permanece true. Isso não é uma pré‑visualização gratuita: inferência e ações de ferramenta ainda são executadas. Para continuar uma interação de ferramenta não confirmada, envie a mensagem de chamada de ferramenta do assistente juntamente com seus resultados de ferramenta.

- **Agentic Tests — Optional testing notifications.** Preferências de notificação de conta podem habilitar resumos semanais de teste e alertas quando um teste atinge três falhas consecutivas. Isso complementa notificações de falha e recuperação existentes. Veja [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

- **Fetch and OCR — Rendered web content.** Extração HTML suporta conteúdo de página renderizado, melhorando a cobertura de páginas cujo texto legível depende de scripts. Renderização é cobrada em unidades de processamento; isso não garante acesso a todos os sites ou páginas restritas. Veja [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).
