Source: https://docs.aivax.net/pt-br/docs/changelogs.html

# Registros de alterações

Alterações técnicas que afetam produtos, serviços ou a API pública da AIVAX. As datas identificam quando as entradas foram adicionadas ou atualizadas, não as datas confirmadas de implantação em produção. Cada item identifica o produto ou serviço afetado; manutenção sem efeito visível ao usuário é omitida.

## Segunda-feira, 28 de setembro de 2026

### Correções:

- **Gateways — Ajuda da ferramenta Bash aceita parâmetros anuláveis.** Solicitar ajuda para ferramentas cujos parâmetros aceitam múltiplos tipos, incluindo `null`, não falha mais ao listar seus argumentos. A ajuda preserva os tipos aceitos e os caminhos de parâmetros aninhados. Nenhuma mudança no esquema da ferramenta é necessária.

- **Integrações de chat — Notificações de falha restauradas.** Conversas em streaming e não streaming novamente tentam enviar “System: something went wrong. Please, try again later.” após uma falha de geração irrecuperável, tentativas de recuperação esgotadas ou um turno que não envia mensagem. Uma falha final é relatada mesmo se uma resposta parcial anterior foi entregue. A entrega de notificações ainda depende da disponibilidade do serviço de mensagens.

### Alterações:

- **Gateways — Seleção de fuso horário.** A configuração de data e hora atual agora oferece um menu suspenso de fusos horários agrupados por região, incluindo UTC. Os fusos horários salvos existentes são preservados ao reabrir a configuração.

- **Modelos — Sete novos modelos de texto.** Adiciona `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime` e `@fireworks/ember-1` como modelos de texto selecionáveis, cobrados por provedor nas taxas de token publicadas com ajustes de conta e plano existentes ainda aplicados. Modelos Upstage e Fireworks agora exibem seus ícones de provedor ao invés do genérico. Identificadores de modelo existentes permanecem inalterados.

## Domingo, 27 de setembro de 2026

### Alterações:

- **Telegram — Progresso de ferramenta compacto.** Respostas em streaming mostram apenas o último preâmbulo da ferramenta no indicador de pensamento quando a visibilidade de chamada de ferramenta está habilitada, em vez de acumular blocos de nomes de ferramentas na resposta. A resposta final não contém blocos de progresso de ferramenta. Outros canais de mensagem e respostas não em streaming permanecem inalterados.

- **Gateways — Seleção de ferramenta Bash.** A lista de ferramentas Bash agora inclui um atalho para `get_date_time` (Data e hora atuais). Listas de inclusão e exclusão aceitam padrões curinga sem distinção de maiúsculas/minúsculas: `*` corresponde a qualquer número de caracteres, como em `something_*`, e `?` corresponde a um caractere. Nomes de ferramentas exatos permanecem suportados.

