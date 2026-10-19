---
{title: Observabilidade RAG,linkTitle: Observabilidade,weight: 50,group: RAG and collections,sourceHash: 3cc72477069fd207,aliases: [/docs/pt-br/rag/observability.html]}
---

# Observabilidade RAG

O [AIVAX Console](https://console.aivax.net) mostra como suas coleções são indexadas, quais buscas recebem e quão bem essas buscas são pontuadas. Use‑o para confirmar que uma importação foi concluída, encontrar perguntas que sua base de conhecimento responde mal e identificar conteúdo que nunca é recuperado.

## Visão geral das coleções

Abra **RAG Collections** na barra lateral do Console. Cada coleção mostra seu **Current state** como uma barra com três partes:

| Estado | Significado |
| --- | --- |
| Indexados | Documentos que são pesquisáveis com o modelo de incorporação atual da coleção. |
| Em fila | Documentos aguardando indexação. Ainda não são pesquisáveis. |
| Desatualizados | Documentos indexados com um modelo de incorporação diferente do atual da coleção. Continuam pesquisáveis, mas seus vetores podem ser menos precisos. |

Uma grande proporção de **Em fila** após uma importação é normal e diminui à medida que a indexação avança. Se documentos **Desatualizados** permanecerem, use **Update outdated documents** nas configurações da coleção para regenerar seus vetores; veja [Maintain a collection](collections.md#maintain-a-collection).

## Saúde da coleção

Selecione **View** em uma coleção para abrir sua aba **Browse documents**. Os cartões na parte superior resumem a coleção:

| Cartão | O que informa |
| --- | --- |
| Total de documentos | Todos os documentos na coleção, enfileirados e indexados. |
| Cobertura de consultas | Percentual de documentos que apareceram em pelo menos um resultado de busca entre as buscas registradas. Um valor baixo indica que grande parte do conteúdo nunca é recuperado. |
| Desempenho médio | Tempo médio de processamento de uma busca, em milissegundos. |
| Pontuação média | Pontuação média dos resultados retornados, de 0 a 1. Quanto maior, melhor. |

Cobertura de consultas baixa nem sempre é um problema: uma base de conhecimento ampla pode conter conteúdo que os usuários raramente perguntam. Ela merece atenção quando documentos que você espera que sejam usados nunca aparecem, o que costuma apontar para documentos muito longos, de tópicos mistos ou escritos de forma diferente da forma como os usuários perguntam.

A lista de documentos abaixo dos cartões mostra o estado, as tags, a referência e a contagem de tokens de cada documento, e pode ser filtrada por estado. Abra **Details** em um documento para ver seus timestamps, incluindo quando foi indexado pela última vez, e suas contagens de caracteres, palavras e tokens aproximados. O editor de documentos avisa quando um documento tem muitas ou poucas palavras para uma recuperação confiável; veja [Write good documents](documents.md#write-good-documents).

## Histórico de buscas

A aba **Transactions** lista as buscas realizadas na coleção, incluindo buscas feitas por **gateways de IA**, clientes MCP e suas aplicações. As buscas são mantidas por 2 horas no plano Free, 7 dias no Pro e 30 dias no Max.

Use o seletor **View** para escolher o que revisar:

- **Recente** mostra as buscas mais recentes.  
- **Baixa qualidade** mostra as buscas com menor pontuação. Comece aqui para encontrar perguntas que a coleção responde mal.  
- **Alta qualidade** mostra as buscas com maior pontuação.  

Cada busca exibe seu momento, consulta, número de resultados e três pontuações:

| Pontuação | Significado |
| --- | --- |
| Pontuação original | Similaridade vetorial entre a consulta e os documentos, antes do reordenamento. |
| Pontuação do reordenador | Pontuação atribuída pelo reordenador, com o nome do reordenador. Um hífen significa que nenhum reordenador foi usado. |
| Pontuação final | Pontuação usada para ordenar os resultados. |

Abra **Details** em uma busca para ver seu tempo de processamento, custo, pontuações e os documentos retornados, cada um com sua pontuação original, do reordenador e final, além de uma pré‑visualização do texto. Um documento que foi excluído posteriormente é exibido como inexistente.

### Diagnosticar uma busca de baixa qualidade

1. Leia a consulta e compare-a com os documentos retornados. Se o documento correto estiver ausente, o problema é de recuperação, não de classificação.  
2. Se o documento correto existir mas tiver pontuação baixa, verifique se seu texto usa os mesmos termos e linguagem da consulta e se mistura vários tópicos.  
3. Se a pontuação original for boa mas a pontuação final cair, compare os reordenadores; veja [Rerankers](reranking.md).  
4. Se nenhum documento cobrir a pergunta, adicione o conhecimento faltante à coleção.

## Testar buscas no playground

Selecione **Playground** em uma coleção para executar uma busca sem escrever código. Defina o texto da busca, pontuação mínima, número máximo de resultados, reordenador, expansão de referência e [advanced filters](document-filters.md), então selecione **Run query**. A aba **Visual** mostra os documentos ordenados com suas pontuações, conteúdos e metadados, e a resposta gerada quando você usa geração de respostas; a aba **JSON** exibe o resultado bruto.

Use o playground para reproduzir uma busca de baixa qualidade do histórico, ajustar opções e confirmar uma melhoria antes de alterar um **gateway de IA**. Para tempo de processamento, custo e pontuações por etapa, use os detalhes da busca em **Transactions**.

## Jobs do Media Injector

Arquivos importados com [Media Injector](documents.md#import-from-files-with-media-injector) são processados como jobs em segundo plano. Acompanhe‑os em **Batch > Media Processing**, que atualiza automaticamente e mostra a coleção, arquivos, estado, tempo decorrido, número de documentos produzidos, custo atual e custo estimado de cada job. Cancele jobs enfileirados ou em processamento, e tente novamente ou exclua os que falharam ou foram cancelados.

Após a conclusão de um job, seus documentos aparecem na coleção como **Em fila** até serem indexados.

## Custo e armazenamento

- **Analytics > Usage per resource** agrupa o uso por recurso, incluindo cada coleção, e fornece links para eles.  
- **Analytics > Monthly Reports** exibe o custo mensal de RAG, que inclui embeddings, consultas e reordenamento.  
- **Usage and limits** mostra o armazenamento usado em relação à cota do seu plano.

Execuções de desduplicação relatam seu resultado por meio de notificações de conta; veja [De-duplicator](collections.md#de-duplicator).
