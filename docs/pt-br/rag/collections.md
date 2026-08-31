# Coleções e Documentos

AIVAX fornece um serviço RAG (Retrieval-Augmented Generation) para armazenar documentos e recuperá-los posteriormente através de busca semântica. Uma coleção é um grupo de documentos pertencente a uma conta. Cada documento armazena texto, tags opcionais, uma referência opcional, metadados opcionais e os vetores gerados pelo trabalho de indexação.

Coleções podem ser pesquisadas diretamente através da API RAG ou anexadas a um AI Gateway para que os documentos recuperados sejam injetados no contexto do modelo.

## Coleções

Use coleções para agrupar documentos que pertencem à mesma base de conhecimento, produto, locatário, idioma ou propósito operacional.

Uma coleção é o contêiner que você cria antes de adicionar conhecimento pesquisável. Pense nela como o limite de uma base de conhecimento: uma coleção de suporte pode conter respostas do centro de ajuda, uma coleção jurídica pode conter cláusulas de contrato e uma coleção de produto pode conter descrições, políticas e notas de solução de problemas. Mais tarde, você pode pesquisar a coleção diretamente com a API de [Busca Semântica](semantic-search.md), expô-la através de [Collections MCP](/docs/pt-br/mcp-utilities/collections-mcp) ou anexá-la a um [AI Gateway](/docs/pt-br/inference/ai-gateway) para que os documentos recuperados sejam inseridos automaticamente no contexto do modelo.

Cada coleção tem:

- Um ID de coleção exclusivo.
- Um nome.
- Contexto opcional e tags contextuais.
- Um conjunto de documentos.
- Estatísticas de uso baseadas em transações RAG.

A disponibilidade da coleção e os limites da conta dependem da configuração atual da conta. Consulte [Planos e limites](../limits.md) antes de criar coleções para uso em produção.

## Documentos

Um documento é a unidade que é indexada e recuperada. Ele deve ser pequeno o suficiente para corresponder a uma pergunta específica e completo o suficiente para ser útil por si só.

Esta é a parte que mais afeta a qualidade do RAG. Um documento não deve ser "tudo que você sabe" sobre uma fonte; deve ser um pedaço de conhecimento que pode ficar sozinho quando o modelo o lê posteriormente. Se um usuário perguntar sobre taxas de cancelamento, o documento recuperado já deve conter a regra, o produto, a condição e a exceção relevantes. Se a resposta só fizer sentido quando o modelo também vir a página anterior, o documento provavelmente depende demais do contexto ao redor.

Um bom documento geralmente tem:

- Um nome estável.
- Texto focado.
- Tags opcionais para filtragem ou manutenção.
- Metadados opcionais para dados específicos da aplicação.
- Um ID de referência opcional quando o documento é um fragmento de um item lógico maior.

Por exemplo, um manual de carro não deve ser indexado como um único documento. Indexe documentos separados para tópicos como iniciar o veículo, verificar a pressão dos pneus, emparelhar Bluetooth e substituir um farol. Cada documento deve incluir contexto suficiente para ser lido de forma independente. Para orientações mais amplas sobre fragmentação, consulte [Melhores Práticas para RAG](best-practices.md); para comportamento de consulta após indexação, veja [Busca Semântica](semantic-search.md).

## Campos do Documento

Ao importar documentos em JSONL, cada linha representa um documento que pode ser criado ou atualizado. O campo importante é `docid`: é o nome estável que a AIVAX usa para reconhecer o mesmo documento em importações futuras. Se você enviar o mesmo `docid` novamente com texto diferente, o documento existente será atualizado e reindexado. Se você precisar apenas preservar dados adicionais da aplicação, use `__meta` em vez de misturar esses dados no texto pesquisável.

O endpoint de importação JSONL aceita um objeto JSON por linha:

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `docid` | `string` | Yes | Nome de documento estável. Documentos existentes são correspondidos por este valor. |
| `text` | `string` | Yes | Conteúdo de texto para indexação semântica. |
| `__ref` | `string` | No | ID de referência usado para agrupar fragmentos relacionados. Comprimento máximo armazenado é 64 caracteres. |
| `__tags` | `string[]` | No | Tags para filtragem, navegação e manutenção. |
| `__meta` | `object` | No | Metadados retornados com detalhes do documento e resultados de busca. Metadados não são o texto semântico usado para embeddings. |

O nome do documento deve ser não vazio e está limitado pela API a 256 caracteres. O conteúdo armazenado do documento é obrigatório e não pode estar vazio.

## Inserções e Reindexação

Documentos são correspondidos pelo nome (`docid` em JSONL, `Name` na API de documento único).

Quando um documento é criado, ele é colocado na fila para indexação. Quando o texto de um documento existente muda, o documento é colocado novamente na fila e seus vetores são regenerados pelo indexador em segundo plano. Quando apenas `__meta` muda, os metadados são atualizados sem reindexar o texto do documento.

