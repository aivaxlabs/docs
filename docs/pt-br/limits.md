# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e janelas de reserva do modelo de assinatura.

Para preços de assinatura comercial e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de solicitações e tokens por chave e por IP.
- O middleware de saldo rejeita solicitações pagas quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita solicitações quando o armazenamento da conta excede a cota do plano.
- A inferência verifica o acesso ao modelo, taxa de solicitações, taxa de tokens de entrada, taxa BYOK e tamanho do contexto do plano Free.
- O RAG verifica a contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- Ferramentas incorporadas verificam os limites diários de serviço.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites do plano

Um travessão (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inference** |  |  |  |
| Acesso ao modelo | Modelos de baixo preço/básicos | Modelos avançados | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min and 500/day | 200/min | — |
| Tokens de entrada do modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 input tokens | — | — |
| Reserva do modelo de assinatura | Não incluído | 250 units/6h and 3,000 units/week | 1,000 units/6h and 15,000 units/week |
| Solicitações de texto para fala | 3/min and 15/hour | 30/min | 300/min |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3,000/min |
| Documentos de segmentação de texto | 10/min and 100/day | 300/min | 2,500/min |
| Buscas de reclassificação | 30/min | 1,000/min | — |
| Tokens de entrada Reflex | 128,000/min | 1,000,000/min | 50,000,000/min |
| Inserções de documento | 500/day | 10,000/day | — |
| Documentos JSONL por solicitação de importação | 1,000 | 10,000 | 1,000,000 |
| Processamento de arquivos compostos | Não disponível | 3 files/day | 10 files/day |
| **Ferramentas incorporadas** |  |  |  |
| Busca na web | 15/day | 1,000/day | 10,000/day |
| Busca X/Twitter | Não disponível | 1,000/day | 10,000/day |
| Busca avançada na web | Não disponível | 100/day | 1,000/day |
| Geração de documento e página web | 5/day | 1,000/day | 50,000/day |
| Geração e edição de imagem | 5/day | 500/day | 5,000/day |
| Ações gerais de serviço | 30/day | 5,000/day | 100,000/day |
| Comandos Bash | 30/hour | 1,500/hour | 10,000/hour |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/day | 100,000/day | — |
| Arquivos por solicitação de importação | 1,000 | 1,000 | 1,000 |
| Tamanho total de importação | 100 MB/request | 100 MB/request | 100 MB/request |
| Tamanho de arquivo importado único | 10 MB | 10 MB | 10 MB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversas | 2 hours | 2 days | 30 days |
| Nível de suporte | E-mail | Prioridade | Dedicado |

Solicitações de modelo integrado são limitadas tanto pela contagem de solicitações quanto por tokens de entrada. Grupos de limite de taxa de modelo ajustam os limiares de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limiar |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limiar ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura AIVAX e utilizam o limite BYOK do plano.

A cota de segmentação de texto conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.

O endpoint de importação JSONL rejeita uma solicitação quando atinge o limite de documentos por solicitação do plano. O limite de reclassificação se aplica ao endpoint de reclassificação autônoma e às buscas RAG que utilizam um reclassificador, incluindo buscas realizadas através de AI Gateways e ferramentas MCP.

O limite Reflex conta todos os tokens de entrada de consulta e documento relatados para uma solicitação, incluindo tokens de entrada em cache. Solicitações que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](rag/reflex.md) para limites de solicitação, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa da cota, tente novamente após o reset da janela de cota ou faça upgrade da conta.

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitações |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hour, 1,000/day |
| Global por chave | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Escopo | Limites de tokens |
| --- | --- |
| Por endereço remoto | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global por chave | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de solicitação e omitam superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).