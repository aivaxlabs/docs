---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 50,group: Introduction,sourceHash: 430ce73bf8c01d4d,aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas RAG, limites de ferramentas, cota de armazenamento, retenção de conversação e alocações diárias de serviço incluídas.

Para preços de assinatura comercial e pacotes de plano, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

Os limites são aplicados em diferentes camadas:

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de requisição e token por chave e por IP.
- O middleware de saldo rejeita requisições pagáveis quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita requisições quando o armazenamento da conta excede a cota do plano.
- A inferência verifica acesso ao modelo, taxa de requisições, taxa de tokens de entrada, taxa BYOK e tamanho do contexto do plano Free.
- RAG verifica contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas integradas verificam limites diários de serviço.
- Processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites do plano

Um travessão longo (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Requisições de modelo integrado | 20/min and 500/day | 200/min | — |
| Tokens de entrada de modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Requisições BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 input tokens | — | — |
| Cobertura de assinatura LLM | Currently disabled | Currently disabled | Currently disabled |
| Requisições de texto-para-fala independentes | 3/min and 40/hour | 30/min | 300/min |
| Requisições de transcrição de áudio independentes | 3/min and 40/hour | 30/min | 300/min |
| Requisições de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3,000/min |
| Documentos de classificação de texto | 30/min and 300/day | 1,000/min | 10,000/min |
| Documentos de segmentação de texto | 10/min and 100/day | 300/min | 2,500/min |
| Buscas de reclassificação | 30/min | 1,000/min | — |
| Tempo de processamento Reflex | 30 minutes/day | 6 hours/day | — |
| Inserções de documentos | 500/day | 10,000/day | — |
| Documentos JSONL por requisição de importação | 1,000 | 10,000 | 1,000,000 |
| Injetor de mídia | 2 files/day | 30 files/day | 1,000 files/day |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/day | 1,000/day | 10,000/day |
| Busca X/Twitter | Not available | 1,000/day | 10,000/day |
| Busca avançada na web | Not available | 100/day | 1,000/day |
| Geração de documento e página web | 5/day | 1,000/day | 50,000/day |
| Geração e edição de imagens | 5/day | 500/day | 5,000/day |
| Ações gerais de serviço | 30/day | 5,000/day | 100,000/day |
| Comandos Bash | 300/hour | 30,000/hour | — |
| **Testes agênticos** |  |  |  |
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções simultâneas por conta | 1 | 4 | 8 |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/day | 100,000/day | — |
| Arquivos por requisição de importação | 1,000 | 1,000 | 1,000 |
| Tamanho total de importação | 100 MiB/request | 100 MiB/request | 100 MiB/request |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversação | 2 hours | 2 days | 30 days |
| Nível de suporte | Email | Priority | Dedicated |

### Limites de taxa de decisão semântica e teste agêntico

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das cotas de assinatura e faturamento: o uso incluído ainda consome a cota de requisição ou execução aplicável.

- **Decisões semânticas:** cada requisição consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão seleciona. Uma requisição que excede o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Semantic decisions](generations/decisions.md).
- **Testes agênticos:** execuções manuais, agendadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistida consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversação não consomem unidades adicionais. Requisições manuais excedentes e avaliações diretas retornam `429 Too Many Requests`. Um teste agendado sem cota disponível aguarda uma verificação de agendamento posterior em vez de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites de simultaneidade e inferência separados. Veja [Agentic Tests](inference/agentic-tests.md).

Distribua as requisições pela conta e use tentativas limitadas com backoff após um 429. Uma nova tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Limites de modelo de decisão semântica

Esses limites específicos de modelo se aplicam além das cotas de requisição ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Modelo | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1,024 tokens por pergunta |
| `@typesafe/jev-1.13` | 64,000 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8,192 tokens |
| `@upstage/solar-decide` | 524,288 tokens |
| `@cloudflare/clef` | 65,536 tokens |
| `@cloudflare/clef-flash` | 65,536 tokens |
| `@liquid/d1` | 65,536 tokens |
| `@perplexity/pplx-decider-v1.1-27b` | 262,144 tokens |
| `@openai/gpt-6-luna-decisions` | 1,050,000 tokens |
| `@microsoft/microsoft-decision-1` | 32,768 tokens |
| `@nace-ai/drex-v1.5` | 131,072 tokens |
| `@cloudflare/clef-omni` | 65,536 tokens |

Entrada de imagem por requisição: `@cloudflare/clef`, `@cloudflare/clef-flash` e `@cloudflare/clef-omni` aceitam até 4 imagens; `@openai/gpt-6-luna-decisions` aceita até 128. Outros modelos de decisão são apenas texto.

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por requisição | 1–32 |
| Opções ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1,024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os limites atuais de serviço Julia-1 da AIVAX se aplicam mesmo que um cartão de modelo upstream liste um contexto maior. Veja [Semantic decisions](generations/decisions.md) para orientações de uso e erros.

