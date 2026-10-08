Source: http://localhost:1313/pt-br/docs/rag/collections.html

# Coleções e Documentos

AIVAX fornece um serviço RAG (Retrieval‑Augmented Generation) para armazenar documentos e recuperá‑los posteriormente por meio de busca semântica. Uma coleção é um grupo de documentos pertencente a uma conta. Cada documento armazena texto, tags opcionais, uma referência opcional, metadados opcionais e os vetores gerados pelo trabalho de indexação.

Coleções podem ser pesquisadas diretamente através da API RAG ou vinculadas a um AI Gateway para que documentos recuperados sejam injetados no contexto do modelo.

Compare o armazenamento de vetores com o pipeline de ingestão e recuperação em [RAG vs vector database](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Coleções

Use coleções para agrupar documentos que pertencem à mesma base de conhecimento, produto, locatário, idioma ou finalidade operacional.

Crie uma coleção antes de adicionar conhecimento pesquisável. Por exemplo, uma coleção de suporte pode conter respostas do centro de ajuda, uma coleção jurídica pode conter cláusulas de contrato e uma coleção de produto pode conter descrições, políticas e notas de solução de problemas.

Após adicionar e indexar documentos, pesquise a coleção diretamente com a API [Semantic Search](http://localhost:1313/pt-br/docs/rag/semantic-search.md), exponha‑a através de [Collections MCP](http://localhost:1313/pt-br/docs/mcp-utilities/collections-mcp.md) ou anexe‑a a um [AI Gateway](http://localhost:1313/pt-br/docs/inference/ai-gateway.md) para que documentos recuperados sejam colocados automaticamente no contexto do modelo.

Cada coleção possui:

- Um ID de coleção único.
- Um nome.
- Contexto opcional e tags contextuais.
- Um conjunto de documentos.
- Estatísticas de uso baseadas em transações RAG.

A disponibilidade da coleção e os limites da conta dependem da configuração atual da conta. Consulte [Plans and limits](http://localhost:1313/pt-br/docs/limits.md) antes de criar coleções para uso em produção.

## Documentos

Um documento é a unidade que é indexada e recuperada. Ele deve ser pequeno o suficiente para corresponder a uma pergunta específica e suficientemente completo para ser útil por si só.

Esta é a parte que mais afeta a qualidade do RAG. Um documento não deve ser “tudo o que você sabe” sobre uma fonte; ele deve ser um pedaço de conhecimento que possa ficar sozinho quando o modelo o lê mais tarde. Se um usuário perguntar sobre taxas de cancelamento, o documento recuperado já deve conter a regra, produto, condição e exceção relevantes. Se a resposta só fizer sentido quando o modelo também vir a página anterior, o documento provavelmente depende demais do contexto circundante.

Um bom documento geralmente tem:

- Um nome estável.
- Texto focado.
- Tags opcionais para filtragem ou manutenção.
- Metadados opcionais para dados específicos da aplicação.
- Um ID de referência opcional quando o documento é um fragmento de um item lógico maior.

Por exemplo, um manual de carro não deve ser indexado como um único documento. Indexe documentos separados para tópicos como ligar o veículo, verificar a pressão dos pneus, emparelhar Bluetooth e substituir um farol. Cada documento deve incluir contexto suficiente para ser lido de forma independente. Para orientações mais amplas de fragmentação, veja [Best Practices for RAG](http://localhost:1313/pt-br/docs/rag/best-practices.md); para comportamento de consulta após indexação, veja [Semantic Search](http://localhost:1313/pt-br/docs/rag/semantic-search.md).

## Campos do Documento

Ao importar documentos em JSONL, cada linha representa um documento que pode ser criado ou atualizado. Use um `docid` estável para que AIVAX reconheça o mesmo documento em importações futuras. Enviar o mesmo `docid` com texto diferente atualiza e reindexa o documento existente.

Para dados de aplicação extras que não pertencem ao texto pesquisável, use `__meta`.

O endpoint de importação JSONL aceita um objeto JSON por linha:

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `docid` | `string` | Sim | Nome estável do documento. Documentos existentes são correspondidos por este valor. |
| `text` | `string` | Sim | Conteúdo de texto a ser indexado semanticamente. |
| `__ref` | `string` | Não | ID de referência usado para agrupar fragmentos relacionados. Comprimento máximo armazenado é 64 caracteres. |
| `__tags` | `string[]` | Não | Tags para filtragem, navegação e manutenção. |
| `__meta` | `object` | Não | Metadados retornados com detalhes do documento e resultados de busca. Metadados não são o texto semântico usado para embeddings. |

O nome do documento deve ser não vazio e é limitado pela API a 256 caracteres. O conteúdo armazenado do documento é obrigatório e não pode estar vazio.

## Inserções e Reindexação

Documentos são correspondidos pelo nome (`docid` em JSONL, `Name` na API de documento único).

Quando um documento é criado, ele é enfileirado para indexação. Quando o texto de um documento existente muda, ele é enfileirado novamente e seus vetores são regenerados pelo indexador em segundo plano. Quando apenas `__meta` muda, os metadados são atualizados sem reindexar o texto do documento.

Valores de referência e tags são armazenados com o documento. Na API de documento único, referência, tags ou metadados alterados podem atualizar um documento existente sem reindexar quando o texto permanece inalterado. No endpoint de importação JSONL, texto alterado enfileira reindexação, alterações apenas de metadados atualizam metadados sem reindexar, e texto alterado também pode atualizar referência, tags e metadados. Uma entrada JSONL que altera apenas a referência ou tags é ignorada.

## Referências

Use `__ref` quando múltiplos documentos representam partes da mesma fonte lógica, como:

- Seções do mesmo contrato.
- Cláusulas da mesma política.
- Fragmentos do mesmo PDF.
- Fragmentos de produto que devem ser exibidos juntos.

Quando a expansão de referência de busca está habilitada, se um fragmento corresponder, outros documentos na mesma coleção com a mesma referência podem ser incluídos na resposta.

## Importação de Arquivo de Mídia

O painel AIVAX pode fazer upload de um arquivo fonte e processá‑lo em documentos RAG com o [Media Injector](http://localhost:1313/pt-br/docs/rag/media-injector.md). Use‑o quando você tem um arquivo fonte mas ainda não possui texto de documento focado e autocontido preparado para importação direta ou JSONL.

O nome original do arquivo é normalizado para Unicode NFC e preservado durante o upload, incluindo letras acentuadas, scripts não latinos, pontuação tipográfica e outros caracteres Unicode. Você não precisa renomear o arquivo para um nome somente ASCII antes de importá‑lo.

Um trabalho do Media Injector é criado somente depois que cada fragmento do arquivo foi enviado e o painel conclui o upload com sucesso. Você pode então acompanhá‑lo em **Batch > Media Processing**. Se nenhum trabalho aparecer, o upload não chegou à etapa de conclusão; tente novamente e verifique o erro exibido pelo painel.

## Limites de Importação em Lote

A importação em lote é enviada como um arquivo JSONL no campo multipart `documents`.

Use importação em lote quando você já tem muitos documentos preparados fora do AIVAX, como fragmentos gerados a partir de PDFs, catálogos de produtos, políticas ou artigos do centro de ajuda. Se você está criando ou atualizando um documento a partir de um fluxo de aplicação, o endpoint de documento único abaixo costuma ser mais fácil. Se estiver preparando uma grande base de conhecimento, importe em lotes, aguarde a indexação e depois teste a recuperação através de [Semantic Search](http://localhost:1313/pt-br/docs/rag/semantic-search.md) antes de anexar a coleção a um gateway de produção.

Os limites de linhas JSONL por requisição e os limites diários de inserção RAG variam conforme o plano; veja [Plans and limits](http://localhost:1313/pt-br/docs/limits.md#plan-limits). Se sua importação exceder o limite de requisição, divida em vários arquivos. Se sua conta atingir o limite diário de inserção, aguarde o intervalo de taxa reiniciar ou faça upgrade do plano.

> [!WARNING]
> A indexação gera custo baseado nos tokens de texto do documento quando documentos são criados ou quando seu texto muda.

A referência de API incorporada é a fonte de verdade para o contrato de requisição e resposta de importação.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Index%20Documents%20(JSONL))

## Gerenciamento de Documentos

### Criar ou atualizar documento

Este endpoint é útil quando sua aplicação gerencia documentos um de cada vez. Por exemplo, uma tela de admin pode salvar uma entrada de FAQ, uma cláusula de política ou uma nota de produto diretamente em uma coleção. AIVAX corresponde o documento pelo nome: texto alterado enfileira reindexação, enquanto alterações apenas de metadados atualizam os metadados sem reindexar o conteúdo.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20or%20Update%20Document)

### Listar documentos

O endpoint de navegação ajuda a inspecionar o que já está dentro de uma coleção. Use‑o quando precisar verificar uma importação, encontrar um documento pelo nome, revisar documentos enfileirados versus indexados, ou filtrar conteúdo antes de decidir atualizar, excluir ou reimportar parte da base de conhecimento.

Filtros suportados:

- `-t "tag"`: documentos que contêm a tag.
- `-r "reference"`: documentos com o ID de referência exato.
- `-c "content"`: documentos cujo conteúdo contém o trecho de texto.
- `-n "name"`: documentos cujo nome contém o trecho de texto.
- `-i "id"`: documentos cujo ID contém o texto fornecido.

Estados suportados:

- `queued`: documentos aguardando indexação.
- `indexed`: documentos já indexados.

Valores de ordenação suportados:

- `created_at_asce`
- `created_at_desc`
- `updated_at_asce`
- `updated_at_desc`
- `indexed_at_asce`
- `indexed_at_desc`

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Browse%20Documents)
