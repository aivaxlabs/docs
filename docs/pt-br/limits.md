# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e janelas de reserva do modelo de assinatura.

Para preços de assinatura comercial e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de requisição e token por chave e por IP.
- O middleware de saldo rejeita requisições faturáveis quando o saldo da conta está abaixo do mínimo requerido.
- O middleware de armazenamento rejeita requisições quando o armazenamento da conta excede a cota do plano.
- A inferência verifica o acesso ao modelo, taxa de requisições, taxa de tokens de entrada, taxa BYOK e tamanho do contexto do plano Free.
- RAG verifica a contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas integradas verificam os limites diários de serviço.
- Processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Resumo do plano

| Recurso | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Acesso ao modelo | Modelos de baixo custo/básicos | Modelos avançados | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Requisições BYOK | 30/min | 200/min | Ilimitado |
| Contexto máximo | 65.536 tokens de entrada aplicados em tempo de execução | Limite do modelo ou gateway | Limite do modelo ou gateway |
| Reserva do modelo de assinatura | Nenhum | 250 unidades/6h e 3.000 unidades/semana | 1.000 unidades/6h e 15.000 unidades/semana |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

## Inferência integrada

Requisições de modelo integrado são limitadas por taxa de contagem de requisições e tokens de entrada.

| Plano | Limite de requisições | Limite de tokens de entrada |
| --- | --- | --- |
| Gratuito | 20/min e 500/dia | 1.000.000/min |
| Pro | 200/min | 20.000.000/min |
| Max | Ilimitado | Ilimitado |

| Grupo de limite de taxa | Multiplicador de limiar |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Gratuito | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 requisições de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é 100 requisições por minuto.

## Inferência BYOK

BYOK significa que o gateway usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado. BYOK ainda passa pela infraestrutura AIVAX e é limitado por taxa de acordo com o plano:

| Plano | Limite de requisições BYOK |
| --- | --- |
| Gratuito | 30/min |
| Pro | 200/min |
| Max | Ilimitado |

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de requisições |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de tokens |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, rerank separado, geração de fala, descrições de mídia, geração de imagens e completações de chat. Para completações de chat, chaves públicas também requerem um UUID completo do AI Gateway, restringem parâmetros de requisição e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).

## Limites de RAG e coleções

| Recurso | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Coleções | 5 | Ilimitado | Ilimitado |
| Buscas semânticas | 20/min | 500/min | 3.000/min |
| Buscas de rerank | 30/min | 1.000/min | Ilimitado |
| Inserções de documentos | 500/dia | 10.000/dia | Ilimitado |
| Documentos JSONL por requisição de importação | 1.000 | 10.000 | 1.000.000 |
| Processamento de arquivos compostos | Não disponível | 3 arquivos/dia | 10 arquivos/dia |

O endpoint de importação JSONL rejeita uma requisição quando atinge o limite de documentos por requisição do plano.

O limite de rerank é compartilhado pelo endpoint independente `/api/v1/rank` e por cada requisição de Busca Semântica que usa `rrf`, `lexical` ou `smart`. Buscas com `reranker: "none"` não consomem essa cota.

## Limites de ferramentas integradas

| Categoria de ferramenta | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Busca na web | 15/dia | 1.000/dia | 10.000/dia |
| Busca X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1.000/dia |
| Geração de documento e página web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de imagem | 5/dia | 500/dia | 5.000/dia |
| Ações de serviço geral | 30/dia | 5.000/dia | 100.000/dia |
| Comandos Bash | 30/hora | 1.500/hora | 10.000/hora |

Ações de serviço geral compartilham a cota de ação de serviço mostrada acima.

## Geração de fala

Requisições de texto para fala usam um limite de plano dedicado:

| Plano | Requisições de texto para fala |
| --- | --- |
| Gratuito | 3/min e 15/hora |
| Pro | 30/min |
| Max | 300/min |

## MCP de Documentação

O MCP de Documentação autenticado aplica limites por conta às suas ferramentas:

| Ferramenta | Limite |
| --- | --- |
| Buscar documentação | 10/min e 400/4h |
| Listar modelos | 30/min e 1.000/dia |

## Processamento em lote

Importações em lote têm guardas de tamanho de requisição, e o processamento de fluxo de trabalho tem um limite diário do plano.

| Recurso | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Itens de fluxo de trabalho processados | 500/dia | 100.000/dia | Ilimitado |
| Arquivos por requisição de importação | 1.000 | 1.000 | 1.000 |
| Tamanho total de importação | 100 MB/requisição | 100 MB/requisição | 100 MB/requisição |
| Tamanho de arquivo único importado | 10 MB | 10 MB | 10 MB |

Lote é assíncrono. Se o processamento for pausado ou falhar por causa da cota, tente novamente após a janela de cota reiniciar ou faça upgrade da conta.