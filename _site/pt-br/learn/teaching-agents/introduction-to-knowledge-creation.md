Source: https://docs.aivax.net/pt-br/learn/teaching-agents/introduction-to-knowledge-creation.html

Imagine contratar um recepcionista que fala claramente, aprende procedimentos rapidamente e nunca trabalhou na sua empresa. Você não esperaria que essa pessoa conhecesse sua política de cancelamento por experiência geral. Você forneceria um manual, mostraria onde a informação atual está e explicaria a quem recorrer quando o manual estiver incompleto. Um agente de IA precisa do mesmo suporte.

Um modelo de linguagem traz padrões gerais aprendidos durante o treinamento, o processo que moldou seu comportamento a partir de exemplos. Ele não conhece automaticamente suas políticas aprovadas ou detalhes privados do produto. **Criação de conhecimento** significa transformar o que sua organização sabe em material confiável que um agente possa encontrar e usar. O objetivo não é fazer upload de todos os arquivos. É ajudar o agente a responder às perguntas pelas quais é responsável, com evidências que alguém possa verificar.

## Comece pelo trabalho, não pelo arquivo

Um agente de suporte ao cliente pode precisar de regras de entrega, instruções de solução de problemas e condições de reembolso. Um assistente de vendas pode precisar de capacidades do produto e regras de elegibilidade. Um assistente interno pode precisar de procedimentos de despesa e da rota para solicitar equipamentos. Cada trabalho cria um limite diferente ao redor do conhecimento útil.

Comece escrevendo uma frase simples: “Este agente ajuda os clientes a entender devoluções, mas não aprova exceções.” Essa frase indica quais fontes são importantes e quais decisões ainda pertencem a uma pessoa. Sem ela, um drive compartilhado pode se tornar uma coleção indiscriminada de rascunhos, contratos e apresentações antigas. Mais material significa mais oportunidades de encontrar algo irrelevante ou errado.

Considere uma loja de bicicletas fictícia. Clientes perguntam repetidamente se uma bicicleta montada pode ser devolvida. A política de devolução aprovada é conhecimento útil. A mensagem informal de um funcionário do armazém dizendo “geralmente fazemos uma exceção” não é automaticamente uma política. Pode revelar um procedimento ausente, mas um proprietário responsável deve decidir o que o agente deve dizer. Preparar o conhecimento costuma expor decisões de negócios que antes eram implícitas.

## O que conta como conhecimento?

O conhecimento não se limita a um manual formal. Inclui fatos, explicações e procedimentos que podem ser aprovados e reutilizados. A distinção importante está entre uma fonte que simplesmente existe e uma fonte na qual sua organização está disposta a confiar.

- **Políticas** — Regras e exceções: quem se qualifica, o que é permitido e quais condições se aplicam.

- **Perguntas e respostas** — Respostas aprovadas para perguntas recorrentes, incluindo quando uma resposta precisa de esclarecimento.

- **Fatos do produto** — Capacidades, compatibilidade, limitações e opções suportadas para uma versão nomeada do produto.

- **Procedimentos** — Ações ordenadas, pré-requisitos e rotas de escalonamento para concluir uma tarefa com segurança.

Uma boa fonte também explica seu escopo. Um documento de garantia deve identificar a faixa de produtos e a região aplicável. Uma política de despesas deve dizer quais funcionários cobre. Se dois departamentos usam a mesma palavra de forma diferente, inclua a distinção em vez de esperar que o agente a infira. “Entrega padrão” não é um fato útil até que as condições por trás desse rótulo estejam claras.

