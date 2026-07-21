# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e janelas de reserva do modelo de assinatura.

Para preços de assinatura comercial e empacotamento de planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves API ausentes, expiradas ou desconhecidas.  
- As chaves API públicas são restritas a rotas públicas e possuem limites de requisição e token por chave e por IP.  
- O middleware de saldo rejeita requisições faturáveis quando o saldo da conta está abaixo do mínimo exigido.  
- O middleware de armazenamento rejeita requisições quando o armazenamento da conta excede a cota do plano.  
- A inferência verifica o acesso ao modelo, taxa de requisição, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.  
- O RAG verifica a contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.  
- Ferramentas integradas verificam os limites diários de serviço.  
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites do plano

Um travessão (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo preço/básicos | Modelos avançados | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Requisições de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada de modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Requisições BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 tokens de entrada | — | — |
| Reserva do modelo de assinatura | Não incluído | 250 unidades/6h e 3.000 unidades/semana | 1.000 unidades/6h e 15.000 unidades/semana |
| Requisições texto-para-fala | 3/min e 15/hora | 30/min | 300/min |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3,000/min |
| Buscas de reclassificação | 30/min | 1,000/min | — |
| Tokens de entrada Reflex | 128,000/min | 1,000,000/min | 50,000,000/min |
| Inserções de documento | 500/dia | 10,000/dia | — |
| Documentos JSONL por requisição de importação | 1,000 | 10,000 | 1,000,000 |
| Processamento de arquivos compostos | Não disponível | 3 arquivos/dia | 10 arquivos/dia |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/dia | 1,000/dia | 10,000/dia |
| Busca X/Twitter | Não disponível | 1,000/dia | 10,000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1,000/dia |
| Geração de documentos e páginas web | 5/dia | 1,000/dia | 50,000/dia |
| Geração e edição de imagens | 5/dia | 500/dia | 5,000/dia |
| Ações gerais de serviço | 30/dia | 5,000/dia | 100,000/dia |
| Comandos Bash | 30/hora | 1,500/hora | 10,000/hora |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/dia | 100,000/dia | — |
| Arquivos por requisição de importação | 1,000 | 1,000 | 1,000 |
| Tamanho total de importação | 100 MB/request | 100 MB/request | 100 MB/request |
| Tamanho de arquivo importado único | 10 MB | 10 MB | 10 MB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioridade | Dedicado |

Requisições de modelo integrado são limitadas tanto por contagem de requisições quanto por tokens de entrada. Grupos de limite de taxa do modelo ajustam os limites de contagem de requisições:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 requisições de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limite ajustado é 100 requisições por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as requisições ainda passam pela infraestrutura AIVAX e usam o limite BYOK do plano.

O endpoint de importação JSONL rejeita uma requisição quando atinge o limite de documentos por requisição do plano. O limite de reclassificação se aplica a buscas RAG que usam um reclassificador, incluindo buscas realizadas através de AI Gateways e ferramentas MCP.

O limite Reflex conta todos os tokens de entrada de consulta e documento relatados para uma requisição, incluindo tokens de entrada em cache. Requisições que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](rag/reflex.md) para limites de requisição, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa da cota, tente novamente após o reset da janela de cota ou atualize a conta.

## Chaves API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de requisição |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1,000/dia |
| Global por chave | 10/5s, 60/min, 1,500/hora, 10,000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/dia |
| Global por chave | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e completações de chat. Para completações de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de requisição e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](authentication.md).