Source: https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.html

# Segmentação de Texto

A segmentação de texto divide documentos de origem em cadeias semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela devolve segmentos para sua aplicação; não cria incorporações nem armazena documentos enviados.

Use quando um documento de origem precisa de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos da coleção. Se você já tem texto focado e autocontido, pode importá‑lo diretamente. Se quiser que o AIVAX processe arquivos de origem em documentos da coleção, veja [Media Injector](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector).

Para entender como a segmentação se relaciona com armazenamento, atualizações e recuperação, leia [where segmentation fits in a RAG pipeline](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Ignorar segmentação quando o texto já está focado

A segmentação se justifica em fontes longas e com múltiplos tópicos — manuais, artigos, transcrições — onde uma incoração por página borraria assuntos distintos. Não segmente texto que já contém uma ideia por unidade: respostas de FAQ, descrições de produtos, políticas curtas ou trechos já divididos podem entrar diretamente na coleção. Cada divisão desnecessária adiciona trabalho de indexação e corre o separar declarações que só fazem sentido juntas.

## O que torna um bom segmento

Um bom segmento é o menor trecho que ainda responde a uma pergunta por si só: uma declaração completa ou um grupo compacto de declarações sobre um sub‑tópico, tipicamente um parágrafo ou uma seção curta. Segmentos são mais úteis quando a fonte tem títulos claros, parágrafos e declarações completas — o segmentador preserva esses limites ao invés de cortar no meio do raciocínio.

Observe os modos de falha de fontes desordenadas. Tabelas perdem seus cabeçalhos, OCR elimina a estrutura de linhas, transcrições divagam entre tópicos e documentos exportados repetem cabeçalhos em todas as páginas. Revise os resultados dessas fontes antes de indexar e prefira limpar a fonte (corrigir títulos, remover conteúdo padrão) ao invés de pedir ao segmentador que adivinhe ao redor disso.

## Preparar texto de origem

Forneça o texto completo de origem sempre que possível, limpo conforme descrito acima.

Sem sanitização, os segmentos têm cerca de 300 tokens e cobrem todo o documento na ordem original, sem sobreposição. Os limites seguem a estrutura do documento e a similaridade semântica dos trechos vizinhos; documentos desse tamanho ou menores são retornados como um único segmento.

Use sanitização somente quando o conteúdo omitido for realmente irrelevante para a recuperação. Solicitações sanitizadas são processadas por um modelo de linguagem e levam mais tempo. Quando a redação exata da origem, a fidelidade legal ou a rastreabilidade completa são importantes, retenha e revise o texto de origem.

Para o contrato de solicitação, resposta, autenticação e erro suportado, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

## Preços e limites

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0.30/M tokens** |

Um travessão (`—`) indica que o plano não impõe limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |

A cota conta cada item no array `documents` da solicitação, não cada requisição HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.