### Limites de requisição e payload

Esses limites se aplicam a todos os planos e são independentes dos limites de plano acima.

| Serviço | Limite |
| --- | --- |
| Reclassificação [Reflex](rag/reflex.md) | 10,000 documentos candidatos por requisição; no máximo 200 resultados classificados retornados |
| Transcrição de áudio [Audio transcription](generations/audio-transcriptions.md) | 75 MB de áudio decodificado por requisição |
| Descrições de mídia [Media descriptions](generations/media-descriptions.md) | Arquivos remotos são baixados pela AIVAX até 5 MB cada sob o preset `auto` |
| Busca e OCR [Fetch and OCR](web-foundation/fetch-and-ocr.md) | 10 MB por item |
| Busca na web [Web search](web-foundation/web-search.md) | 1–25 resultados por requisição direta da API (`topn`) |
| Fontes de instrução remota [Remote instruction sources](inference/pipelines.md) | Tamanho máximo de resposta 10 MB |
| Testes agênticos [Agentic Tests](inference/agentic-tests.md) | Até 16 `resources` e 16 `hooks` por teste |

### Cotas diárias de assinatura incluídas

Free, Pro e Max incluem cotas diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de requisições. Cota não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem cotas de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Incrustações de busca e inserção RAG | Cota base | 25× Free | 4× Pro |
| Reclassificação com Reflex | Cota base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Cota base | 2.5× Free | 2× Pro |
| Extração de Busca e OCR | Cota base | 10× Free | 5× Pro |

Buscas RAG e inserções de documentos compartilham a cota de incrustação. Ela não cobre geração de respostas, processamento de mídia, classificação ou segmentação de texto. Uma incrustação de consulta servida a partir do cache não a consome. Reflex usa uma cota de reclassificação separada que inclui tanto entrada em cache quanto fora de cache. Julia-1 é atualmente o único modelo de decisão coberto pela cota de decisão semântica; outros modelos de decisão são cobrados normalmente. A conversão opcional de JSON Fetch é separada da cota de extração.

A cobertura é avaliada para cada item de serviço metrizado: a incrustação de um documento, a incrustação de um termo de consulta individual, a chamada de reclassificação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas taxas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10 % acima da capacidade base. Um item que excederia essa margem deixa a cota inalterada e é cobrado normalmente. Uma requisição pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são redefinidas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100 % dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de texto‑modelo e a geração de respostas RAG permanecem metrizadas separadamente. As cotas não contornam requisitos de saldo, limites de taxa ou o teto separado de tempo de processamento do Reflex. Veja [Pricing](pricing.md) para cobranças quando um item não está coberto.

Contas personalizadas suportam 8 execuções de teste agêntico simultâneas por conta. Seus limites de taxa são os limites do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa de plano quando nenhum fator é definido.

Requisições de modelo integrado são limitadas tanto por contagem de requisições quanto por tokens de entrada. Grupos de limite de taxa ajustam os limiares de contagem de requisições:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Gratuito | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 requisições de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é 100 requisições por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as requisições ainda passam pela infraestrutura AIVAX e usam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da requisição, não cada requisição HTTP. Uma requisição que exceder qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de incrustação padrão e é cobrada pelo trabalho de incrustação realizado.

Requisições de texto‑para‑fala independentes e transcrição de áudio independentes usam sua própria cota de requisição do plano. Sessões de Voz usam o modelo em tempo real selecionado e estão sujeitas aos limites de acesso ao modelo, saldo e inferência aplicáveis, em vez dessas cotas de requisição independentes. A transcrição de entrada não é atualmente suportada dentro de Sessões de Voz.

O endpoint de importação JSONL rejeita uma requisição quando atinge o limite de documentos por requisição do plano. O limite de reclassificação aplica‑se ao endpoint autônomo de reclassificação e às buscas RAG que usam um reclassificador, incluindo buscas realizadas através de Gateways de IA e ferramentas MCP.

O limite do Reflex conta o tempo gasto processando requisições do Reflex. Ele aplica‑se ao endpoint autônomo de reclassificação e às buscas RAG que usam Reflex; entrada em cache não consome a cota separadamente. Requisições que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](rag/reflex.md) para limites de requisição, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa de cota, tente novamente após a janela de cota ser redefinida ou faça upgrade da conta. Para saber como o admission de lote lida com pausas de cota e resultados parciais, veja [running thousands of LLM requests in batch](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de requisição |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hour, 1,000/day |
| Global por chave | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global por chave | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de requisição e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).
