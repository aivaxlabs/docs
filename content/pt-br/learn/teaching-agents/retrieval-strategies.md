---
{title: Estratégias de recuperação,linkTitle: Estratégias de recuperação,description: Escolha técnicas de busca e classificação que trazem as evidências corretas para o contexto de um agente sem sobrecarregá-lo.,weight: 60,duration: 12,objectives: ["Comparar recuperação por palavra-chave, semântica e híbrida.",Explicar como o reordenamento e os filtros de metadados afetam a seleção de evidências.,Descrever trade-offs entre quantidade de resultados e tamanho dos blocos.,Usar avaliação baseada em perguntas para escolher alterações na recuperação.],sourceHash: 54c89cb4556b723f}
---

Encontrar a evidência correta se as pedir um colega que retire páginas úteis de um arquivo. Às vezes você conhece o nome exato do formulário. Outras vezes pode descrever o problema, mas não a terminologia oficial. Em outras situações, várias páginas parecem relevantes até que alguém as leia com atenção. Estratégias de recuperação diferentes atendem a essas situações distintas.

Uma **estratégia de recuperação** é o método usado para selecionar informações para uma pergunta. Pode incluir busca, restrição das fontes elegíveis e ordenação dos candidatos de forma útil. Não há uma configuração universal que faça toda coleção funcionar bem. A abordagem correta depende das perguntas, da estrutura dos documentos, do idioma e das consequências de falta ou mistura de evidências.

## Combine palavras, significados ou ambos

**Keyword search** procura palavras ou frases correspondentes. É útil para nomes de produtos exatos, mensagens de erro e códigos de referência. Se um usuário pergunta sobre uma designação de modelo específica, preservar aquele texto exato pode ser mais importante do que encontrar um trecho que soe similar. Sistemas de palavra‑chave também podem considerar variações de palavras, mas ainda dependem substancialmente de sobreposição textual.

**Semantic search** procura significado relacionado, geralmente usando embeddings, representações numéricas que ajudam a comparar textos. Pode conectar “Não consigo fazer login” a um documento intulado “Problemas de acesso à conta”. Isso ajuda quando os usuários não conhecem a terminologia preferida da organização. Contudo, similaridade não é o mesmo que aplicabilidade: dois produtos diferentes podem ter instruções de solução de problemas quase idênticas.

**Hybrid search** combina sinais de recuperação por palavra‑chave e semântica. Busca manter correspondências exatas ao mesmo tempo em que lida com paráfrases e diferentes formas de expressar a mesma ideia. Combinar métodos adiciona escolhas sobre como os resultados são mesclados e classificados, portanto ainda requer avaliação. “Hybrid” descreve uma abordagem, não uma promessa de respostas melhores em toda coleção.

{{< cards >}}
{{< card title="Keyword" icon="book" >}}
Útil quando as palavras precisas carregam a identidade, como um formulário nomeado ou uma mensagem de erro copiada.
{{< /card >}}
{{< card title="Semantic" icon="compass" >}}
Útil quando o usuário descreve a necessidade em linguagem cotidiana ao invés de repetir a redação do documento.
{{< /card >}}
{{< card title="Hybrid" icon="stack" >}}
Útil quando tanto termos exatos quanto significado mais amplo importam dentro do mesmo conjunto de perguntas.
{{< /card >}}
{{< /cards >}}

Imagine um dispositivo fictício chamado Lampâmina Trail. Uma pergunta sobre “Substituição da bateria da Lampâmina Trail” beneficia‑se do nome exato do produto. “Minha luz externa não mantém carga” beneficia‑se da correspondência baseada em significado, mas pode primeiro exigir esclarecimento sobre qual produto a pessoa possui. A busca não deve adivinhar silenciosamente o produto apenas porque um documento acontece de ficar em primeiro lugar.

## Distinga encontrar candidatos de escolher evidências

**Reranking** é uma segunda passagem que reordena um conjunto inicial de resultados de busca por relevância à pergunta. A primeira busca coleta páginas plausíveis rapidamente. O reordenador examina mais de perto, como um colega que lê uma lista curta antes de escolher as páginas que valem a pena encaminhar.

Um reordenador pode melhorar a ordem dos candidatos disponíveis, mas não pode salvar um documento que nunca entrou no conjunto de candidatos. Ele também adiciona processamento, o que pode afetar o tempo de resposta e o custo. Use‑o quando trechos relevantes estão sendo encontrados mas estão enterrados abaixo de correspondências mais fracas, e verifique se a melhoria importa para as respostas finais.

{{< flow "Question | Select eligible documents | Retrieve candidates | Rerank if useful | Select evidence | Generate answer" >}}

Relacionado: no AIVAX, [reranking](../../docs/rag/reranking.md) fornece reordenação por relevância, e [Reflex](../../docs/rag/reflex.md) é uma opção de reordenamento documentada. Esses guias de produto descrevem as opções disponíveis. A lição geral é julgar as evidências selecionadas, não assumir que adicionar outra etapa de processamento as melhora automaticamente.

## Restrinja a busca com metadados

**Metadata** são informações sobre um documento, como seu produto, idioma, região, proprietário ou data de vigência. Um **filter** restringe quais documentos podem participar de uma busca. Se o usuário está perguntando sobre uma versão de produto confirmada, filtrar para essa versão pode impedir que um manual altamente similar, mas inaplicável, apareça.

Filtros são especialmente importantes quando regras diferem entre audiências ou organizações. Aplique permissões na lógica de aplicação confiável ao invés de deixar o usuário solicitar qualquer escopo por meio do chat normal. Uma pontuação de relevância não estabelece autorização. Da mesma forma, não trate uma declaração de usuário não verificada sobre sua conta como permissão para recuperar material restrito.

