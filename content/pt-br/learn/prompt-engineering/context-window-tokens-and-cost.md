---
{title: "Janela de contexto, tokens e gerenciamento de custo",linkTitle: "Contexto, tokens e custo",description: "Entenda como os tokens compartilham uma janela de contexto limitada e como gerenciar entrada útil, espaço de resposta e custo operacional.",weight: 30,duration: 11,objectives: [Explique o que os tokens medem e por que a contagem de palavras é apenas uma aproximação.,"Alocar um orçamento de contexto entre instruções, conhecimento, histórico e uma resposta.",Reconhecer overflow e distingui‑lo de um limite curto de saída.,"Escolher resumir, aparar ou armazenar em cache para o problema adequado."],sourceHash: 61e7d47fdb476207}
---

Um assistente pode parecer ler toda a conversa, mas ainda assim perder algo que foi dito anteriormente. Também pode custar mais responder a um acompanhamento curto do que a uma pergunta inicial mais longa. Ambos os comportamentos se tornam mais fáceis de entender quando você distingue o chat visível da entrada completa que a aplicação envia ao modelo.

Os modelos trabalham com **tokens**, pequenos fragmentos de conteúdo codificado. Cada requisição também tem uma **janela de contexto**, a quantidade de informação que o modelo pode processar de uma vez. Pense na janela de contexto como uma mesa: instruções, documentos de referência e notas da conversa competem por espaço, e ainda deve haver espaço para escrever a resposta. Uma mesa maior ajuda, mas não torna todo documento relevante.

## Tokens não são iguais a palavras

Um **tokenizador** é o componente que divide o texto em tokens. Dependendo do modelo, um token pode representar uma palavra comum, parte de uma palavra, pontuação ou outro fragmento. Um nome de produto desconhecido pode ser dividido em várias partes. Espaços, números e formatação também afetam a contagem. Textos em idiomas diferentes podem exigir números diferentes de tokens para o mesmo significado.

É por isso que “manter o prompt abaixo de um determinado número de palavras” é apenas uma regra de planejamento aproximada. O tokenizador do modelo e o uso relatado pelo serviço fornecem uma contagem mais útil. Imagens, áudio e outras entradas não textuais podem ter regras adicionais de processamento e medição; não presuma que seu custo pode ser inferido a partir de uma legenda visível.

{{< demo name="tokenizer" title="Try it: change the text, not just its length" config=`{"text":"Please summarise this invoice and flag missing information."}` >}}
Experimente uma frase cotidiana curta e depois substitua uma palavra por um nome de produto inventado longo. Esta é uma ilustração simplificada da divisão de tokens, não o tokenizador exato ou medidor de faturamento de nenhum modelo. Não insira informações confidenciais em exemplos de aprendizado.
{{< /demo >}}

Contar tokens fornece aos serviços uma maneira prática de descrever o tamanho da entrada, o tamanho da saída e o uso de geração de texto. Relaciona‑se mais estreitamente ao que o modelo processa do que páginas ou bolhas de chat. Um documento de uma página pode conter tabelas densas; um chat que parece curto pode carregar instruções extensas nos bastidores. As contagens de tokens tornam essas diferenças ocultas visíveis.

**Tokens de entrada** são o conteúdo apresentado ao modelo. **Tokens de saída** são o conteúdo que ele gera. Taxas ou regras diferentes podem ser aplicadas a cada um, e alguns modelos de raciocínio também contabilizam tokens de raciocínio interno. Verifique o comportamento documentado do modelo selecionado em vez de supor que a resposta visível representa todo o uso gerado.

## Divida a mesa antes de preenchê‑la

O orçamento de contexto é compartilhado, não uma alocação separada para cada componente. Para muitos modelos, a entrada e a saída gerada devem caber dentro do limite geral de contexto do modelo, com um máximo separado para a saída. Os provedores podem expor esses limites de forma diferente, então verifique ambos. Pedir uma resposta longa não reserva automaticamente espaço suficiente para ela.

