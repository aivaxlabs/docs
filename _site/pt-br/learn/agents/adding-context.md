Source: https://docs.aivax.net/pt-br/learn/agents/adding-context.html

Um colega pergunta: “Podemos aprovar isso?” A pergunta tem pouco sentido até que você saiba a que *isso* se refere, quem está perguntando e quais regras se aplicam. Os modelos de linguagem enfrentam o mesmo problema. **Contexto** é a informação disponível ao modelo enquanto ele produz uma resposta. Uma resposta útil depende não apenas da habilidade geral do modelo, mas também da situação específica que lhe foi mostrada.

Considere um assistente de suporte perguntado se um cliente pode devolver um produto. O conceito geral de devolução é familiar, mas a resposta correta pode depender da data da compra, tipo de produto, política atual e ações já realizadas. Se esses detalhes estiverem ausentes, o modelo pode solicitá‑los ou fazer uma suposição sem suporte. Um bom design de contexto disponibiliza as evidências necessárias enquanto evita informações não relacionadas ou não autorizadas.

## O que está na mesa do modelo?

Pense no contexto como uma mesa preparada antes de cada tarefa. O assistente pode usar o que está na mesa, junto com padrões aprendidos durante o treinamento. Ele não pode abrir automaticamente todos os arquivos do prédio. A aplicação decide quais materiais colocar lá e quais ferramentas, se houver, podem trazer mais informações.

Uma solicitação costuma conter **instruções do sistema**, que são direções de prioridade mais alta fornecidas pela aplicação; **histórico da conversa**, que são mensagens selecionadas anteriormente; a solicitação atual do usuário; e informações relevantes fornecidas pela aplicação. Essa última categoria pode incluir detalhes de usuário verificados, trechos de documentos ou resultados retornados por ferramentas. Nem todo sistema usa a mesma estrutura de mensagem, mas a distinção entre instruções e evidências continua importante.

- **Instruções do sistema** — Defina o papel e os limites do assistente: responder perguntas sobre entrega, distinguir fatos confirmados de estimativas e escalar casos excepcionais.

- **Histórico da conversa** — Preserve detalhes relevantes já discutidos, como qual produto o cliente se refere e quais esclarecimentos foram respondidos.

- **Dados de usuário verificados** — Forneça fatos permitidos sobre o caso atual. Um relacionamento de conta verificado é diferente de um usuário que apenas afirma ser proprietário.

- **Evidência recuperada** — Forneça trechos relevantes de documentos aprovados ou resultados de uma consulta atual, com informação suficiente da fonte para avaliar sua relevância.

**Recuperado** simplesmente significa encontrado e trazido para a solicitação. Uma política pode viver em um repositório de documentos até que uma busca selecione a seção relevante. Isso pode ser mais eficaz do que inserir o manual inteiro em cada conversa. Também facilita a manutenção da fonte: a organização atualiza a política em vez de esperar que o treinamento anterior do modelo já a reflita.

## A conversa deve ser fornecida

Uma tela de conversa pode criar a impressão de que o modelo lembra de tudo automaticamente. Na prática, a aplicação normalmente envia as mensagens ou uma representação do histórico relevante a cada nova solicitação. A conversa visível e a informação exata fornecida ao modelo nem sempre são idênticas.

Se a aplicação omitir uma correção anterior, o modelo pode não conseguir usá‑la. Se um resumo excluir uma exceção importante, a nova resposta pode estar errada mesmo que o cliente tenha mencionado a exceção anteriormente. Por isso “o usuário já nos contou” não é suficiente ao diagnosticar uma resposta. Pergunte se a informação realmente chegou ao modelo na solicitação atual.

> **Demonstração interativa: Inspecionar o que o assistente recebe.** Esta demonstração interativa está disponível na página web. Esta conversa ilustrativa mostra diferentes fontes de contexto. A urgência do cliente explica a necessidade, enquanto o resultado da ferramenta limita o que o assistente pode prometer honestamente. A demonstração exibe mensagens preparadas; ela não consulta um sistema de pedidos.

Um resultado de ferramenta é evidência sobre uma operação específica, não um novo conjunto de regras para o assistente. O mesmo se aplica a trechos de documentos e mensagens citadas de outras pessoas. Manter essas fontes claramente rotuladas ajuda a impedir que o modelo confunda uma declaração que deve analisar com uma instrução que deve obedecer.

## A janela de contexto é uma mesa limitada

A **janela de contexto** é a quantidade máxima de informação baseada em tokens que um modelo pode processar de uma vez, dentro de seus limites suportados. Tokens são pequenos trechos de texto, não um número fixo de palavras. Instruções, conversa e evidências fornecidas consomem espaço; a aplicação também deve levar em conta o espaço necessário para gerar a resposta de acordo com os limites do modelo.

