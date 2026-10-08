Source: http://localhost:1313/pt-br/learn/quality/ab-testing.html

Um **teste A/B** compara duas versões, chamadas **variantes**, para descobrir se uma mudança deliberada melhora um resultado. A variante A costuma ser a configuração atual; a variante B altera algo significativo, como as instruções ou o modelo. Em vez de perguntar qual resposta um membro da equipe prefere, você faz uma pergunta mensurável: o B resolve mais solicitações de suporte elegíveis sem aumentar promessas incorretas ou esperas inaceitáveis?

Pense em testar duas versões de um roteiro de atendimento ao cliente. Se um colaborador lida com consultas rotineiras pela manhã e outro lida com reclamações à noite, seus resultados não são uma comparação justa dos roteiros. O trabalho que receberam foi diferente. Testes de agentes enfrentam o mesmo problema, junto com variação nas respostas do modelo, mudança de conhecimento e diferenças entre as pessoas que respondem às pesquisas de feedback.

## Escolha evidência offline ou online

Um **teste offline** executa variantes contra uma coleção fixa de casos fora do uso ao vivo do cliente. Ambas as variantes recebem os mesmos casos iniciais e são avaliadas pelas mesmas regras. É útil para verificar correção, segurança e comportamento esperado da ferramenta antes de expor pessoas a uma mudança. Em uma conversa simulada, mensagens subsequentes podem diferir porque cada agente responde de forma diferente; preserve o mesmo cenário e objetivos em vez de forçar um diálogo idêntico e artificial.

Um **teste online** compara variantes durante o uso real. Atribua usuários ou conversas elegíveis a A ou B aleatoriamente, ou seja, por chance e não de acordo com a dificuldade esperada. As variantes recebem porções comparáveis de tráfego durante o mesmo período, não cópias duplicadas de cada conversa ao vivo. Mantenha a atribuição estável durante toda a conversa, ou para o usuário quando visitas repetidas possam influenciar o resultado.

**Comparação offline**

Use o mesmo conjunto de casos, condições controladas e ferramentas seguras. Boa para verificações de qualidade repetíveis e para detectar regressões óbvias antes do lançamento. Não pode reproduzir totalmente o comportamento de usuários reais.

**Teste A/B online**

Use tráfego ao vivo atribuído aleatoriamente com salvaguardas acordadas. Boa para medir conclusão real e experiência. Requer tráfego suficiente, monitoramento e um modo de interromper exposições prejudiciais.

Não envie a mesma ação ao vivo para ambas as variantes apenas para compará‑las. Dois agentes podem criar reservas duplicadas ou enviar mensagens conflitantes. Um **teste sombra** observa como um candidato responderia sem deixá‑lo agir sobre o usuário, mas requer isolamento explícito de efeitos colaterais e manejo cuidadoso de dados privados. Para muitas equipes, uma comparação offline seguida por um pequeno lançamento controlado é mais simples e segura.

## Defina a decisão antes de ver os resultados

Escreva uma **hipótese**, uma previsão específica sobre a mudança. Por exemplo: “Uma instrução mais curta que separa verificações de elegibilidade da explicação reduzirá promessas incorretas de reembolso sem aumentar transferências desnecessárias.” Altere um fator importante quando possível. Substituir o modelo, documentos e prompt juntos pode revelar se o conjunto funciona melhor, mas não qual componente causou a diferença.

