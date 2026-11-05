Source: https://docs.aivax.net/pt-br/learn/models/reasoning-vs-standard-models.html

Algumas perguntas são como consultar o horário de uma reunião. Outras são como reorganizar um cronograma de entrega após a quebra de um veículo: várias restrições devem se encaixar, e alterar uma escolha afeta as outras. Ambas envolvem linguagem, mas não exigem a mesma quantidade de trabalho de resolução de problemas.

Um **modelo de raciocínio** é projetado para gastar computação adicional trabalhando em um problema antes ou enquanto produz sua resposta final. As pessoas frequentemente descrevem isso como um modelo que “pensa antes de responder”. Essa é uma abreviação útil para um padrão de processamento, não uma afirmação de que o modelo tem consciência humana ou que suas conclusões estão automaticamente corretas.

Nesta unidade, **modelo padrão** significa um modelo usado para uma resposta mais direta, sem um processo de raciocínio gerenciado separadamente. A fronteira não é absoluta. Modelos padrão podem resolver problemas difíceis, e algumas famílias de modelos oferecem modos tanto ordinários quanto de raciocínio estendido. Compare o modelo real e a configuração, em vez de assumir que o nome da categoria prevê o resultado.

## Para que serve o trabalho extra

O raciocínio adicional pode ajudar quando uma tarefa envolve várias decisões dependentes, condições conflitantes ou a necessidade de verificar conclusões intermediárias. Um problema de agendamento pode exigir verificar disponibilidade, tempo de viagem e compromissos de serviço juntos. Uma investigação de código pode exigir rastrear como um erro passa por vários componentes. Uma comparação de contratos pode exigir combinar definições e exceções de diferentes seções.

Pense na diferença entre responder a uma pergunta familiar imediatamente e usar papel de rascunho para resolver um quebra-cabeça. Espaço e tempo de trabalho extras podem ajudar, mas nenhum garante que os fatos no papel estejam corretos. Um modelo de raciocínio com uma política desatualizada pode demorar mais para chegar a uma recomendação cuidadosamente redigida, mas incorreta.

**Resposta direta**

**Tarefa:** Reescrever um aviso de entrega aprovado em uma linguagem mais amigável.

Os fatos e o significado pretendido já foram fornecidos. Um modelo padrão muitas vezes pode realizar a transformação sem sobrecarga adicional de raciocínio.

**Raciocínio adicional**

**Tarefa:** Propor um plano de entrega revisado respeitando a disponibilidade dos motoristas, tempos de viagem e janelas de tempo dos clientes.

Várias restrições interagem. Um modelo de raciocínio pode ajudar a explorar um plano, mas o cronograma ainda precisa ser validado contra dados autoritativos.

Texto longo não é automaticamente raciocínio difícil, e texto curto não é automaticamente fácil. Resumir uma transcrição de reunião longa, mas direta, pode ser principalmente compressão. Um quebra-cabeça curto com várias restrições interativas pode ser muito mais difícil. Classifique o trabalho pelas decisões necessárias, não meramente pelo número de palavras no pedido.

## Os trade-offs: qualidade, espera e custo

A **latência** é o tempo que um usuário espera por um resultado. O raciocínio extra pode aumentar a latência porque o sistema realiza mais trabalho antes de a resposta final estar pronta. O **custo** também pode aumentar devido à computação adicional ou aos tokens de raciocínio gerados, de acordo com as regras de preço e uso do modelo. Portanto, uma resposta visível curta nem sempre significa que houve pouca atividade.

O benefício possível é um melhor desempenho em problemas adequados. “Possível” importa: esforço extra pode ter pouco efeito em uma tarefa simples, e um modelo pode usar mais computação sem encontrar a solução correta. Um modelo de resposta direta mais capaz também pode superar outro modelo em modo de raciocínio. Apenas comparações em suas próprias tarefas estabelecem qual arranjo ajuda.

**Latência de resposta ilustrativa para um conjunto imaginário de tarefas**

| Item | Value |
| --- | --- |
| Configuração padrão | 2 segundos |
| Configuração de raciocínio | 8 segundos |

Valores didáticos inventados, não desempenho medido ou tempos de serviço esperados. Modelo, carga de trabalho, comprimento de saída e infraestrutura afetam todos a latência.

**Precisão ilustrativa nas mesmas tarefas multi-etapas imaginadas**

| Item | Value |
| --- | --- |
| Configuração padrão | 70% |
| Configuração de raciocínio | 85% |

Exemplos inventados de um possível trade-off, não benchmarks. O raciocínio não garante essa melhoria, e tarefas simples podem não mostrar benefício.

Trate esses gráficos como questões a investigar, não como previsões. Quanto mais tempo os clientes esperam? Com que frequência o esforço extra evita um erro custoso? Um revisor gasta menos tempo corrigindo o resultado? Compare o resultado comercial completo, incluindo retentativas e revisão, em vez de contar apenas solicitações de modelo ou palavras da resposta final.

Uma conversa de suporte ao vivo pode precisar de uma rápida confirmação e de uma explicação clara de que um caso complexo está sendo verificado. Uma análise interna noturna pode tolerar mais atraso. A mesma configuração de modelo, portanto, pode ser adequada para um fluxo de trabalho e frustrante em outro, mesmo quando ambos produzem respostas precisas.

## Quando não recorrer ao raciocínio

