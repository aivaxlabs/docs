Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/how-ai-reads-your-documents.html

O cérebro é esperto, mas nunca viu o cardápio da padaria. Se ninguém lhe disser, ele chuta. Este episódio mostra como fornecer os fatos no momento em que são necessários.

[Video: AIVAX Learn #3 — Como a IA lê seus documentos](https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 3 · 1 minuto e 11 segundos*

## O que o vídeo mostra

O Pipi armazena os documentos da padaria em uma **coleção**. Cada pequeno trecho de um documento se torna um cartão. Trechos pequenos importam: quando o modelo recebe apenas a passagem relevante, ele lê menos e tem menos probabilidade de misturar tópicos.

Em seguida, surge um problema. Um cartão diz *"bolo diet"*, mas o cliente pede algo *"sem açúcar"*. Uma busca que corresponde palavra por palavra não encontra nada, porque ninguém escreveu "sem açúcar".

**Busca por palavras-chave**

Procura as mesmas palavras. "Sem açúcar" não corresponde a "bolo diet", então o cartão certo é perdido.

**Busca semântica**

Procura o mesmo significado. Ideias semelhantes ficam próximas umas das outras, então a pergunta cai ao lado do cartão certo.

A **busca semântica** transforma cada cartão e cada pergunta em uma posição em um mapa de significado. Cartões sobre coisas semelhantes acabam próximos uns dos outros, e a pergunta cai ao lado do cartão que responde a ela.

## RAG: buscar antes de responder

O cartão encontrado viaja junto com a pergunta para o cérebro, e o cérebro responde com base nele. Essa combinação é chamada de **RAG**, sigla para *geração aumentada por recuperação* (retrieval-augmented generation): recuperar as passagens relevantes e, em seguida, gerar a resposta tendo-as à vista.

Pergunta → Busca semântica na coleção → Cartões relevantes + pergunta → Modelo → Resposta fundamentada

O Pipi resume isso como *"sem chutes, apenas fatos"*. Na prática, o RAG reduz os chutes, mas não os elimina: a resposta é tão boa quanto os documentos e a busca. É por isso que o Learn dedica um módulo inteiro para preparar o conhecimento.

## Aprofunde-se

- No Learn: [O que é um RAG](https://docs.aivax.net/pt-br/learn/teaching-agents/what-is-a-rag.md), [Embeddings e busca semântica](https://docs.aivax.net/pt-br/learn/models/embeddings-and-semantic-search.md), [Preparando documentos para conhecimento](https://docs.aivax.net/pt-br/learn/teaching-agents/preparing-documents-for-knowledge.md) e [Medindo aderência e alucinação](https://docs.aivax.net/pt-br/learn/teaching-agents/measuring-adherence-and-hallucination.md).
- Na Documentação: [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md) explica como os documentos são armazenados, [Busca semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) cobre filtros e qualidade da busca, [Reordenamento] (../../docs/rag/reranking.md) reordena os resultados, e [Melhores práticas](https://docs.aivax.net/pt-br/docs/rag/documents.md#write-good-documents) reúne conselhos práticos. As coleções estão vinculadas a um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md).

Os documentos permitem que o cérebro saiba coisas. O próximo episódio permite que ele faça coisas.

**Verifique seu conhecimento.** Por que a pergunta "sem açúcar" falhou em encontrar o cartão "bolo diet" no vídeo?

1. O cliente digitou a pergunta errada
2. A busca por palavras-chave procura as mesmas palavras, e o cartão usava palavras diferentes com o mesmo significado
3. A coleção era muito pequena

Answer: option 2. A busca semântica compara significados em vez de palavras exatas, então 'sem açúcar' pode encontrar o cartão de 'bolo diet'.
