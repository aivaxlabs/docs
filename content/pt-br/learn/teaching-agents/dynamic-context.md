---
{title: Contexto dinâmico,linkTitle: Contexto dinâmico,description: Forneça a um agente fatos atuais e autorizados sobre uma conversa sem confundí‑los com conhecimento durável ou memória permanente.,weight: 80,duration: 12,objectives: [Distinguir conhecimento compartilhado de fatos fornecidos para uma conversa específica.,Explicar como ferramentas e etapas de preparação fornecem o contexto atual.,"Gerenciar frescor, privacidade e informações ausentes em dados de tempo de execução.",Escolher fatos relevantes dentro de um orçamento de contexto limitado.],sourceHash: f44b22e5ed57374d}
---

O manual da Trail Lamp explica as condições de garantia. Ele não pode dizer a um agente de suporte qual lâmpada o cliente atual comprou, se um pedido de substituição ainda está aberto ou se o plano de serviço mudou esta manhã. Esses fatos vivem nos sistemas de negócio e podem mudar enquanto a conversa continua.

**Contexto dinâmico** é a informação fornecida a um agente para a interação atual, em vez de ficar fixada permanentemente em suas instruções ou conhecimento compartilhado. Pense em um recepcionista lendo uma lista de compromissos antes de receber um visitante. O manual do colaborador ainda se aplica, mas a lista de compromissos explica quem é o visitante e o que está acontecendo agora. O agente precisa de ambos os tipos de informação, mantidos distintos.

## Separe o manual do caso atual

**Conhecimento estático** significa material de referência relativamente durável: políticas aprovadas, manuais de produtos e procedimentos. Estático não quer dizer “nunca atualizado”. Significa que o material é mantido como conhecimento compartilhado, em vez de ser montado especificamente para esta conversa. O contexto dinâmico responde a perguntas como quem é o cliente verificado, qual plano ele possui atualmente e qual pedido está sendo consultado.

O mesmo tópico pode exigir ambos. Uma política explica o que um plano de serviço inclui; um registro de conta atual estabelece qual plano o cliente tem. A política não pode estabelecer a adesão, e o registro de conta não pode explicar cada exceção na política. Uma resposta precisa combina as evidências relevantes sem fingir que uma fonte faz o trabalho da outra.

{{< compare >}}
{{< side title="Conhecimento compartilhado" >}}
O guia de suporte aprovado da Trail Lamp descreve as condições de garantia e o processo de substituição.

Ele se aplica a conversas relevantes e muda através da manutenção de documentos.
{{< /side >}}
{{< side title="Contexto dinâmico" >}}
O registro de conta atual do cliente verificado mostra seu plano e um pedido de substituição aberto para a Trail Lamp.

Ele se aplica a esse cliente e pode precisar de outra consulta antes da próxima resposta.
{{< /side >}}
{{< /compare >}}

Para a ideia mais ampla de fornecer informação útil a um modelo, consulte [Adding context](../agents/adding-context.md). Aqui o foco está em **runtime**, o período em que o sistema realmente está lidando com uma solicitação. Fatos de runtime devem ser selecionados, verificados e fornecidos naquele momento, em vez de copiados para um documento de instruções geral para todos.

## Decida de onde vem cada fato

Uma **ferramenta** é uma operação controlada que o agente pode solicitar, como consultar um pedido. A aplicação a executa e devolve um resultado. Um **pré‑passo** é trabalho da aplicação realizado antes que o modelo receba a solicitação, como carregar o plano atual do cliente conectado. Ambos podem fornecer contexto; a diferença está em quando e por que a consulta acontece.

Um pré‑passo serve a quase todos os fatos que uma conversa precisa. Uma ferramenta serve a detalhes necessários somente depois que a pergunta é entendida. Carregar todos os pedidos antes de uma pergunta simples sobre produto adiciona informação desnecessária. Esperar que o modelo solicite uma identidade verificada a cada mensagem pode ser igualmente desnecessário quando a aplicação já tem uma sessão autenticada, ou seja, um estado de login cuja identidade o sistema já verificou.

