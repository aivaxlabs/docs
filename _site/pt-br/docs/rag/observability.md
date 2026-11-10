Source: https://docs.aivax.net/pt-br/docs/rag/observability.html

# Observabilidade de RAG

O [Console AIVAX](https://console.aivax.net) mostra como suas coleções são indexadas, quais buscas elas recebem e quão bem essas buscas pontuam. Use-o para confirmar que uma importação foi concluída, encontrar perguntas que sua base de conhecimento responde mal e identificar conteúdo que nunca é recuperado.

## Visão geral das coleções

Abra **Coleções RAG** na barra lateral do Console. Cada coleção exibe seu **Estado atual** como uma barra com três partes:

| Estado | Significado |
| --- | --- |
| Indexado | Documentos que são pesquisáveis com o modelo de incorporação (embedding) atual da coleção. |
| Em fila | Documentos aguardando indexação. Eles ainda não são pesquisáveis. |
| Desatualizado | Documentos indexados com um modelo de incorporação diferente do atual da coleção. Eles permanecem pesquisáveis, mas seus vetores podem ser menos precisos. |

Uma proporção grande de documentos em Fila após uma importação é normal e diminui conforme a indexação avança. Se documentos Desatualizados permanecerem, use **Atualizar documentos desatualizados** nas configurações da coleção para regenerar seus vetores; consulte [Manter uma coleção](https://docs.aivax.net/pt-br/docs/rag/collections.md#maintain-a-collection).

## Saúde da coleção

Selecione **Visualizar** em uma coleção para abrir a aba **Navegar documentos**. Os cartões no topo resumem a coleção:

| Cartão | O que ele informa |
| --- | --- |
| Total de documentos | Todos os documentos na coleção, em fila e indexados. |
| Cobertura de consultas | Porcentagem de documentos que apareceram em pelo menos um resultado de busca entre as buscas registradas. Um valor baixo significa que muito do conteúdo nunca é recuperado. |
| Desempenho médio | Tempo médio de processamento de uma busca, em milissegundos. |
| Pontuação média | Pontuação média dos resultados retornados, de 0 a 1. Quanto maior, melhor. |

Cobertura de consulta baixa nem sempre é um problema: uma base de conhecimento ampla pode conter conteúdo sobre o qual os usuários raramente perguntam. Ela merece atenção quando documentos que você espera que sejam usados nunca aparecem, o que frequentemente aponta para documentos muito longos, com tópicos misturados ou escritos de forma diferente de como os usuários perguntam.

A lista de documentos abaixo dos cartões mostra o estado, as tags, a referência e a contagem de tokens de cada documento, e pode ser filtrada por estado. Abra **Detalhes** em um documento para ver seus carimbos de data/hora, incluindo quando foi indexado pela última vez, e suas contagens de caracteres, palavras e tokens aproximados. O editor de documentos alerta quando um documento tem muitas ou poucas palavras para recuperação confiável; consulte [Escrever bons documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md#write-good-documents).

## Histórico de buscas

A aba **Transações** lista as buscas realizadas na coleção, incluindo buscas feitas por Gateways de IA, clientes MCP e seus aplicativos. O tempo de retenção das buscas depende do plano; consulte [Retenção do histórico de buscas RAG](https://docs.aivax.net/pt-br/docs/limits.md#account-limits).

Use o seletor **Visualizar** para escolher o que revisar:

- **Recentes** mostra as buscas mais recentes.
- **Baixa qualidade** mostra as buscas com menor pontuação. Comece aqui para encontrar perguntas que a coleção responde mal.
- **Alta qualidade** mostra as buscas com maior pontuação.

Cada busca mostra seu momento, a consulta, o número de resultados e três pontuações:

| Pontuação | Significado |
| --- | --- |
| Pontuação original | Similaridade vetorial entre a consulta e os documentos, antes do reranking. |
| Pontuação do reranker | Pontuação atribuída pelo reranker, com o nome do reranker. Um traço significa que nenhum reranker foi usado. |
| Pontuação final | Pontuação usada para classificar os resultados. |

Abra **Detalhes** em uma busca para ver seu tempo de processamento, custo, pontuações e os documentos que ela retornou, cada um com sua pontuação original, de reranker e final, além de uma prévia do texto. Um documento que foi posteriormente excluído é mostrado como inexistente.

### Diagnosticar uma busca de baixa qualidade

1. Leia a consulta e compare-a com os documentos retornados. Se o documento correto estiver ausente, o problema é de recuperação, não de classificação.
2. Se o documento correto existir, mas tiver pontuação baixa, verifique se seu texto usa os mesmos termos e linguagem da consulta, e se ele mistura vários tópicos.
3. Se a pontuação original for boa, mas a pontuação final cair, compare os rankers; consulte [Rankers](https://docs.aivax.net/pt-br/docs/rag/reranking.md).
4. Se nenhum documento cobrir a pergunta, adicione o conhecimento faltante à coleção.

Para as etapas do pipeline que geralmente causam um resultado de baixa qualidade antes da execução da busca, consulte [RAG vs banco de dados vetorial](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Testar buscas no playground

Selecione **Playground** em uma coleção para executar uma busca sem escrever código. Defina o texto da busca, pontuação mínima, máximo de resultados, reranker, expansão de referência e [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md), depois selecione **Executar consulta**. A aba **Visual** mostra os documentos classificados com suas pontuações, conteúdos e metadados, e a resposta gerada quando você usa geração de respostas; a aba **JSON** mostra o resultado bruto.

Use o playground para reproduzir uma busca de baixa qualidade do histórico, ajustar opções e confirmar uma melhoria antes de alterar um Gateway de IA. Para tempo de processamento, custo e pontuações por etapa, use os detalhes da busca em **Transações**.

## Trabalhos do Media Injector

Arquivos importados com [Media Injector](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector) são processados como trabalhos em segundo plano. Acompanhe-os em **Lote > Processamento de Mídia**, que atualiza automaticamente e mostra a coleção, os arquivos, o estado, o tempo decorrido, o número de documentos produzidos, o custo atual e o custo estimado de cada trabalho. Cancele trabalhos em fila ou em processamento, e tente novamente ou exclua aqueles falhos ou cancelados.

Após a conclusão de um trabalho, seus documentos aparecem na coleção como Em Fila até serem indexados.

## Custo e armazenamento

- **Análises > Uso por recurso** agrupa o uso por recurso, incluindo cada coleção, e faz link para ela.
- **Análises > Relatórios Mensais** mostra o custo do RAG do mês, que inclui incorporações, consultas e reranking.
- **Uso e limites** mostra o armazenamento utilizado contra a cota do seu plano.

Os relatórios de deduplicação informam seu resultado através de notificações da conta; consulte [Deduplicador](https://docs.aivax.net/pt-br/docs/rag/collections.md#de-duplicator).
