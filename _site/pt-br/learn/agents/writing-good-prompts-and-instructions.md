Source: https://docs.aivax.net/pt-br/learn/agents/writing-good-prompts-and-instructions.html

Um funcionário capaz ainda precisa saber qual trabalho foi contratado para fazer. “Seja útil” não informa ao consultor de suporte se ele pode aprovar reembolsos, alterar uma conta ou prometer datas de entrega. Um agente tem a mesma necessidade de uma descrição de trabalho clara, embora também exija controles de software que uma instrução escrita não pode substituir.

Um **prompt** é a entrada fornecida a um modelo para uma resposta ou tarefa específica. Pode incluir a pergunta do usuário e o contexto de apoio. **Instruções do sistema** são direções permanentes fornecidas pela aplicação para definir o papel e o comportamento do agente em todas as solicitações. Pense na mensagem do usuário como a tarefa de hoje e nas instruções do sistema como a descrição do trabalho e as regras de operação.

## Descreva o trabalho antes de escolher a redação

Comece com o trabalho que o agente deve realizar, não com a personalidade. “Você é um assistente brilhante” diz pouco sobre um resultado útil. “Ajude os clientes a entender as opções de entrega usando a política atual e use a ferramenta de status de pedido para dúvidas sobre um envio específico” nomeia um propósito e conecta diferentes perguntas à evidência correta.

Seja explícito sobre o público-alvo pretendido. Uma resposta de suporte para um cliente não deve parecer um relatório interno de incidente. Um assistente interno pode usar terminologia que os funcionários reconhecem, enquanto um assistente público deve explicar termos desconhecidos. Definir o público ajuda o agente a escolher detalhes e tom sem fingir que o estilo é a tarefa inteira.

Em seguida, descreva o sucesso de forma que um revisor possa observar. Por exemplo: responder à pergunta do cliente, distinguir política do status atual, citar a fonte de apoio quando disponível e solicitar um acompanhamento necessário quando a evidência estiver ausente. Esses critérios são mais testáveis do que “sempre oferecer uma experiência excelente”.

## As seções de uma instrução útil

Uma boa instrução costuma ser um documento pequeno e organizado, em vez de um longo parágrafo de exigências. Mantenha regras sobre o mesmo assunto juntas. Se vários trechos descrevem o que fazer quando a informação está ausente, combine-os em uma regra clara em vez de fazer o agente conciliar versões ligeiramente diferentes.


- **Papel e objetivo** — Declare quem o agente ajuda e qual resultado ele deve buscar. Nomeie o trabalho, não um nível exagerado de especialização.

- **Escopo e evidência** — Identifique os assuntos que ele trata e as fontes ou ferramentas que deve consultar. Diga o que fazer quando essas fontes não respondem à pergunta.

- **Limites** — Liste limites significativos, aprovações necessárias e condições de escalonamento. Distinga explicar uma ação de estar autorizado a executá‑la.

- **Tom e formato** — Especifique o público, o nível de detalhe e as seções ou campos obrigatórios. Peça clareza respeitosa em vez de um traço de personalidade vago.

- **Exemplos** — Mostre entradas realistas e respostas aceitáveis, incluindo incerteza. Use exemplos para demonstrar regras, não para introduzir exceções ocultas.




As seções devem concordar. “Nunca faça uma pergunta” conflita com “verifique todos os detalhes necessários antes de atualizar um registro” sempre que o usuário omitir um detalhe. “Sempre responda com confiança” conflita com admitir que uma fonte está indisponível. Resolva esses conflitos na própria instrução; não espere que o modelo descubra a prioridade de negócio que você pretendia.

## Substitua adjetivos vagos por comportamentos

Uma instrução pode ser curta sem ser vaga. O teste é se dois revisores reconheceriam a mesma resposta bem‑sucedida. “Profissional” significa coisas diferentes para pessoas diferentes. “Use linguagem simples, evite culpar e explique o próximo passo disponível” aponta para um comportamento visível.


**Vago: personalidade em vez de propósito**

Você é um especialista de suporte de classe mundial. Seja útil, proativo e confiante. Resolva todo problema do cliente.


**Específico: um papel de suporte delimitado**

Ajude os clientes a entender a política de entrega e o status de seus próprios pedidos. Consulte a política aprovada para regras e a ferramenta de consulta autorizada para o status atual. Se a evidência estiver ausente, diga o que é desconhecido e ofereça a rota de suporte adequada. Não prometa reembolsos ou datas de entrega sem autoridade de apoio.





A versão específica não garante correção. Ela fornece ao aplicativo um alvo comportamental mais claro e dá aos revisores uma base para checar respostas. Permissões de ferramentas, qualidade da fonte e verificações de identidade ainda precisam funcionar de forma independente. Uma regra escrita dizendo “apenas leia o pedido deste cliente” não é suficiente se o serviço conectado expuser todos os pedidos sem checar o acesso.

Um segundo problema comum é solicitar uma saída sem explicar como ela será usada. Um gerente revisando um resumo de caso precisa de detalhes diferentes de um engenheiro investigando uma falha. Declare a estrutura desejada quando isso ajudar o leitor ou um sistema subsequente a usar o resultado.


**Vago: um resumo indefinido**

Resuma este caso de forma agradável. Inclua tudo que for importante e mantenha curto.


**Específico: um resumo de caso revisável**

