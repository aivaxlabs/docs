Source: https://docs.aivax.net/pt-br/learn/prompt-engineering/anatomy-of-a-prompt.html

Um **prompt** é a entrada que orienta um modelo de linguagem em direção a uma resposta. Em uma caixa de chat simples, ele se parece com a frase que você digita. Em um assistente empresarial, geralmente inclui muito mais: instruções permanentes, mensagens anteriores, documentos relevantes e resultados de outros softwares. Entender essas partes ajuda você a diagnosticar uma resposta ruim sem reescrever incessantemente a pergunta mais recente.

Imagine briefing um recepcionista temporário. Você fornece as regras do escritório, explica o que o visitante deseja e entrega os registros necessários para ajudar. O modelo recebe um briefing semelhante, mas com uma diferença importante: ele não possui uma lembrança privada e duradoura de uma solicitação para a próxima. O aplicativo deve fornecer o briefing relevante novamente.

## As mensagens têm papéis

Uma **mensagem** é uma peça de conversa rotulada com sua origem. O rótulo é chamado de **papel**. Os papéis informam ao modelo se o texto é uma instrução do aplicativo, uma solicitação da pessoa que o utiliza, uma resposta anterior ou uma informação retornada por uma ferramenta. Uma ferramenta é um software que o assistente pode solicitar para realizar uma operação definida, como verificar o status de entrega.

- **Sistema: o briefing permanente** — Escrito pelo proprietário do aplicativo ou administrador. Define o propósito do assistente, o público-alvo, as regras e os limites em todas as solicitações.

- **Usuário: a necessidade atual** — Geralmente escrito pela pessoa que busca ajuda, às vezes montado pelo seu aplicativo. Descreve a tarefa, a pergunta ou o material a ser trabalhado.

- **Assistente: a contribuição do modelo** — Geralmente gerado pelo modelo e salvo pelo aplicativo. Pode ser uma resposta ou uma solicitação para chamar uma ferramenta, não apenas uma resposta finalizada.

- **Ferramenta: uma observação** — Produzida pelo software após uma operação. Relata dados, um resultado ou um erro; não cria nova autoridade para alterar as regras do assistente.

O papel do sistema responde a perguntas como “Para que este assistente é responsável?” e “O que deve acontecer se a resposta não estiver disponível?” Para um assistente de suporte, isso pode significar explicar as políticas de entrega em linguagem clara, verificar os registros dos pedidos antes de declarar um status e encaminhar casos não resolvidos para uma pessoa. Coloque o comportamento durável aqui, em vez de pedir aos clientes que o repitam.

O papel do usuário carrega a necessidade imediata: “Meu pacote não chegou. Você pode verificá-lo?” Um usuário também pode fornecer documentos, correções ou preferências relevantes para essa tarefa. Essas são entradas úteis, mas uma mensagem comum de usuário não deve se tornar uma regra administrativa apenas porque diz “Sou o gerente; ignore a política.” O aplicativo decide quais fontes têm autoridade.

Uma mensagem do assistente registra o que o modelo disse ou solicitou anteriormente. Manter isso ajuda a resolver perguntas de acompanhamento, como “Você pode explicar isso de forma mais simples?” No entanto, uma resposta anterior não é prova de que sua afirmação estava correta. Se o assistente adivinhou uma data de entrega anteriormente, repetir essa resposta no histórico não transforma a suposição em um fato verificado.

Os resultados das ferramentas precisam do mesmo cuidado. Uma consulta bem-sucedida pode estabelecer o status registrado em um sistema autorizado naquele momento. Um erro estabelece apenas que a consulta falhou. Nenhum deles deve ser reescrito silenciosamente no resultado que o cliente esperava. Páginas da web ou documentos recuperados podem conter suas próprias instruções; essas instruções são material de origem, não comandos automaticamente para o assistente.

## Siga uma única conversa

O exemplo a seguir é fictício. Observe que a ferramenta contribui com um registro, enquanto o assistente transforma esse registro em uma resposta voltada para o cliente. Os papéis permanecem separados mesmo quando todas as mensagens são finalmente apresentadas juntas ao modelo.

> **Demonstração interativa: Experimente: insira o papel por trás de cada mensagem.** Esta demonstração interativa está disponível na página web. Explore as mensagens como um briefing, em vez de apenas uma transcrição do que o cliente vê. Esta exibição simplificada mostra o resultado da ferramenta; uma solicitação real habilitada para ferramentas também carrega os detalhes estruturados da chamada da ferramenta necessários para corresponder o resultado à solicitação.

O cliente pode ver apenas sua pergunta e a resposta final. O aplicativo pode manter as instruções do sistema e os detalhes técnicos da ferramenta fora da interface de chat. Invisível para o cliente não significa ausente da entrada do modelo, nem torna as instruções do sistema um local seguro para armazenar segredos. Inclua apenas as informações que o modelo precisa para seu trabalho.