No AIVAX, [document filters](../../docs/rag/document-filters.md) são suportados nas superfícies de busca documentadas. A disponibilidade depende do caminho de recuperação; a documentação distingue buscas diretas e baseadas em ferramentas de recuperação automática via gateway. Verifique se a integração escolhida realmente aplica o filtro pretendido ao invés de assumir que todo caminho de recuperação se comporta de forma idêntica.

Filtros também podem remover a resposta acidentalmente. Um documento com metadados ausentes ou incorretos pode desaparecer de uma busca válida. Quando os resultados estão vazios, verifique tanto a pergunta quanto o conjunto de documentos elegíveis. Nunca amplie uma restrição de acesso apenas para devolver uma resposta; esclareça a pergunta ou explique a falta de evidências disponíveis.

## Equilibre quantidade de resultados e tamanho dos trechos

**Top‑k** significa manter os *k* resultados mais bem classificados, onde *k* é um número escolhido. Uma contagem pequena dá ao modelo um pacote de leitura focado, mas pode omitir uma exceção ou procedimento de apoio. Uma contagem maior pode melhorar a chance de incluir evidências necessárias, mas também adiciona texto irrelevante, duplicado ou contraditório.

**Chunk size** é a quantidade de material fonte colocado em cada unidade pesquisável. Trechos menores podem corresponder a uma pergunta estreita precisamente, mas podem separar uma regra de suas condições. Trechos maiores preservam a explicação circundante, mas podem misturar vários tópicos. Um comprimento fixo é um controle prático, não uma definição de limites de significado bons.

| Escolha | Benefício potencial | Custo potencial |
|---|---|---|
| Menos resultados | Menos evidência distrativa | Perder uma condição necessária ou segunda fonte |
| Mais resultados | Evidência mais ampla para perguntas complexas | Mais tempo de leitura e conteúdo irrelevante |
| Trechos menores | Correspondência de tópico precisa | Perda de assunto, exceções ou sequência |
| Trechos maiores | Mais contexto circundante | Foco mais fraco e detalhe desnecessário |

Altere essas configurações usando exemplos reais. Uma pergunta sobre uma única definição precisa de menos evidência do que uma comparação entre políticas. Antes de aumentar a contagem de resultados, verifique se os resultados atuais são duplicados. Antes de reduzir os trechos, verifique se cada passagem menor ainda faz sentido por si só. Melhorar a estrutura dos documentos pode ajudar mais do que ajustar um número.

## Reescreva buscas vagas sem mudar a intenção

**Query rewriting** transforma a formulação do usuário em um pedido de busca mais claro. Em uma conversa sobre a Lampâmina Trail, “Isso cobre a bateria?” pode se tornar “Cobertura da garantia da Lampâmina Trail para a bateria.” A reescrita resolve uma referência usando o contexto conhecido; não deve inventar data de compra, versão do produto ou resposta desejada.

A reescrita pode expandir abreviações, preservar termos exatos e dividir uma pergunta composta em buscas separadas. Mantenha a pergunta original disponível para comparação. Se o detalhe ausente não puder ser inferido com segurança a partir da conversa, pergunte ao usuário. Uma reescrita fluente da pergunta errada pode gerar evidências muito convincentes porém irrelevantes.

{{< tabs >}}
{{< tab title="Exact error message" >}}
Preserve a formulação do erro e a versão confirmada do produto. Comece verificando correspondências exatas, depois use significado mais amplo se a documentação aprovada usar uma explicação diferente.
{{< /tab >}}
{{< tab title="Everyday question" >}}
Use recuperação semântica para necessidades parafraseadas. Confirme o assunto antes de aplicar filtros restritivos de produto e verifique se o trecho selecionado responde à intenção do usuário.
{{< /tab >}}
{{< tab title="Several plausible passages" >}}
Inspecione o conjunto de candidatos e considere reordenamento. Se todos os candidatos são fracos, melhore a fonte ou a busca inicial ao invés de apenas reordenar as mesmas evidências fracas.
{{< /tab >}}
{{< /tabs >}}

## Escolha com base em evidências, não em ranking

**Precision** mede quanto do material recuperado é relevante sob uma regra de revisão definida. Difere de **recall**, que pergunta quanto do material relevante necessário foi encontrado. Uma lista de resultados muito curta pode ser precisa ao mesmo tempo em falta exceções essenciais. Avalie tanto a qualidade da recuperação quanto a da resposta final.

{{< chart type="bar" title="Relevant passages in a fictional evaluation (illustrative)" unit="%" data=`[{"label":"Keyword","value":61},{"label":"Semantic","value":68},{"label":"Hybrid","value":73},{"label":"Hybrid plus reranking","value":79}]` caption="Invented precision figures for one teaching scenario, not a benchmark or expected ordering. Exact-code questions or different documents can reverse this pattern." >}}

Use as mesmas perguntas rotuladas ao comparar uma mudança e registre o tempo de resposta junto com a qualidade. Selecione a abordagem mais simples que atenda aos requisitos da tarefa. Mantenha exemplos onde a mudança ajudou e onde prejudicou, para que o próximo ajuste trate das fraquezas observadas ao invés de um gráfico atraente.

Próximo passo: melhorar o material que está sendo buscado em [Preparing documents for knowledge](preparing-documents-for-knowledge.md).

{{< quiz options="Reranking can recover any document missing from the initial candidates | The largest top-k always produces the best answer | Metadata filters restrict eligible documents, while ranking orders the candidates | Semantic similarity proves that a document applies to the current customer" answer="3" explanation="Filtering and ranking have different jobs. Filters restrict scope; ranking selects relevance within the available candidates. Neither similarity nor result count alone proves correctness." >}}
Qual afirmação descreve corretamente os controles de recuperação?
{{< /quiz >}}
