Source: https://docs.aivax.net/pt-br/docs/rag/collections.html

# Coleções

A AIVAX oferece um serviço de RAG (Geração Aumentada por Recuperação) para armazenar conhecimento e recuperá-lo posteriormente por meio de busca semântica. Uma coleção é uma base de conhecimento de propriedade da conta: ela agrupa os [documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md) que pertencem juntos e é a unidade na qual você pesquisa, anexa a um Gateway de IA e mantém.

Compare o armazenamento vetorial com o pipeline de ingestão e recuperação ao redor em [RAG vs banco de dados vetorial](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Quando criar uma coleção

Use coleções para separar o conhecimento que pertence a diferentes bases de conhecimento, produtos, inquilinos, idiomas ou propósitos operacionais. Por exemplo, uma coleção de suporte pode conter respostas do centro de ajuda, uma coleção jurídica pode conter cláusulas contratuais e uma coleção de produto pode conter descrições, políticas e notas de solução de problemas.

Prefira várias coleções focadas a uma única coleção grande quando o conteúdo for pesquisado por diferentes públicos ou aplicativos. Uma pesquisa pode incluir várias coleções simultaneamente, enquanto os limites da coleção mantêm o conteúdo não relacionado fora dos resultados, simplificam a manutenção e mantêm os [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) rápidos.

## O que uma coleção contém

Cada coleção possui:

- Um ID de coleção exclusivo.
- Um nome.
- Contexto e tags contextuais opcionais.
- Um conjunto de documentos e seu estado de indexação.
- Estatísticas de uso baseadas nas pesquisas realizadas nela.

O **contexto da coleção** descreve a base de conhecimento para um Gateway de IA quando a coleção é usada para RAG, por exemplo, o público-alvo, o escopo e como o conteúdo deve ser usado. Mantenha-o durável e amplo para a coleção; as orientações específicas da fonte para importação pertencem à própria importação.

## Usar uma coleção

Após adicionar e indexar documentos, você pode:

- Pesquisar diretamente com [Busca](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md), opcionalmente restringida com [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) e reordenada com um [reranker](https://docs.aivax.net/pt-br/docs/rag/reranking.md).
- Anexá-la a um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) para que os documentos recuperados sejam colocados automaticamente no contexto do modelo.
- Expor aos clientes MCP através do [Collections and RAG MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).
- Monitorar sua qualidade de recuperação e histórico de buscas no Console; consulte [Observabilidade de RAG](https://docs.aivax.net/pt-br/docs/rag/observability.md).

## Manter uma coleção

As configurações da coleção no Console também fornecem ações de manutenção:

- **Atualizar documentos desatualizados** regenera vetores para documentos indexados com um modelo de incorporação diferente do modelo atual da coleção. A regeneração de vetores incorre em custos de incorporação de documentos.
- **Redefinir coleção** remove os documentos da coleção, mantendo a própria coleção.
- **Excluir coleção** remove a coleção e seus documentos.

Redefinir e excluir não podem ser desfeitos. Exporte a coleção como JSONL por meio da API primeiro se precisar de seus documentos novamente.

## Desduplicador

O desduplicador de coleções remove documentos repetidos de uma coleção. Use-o após mesclar várias fontes, reimportar conteúdo sob novos nomes de documento ou gerar documentos com o [Media Injector](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector), quando o mesmo conhecimento pode existir mais de uma vez e poluir os resultados da busca com correspondências quase idênticas.

Inicie-o nas configurações da coleção no Console, em **Configurações avançadas > Desduplicar coleção**, ou por meio da API. Escolha quão agressiva deve ser a comparação:

| Nível | Comportamento |
| --- | --- |
| Baixo | Remove apenas duplicatas exatas e documentos semânticos quase idênticos. |
| Médio | Padrão recomendado. Equilibra recall e segurança. |
| Alto | Correspondência semântica mais agressiva; pode remover documentos que são apenas muito semelhantes. |

O desduplicador executa duas etapas. Primeiro, ele remove documentos cujo texto é exatamente igual, depois compara os documentos indexados com seus vizinhos mais próximos na coleção e remove aqueles acima do nível de similaridade selecionado. Um documento de cada grupo de duplicatas é mantido. Documentos ainda aguardando indexação são comparados apenas na etapa exata, portanto, aguarde a finalização da indexação antes de executá-lo.

Antes de iniciar, o Console mostra uma estimativa das unidades de processamento e do custo para o número atual de documentos. A tarefa é executada em segundo plano, e apenas uma desduplicação pode ser executada por coleção por vez. Quando termina ou falha, a conta recebe uma notificação.

Os documentos removidos são excluídos, não ocultos. Antes de excluí-los, a AIVAX faz backup deles como arquivos JSONL com seu nome, texto, referência e tags, e a notificação de conclusão vincula-se a esses backups. Metadados não estão incluídos no backup, portanto, exporte a coleção primeiro quando os metadados do documento forem importantes.

O desduplicador é cobrado pelo tempo de processamento: uma unidade de processamento (PU) por segundo de processamento, com um mínimo de uma PU por tarefa. O multiplicador do plano se aplica.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Estimate%20Collection%20De-duplication)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Start%20Collection%20De-duplication)

## Gerenciar coleções por meio da API

Coleções podem ser criadas, listadas, inspecionadas, editadas, redefinidas, exportadas e excluídas por meio da API. Consulte a [referência da API](https://inference.aivax.net/apidocs) para os endpoints de Coleções.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Collection)

## Preços e limites

Indexação e busca são cobradas pelo uso de tokens. As respostas geradas de RAG são cobradas separadamente da incorporação da consulta, e seu preço varia conforme o modelo de resumo. O multiplicador do plano se aplica.

| Descrição | Preço |
| --- | ---: |
| Incorporação de texto da coleção | **$0,015/M tokens** |
| Busca - cache miss na consulta | **$0,015/M tokens** |
| Busca - cache hit na consulta | Zero |
| Geração de resposta RAG | **~$0,50/M tokens**, excluindo taxas de consulta |
| Desduplicação de coleção | **$0,05/1k PUs** |

Todo plano inclui uma cota diária de incorporação compartilhada por buscas e inserções de documentos; consulte [Cotas diárias de assinatura incluídas](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). Contas com [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md) habilitado recebem um desconto nas incorporações de consulta elegíveis. Reordenação e [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md#pricing-and-limits) são cobrados separadamente.

O número de coleções, buscas, solicitações de reordenação e inserções de documentos depende do plano; consulte [Limites de RAG e coleções](https://docs.aivax.net/pt-br/docs/limits.md#rag-and-collections). Solicitações acima de um limite retornam `429 Too Many Requests`.
