Source: https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.html

# Segmentação de Texto

A segmentação de texto divide documentos fonte em strings semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela retorna segmentos para o seu aplicativo; não cria incorporações (embeddings) nem armazena os documentos submetidos.

Use-a quando um documento fonte precisar de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos na coleção. Se você já tiver texto focado e autocontido, poderá importá-lo diretamente. Se quiser que a AIVAX processe arquivos fonte em documentos da coleção, consulte [Injetor de Mídia](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector). Para um tutorial completo que transforma um PDF em pedaços segmentados e importáveis, consulte [PDF para Markdown para RAG](https://aivax.net/blog/pdf-to-markdown-for-rag-chunks-jsonl/).

Para entender como a segmentação se relaciona com armazenamento, atualizações e recuperação, leia [onde a segmentação se encaixa em um pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Ignore a segmentação quando o texto já estiver focado

A segmentação justifica-se em fontes longas e multitemáticas — manuais, artigos, transcrições — onde uma única incorporação por página borraria assuntos distintos entre si. Não segmente texto que já seja uma ideia por unidade: respostas de FAQ, descrições de produtos, políticas curtas ou trechos pré-divididos podem ir direto para a coleção. Cada divisão desnecessária adiciona trabalho de indexação e corre o risco de separar declarações que só fazem sentido juntas.

## O que constitui um bom segmento

Um bom segmento é o menor trecho que ainda responde a uma pergunta por si só: uma declaração completa ou um grupo apertado de declarações sobre um único subtópico, tipicamente um parágrafo ou uma seção curta. Os segmentos são mais úteis quando a fonte possui cabeçalhos claros, parágrafos e declarações completas — o segmentador preserva esses limites em vez de cortar no meio do pensamento.

Observe os modos de falha de fontes desordenadas. Tabelas perdem seus cabeçalhos, o OCR perde a estrutura de linhas, as transcrições divagam entre tópicos e os documentos exportados repetem cabeçalhos rodantes em cada página. Revise os resultados dessas fontes antes da indexação e prefira limpar a fonte (corrigindo cabeçalhos, removendo textos padrão) a pedir ao segmentador que tente adivinhar contornando esses problemas.

## Prepare o texto fonte

Forneça texto fonte completo sempre que possível, limpo conforme descrito acima.

Sem sanitização, os segmentos visam cerca de 300 tokens e cobrem todo o documento na ordem original, sem sobreposição. Os limites seguem a estrutura do documento e a similaridade semântica das passagens vizinhas; documentos de tamanho aproximadamente igual ou inferior são retornados como um único segmento.

Use a sanitização apenas quando o conteúdo omitido for genuinamente irrelevante para a recuperação. Solicitações sanitizadas são processadas por um modelo de linguagem e levam mais tempo. Quando a redação exata da fonte, fidelidade legal ou rastreabilidade completa forem importantes, mantenha e revise o texto fonte em vez disso.

Para a solicitação suportada, resposta, autenticação e contrato de erro, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

## Preços e limites

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0,10/M tokens** |

Um travessão (`—`) indica que o plano não impõe limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |

A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retornará `429 Too Many Requests`.