Algumas informações pertencem a outro lugar. O status de entrega atual de um cliente muda com frequência demais para ser tratado como uma entrada permanente de manual. Uma senha de conta não deve se tornar conhecimento pesquisável. Políticas amplamente reutilizáveis pertencem a uma base de conhecimento, um conjunto organizado de fontes aprovadas. Fatos específicos do cliente geralmente pertencem a uma consulta controlada durante a conversa. [Adicionando conhecimento](https://docs.aivax.net/pt-br/learn/agents/adding-knowledge.md) coloca esse componente ao lado de instruções e ferramentas.

## Siga um ciclo de vida, não um upload único

O trabalho se repete porque as organizações mudam. Uma política pode estar correta quando publicada e ser enganosa após o lançamento de um produto. Trate o conhecimento como um serviço com um proprietário, não como uma caixa marcada durante a configuração.

Coletar → Preparar → Indexar → Recuperar → Medir → Manter

**Coletar** significa localizar fontes candidatas e verificar quem pode aprová‑las. **Preparar** significa remover ruído, resolver contradições e preservar condições. **Indexar** significa organizar a informação preparada para que o software possa pesquisá‑la. **Recuperar** significa selecionar material relevante para uma pergunta específica. **Medir** significa verificar se as respostas resultantes são suportadas e úteis. **Manter** significa atualizar ou retirar fontes e repetir essas verificações.

Essas etapas dependem umas das outras. Uma busca excelente não pode transformar uma política obsoleta em uma atual. Uma escrita clara não ajuda se o documento relevante nunca foi indexado. Uma resposta correta em uma demonstração não prova que o agente lidará com uma política alterada amanhã. Olhar para o ciclo de vida completo facilita o diagnóstico de falhas e a atribuição de responsabilidades.

1. **Escolha uma família de perguntas estreita**

Comece com um tópico recorrente, como devoluções. Escreva as perguntas que os clientes realmente fazem, incluindo exceções comuns.

2. **Crie um conjunto de fontes aprovadas**

Selecione documentos atuais, registre seus proprietários e remova rascunhos conflitantes do conjunto pesquisável.

3. **Teste antes de expandir**

Verifique perguntas ordinárias, perguntas ambíguas e perguntas que as fontes não podem responder. Melhore o conjunto de fontes antes de adicionar outro tópico.

Para a loja de bicicletas, o primeiro ciclo pode revelar que a política menciona acessórios não abertos, mas nada sobre bicicletas montadas. O próximo passo correto não é incentivar uma resposta mais confiante. É solicitar ao responsável pela política uma decisão, publicar a redação aprovada e testar essa redação com perguntas realistas. Até então, o agente deve explicar que não pode confirmar a condição e direcionar o cliente ao suporte.

## Torne a propriedade visível

Um **proprietário de conteúdo** é a pessoa ou equipe responsável por manter uma fonte correta. Isso é diferente da pessoa que a faz upload. Operações podem ser responsáveis por procedimentos de envio, equipes de produto podem ser responsáveis por informações de compatibilidade e recursos humanos podem ser responsáveis por políticas de funcionários. Um administrador técnico pode tornar o material pesquisável sem ter autoridade para aprovar seu significado.

Registre um proprietário, uma data efetiva, um público e um gatilho de revisão para cada fonte importante. Um gatilho de revisão é um evento que requer verificação, como uma mudança de política ou lançamento de produto. Um lembrete no calendário é útil, mas não deve ser o único mecanismo: uma mudança crítica não deve esperar pela próxima revisão rotineira. Decida como informações retiradas serão removidas da busca, bem como como novas informações serão adicionadas.

A propriedade também inclui permissões. Uma fonte adequada para funcionários pode ser inadequada para clientes. Decida quem pode pesquisar cada corpo de conhecimento antes de conectá‑lo a um agente. Não confie no modelo para ocultar detalhes restritos após recebê‑los. Forneça apenas as informações que a tarefa atual e o público têm direito de usar.

## Defina um resultado pequeno e observável

Um resultado inicial útil é um conjunto de fontes aprovadas que responde a um grupo definido de perguntas, com um proprietário nomeado e um processo de revisão repetível. “Todos os arquivos enviados” é uma atividade, não evidência de sucesso. Procure respostas que citem a condição correta, reconheçam informações ausentes e evitem inventar exceções.

Mantenha um registro curto de falhas. A resposta estava ausente da fonte, era difícil de encontrar ou estava presente mas foi usada incorretamente? Esses casos exigem reparos diferentes. Esse registro transforma feedback em uma fila de manutenção em vez de uma instrução vaga para tornar o agente mais inteligente.

Relacionado: no AIVAX, o conhecimento pesquisável é organizado em [coleções e documentos](https://docs.aivax.net/pt-br/docs/rag/collections.md). O recurso da plataforma armazena e recupera material; sua organização ainda detém as decisões sobre o que deve ser confiável.

Próximo passo: aprenda como um agente procura evidências antes de responder em [O que é um RAG](https://docs.aivax.net/pt-br/learn/teaching-agents/what-is-a-rag.md).

**Verifique seu conhecimento.** Qual é a base mais forte para o conhecimento de um agente?

1. Faça upload de todos os arquivos disponíveis e deixe o modelo resolver desacordos
2. Atribua um proprietário, aprove fontes relevantes e teste e mantenha-as repetidamente
3. Substitua todas as políticas da empresa pelo conhecimento geral do modelo

Answer: option 2. Conhecimento confiável requer fontes responsáveis e verificações contínuas. Apenas fazer upload de arquivos não estabelece quais informações são atuais, autorizadas ou corretas.
