---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 50,group: Introdução,sourceHash: legacy-unverified,aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e permissões diárias incluídas.

Para preços de assinatura comercial e empacotamento de planos, use a [AIVAX pricing page](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

Os limites são aplicados em diferentes camadas:

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de requisição e token por chave e por IP.
- O middleware de saldo rejeita requisições pagas quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita requisições quando o armazenamento da conta excede a cota do plano.
- As verificações de inferência avaliam acesso ao modelo, taxa de requisição, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.
- As verificações de RAG avaliam contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas integradas verificam limites de serviço diário.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites do plano

Um travessão longo (`—`) indica que o plano não impõe limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo preço/básicos | Modelos avançados | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada de modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Atualmente desativada | Atualmente desativada | Atualmente desativada |
| Solicitações autônomas de texto para fala | 3/min e 40/hora | 30/min | 300/min |
| Solicitações autônomas de transcrição de áudio | 3/min e 40/hora | 30/min | 300/min |
| Solicitações de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Pesquisas semânticas | 20/min | 500/min | 3.000/min |
| Documentos de classificação de texto | 30/min e 300/dia | 1.000/min | 10.000/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |
| Reordenação de buscas | 30/min | 1.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 6 horas/dia | — |
| Inserções de documentos | 500/dia | 10.000/dia | — |
| Documentos JSONL por solicitação de importação | 1.000 | 10.000 | 1.000.000 |
| Injetor de mídia | 2 arquivos/dia | 30 arquivos/dia | 1.000 arquivos/dia |
| **Ferramentas integradas** |  |  |  |
| Pesquisa na web | 15/dia | 1.000/dia | 10.000/dia |
| Pesquisa X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Pesquisa avançada na web | Não disponível | 100/dia | 1.000/dia |
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
| Tamanho total de importação | 100 MiB/solicitação | 100 MiB/solicitação | 100 MiB/solicitação |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/mês | $0.20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

### Limites de taxa de decisão semântica e teste agente

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das permissões de assinatura e faturamento: o uso incluído ainda consome a cota de requisição ou execução aplicável.

- **Decisões semânticas:** cada requisição consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão é selecionado. Uma requisição que excede o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Decisões semânticas](generations/decisions.md).
- **Testes agentes:** execuções manuais, agendadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistente consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversa não consomem unidades adicionais. Requisições manuais excedentes e avaliações diretas retornam `429 Too Many Requests`. Um teste agendado sem cota disponível aguarda a próxima verificação de agendamento em vez de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites de simultaneidade e inferência separados. Veja [Testes agentes](inference/agentic-tests.md).

Distribua as requisições pela conta e use tentativas limitadas com backoff após um 429. Uma tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Cotas diárias incluídas na assinatura

Free, Pro e Max incluem cotas diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de requisições. Cota não utilizada de um serviço não pode cobrir outro. Contas revendedoras não recebem cotas de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Incorporação de busca e inserção RAG | Cota base | 25× Free | 4× Pro |
| Reordenação com Reflex | Cota base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Cota base | 2.5× Free | 2× Pro |
| Busca e extração OCR | Cota base | 10× Free | 5× Pro |

Pesquisas RAG e inserções de documentos compartilham a cota de incorporação. Ela não cobre geração de respostas, processamento de mídia, classificação ou segmentação de texto. Uma incorporação de consulta atendida a partir do cache não a consome. Reflex usa uma cota de reordenação separada que inclui entradas em cache e sem cache. Julia-1 é atualmente o único modelo de decisão coberto pela cota de decisão semântica; outros modelos de decisão são cobrados normalmente. A conversão opcional de JSON Fetch é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: a incorporação de um documento, a incorporação de um termo de consulta individual, uma chamada de reordenação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10 % acima da capacidade base. Um item que excederia essa margem deixa a cota inalterada e é cobrado normalmente. Uma requisição pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são redefinidas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100 % dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de texto‑modelo e a geração de respostas RAG permanecem medidas separadamente. As cotas não contornam requisitos de saldo, limites de taxa ou o teto de tempo de processamento separado de Reflex. Consulte [Pricing](pricing.md) para cobranças quando um item não está coberto.

Contas revendedoras suportam 8 execuções de teste agente simultâneas por conta.

Solicitações de modelo integrado são limitadas tanto por contagem de requisições quanto por tokens de entrada. Grupos de limite de taxa de modelo ajustam os limites de contagem de requisições:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limite ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as requisições ainda passam pela infraestrutura AIVAX e utilizam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da requisição, não cada requisição HTTP. Uma requisição que excederia qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de incorporação padrão e é cobrada pelo trabalho de incorporação realizado.

Solicitações autônomas de texto para fala e transcrição de áudio usam suas próprias cotas de requisição do plano. Sessões de voz utilizam o modelo em tempo real selecionado e estão sujeitas aos limites de acesso ao modelo, saldo e inferência aplicáveis, em vez dessas cotas de requisição autônomas. A transcrição de entrada não é suportada atualmente dentro de Sessões de voz.

O endpoint de importação JSONL rejeita uma requisição quando atinge o limite de documentos por requisição do plano. O limite de reordenação aplica‑se ao endpoint autônomo de reordenação e às buscas RAG que utilizam um reordenador, incluindo buscas realizadas através de AI Gateways e ferramentas MCP.

O limite de Reflex conta o tempo gasto processando requisições Reflex. Ele aplica‑se ao endpoint autônomo de reordenação e às buscas RAG que utilizam Reflex; entrada em cache não consome a cota separadamente. Requisições que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](rag/reflex.md) para limites de requisição, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa de cota, tente novamente após a janela de cota ser redefinida ou faça upgrade da conta.

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de requisição |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de requisição e omitam superfícies de ferramentas no lado do servidor. Consulte [Authentication](authentication.md).