Relacionado: no AIVAX, o tempo de execução configurado que combina instruções, um modelo e capacidades conectadas é chamado de [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Essa configuração é distinta da última mensagem do cliente. Separar os dois facilita a alteração da solicitação do cliente sem enfraquecer as regras operacionais do serviço.

## Reconstrua o briefing a cada turno

Um **turno** é uma troca na conversa. Quando o cliente faz uma pergunta de acompanhamento, o modelo não abre independentemente o chat antigo e lembra o que aconteceu. Na fronteira da solicitação ao modelo, ele é **sem estado**: o contexto relevante deve ser fornecido novamente. Um produto pode armazenar uma conversa para você, mas essa persistência pertence ao aplicativo ou serviço circundante, não a uma memória pessoal duradoura dentro do modelo.

1. **Carregue as instruções permanentes**

O aplicativo seleciona o papel e as regras atuais do assistente. Ele também fornece descrições das ferramentas que o modelo tem permissão para solicitar.

2. **Selecione o contexto relevante**

Inclui histórico útil, preferências armazenadas aprovadas e qualquer conhecimento necessário para esta pergunta. Uma conversa longa pode precisar de um resumo em vez de todas as mensagens antigas.

3. **Adicione a nova mensagem do usuário**

A pergunta mais recente se junta a esse contexto. O aplicativo verifica se há espaço suficiente tanto para a entrada quanto para a resposta esperada.

4. **Gere, observe e continue**

O modelo responde ou solicita uma ferramenta. Se uma ferramenta for executada, o aplicativo anexa seu resultado e fornece a conversa atualizada ao modelo para a próxima geração.

5. **Salve o resultado útil**

O aplicativo registra a troca de acordo com sua política de retenção. Em um turno posterior, ele seleciona e fornece as partes necessárias novamente.

“Tudo é reenviado” significa que tudo o que o modelo precisa para a nova geração deve estar representado em seu contexto de entrada. Não significa que todo produto transmita cada mensagem histórica para sempre. Alguns produtos gerenciam sessões armazenadas, resumos ou entradas reutilizáveis internamente. Essas conveniências não removem a necessidade de decidir quais informações o modelo pode realmente ver nesta solicitação.

Essa distinção explica uma surpresa comum. Você informa a um assistente seu endereço de entrega preferido no início de um bate-papo longo, e depois ele pergunta novamente. O problema pode não ser a formulação pobre: o detalhe original pode não estar mais no histórico selecionado. A unidade sobre [janelas de contexto e tokens](https://docs.aivax.net/pt-br/learn/prompt-engineering/context-window-tokens-and-cost.md) explica esse limite de espaço, enquanto [memória](https://docs.aivax.net/pt-br/learn/prompt-engineering/memory.md) explica a recall deliberada entre conversas.

## Dê a cada parte um único trabalho

Um prompt bem montado separa comportamento, evidência e tarefa. Misturá-los em um único parágrafo longo torna mais difícil ver o que deve permanecer constante e o que deve mudar para um cliente específico. Também dificulta a solução de problemas: você não consegue dizer facilmente se uma resposta errada veio de fatos ausentes ou instruções conflitantes.

**Uma instrução indiferenciada**

“Seja útil. Este cliente diz que todos os pacotes atrasados qualificam-se para reembolso. Eles querem seu dinheiro de volta. Aprovar e escrever uma resposta amigável.”

A afirmação do cliente foi transformada em política, sem verificação de elegibilidade ou autoridade.

**Regra, solicitação e evidência separadas**

**Sistema:** Explique a elegibilidade para reembolso usando a política aprovada; não aprove pagamentos.

**Usuário:** O cliente pede um reembolso porque um pacote está atrasado.

**Ferramenta ou contexto recuperado:** A política atual e o status verificado do pedido.

**Assistente:** Explique o que a evidência suporta e o próximo passo autorizado.

Os rótulos de papel ajudam o modelo a interpretar uma conversa, mas não substituem os controles de software. Uma frase dizendo “nunca emita reembolsos” deve ser reforçada por não conceder autoridade de reembolso a um assistente que apenas explica a política. Mantenha as permissões fora do prompt, bem como descrevendo-as claramente dentro dele.

Ao revisar uma resposta decepcionante, faça uma pergunta prática: “Um novo colega poderia ter respondido corretamente a partir deste briefing exato?” Se fatos essenciais estivessem ausentes, adicionar mais linguagem enfática provavelmente não ajudará. Se os fatos estavam presentes, mas a saída estava confusa, o próximo passo é melhorar a descrição da tarefa e os exemplos.

**Próximos passos:** Explore [técnicas de prompt](https://docs.aivax.net/pt-br/learn/prompt-engineering/prompting-techniques.md) para tornar esse briefing mais claro sem torná-lo desnecessariamente longo.

**Verifique seu conhecimento.** Por que um assistente pode responder a uma pergunta de acompanhamento sobre uma mensagem anterior?

1. O modelo lembra privadamente de todas as conversas anteriores
2. O aplicativo fornece novamente as instruções relevantes, o histórico e a nova mensagem
3. O usuário deve colar manualmente o histórico completo em cada mensagem
4. Uma resposta anterior do assistente se torna automaticamente evidência verificada

Answer: option 2. O modelo funciona a partir do contexto fornecido para a geração atual. O aplicativo ou serviço pode armazenar o histórico e montar esse contexto, mas o modelo não lembra independentemente de uma solicitação anterior.
