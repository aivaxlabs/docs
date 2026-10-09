Source: https://docs.aivax.net/pt-br/learn/production/cost-optimization-and-caching.html

O custo de um agente é mais parecido com a conta de um restaurante do que com um ingresso fixo. O prato principal é a resposta do modelo, mas solicitações extras, buscas de documentos e serviços externos podem somar ao total. Uma mensagem curta do cliente pode gerar trabalho substancial nos bastidores. Reduzir custos começa por encontrar esse trabalho, não escolhendo automaticamente o modelo mais barato.

A pergunta útil é: **qual é o custo de uma tarefa concluída com sucesso?** Uma resposta barata que devolve o cliente à mesma conversa pode custar mais do que uma resposta cuidadosa que resolve o problema. Inclua tentativas, correções humanas e turnos de acompanhamento desnecessários ao comparar alternativas.

## Leia a conta completa

Um **token** é um pequeno fragmento de texto processado por um modelo, às vezes uma palavra e às vezes parte dela. **Tokens de entrada** são o que o modelo lê; **tokens de saída** são o que ele produz. A entrada inclui mais do que a pergunta mais recente: instruções, histórico da conversa, trechos de documentos e descrições das ferramentas disponíveis podem contar. Alguns modelos também cobram por trabalho de raciocínio adicional sob suas próprias regras de faturamento.