Uma mesa maior pode conter mais papéis, mas não decide quais papéis são importantes. Muito material não relacionado pode distrair das evidências úteis, aumentar o trabalho de processamento e tornar contradições mais difíceis de perceber. Escolher informações relevantes continua importante mesmo quando um modelo aceita entradas longas.

> **Demonstração interativa: Experimente: encaixe o caso na mesa.** Esta demonstração interativa está disponível na página web. As quantidades de tokens são ilustrativas. Esta demonstração simplificada descarta os blocos mais antigos primeiro e mantém o último bloco. Aplicações reais devem escolher sua própria política de contexto; elas não devem descartar instruções essenciais cegamente apenas porque essas instruções foram adicionadas primeiro.

Quando a mesa se enche, a aplicação pode selecionar histórico relevante, resumir discussões mais antigas ou recuperar apenas os trechos necessários para a pergunta. Cada escolha tem trade‑offs. Um resumo economiza espaço mas pode perder um detalhe; uma busca estreita pode perder uma exceção relevante. Preserve decisões, perguntas não resolvidas e referências de fonte importantes, em vez de manter apenas as frases mais recentes.

## Por que começar com contexto em vez de ajuste fino?

**Ajuste fino** é um treinamento adicional que ajusta um modelo usando exemplos selecionados. Pode ajudar a moldar um estilo recorrente ou comportamento de tarefa quando há uma necessidade clara e dados de treinamento adequados. Não costuma ser a forma mais simples de manter fatos comerciais atualizados, aplicar acesso a registros ou fornecer o estado mais recente de um caso de cliente.

Para a maioria das perguntas de negócio sobre políticas e registros em mudança, comece fornecendo contexto confiável. É mais fácil substituir um trecho de política desatualizado do que retreinar o modelo cada vez que a política mudar. O contexto também permite que a aplicação dê informações autorizadas diferentes a usuários diferentes. Um modelo treinado em um fato não estabelece quem pode receber esse fato.

**Fornecer contexto atual**

Forneça o trecho de política aprovado para esta pergunta. Atualize a fonte quando a política mudar e selecione o material de acordo com o acesso do usuário.

**Alterar comportamento do modelo**

Considere ajuste fino quando exemplos repetidos são necessários para moldar um comportamento estável. Ainda assim, requer avaliação, evidência atual e verificações de permissão separadas.

O contexto também não é mágica. O modelo pode interpretar erroneamente o material fornecido, e uma fonte errada pode gerar uma explicação bem fundamentada da regra equivocada. Antes de adicionar complexidade de treinamento, verifique se a informação correta foi fornecida, se as instruções estavam claras e se a tarefa é suportada por ferramentas adequadas. Muitas vezes, essas são melhorias mais diretas.

## Prepare o contexto como um arquivo de caso útil

Para a pergunta de devolução, inclua a seção de política relevante e os fatos verificados necessários para aplicá‑la. Rotule datas e fontes para que o modelo possa distinguir uma política antiga de uma atual. Se a descrição do cliente conflitar com o registro do pedido, apresente isso como um conflito a ser resolvido, não como razão para selecionar silenciosamente a versão mais conveniente.

Use apenas as informações necessárias para a tarefa. Um endereço ou histórico de conta não relacionado não deve ser incluído apenas porque a aplicação pode acessá‑los. Proteja dados sensíveis antes que cheguem ao modelo, não apenas pedindo ao modelo que evite repeti‑los. A preparação do contexto é tanto uma decisão de qualidade quanto de privacidade.

**Relacionado:** No AIVAX, [collections](https://docs.aivax.net/pt-br/docs/rag/collections.md) organizam material de referência para recuperação. Elas dão suporte ao lado de conhecimento do contexto; não substituem a necessidade de selecionar a conversa e as informações de caso apropriadas.

**Próximo passo:** Aprenda como um agente pode solicitar informações frescas ou uma ação permitida em [Adding tools](https://docs.aivax.net/pt-br/learn/agents/adding-tools.md).

**Verifique seu conhecimento.** Qual é a abordagem inicial mais forte para um assistente que responde perguntas sobre registros de negócio em mudança?

1. Ajustar o modelo sempre que o status de entrega mudar
2. Fornecer informações de caso autorizadas e política atual na solicitação
3. Incluir todo documento e registro de cliente independentemente da relevância
4. Assumir que o modelo lembra de todas as conversas anteriores automaticamente

Answer: option 2. O contexto atual é a forma direta de fornecer fatos em mudança para um caso específico. Relevância, permissões e qualidade da fonte ainda precisam ser verificadas.
