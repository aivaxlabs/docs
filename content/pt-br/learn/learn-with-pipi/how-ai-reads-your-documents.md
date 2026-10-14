---
{title: Como a IA lê seus documentos,linkTitle: "#3 RAG e busca semântica",description: "Pipi transforma os documentos da padaria em cartões de índice, encontra o correto pelo significado em vez de pela palavra, e entrega ao cérebro antes que ele responda.",weight: 30,duration: 5,objectives: [Explicar por que um modelo adivinha quando lhe falta sua informação.,Descrever como uma coleção divide documentos em pequenos fragmentos.,Distinguir entre busca por palavra-chave e busca semântica.,Definir RAG como buscar antes de responder.],sourceHash: c33dd5089ca34983}
---

O cérebro é inteligente, mas nunca viu o cardápio da padaria. Se ninguém o informa, ele adivinha. Este episódio mostra como fornecer os fatos no momento em que ele precisa deles.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.webp" title="AIVAX Learn #3 — Como a IA lê seus documentos" lang="pt-BR" caption="Episódio 3 · 1 minuto e 11 segundos" >}}

## O que o vídeo demonstra

A Pipi armazena os documentos da padaria em uma **coleção**. Cada pequeno fragmento de um documento se torna um cartão de índice. Pequenos fragmentos são importantes: quando o modelo recebe apenas a passagem relevante, ele lê menos e tem menos chance de misturar tópicos.

Em seguida, surge um problema. Um cartão diz *"bolo diet"*, mas o cliente pede algo *"sem açúcar"*. Uma busca que combina palavra por palavra não encontra nada, pois ninguém escreveu "sem açúcar".

{{< compare >}}
{{< side title="Busca por palavra-chave" tone="bad" >}}Procura pelas mesmas palavras. "Sem açúcar" não corresponde a "bolo diet", então o cartão correto é perdido.{{< /side >}}
{{< side title="Busca semântica" tone="good" >}}Procura pelo mesmo significado. Ideias semelhantes ficam próximas, então a pergunta cai ao lado do cartão correto.{{< /side >}}
{{< /compare >}}

**Busca semântica** transforma cada cartão e cada pergunta em uma posição em um mapa de significado. Cartões sobre assuntos semelhantes ficam próximos uns dos outros, e a pergunta fica ao lado do cartão que a responde.

## RAG: busca antes de responder

O cartão encontrado viaja com a pergunta até o cérebro, e o cérebro responde com base nele. Essa combinação é chamada de **RAG**, abreviação de *geração aumentada por recuperação*: recupere as passagens relevantes e, em seguida, gere a resposta com elas em vista.

{{< flow "Pergunta | Busca semântica na coleção | Cartões relevantes + pergunta | Modelo | Resposta fundamentada" >}}

A Pipi resume como *"nenhuma adivinhação, apenas fatos"*. Na prática, o RAG reduz a adivinhação, mas não a elimina: a resposta só é tão boa quanto os documentos e a busca. Por isso o Learn dedica um módulo inteiro à preparação do conhecimento.

## Aprofunde-se

- No Learn: [O que é RAG](../teaching-agents/what-is-a-rag.md), [Embeddings e busca semântica](../models/embeddings-and-semantic-search.md), [Preparando documentos para conhecimento](../teaching-agents/preparing-documents-for-knowledge.md) e [Medindo aderência e alucinação](../teaching-agents/measuring-adherence-and-hallucination.md).
- Na Documentação: [Coleções](../../docs/rag/collections.md) explica como os documentos são armazenados, [Busca semântica](../../docs/rag/semantic-search.md) aborda filtros e qualidade da busca, [Reordenação](../../docs/rag/reranking.md) reorganiza resultados, e [Melhores práticas](../../docs/rag/best-practices.md) reúne conselhos práticos. As coleções são vinculadas a um [gateway de IA](../../docs/inference/ai-gateway.md).

Os documentos permitem que o cérebro saiba coisas. O próximo episódio permite que ele faça coisas.

{{< quiz options="O cliente digitou a pergunta errado | A busca por palavra-chave procura as mesmas palavras, e o cartão usou palavras diferentes com o mesmo significado | A coleção era muito pequena" answer="2" explanation="A busca semântica compara significado em vez de palavras exatas, então 'sem açúcar' pode encontrar o cartão 'bolo diet'." >}}
Por que a pergunta "sem açúcar" não encontrou o cartão "bolo diet" no vídeo?
{{< /quiz >}}
