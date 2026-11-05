---
{title: Como a IA lê seus documentos,linkTitle: "#3 RAG e busca semântica",description: "Pipi transforma os documentos da padaria em cartões de índice, encontra o correto por significado em vez de por palavra e o entrega ao cérebro antes que ele responda.",weight: 30,duration: 5,objectives: ["Um modelo de linguagem \"adivinha\" quando não possui informações específicas porque ele é projetado para prever a próxima palavra ou sequência de palavras mais provável com base nos padrões aprendidos durante o treinamento. Quando confrontado com uma lacuna de conhecimento ou uma pergunta fora do seu conjunto de dados de treinamento, o modelo tenta preencher essa lacuna gerando texto que parece plausível e coerente com o contexto fornecido, mesmo que factualmente incorreto. Isso ocorre porque o modelo opera probabilisticamente, buscando maximizar a probabilidade de gerar uma resposta que se alinhe com as estruturas linguísticas e os estilos observados em seus dados de treinamento, em vez de acessar um banco de dados de fatos verificados.","Uma coleção divide documentos em pequenos fragmentos por meio de um processo conhecido como chunking. Esse processo envolve a quebra de textos longos ou grandes volumes de dados em partes menores e gerenciáveis, chamadas de \"chunks\" (fragmentos). A divisão pode ser feita com base em diversos critérios, dependendo do contexto e dos objetivos da aplicação:\n\n1. **Divisão por tamanho fixo**: O documento é dividido em blocos de tamanho uniforme, como 500 palavras ou 1000 caracteres. Isso garante que cada fragmento tenha uma quantidade similar de conteúdo.\n\n2. **Divisão por limites naturais**: O texto é separado em pontos específicos, como frases, parágrafos ou seções. Por exemplo, o sistema pode dividir o documento sempre que encontra um ponto final seguido de espaço ou quando detecta mudanças de tópico.\n\n3. **Divisão semântica**: Técnicas mais avançadas usam modelos de linguagem para identificar onde as ideias principais mudam dentro do texto. Isso permite que os fragmentos mantenham coerência temática, mesmo que não sigam divisões rígidas.\n\n4. **Divisão baseada em tokens**: Em sistemas que utilizam processamento de linguagem natural (NLP), os documentos podem ser divididos com base no número de tokens (unidades mínimas de significado) em vez de palavras ou caracteres.\n\nEsses fragmentos são então armazenados separadamente, permitindo consultas mais rápidas e eficientes, além de facilitar tarefas como indexação, busca e análise de dados.",Explique a diferença entre busca por palavras-chave e busca semântica.,Defina RAG como pesquisar antes de responder.],sourceHash: 15f35f163b89dd89}
---

O cérebro é esperto, mas nunca viu o cardápio da padaria. Se ninguém lhe disser, ele chuta. Este episódio mostra como fornecer os fatos no momento em que são necessários.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.webp" title="AIVAX Learn #3 — Como a IA lê seus documentos" lang="pt-BR" caption="Episódio 3 · 1 minuto e 11 segundos" >}}

## O que o vídeo mostra

O Pipi armazena os documentos da padaria em uma **coleção**. Cada pequeno trecho de um documento se torna um cartão. Trechos pequenos importam: quando o modelo recebe apenas a passagem relevante, ele lê menos e tem menos probabilidade de misturar tópicos.

Em seguida, surge um problema. Um cartão diz *"bolo diet"*, mas o cliente pede algo *"sem açúcar"*. Uma busca que corresponde palavra por palavra não encontra nada, porque ninguém escreveu "sem açúcar".

{{< compare >}}
{{< side title="Busca por palavras-chave" tone="bad" >}}Procura as mesmas palavras. "Sem açúcar" não corresponde a "bolo diet", então o cartão certo é perdido.{{< /side >}}
{{< side title="Busca semântica" tone="good" >}}Procura o mesmo significado. Ideias semelhantes ficam próximas umas das outras, então a pergunta cai ao lado do cartão certo.{{< /side >}}
{{< /compare >}}

A **busca semântica** transforma cada cartão e cada pergunta em uma posição em um mapa de significado. Cartões sobre coisas semelhantes acabam próximos uns dos outros, e a pergunta cai ao lado do cartão que responde a ela.

## RAG: buscar antes de responder

O cartão encontrado viaja junto com a pergunta para o cérebro, e o cérebro responde com base nele. Essa combinação é chamada de **RAG**, sigla para *geração aumentada por recuperação* (retrieval-augmented generation): recuperar as passagens relevantes e, em seguida, gerar a resposta tendo-as à vista.

{{< flow "Pergunta | Busca semântica na coleção | Cartões relevantes + pergunta | Modelo | Resposta fundamentada" >}}

O Pipi resume isso como *"sem chutes, apenas fatos"*. Na prática, o RAG reduz os chutes, mas não os elimina: a resposta é tão boa quanto os documentos e a busca. É por isso que o Learn dedica um módulo inteiro para preparar o conhecimento.

## Aprofunde-se

- No Learn: [O que é um RAG](../teaching-agents/what-is-a-rag.md), [Embeddings e busca semântica](../models/embeddings-and-semantic-search.md), [Preparando documentos para conhecimento](../teaching-agents/preparing-documents-for-knowledge.md) e [Medindo aderência e alucinação](../teaching-agents/measuring-adherence-and-hallucination.md).
- Na Documentação: [Coleções](../../docs/rag/collections.md) explica como os documentos são armazenados, [Busca semântica](../../docs/rag/semantic-search.md) cobre filtros e qualidade da busca, [Reordenamento] (../../docs/rag/reranking.md) reordena os resultados, e [Melhores práticas](../../docs/rag/documents.md#write-good-documents) reúne conselhos práticos. As coleções estão vinculadas a um [gateway de IA](../../docs/inference/ai-gateways/concepts.md).

Os documentos permitem que o cérebro saiba coisas. O próximo episódio permite que ele faça coisas.

{{< quiz options="O cliente digitou a pergunta errada | A busca por palavras-chave procura as mesmas palavras, e o cartão usava palavras diferentes com o mesmo significado | A coleção era muito pequena" answer="2" explanation="A busca semântica compara significados em vez de palavras exatas, então 'sem açúcar' pode encontrar o cartão de 'bolo diet'." >}}
Por que a pergunta "sem açúcar" falhou em encontrar o cartão "bolo diet" no vídeo?
{{< /quiz >}}