A alocação fictícia a seguir é deliberadamente pequena para que a aritmética seja fácil de seguir. Esses valores são apenas ilustrativos: não são limites de plano AIVAX, limites de produto ou uma configuração de produção recomendada.

{{< stats >}}
{{< stat value="8,000" label="illustrative total token budget" >}}
{{< stat value="6,000" label="illustrative input allocation" >}}
{{< stat value="2,000" label="illustrative answer reserve" >}}
{{< /stats >}}

Dentro dessa alocação de entrada, inclua as instruções permanentes, descrições das ferramentas disponíveis, conhecimento recuperado, histórico relevante e a nova pergunta. Reserve espaço também para resultados de ferramentas prováveis, se o assistente as solicitar antes de responder. Uma ferramenta que devolve um documento grande pode consumir inesperadamente mais espaço do que todo o chat do cliente.

{{< demo name="context" title="Try it: a context budget fills up (illustrative)" config=`{"blocks":[["Standing instructions",500,"#7a3fd1"],["Retrieved knowledge",2500,"#1a7f37"],["Earlier conversation",2000,"#0b6bcb"],["Tool result",700,"#7f2942"],["New question",300,"#ad6800"]]}` >}}
Altere o espaço disponível e observe quais blocos permanecem. Esta demonstração remove os blocos mais antigos primeiro e sempre mantém o último. Ilustra uma política de aparo possível, não um comportamento universal do modelo ou uma recomendação para descartar instruções do sistema. Aplicações reais devem proteger regras e dependências essenciais explicitamente.
{{< /demo >}}

Um orçamento de contexto útil reflete a tarefa. Um assistente de políticas pode precisar de material de referência substancial, mas de pouco histórico de conversa. Um assistente de redação revisando uma proposta precisa do rascunho atual e das decisões editoriais recentes, não de todas as versões abandonadas. Fornecer menos material irrelevante pode tornar a evidência mais fácil de encontrar e também reduzir o uso de entrada.

Uma janela grande é capacidade, não garantia de atenção. Um modelo ainda pode ignorar uma pequena exceção enterrada em um documento longo. Coloque instruções críticas claramente, recupere as seções que respondem à pergunta e teste se o assistente encontra a evidência correta em entradas realistas. Não resolva cada fato perdido acrescentando mais material.

## Entenda o que acontece no limite

Quando uma requisição é muito grande, o provedor pode rejeitá‑la. Alternativamente, a aplicação aoente pode encurtar, resumir ou remover conteúdo antes de enviá‑lo. Alguns produtos expõem truncamento configurável, significando que parte da entrada é cortada. Nenhum desses comportamentos deve ser interpretado como o modelo decidindo lembrar os detalhes mais importantes.

Se o contexto anterior desaparecer, um acompanhamento como “Use a segunda opção” pode se tornar impossível de interpretar. Remover metade de uma troca de ferramenta também pode deixar um registro incompleto do que foi solicitado e retornado. Preserve mensagens relacionadas juntas e faça uma pergunta de esclarecimento quando o contexto restante não suportar uma resposta segura.

Um **limite de saída** é uma fronteira diferente: ele limita quanto o modelo pode gerar. Uma resposta que para no meio da frase pode ter atingido esse limite mesmo quando a entrada cabia confortavelmente. Verifique o status de conclusão relatado antes de tratar um objeto JSON cortado ou recomendação incompleta como resultado final.

> [!WARNING]
> A perda silenciosa de contexto pode mudar uma decisão. Proteja as regras, evidências e restrições do cliente necessárias para a tarefa atual; se não puderem ser mantidas, pause ou reduza a tarefa em vez de fingir que o briefing está completo.

## Use três controles diferentes

**Aparo** significa remover conteúdo que não serve mais à tarefa. Bons candidatos incluem cumprimentos repetidos, rascunhos substituídos e resultados de busca duplicados. Mantenha o requisito confirmado mais recente, a fonte relevante e conversa conversa recente suficiente para entender referências. A remoção deve seguir uma política, não simplesmente excluir o que for mais fácil de cortar.