Escolha uma **métrica primária**, a principal medida que responde à pergunta, antes do início do teste. Depois escolha **métricas de proteção**, medições que devem permanecer aceitáveis mesmo se o resultado primário melhorar. Um teste de suporte pode priorizar resolução verificada enquanto protege precisão, privacidade, tempo de espera e custo por tarefa concluída. Use [Métricas: acurácia, latência, custo, satisfação](http://localhost:1313/pt-br/learn/quality/metrics.md) para definir as medições de forma consistente, incluindo seus denominadores e casos de falha.

- **Resultado primário** — Escolha o resultado que representa a tarefa do usuário, como uma solicitação concluída corretamente. Evite substituir por comprimento da resposta ou tom confiante.

- **Verificações de proteção** — Fique atento a erros graves, ações não autorizadas, custo excessivo e experiências lentas. Um ganho em outra área não desculpa essas falhas.

- **Registro de decisão** — Registre as variantes, tráfego elegível, regras de avaliação e critérios de lançamento. Preserve as evidências necessárias para interpretar o resultado posteriormente.

Concorde também com regras de parada. Falhas graves de segurança podem exigir suspensão imediata. Flutuações ordinárias geralmente precisam de mais evidência, não de uma nova decisão a cada atualização do painel. Decida o período de avaliação ou use um método estatístico adequado para verificações repetidas. Caso contrário, interromper assim que uma variante parecer melhor aumenta a chance de selecionar uma flutuação sortuda.

## Entenda o tamanho da amostra sem fórmula

**Tamanho da amostra** é a quantidade de evidência independente na comparação, geralmente o número de usuários ou conversas. Alguns exemplos favoráveis não podem estabelecer uma melhoria confiável. Amostras maiores geralmente tornam a variação aleatória mais fácil de distinguir de uma diferença real, mas o tamanho necessário depende de quão variáveis são os resultados e quão pequena é a melhoria importante para o negócio.

Contar cada mensagem como um cliente independente exagera a evidência. Mensagens dentro de uma conversa influenciam umas às outras, e conversas repetidas da mesma pessoa podem estar relacionadas. Escolha a unidade de comparação para corresponder à atribuição e ao resultado de negócio. Um especialista pode ajudar a planejar tamanho de amostra e análise quando a decisão for consequential, os dados forem altamente variáveis ou o desenho do teste for complexo.

Um **intervalo de confiança** expressa um intervalo de tamanhos de efeito plausíveis sob as suposições do método estatístico. Em termos simples, lembra que a diferença medida é uma estimativa, não uma propriedade exata do agente. Se a evidência for consistente tanto com uma melhoria útil quanto com nenhuma melhoria, declare o resultado inconclusivo. Coletar mais observações pode ajudar; declarar o número maior exibido como vencedor não o faz.

**Resultados de resolução offline para as variantes A e B (ilustrativo)**

| Item | Value |
| --- | --- |
| Variant A | 84% |
| Variant B | 88% |

Taxas inventadas para fins didáticos. Não há tamanho de amostra ou estimativa de incerteza mostrada, portanto o gráfico sozinho não pode estabelecer uma melhoria confiável ou justificar o lançamento.

O gráfico ilustrativo faz o B parecer melhor, mas omite evidências cruciais. Os mesmos casos foram usados? Os resultados foram julgados de forma consistente? Quantos casos havia e o B introduziu uma falha grave? A diferença mostrada é em pontos percentuais, não prova de benefício de negócio. Revise os casos subjacentes e a incerteza antes de transformar uma diferença visual em decisão.

## Proteja contra comparações tendenciosas

**Viés** é uma distorção sistemática que favorece uma variante por razões não relacionadas à mudança pretendida. Executar A durante uma interrupção e B após a recuperação é um exemplo. Dar apenas perguntas curtas ao B é outro. Mantenha a alocação de tráfego, acesso ao conhecimento, ferramentas e regras de avaliação comparáveis. Registre eventos inesperados e mudanças de configuração para que possam ser considerados durante a análise, não explicados depois.

Para avaliação offline, oculte nomes de variantes quando possível e varie a ordem de apresentação das respostas. Revisores, incluindo juízes de modelo, podem preferir um rótulo familiar, a primeira resposta ou uma explicação mais longa. Use o mesmo rubric, ou seja, a mesma lista de verificação de avaliação, para ambas as variantes e inspecione discordâncias. Mantenha alguns casos separados da sintonia de prompt para que a comparação não seja apenas um teste de exemplos memorizados.

Inspecione grupos importantes como tipo de tarefa, idioma e canal de conversa, evitando uma busca por inúmeros subgrupos até que um pareça favorável. Uma mudança pode ajudar o usuário médio e prejudicar um grupo crítico. Decida verificações de grupos importantes com antecedência. Relate exclusões, falhas e feedback ausente de forma consistente; remover sessões abandonadas de apenas uma variante pode inverter o resultado aparente.

**E se o teste não mostrar um vencedor claro?**

Um resultado inconclusivo é informação útil. Mantenha a versão atual a menos que outros critérios justificados favoreçam uma mudança, melhorem a hipótese ou coletem evidência adicional suficiente sob um plano sólido. Não altere repetidamente as regras até que a variante desejada vença. Uma opção de qualidade similar pode ainda ser atraente para operações mais simples, mas isso é uma decisão separada e documentada.

## Implemente a versão escolhida com cuidado

1. **Passe nas verificações offline**

Rejeite variantes que falham em requisitos críticos. Confirme o comportamento seguro da ferramenta e revise os resultados alterados antes de envolver usuários ao vivo.

2. **Execute a comparação planejada**

Atribua tráfego elegível de forma consistente, monitore as salvaguardas e preserve os registros de versão. Interrompa prontamente se uma condição de segurança grave for violada.

3. **Revise evidências e incerteza**

Verifique o resultado primário, grupos importantes e salvaguardas. Documente se o resultado apoia o lançamento, investigação adicional ou nenhuma mudança.

4. **Expanda a exposição gradualmente**

Aumente o uso enquanto observa resultados reais. Mantenha uma versão funcional conhecida disponível e um gatilho claro para retornar a ela.

Um **rollback** devolve o tráfego a uma configuração conhecida funcional. Requer mais do que lembrar o prompt antigo: identifique as configurações do modelo, conhecimento e comportamento da ferramenta que pertenciam juntos. [Versionamento](http://localhost:1313/pt-br/learn/production/versioning.md) explica como manter esse registro. Continue monitorando após o lançamento completo porque a combinação de trabalho, documentos e serviços externos pode mudar mesmo quando a configuração do agente não muda.

**Relacionado ao AIVAX:** [Testes de Agentes](http://localhost:1313/pt-br/docs/inference/agentic-tests.md) podem fornecer cenários reutilizáveis para comparação offline. Mantenha definições de cenário e critérios de avaliação consistentes entre variantes. A atribuição de tráfego ao vivo e o lançamento seguro ainda precisam de um plano explícito na aplicação que atende seus usuários; não assume que uma execução de avaliação realiza um experimento A/B online.

**Próximos passos:** Proteja o agente de instruções maliciosas em [Injeção de Prompt e Quebra de Segurança](http://localhost:1313/pt-br/learn/safety/prompt-injection-and-jailbreaks.md).

**Verifique seu conhecimento.** Qual abordagem torna uma comparação A/B mais confiável?

1. Liberar B sempre que sua pontuação exibida for ligeiramente maior
2. Dar casos difíceis ao A e casos fáceis ao B
3. Comparar casos equivalentes ou tráfego atribuído aleatoriamente usando resultados e salvaguardas predefinidos
4. Parar o teste na primeira flutuação favorável

Answer: option 3. Condições comparáveis e regras predefinidas ajudam a separar uma melhoria real de tráfego tendencioso ou chance. Salvaguardas de segurança permanecem necessárias mesmo quando a medida primária melhora.
