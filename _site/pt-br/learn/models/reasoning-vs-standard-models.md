Source: https://docs.aivax.net/pt-br/learn/models/reasoning-vs-standard-models.html

Algumas perguntas são como buscar o horário de uma reunião. Outras são como reorganizar a programação de entregas depois que um veículo quebra: várias restrições devem se encaixar, e mudar uma escolha afeta as demais. Ambas envolvem linguagem, mas não exigem a mesma quantidade de trabalho de resolução de problemas.

Um **modelo de raciocínio** foi projetado para gastar computação adicional trabalhando em um problema antes ou enquanto produz sua resposta final. As pessoas costumam descrevê‑lo como um modelo que “pensa antes de responder”. Essa é uma abreviação útil para um padrão de processamento, não uma afirmação de que o modelo tem consciência humana ou de que suas conclusões são automaticamente corretas.

Neste módulo, **modelo padrão** significa um modelo usado para uma resposta mais direta sem um processo de raciocínio gerenciado separadamente. O limite não é absoluto. Modelos padrão podem resolver problemas difíceis, e algumas famílias de modelos oferecem modos ordinário e de raciocínio estendido. Compare o modelo real e a configuração em vez de assumir que o nome da categoria prevê o resultado.

## Para que serve o trabalho extra

O raciocínio adicional pode ajudar quando uma tarefa envolve várias decisões dependentes, condições conflitantes ou a necessidade de verificar conclusões intermediárias. Um problema de agendamento pode exigir a verificação de disponibilidade, tempo de viagem e compromissos de serviço juntos. Uma investigação de código pode exigir rastrear como um erro passa por vários componentes. Uma comparação de contratos pode exigir combinar definições e exceções de diferentes seções.

Pense na diferença entre responder imediatamente uma pergunta familiar e usar papel rascunho para resolver um quebra‑cabeça. Espaço e tempo de trabalho extras podem ajudar, mas nenhum garante que os fatos no papel estejam corretos. Um modelo de raciocínio com uma política desatualizada pode levar mais tempo para chegar a uma recomendação cuidadosamente redigida, mas incorreta.

**Resposta direta**

**Tarefa:** Reescreva um aviso de entrega aprovado em linguagem mais amigável.

Os fatos e o significado pretendido já são fornecidos. Um modelo padrão pode frequentemente realizar a transformação sem sobrecarga de raciocínio adicional.

**Raciocínio adicional**

**Tarefa:** Propor um plano de entrega revisado respeitando a disponibilidade do motorista, tempos de viagem e janelas de horário dos clientes.

Várias restrições interagem. Um modelo de raciocínio pode ajudar a explorar um plano, mas o cronograma ainda precisa ser validado contra dados autoritários.

Texto longo não é automaticamente raciocínio difícil, e texto curto não é automaticamente fácil. Resumir uma transcrição de reunião longa mas simples pode ser principalmente compressão. Um quebra‑cabeça curto com várias restrições interativas pode ser muito mais difícil. Classifique o trabalho pelas decisões requeridas, não apenas pelo número de palavras no pedido.

## Os trade‑offs: qualidade, espera e custo

**Latência** é o tempo que o usuário espera por um resultado. O raciocínio adicional pode aumentar a latência porque o sistema realiza mais trabalho antes que a resposta final esteja pronta. **Custo** também pode aumentar devido à computação adicional ou tokens de raciocínio gerados, de acordo com a política de preços e regras de uso do modelo. Uma resposta curta visível, portanto, nem sempre significa que pouco trabalho foi feito.

O benefício possível é melhor desempenho em problemas adequados. “Possível” importa: esforço extra pode ter pouco efeito em uma tarefa simples, e um modelo pode usar mais computação sem encontrar a solução correta. Um modelo de resposta direta mais capaz também pode superar outro modelo em modo de raciocínio. Apenas comparações nas suas próprias tarefas estabelecem qual arranjo ajuda.

**Latência ilustrativa da resposta para um conjunto de tarefas imaginado**

| Item | Value |
| --- | --- |
| Standard configuration | 2seconds |
| Reasoning configuration | 8seconds |

Valores de ensino inventados, não desempenho medido ou tempos de serviço esperados. Modelo, carga de trabalho, comprimento da saída e infraestrutura afetam a latência.

**Precisão ilustrativa nas mesmas tarefas multi‑passo imaginadas**

| Item | Value |
| --- | --- |
| Standard configuration | 70% |
| Reasoning configuration | 85% |

Exemplos inventados de um possível trade‑off, não benchmarks. Raciocínio não garante essa melhoria, e tarefas simples podem não mostrar benefício.

Trate esses gráficos como perguntas a investigar, não previsões. Quanto tempo a mais os clientes esperam? Com que frequência o esforço extra evita um erro custoso? Um revisor gasta menos tempo corrigindo o resultado? Compare o resultado comercial completo, incluindo tentativas e revisões, em vez de contar apenas solicitações ao modelo ou palavras da resposta final.

Uma conversa de suporte ao vivo pode precisar de um reconhecimento rápido e de uma explicação clara de que um caso complexo está sendo verificado. Uma análise interna noturna pode tolerar mais atraso. A mesma configuração de modelo pode, portanto, ser apropriada para um fluxo de trabalho e frustrante em outro, mesmo quando ambos produzem respostas precisas.

## Quando não recorrer ao raciocínio

