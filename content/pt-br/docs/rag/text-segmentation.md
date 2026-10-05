---
{title: Segmentação de Texto,linkTitle: segmentação de texto,weight: 110,group: RAG and collections,sourceHash: f5c3010cc118709d,aliases: [/docs/pt-br/rag/text-segmentation.html]}
---

# Segmentação de Texto

A segmentação de texto divide documentos de origem em sequências semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela devolve segmentos para sua aplicação; não cria embeddings nem armazena documentos enviados.

Use-a quando um documento de origem precisa de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos da coleção. Se você já tem um texto focado e autocontido, pode importá-lo diretamente. Se quiser que o AIVAX processe arquivos de origem em documentos da coleção, veja [Media Injector](media-injector.md).

Veja [onde a segmentação se encaixa em um pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/), junto com armazenamento, atualizações e recuperação.

## Pule a segmentação quando o texto já está focado

A segmentação justifica-se em fontes longas e com múltiplos tópicos — manuais, artigos, transcrições — onde um embedding por página borraria assuntos distintos. Não segmente texto que já contém uma ideia por unidade: respostas de FAQ, descrições de produtos, políticas curtas ou trechos pré‑divididos podem ir direto para a coleção. Cada divisão desnecessária acrescenta trabalho de indexação e corre o declarações que só fazem sentido juntas.

## O que faz um bom segmento

Um bom segmento é o menor trecho que ainda responde a uma pergunta por si só: uma declaração completa ou um grupo coeso de declarações sobre um sub‑tópico, tipicamente um parágrafo ou uma seção curta. Os segmentos são mais úteis quando a fonte possui títulos claros, parágrafos e declarações completas — o segmentador preserva esses limites em vez de cortar no meio do raciocínio.

Observe os modos de falha de fontes desordenadas. Tabelas perdem seus cabeçalhos, OCR elimina a estrutura de linhas, transcrições divagam entre tópicos e documentos exportados repetem cabeçalhos em todas as páginas. Revise os resultados dessas fontes antes de indexar e prefira limpar a fonte (corrigir títulos, remover conteúdo padrão) em vez de pedir ao segmentador que adivinhe ao redor.

## Prepare o texto de origem

Forneça o texto completo de origem sempre que possível. Os segmentos são mais úteis quando a fonte possui títulos claros, parágrafos e declarações completas. Revise os resultados de tabelas, OCR, transcrições ou documentos com cabeçalhos repetidos antes de indexá‑los.

Use a sanitização somente quando o conteúdo omitido for realmente irrelevante para a recuperação. Quando a redação exata da fonte, a fidelidade legal ou a rastreabilidade completa forem importantes, mantenha e revise o texto de origem.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Segment%20text&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para a disponibilidade atual do serviço e limites de conta, veja [Plans and Limits](../limits.md).
