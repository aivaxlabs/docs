Source: https://docs.aivax.net/pt-br/learn/teaching-agents/retrieval-strategies.html

Encontrar a evidência correta se as a pedir a um colega que retire páginas úteis de um arquivo. Às vezes você conhece o nome exato do formulário. Às vezes pode descrever o problema, mas não a terminologia oficial. Às vezes várias páginas parecem relevantes até que alguém as leia com atenção. Estratégias de recuperação diferentes atendem a essas situações distintas.

Uma **estratégia de recuperação** é o método usado para selecionar informações para uma pergunta. Pode incluir busca, restrição das fontes elegíveis e ordenação dos candidatos de forma útil. Não existe uma configuração universal que faça toda coleção funcionar bem. A abordagem correta depende das perguntas, da estrutura dos documentos, da linguagem e das consequências de perder ou misturar evidências.

## Combine palavras, significados ou ambos

**Busca por palavra‑chave** procura palavras ou frases correspondentes. É útil para nomes de produtos exatos, mensagens de erro e códigos de referência. Se um usuário pergunta sobre uma designação de modelo específica, preservar esse texto exato pode ser mais importante do que encontrar um trecho que soe genericamente parecido. Sistemas de palavra‑chave também podem considerar variações de palavras, mas ainda dependem substancialmente da sobreposição textual.

**Busca semântica** procura significado relacionado, frequentemente usando embeddings, representações numéricas que ajudam a comparar textos. Pode conectar “Não consigo entrar” a um documento int “Problemas de acesso à conta”. Isso ajuda quando os usuários não conhecem a terminologia preferida da organização. Similaridade não é o mesmo que aplicabilidade, porém: dois produtos diferentes podem ter instruções de solução de problemas quase idênticas.

**Busca híbrida** combina sinais de recuperação por palavra‑chave e semântica. Busca manter correspondências exatas ao mesmo tempo em que lida com paráfrases, diferentes formas de expressar a mesma ideia. Combinar métodos adiciona escolhas sobre como os resultados são mesclados e classificados, portanto ainda requer avaliação. “Híbrida” descreve uma abordagem, não uma promessa de respostas melhores em toda coleção.

- **Keyword** — Útil quando as palavras precisas carregam a identidade, como um formulário nomeado ou uma mensagem de erro copiada.

- **Semantic** — Útil quando o usuário descreve uma necessidade em linguagem cotidiana ao invés de repetir a redação do documento.

- **Hybrid** — Útil quando tanto termos exatos quanto significado mais amplo importam dentro do mesmo conjunto de perguntas.

Imagine um dispositivo fictício chamado Trail Lamp. Uma pergunta sobre “Substituição da bateria da Trail Lamp” se beneficia do nome exato do produto. “Minha luz externa não mantém carga” se beneficia da correspondência baseada em significado, mas pode primeiro exigir esclarecimento sobre qual produto a pessoa possui. A busca não deve adivinhar silenciosamente o produto apenas porque um documento aparece em primeiro lugar.

## Distinga encontrar candidatos de escolher evidências

**Reclassificação** é uma segunda passagem que reordena um conjunto inicial de resultados de busca por relevância à pergunta. A primeira busca coleta páginas plausíveis rapidamente. O reclassificador examina mais de perto, como um colega que lê uma lista curta antes de escolher as páginas a serem encaminhadas.

Um reclassificador pode melhorar a ordem dos candidatos disponíveis, mas não pode resgatar um documento que nunca entrou no conjunto de candidatos. Ele também adiciona processamento, o que pode afetar o tempo de resposta e o custo. Use‑o quando trechos relevantes estão sendo encontrados, mas enterrados abaixo de correspondências mais fracas, e verifique se a melhoria importa para as respostas finais.

Question → Select eligible documents → Retrieve candidates → Rerank if useful → Select evidence → Generate answer

Relacionado: no AIVAX, [reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md) fornece reordenação por relevância, e [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) é uma opção de reclassificação documentada. Esses guias de produto descrevem as opções disponíveis. A lição geral é julgar a evidência selecionada, não assumir que adicionar outra etapa de processamento a melhora automaticamente.

## Restrinja a busca com metadados

**Metadados** são informações sobre um documento, como seu produto, idioma, região, proprietário ou data de vigência. Um **filtro** restringe quais documentos podem participar de uma busca. Se o usuário está perguntando sobre uma versão de produto confirmada, filtrar para essa versão pode impedir que um manual muito semelhante, mas inaplicável, apareça.

Filtros são especialmente importantes quando regras diferem entre públicos ou organizações. Aplique permissões na lógica de aplicação confiável ao invés de deixar o usuário solicitar qualquer escopo via chat comum. Uma pontuação de relevância não estabelece autorização. Da mesma forma, não trate uma declaração de usuário não verificada sobre sua conta como permissão para recuperar material restrito.

