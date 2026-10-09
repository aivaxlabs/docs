Source: https://docs.aivax.net/pt-br/docs/rag/text-segmentation.html

# Segmentação de Texto

A segmentação de texto divide documentos de origem em sequências semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela devolve segmentos para sua aplicação; não cria embeddings nem armazena documentos enviados.

Use-a quando um documento de origem precisa de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos da coleção. Se você já tem texto focado e autocontido, pode importá‑lo diretamente. Se quiser que o AIVAX processe arquivos de origem em documentos da coleção, veja [Media Injector](https://docs.aivax.net/pt-br/docs/rag/media-injector.md).

Consulte [onde a segmentação se encaixa em um pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/), ao lado de armazenamento, atualizações e recuperação.

## Ignorar a segmentação quando o texto já está focado

A segmentação justifica‑se em fontes longas e com múltiplos tópicos — manuais, artigos, transcrições — onde um embedding por página borraria assuntos distintos. Não segmente texto que já contém uma ideia por unidade: respostas de FAQ, descrições de produtos, políticas curtas ou trechos já divididos podem ir direto para a coleção. Cada divisão desnecessária adiciona trabalho de indexação e corre o separar declarações que só fazem sentido juntas.

## O que faz um bom segmento

Um bom segmento é o menor trecho que ainda responde a uma pergunta por si só: uma declaração completa ou um grupo compacto de declarações sobre um sub‑tópico, tipicamente um parágrafo ou uma seção curta. Segmentos são mais úteis quando a fonte possui títulos claros, parágrafos e declarações completas — o segmentador preserva esses limites ao invés de cortar no meio de um pensamento.

Observe os modos de falha de fontes desordenadas. Tabelas perdem seus cabeçalhos, OCR elimina a estrutura de linhas, transcrições divagam entre tópicos e documentos exportados repetem cabeçalhos em cada página. Revise os resultados dessas fontes antes da indexação e prefira limpar a fonte (corrigir títulos, remover conteúdo padronizado) ao invés de pedir ao segmentador que adivinhe ao redor dela.

## Preparar o texto da fonte

Forneça o texto completo da fonte sempre que possível. Segmentos são mais úteis quando a fonte tem títulos claros, parágrafos e declarações completas. Revise os resultados de tabelas, OCR, transcrições ou documentos com cabeçalhos repetidos antes de indexá‑los.

Sem sanitização, os segmentos têm cerca de 300 tokens e cobrem todo o documento na ordem original, sem sobreposição. Os limites seguem a estrutura do documento e a similaridade semântica dos trechos vizinhos; documentos desse tamanho ou menores são retornados como um único segmento.

Use sanitização apenas quando o conteúdo omitido for realmente irrelevante para a recuperação. Solicitações sanitizadas são processadas por um modelo de linguagem e demoram mais. Quando a formulação exata da fonte, a fidelidade legal ou a rastreabilidade completa são importantes, retenha e revise o texto da fonte ao invés de sanitizá‑lo.

Para o contrato de solicitação, resposta, autenticação e erro suportado, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

Para disponibilidade atual do serviço e limites de conta, veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).