- **Transformação simples** — Reformatar um parágrafo fornecido, encurtar uma resposta aprovada ou extrair um campo óbvio geralmente precisa de instruções claras mais do que de raciocínio adicional.

- **Fatos ausentes** — Um status de pedido desconhecido precisa de uma consulta autorizada. Mais pensamento não pode revelar informações privadas que nunca foram fornecidas.

- **Cálculo exato** — Totais financeiros e restrições rigorosas de agendamento beneficiam-se de calculadoras ou software de validação. Um modelo pode explicar o resultado sem ser o único mecanismo de cálculo.

- **Interação imediata** — Uma breve troca de voz ou uma sugestão de preenchimento automático pode atribuir alto valor à responsividade. Teste se o atraso extra fornece algum benefício útil.

Não use o raciocínio como substituto para recuperação de conhecimento, verificações de permissão ou uma decisão humana. Se a regra comercial diz que um gerente deve aprovar um reembolso, uma análise mais elaborada não concede essa autoridade ao assistente. Da mesma forma, se as fontes disponíveis discordam, o modelo deve destacar o desacordo em vez de inventar um compromisso confiante.

## O esforço de raciocínio é um dial, não uma promessa

Alguns modelos expõem o **esforço de raciocínio**, uma configuração que solicita uma quantidade ou estilo diferente de trabalho de raciocínio. Um serviço pode oferecer rótulos como baixo, médio ou alto; os rótulos suportados e seus significados variam. Alguns modelos não fornecem nenhuma configuração de esforço ajustável. Um rótulo não é uma duração padrão nem uma garantia de um determinado nível de qualidade.

Comece com o padrão suportado ou um nível de esforço modesto, depois teste se aumentá-lo melhora os resultados que importam. Mantenha a pergunta, o material de origem e as regras de pontuação inalteradas. Se o modelo continuar falhando porque uma política chave está faltando, corrija a evidência em vez de girar o dial para cima.

Orçamentos de saída também precisam de atenção. Alguns modelos contam o raciocínio interno contra um orçamento de token de conclusão. Um orçamento suficiente para a resposta visível pode não ser suficiente para o raciocínio mais a resposta. Verifique o status de conclusão e a orientação do modelo para que uma resposta incompleta não seja confundida com uma concluída.

1. **Identifique a parte difícil**

Decida se a tarefa requer raciocínio, informação ausente, cálculo exato ou permissão. Escolha o remédio para essa necessidade específica.

2. **Estabeleça uma linha de base de resposta direta**

Use exemplos representativos e uma definição clara de sucesso. Inclua solicitações simples, bem como casos difíceis.

3. **Compare esforço adicional**

Teste uma configuração de raciocínio suportada com a mesma evidência. Registre correção, conclusão, tempo de espera e custo total.

4. **Encaminhe seletivamente**

Use o processamento adicional onde ele produz uma melhoria valiosa. Mantenha verificações e aprovação humanas independentes do modelo selecionado.

## O que mostrar ao usuário

O raciocínio interno de um modelo pode estar oculto, indisponível ou representado por um resumo fornecido pelo serviço. Não é um rastro de auditoria confiável. Você não deve projetar um fluxo de trabalho que exija acesso ao pensamento interno privado, e um pedido para revelá-lo não é uma maneira confiável de verificar a correção.

Em vez disso, peça as informações que uma pessoa pode usar: a conclusão, referências de fonte relevantes, suposições importantes, cálculos que podem ser verificados e incerteza não resolvida. Uma explicação concisa pode mostrar por que uma recomendação segue de uma política sem reproduzir cada etapa intermediária. Verifique reivindicações contra as fontes e resultados contra verificações independentes.

Esconder uma exibição de raciocínio não necessariamente desativa a computação de raciocínio ou reduz seu custo. Mostrar uma explicação mais longa não prova que mais raciocínio interno ocorreu. Apresentação e computação são escolhas separadas. Mantenha a explicação voltada para o cliente proporcional: alguém que pede uma data de entrega geralmente precisa da data e de sua fonte, não de um longo ensaio.

Relacionado: [técnicas de prompt](https://docs.aivax.net/pt-br/learn/prompt-engineering/prompting-techniques.md) explica como dar estrutura a uma tarefa, e [loops de planejamento e raciocínio](https://docs.aivax.net/pt-br/learn/advanced-agents/planning-and-reasoning-loops.md) cobre agentes que alternam entre decisões e ações. No AIVAX, as opções de raciocínio suportadas pertencem à [configuração de inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md); o suporte depende do modelo selecionado.

Próximo passo: aprenda [chamada de função](https://docs.aivax.net/pt-br/learn/tools-and-integrations/function-calling.md), que permite que um assistente solicite informações e ações reais em vez de tentar raciocinar contornando o acesso ausente.

**Verifique seu conhecimento.** Qual política faz sentido ao adotar um modelo de raciocínio para um assistente empresarial?

1. Sempre use o maior esforço de raciocínio porque uma espera mais longa prova uma resposta melhor
2. Use raciocínio adicional quando testes representativos mostrarem um benefício útil, mantendo evidências e verificações independentes
3. Mostre todo o pensamento interno para garantir a correção
4. Substitua uma consulta de pedido por um modelo de raciocínio

Answer: option 2. O raciocínio é um investimento de recurso opcional, não uma fonte de fatos ou autoridade ausentes. Teste seu benefício em tarefas adequadas e verifique resultados consequentes independentemente.
