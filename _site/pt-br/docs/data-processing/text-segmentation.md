Source: https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.html

# Segmentação de Texto

A segmentação de texto divide documentos fonte em strings semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela retorna segmentos para o seu aplicativo; não cria embeddings nem armazena os documentos enviados.

Use-a quando um documento fonte precisar de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos da coleção. Se você já tiver texto focado e autocontido, poderá importá-lo diretamente. Se quiser que a AIVAX processe arquivos fonte em documentos da coleção, consulte [Injetor de Mídia](https://docs.aivax.net/pt-br/docs/rag/documents.md#import-from-files-with-media-injector). Para um guia completo que transforma um PDF em pedaços segmentados e importáveis, veja [PDF para Markdown para RAG](https://aivax.net/blog/pdf-to-markdown-for-rag-chunks-jsonl/).

Para entender como a segmentação se relaciona com armazenamento, atualizações e recuperação, leia [onde a segmentação se encaixa em um pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Ignore a segmentação quando o texto já estiver focado

A segmentação justifica-se em fontes longas e multitemáticas — manuais, artigos, transcrições — onde um embedding por página borraria assuntos distintos uns dos outros. Não segmente texto que já seja uma ideia por unidade: respostas de FAQ, descrições de produtos, políticas curtas ou trechos pré-cortados podem ir direto para a coleção. Cada divisão desnecessária adiciona trabalho de indexação e corre o risco de separar declarações que só fazem sentido juntas.

## O que constitui um bom segmento

Um bom segmento é o menor trecho que ainda responde a uma pergunta por si só: uma declaração completa ou um grupo apertado de declarações sobre um único subtópico, tipicamente um parágrafo ou uma seção curta. Os segmentos são mais úteis quando a fonte tem cabeçalhos claros, parágrafos e declarações completas — o segmentador preserva esses limites em vez de cortar no meio do pensamento.

Fontes confusas, como tabelas sem cabeçalhos, saída de OCR, transcrições prolixas e exportações que repetem cabeçalhos de página, beneficiam-se de limpeza prévia. Corrija os cabeçalhos e remova textos padrão (boilerplate), depois revise os resultados antes da indexação.

## Prepare o texto fonte

Forneça texto fonte completo sempre que possível, limpo conforme descrito acima.

Os segmentos visam cerca de 300 tokens e cobrem todo o documento na ordem original. Os limites seguem a estrutura do documento e o significado das passagens vizinhas; documentos de tamanho aproximadamente igual ou inferior são retornados como um único segmento.

Use a sanitização apenas quando o conteúdo omitido for genuinamente irrelevante para a recuperação. Solicitações sanitizadas levam mais tempo. Quando a redação exata da fonte ou a rastreabilidade completa importa, mantenha e revise o texto fonte em vez disso.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

## Geração assíncrona

Adicione `"async": true` para colocar a segmentação em fila, o que é útil para documentos longos e solicitações sanitizadas. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado posteriormente ou recebe um webhook quando estiver concluído. Veja [Gerações assíncronas](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md).

```json
{
  "documents": ["<texto de documento longo>"],
  "sanitize": true,
  "async": true
}
```

## Preços e limites

| Descrição | Preço |
| --- | ---: |
| Segmentação de texto | **$0,10/M tokens** |

O número de documentos segmentados por minuto e por dia depende do plano; consulte [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/limits.md#data-processing). A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retornará `429 Too Many Requests`.