Em uma conversa de suporte, a primeira pergunta pode ser breve, mas a próxima solicitação costuma incluir mensagens anteriores novamente. Reenviar o histórico é como entregar ao recepcionista toda a pasta do caso sempre que você adiciona uma frase. Conversas longas podem, portanto, tornar-se progressivamente mais caras. [Context window, tokens and cost](https://docs.aivax.net/pt-br/learn/prompt-engineering/context-window-tokens-and-cost.md) explica como a quantidade de material que um modelo pode ler se relaciona com esse gasto.


- **Leitura e escrita** — Instruções e contexto contribuem com tokens de entrada. Explicações longas e rascunhos repetidos contribuem com tokens de saída.

- **Busca de conhecimento** — Recuperação significa encontrar material relevante em uma fonte de conhecimento. Preparar documentos, pesquisá-los e classificar resultados podem ter custos separados.

- **Chamando ferramentas** — Uma ferramenta é uma capacidade externa, como consultar um pedido. Ela pode cobrar separadamente e disparar outra solicitação ao modelo para interpretar seu resultado.




Meça essas partes separadamente antes de mudar qualquer coisa. Uma equipe pode culpar respostas longas quando buscas repetidas realmente dominam a conta. Registre o uso por categoria de tarefa e também por dia: qualificação de vendas, suporte e processamento de documentos durante a noite têm padrões de custo diferentes. Compare-as usando a mesma definição de sucesso.

> **Demonstração interativa: Experimente: uma estimativa ilustrativa de custo por token.** Esta demonstração interativa está disponível na página web. Mude o volume de conversas, o comprimento da entrada e o comprimento da saída separadamente. Considere cada preço neste exercício como ilustrativo. Esta estimativa simplificada exclui ferramentas, recuperação, tentativas e outras cobranças, portanto não é uma conta completa nem uma cotação de produto.



## Gaste esforço onde realmente importa

**Roteamento** significa escolher um caminho para uma solicitação. Uma classificação simples, como identificar se uma mensagem diz respeito a envio ou faturamento, pode ser adequada para um modelo menor. Uma fatura contestada envolvendo vários documentos pode exigir um modelo mais capaz e revisão humana. Roteie de acordo com a dificuldade e as consequências da tarefa, não apenas pelo comprimento da mensagem: “Cancelar tudo” é curto, mas potencialmente sério.

O roteamento em si pode exigir trabalho, portanto compare a economia com seu custo adicional. Mantenha uma rota para casos incertos ao invés de forçar toda mensagem ao caminho mais barato. Use exemplos representativos para testar cada escolha; um modelo menor só é mais barato na prática se concluir a tarefa de forma confiável. [Model families and choosing](https://docs.aivax.net/pt-br/learn/models/model-families-and-choosing.md) desenvolve esses critérios de seleção.

Em seguida, reduza o **contexto**, o material fornecido para ajudar o modelo a responder. Recupere a seção de política relevante ao invés de enviar todo o manual. Limite os resultados das ferramentas aos campos necessários para a decisão. Peça uma resposta concisa quando ela atender à necessidade do usuário, mas não remova explicações necessárias para decisões seguras ou divulgações precisas.

Resumir o histórico substitui uma conversa longa por um relato mais curto de seus fatos importantes. Mantenha o objetivo do cliente, decisões acordadas, perguntas não resolvidas e referências essenciais de fonte. Um resumo pode omitir ou distorcer detalhes, e produzi-lo também custa trabalho. Preserve registros autoritativos em outro lugar; não deixe que um resumo de conversa se torne o único registro de uma aprovação ou instrução de pagamento.

## Reutilize trabalho com cache

Um **cache** é trabalho armazenado que pode ser reutilizado, como manter um formulário preparado ao invés de recriá-lo. Existem duas oportunidades diferentes aqui. Elas têm regras de segurança diferentes e não devem ser tratadas como intercambiáveis.

**Cache de prompt** reutiliza o processamento de um início idêntico, ou **prefixo**, de uma solicitação quando o provedor o suporta. Instruções estáveis e material de referência compartilhado podem formar esse prefixo, seguido pela pergunta que muda. As regras de correspondência, comprimentos mínimos, períodos de retenção e preços variam. Alterar uma seção inicial pode impedir a reutilização do prefixo posterior. Isso não significa que a resposta anterior seja reutilizada, e as economias de cache não são automáticas para todo provedor ou solicitação.

**Cache de resposta** armazena uma resposta concluída e a devolve para uma pergunta repetida elegível. Isso pode evitar totalmente uma chamada ao modelo. Uma resposta pública sobre horário de funcionamento pode ser um candidato; o saldo da conta geralmente não é. Corresponda a cada fator que altera a resposta, incluindo idioma, permissões e versão do conhecimento. Apenas uma formulação semelhante não prova que dois usuários devem receber a mesma resposta.


**Cache de prompt**

Reutilize o processamento de um prefixo de solicitação não alterado. O modelo ainda produz uma nova resposta para a pergunta atual. Verifique as regras de correspondência e retenção do provedor.


**Cache de resposta**

Reutilize uma resposta já concluída. Defina quem pode recebê-la, por quanto tempo permanece válida e quais mudanças devem removê-la do cache.





Defina um **tempo de expiração**, um ponto após o qual uma resposta em cache deve ser atualizada. Também suporte **invalidação**, removendo uma resposta armazenada quando algo importante muda. Se a política de devoluções mudar esta manhã, a explicação em cache de ontem pode já estar errada mesmo que sua expiração seja amanhã. Nunca compartilhe resultados específicos de clientes através de um cache público e aplique verificações de acesso antes da reutilização.

## Compare mudanças de forma justa

O gráfico abaixo mostra unidades de custo fictícias para a mesma carga de trabalho concluída. Cada par representa um experimento separado a partir de sua própria linha de base, não uma sequência de economias cumulativas. Resultados reais dependem do uso, preços e qualidade da tarefa; os valores demonstram como apresentar evidências ao invés de prometer uma redução.


**Antes e depois de cada alavanca de custo (ilustrativo)**

| Item | Value |
| --- | --- |
| Model routing: before | 100unidades de custo |
| Model routing: after | 72unidades de custo |
| Context trimming: before | 100unidades de custo |
| Context trimming: after | 81unidades de custo |
| Eligible response caching: before | 100unidades de custo |
| Eligible response caching: after | 65unidades de custo |

Experimentos independentes ilustrativos, não preços ou economias esperadas. Aceite uma mudança somente se a qualidade e a segurança da tarefa permanecerem aceitáveis.



Para **processamento em lote**, itens independentes são tratados como um grupo em segundo plano ao invés de durante uma conversa ao vivo. Um trabalho de classificação de tickets durante a noite pode tolerar espera de forma que um cliente ativo não pode. O trabalho em lote pode simplificar o agendamento, controlar o trabalho simultâneo e evitar a repetição de itens concluídos. Não presuma que ele seja descontado automaticamente: os termos do provedor e o fluxo de trabalho escolhido determinam seu custo.

Relacionado: no AIVAX, processar listas de itens independentes dessa forma é chamado de [Batch](https://docs.aivax.net/pt-br/docs/features/batch.md). Para tarifas reais, [veja a precificação atual](https://docs.aivax.net/pt-br/docs/pricing.md) em vez de usar as figuras ilustrativas nesta unidade.

## Defina um orçamento para o experimento

Um **orçamento** é a quantidade de gasto que você está preparado para permitir para um período ou carga de trabalho definidos. Um **alerta** avisa alguém que uma condição precisa de atenção; não necessariamente interrompe o gasto. Atribua um responsável que possa responder e decida o que acontece quando um limite é alcançado: pause trabalhos em segundo plano, restrinja trabalho opcional ou ofereça uma rota humana.


1. **Medir uma linha de base**

Registre o custo por tarefa concluída, qualidade e taxas de falha antes de fazer uma mudança. Inclua tentativas malsucedidas.


2. **Mudar uma alavanca**

Teste roteamento, tamanho do contexto ou política de cache separadamente para que a razão de qualquer diferença seja visível.


3. **Definir controles operacionais**

Defina alertas de uso, tentativas limitadas e limites de gasto onde suportado. Teste o que o usuário vê quando o trabalho para.


4. **Revisar resultados reais**

Compare o gasto economizado com o esforço de correção e os resultados do cliente. Mantenha a mudança somente quando toda a tarefa melhorar.





Observe padrões incomuns assim como os totais. Um aumento repentino de solicitações por conversa pode indicar um loop de ferramenta ao invés de demanda saudável. Revise os gastos após mudanças de instrução, modelo ou conhecimento, pois cada um pode alterar quanto trabalho o agente realiza. Economias que desaparecem sob tráfego real são um sinal para investigar, não para remover salvaguardas.

O que vem a seguir: examinar como o mesmo trabalho afeta o tempo de espera em [Performance and latency](https://docs.aivax.net/pt-br/learn/production/performance-and-latency.md).

**Verifique seu conhecimento.** Qual abordagem de economia de custos é mais adequada para perguntas de política repetidas?

1. Cachear toda a resposta usando apenas o texto da pergunta
2. Reutilizar respostas públicas elegíveis com permissão, verificação de atualidade e versão
3. Remover todo o histórico da conversa independentemente da tarefa
4. Escolher o modelo mais barato sem avaliar os resultados

Answer: option 2. O cache de resposta pode evitar trabalho repetido, mas somente quando a resposta armazenada é válida para o usuário e situação atuais. Permissões, atualidade e verificações de versão protegem a correção e a privacidade.
