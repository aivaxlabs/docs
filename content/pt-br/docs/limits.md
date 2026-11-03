---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 40,group: Introduction,sourceHash: afc72640d6ee223d,aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

A AIVAX possui três planos de conta: **Gratuito**, **Pro** e **Max**. O plano atual controla o acesso ao modelo, limites de taxa em nível de conta, cota de armazenamento, retenção de conversas e cotas diárias de serviço incluídas.

Para preços de assinatura comercial e pacotes de planos, acesse a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta apenas os limites em nível de conta. Os limites que pertencem a um produto específico, como pesquisas RAG, pesquisa na web, Testes Agentic ou Lote (Batch), estão documentados na página desse produto.

## Limites da conta

Um travessão (`—`) indica que o plano não impõe nenhum limite. Podem ainda aplicar-se limites específicos do modelo, gateway, provedor ou produto.

| Recurso | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1,25x | 1,05x | 1,00x |
| Requisições de modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada do modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Requisições BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Atualmente desativado | Atualmente desativado | Atualmente desativado |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0,50/GB/mês | $0,20/GB/mês |
| Retenção de conversa | 2 horas | 2 dias | 30 dias |
| Nível de suporte | E-mail | Prioritário | Dedicado |

As requisições de modelo integrado são limitadas tanto pela contagem de requisições quanto pelos tokens de entrada. Os grupos de limite de taxa do modelo ajustam os limites de contagem de requisições:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1,0x |
| Descontado | 0,5x |
| Baixo | 0,3x |
| Gratuito | 0,1x |

Por exemplo, uma conta Pro tem normalmente 200 requisições de modelo integrado por minuto. Com um grupo de modelo `Descontado`, o limite ajustado é de 100 requisições por minuto.

O BYOK utiliza uma chave de provedor configurada no gateway em vez de um modelo integrado da AIVAX, mas as requisições ainda passam pela infraestrutura da AIVAX e utilizam o limite BYOK do plano.

Os limites de taxa são compartilhados entre todas as chaves de API da mesma conta. Uma requisição que excederia uma janela ativa retorna `429 Too Many Requests`; ajuste o ritmo das requisições e use retentativas com backoff limitado.

Contas personalizadas usam os limites do plano Pro multiplicados por um fator acordado para a conta, ou não possuem limites de taxa de plano quando nenhum fator está definido.

## Cotar diárias de assinatura incluídas

Os planos Gratuito, Pro e Max incluem cotas diárias separadas para os serviços abaixo. Cada comparação refere-se ao mesmo serviço no plano nomeado, não a um saldo de crédito compartilhado ou a um número garantido de requisições. A cota não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem cotas de assinatura.

| Serviço incluído | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Pesquisa RAG e embeddings de inserção | Cota base | 25× Gratuito | 4× Pro |
| Reordenamento com Reflex | Cota base | 5× Gratuito | 10× Pro |
| Decisões semânticas com modelos elegíveis | Cota base | 2,5× Gratuito | 2× Pro |
| Busca e extração OCR | Cota base | 10× Gratuito | 5× Pro |

Pesquisas RAG e inserções de documentos compartilham a cota de embedding. Ela não cobre geração de respostas, processamento de mídia, extração de documentos ou resumo, classificação de texto ou segmentação. Um embedding de consulta servido a partir do cache não consome essa cota. O Reflex utiliza uma cota de reordenamento separada que inclui entradas em cache e não em cache. A cota de decisão semântica cobre apenas modelos de decisão elegíveis; consulte [Decisões Semânticas](data-processing/decisions.md#usage-and-cost). A conversão JSON opcional da Busca é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, o embedding de um termo de consulta individual, uma chamada de reordenamento, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou faturado integralmente às taxas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10% acima de sua capacidade base. Um item que excedesse essa margem mantém a cota inalterada e é faturado normalmente. Uma única requisição pode conter vários itens, portanto, alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são reiniciadas à meia-noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de reinício; o uso pode exceder 100% enquanto estiver dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto, a inferência de modelos de texto e a geração de respostas RAG permanecem sendo medidas separadamente. As cotas não contornam requisitos de saldo ou limites de taxa. Consulte [Preços](pricing.md) para saber como os itens não cobertos são faturados. Para um tutorial sobre como testar um pipeline de recuperação dentro dessas cotas, consulte [API RAG Gratuita: limites de embeddings, reordenamento e OCR](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

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

Chaves públicas podem ser usadas para conclusões de chat, nos endpoints `/api/v1/generations/*`, pesquisa semântica RAG e geração de respostas RAG. Para conclusões de chat, chaves públicas também exigem um UUID completo do Gateway de IA, restringem parâmetros de requisição e omitem superfícies de ferramentas do lado do servidor. Consulte [Autenticação](authentication.md).
