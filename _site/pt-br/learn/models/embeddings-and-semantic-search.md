Source: http://localhost:1313/pt-br/learn/models/embeddings-and-semantic-search.html

Um cliente pergunta: “Quando receberei meu dinheiro de volta?” Seu centro de ajuda usa o título “Tempos de processamento de reembolso”. Um sistema de busca que depende apenas de palavras idênticas pode perder a conexão. **Busca semântica** tem como objetivo encontrar material relacionado em significado, mesmo quando a pergunta e o documento usam palavras diferentes.

Um ingrediente comum é um **embedding**: uma lista de números produzida por um modelo para representar aspectos de um conteúdo. Você não precisa ler esses números. Seu propósito é permitir que o software compare trechos de conteúdo de forma eficiente, assim como um mapa permite que um serviço de entrega compare locais sem reler cada descrição de rua.

## Um mapa de significado, com limitações importantes

Em um mapa geográfico, lugares próximos têm coordenadas semelhantes. Em um sistema de embedding, conteúdo com padrões relacionados tende a receber representações numéricas próximas. “Reembolso”, “dinheiro de volta” e “devolver meu pagamento” podem, portanto, levar a documentos semelhantes. A relação é aprendida a partir do treinamento, não de uma pessoa escrevendo um dicionário completo de sinônimos.

O mapa é apenas uma analogia. Um embedding tem muitas coordenadas numéricas, não apenas uma posição norte‑sul e leste‑oeste. Coordenadas individuais geralmente não têm rótulos simples como “reembolso” ou “satisfação do cliente”. A representação comprime informações em uma forma útil para comparação; não é uma cópia completa e legível do significado original.

- **Texto** — A pergunta ou trecho que você deseja comparar, como a solicitação de um cliente ou um parágrafo de uma política de devolução.

- **Embedding** — Uma representação numérica criada por um modelo de embedding. O mesmo setup de modelo compatível deve ser usado para o material sendo comparado.

- **Similaridade** — Uma medida de quão próximas duas representações estão. Ajuda a classificar candidatos, mas não prova que um trecho responde à pergunta.

Um modelo de embedding não escreve a resposta que o cliente vê. Ele ajuda a localizar material fonte promissor. Um modelo de linguagem separado pode ler esse material e compor uma resposta, ou um aplicativo comum pode exibir os documentos correspondentes sem gerar nada. Manter a busca e a escrita de respostas separadas facilita o diagnóstico de problemas.

O texto original ainda importa. Se você mantiver apenas números sem uma conexão de volta à fonte, não poderá mostrar a política, verificar sua data ou citar o trecho relevante. Um sistema de busca prático armazena ou referencia tanto a representação quanto o conteúdo que ela representa, junto com informações úteis como título e regras de acesso.

## De um documento para um resultado de busca

**Indexação** significa preparar o conteúdo para que o sistema possa buscá‑lo de forma eficiente mais tarde. Documentos longos são frequentemente divididos em **pedaços**, trechos menores que permanecem focados em um tópico. Dividir uma política em um limite de seção sensato ajuda; dividir uma frase longe de sua exceção pode tornar o trecho resultante enganoso.

1. **Preparar trechos úteis**

Mantenha uma regra de política junto com as condições necessárias para entendê‑la. Preserve a referência à fonte e remova duplicatas obsoletas.

2. **Criar e armazenar representações**

Um modelo de embedding converte cada trecho em números. O sistema de busca armazena esses números com um meio de recuperar o trecho original.

3. **Representar a pergunta**

O sistema converte a pergunta do usuário usando um modelo de embedding compatível e a compara com as representações armazenadas.

4. **Retornar candidatos**

Os trechos elegíveis mais próximos se tornam resultados candidatos. Verifique relevância e permissões antes de usá‑los como evidência em uma resposta.

**Candidatos** são correspondências possíveis, não respostas verificadas. Uma pergunta sobre prazo de reembolso pode recuperar uma política geral de devolução, uma nota de processamento bancário e uma exceção promocional antiga. Todos podem estar relacionados a reembolsos, mas apenas alguns se aplicam à situação do cliente. A busca restringe a tarefa de leitura; não elimina a necessidade de interpretar a evidência.

Uma mudança de modelo também pode mudar o mapa. Embeddings de modelos não relacionados, ou versões e configurações incompatíveis, não devem ser misturados como se suas coordenadas significassem a mesma coisa. Atualizar a configuração de embedding pode exigir reconstruir as representações armazenadas. Planeje isso como uma mudança no sistema de busca e teste os resultados em vez de tratá‑lo como uma simples mudança de rótulo.

## Experimente palavras relacionadas

> **Demonstração interativa: Experimente: palavras diferentes podem apontar para o mesmo tópico.** Esta demonstração interativa está disponível na página web. Experimente “money back”, “refund” e “delivery”. Esta é uma demonstração local simplificada com termos de correspondência pré‑definidos, não um modelo de embedding ativo ou uma medida de qualidade de busca. A busca semântica real representa o conteúdo numericamente ao invés de depender dessa pequena lista de termos.

