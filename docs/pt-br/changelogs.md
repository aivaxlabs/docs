# Registro de alterações

Alterações técnicas que afetam produtos, serviços ou a API pública da AIVAX. As datas identificam quando as entradas foram adicionadas ou atualizadas, não datas confirmadas de implantação em produção. Cada item identifica o produto ou serviço afetado; manutenção sem efeito visível ao usuário é omitida.

## Domingo, 27 de setembro de 2026

Alterações:

- **Decisões semânticas e Testes Agentes — Limites de taxa de conta.** Decisões semânticas permitem 10 solicitações por minuto no Free e 50 no Pro. Testes Agentes permitem 5 execuções novas por minuto no Free e 30 no Pro, compartilhadas entre execuções manuais, programadas e avaliações diretas. Max não tem limite imposto por plano para nenhuma das operações. Solicitações diretas acima desses limites retornam HTTP 429; testes programados aguardam uma verificação de agendamento posterior. Os clientes devem espaçar solicitações e tentar novamente após o término da janela de limite de taxa. Limites de inferência existentes ainda se aplicam. Veja [Planos e Limites](limits.md#semantic-decision-and-agentic-test-rate-limits), [Decisões semânticas](generations/decisions.md#account-rate-limits) e [Testes Agentes](inference/agentic-tests.md#run-and-inspect-a-test).

- **Modelos — Preços consistentes de síntese de fala.** Os preços do catálogo de texto‑para‑fala agora derivam das mesmas taxas por caractere usadas para calcular o uso de síntese, exibidos por 1 000 caracteres. Identificadores de modelo e taxas de faturamento permanecem inalterados.

- **Modelos — Preços comparáveis de transcrição.** Os preços dos modelos de fala‑para‑texto são exibidos de forma consistente em USD por minuto, convertendo taxas horárias e por segundo para comparação sem mudar as taxas de faturamento ou a medição de duração.

- **Geração de imagens — Preços fixos de saída e referência.** A geração de imagens usa um preço fixo por saída entregue mais um preço por referência para cada saída. Modelos cujos provedores cobram tokens ou megapixels agora usam estimativas arredondadas para cima em vez de cobranças de token medida. O processamento de prompt está incluído na estimativa de saída; modelos sem cobrança de referência separada listam taxa de referência zero. Estes são tarifas fixas, não recibos do consumo real do provedor. As cobranças de imagens não incluem mais a marcação de geração de imagens da AIVAX nem os multiplicadores de preço de conta e plano. Veja [Geração de imagens](generations/images.md).

- **Modelos — Cobertura por assinatura.** A página de Modelos agora inclui uma coluna “Uso de Assinatura” para rerankers e modelos de decisão semântica. “Incluído” identifica modelos elegíveis para as alocações diárias do plano; “-” identifica modelos sem cobertura. Elegibilidade não indica a alocação restante da conta. Ambos os catálogos de serviço expõem essa elegibilidade como `subscriptionUsage`.

- **Assinaturas — Alocações de uso diário incluídas.** Assinaturas Free, Pro e Max incluem cotas diárias para pesquisa RAG e inserção de embeddings, tokens de entrada Reflex (incluindo tokens de entrada em cache) e tokens de entrada de Decisores Semânticos usando apenas Julia‑1. Cada item de serviço medido é totalmente incluído se seu consumo cabe dentro da alocação mais uma margem de 10 %; caso contrário, o item inteiro é cobrado nas taxas normais sem consumir a alocação. Uma solicitação pode conter múltiplos itens, como embeddings de termos de consulta separados, e pode combinar uso incluído e pago. Essa regra tudo‑ou‑nada também se aplica à extração OCR, substituindo cobertura parcial. Itens de serviço cobertos aparecem no consumo da assinatura, sem criar entradas de histórico de faturamento de custo zero; itens descobertos mantêm registros de faturamento normais. A alocação Julia‑1 do plano Free é aumentada quatro vezes; o Pro agora inclui 2,5× a alocação de decisão do Free, e o Max inclui 2× o Pro. O uso pode mostrar mais de 100 % dentro da margem permitida. As informações de faturamento da conta agora derivam `includesSubscriptionModels` das alocações de inferência ativas, portanto, é falso enquanto as assinaturas de inferência estão desativadas. O limite diário de tempo de processamento do Reflex permanece um limite técnico separado; contas de revendedores não recebem alocações de assinatura. Comparações de planos na documentação e na página pública de preços mostram capacidade de alocação relativa em vez de unidades absolutas. A cobertura de assinatura LLM permanece desativada. Veja [Planos e Limites](limits.md).

## Sábado, 26 de setembro de 2026

Alterações críticas:

- **Geração de imagens — Modelos obsoletos removidos.** Remove `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL` e `Meina-Mix` dos modelos disponíveis. Solicitações de API diretas usando esses identificadores falham; selecione um modelo ativo. G. de imagens embutida usa `flux-schnell` quando nenhum modelo válido está configurado, substituindo o padrão obsoleto `AbsoluteReality`. Revise as configurações salvas; estilo de saída e preços diferem.

Alterações:

- **Geração de imagens — Modelos adicionais Pollinations.** Adiciona 16 modelos oficiais de imagens raster, incluindo FLUX 1.1 Pro e variantes FLUX 2, variantes MAI Image, GPT Image 2.5 Flare e Sunburst, Qwen Image 2.1 e 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM e Seedream 5 Pro, com pré‑visualizações geradas por modelo no seletor de imagens. Modelos comunitários e SVG são excluídos. O catálogo exibe as unidades de faturamento. Veja a entrada de 27 de setembro para a mudança subsequente de faturamento de preço fixo. Gerações falhas não são contadas como imagens entregues. Veja [Geração de imagens](generations/images.md).

- **Modelos — Catálogos de serviço de modelo.** A página de Modelos agora inclui tabelas para geração de imagens, fala‑para‑texto, texto‑para‑fala, reranking e decisões semânticas, com descrições fornecidas pelo backend, datas de lançamento, preço base em USD com unidades de faturamento e um menu suspenso de Ações em cada tabela de modelo de serviço para copiar nomes de modelo e abrir documentação de integração. Nomes de modelo mostram um rótulo amigável quando disponível ao copiar o identificador aceito pela API. A precificação usa unidades compactas de entrada, entrada em cache, saída, imagem, caractere e duração separadas por setas quando aplicável, com taxas completas e unidades disponíveis na dica de ferramenta. Os catálogos são ordenados do mais recente ao mais antigo. Datas de catálogo OpenRouter e nomes amigáveis complementam metadados de lançamento ausentes; datas de catálogo são rotuladas explicitamente em vez de apresentadas como datas de lançamento do fabricante. Modelos sem nenhuma das datas ficam por último. Solicitações de catálogo falhas podem ser repetidas independentemente. Os catálogos de informação pública expõem esses detalhes, incluindo o novo catálogo `GET /api/v1/information/speech-models.json`. Ajustes de preço de conta e plano ainda se aplicam. Veja [Preços](pricing.md) e [Decisões semânticas](generations/decisions.md).

- **Privacidade — Divulgação judicial e retenção esclarecidas.** A [Política de Privacidade](legal/privacy-policy.md) e os [Termos de Uso](legal/terms-of-service.md) especificam ordens judiciais brasileiras para divulgação, solicitações estrangeiras para preservar logs existentes por até 1 ano e até 1 ano de logs técnicos e metadados. Elas esclarecem que o conteúdo da conversa é coletado apenas quando Conversas está habilitado para a solicitação ou conta, e que recursos de conta disponíveis e backups de até 3 meses podem ser divulgados sob ordem judicial brasileira. A licença de conteúdo nos Termos está expressamente sujeita a esses limites.

- **Gerações — Modelos de decisão adicionais.** O novo [Guia de decisões semânticas](generations/decisions.md) explica tipos de perguntas, interpretação de respostas, preço do modelo e limites Julia‑1. O endpoint público `GET /api/v1/information/decções-models.json` lista nomes canônicos, aliases, tipos de perguntas suportados, comprimentos de contexto, datas de lançamento e preços base por token. Adiciona `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b` e `@supersonic-labs/julia-1` como opções de modelo para decisões semânticas. Julia‑1 suporta `choice`, `score` e `noul`, com um contexto combinado de 1 024 tokens por pergunta e 2‑20 opções ou níveis de pontuação. Seu preço base é $0,008 por milhão de tokens de entrada, sem cobrança de token de saída; ajustes de preço de conta e plano existentes ainda se aplicam. O uso de entrada inclui o estado repetido para cada pergunta. Identificadores de modelo e formatos de solicitação existentes permanecem inalterados.

## Terça‑feira, 22 de setembro de 2026

Alterações:

- **Modelos — GPT‑6 Sol e Luna adicionados.** Adiciona `@openai/gpt-6-sol` e `@openai/gpt-6-luna`, incluindo suas variantes de raciocínio `:pro`. Os aliases `@model-router/openai:mid` e `@model-router/openai:budget` agora selecionam GPT‑6 Sol e GPT‑6 Luna, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos permanecem inalterados.

## Segunda‑feira, 21 de setembro de 2026

Alterações críticas:

- **Gateways — Moderação fora do tópico está sendo removida.** O limite dedicado fora do tópico deixará de bloquear solicitações que se afastam do propósito da conversa. Se sua aplicação depende dessa verificação, revise suas restrições de tópico antes de adotar a mudança; as categorias de moderação restantes não são um substituto equivalente.

- **Ferramentas embutidas — Pesquisa avançada na web está sendo desativada.** A ferramenta `AdvancedWebUsage` retornará uma resposta indisponível em vez de realizar a pesquisa. Remova a dependência dessa ferramenta das instruções e fluxos de trabalho do gateway. A [Pesquisa na Web](web-foundation/web-search.md) padrão e a extração de URLs permanecem alternativas separadas, não substitutos equivalentes para pesquisa em múltiplas etapas.

- **Modelos — Identificador do modelo Mercury 2.5 alterado.** Substitua `@inception/mercury-2.5-preview` por `@inception/mercury-2.5` em solicitações e configurações de gateway. O identificador de pré‑visualização não está mais listado, e o substituto não está mais marcado como pré‑visualização.

- **Gateways / MCP — Nomes de ferramentas MCP são qualificados pela origem.** Ferramentas de diferentes fontes MCP não compartilham mais um nome não qualificado no gateway. Revise instruções de gateway, regras de seleção de ferramentas e workers que correspondam exatamente aos nomes das ferramentas. O nome original da ferramenta no servidor MCP conectado permanece inalterado. Veja [Funções MCP](tools/mcp.md).

Correções:

- **Coleções, Gateways e Gerações — Disponibilidade de modelo de serviço.** Geração de respostas de coleção, roteamento de gateway, utilitários de chat e serviços de processamento de mídia evitam selecionar modelos temporariamente indisponíveis. Teach Skill e pré‑processamento multimodal podem tentar outro modelo disponível após uma falha recuperável; o sucesso ainda depende da disponibilidade do serviço.

- **Teach Skill — Cálculo de uso.** As cobranças de processamento do Teach Skill usam a precificação do modelo associada à solicitação concluída, inclusive quando uma nova tentativa altera o modelo usado. Veja [Teach Skill](generations/teach-skill.md) e [Preços](pricing.md).

- **Fetch and OCR — Extração de página mais confiável.** Solicitações de conteúdo de página canceladas ou expiradas não deixam a extração de página rodando indefinidamente. Isso resolve casos em que a extração de conteúdo web poderia travar.

- **Clientes de chat — Resposta final e histórico de mensagens.** `completionText` agora seleciona a resposta final gerada pelo assistente em vez de combiná‑la com texto de assistente anterior durante o uso de ferramentas. O campo de resposta adicional `createdMessages` preserva mensagens recém‑geradas em ordem, incluindo interações de ferramentas; mensagens enviadas não são repetidas. Use esse campo quando precisar do turno completo gerado.

- **Gateways / MCP — Resultados estruturados MCP são retidos.** Assistentes recebem conteúdo de resultado estruturado além dos blocos de conteúdo suportados, evitando informações ausentes quando uma ferramenta MCP retorna saída estruturada.

- **Fetch and OCR — Extração de post X.** Melhoria na extração de texto legível de links de posts públicos do X. Disponibilidade de conteúdo e restrições de acesso ainda se aplicam.

- **Fetch and OCR — Normalização de texto simples alterada.** A conversão de texto simples não colapsa mais espaços internos nem normaliza caracteres Unicode. Espaços ao redor ainda podem ser aparados nos resultados de extração. Aplicações que comparam texto extraído exatamente ou que requerem espaçamento normalizado devem realizar essa normalização por conta própria.

Alterações:

- **Fetch and OCR — Extração estruturada opcional.** Forneça `responseSchema` para converter o conteúdo extraído em JSON. Os resultados adicionam `extractedObject` e `jsonProcessingUnits` enquanto mantêm `extractedText` em caso de sucesso. Sem um esquema, os novos campos são nulos e zero, respectivamente. A conversão JSON é cobrada separadamente da extração e não está coberta pela alocação diária de extração. Veja [Fetch and OCR](web-foundation/fetch-and-ocr.md).

- **Gerações — Decisões semânticas.** Avalie múltiplas perguntas nomeadas contra um estado JSON compartilhado usando `noul` (critérios verdadeiro/falso), `choice` ou `score`. As respostas incluem respostas nomeadas, uso de tokens e custo. O serviço requer saldo positivo, e seu uso de tokens contribui para os totais de uso da conta.

- **Ferramentas embutidas — Data e hora atuais.** A opção `DateTime` permite que assistentes solicitem a data atual, hora, dia da semana, fuso horário e deslocamento UTC. Defina `dateTimeTimeZone` para o fuso horário desejado; o padrão é `America/Los_Angeles`, com ajustes de horário de verão, independente do fuso horário do navegador. Fusos horários inválidos são rejeitados.

- **Modelos — Opções de modelo adicionais.** Adiciona GLM‑5.3‑FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo‑V2.6‑Pro, MiMo‑V2.6‑Flash, MiMo‑V2.6‑Pro‑UltraSpeed e Grok 4.7 ao catálogo de inferência. Os aliases frontier, mid e budget da Xiaomi agora selecionam modelos MiMo V2.6, enquanto `@model-router/grok:latest` seleciona Grok 4.7. Usuários de alias podem observar qualidade de resposta, latência e custo diferentes; disponibilidade e capacidades suportadas dependem do modelo selecionado e do plano da conta.

- **Inferência — Recuperação de falha transitória.** Solicitações de inferência podem fazer tentativas de recuperação adicionais quando um provedor está temporariamente indisponível. Isso pode evitar algumas solicitações falhas, mas também pode aumentar o tempo de resposta antes que um erro seja retornado.

- **Assistente Avi — Modelo padrão atualizado.** O assistente do console AIVAX altera seu modelo padrão, o que pode mudar o estilo da resposta, latência e custo de uso. Isso não altera o modelo selecionado nos seus próprios gateways.

- **Documentação — Orientação de serviço atualizada.** A visão geral da documentação da API e a orientação do Assistente Avi cobrem sessões de voz, testes agentes, classificação, segmentação, reranking e extração web, com links de documentação atuais e orientação de faturamento específica por serviço. Esta é uma atualização de orientação, não a introdução desses serviços.

- **Modelos — DeepSeek V4.1 Flash adicionado.** O catálogo de inferência inclui `@deepseek/deepseek-v4.1-flash` com suporte a chamada de ferramenta. Verifique a disponibilidade do modelo e elegibilidade do plano antes de selecioná‑lo.

- **Modelos — Seleções de roteador atualizadas.** `@model-router/deepseek:latest` e `@model-router/deepseek:budget` agora selecionam DeepSeek V4.1 Flash. Aplicações que usam esses aliases podem observar qualidade de resposta, latência e custo diferentes sem mudar o alias. Adiciona `@model-router/claude:frontier-mythos` e `@model-router/mercury:latest` como opções adicionais.

- **Clientes de chat — Entrada de prompt estruturada.** Prompts síncronos de cliente de chat aceitam texto simples, uma única mensagem ou um array ordenado de mensagens, incluindo chamadas de ferramenta do assistente e resultados de ferramenta correspondentes. A entrada de mensagem única existente permanece suportada. `instructions` opcional adiciona contexto para aquela solicitação sem substituir o contexto da sessão salva. Veja [Clientes de chat](features/chat-clients.md).

- **Clientes de chat — Turnos sem persistência de sessão.** Defina `commit` como false para gerar uma resposta sem salvar as mensagens enviadas e geradas no histórico da sessão. O padrão permanece true. Isso não é uma pré‑visualização gratuita: inferência e ações de ferramenta ainda são executadas. Para continuar uma interação de ferramenta não confirmada, envie a mensagem de chamada de ferramenta do assistente junto com seus resultados de ferramenta.

- **Testes Agentes — Notificações de teste opcionais.** Preferências de notificação da conta podem habilitar resumos semanais de teste e alertas quando um teste atinge três falhas consecutivas. Elas complementam as notificações de falha e recuperação existentes. Veja [Testes Agentes](inference/agentic-tests.md).

- **Fetch and OCR — Conteúdo web renderizado.** A extração de HTML suporta conteúdo de página renderizado, melhorando a cobertura de páginas cujo texto legível depende de scripts. A renderização é medida em unidades de processamento; isso não garante acesso a todos os sites ou páginas restritas. Veja [Fetch and OCR](web-foundation/fetch-and-ocr.md).