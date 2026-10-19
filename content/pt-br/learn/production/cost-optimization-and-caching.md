---
{title: Otimização de custos e cache,linkTitle: Custo e cache,description: Entenda o que torna um agente caro e reduza trabalho desnecessário sem enfraquecer a qualidade ou a segurança das respostas.,weight: 10,duration: 12,objectives: [Identificar as principais fontes de custo em uma conversa com um agente.,Escolher controles de custo que preservem a qualidade da tarefa concluída.,Distinguir cache de prompt de cache de resposta.,Planejar orçamentos e alertas para uso rotineiro e inesperado.],sourceHash: 942ab8ffab315c61}
---

Um custo de um agente é mais parecido com a conta de um restaurante do que com um ingresso fixo. O prato principal é a resposta do modelo, mas solicitações adicionais, buscas de documentos e serviços externos podem somar ao total. Uma mensagem curta do cliente pode disparar trabalho substancial nos bastidores. Reduzir custos começa por encontrar esse trabalho, não escolhendo automaticamente o modelo mais barato.

A pergunta útil é: **quanto custa uma tarefa concluída com sucesso?** Uma resposta barata que envia o cliente de volta à mesma conversa pode custar mais do que uma resposta cuidadosa que resolve o problema. Inclua tentativas, correções humanas e turnos de acompanhamento desnecessários ao comparar alternativas.

## Leia a conta completa

Um **token** é um pequeno trecho de texto processado por um modelo, às vezes uma palavra e às vezes parte de uma. **Tokens de entrada** são o que o modelo lê; **tokens de saída** são o que ele produz. A entrada inclui mais do que a pergunta mais recente: instruções, histórico da conversa, trechos de documentos e descrições das ferramentas disponíveis podem contar. Alguns modelos também cobram por trabalho de raciocínio adicional sob suas próprias regras de faturamento.

Em uma conversa de suporte, a primeira pergunta pode ser breve, mas a próxima solicitação costuma incluir novamente mensagens anteriores. Reenviar o histórico é como entregar à recepcionista todo o dossiê do caso sempre que você acrescenta uma frase. Conversas longas podem, portanto, tornar‑se progressivamente mais caras. [Context window, tokens and cost](../prompt-engineering/context-window-tokens-and-cost.md) explica como a quantidade de material que um modelo pode ler se relaciona com esse gasto.

{{< cards >}}
{{< card title="Leitura e escrita" icon="chat" >}}
Instruções e contexto contribuem com tokens de entrada. Explicações longas e rascunhos repetidos contribuem com tokens de saída.
{{< /card >}}
{{< card title="Busca de conhecimento" icon="database" >}}
Recuperação significa encontrar material relevante em uma fonte de conhecimento. Preparar documentos, buscá‑los e classificar resultados pode ter custos separados.
{{< /card >}}
{{< card title="Chamando ferramentas" icon="tools" >}}
Uma ferramenta é uma capacidade externa, como consultar um pedido. Ela pode cobrar separadamente e gerar outra solicitação ao modelo para interpretar seu resultado.
{{< /card >}}
{{< /cards >}}

Meça essas partes separadamente antes de mudar qualquer coisa. Uma equipe pode culpar respostas longas quando, na verdade, buscas repetidas dominam a conta. Registre o uso por categoria de tarefa, bem como por dia: qualificação de vendas, suporte e processamento de documentos noturno têm padrões de custo diferentes. Compare‑os usando a mesma definição de sucesso.

{{< demo name="cost" title="Experimente: uma estimativa ilustrativa de custo por token" config=`{"labels":{"conversations":"Conversations per month","inputTokens":"Input tokens per conversation","outputTokens":"Output tokens per conversation","inputPrice":"Illustrative input price per million tokens (USD)","outputPrice":"Illustrative output price per million tokens (USD)","perConversation":"Illustrative cost per conversation"},"max":500}` >}}
Altere o volume de conversas, o comprimento da entrada e o comprimento da saída separadamente. Considere cada preço neste exercício como ilustrativo. Esta estimativa simplificada exclui ferramentas, recuperação, tentativas e outras cobranças, portanto não é uma conta completa nem uma cotação de produto.
{{< /demo >}}

