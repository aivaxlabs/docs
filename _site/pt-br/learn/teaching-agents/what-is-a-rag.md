Source: https://docs.aivax.net/pt-br/learn/teaching-agents/what-is-a-rag.html

Suponha que você pergunte a um bibliotecário se um clube local permite convidados em seus eventos. Um bom bibliotecário não responde a partir de uma lembrança vaga de como os clubes normalmente funcionam. Ele encontra o manual atual do clube, localiza a política de convidados e ajuda você a interpretá‑la. Se o manual não disser nada sobre um evento específico, ele informa que a resposta está ausente em vez de inventar uma regra.

**Retrieval-Augmented Generation**, geralmente abreviado como **RAG**, fornece a um agente de IA um fluxo de trabalho similar. Recuperação significa encontrar informações. Aumentado significa complementado. Geração significa escrever uma resposta. Juntamente, o sistema busca fontes selecionadas, entrega as passagens relevantes a um modelo de linguagem e pede que ele responda usando essa evidência. As vezes as pessoas chamam a configuração resultante de “um RAG”, embora as iniciais descrevam uma técnica e não um produto específico.

## Separe a biblioteca do bibliotecário

Um modelo de linguagem pode escrever uma explicação, mas seu treinamento geral não é um registro confiável das regras atuais da sua organização. Um repositório de conhecimento fornece essas regras separadamente. Essa separação permite que você atualize uma fonte sem re‑treinar o modelo, o que significaria mudar o próprio modelo por meio de um processo de aprendizado.

A analogia da biblioteca também explica por que apenas fazer upload de material não é suficiente. Uma prateleira cheia de manuais é útil somente se o manual correto puder ser encontrado, sua edição estiver atual e o leitor o interpretar corretamente. O RAG inclui tanto a preparação do material pesquisável quanto a seleção de evidências no momento da resposta. Essas são atividades relacionadas, mas podem falhar de forma independente.

Um **chunk** é uma parte de uma fonte preparada como uma unidade pesquisável. Pode ser uma seção autônoma sobre elegibilidade de convidados ao invés de todo o manual do clube. Chunks ajudam o sistema a trazer informações relevantes para um espaço de leitura limitado sem incluir todas as páginas. Eles precisam de contexto suficiente para fazer sentido por si só: “Isso é proibido” é um chunk ruim se o parágrafo anterior que falta identifica o que “isso” significa.

