Source: https://docs.aivax.net/pt-br/docs/rag/collections.html

# Coleções

AIVAX fornece um serviço RAG (Retrieval-Augmented Generation) para armazenar conhecimento e recuperá-lo posteriormente por meio de busca semântica. Uma coleção é uma base de conhecimento de propriedade da conta: ela agrupa os [documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md) que pertencem juntos e é a unidade que você pesquisa, anexa a um gateway de IA e mantém.

Compare o armazenamento vetorial com o pipeline de ingestão e recuperação ao redor em [RAG vs vector database](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Quando criar uma coleção

Use coleções para separar conhecimento que pertence a diferentes bases de conhecimento, produtos, locatários, idiomas ou propósitos operacionais. Por exemplo, uma coleção de suporte pode conter respostas do centro de ajuda, uma coleção jurídica pode conter cláusulas de contrato e uma coleção de produto pode conter descrições, políticas e notas de solução de problemas.

Prefira várias coleções focadas em vez de uma única coleção grande quando o conteúdo for pesquisado por diferentes públicos ou aplicações. Uma pesquisa pode incluir várias coleções ao mesmo tempo, enquanto o limite de uma coleção mantém conteúdo não relacionado fora dos resultados, simplifica a manutenção e mantém os [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) rápidos.

## O que uma coleção contém

Cada coleção tem:

- Um ID de coleção único.
- Um nome.
- Contexto opcional e tags contextuais.
- Um conjunto de documentos e seu estado de indexação.
- Estatísticas de uso baseadas nas pesquisas realizadas sobre ela.

O **contexto da coleção** descreve a base de conhecimento para um gateway de IA quando a coleção é usada para RAG, por exemplo o público, escopo e como o conteúdo deve ser usado. Mantenha-o durável e abrangente para toda a coleção; orientações de importação específicas da fonte pertencem à própria importação.

## Usar uma coleção

Após adicionar e indexar documentos, você pode:

- Pesquise-a diretamente com [Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md), opcionalmente restringida com [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) e reordenada com um [reranker](https://docs.aivax.net/pt-br/docs/rag/reranking.md).
- Anexe-a a um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) para que documentos recuperados sejam inseridos automaticamente no contexto do modelo.
- Exponha-a para clientes MCP através do [Collections and RAG MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).
- Monitore a qualidade de recuperação e o histórico de buscas no Console; veja [RAG Observability](https://docs.aivax.net/pt-br/docs/rag/observability.md).

## Manter uma coleção

Configurações da coleção no Console também fornecem ações de manutenção:

- **Atualizar documentos desatualizados** regenera vetores para documentos indexados com um modelo de embedding que difere do modelo atual da coleção. Regenerar vetores gera custos de embedding de documentos.
- **Redefinir coleção** remove os documentos da coleção mantendo a própria coleção.
- **Excluir coleção** remove a coleção e seus documentos.

Redefinir e excluir não podem ser desfeitos. Exporte a coleção como JSONL pela API primeiro quando precisar dos documentos novamente.

## Desduplicador

O desduplicador de coleção remove documentos repetidos de uma coleção. Use-o após mesclar várias fontes, reimportar conteúdo com novos nomes de documentos ou gerar documentos com [Media Injector](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector), quando o mesmo conhecimento pode existir mais de uma vez e sobrecarregar os resultados de busca com correspondências quase idênticas.

Inicie-o nas configurações da coleção no Console, em **Advanced settings > De-duplicate collection**, ou via API. Escolha o quão agressiva a comparação deve ser:

| Nível | Comportamento |
| --- | --- |
| Baixo | Remove apenas duplicatas exatas e documentos semânticos quase idênticos. |
| Médio | Padrão recomendado. Equilibra recall e segurança. |
| Alto | Correspondência semântica mais agressiva; pode remover documentos que são apenas muito semelhantes. |

O desduplicador executa em duas passagens. Primeiro remove documentos cujo texto é exatamente o mesmo, depois compara documentos indexados com seus vizinhos mais próximos na coleção e remove aqueles acima do nível de similaridade selecionado. Um documento de cada grupo de duplicatas é mantido. Documentos ainda aguardando indexação são comparados apenas na passagem exata, portanto aguarde a conclusão da indexação antes de executá-lo.

Antes de iniciar, o Console exibe uma estimativa das unidades de processamento e custo para o número atual de documentos. A tarefa roda em segundo plano, e apenas uma desduplicação pode ser executada por coleção por vez. Quando termina ou falha, a conta recebe uma notificação.

Documentos removidos são excluídos, não ocultados. Antes de excluí‑los, a AIVAX faz backup deles como arquivos JSONL contendo seu nome, texto, referência e tags, e a notificação de conclusão contém links para esses backups. Metadados não são incluídos no backup, portanto exporte a coleção primeiro quando os metadados dos documentos forem importantes.

O desduplicador é cobrado pelo tempo de processamento: uma unidade de processamento (PU) por segundo de processamento, com um mínimo de uma PU por tarefa. O multiplicador do plano se aplica.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Estimate%20Collection%20De-duplication)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Start%20Collection%20De-duplication)

## Gerenciar coleções pela API

As coleções podem ser criadas, listadas, inspecionadas, editadas, redefinidas, exportadas e excluídas pela API. Consulte a [API reference](https://inference.aivax.net/apidocs) para os endpoints de Collections.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Collection)

## Preços e limites

Indexação e busca são cobrados por uso de tokens. Respostas RAG geradas são cobradas separadamente do embedding de consulta, e seu preço varia com o modelo de sumarização. O multiplicador do plano se aplica.

| Descrição | Preço |
| --- | ---: |
| Embedding de texto da coleção | **$0.10/M tokens** |
| Busca - falha de cache de consulta | **$0.10/M tokens** |
| Busca - acerto de cache de consulta | Zero |
| Geração de resposta RAG | **~$0.50/M tokens**, excluindo taxas de consulta |
| Desduplicação de coleção | **$0.05/1k PUs** |

Free, Pro e Max incluem uma cota diária de embedding compartilhada entre buscas e inserções de documentos; veja [Included daily subscription allowances](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). Contas com [Data Sharing](https://docs.aivax.net/pt-br/docs/data-sharing.md) habilitado recebem desconto em embeddings de consulta elegíveis. Reranking e [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md#pricing-and-limits) são cobrados separadamente.

| Limite | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Coleções | 5 | — | — |
| Buscas | 20/min | 500/min | 3,000/min |
| Buscas de reranking | 30/min | 1,000/min | — |

Um travessão (`—`) indica que o plano não impõe um limite. Solicitações acima de um limite retornam `429 Too Many Requests`. Limites de inserção e importação de documentos estão listados em [Documents](https://docs.aivax.net/pt-br/docs/rag/documents.md#pricing-and-limits).