A observação útil é a mudança de vocabulário, não a pontuação da demonstração. As pessoas descrevem a mesma necessidade de maneiras diferentes. Testes de busca devem, portanto, incluir a linguagem dos clientes, abreviações, erros de digitação e a terminologia usada dentro da sua organização. Um teste feito apenas a partir de títulos de documentos pode parecer bem‑sucedido enquanto falha em perguntas comuns de usuários.

Teste também perguntas cujas respostas estão ausentes. Um sistema de busca costuma retornar algo relacionado mesmo quando nada responde à pergunta. Um assistente interno questionado sobre uma política não publicada deve dizer que a evidência está ausente, não transformar o parágrafo mais próximo em uma regra inventada.

## Onde a correspondência exata ainda importa

A similaridade é especialmente útil para conceitos e paráfrases. É menos confiável para identificadores exatos e distinções numéricas finas. Dois códigos de produto podem parecer quase idênticos enquanto se referem a itens diferentes. Políticas que dizem “antes da renovação” e “depois da renovação” compartilham grande parte do vocabulário mas podem implicar resultados opostos.

Para referências de pedido, números de fatura ou códigos exatos, use uma busca exata ou um método de busca que preserve esses valores. **Busca por palavra‑chave** corresponde palavras ou termos de forma mais direta. **Busca híbrida** combina sinais baseados em significado e em palavras‑chave. **Filtros** restringem quais documentos são elegíveis usando propriedades explícitas, como departamento, data ou categoria de produto. Essas abordagens complementam os embeddings em vez de competir com eles.

Não use a similaridade como decisão de controle de acesso. Se uma pessoa pode ler um documento de salário é uma questão de permissões, não de quão relevante o documento é. Restrinja o material elegível antes de expor resultados ou passá‑los a um gerador de respostas. Trechos sensíveis não devem ser incluídos apenas porque obtêm pontuação alta.

## Como a busca alimenta o RAG

**Retrieval‑augmented generation**, ou **RAG**, significa encontrar material fonte relevante e entregá‑lo a um modelo antes que ele escreva uma resposta. O material complementa o que o modelo aprendeu durante o treinamento. Pode fornecer políticas corporativas atuais ou instruções internas que o modelo não saberia de outra forma.

Pergunta do usuário → Busca de fonte elegível → Passagens relevantes → Modelo lê evidência → Resposta com referências de fonte

O RAG não re‑treina o modelo a cada busca. Ele insere evidência na requisição atual. Se o trecho correto estiver ausente, desatualizado ou mal interpretado, a resposta ainda pode estar errada. Uma resposta com citação também precisa ser verificada: o trecho citado deve realmente sustentar a afirmação, não apenas discutir o mesmo tópico.

Um **reranker** recebe um conjunto existente de candidatos e os reordena para a pergunta. Ele pode tornar o trecho mais útil mais fácil de selecionar, mas não pode recuperar um documento que nunca foi recuperado. Essa distinção evita um erro caro: adicionar um reranker quando o problema real é a falta de material fonte ou um filtro de elegibilidade incorreto.

- **3** — verificações separadas: evidência existe, recuperação a encontra, resposta a usa

- **0** — novos documentos recuperados por reordenação de conjunto de candidatos inalterado

Para uma revisão prática, reúna perguntas com trechos de apoio conhecidos. Verifique se os trechos aparecem entre os candidatos, se estão próximos do topo e se material não relacionado está sendo incluído. Em seguida, revise as respostas finais separadamente. Isso separa uma falha de busca de uma falha de escrita e dá à equipe um ponto específico para melhorar.

Relacionado: no AIVAX, [busca semântica](http://localhost:1313/pt-br/docs/rag/semantic-search.md) recupera documentos indexados, e [reranking](http://localhost:1313/pt-br/docs/rag/reranking.md) ajusta a ordem dos candidatos. Continue com [What is a RAG?](http://localhost:1313/pt-br/learn/teaching-agents/what-is-a-rag.md) para o processo completo de evidência‑para‑resposta, ou [estratégias de recuperação](http://localhost:1313/pt-br/learn/teaching-agents/retrieval-strategies.md) para escolher como buscar.

Próximo passo: compare [raciocínio e modelos padrão](http://localhost:1313/pt-br/learn/models/reasoning-vs-standard-models.md) para decidir quanto processamento uma resposta precisa após a evidência estar disponível.

**Verifique seu conhecimento.** A regra correta de reembolso nunca aparece nos candidatos recuperados. O que você deve investigar primeiro?

1. Aumentar o reranker até que ele invente o trecho ausente
2. Corrigir preparação ou recuperação de documentos para que o trecho relevante se torne candidato
3. Tratar a maior pontuação de similaridade como prova de que a resposta existe
4. Aumentar a temperatura da resposta

Answer: option 2. O reranker apenas reordena candidatos fornecidos. Se a evidência necessária estiver ausente, investigue o conteúdo fonte, indexação, consulta e filtros de elegibilidade antes de ajustar a ordem dos candidatos.