Muitos sistemas de recuperação usam **embeddings**, representações numéricas de texto que colocam significados relacionados próximos uns dos outros. Pense em um mapa onde “trazer um visitante” e “presença de convidados” ocupam áreas próximas, mesmo que as palavras sejam diferentes. O mapa ajuda a encontrar candidatos; ele não certifica que uma passagem seja verdadeira ou aplicável. Alguns sistemas também buscam palavras exatas. A unidade [Embeddings and semantic search](https://docs.aivax.net/pt-br/learn/models/embeddings-and-semantic-search.md) explica a abordagem numérica em mais detalhes.

## Siga uma pergunta pelo sistema

O **contexto** é a informação disponível ao modelo enquanto ele produz uma resposta. No RAG, passagens recuperadas tornam‑se parte desse contexto junto com instruções e a pergunta do usuário. O modelo não está navegando por todo o repositório de conhecimento em sua cabeça; ele vê o que o sistema ao fornece.


1. **Receber a pergunta**

Um membro do clube pergunta se um convidado pode participar do workshop introdutório. A formulação identifica um tópico e um evento específico.


2. **Recuperar evidência candidata**

A busca encontra passagens sobre acesso de convidados e restrições ao workshop. O sistema seleciona material relevante e autorizado ao invés de encaminhar o manual inteiro.


3. **Escrever a partir da evidência**

O modelo combina as passagens selecionadas em uma resposta em linguagem simples. Deve preservar as condições e distinguir o que a fonte afirma do que permanece desconhecido.


4. **Mostrar a base ou a lacuna**

A resposta aponta para a fonte quando disponível. Se a evidência não cobrir o workshop, o agente explica essa limitação e oferece um próximo passo adequado.





Pergunta → Fontes aprovadas → Selecionar passagens → Modelo lê evidência → Resposta com limites


A ordem importa. Buscar após uma resposta já ter sido inventada não é equivalente a usar evidência antes de responder. Uma fonte adicionada como decoração pode fazer uma resposta parecer confiável mesmo quando não sustenta a afirmação. Uma boa verificação pergunta se cada afirmação importante realmente decorre das passagens selecionadas.

## Experimente a ideia de recuperação

> **Demonstração interativa: Experimente: encontre um trecho de política.** Esta demonstração interativa está disponível na página web. Experimente “guest”, “workshop” e “equipment”. Esta demonstração simplificada de palavras‑chave ilustra a seleção de passagens, não um modelo real de embeddings nem garante a qualidade da recuperação. Observe que as passagens sobre convidados e workshop respondem a partes diferentes da pergunta.



Em uma conversa real, um membro pode perguntar “Meu amigo pode vir?” ao invés de usar a palavra “convidado”. Um método de recuperação precisa lidar com essa linguagem ou fazer uma pergunta de esclarecimento. Pode também precisar da conversa anterior para saber a qual evento “vir” se refere. Escolher evidência, portanto, é mais do que combinar um título de documento com uma frase.

## A fundamentação altera a resposta

**Fundamentação** significa vincular as alegações factuais de uma resposta à evidência disponível para a tarefa. Não significa copiar parágrafos inteiros. Uma resposta fundamentada útil pode resumir, comparar ou explicar, desde que não adicione silenciosamente condições sem suporte.


**Sem evidência do clube fornecida**

“Convidados normalmente podem participar de workshops, então seu amigo pode vir sem reserva.”


**Com evidência relevante**

“O workshop introdutório está aberto a visitantes, e a política do workshop diz que a reserva é necessária antes da participação.”





A primeira resposta não é necessariamente errada para todo clube. É sem suporte para este aqui. Essa distinção importa: o conhecimento geral do modelo pode ser útil para explicar conceitos comuns, mas alegações específicas da organização precisam de evidência específica da organização. Um tom convincente não substitui a política atual.

## Por que o RAG não elimina alucinação

Uma **alucinação** é uma afirmação factual inventada ou sem suporte apresentada como se fosse estabelecida. O RAG reduz oportunidades para tais afirmações ao fornecer material relevante, mas não pode eliminá‑las. A busca pode perder a passagem correta, um documento pode estar desatualizado ou o modelo pode ignorar uma restrição ao compor a resposta.

Fontes contraditórias criam outro risco. Se um manual antigo permite convidados e o novo manual limita o acesso, recuperar ambos não indica ao modelo qual tem autoridade, a menos que datas e precedência estejam claras. Uma citação também prova pouco por si só: a fonte citada pode discutir convidados sem apoiar a promessa específica na resposta.

Projete o agente para reconhecer evidência ausente. “Encontrei a política geral de convidados, mas não há regra para este evento privado” costuma ser um resultado melhor do que um “sim” confiante. Para decisões com consequências financeiras, legais ou de segurança, exija revisão adequada ao invés de assumir que a recuperação torna decisões autônomas seguras.

## Conecte a técnica a uma implementação

Relacionado: no AIVAX, [collections](https://docs.aivax.net/pt-br/docs/rag/collections.md) organizam documentos, e [semantic search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) recupera material relevante. As coleções também podem ser conectadas a um gateway de IA para que o material recuperado esteja disponível durante uma conversa. Os nomes dos recursos descrevem partes do fluxo de trabalho, não uma garantia de que toda resposta esteja correta.

Comece com fontes aprovadas e perguntas cujas respostas você pode verificar. Observe o que foi recuperado antes de julgar a resposta final. Se a evidência estava ausente, melhore o conhecimento ou a busca. Se a evidência estava presente mas foi mal utilizada, melhore as instruções e a avaliação. Essa simples distinção evita tentar consertar todo problema mudando o modelo.

Próximos passos: construa um conjunto de fontes confiável em [How to find and prepare knowledge](https://docs.aivax.net/pt-br/learn/teaching-agents/finding-and-preparing-knowledge.md).

**Verifique seu conhecimento.** Qual é a ideia central da Geração Aumentada por Recuperação?

1. Ele re‑treina o modelo de linguagem toda vez que uma política muda
2. Ele recupera evidência relevante e a fornece ao modelo antes de a resposta ser escrita
3. Ele garante que toda resposta citada esteja correta
4. Ele substitui a necessidade de manter documentos fonte

Answer: option 2. RAG adiciona evidência recuperada ao contexto do modelo. A qualidade da fonte, a qualidade da busca e a interpretação fiel ainda precisam de manutenção e avaliação.