{{< cards >}}
{{< card title="Identidade do cliente" icon="user" >}}
Use o contexto de login verificado da aplicação. Um nome digitado no chat não é prova de propriedade da conta.
{{< /card >}}
{{< card title="Plano atual" icon="briefcase" >}}
Leia o sistema de contas autorizado. Mantenha o plano atual separado da política que explica seus benefícios.
{{< /card >}}
{{< card title="Pedidos abertos" icon="tools" >}}
Consulte pedidos dentro do escopo permitido ao cliente verificado. Pergunte qual pedido importa se vários puderem corresponder.
{{< /card >}}
{{< card title="Data de hoje" icon="time" >}}
Forneça a data da aplicação e o fuso horário relevante. O modelo não deve adivinhar o que “hoje” significa.
{{< /card >}}
{{< /cards >}}

Não use a conversa como atalho para contornar permissões. “Eu sou o proprietário da conta” continua sendo uma declaração do usuário até que a aplicação a verifique. Da mesma forma, uma resposta de ferramenta contendo uma nota de texto livre do cliente ainda é conteúdo criado pelo usuário dentro de uma resposta do sistema. Mantenha-a separada dos campos de conta confiáveis e não trate instruções dentro da nota como autoridade para mudar o comportamento do agente.

Relacionado: no AIVAX, [AI Workers](../../docs/inference/workers.md) podem enriquecer ou reescrever o contexto de gateway em tempo de execução através de um serviço externo. Eles podem apoiar verificações de conta e fatos fornecidos pelo sistema, mas o serviço circundante deve validar solicitações e aplicar permissões. Um worker adiciona outra etapa antes da resposta, portanto sua confiabilidade e tempo de resposta são importantes.

## Torne os fatos atuais visíveis na conversa

O contexto dinâmico não precisa ser mostrado literalmente ao usuário. O modelo precisa de informação suficiente para responder, enquanto o usuário precisa de um resultado claro e de quaisquer limitações importantes. Separe instruções sobre comportamento de fatos sobre o caso atual. “Explicar incerteza” é uma instrução; “o status da substituição está aguardando envio” é um fato de uma fonte específica em um momento específico.

{{< demo name="conversation" title="Experimente: resposta de uma consulta de pedido atual" config=`{"messages":[["system","Use the current authorised order result. Do not invent a dispatch date."],["user","Has my Trail Lamp replacement shipped?"],["tool","Authorised order lookup for the signed-in customer: replacement awaiting dispatch. Checked for this request. No dispatch date available."],["assistant","Your replacement is awaiting dispatch. The current order record does not provide a dispatch date."]]}` >}}
Percorra essa troca fictícia. O resultado da ferramenta fornece o estado atual; o assistente não transforma a data ausente em uma promessa. Esta demonstração é um exemplo preparado, não uma consulta de pedido ao vivo.
{{< /demo >}}

Observe que o manual por si só não poderia responder à pergunta. Ele poderia explicar o processo de substituição, mas o registro de pedido atual é necessário para descrever essa substituição. Da mesma forma, “aguardando envio” não prova que o pacote sairá amanhã. O contexto dinâmico reduz a incerteza; ele não justifica preencher lacunas restantes com detalhes plausíveis.

## Defina uma política de expiração para fatos que mudam

**Frescor** descreve quão recentemente a informação foi verificada e se ainda é adequada para a decisão. O status de um pedido pode precisar ser verificado novamente após o cliente solicitar ao agente que o cancele. Uma preferência de idioma pode permanecer útil ao longo da conversa. Não existe um único intervalo de atualização que sirva a todos os fatos.

