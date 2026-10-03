Source: https://docs.aivax.net/pt-br/docs/rag/text-segmentation.html

# Segmentação de Texto

A segmentação de texto divide documentos de origem em sequências semanticamente coesas que podem ser incorporadas ou indexadas em uma coleção RAG. Ela devolve segmentos para sua aplicação; não cria embeddings nem armazena documentos enviados.

Use-a quando um documento de origem precisa de limites revisáveis e prontos para recuperação antes de criar ou atualizar documentos da coleção. Se você já tem texto focado e autocontido, pode importá-lo diretamente. Se quiser que o AIVAX processe arquivos de origem em documentos da coleção, veja [Media Injector](https://docs.aivax.net/pt-br/docs/rag/media-injector.md).

## Prepare o texto de origem

Forneça o texto de origem completo sempre que possível. Os segmentos são mais úteis quando a origem tem títulos claros, parágrafos e declarações completas. Revise os resultados de tabelas, OCR, transcrições ou documentos com cabeçalhos repetidos antes de indexá-los.

Use a sanitização apenas quando o conteúdo omitido for realmente irrelevante para a recuperação. Quando a redação exata da origem, a fidelidade legal ou a rastreabilidade completa forem importantes, mantenha e revise o texto de origem.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

Para disponibilidade atual do serviço e limites de conta, veja [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md).
