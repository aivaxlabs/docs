# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e janelas de reserva do modelo de assinatura.

Para preços de assinatura comercial e pacotes de plano, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de solicitação e token por chave e por IP.
- O middleware de saldo rejeita solicitações faturáveis quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita solicitações quando o armazenamento da conta excede a cota do plano.
- A inferência verifica o acesso ao modelo, taxa de solicitações, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.
- O RAG verifica a contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas integradas verificam os limites diários de serviço.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites do plano

Um travessão (`—`) significa que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de preço baixo/básico | Modelos avançados | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada de modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Reserva do modelo de assinatura | Não incluído | 250 unidades/6h e 3.000 unidades/semana | 1.000 unidades/6h e 15.000 unidades/semana |
| Solicitações autônomas de texto-para-fala e transcrição de áudio | 3/min e 15/hora | 30/min | 300/min |

## RAG e coleções

| **RAG e coleções** |  |  |  |
| --- | --- | --- | --- |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3.000/min |
| Documentos de classificação de texto | 30/min e 300/dia | 1.000/min | 10.000/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |
| Buscas de reordenação | 30/min | 1.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 6 horas/dia | — |
| Inserções de documentos | 500/dia | 10.000/dia | — |
| Documentos JSONL por solicitação de importação | 1.000 | 10.000 | 1.000.000 |
| Injetor de mídia | 2 arquivos/dia | 30 arquivos/dia | 1.000 arquivos/dia |

## Ferramentas integradas

| **Ferramentas integradas** |  |  |  |
| --- | --- | --- | --- |
| Busca na web | 15/dia | 1.000/dia | 10.000/dia |
| Busca X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1.000/dia |
| Geração de documento e página web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 5.000/dia | 100.000/dia |
| Comandos Bash | 300/hora | 30.000/hora | — |

## Processamento em lote

| **Processamento em lote** |  |  |  |
| --- | --- | --- | --- |
| Itens de fluxo de trabalho processados | 500/dia | 100.000/dia | — |
| Arquivos por solicitação de importação | 1.000 | 1.000 | 1.000 |
| Tamanho total de importação | 100 MiB/solicitação | 100 MiB/solicitação | 100 MiB/solicitação |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |

## Conta e suporte

| **Conta e suporte** |  |  |  |
| --- | --- | --- | --- |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/mês | $0.20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

Solicitações de modelo integrado são limitadas tanto por contagem de solicitações quanto por tokens de entrada. Grupos de limite de taxa do modelo ajustam os limia de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limiar |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é de 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura AIVAX e utilizam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de incorporação padrão e é cobrada pelo trabalho de incorporação realizado.

Solicitações autônomas de texto-para-fala e transcrição de áudio compartilham a mesma cota de solicitações do plano. As sessões de voz usam o modelo em tempo real selecionado e estão sujeitas aos limites de acesso ao modelo, saldo e inferência aplicáveis, em vez desta cota de solicitações autônomas. A transcrição de entrada não é suportada atualmente dentro das sessões de voz.

O endpoint de importação JSONL rejeita uma solicitação quando atinge o limite de documentos por solicitação do plano. O limite de reordenação aplica‑se ao endpoint de reordenação autônomo e às buscas RAG que usam um reordenador, incluindo buscas realizadas através de AI Gateways e ferramentas MCP.

O limite Reflex conta o tempo gasto processando solicitações Reflex. Aplica‑se ao endpoint de reordenação autônomo e às buscas RAG que usam Reflex; entrada em cache não consome a cota separadamente. Solicitações que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](rag/reflex.md) para limites de solicitações, comportamento de cache e preços.

As ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa da cota, tente novamente após a janela de cota ser redefinida ou atualize a conta.

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitações |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hour, 1,000/day |
| Global por chave | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global por chave | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de solicitação e omitam superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).