- **Decisões semânticas e Testes Agentes — Limites de taxa da conta.** Decisões semânticas permitem 10 solicitações por minuto no Free e 50 no Pro. Testes Agentes permitem 5 novas execuções por minuto no Free e 30 no Pro, compartilhadas entre execuções manuais, programadas e avaliações diretas. Max não tem limite imposto por plano para nenhuma operação. Solicitações diretas acima desses limites retornam HTTP 429; testes programados aguardam uma verificação de agendamento posterior. Clientes devem espaçar solicitações e tentar novamente após o término da janela de limite de taxa. Limites de inferência existentes ainda se aplicam. Consulte [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-and-agentic-test-rate-limits), [Decisões semânticas](https://docs.aivax.net/pt-br/docs/generations/decisions.md#account-rate-limits) e [Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#run-and-inspect-a-test).

- **Modelos — Preços consistentes de síntese de fala.** Os preços do catálogo de texto-para-fala agora derivam das mesmas taxas por caractere usadas para calcular o uso de síntese, exibidos por 1.000 caracteres. Identificadores de modelo existentes e taxas de faturamento permanecem inalterados.

- **Modelos — Preços comparáveis de transcrição.** Os preços dos modelos de fala-para-texto são exibidos consistentemente em USD por minuto, convertendo taxas horárias e por segundo para comparação sem alterar as taxas de faturamento ou a medição de duração.

- **Geração de imagem — Preços fixos de saída e referência.** A geração de imagem usa um preço fixo por saída entregue mais um preço por referência para cada saída. Modelos cujos provedores cobram tokens ou megapixels agora usam estimativas arredondadas para cima ao invés de cobranças de token medidos. O processamento do prompt está incluído na estimativa de saída; modelos sem taxa de referência separada listam taxa de referência zero. Estes são tarifas fixas, não recibos do consumo real do provedor. As cobranças de imagem não incluem mais a marcação de geração de imagem da AIVAX nem os multiplicadores de preço de conta e plano. Consulte [Geração de imagem](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Modelos — Cobertura de assinatura.** A página de Modelos agora inclui uma coluna “Uso da Assinatura” para rerankers e modelos de decisão semântica. “Incluído” identifica modelos elegíveis para as cotas diárias do plano; “Excluído” identifica modelos sem cobertura. Elegibilidade não indica a cota restante da conta. Ambos os catálogos de serviço expõem essa elegibilidade como `subscriptionUsage`.

- **Assinaturas — Cotas diárias incluídas.** As assinaturas Free, Pro e Max incluem cotas diárias para buscas RAG e embeddings de inserção, tokens de entrada Reflex (incluindo tokens de entrada em cache) e tokens de entrada de Decisores Semânticos usando apenas Julia-1. Cada item de serviço medido é totalmente incluído se seu consumo cabe na cota mais uma margem de 10%; caso contrário, o item inteiro é cobrado nas taxas normais sem consumir a cota. Uma solicitação pode conter múltiplos itens, como embeddings de termos de consulta separados, e pode combinar uso incluído e pago. Essa regra tudo-ou-nada também se aplica à extração OCR, substituindo cobertura parcial. Itens de serviço cobertos aparecem no consumo da assinatura, sem criar entradas de histórico de faturamento de custo zero; itens não cobertos mantêm registros de faturamento normais. A cota Julia-1 do plano Free é aumentada quatro vezes; o Pro agora inclui 2,5× a cota de decisão Free, e o Max inclui 2× Pro. O uso pode mostrar mais de 100% dentro da margem permitida. As informações de faturamento da conta agora derivam `includesSubscriptionModels` das cotas de inferência ativas, portanto é falso enquanto as assinaturas de inferência estão desativadas. O limite diário de tempo de processamento do Reflex permanece um limite técnico separado; contas de revendedores não recebem cotas de assinatura. Comparações de planos na documentação e na página de preços pública mostram capacidade de cota relativa ao invés de unidades absolutas. A cobertura de assinatura LLM permanece desativada. Consulte [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md).

## Sábado, 26 de setembro de 2026

### Alterações críticas:

- **Geração de imagem — Modelos obsoletos removidos.** Remove `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL` e `Meina-Mix` dos modelos disponíveis. Solicitações de API diretas usando esses identificadores agora falham; selecione um modelo ativo. A geração de imagem embutida usa `flux-schnell` quando nenhum modelo válido está configurado, substituindo o padrão obsoleto `AbsoluteReality`. Revise as configurações salvas; estilo de saída e preços diferem.

### Alterações:

- **Geração de imagem — Modelos adicionais Pollinations.** Adiciona 16 modelos oficiais de imagem raster, incluindo variantes FLUX 1.1 Pro e FLUX 2, variantes MAI Image, GPT Image 2.5 Flare e Sunburst, Qwen Image 2.1 e 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM e Seedream 5 Pro, com pré-visualizações geradas pelo modelo no seletor de imagens. Modelos da comunidade e SVG são excluídos. O catálogo exibe as unidades de faturamento. Consulte a entrada de 27 de setembro para a mudança subsequente de faturamento de preço fixo. Gerações falhas não são contadas como imagens entregues. Consulte [Geração de imagem](https://docs.aivax.net/pt-br/docs/generations/images.md).

- **Modelos — Catálogos de modelos de serviço.** A página de Modelos agora inclui tabelas para geração de imagem, fala-para-texto, texto-para-fala, reranking e decisões semânticas, com descrições fornecidas pelo backend, datas de lançamento, preços base em USD com unidades de faturamento e um menu suspenso de Ações em cada tabela de modelo de serviço para copiar nomes de modelo e abrir documentação de integração. Nomes de modelo exibem um rótulo amigável quando disponível ao copiar o identificador aceito pela API. O preço usa unidades de entrada compacta, entrada em cache, saída, imagem, caractere e duração separados por setas quando aplicável, com taxas completas e unidades disponíveis na dica de ferramenta. Os catálogos são ordenados do mais recente ao mais antigo. Datas e nomes amigáveis do catálogo OpenRouter complementam metadados de lançamento ausentes; datas de catálogo são rotuladas explicitamente ao invés de apresentadas como datas de lançamento do fabricante. Modelos sem nenhuma data permanecem últimos. Solicitações de catálogo falhas podem ser repetidas independentemente. Os catálogos de informações públicas expõem esses detalhes, incluindo o novo catálogo `GET /api/v1/information/speech-models.json`. Ajustes de preço de conta e plano ainda se aplicam. Consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Decisões semânticas](https://docs.aivax.net/pt-br/docs/generations/decisions.md).

- **Privacidade — Divulgação judicial e retenção esclarecidas.** A [Política de Privacidade](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md) e os [Termos de Uso](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md) especificam ordens judiciais brasileiras para divulgação, solicitações estrangeiras para preservar logs existentes por até 1 ano, e até 1 ano de logs técnicos e metadados. Elas esclarecem que o conteúdo da conversa é coletado somente quando Conversas está habilitado para a solicitação ou conta, e que recursos de conta disponíveis e backups de até 3 meses podem ser divulgados sob ordem judicial brasileira. A licença de conteúdo nos Termos está expressamente sujeita a esses limites.

- **Gerações — Modelos de decisão adicionais.** O novo [guia de decisões semânticas](https://docs.aivax.net/pt-br/docs/generations/decisions.md) explica tipos de perguntas, interpretação de respostas, preços de modelo e limites Julia-1. O ponto de extremidade público `GET /api/v1/information/decisions-models.json` lista nomes canônicos, aliases, tipos de perguntas suportados, comprimentos de contexto, datas de lançamento e preços base de tokens. Adiciona `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b` e `@supersonic-labs/julia-1` como opções de modelo para decisões semânticas. Julia-1 suporta `choice`, `score` e `noul`, com um contexto combinado de 1.024 tokens por pergunta e 2–20 opções ou níveis de pontuação. Seu preço base é $0,008 por milhão de tokens de entrada, sem cobrança de token de saída; ajustes de preço de conta e plano existentes ainda se aplicam. O uso de entrada inclui o estado repetido para cada pergunta. Identificadores de modelo existentes e formatos de solicitação permanecem inalterados.

## Terça-feira, 22 de setembro de 2026

### Alterações:

- **Modelos — GPT-6 Sol e Luna adicionados.** Adiciona `@openai/gpt-6-sol` e `@openai/gpt-6-luna`, incluindo suas variantes de raciocínio `:pro`. Os aliases `@model-router/openai:mid` e `@model-router/openai:budget` agora selecionam GPT-6 Sol e GPT-6 Luna, respectivamente. Aplicações que usam esses aliases podem observar mudanças na qualidade da resposta, latência e custo. Identificadores de modelo explícitos existentes permanecem inalterados.

## Segunda-feira, 21 de setembro de 2026

### Alterações críticas:

- **Gateways — Moderação fora de tópico está sendo removida.** O limite dedicado fora de tópico não bloqueará mais solicitações que se desviem do propósito da conversa. Se sua aplicação depende dessa verificação, revise suas restrições de tópico antes de adotar esta mudança; as categorias de moderação restantes não são um substituto equivalente.

- **Ferramentas embutidas — Pesquisa avançada na web está sendo desativada.** A ferramenta `AdvancedWebUsage` retornará uma resposta indisponível ao invés de realizar pesquisa. Remova a dependência desta ferramenta das instruções e fluxos de gateway. A [Busca na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) padrão e a extração de URL permanecem alternativas separadas, não substitutos equivalentes para pesquisa em múltiplas etapas.

- **Modelos — Identificador do modelo Mercury 2.5 alterado.** Substitua `@inception/mercury-2.5-preview` por `@inception/mercury-2.5` nas solicitações e configurações de gateway. O identificador de pré-visualização não está mais listado, e o substituto não está mais marcado como pré-visualização.

- **Gateways / MCP — Nomes de ferramentas MCP são qualificados pela fonte.** Ferramentas de diferentes fontes MCP não compartilham mais um nome não qualificado no gateway. Revise as instruções de gateway, regras de seleção de ferramentas e workers que correspondem a nomes de ferramentas exatos. O nome original da ferramenta no servidor MCP conectado permanece inalterado. Consulte [funções MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

### Correções:

- **Coleções, Gateways e Gerações — Disponibilidade de modelo de serviço.** Geração de respostas de coleção, roteamento de gateway, utilidades de chat e serviços de processamento de mídia evitam selecionar modelos temporariamente indisponíveis. Teach Skill e pré-processamento multimodal podem tentar outro modelo disponível após uma falha recuperável; o sucesso ainda depende da disponibilidade do serviço.

- **Teach Skill — Cálculo de uso.** As cobranças de processamento do Teach Skill usam o preço do modelo associado à solicitação concluída, inclusive quando uma tentativa altera o modelo usado. Consulte [Teach Skill](https://docs.aivax.net/pt-br/docs/generations/teach-skill.md) e [Preços](https://docs.aivax.net/pt-br/docs/pricing.md).

- **Fetch and OCR — Extração de página mais confiável.** Solicitações de conteúdo de página canceladas ou com tempo esgotado não deixam mais a extração de página em execução indefinidamente. Isso resolve casos em que a extração de conteúdo da web poderia travar.

- **Clientes de chat — Resposta final e histórico de mensagens.** `completionText` agora seleciona a resposta final gerada pelo assistente ao invés de combiná-la com texto anterior do assistente durante o uso da ferramenta. O campo de resposta `createdMessages` adicionado preserva as mensagens recém-geradas em ordem, incluindo interações de ferramenta; mensagens enviadas não são repetidas. Use este campo quando precisar da rodada completa gerada.

- **Gateways / MCP — Resultados estruturados MCP são mantidos.** Assistentes recebem conteúdo de resultado estruturado além dos blocos de conteúdo suportados, evitando informações ausentes quando uma ferramenta MCP retorna saída estruturada.

- **Fetch and OCR — Extração de post X.** Extração de texto legível aprimorada de links públicos de post X. Disponibilidade de conteúdo e restrições de acesso ainda se aplicam.

- **Fetch and OCR — Normalização de texto simples alterada.** A conversão para texto simples não colapsa mais espaços internos nem normaliza caracteres Unicode. Espaços ao redor ainda podem ser removidos nos resultados de extração. Aplicações que comparam texto extraído exatamente ou requerem espaçamento normalizado devem realizar essa normalização por conta própria.

### Alterações:

- **Fetch and OCR — Extração estruturada opcional.** Forneça `responseSchema` para converter o conteúdo extraído em JSON. Os resultados adicionam `extractedObject` e `jsonProcessingUnits` enquanto retêm `extractedText` em caso de sucesso. Sem um esquema, os novos campos são nulos e zero respectivamente. A conversão JSON é cobrada separadamente da extração e não está coberta pela cota diária de extração. Consulte [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).

- **Gerações — Decisões semânticas.** Avalie múltiplas perguntas nomeadas contra um estado JSON compartilhado usando `noul` (critério verdadeiro/falso), `choice` ou `score`. As respostas incluem respostas nomeadas, uso de tokens e custo. O serviço requer saldo positivo, e seu uso de tokens contribui para os totais de uso da conta.

- **Ferramentas embutidas — Data e hora atuais.** A opção `DateTime` permite que assistentes solicitem a data, hora, dia da semana, fuso horário e deslocamento UTC atuais. Defina `dateTimeTimeZone` para o fuso horário desejado; o padrão é `America/Los_Angeles`, com ajustes de horário de verão, independente do fuso horário do navegador. Fusos horários inválidos são rejeitados.

- **Modelos — Opções de modelo adicionais.** Adiciona GLM-5.3-FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo-V2.6-Pro, MiMo-V2.6-Flash, MiMo-V2.6-Pro-UltraSpeed e Grok 4.7 ao catálogo de inferência. Os aliases Xiaomi frontier, mid e budget agora selecionam modelos MiMo V2.6, enquanto `@model-router/grok:latest` seleciona Grok 4.7. Usuários de alias podem observar diferentes qualidade de resposta, latência e custo; disponibilidade e capacidades suportadas dependem do modelo selecionado e do plano da conta.

- **Inferência — Recuperação de falhas transitórias.** Solicitações de inferência podem fazer tentativas de recuperação adicionais quando um provedor está temporariamente indisponível. Isso pode evitar algumas solicitações falhas, mas também pode aumentar o tempo de resposta antes que um erro seja retornado.

- **Assistente Avi — Modelo padrão atualizado.** O assistente do console AIVAX altera seu modelo padrão, o que pode mudar o estilo de resposta, latência e custo de uso. Isso não altera o modelo selecionado em seus próprios gateways.

- **Documentação — Orientação de serviço atualizada.** A visão geral da documentação da API e a orientação do Assistente Avi cobrem sessões de voz, testes agentes, classificação, segmentação, reranking e extração web, com links de documentação atuais e orientação de faturamento específica por serviço. Esta é uma atualização de orientação, não a introdução desses serviços.

- **Modelos — DeepSeek V4.1 Flash adicionado.** O catálogo de inferência inclui `@deepseek/deepseek-v4.1-flash` com suporte a chamadas de ferramenta. Verifique a disponibilidade do modelo e elegibilidade do plano antes de selecioná-lo.

- **Modelos — Seleções de roteador atualizadas.** `@model-router/deepseek:latest` e `@model-router/deepseek:budget` agora selecionam DeepSeek V4.1 Flash. Aplicações que usam esses aliases podem observar diferentes qualidade de resposta, latência e custo sem mudar o alias. Adiciona `@model-router/claude:frontier-mythos` e `@model-router/mercury:latest` como opções adicionais.

- **Clientes de chat — Entrada de prompt estruturada.** Prompts síncronos de cliente de chat aceitam texto simples, uma única mensagem ou um array ordenado de mensagens, incluindo chamadas de ferramenta do assistente e resultados de ferramenta correspondentes. A entrada de mensagem única existente permanece suportada. `instructions` opcional adiciona contexto para aquela solicitação sem substituir o contexto de sessão salvo. Consulte [Clientes de chat](https://docs.aivax.net/pt-br/docs/features/chat-clients.md).

- **Clientes de chat — Turnos sem persistência de sessão.** Defina `commit` como false para gerar uma resposta sem salvar as mensagens enviadas e geradas no histórico da sessão. O padrão permanece true. Isso não é uma prévia gratuita: inferência e ações de ferramenta ainda são executadas. Para continuar uma interação de ferramenta não confirmada, envie a mensagem de chamada de ferramenta do assistente junto com seus resultados de ferramenta.

- **Testes Agentes — Notificações de teste opcionais.** As preferências de notificação da conta podem habilitar resumos semanais de teste e alertas quando um teste atinge três falhas consecutivas. Isso complementa as notificações de falha e recuperação existentes. Consulte [Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

- **Fetch and OCR — Conteúdo web renderizado.** A extração de HTML suporta conteúdo de página renderizado, melhorando a cobertura de páginas cujo texto legível depende de scripts. A renderização é medida em unidades de processamento; isso não garante acesso a todos os sites ou páginas restritas. Consulte [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md).