- **Transformação simples** — Reformatar um parágrafo fornecido, encurtar uma resposta aprovada ou extrair um campo óbvio geralmente requer instruções claras mais do que raciocínio adicional.

- **Fatos ausentes** — Um status de pedido desconhecido precisa de uma consulta autorizada. Mais pensamento não pode revelar informações privadas que nunca foram fornecidas.

- **Cálculo exato** — Totais financeiros e restrições de agendamento rígidas se beneficiam de calculadoras ou softwares de validação. Um modelo pode explicar o resultado sem ser o único motor de cálculo.

- **Interação imediata** — Uma troca de voz breve ou sugestão de autocompletar pode valorizar muito a responsividade. Teste se o atraso extra traz algum benefício útil.

Não use raciocínio como substituto para recuperação de conhecimento, verificações de permissão ou decisão humana. Se a regra de negócio diz que um gerente deve aprovar um reembolso, uma análise mais elaborada não concede essa autoridade ao assistente. Da mesma forma, se as fontes disponíveis discordam, o modelo deve expor a discordância em vez de inventar um compromisso confiante.

## O esforço de raciocínio é um dial, não uma promessa

Alguns modelos expõem **esforço de raciocínio**, uma configuração que solicita uma quantidade ou estilo diferente de trabalho de raciocínio. Um serviço pode oferecer rótulos como baixo, médio ou alto; os rótulos suportados e seus significados variam. Alguns modelos não fornecem configuração de esforço ajustável. Um rótulo não é uma duração padrão nem uma garantia de um nível de qualidade específico.

Comece com o padrão suportado ou um nível de esforço modesto, então teste se aumentá‑lo melhora os resultados que importam. Mantenha a pergunta, o material de origem e as regras de pontuação inalterados. Se o modelo continuar falhando porque uma política chave está faltando, corrija a evidência em vez de girar o dial para cima.

Orçamentos de saída também precisam de atenção. Alguns modelos contam o raciocínio interno contra um orçamento de tokens de conclusão. Um orçamento suficiente para a resposta visível pode não ser suficiente para o raciocínio mais a resposta. Verifique o status da conclusão e as orientações do modelo para que uma resposta incompleta não seja confundida com uma concluída.

1. **Identificar a parte difícil**

Decida se a tarefa requer raciocínio, informação faltante, cálculo exato ou permissão. Escolha a solução para essa necessidade específica.

2. **Estabelecer uma linha de base de resposta direta**

Use exemplos representativos e uma definição clara de sucesso. Inclua solicitações simples assim como casos difíceis.

3. **Comparar esforço adicional**

Teste uma configuração de raciocínio suportada com a mesma evidência. Registre correção, conclusão, tempo de espera e custo total.

4. **Roteamento seletivo**

Use o processamento adicional onde ele produz uma melhoria que vale a pena. Mantenha verificações e aprovações humanas independentes do modelo selecionado.

## O que mostrar ao usuário

O raciocínio interno de um modelo pode estar oculto, indisponível ou representado por um resumo fornecido pelo serviço. Não é um registro de auditoria confiável. Você não deve projetar um fluxo de trabalho que exija acesso ao pensamento interno privado, e um pedido para revelá‑lo não é um meio confiável de verificar a correção.

Em vez disso, solicite as informações que uma pessoa pode usar: a conclusão, referências de fontes relevantes, suposições importantes, cálculos que podem ser verificados e incerteza não resolvida. Uma explicação concisa pode mostrar por que uma recomendação segue uma política sem reproduzir cada passo intermediário. Verifique as alegações contra as fontes e os resultados contra verificações independentes.

Ocultar a exibição do raciocínio não desativa necessariamente o cálculo de raciocínio nem reduz seu custo. Mostrar uma explicação mais longa não prova que mais raciocínio interno ocorreu. Apresentação e computação são escolhas separadas. Mantenha a explicação voltada ao cliente proporcional: alguém que pergunta a data de entrega geralmente precisa apenas da data e sua fonte, não de um ensaio longo.

Relacionado: [técnicas de prompt](https://docs.aivax.net/pt-br/learn/prompt-engineering/prompting-techniques.md) explica como dar estrutura a uma tarefa, e [loops de planejamento e raciocínio](https://docs.aivax.net/pt-br/learn/advanced-agents/planning-and-reasoning-loops.md) cobre agentes que alternam entre decisões e ações. No AIVAX, as opções de raciocínio suportadas pertencem à [configuração de inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md); o suporte depende do modelo selecionado.

Próximo passo: aprender [chamada de função](https://docs.aivax.net/pt-br/learn/tools-and-integrations/function-calling.md), que permite que um assistente solicite informações reais e ações em vez de tentar raciocinar em torno de acesso ausente.

**Verifique seu conhecimento.** Qual política faz sentido ao adotar um modelo de raciocínio para um assistente empresarial?

1. Sempre use o maior esforço de raciocínio porque uma espera mais longa prova uma resposta melhor
2. Use raciocínio adicional quando testes representativos mostram um benefício útil, mantendo evidências e verificações independentes
3. Mostre todo o pensamento interno para garantir a correção
4. Substitua uma consulta de pedido por um modelo de raciocínio

Answer: option 2. O raciocínio é um investimento opcional de recurso, não uma fonte de fatos faltantes ou autoridade. Teste seu benefício em tarefas adequadas e verifique os resultados consequentes de forma independente.
