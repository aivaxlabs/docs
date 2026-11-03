Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/how-ai-reads-your-documents.html

O cérebro é inteligente, mas nunca viu o cardápio da padaria. Se ninguém lhe disser, ele adivinha. Este episódio mostra como fornecer os fatos no momento em que ele precisa.

[Video: AIVAX Learn #3 — Como a IA lê seus documentos](https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 3 · 1 minuto e 11 segundos*

## O que o vídeo mostra

A Pipi armazena os documentos da padaria em uma **coleção**. Cada pequeno trecho de um documento se torna um cartão de índice. Pequenos trechos são importantes: quando o modelo recebe apenas a passagem relevante, ele lê menos e tem menos probabilidade de misturar tópicos.

Em seguida, surge um problema. Um cartão diz *"diet cake"*, mas o cliente pede algo *"sugar-free"*. Uma busca que combina palavra por palavra não encontra nada, pois ninguém escreveu "sugar-free".

**Busca por palavra-chave**

Procura pelas mesmas palavras. "Sugar-free" não corresponde a "diet cake", então o cartão correto é perdido.

**Busca semântica**

Procura pelo mesmo significado. Ideias semelhantes ficam próximas, então a pergunta cai ao lado do cartão correto.

A busca semântica transforma cada cartão e cada pergunta em uma posição num mapa de significado. Cartões sobre assuntos semelhantes ficam próximos uns dos outros, e a pergunta fica ao lado do cartão que a responde.

## RAG: buscar antes de responder

O cartão encontrado viaja com a pergunta até o cérebro, e o cérebro responde com base nele. Essa combinação é chamada de **RAG**, abreviação de *geração aumentada por recuperação*: recupere as passagens relevantes e, em seguida, gere a resposta tendo-as em vista.

Pergunta → Busca semântica na coleção → Cartões relevantes + pergunta → Modelo → Resposta fundamentada

A Pipi resume como *"sem adivinhações, apenas fatos"*. Na prática, o RAG reduz as adivinhações, mas não as elimina: a resposta só é tão boa quanto os documentos e a busca. Por isso o Learn dedica um módulo inteiro à preparação do conhecimento.

## Aprofunde-se

- In Learn: [O que é um RAG](https://docs.aivax.net/pt-br/learn/teaching-agents/what-is-a-rag.md), [Representações vetoriais e busca semântica](https://docs.aivax.net/pt-br/learn/models/embeddings-and-semantic-search.md), [Preparando documentos para conhecimento](https://docs.aivax.net/pt-br/learn/teaching-agents/preparing-documents-for-knowledge.md) e [Medindo aderência e alucinação](https://docs.aivax.net/pt-br/learn/teaching-agents/measuring-adherence-and-hallucination.md).
- Na Documentação: [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md) explica como os documentos são armazenados, [Busca semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) cobre filtros e qualidade da busca, [Reclassificação](https://docs.aivax.net/pt-br/docs/rag/reranking.md) reorganiza resultados, e [Melhores práticas](https://docs.aivax.net/pt-br/docs/rag/documents.md#write-good-documents) reúne conselhos práticos. Coleções são vinculadas a um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md).

Os documentos permitem que o cérebro saiba coisas. O próximo episódio permite que ele faça coisas.

**Verifique seu conhecimento.** Por que a pergunta "sugar-free" não encontrou o cartão "diet cake" no vídeo?

1. O cliente digitou a pergunta errado
2. A busca por palavra-chave procura pelas mesmas palavras, e o cartão usou palavras diferentes com o mesmo significado
3. A coleção era muito pequena

Answer: option 2. A busca semântica compara significado em vez de palavras exatas, então 'sugar-free' pode encontrar o cartão 'diet cake'.
