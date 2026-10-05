Source: https://docs.aivax.net/pt-br/docs/changelogs.html

# Registro de alterações

Alterações técnicas que afetam produtos, serviços ou a API pública da AIVAX. As datas identificam quando as entradas foram adicionadas ou atualizadas, não datas confirmadas de implantação em produção. Cada item identifica o produto ou serviço afetado; manutenção sem efeito visível ao usuário é omitida.

## Segunda‑feira, 5 de outubro de 2026

Correções:

- **Collections — Desduplicação não pára mais antes de remover documentos.** Uma tarefa de desduplicação que encontrava documentos duplicados podia parar sem remover nenhum documento e sem criar arquivos de backup, porque a gravação do backup dos documentos removidos falhava. Essas tarefas agora salvam os arquivos de backup, removem os duplicados e incluem os links de download na notificação de conclusão. Tarefas que pararam desse modo não removeram nenhum documento; inicie uma nova tarefa para tentar novamente.

Alterações:

- **RAG — Filtros de documento para busca semântica e geração de respostas.** Os endpoints de busca semântica e geração de respostas aceitam um campo opcional `filter` que restringe a busca a documentos que atendam a condições sobre nome, conteúdo, tags, datas de criação e atualização ou metadados, como `tags has "finance" and createdAt >= now-30d`. O campo aceita uma string ou um array de strings combinadas com `and`. Os filtros são aplicados antes que os termos de busca sejam incorporados; quando nenhum documento corresponde, a solicitação retorna um resultado vazio sem custos de incorporação ou busca. Filtros inválidos retornam `400 Bad Request` com a posição do erro. Filtros ainda não estão disponíveis no AI gateway RAG ou no Collections MCP. Veja [Document Filters](https://docs.aivax.net/pt-br/docs/filters/document-filters.md).

## Sábado, 3 de outubro de 2026

Alterações:

- **Documentation — Experiência de leitura e busca aprimorada.** A documentação adiciona busca por idioma, temas claro e escuro, navegação móvel e um menu de página para visualização ou cópia de Markdown. Agentes de IA podem usar o índice de documentação e arquivos de texto completo. URLs de documentação existentes continuam resolvendo; alguns guias antigos redirecionam para a documentação atual do produto.

## Sexta‑feira, 2 de outubro de 2026

Alterações:

- **Models — Claude Sonnet 5.5 e GPT‑6.1 Sol adicionados.** Adiciona `@anthropic/claude-5.5-sonnet` (Claude Sonnet 5.5), sucessor direto do Claude Sonnet 5, e `@openai/gpt-6.1-sol` (GPT‑6.1 Sol), uma atualização do GPT‑6 Sol, ao catálogo de modelos de texto. Ambos suportam pensamento, entrada de imagem e arquivo, e chamada de ferramentas; o GPT‑6.1 Sol também suporta saída estruturada. Os aliases `@model-router/claude:mid` e `@model-router/openai:mid` agora selecionam Claude Sonnet 5.5 e GPT‑6.1 Sol, substituindo Claude Sonnet 5 e GPT‑6 Sol, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Quinta‑feira, 1 de outubro de 2026

Alterações críticas:

- **API — Códigos de status de erro refletem a origem da falha.** As falhas não são mais todas retornadas como `400 Bad Request` pelos endpoints de conta, RAG, web e geração. Solicitações inválidas ainda retornam `400`, e falhas de autenticação, saldo e permissão que antes surgiam como `400` agora retornam `401`, `402` ou `403`. Falhas inesperadas da AIVAX retornam `500 Internal Server Error` com mensagem genérica, e serviços externos indisponíveis, incluindo provedores de modelo, retornam `503 Service Unavailable` com cabeçalho `Retry-After`. Em endpoints compatíveis com OpenAI, o campo `code` de erro agora é `invalid_request_error`, `service_unavailable` ou `server_error` ao invés de sempre `server_error`. Clientes que tratam toda resposta não‑2xx como erro de solicitação devem tentar novamente em respostas `500` e `503`, respeitando `Retry-After`. Veja [Troubleshoot the first request](https://docs.aivax.net/pt-br/docs/getting-started.md#troubleshoot-the-first-request).

Correções:

- **Chat completions — Declarações de ferramenta malformadas rejeitadas como solicitações inválidas.** Solicitações cujas entradas `tools` tenham campos ausentes ou tipados incorretamente agora retornam `400 Bad Request` ao invés de erro de servidor.

- **Gateways — Ferramenta Bash relata opções inválidas ao modelo.** Opções ou valores desconhecidos que não correspondem aos parâmetros de uma ferramenta agora retornam um erro de comando que o modelo pode corrigir, ao invés de falhar a chamada da ferramenta.

Alterações:

- **Utilitários MCP — MCP de geração de mídia.** Um novo servidor MCP hospedado em `https://inference.aivax.net/v1/mcp/media-generation` expõe `list_models`, `generate_image` e `generate_speech` para clientes compatíveis com MCP. `list_models` aceita um `type` de `image` ou `audio`; imagens geradas e fala em MP3 são retornadas como URLs públicas. Use o cabeçalho opcional `X-Mcp-Enabled-Tools` para escolher quais ferramentas o cliente vê. Gerações usam a mesma precificação e limites das APIs de Geração de Imagem e Geração de Fala e exigem saldo positivo. Veja [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md).

## Segunda‑feira, 28 de setembro de 2026

Correções:

- **Gateways — Ajuda da ferramenta Bash aceita parâmetros nulos.** Solicitar ajuda para ferramentas cujos parâmetros aceitam múltiplos tipos, incluindo `null`, não falha mais ao listar seus argumentos. A ajuda preserva os tipos aceitos e os caminhos de parâmetros aninhados. Não são necessárias alterações no esquema da ferramenta.

- **Integrações de chat — Notificações de falha restauradas.** Conversas em streaming e sem streaming novamente tentam enviar “System: something went wrong. Please, try again later.” após uma falha de geração irrecuperável, tentativas de recuperação esgotadas ou um turno que não envia mensagem. Uma falha final é relatada mesmo se uma resposta parcial anterior foi entregue. A entrega da notificação ainda depende da disponibilidade do serviço de mensagens.

Alterações:

- **Gateways / MCP — Instruções de servidor e habilidades remotas.** Fontes MCP podem incluir instruções de servidor e documentos de habilidade raiz ao lado de ferramentas, incluindo fontes adicionadas por trabalhadores. Ambas as opções são ativadas por padrão; defina `allowClientInstructions` ou `allowRemoteSkills` como `false` para excluir esse conteúdo. A descoberta de habilidades requer que o servidor remoto anuncie capacidades compatíveis; habilidades de conta permanecem disponíveis. O conteúdo de habilidade remota é verificado contra seu tamanho, digest e frontmatter anunciados. Habilidades dinâmicas, arquivos de suporte, scripts e servidores que exigem o protocolo de descoberta mais recente não são suportados. Veja [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md#server-instructions-and-remote-skills) para compatibilidade e limites de confiança.

- **Gateways — Seleção de fuso horário.** A configuração de data e hora atual agora oferece um menu suspenso de fusos horários agrupados por região, incluindo UTC. Fusos horários salvos previamente são preservados ao reabrir a configuração.

- **Models — Sete novos modelos de texto.** Adiciona `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime` e `@fireworks/ember-1` como modelos de texto selecionáveis, cobrados por provedor nas taxas de token publicadas, com ajustes de conta e plano existentes ainda aplicáveis. Modelos Upstage e Fireworks agora exibem seus ícones de provedor ao invés do fallback genérico. Identificadores de modelo existentes permanecem inalterados.

## Domingo, 27 de setembro de 2026

Alterações:

- **Telegram — Progresso de ferramenta compacto.** Respostas em streaming mostram apenas o último preâmbulo de ferramenta no indicador de pensamento quando a visibilidade de chamada de ferramenta está habilitada, ao invés de acumular blocos de nomes de ferramenta na resposta. A resposta final não contém blocos de progresso de ferramenta. Outros canais de mensagens e respostas sem streaming permanecem inalterados.

- **Gateways — Seleção de ferramenta Bash.** A lista de ferramentas Bash agora inclui um atalho para `get_date_time` (Data e hora atuais). Listas de inclusão e exclusão aceitam padrões coringa sem diferenciação de maiúsculas/minúsculas: `*` corresponde a qualquer número de caracteres, como em `something_*`, e `?` corresponde a um caractere. Nomes de ferramenta exatos continuam suportados.

- **Decisões semânticas e Testes de Agente — Limites de taxa por conta.** Limites por minuto por conta aplicam‑se a solicitações de decisão semântica e novas execuções de Testes de Agente; avaliações manuais, agendadas e diretas compartilham o limite de execuções de teste. Solicitações acima do limite retornam HTTP 429, enquanto testes agendados aguardam a próxima verificação de agendamento. Clientes devem espaçar solicitações e tentar novamente após o período de limite de taxa. Limites de inferência existentes ainda se aplicam. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-and-agentic-test-rate-limits), [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md#account-rate-limits) e [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#run-and-inspect-a-test).

- **Models — Preços consistentes de síntese de fala.** Os preços do catálogo de texto‑para‑fala agora derivam das mesmas taxas por caractere usadas para calcular o uso de síntese, exibidos por 1 000 caracteres. Identificadores de modelo e taxas de faturamento permanecem inalterados.

- **Models — Preços comparáveis de transcrição.** Os preços dos modelos de fala‑para‑texto são exibidos de forma consistente em USD por minuto, convertendo taxas horárias e por segundo para comparação sem alterar taxas de faturamento ou medição de duração.

- **Geração de imagem — Preço fixo de saída e referência.** A geração de imagem usa um preço fixo por saída entregue mais um preço por referência para cada saída. Modelos cujos provedores cobram por tokens ou megapixels agora utilizam estimativas arredondadas ao invés de cobranças de token mediadas. O processamento do prompt está incluído na estimativa de saída; modelos sem taxa de referência separada listam taxa de referência zero. Estas são tarifas fixas, não recibos do consumo real do provedor. As cobranças de imagem não incluem mais a margem de geração de imagem da AIVAX nem os multiplicadores de preço de conta e plano. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Models — Cobertura de assinatura.** A página Models agora inclui uma coluna “Subscription Usage” para rerankers e modelos de decisão semântica. “Included” identifica modelos elegíveis para limites diários do plano; “Excluded” identifica modelos sem cobertura. Elegibilidade não indica o limite restante da conta. Ambos os catálogos de serviço expõem essa elegibilidade como `subscriptionUsage`.

- **Subscriptions — Limites de uso diário incluídos.** Assinaturas Free, Pro e Max incluem limites diários separados para busca RAG e incorporações de inserção, entrada Reflex (incluindo entrada em cache) e decisões semânticas Julia‑1. Cada item medido é totalmente incluído ou cobrado nas taxas normais; uma solicitação com múltiplos itens pode combinar uso incluído e pago. Isso também se aplica à extração OCR, substituindo cobertura parcial. Itens incluídos aparecem no consumo da assinatura sem entradas de histórico de faturamento de custo zero; indicadores de uso podem exceder o limite base dentro da margem permitida. Itens não cobertos mantêm registros de faturamento normais. `includesSubscriptionModels` é falso enquanto assinaturas de inferência estão desativadas; a cobertura de assinatura LLM permanece desativada. O teto de tempo de processamento diário do Reflex continua separado, e contas de revendedor não recebem limites de assinatura. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

## Sábado, 26 de setembro de 2026

Alterações críticas:

- **Geração de imagem — Modelos depreciados removidos.** Remove `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL` e `Meina-Mix` dos modelos disponíveis. Solicitações de API diretas usando esses identificadores agora falham; selecione um modelo ativo. Geração de imagem embutida usa `flux-schnell` quando nenhum modelo válido está configurado, substituindo o padrão depreciado `AbsoluteReality`. Revise configurações salvas; estilo de saída e preços diferem.

Alterações:

- **Geração de imagem — Modelos adicionais Pollinations.** Adiciona 16 modelos oficiais de imagem raster, incluindo FLUX 1.1 Pro e variantes FLUX 2, variantes MAI Image, GPT Image 2.5 Flare e Sunburst, Qwen Image 2.1 e 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM e Seedream 5 Pro, com pré‑visualizações geradas por modelo no seletor de imagem. Modelos da comunidade e SVG são excluídos. O catálogo exibe as unidades de faturamento. Veja a entrada de 27 de setembro para a mudança subsequente de faturamento de preço fixo. Gerações falhas não são contadas como imagens entregues. Veja [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Models — Catálogos de modelo de serviço.** A página Models agora inclui tabelas para geração de imagem, fala‑para‑texto, texto‑para‑fala, reranking e decisões semânticas, com descrições fornecidas pelo backend, datas de lançamento, preços base em USD com unidades de faturamento e um menu de Ações em cada tabela de modelo de serviço para copiar nomes de modelo e abrir documentação de integração. Nomes de modelo mostram um rótulo amigável quando disponível ao copiar o identificador aceito pela API. A precificação usa unidades compactas de entrada, entrada em cache, saída, imagem, caractere e duração separadas por setas quando aplicável, com taxas completas e unidades disponíveis na dica de ferramenta. Catálogos são ordenados do mais recente ao mais antigo. Datas de catálogo OpenRouter e nomes amigáveis complementam metadados de lançamento ausentes; datas de catálogo são rotuladas explicitamente ao invés de apresentadas como datas de lançamento do fabricante. Modelos sem data permanecem no final. Solicitações de catálogo falhas podem ser repetidas independentemente. Os catálogos de informações públicas expõem esses detalhes, incluindo o novo catálogo `GET /api/v1/information/speech-models.json`. Ajustes de preço de conta e plano ainda se aplicam. Veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md).

- **Privacidade — Divulgação judicial e retenção esclarecidas.** A [Privacy Policy](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md) e os [Terms of Use](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md) especificam ordens judiciais brasileiras para divulgação, solicitações estrangeiras para preservar logs existentes por até 1 ano e até 1 ano de logs técnicos e metadados. Clarificam que o conteúdo da conversa é coletado apenas quando Conversas está habilitado para a solicitação ou conta, e que recursos de conta disponíveis e backups de até 3 meses podem ser divulgados sob ordem judicial brasileira. A licença de conteúdo nos Termos está expressamente sujeita a esses limites.

- **Gerações — Modelos de decisão adicionais.** O guia [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) explica tipos de perguntas e interpretação de respostas. O endpoint público `GET /api/v1/information/decisions-models.json` lista nomes canônicos, aliases, tipos de pergunta suportados, comprimentos de contexto, datas de lançamento e preços base por token. Adiciona `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b` e `@supersonic-labs/julia-1` como opções de modelo para decisões semânticas. Julia‑1 suporta `choice`, `score` e `noul`; seu uso de entrada inclui o estado repetido para cada pergunta. Ajustes de preço de conta e plano existentes aplicam‑se, e identificadores de modelo e formatos de solicitação permanecem inalterados. Veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-model-limits) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md#semantic-decisions) para limites e taxas atuais.

## Terça‑feira, 22 de setembro de 2026

Alterações:

- **Models — GPT‑6 Sol e Luna adicionados.** Adiciona `@openai/gpt-6-sol` e `@openai/gpt-6-luna`, incluindo suas variantes de raciocínio `:pro`. Os aliases `@model-router/openai:mid` e `@model-router/openai:budget` agora selecionam GPT‑6 Sol e GPT‑6 Luna, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Segunda‑feira, 21 de setembro de 2026

Alterações críticas:

- **Gateways — Moderação fora de tópico está sendo removida.** O limiar dedicado fora de tópico deixará de bloquear solicitações que se desviam do propósito da conversa. Se sua aplicação depende dessa verificação, revise suas restrições de tópico antes de adotar a mudança; as categorias de moderação restantes não são um substituto equivalente.

- **Ferramentas embutidas — Pesquisa avançada na web está sendo desativada.** A ferramenta `AdvancedWebUsage` retornará uma resposta indisponível ao invés de realizar a pesquisa. Remova a dependência dessa ferramenta das instruções e fluxos de trabalho do gateway. A [Web Search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) padrão e a extração de URL permanecem alternativas separadas, não substitutos equivalentes para pesquisa em múltiplas etapas.

- **Models — Identificador do modelo Mercury 2.5 alterado.** Substitua `@inception/mercury-2.5-preview` por `@inception/mercury-2.5` em solicitações e configurações de gateway. O identificador de pré‑visualização não está mais listado, e o substituto não está mais marcado como pré‑visualização.

- **Gateways / MCP — Nomes de ferramenta MCP são qualificados por origem.** Ferramentas de diferentes fontes MCP não compartilham mais um nome não qualificado no gateway. Revise instruções de gateway, regras de seleção de ferramenta e trabalhadores que correspondam a nomes de ferramenta exatos. O nome original da ferramenta no servidor MCP conectado permanece inalterado. Veja [MCP functions](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

Correções:

- **Collections, Gateways e Generations — Disponibilidade de modelo de serviço.** Geração de resposta de coleção, roteamento de gateway, utilitários de chat e serviços de processamento de mídia evitam selecionar modelos temporariamente indisponíveis. O Skill Teach e pré‑processamento multimodal podem tentar outro modelo disponível após uma falha recuperável; o sucesso ainda depende da disponibilidade do serviço.

- **Teach Skill — Cálculo de uso.** As cobranças de processamento do Teach Skill usam a precificação do modelo associada à solicitação concluída, inclusive quando uma tentativa altera o modelo usado. Veja [Teach Skill](https://docs.aivax.net/pt-br/docs/generations/teach-skill.md) e [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Fetch and OCR — Extração de página mais confiável.** Solicitações de conteúdo de página canceladas ou expiradas não deixam a extração de página rodando indefinidamente. Isso resolve casos em que a extração de conteúdo web poderia travar.

- **Clientes de chat — Resposta final e histórico de mensagens.** `completionText` agora seleciona a resposta final gerada pelo assistente ao invés de combiná‑la com texto de assistente anterior durante o uso de ferramenta. O campo de resposta `createdMessages` adicionado preserva mensagens recém‑geradas em ordem, incluindo interações de ferramenta; mensagens enviadas não são repetidas. Use este campo quando precisar do turno completo gerado.

- **Gateways / MCP — Resultados estruturados de MCP são mantidos.** Assistentes recebem conteúdo de resultado estruturado além dos blocos de conteúdo suportados, evitando perda de informação quando uma ferramenta MCP retorna saída estruturada.

- **Fetch and OCR — Extração de post X.** Melhoria na extração de texto legível de links de posts públicos do X. Disponibilidade de conteúdo e restrições de acesso ainda se aplicam.

- **Fetch and OCR — Normalização de texto simples alterada.** A conversão para texto simples não colapsa mais espaços internos nem normaliza caracteres Unicode. Espaços ao redor ainda podem ser removidos nos resultados de extração. Aplicações que comparam texto extraído exatamente ou requerem espaçamento normalizado devem realizar essa normalização por conta própria.

Alterações:

- **Fetch and OCR — Extração estruturada opcional.** Forneça `responseSchema` para converter o conteúdo extraído em JSON. Resultados adicionam `extractedObject` e `jsonProcessingUnits` mantendo `extractedText` em caso de sucesso. Sem esquema, os novos campos são nulos e zero respectivamente. A conversão JSON é cobrada separadamente da extração e não está coberta pelo limite diário de extração. Veja [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).

- **Generations — Decisões semânticas.** Avalie múltiplas perguntas nomeadas contra um estado JSON compartilhado usando `noul` (critério verdadeiro/falso), `choice` ou `score`. Respostas incluem respostas nomeadas, uso de tokens e custo. O serviço requer saldo positivo, e seu uso de tokens contribui para os totais de uso da conta.

- **Ferramentas embutidas — Data e hora atuais.** A opção `DateTime` permite que assistentes solicitem a data, hora, dia da semana, fuso horário e deslocamento UTC atuais. Defina `dateTimeTimeZone` para o fuso horário desejado; o padrão é `America/Los_Angeles`, com ajustes de horário de verão, independente do fuso horário do navegador. Fusos horários inválidos são rejeitados.

- **Models — Opções de modelo adicionais.** Adiciona GLM-5.3-FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo-V2.6-Pro, MiMo-V2.6-Flash, MiMo-V2.6-Pro-UltraSpeed e Grok 4.7 ao catálogo de inferência. Os aliases frontier, mid e budget da Xiaomi agora selecionam modelos MiMo V2.6, enquanto `@model-router/grok:latest` seleciona Grok 4.7. Usuários de alias podem observar diferenças de qualidade de resposta, latência e custo; disponibilidade e capacidades suportadas dependem do modelo selecionado e do plano da conta.

- **Inference — Recuperação de falhas transitórias.** Solicitações de inferência podem fazer tentativas de recuperação adicionais quando um provedor está temporariamente indisponível. Isso pode evitar algumas solicitações falhas, mas também pode aumentar o tempo de resposta antes que um erro seja retornado.

- **Avi Assistant — Modelo padrão atualizado.** O assistente do console AIVAX altera seu modelo padrão, o que pode mudar o estilo de resposta, latência e custo de uso. Isso não altera o modelo selecionado em seus próprios gateways.

- **Documentation — Orientação de serviço atualizada.** A visão geral da documentação da API e a orientação do Avi Assistant cobrem sessões de voz, testes de agente, classificação, segmentação, reranking e extração web, com links de documentação atuais e orientação de faturamento específica por serviço. Esta é uma atualização de orientação, não a introdução desses serviços.

- **Models — DeepSeek V4.1 Flash adicionado.** O catálogo de inferência inclui `@deepseek/deepseek-v4.1-flash` com suporte a chamada de ferramentas. Verifique a disponibilidade do modelo e elegibilidade do plano antes de selecioná‑lo.

- **Models — Seletor de roteador atualizado.** `@model-router/deepseek:latest` e `@model-router/deepseek:budget` agora selecionam DeepSeek V4.1 Flash. Aplicações que usam esses aliases podem observar diferenças de qualidade de resposta, latência e custo sem mudar o alias. Adiciona `@model-router/claude:frontier-mythos` e `@model-router/mercury:latest` como opções adicionais.

- **Clientes de chat — Entrada de prompt estruturada.** Prompts síncronos de cliente de chat aceitam texto simples, uma única mensagem ou um array ordenado de mensagens, incluindo chamadas de ferramenta do assistente e resultados de ferramenta correspondentes. A entrada de mensagem única existente continua suportada. `instructions` opcional adiciona contexto para aquela solicitação sem substituir o contexto da sessão salva. Veja [Chat clients](https://docs.aivax.net/pt-br/docs/features/chat-clients.md).

- **Clientes de chat — Turnos sem persistência de sessão.** Defina `commit` como false para gerar uma resposta sem salvar as mensagens enviadas e geradas no histórico da sessão. O padrão permanece true. Isso não é uma pré‑visualização gratuita: inferência e ações de ferramenta ainda são executadas. Para continuar uma interação de ferramenta não confirmada, envie a mensagem de chamada de ferramenta do assistente junto com seus resultados de ferramenta.

- **Testes de Agente — Notificações de teste opcionais.** Preferências de notificação da conta podem habilitar resumos semanais de teste e alertas quando um teste atinge três falhas consecutivas. Estas complementam as notificações de falha e recuperação existentes. Veja [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

- **Fetch and OCR — Conteúdo web renderizado.** A extração de HTML suporta conteúdo de página renderizado, melhorando a cobertura de páginas cujo texto legível depende de scripts. A renderização é cobrada em unidades de processamento; isso não garante acesso a todos os sites ou páginas restritas. Veja [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).