Os valores de referência e tags são armazenados com o documento. Na API de documento único, referência, tags ou metadados alterados podem atualizar um documento existente sem reindexar quando o texto permanece inalterado. No endpoint de importação JSONL, texto alterado coloca na fila a reindexação, alterações apenas de metadados atualizam os metadados sem reindexar, e texto alterado também pode atualizar referência, tags e metadados.

## Referências

Use `__ref` quando múltiplos documentos representam partes da mesma fonte lógica, como por exemplo:

- Seções do mesmo contrato.
- Cláusulas da mesma política.
- Fragmentos do mesmo PDF.
- Fragmentos de produto que devem ser mostrados juntos.

Quando a expansão de referência de busca está habilitada, se um fragmento corresponder, outros documentos na mesma coleção com a mesma referência podem ser incluídos na resposta.

## Importação de Arquivo de Mídia

O painel da AIVAX pode fazer upload de um arquivo de origem e processá-lo em documentos RAG com [Media Injector](media-injector.md). Use-o quando você tem um arquivo de origem mas ainda não tem texto de documento focado e autocontido preparado para importação direta ou JSONL.

O nome original do arquivo é normalizado para Unicode NFC e preservado durante o upload, incluindo letras acentuadas, scripts não latinos, pontuação tipográfica e outros caracteres Unicode. Você não precisa renomear um arquivo para um nome apenas ASCII antes de importá-lo.

Um trabalho do Media Injector é criado somente depois que cada fragmento do arquivo foi carregado e o painel conclui o upload com sucesso. Você pode então acompanhá-lo em **Batch > Media Processing**. Se nenhum trabalho aparecer, o upload não chegou à etapa de conclusão; tente novamente o upload e verifique o erro exibido pelo painel.

## Limites de Importação em Lote

A importação em lote é enviada como um arquivo JSONL no campo multipart `documents`.

Use a importação em lote quando você já tem muitos documentos preparados fora da AIVAX, como fragmentos gerados a partir de PDFs, catálogos de produtos, políticas ou artigos do centro de ajuda. Se você está criando ou atualizando um documento a partir de um fluxo de aplicação, o endpoint de documento único abaixo costuma ser mais fácil. Se você está preparando uma grande base de conhecimento, importe em lotes, aguarde a indexação e então teste a recuperação através da [Busca Semântica](semantic-search.md) antes de anexar a coleção a um gateway de produção.

Os limites atuais eficazes de linhas JSONL por requisição são:

| Plano | Máximo de linhas JSONL por requisição |
| --- | --- |
| Free | 999 |
| Pro | 9,999 |
| Max | 999,999 |

Os limites diários de inserção RAG são separados do limite de linhas por requisição:

| Plano | Inserções RAG por dia |
| --- | --- |
| Free | 500 |
| Pro | 10,000 |
| Max | Não limitado pela configuração atual do plano |

Se sua importação exceder o limite de requisição, divida-a em múltiplos arquivos. Se sua conta atingir o limite diário de inserção, aguarde o reset da janela de taxa ou faça upgrade do plano.

> [!WARNING]
> A indexação gera custo com base nos tokens de texto do documento quando documentos são criados ou quando seu texto muda.

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Gerenciamento de Documentos

### Criar ou atualizar documento

Este endpoint é útil quando sua aplicação gerencia documentos um de cada vez. Por exemplo, uma tela de administrador pode salvar uma entrada de FAQ, uma cláusula de política ou uma nota de produto diretamente em uma coleção. A AIVAX corresponde o documento pelo nome: texto alterado coloca na fila a reindexação, enquanto alterações apenas de metadados atualizam os metadados sem reindexar o conteúdo.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs%23CreateorUpdateDocument"></script>

### Listar documentos

O endpoint de navegação ajuda você a inspecionar o que já está dentro de uma coleção. Use-o quando precisar verificar uma importação, encontrar um documento pelo nome, revisar documentos na fila versus indexados, ou filtrar conteúdo antes de decidir atualizar, excluir ou reimportar parte da base de conhecimento.

Supported filters:

- `-t "tag"`: documentos contendo a tag.
- `-r "reference"`: documentos com o ID de referência exato.
- `-c "content"`: documentos cujo conteúdo contém o trecho de texto.
- `-n "name"`: documentos cujo nome contém o trecho de texto.
- `-i "id"`: documentos cujo ID contém o texto fornecido.

Supported states:

- `queued`: documentos aguardando indexação.
- `indexed`: documentos já indexados.

Supported sort values:

- `created_at_asce`
- `created_at_desc`
- `updated_at_asce`
- `updated_at_desc`
- `indexed_at_asce`
- `indexed_at_desc`

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>