No AIVAX, [document filters](https://docs.aivax.net/pt-br/docs/filters/document-filters.md) são suportados nas superfícies de busca documentadas. A disponibilidade depende do caminho de recuperação; a documentação diferencia buscas diretas e baseadas em ferramentas de recuperação automática via gateway. Verifique se a integração escolhida realmente aplica o filtro pretendido ao invés de assumir que todo caminho de recuperação se comporta de forma idêntica.

Filtros também podem remover a resposta acidentalmente. Um documento com metadados ausentes ou incorretos pode desaparecer de uma busca que seria válida de outra forma. Quando os resultados estão vazios, verifique tanto a pergunta quanto o conjunto de documentos elegíveis. Nunca amplie uma restrição de acesso apenas para obter uma resposta; esclareça a pergunta ou explique a falta de evidência disponível.

## Equilibre quantidade de resultados e tamanho dos trechos

**Top‑k** significa manter os *k* resultados mais bem classificados, onde *k* é uma contagem escolhida. Uma contagem pequena dá ao modelo um pacote de leitura focado, mas pode omitir uma exceção ou procedimento de apoio. Uma contagem maior pode melhorar a chance de incluir a evidência necessária, ao mesmo tempo que adiciona texto irrelevante, duplicado ou contraditório.

**Tamanho do trecho** é a quantidade de material fonte colocado em cada unidade pesquisável. Trechos menores podem corresponder a uma pergunta estreita com precisão, mas separar uma regra de suas condições. Trechos maiores preservam explicações circundantes, mas podem misturar vários tópicos. Um comprimento fixo é um controle prático, não uma definição de bons limites de significado.

| Escolha | Benefício potencial | Custo potencial |
|---|---|---|
| Menos resultados | Menos evidência distrativa | Perder uma condição necessária ou segunda fonte |
| Mais resultados | Evidência mais ampla para perguntas complexas | Mais tempo de leitura e conteúdo irrelevante |
| Trechos menores | Correspondência de tópico precisa | Perda de assunto, exceções ou sequência |
| Trechos maiores | Mais contexto circundante | Foco mais fraco e detalhe desnecessário |

Altere essas configurações usando exemplos reais. Uma pergunta sobre uma única definição precisa de menos evidência do que uma comparação entre políticas. Antes de aumentar a contagem de resultados, inspecione se os resultados atuais são duplicados. Antes de reduzir os trechos, verifique se cada trecho menor ainda faz sentido por conta própria. Melhorar a estrutura dos documentos pode ajudar mais do que ajustar um número.

## Reescreva buscas pouco claras sem mudar a intenção

**Reescrita de consulta** transforma a formulação do usuário em um pedido de busca mais claro. Em uma conversa sobre a Trail Lamp, “Isso cobre a bateria?” pode se tornar “Cobertura da garantia da Trail Lamp para a bateria.” A reescrita resolve uma referência usando o contexto conhecido; não deve inventar data de compra, versão do produto ou resposta desejada.

A reescrita pode expandir abreviações, preservar termos exatos e dividir uma pergunta composta em buscas separadas. Mantenha a pergunta original disponível para comparação. Se o detalhe ausente não puder ser inferido com segurança a partir da conversa, pergunte ao usuário. Uma reescrita fluente da pergunta errada pode produzir evidência muito convincente porém irrelevante.

**Exact error message**

Preserve a redação do erro e a versão confirmada do produto. Comece verificando correspondências exatas, depois use significado mais amplo se a documentação aprovada usar explicação diferente.

**Everyday question**

Use recuperação semântica para necessidades parafraseadas. Confirme o assunto antes de aplicar filtros restritivos de produto e verifique se o trecho selecionado responde à intenção do usuário.

**Several plausible passages**

Inspecione o conjunto de candidatos e considere reclassificação. Se todos os candidatos são fracos, melhore a fonte ou a busca inicial ao invés de apenas reordenar a mesma evidência fraca.

## Escolha com base em evidências, não em ranking

**Precisão** mede quanto do material recuperado é relevante sob uma regra de revisão definida. Difere da **revocação**, que pergunta quanto do material relevante necessário foi encontrado. Uma lista de resultados muito curta pode ser precisa ao mesmo tempo que perde uma exceção essencial. Avalie tanto a recuperação quanto a qualidade da resposta final.

**Relevant passages in a fictional evaluation (illustrative)**

| Item | Value |
| --- | --- |
| Keyword | 61% |
| Semantic | 68% |
| Hybrid | 73% |
| Hybrid plus reranking | 79% |

Invented precision figures for one teaching scenario, not a benchmark or expected ordering. Exact-code questions or different documents can reverse this pattern.

Use as mesmas perguntas rotuladas ao comparar uma mudança e registre o tempo de resposta junto com a qualidade. Selecione a abordagem mais simples que atenda aos requisitos da tarefa. Mantenha exemplos onde a mudança ajudou e onde prejudicou, para que o próximo ajuste aborde fraquezas observadas ao invés de um gráfico atraente.

Próximo passo: melhorar o material sendo pesquisado em [Preparing documents for knowledge](https://docs.aivax.net/pt-br/learn/teaching-agents/preparing-documents-for-knowledge.md).

**Verifique seu conhecimento.** Qual afirmação descreve corretamente os controles de recuperação?

1. Reranking can recover any document missing from the initial candidates
2. The largest top-k always produces the best answer
3. Metadata filters restrict eligible documents, while ranking orders the candidates
4. Semantic similarity proves that a document applies to the current customer

Answer: option 3. Filtering and ranking have different jobs. Filters restrict scope; ranking selects relevance within the available candidates. Neither similarity nor result count alone proves correctness.