**Resumir** comprime histórico útil em um relato mais curto. Para um assistente interno, um resumo pode reter o resultado solicitado, decisões já confirmadas, perguntas não resolvidas e quaisquer restrições. Marque incerteza como incerteza. Se a mensagem original dizia “talvez no próximo mês”, o resumo não deve transformá‑la em um prazo confirmado. Mantenha evidências importantes disponíveis para verificação.

{{< compare >}}
{{< side title="Short, but missing the constraint" tone="bad" >}}
“Cliente quer um substituto.”

O resumo omite o requisito do cliente de que a entrega não deve ocorrer antes de seu retorno da viagem.
{{< /side >}}
{{< side title="Short and decision-ready" tone="good" >}}
“Cliente solicita um substituto mas não confirmou uma data de entrega adequada. Pergunte antes de agendar a entrega.”

O resumo preserva a condição não resolvida que altera a próxima ação.
{{< /side >}}
{{< /compare >}}

**Cache** reutiliza trabalho anterior em vez de processar o mesmo material da mesma forma todas as vezes. O cache de entrada pode reduzir o processamento repetido para conteúdo suportado e inalterado; o cache de resposta pode reutilizar uma resposta quando a solicitação e o estado relevante realmente correspondem. São mecanismos diferentes com requisitos diferentes de frescor e privacidade.

O cache normalmente não faz o texto em cache desaparecer da janela de contexto. É principalmente uma otimização de processamento ou custo, não capacidade extra de memória. Uma resposta reutilizada também pode se tornar errada quando uma política ou status de pedido muda. Explore esses trade‑offs em [cost optimisation and caching](../production/cost-optimization-and-caching.md).

## Estime um fluxo de trabalho, não um balão de chat

Para uma chamada de texto simples, a estimativa começa com o uso de entrada multiplicado pela sua taxa aplicável, mais o uso de saída multiplicado pela sua taxa aplicável. Uma conversa de negócios real pode gerar várias chamadas ao modelo: a primeira resposta, um acompanhamento relacionado a ferramenta, uma correção e uma resposta final. Inclua essas chamadas, quaisquer capacidades tarifadas separadamente e tentativas ao estimar todo o fluxo de trabalho.

{{< demo name="cost" title="Try it: estimate text cost with illustrative assumptions" config=`{"labels":{"conversations":"Conversations per month","inputTokens":"Input tokens per conversation","outputTokens":"Output tokens per conversation","inputPrice":"Illustrative input price per million tokens (USD)","outputPrice":"Illustrative output price per million tokens (USD)","perConversation":"Illustrative cost per conversation"},"max":500}` >}}
Considere todos os valores neste calculador como suposições ilustrativas, não preços atuais ou previsão de fatura. Compare um briefing compacto com um histórico longo reproduzido. Esta estimativa simplificada não modela toda ferramenta, cache, raciocínio, tentativa ou cobrança de múltiplas chamadas.
{{< /demo >}}

Uma primeira medição prática é um conjunto representativo de tarefas concluídas: quanto de entrada foi enviado, quanto de saída foi gerado, quantas chamadas ocorreram e se o usuário realmente recebeu uma resposta correta. Reduzir o custo por chamada não é uma melhoria se os clientes precisarem repetir a tarefa. Compare o custo por resultado bem‑sucedido assim como os totais brutos de tokens.

Relacionado: para AIVAX, [see current pricing](../../docs/pricing.md) ao transformar medições em orçamento. Mantenha as medições e as suposições de preço separadas para que uma estimativa possa ser atualizada sem reescrever o design da tarefa.

**Próximos passos:** Explore [short-term and long-term memory](memory.md) para decidir o que pertence à conversa atual e o que deve ser armazenado para recordação futura.

{{< quiz options="Input caching automatically expands the context window | Instructions, knowledge, history and the answer need a shared budget | A token is always exactly one word | Every provider silently removes the oldest messages" answer="2" explanation="The context window is a shared working space. Tokenisation, output limits and overflow handling vary, while caching primarily changes repeated processing rather than the amount of context the model can hold." >}}
Qual afirmação é a base mais segura para planejar uma requisição ao modelo?
{{< /quiz >}}
