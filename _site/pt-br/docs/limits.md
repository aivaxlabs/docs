Source: https://docs.aivax.net/pt-br/docs/limits.html

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e permissões diárias incluídas.

Para preços de assinaturas comerciais e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

Os limites são aplicados em diferentes camadas:

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e possuem limites de solicitação e token por chave e por IP.
- O middleware de saldo rejeita solicitações faturáveis quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita solicitações quando o armazenamento da conta excede a cota do plano.
- As verificações de inferência avaliam acesso ao modelo, taxa de solicitações, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.
- As verificações de RAG avaliam contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- As ferramentas integradas verificam limites de serviço diário.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Account%20Balance)

## Limites do plano

Um travessão longo (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada do modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Atualmente desativada | Atualmente desativada | Atualmente desativada |
| Solicitações autônomas de texto-para-fala | 3/min e 40/hora | 30/min | 300/min |
| Solicitações autônomas de transcrição de áudio | 3/min e 40/hora | 30/min | 300/min |
| Solicitações de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Pesquisas semânticas | 20/min | 500/min | 3.000/min |
| Documentos de classificação de texto | 30/min e 300/dia | 1.000/min | 10.000/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |
| Pesquisas de reclassificação | 30/min | 1.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 6 horas/dia | — |
| Inserções de documentos | 500/dia | 10.000/dia | — |
| Documentos JSONL por solicitação de importação | 1.000 | 10.000 | 1.000.000 |
| Injetor de mídia | 2 arquivos/dia | 30 arquivos/dia | 1.000 arquivos/dia |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/dia | 1.000/dia | 10.000/dia |
| Busca X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1.000/dia |
| Geração de documentos e páginas da web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 5.000/dia | 100.000/dia |
| Comandos Bash | 300/hora | 30.000/hora | — |
| **Testes agentes** |  |  |  |
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções simultâneas por conta | 1 | 4 | 8 |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/dia | 100.000/dia | — |
| Arquivos por solicitação de importação | 1.000 | 1.000 | 1.000 |
| Tamanho total de importação | 100 MiB/solicitação | 100 MiB/solicitação | 100 MiB/solicitação |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/mês | $0.20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

### Limites de taxa de decisão semântica e Testes Agentes

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das permissões de assinatura e faturamento: o uso incluído ainda consome a cota de solicitação ou execução aplicável.

- **Decisões semânticas:** cada solicitação consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão é selecionado. Uma solicitação que exceda o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Decisões semânticas](https://docs.aivax.net/pt-br/docs/generations/decisions.md).
- **Testes Agentes:** execuções manuais, programadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistida consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversa não consomem unidades adicionais. Solicitações excedentes de execuções manuais e avaliações diretas retornam `429 Too Many Requests`. Um teste programado sem cota disponível aguarda uma verificação de agendamento posterior ao invés de criar uma execução extra. Execuções existentes continuam sujeitas aos seus limites separados de simultaneidade e inferência. Veja [Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

Distribua as solicitações pela conta e use tentativas limitadas com backoff após um 429. Uma nova tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Limites de modelo de decisão semântica

Esses limites específicos de modelo se aplicam além das cotas de solicitação ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Modelo | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | 32.768 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8.192 tokens |

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por solicitação | 1–32 |
| Opções ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os limites atuais de serviço Julia-1 da AIVAX se aplicam mesmo se o cartão de modelo upstream listar um contexto maior. Consulte [Decisões semânticas](https://docs.aivax.net/pt-br/docs/generations/decisions.md) para orientações de uso e erros.

### Permissões diárias incluídas na assinatura

Free, Pro e Max incluem permissões diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. Permissão não utilizada de um serviço não pode cobrir outro. Contas revendedoras não recebem permissões de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Embeddings de busca e inserção RAG | Permissão base | 25× Free | 4× Pro |
| Reclassificação com Reflex | Permissão base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Permissão base | 2,5× Free | 2× Pro |
| Busca e extração OCR | Permissão base | 10× Free | 5× Pro |

Pesquisas RAG e inserções de documentos compartilham a permissão de embedding. Ela não cobre geração de respostas, processamento de mídia, classificação de texto ou segmentação. Um embedding de consulta servido a partir do cache não o consome. Reflex usa uma permissão de reclassificação separada que inclui entrada em cache e sem cache. Julia-1 é atualmente o único modelo de decisão coberto pela permissão de decisão semântica; outros modelos de decisão são cobrados normalmente. A conversão opcional Fetch JSON é separada da permissão de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, um embedding de termo de consulta individual, uma chamada de reclassificação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As permissões atuais permitem uma margem de 10 % acima de sua capacidade base. Um item que excederia essa margem deixa a permissão inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As permissões diárias são redefinidas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100 % dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de modelo de texto e a geração de respostas RAG permanecem tarifadas separadamente. As permissões não ignoram requisitos de saldo, limites de taxa ou o teto de tempo de processamento separado de Reflex. Consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para cobranças quando um item não está coberto.

Contas revendedoras suportam 8 execuções simultâneas de testes agentes por conta.

Solicitações de modelo integrado são limitadas tanto por contagem de solicitações quanto por tokens de entrada. Grupos de limite de taxa de modelo ajustam os limiares de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador do limiar |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway ao invés de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura AIVAX e usam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que exceda qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de embedding padrão e é cobrada pelo trabalho de embedding realizado.

Solicitações autônomas de texto-para-fala e transcrição de áudio cada uma usa sua própria cota de solicitação do plano. Sessões de voz usam o modelo em tempo real selecionado e estão sujeitas aos limites de acesso ao modelo, saldo e inferência aplicáveis, em vez dessas cotas de solicitação autônomas. A transcrição de entrada não é suportada atualmente dentro das Sessões de voz.

O endpoint de importação JSONL rejeita uma solicitação quando atinge o limite de documentos por solicitação do plano. O limite de reclassificação se aplica ao endpoint autônomo de reclassificação e às buscas RAG que usam um reclassificador, incluindo buscas realizadas através de Gateways de IA e ferramentas MCP.

O limite Reflex conta o tempo gasto processando solicitações Reflex. Ele se aplica ao endpoint autônomo de reclassificação e às buscas RAG que usam Reflex; entrada em cache não consome a cota separadamente. Solicitações que excedem o limite do plano retornam `429 Too Many Requests`. Consulte [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) para limites de solicitação, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa de cota, tente novamente após a janela de cota ser redefinida ou faça upgrade da conta.

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitação |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de solicitação e omitam superfícies de ferramentas do lado do servidor. Veja [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).