Registre a fonte e quando o fato foi obtido. Quando disponível, registre também quando a própria fonte foi atualizada pela última vez. Uma consulta fresca ainda pode retornar um registro comercial antigo. Decida quais mudanças devem acionar outra consulta: uma ação concluída, um novo dia, o cliente mudando de conta ou uma pergunta que exija uma resposta mais atual.

“Hoje” requer cuidados especiais ao redor da meia‑noite e entre fusos horários. Um prazo de entrega deve usar o fuso horário comercial ou do cliente relevante, não uma data de servidor não explicada. Se o fuso horário correto for desconhecido e a distinção for importante, pergunte ou indique a incerteza em vez de apresentar um prazo preciso.

Quando uma consulta falha, não reutilize silenciosamente um valor antigo como se fosse atual. Distinga “nenhum pedido aberto” de “o sistema de pedidos não pôde ser verificado”. Para uma explicação geral, o agente ainda pode usar o manual. Para uma ação dependente da elegibilidade atual, interrompa ou encaminhe a uma pessoa quando a verificação necessária não estiver disponível.

## Proteja a privacidade e o espaço disponível

**Minimização de dados** significa fornecer apenas as informações necessárias para a tarefa. Uma resposta sobre status de entrega raramente requer detalhes de pagamento, endereço completo ou todo o histórico de suporte do cliente. Restrinja o acesso antes de selecionar os dados e, em seguida, remova campos desnecessários antes que cheguem ao modelo. Instruções como “não revele isso” não substituem a evitação de divulgação desnecessária desde o início.

A **janela de contexto** de um modelo é a quantidade limitada de informação que ele pode considerar em uma solicitação. **Tokens** são as unidades de texto usadas para medir esse espaço. Instruções, trechos recuperados, histórico da conversa e fatos dinâmicos competem por espaço, e a aplicação também deve deixar espaço para a resposta.

{{< demo name="context" title="Experimente: um orçamento de contexto (ilustrativo)" config=`{"blocks":[["Instructions",400,"#7a3fd1"],["Warranty evidence",1200,"#1a7f37"],["Old conversation",900,"#0b6bcb"],["Current order facts",300,"#7f2942"],["New question",200,"#735c0f"]]}` >}}
Essas quantidades de tokens são ilustrativas, não um limite de produto. Reduza o espaço disponível e veja quais blocos desaparecem. Esta demonstração simplificada elimina os blocos mais antigos primeiro e mantém o último; ela não representa uma política de produção recomendada.
{{< /demo >}}

Uma aplicação real deve preservar deliberadamente as instruções necessárias e as evidências necessárias para a decisão atual, em vez de descartar cegamente o bloco mais antigo. Prefira um registro compacto e preciso a uma exportação completa da conta. Não encurte “aguardando envio; nenhuma data confirmada” para “envio em breve”, pois isso economiza espaço ao inventar certeza.

O contexto dinâmico também não é automaticamente memória permanente. Alguns fatos devem desaparecer quando a solicitação ou sessão termina. Persistir informações para conversas posteriores requer um propósito separado, decisão de retenção e modelo de permissão, conforme explicado em [Memory](../prompt-engineering/memory.md). Mesmo quando um fato antigo é lembrado, verifique-o novamente antes de confiar nele para um estado de conta que muda.

O que vem a seguir: organize instruções, evidências e a tarefa atual em [Anatomy of a prompt](../prompt-engineering/anatomy-of-a-prompt.md).

{{< quiz options="Copiar o último status de pedido conhecido para todas as conversas futuras | Ler o registro de pedido autorizado atual e explicar quaisquer informações ausentes | Inferir o envio a partir da política geral de entrega | Carregar todos os pedidos do cliente para que o modelo encontre o correto" answer="2" explanation="O status atual do pedido é contexto dinâmico. Ele requer uma consulta autorizada, frescor suficiente para a tarefa e uma distinção honesta entre dados ausentes e fatos confirmados." >}}
Um cliente conectado pergunta se um pedido de substituição aberto foi enviado. Em que o agente deve se basear?
{{< /quiz >}}