## Gaste esforço onde importa

**Roteamento** significa escolher um caminho para uma solicitação. Uma classificação simples, como identificar se uma mensagem trata de envio ou faturamento, pode ser adequada para um modelo menor. Uma fatura disputada que envolve vários documentos pode exigir um modelo mais capaz e revisão humana. Roteie pela dificuldade da tarefa e consequências, não apenas pelo tamanho da mensagem: “Cancelar tudo” é curto, mas potencialmente sério.

O roteamento pode exigir trabalho, então compare a economia com seu custo adicional. Mantenha uma rota para casos incertos em vez de forçar toda mensagem ao caminho mais barato. Use exemplos representativos para testar cada escolha; um modelo menor só é mais barato na prática se concluir a tarefa de forma confiável. [Model families and choosing](../models/model-families-and-choosing.md) desenvolve esses critérios de seleção.

Em seguida, reduza o **contexto**, o material fornecido para ajudar o modelo a responder. Recupere a seção de política relevante em vez de enviar o manual inteiro. Limite os resultados das ferramentas aos campos necessários para a decisão. Peça uma resposta concisa quando ela atender à necessidade do usuário, mas não remova explicações necessárias para decisões seguras ou divulgações precisas.

Resumir o histórico substitui uma conversa longa por um relato mais curto de seus fatos importantes. Mantenha o objetivo do cliente, decisões acordadas, perguntas não resolvidas e referências essenciais. Um resumo pode omitir ou distorcer detalhes, e produzi‑lo também custa trabalho. Preserve registros autoritativos em outro lugar; não deixe que um resumo conversacional se torne o único registro de uma aprovação ou instrução de pagamento.

## Reutilize trabalho com cache

Um **cache** é trabalho armazenado que pode ser reutilizado, como manter um formulário preparado em vez de recriá‑lo. Existem duas oportunidades diferentes aqui. Elas têm regras de segurança distintas e não devem ser tratadas como intercambiáveis.

