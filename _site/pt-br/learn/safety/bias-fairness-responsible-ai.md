Source: https://docs.aivax.net/pt-br/learn/safety/bias-fairness-responsible-ai.html

Um assistente de suporte responde pacientemente ao texto polido de um cliente, mas descarta a gramática quebrada de outro cliente como suspeita. Ambos os clientes descrevem o mesmo problema válido. O assistente pode ser fluente, rápido e tecnicamente no assunto, ainda assim fornecer um serviço injusto.

**Viés** é uma tendência sistemática que distorce um julgamento ou resultado. Em IA, pode gerar diferenças não relacionadas às necessidades legítimas da tarefa. **Equidade** questiona se as pessoas são tratadas adequadamente e se benefícios, erros e encargos são distribuídos injustamente. **IA responsável** é a prática mais ampla de atribuir responsabilidade às pessoas por esses efeitos, juntamente com segurança, privacidade e transparência.

Essas são preocupações operacionais práticas, não apenas princípios abstratos. Uma empresa deve ser capaz de explicar o que um agente pode decidir, como ele verifica resultados desiguais e como alguém pode contestar um erro.

## Onde o viés entra no fluxo de trabalho

Um modelo de linguagem aprende padrões a partir de **dados de treinamento**, os exemplos usados para desenvolvê‑lo. Esses exemplos podem refletir exclusão histórica, estereótipos ou lacunas na representação. Mas o modelo é apenas uma fonte de viés. Suas próprias instruções e processos de negócio podem adicioná‑lo mesmo que o modelo subjacente se comporte razoavelmente.

**Recuperação** significa encontrar documentos para ajudar a responder uma pergunta. Se a fonte de conhecimento contém políticas detalhadas para um grupo de clientes mas orientações incompletas para outro, o agente pode responder de forma desigual. A classificação de busca pode agravar o problema ao exibir repetidamente os casos mais comuns enquanto oculta orientações menos comuns porém relevantes.


- **Dados de treinamento** — Associações repetidas em textos históricos podem levar um modelo a fazer suposições sobre a habilidade, necessidades ou confiabilidade de uma pessoa.

- **Instruções** — Uma regra como priorizar pessoas que “soam profissionais” pode transformar uma preferência estilística vaga em acesso desigual ao serviço.

- **Exemplos** — Se todos os exemplos bem‑sucedidos usarem o mesmo estilo de linguagem ou perfil de cliente, o agente pode tratar esse perfil como o caso normal ou preferido.

- **Conhecimento recuperado** — Documentos ausentes, desatualizados ou indexados de forma desigual podem dar a alguns usuários evidências melhores e respostas mais completas que a outros.




Um **proxy** é um detalhe aparentemente neutro que substitui outra característica. Um CEP, nome de escola ou estilo de escrita podem correlacionar‑se com circunstâncias socioeconômicas ou características protegidas. Remover campos demográficos explícitos não elimina todo o proxy. Por outro lado, uma preferência de acessibilidade ou idioma relevante não deve ser descartada apenas porque descreve uma diferença entre usuários.

## Observe as consequências cotidianas

No suporte, o viés pode aparecer como diferentes níveis de cortesia, disposição para investigar ou taxas de transferência desnecessária. Um assistente pode aceitar uma reclamação clara de um falante fluente mas solicitar repetidamente esclarecimentos de um usuário que descreve o mesmo problema em um dialeto regional.

Nas vendas, um agente pode oferecer uma consulta apenas a prospects cujos cargos são semelhantes aos de compradores anteriores. Isso pode excluir pessoas qualificadas com cargos desconhecidos. Um critério de qualificação útil é se o produto atende a uma necessidade declarada, não se o cliente se parece com um exemplo favorito.

Nos recursos humanos, ou **RH**, as consequências são especialmente sérias porque as recomendações podem afetar o emprego. Um agente que resume candidaturas pode supervalorizar instituições familiares ou penalizar lacunas na carreira sem motivo relacionado ao trabalho. Os requisitos legais variam, e decisões de emprego consequentes precisam de expertise de domínio, salvaguardas adequadas e revisão humana significativa. Automatizar uma prática existente não a torna justa.


**Um julgamento não suportado**

“Este cliente escreve informalmente, então a solicitação provavelmente não é séria. Não ofereça uma consulta.” O estilo de escrita está sendo usado como substituto dos critérios reais de qualificação.


**Um julgamento relacionado à tarefa**

“O cliente descreve uma necessidade que o serviço suporta. Faça as mesmas perguntas de elegibilidade usadas para outros prospects, em linguagem clara, e ofereça uma consulta se esses critérios forem atendidos.”





Tratar as pessoas de forma justa nem sempre significa usar a mesma redação. Um cliente que pede linguagem mais simples pode precisar de uma explicação diferente para receber ajuda equivalente. O objetivo é direitos e padrões de decisão consistentes, com acomodações adequadas, em vez de forçar cada pessoa a percorrer exatamente o mesmo caminho conversacional.

## Testar casos comparáveis

Comece definindo a decisão que você deseja examinar. “O agente é justo?” é amplo demais para testar. “O estilo de escrita altera se clientes igualmente elegíveis recebem uma consulta?” identifica uma ação concreta, uma comparação relevante e um resultado esperado.

Um **teste emparelhado** compara dois casos que são equivalentes para a decisão, mas diferem em uma característica que não deveria alterá‑la. Use exemplos sintéticos, inventados e práticas de dados autorizadas. Não colete casualmente informações demográficas sensíveis ou as infira de nomes apenas para preencher um relatório.


