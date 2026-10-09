Source: https://docs.aivax.net/pt-br/docs/limits.html

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, quota de armazenamento, retenção de conversas e as alocações diárias de serviço incluídas.

Para preços de assinatura comercial e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e possuem limites de solicitação e token por chave e por IP.
- O middleware de saldo rejeita solicitações pagas quando o saldo da conta está abaixo do mínimo necessário.
- O middleware de armazenamento rejeita solicitações quando o armazenamento da conta excede a cota do plano.
- A inferência verifica o acesso ao modelo, taxa de solicitações, taxa de tokens de entrada, taxa BYOK e tamanho do contexto do plano Free.
- RAG verifica a contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas integradas verificam os limites diários de serviço.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Account%20Balance)

## Limites do plano

Um travessão (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada do modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Atualmente desativado | Atualmente desativado | Atualmente desativado |
| Solicitações autônomas de texto para fala | 3/min e 40/hora | 30/min | 300/min |
| Solicitações autônomas de transcrição de áudio | 3/min e 40/hora | 30/min | 300/min |
| Solicitações de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3,000/min |
| Documentos de classificação de texto | 30/min e 300/dia | 1,000/min | 10,000/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2,500/min |
| Buscas de reordenação | 30/min | 1,000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 6 horas/dia | — |
| Inserções de documento | 500/dia | 10,000/dia | — |
| Documentos JSONL por solicitação de importação | 1,000 | 10,000 | 1,000,000 |
| Injetor de mídia | 2 arquivos/dia | 30 arquivos/dia | 1,000 arquivos/dia |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/dia | 1,000/dia | 10,000/dia |
| Busca X/Twitter | Não disponível | 1,000/dia | 10,000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1,000/dia |
| Geração de documento e página web | 5/dia | 1,000/dia | 50,000/dia |
| Geração e edição de imagem | 5/dia | 500/dia | 5,000/dia |
| Ações gerais de serviço | 30/dia | 5,000/dia | 100,000/dia |
| Comandos Bash | 300/hora | 30,000/hora | — |
| **Testes agênticos** |  |  |  |
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções concorrentes por conta | 1 | 4 | 8 |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/dia | 100,000/dia | — |
| Arquivos por solicitação de importação | 1,000 | 1,000 | 1,000 |
| Tamanho total de importação | 100 MiB/request | 100 MiB/request | 100 MiB/request |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Quota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Priority | Dedicated |

### Limites de taxa de decisão semântica e teste agêntico

Esses limites por minuto são compartilhados entre as chaves de API pertencentes à mesma conta. Eles são independentes das alocações de assinatura e faturamento: o uso incluído ainda consome a cota de solicitação ou execução aplicável.

- **Decisões semânticas:** cada solicitação consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão seleciona. Uma solicitação que excede o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md).
- **Testes agênticos:** execuções manuais, programadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistente consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversa não consomem unidades adicionais. Solicitações de execuções manuais excessivas e avaliações diretas retornam `429 Too Many Requests`. Um teste programado sem cota disponível aguarda uma verificação de agendamento posterior ao invés de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites separados de simultaneidade e inferência. Veja [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

Regule as solicitações em toda a conta e use tentativas limitadas com backoff após um 429. Uma tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Limites de modelo de decisão semântica

Esses limites específicos de modelo se aplicam além das cotas de solicitação ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Modelo | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | 32.768 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8.192 tokens |
| `@upstage/solar-decide` | 524.288 tokens |
| `@cloudflare/clef` | 65.536 tokens |
| `@cloudflare/clef-flash` | 65.536 tokens |
| `@liquid/d1` | 65.536 tokens |
| `@perplexity/pplx-decider-v1-27b` | 262.144 tokens |
| `@openai/gpt-6-luna-decisions` | 1.050.000 tokens |

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

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição se enquadre em seu limite individual. Os atuais limites de serviço Julia-1 da AIVAX se aplicam mesmo se um cartão de modelo upstream listar um contexto maior. Veja [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) para orientações de uso e erros.

### Alocações diárias de assinatura incluídas

Free, Pro e Max incluem alocações diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. Alocação não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem alocações de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Embeddings de busca e inserção RAG | Cota base | 25× Free | 4× Pro |
| Reordenação com Reflex | Cota base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Cota base | 2.5× Free | 2× Pro |
| Busca e extração OCR | Cota base | 10× Free | 5× Pro |

Buscas RAG e inserções de documentos compartilham a cota de embeddings. Ela não cobre geração de respostas, processamento de mídia, classificação de texto ou segmentação. Um embedding de consulta servido a partir do cache não o consome. Reflex usa uma cota de reordenação separada que inclui entradas em cache e sem cache. Julia-1 é atualmente o único modelo de decisão coberto pela cota de decisão semântica; outros modelos de decisão são faturados normalmente. A conversão opcional Fetch JSON é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, um embedding de termo de consulta individual, uma chamada de reordenação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são acompanhados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As atuais alocações permitem uma margem de 10% acima de sua capacidade base. Um item que excederia essa margem deixa a alocação inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As alocações diárias são reiniciadas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de reinício; o uso pode exceder 100% dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de modelo de texto e a geração de respostas RAG permanecem medidas separadamente. As alocações não contornam requisitos de saldo, limites de taxa ou o teto de tempo de processamento separado do Reflex. Veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) para cobranças quando um item não está coberto.

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

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e completações de chat. Para completações de chat, chaves públicas também exigem um UUID completo do AI Gateway, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md).