**Prompt caching** reutiliza o processamento de um início idêntico, ou **prefixo**, de uma solicitação quando o provedor o suporta. Instruções estáveis e material de referência compartilhado podem formar esse prefixo, seguido pela pergunta que muda. As regras de correspondência, comprimentos mínimos, períodos de retenção e preços variam. Alterar uma seção inicial pode impedir a reutilização do prefixo posterior. Não significa que a resposta anterior seja reutilizada, e as economias de cache não são automáticas para todo provedor ou solicitação. Para descobrir por que um cache não está sendo reutilizado e como calcular a taxa de acerto, veja [why a prompt cache hit rate is low](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

**Response caching** armazena uma resposta concluída e a devolve para uma pergunta repetida elegível. Isso pode evitar completamente uma chamada ao modelo. Uma resposta pública sobre horário de funcionamento pode ser candidata; o saldo de uma conta geralmente não é. Corresponda a todos os fatores que alteram a resposta, incluindo idioma, permissões e versão do conhecimento. Apenas a semelhança de redação não prova que dois usuários devam receber a mesma resposta.

{{< compare >}}
{{< side title="Cache de prompt" >}}
Reutiliza o processamento de um prefixo de solicitação não alterado. O modelo ainda produz uma nova resposta para a pergunta atual. Verifique as regras de correspondência e retenção do provedor.
{{< /side >}}
{{< side title="Cache de resposta" >}}
Reutiliza uma resposta já concluída. Defina quem pode recebê‑la, quanto tempo permanece válida e quais mudanças a removem do cache.
{{< /side >}}
{{< /compare >}}

Defina uma **expiração**, um ponto após o qual uma resposta em cache deve ser atualizada. Também ofereça **invalidade**, removendo uma resposta armazenada quando algo importante mudar. Se a política de devoluções mudar esta manhã, a explicação em cache de ontem pode já estar errada, mesmo que sua expiração seja amanhã. Nunca compartilhe resultados específicos de cliente através de um cache público e aplique verificações de acesso antes de reutilizar.

## Compare as mudanças de forma justa

O gráfico abaixo mostra unidades de custo fictícias para a mesma carga de trabalho concluída. Cada par representa um experimento separado a partir de sua própria linha de base, não uma sequência de economias cumulativas. Resultados reais dependem do uso, preços e qualidade da tarefa; os valores demonstram como apresentar evidências em vez de prometer redução.

{{< chart type="bar" title="Antes e depois de cada alavanca de custo (ilustrativo)" unit=" unidades de custo" data=`[{"label":"Model routing: before","value":100},{"label":"Model routing: after","value":72},{"label":"Context trimming: before","value":100},{"label":"Context trimming: after","value":81},{"label":"Eligible response caching: before","value":100},{"label":"Eligible response caching: after","value":65}]` caption="Experimentos independentes ilustrativos, não preços ou economias esperadas. Aceite uma mudança apenas se a qualidade e a segurança da tarefa permanecerem aceitáveis." >}}

Para **processamento em lote**, itens independentes são tratados como um grupo em segundo plano, em vez de durante uma conversa ao vivo. Um trabalho de classificação de tickets noturno pode tolerar espera de forma que um cliente ativo não pode. O trabalho em lote pode simplificar o agendamento, controlar trabalho simultâneo e evitar a repetição de itens concluídos. Não presuma que ele seja automaticamente descontado: termos do provedor e o fluxo de trabalho escolhido determinam seu custo.

Relacionado: no AIVAX, processar listas de itens independentes dessa forma é chamado de [Batch](../../docs/inference/batch.md). Para tarifas reais, [veja a precificação atual](../../docs/pricing.md) em vez de usar as figuras ilustrativas nesta unidade.

## Defina um orçamento ao redor do experimento

Um **budget** é o valor de gasto que você está disposto a permitir para um período ou carga de trabalho definidos. Um **alert** avisa alguém de que uma condição precisa de atenção; ele não necessariamente interrompe o gasto. Designe um responsável que possa responder e decida o que acontece quando o limite é alcançado: pause trabalhos em segundo plano, restrinja trabalho opcional ou ofereça uma rota humana.

{{< steps >}}
{{< step title="Medir um baseline" >}}
Registre o custo por tarefa concluída, qualidade e taxas de falha antes de fazer uma mudança. Inclua tentativas malsucedidas.
{{< /step >}}
{{< step title="Mudar um alavanca" >}}
Teste roteamento, tamanho do contexto ou política de cache separadamente para que a razão de qualquer diferença seja visível.
{{< /step >}}
{{< step title="Definir controles operacionais" >}}
Defina alertas de uso, tentativas limitadas e limites de gasto onde suportado. Teste o que o usuário vê quando o trabalho para.
{{< /step >}}
{{< step title="Revisar resultados reais" >}}
Compare a economia de gasto com o esforço de correção e resultados do cliente. Mantenha a mudança apenas quando toda a tarefa melhorar.
{{< /step >}}
{{< /steps >}}

Observe padrões incomuns assim como os totais. Um aumento repentino em solicitações por conversa pode indicar um loop de ferramenta em vez de demanda saudável. Revise o gasto após mudanças de instrução, modelo ou conhecimento, pois cada uma pode alterar quanto trabalho o agente realiza. Economias que desaparecem sob tráfego real são um sinal para investigar, não para remover salvaguardas.

Próximo passo: examine como o mesmo trabalho afeta o tempo de espera em [Performance and latency](performance-and-latency.md).

{{< quiz options="Cachear toda resposta usando apenas o texto da pergunta | Reutilizar respostas públicas elegíveis com permissão, frescor e verificações de versão | Remover todo o histórico da conversa independentemente da tarefa | Escolher o modelo mais barato sem avaliar os resultados" answer="2" explanation="O cache de resposta pode evitar trabalho repetido, mas apenas quando a resposta armazenada é válida para o usuário e situação atuais. Permissões, frescor e verificações de versão protegem a correção e a privacidade." >}}
Qual abordagem de economia de custo é mais adequada para perguntas recorrentes de política?
{{< /quiz >}}