1. **Definir os critérios legítimos**

Anote o que deve afetar o resultado e por quê. Tenha um proprietário de negócio e especialistas de domínio adequados revisando esses critérios antes de testar o agente.


2. **Construir casos comparáveis**

Varie o estilo de linguagem ou outra característica de teste justificada mantendo os fatos de elegibilidade estáveis. Inclua diferentes formas de expressar a mesma solicitação e casos extremos realistas.


3. **Executar o mesmo fluxo de trabalho**

Use as mesmas instruções, ferramentas e fontes de conhecimento. Inspecione a ação tomada, a explicação, o tom e a quantidade de esforço exigida do usuário.


4. **Investigar diferenças**

Verifique se uma diferença decorre de um critério legítimo, evidência ausente ou suposição não suportada. Examine tanto casos individuais quanto padrões ao longo do conjunto de testes.


5. **Alterar e retestar**

Corrija a instrução relevante, exemplos, lacuna de conhecimento ou processo de decisão. Repita os testes e verifique se a mudança não introduziu outro tipo de dano.





Use mais de uma paráfrase. As respostas do modelo podem variar entre execuções, e uma amostra pequena pode exagerar ou ocultar um padrão. Registre qual versão do agente foi testada para que uma melhoria futura possa ser comparada nas mesmas condições. Inclua pessoas com conhecimento relevante de linguagem e domínio ao revisar casos sutis.

## Leia números como evidência, não como veredicto

Uma **taxa de aprovação** é a proporção de casos revisados que recebem aprovação. Neste exemplo, aprovação significa um convite para uma consulta de vendas, não uma decisão de empréstimo ou emprego. O gráfico usa casos de teste inventados e igualmente elegíveis divididos em dois grupos de estilo de escrita.


**Taxas de aprovação de consultas antes e depois da mitigação (ilustrativo)**

| Item | Value |
| --- | --- |
| Style A before | 80% |
| Style B before | 60% |
| Style A after | 79% |
| Style B after | 77% |

Dados de ensino inventados para casos comparáveis e elegíveis. A diferença cai de 20 para 2 pontos percentuais; isso não é um benchmark ou prova de equidade.



A redução da diferença é um motivo para inspecionar a mudança, não para declarar o problema resolvido. Talvez o assistente agora aprove todos, incluindo casos inelegíveis. Talvez ainda use um tom desdenhoso com um grupo. Verifique a correção da decisão, o acesso à revisão humana, perguntas desnecessárias e esforço do usuário ao lado da taxa geral.

Um **ponto percentual** é a diferença entre duas porcentagens: passar de 60 % para 80 % representa uma diferença de 20 pontos percentuais. Mantenha o denominador visível em relatórios reais: uma taxa baseada em poucos casos é muito menos informativa que uma avaliação maior bem‑desenhada. A pertença a grupos e os métodos de medição legais também requerem definição cuidadosa.

**Deve todo grupo sempre ter exatamente a mesma taxa de resultado?**

Não necessariamente. Circunstâncias relevantes e o objetivo da decisão importam, e diferentes medidas de equidade podem entrar em conflito. Taxas iguais podem ocultar decisões incorretas; taxas desiguais podem revelar um problema sem explicar sua causa. Escolha medidas com aconselhamento jurídico e de domínio, investigue diferenças e ofereça às pessoas afetadas um caminho para contestar erros.



## Mitigar e manter alguém responsável

Mitigação significa reduzir um risco identificado. Substitua critérios vagos por outros baseados em evidências, diversifique exemplos, repare conhecimento ausente e elimine suposições irrelevantes. Para ações consequentes, limite o papel do agente a coletar fatos ou redigir uma recomendação até que o processo de decisão tenha validação e supervisão adequadas.

Um revisor humano deve ter tempo, informação e autoridade suficientes para discordar. Uma pessoa que clica automaticamente em aprovação não representa supervisão significativa. Mostre as evidências por trás da recomendação, destaque incertezas e permita que o revisor corrija tanto o resultado individual quanto a regra subjacente. Não faça com que usuários afetados argumentem repetidamente com a mesma automação.

Documente a tarefa, critérios, usos excluídos, cobertura de testes, diferenças observadas, mitigações e limites não resolvidos. Atribua um responsável e um ponto de revisão quando instruções, conhecimento ou políticas de negócio mudarem. Inclua um meio acessível de relatar tratamento injusto e trate os relatórios como evidência para investigação, não como prova de que o usuário não entendeu.

Relacionado no AIVAX: [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) podem apoiar verificações conversacionais repetíveis. Eles não certificam, por si sós, equidade nem substituem a revisão especializada de decisões consequentes.

O próximo passo: transformar comportamentos aceitáveis em regras explícitas em [Content moderation and usage policies](https://docs.aivax.net/pt-br/learn/safety/content-moderation-and-policies.md).

**Verifique seu conhecimento.** Qual é a abordagem inicial mais útil quando o estilo de escrita parece afetar as ofertas de consultas?

1. Remover todos os campos demográficos e assumir que o viés é impossível
2. Comparar casos equivalentes, inspecionar as diferenças e retestar mudanças direcionadas
3. Exigir redação idêntica para todos os clientes, independentemente das necessidades de acessibilidade
4. Aceitar taxas de aprovação iguais como prova de que todas as decisões são justas

Answer: option 2. Testes comparáveis ajudam a isolar influências irrelevantes. A equidade também requer a revisão de correção, contexto e impacto ao usuário; nem a remoção de campos nem taxas de aprovação iguais são garantia completa.