Escreva um resumo de caso com estes títulos: Solicitação do cliente, Fatos verificados, Perguntas em aberto e Próximo passo. Separe as alegações reportadas pelo cliente dos fatos confirmados por ferramenta. Não descreva uma ação proposta como concluída. Deixe detalhes desconhecidos explicitamente marcados como desconhecidos, em vez de preenchê‑los.





Se o software precisar ler o resultado automaticamente, concorde nos campos exatos e valide a resposta no software. Formatação amigável ao humano e saída legível por máquina são requisitos relacionados, mas diferentes. Um título que parece correto para uma pessoa não satisfaz necessariamente um programa que espera uma estrutura de dados definida.

## Use exemplos para ensinar distinções

Exemplos ajudam quando uma regra é fácil de ser mal interpretada. “Não invente fatos” é amplo; uma resposta de exemplo que admite uma consulta falhada demonstra como a honestidade se parece em uma tarefa real. Inclua tanto casos ordinários quanto casos nos quais o agente deve perguntar, parar ou encaminhar o usuário a outra pessoa.

Mantenha os exemplos consistentes com as regras escritas. Se as regras dizem que um reembolso requer aprovação mas todo exemplo concede um imediatamente, a instrução envia sinais conflitantes. Também deixe claro quais detalhes são fictícios. Não use conversas reais de clientes contendo informações pessoais como exemplos públicos e remova detalhes identificadores desnecessários de material de teste interno.

> **Demonstração interativa: Experimente: instruções claras produzem uma resposta revisável.** Esta demonstração interativa está disponível na página web. Esta é uma ilustração roteirizada, não uma resposta de modelo ao vivo. Observe a distinção entre uma verificação falhada e um resultado negativo: a ferramenta não disse que a entrega não ocorreu.



Essa distinção é importante em muitas tarefas de negócio. “Nenhum registro foi encontrado” difere de “a busca falhou”. “A solicitação foi enviada” difere de “a alteração foi confirmada”. Instruções úteis nomeiam essas diferenças porque a linguagem plausível pode ocultar incerteza operacional.

## Rascunhe, teste e refine com situações reais

Não julgue uma instrução apenas lendo‑a. Teste como o agente configurado se comporta quando um usuário está confuso, uma fonte está ausente ou uma ferramenta retorna um erro. Use conversas representativas da tarefa pretendida, com permissão adequada e remoção de informações identificáveis. Cenários inventados podem preencher lacunas, mas não devem ser a única evidência de prontidão.


1. **Escreva a menor descrição de trabalho completa**

Defina a meta, o público, as fontes de evidência, os limites e a saída desejada. Remova ambições não relacionadas antes de adicionar mais detalhes.


2. **Colete casos representativos**

Inclua perguntas comuns, solicitações ambíguas, solicitações não suportadas e consultas falhas. Anote o que um resultado aceitável deve mostrar.


3. **Inspecione a falha real**

Decida se o problema veio de instruções pouco claras, conhecimento ausente, falha de ferramenta ou checagens de permissão insuficientes. Não trate cada falha como um problema de redação.


4. **Faça uma mudança focada e verifique novamente**

Altere a regra ou exemplo relevante, então execute os casos anteriores novamente. Confirme que corrigir um comportamento não quebrou outro.





Mantenha uma cópia versionada das instruções: um registro de qual redação estava ativa e o que mudou. Isso facilita explicar por que o comportamento mudou e restaurar uma versão anterior se uma revisão causar problemas. Pequenas mudanças geralmente são mais fáceis de avaliar do que substituir toda a instrução após uma resposta decepcionante.

Evite transformar o documento em um catálogo de todas as falhas já observadas. Algumas regras pertencem a ferramentas ou controles de aplicação; outras pertencem a uma habilidade especializada carregada para aquela tarefa. Avisos repetidos podem obscurecer o trabalho principal. O objetivo é um acordo de trabalho coerente, não o prompt mais longo possível.

## Reconheça os limites da redação

Instruções melhores podem melhorar a consistência, mas não podem fornecer dados indisponíveis, criar permissões ou garantir conformidade. Se um agente não tem a política atual, adicione a fonte correta. Se uma ferramenta aceita ações inseguras, corrija a integração. Se o processo requer aprovação humana, imponha esse ponto de controle em vez de adicionar adjetivos mais fortes ao prompt.

Para um quadro de rascunho mais aprofundado, continue com [Anatomy of a prompt](https://docs.aivax.net/pt-br/learn/prompt-engineering/anatomy-of-a-prompt.md). A unidade [common prompt mistakes](https://docs.aivax.net/pt-br/learn/prompt-engineering/common-prompt-mistakes.md) examina regras conflitantes, contexto ausente e outros padrões que dificultam a previsão do comportamento.

Próximo passo: comece [Introduction to knowledge creation](https://docs.aivax.net/pt-br/learn/teaching-agents/introduction-to-knowledge-creation.md) e aprenda como preparar as evidências que suas instruções dizem ao agente para usar.

**Verifique seu conhecimento.** Um agente fornece resumos de caso inconsistentes. Qual abordagem é mais útil?

1. Adicionar mais elogios à expertise do agente
2. Clarificar o comportamento esperado, inspecionar falhas reais e testar uma revisão focada
3. Dizer ao agente que nunca deve admitir incerteza

Answer: option 2. Boas instruções definem comportamento observável e melhoram por meio de evidências. Elogios e confiança forçada não corrigem fontes ausentes, limites pouco claros ou falhas de ferramenta.
