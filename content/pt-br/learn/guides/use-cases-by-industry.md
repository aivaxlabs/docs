---
{title: Casos de uso comuns por setor,linkTitle: Casos de uso por setor,description: "Compare usos práticos de agentes em oito setores e escolha um primeiro projeto com evidência clara, permissões limitadas e risco gerenciável.",weight: 40,duration: 12,objectives: [Identificar casos de uso de agentes limitados em diferentes setores.,Associar cada caso de uso ao conhecimento e às ferramentas que ele necessita.,Reconhecer riscos específicos do setor e limites de decisão humana.,Comparar projetos candidatos usando evidência ao invés de novidade.],sourceHash: 0d0f3f21025ef09b}
---

Um agente que ajuda um varejista a encontrar um pacote e um agente que ajuda uma escola a explicar a matrícula compartilham grande parte da mesma estrutura. Ambos precisam de instruções claras, informações aprovadas, acesso adequado e um caminho para uma pessoa. No entanto, seus riscos são diferentes. Um horário de abertura de loja errado é inconveniente; uma instrução clínica errada pode causar danos graves.

Use este guia como um menu de projetos limitados, não como um catálogo de retornos prometidos. Um **caso de uso** descreve uma pessoa específica tentando alcançar um resultado específico. “IA para saúde” é um rótulo de indústria. “Ajudar um recepcionista autorizado a encontrar o folheto publicado de preparação de consultas” é um caso de uso que pode ser projetado e testado.

## Comece pelo trabalho, não pelo rótulo da indústria

Projetos iniciais úteis geralmente envolvem perguntas repetidas, uma fonte de verdade identificável e resultados que alguém pode verificar. Uma **fonte de verdade** é o sistema ou documento autoritário para um fato. Pode ser um sistema de pedidos para status de envio ou uma política aprovada para regras de reembolso. O conhecimento geral do modelo não substitui nenhum dos dois.

{{< cards >}}
{{< card title="Encontrar e explicar" icon="book" >}}
Pesquise informações aprovadas e explique-as claramente. O trabalho principal é preparar fontes, respeitar permissões e mostrar evidências de apoio.
{{< /card >}}
{{< card title="Preparar para revisão" icon="list-check" >}}
Elabore um resumo, formulário ou checklist para uma pessoa. O revisor deve ter evidência suficiente e tempo para verificá‑lo, em vez de apenas aprovar automaticamente.
{{< /card >}}
{{< card title="Executar uma ação limitada" icon="tools" >}}
Use uma ferramenta, uma operação de software definida, para mudar um registro ou solicitar um serviço. Permissões, confirmação, prevenção de duplicidade e recuperação tornam‑se essenciais.
{{< /card >}}
{{< /cards >}}

**Risco** combina o que pode dar errado com a gravidade das consequências. “Responder apenas perguntas” ainda pode ser de alto risco se a resposta influenciar tratamento, crédito, emprego ou um prazo legal. Avalie a consequência, não apenas se o agente pressiona um botão.

## Explore as indústrias

Cada aba oferece três usos possíveis, suas informações e ferramentas habituais e um limite para a primeira versão. Esses exemplos são padrões de design fictícios, não declarações de que alguma organização específica os implementou.

{{< tabs >}}
{{< tab title="Varejo e e‑commerce" >}}
**Casos de uso:** explicar políticas de devolução, consultar o pedido de um comprador autenticado e preparar um ticket de suporte para um item danificado. O conhecimento necessário inclui termos de entrega atuais, instruções de produto e regras de garantia aprovadas. Ferramentas típicas leem pedidos autorizados e criam tickets confirmados.

**Risco principal:** expor detalhes de outro cliente ou inventar um compromisso de reembolso. Mantenha reembolsos e alterações de pagamento fora da primeira versão e exija verificações de identidade para pedidos privados. A descrição de um produto não prova que o item está em estoque. O sistema de inventário em tempo real detém esse fato.
{{< /tab >}}
{{< tab title="Finanças" >}}
**Casos de uso:** explicar procedimentos publicados de serviço de conta, ajudar a equipe a encontrar orientações de conformidade e preparar um checklist de completude de documentos. O conhecimento inclui termos de produto aprovados e procedimentos internos atuais. Ferramentas podem ler status de casos permitidos ou enviar uma solicitação de revisão humana.

**Risco principal:** orientação financeira enganosa ou divulgação não autorizada. Mantenha o piloto afastado de decisões autônomas de crédito, investimento e elegibilidade. Um checklist pode identificar documentos ausentes sem decidir se um cliente se qualifica. Adequação do produto e aconselhamento regulado exigem os profissionais e controles de conformidade apropriados da organização.
{{< /tab >}}
{{< tab title="Administração de saúde" >}}
**Casos de uso:** explicar horários de funcionamento da clínica, localizar instruções de consulta publicadas e ajudar um usuário autorizado a solicitar uma mudança de agendamento. O conhecimento inclui folhetos administrativos aprovados e informações de serviço. Ferramentas podem recuperar agendamentos disponíveis ou enviar uma mudança para confirmação.

**Risco principal:** desvios da administração para diagnóstico ou manuseio inadequado de informações de saúde. Não diagnostique, interprete resultados de exames ou recomende tratamento. Perguntas sobre sintomas precisam da rota aprovada por clínico do serviço; preocupações urgentes precisam da orientação adequada de cuidados urgentes. Até detalhes de agendamento podem revelar informações sensíveis e exigem controles de acesso cuidadosos.
{{< /tab >}}
{{< tab title="Educação" >}}
**Casos de uso:** explicar procedimentos de matrícula, ajudar estudantes a localizar recursos de curso e elaborar questões de prática para revisão de um educador. O conhecimento inclui materiais de curso atuais, calendários e políticas de serviço ao estudante. Ferramentas podem recuperar um horário autorizado ou criar uma solicitação de suporte.

**Risco principal:** expor informações de estudantes ou apresentar material de aprendizagem impreciso como autoritário. Um assistente geral não deve determinar notas, disciplina ou admissões. Para menores, considere comunicação apropriada à idade e requisitos de consentimento aplicáveis. Direcione os estudantes a um professor ou ao balcão de serviço quando o material for confuso ou incompleto.
{{< /tab >}}
{{< tab title="Imobiliário" >}}
**Casos de uso:** responder perguntas de listagens de propriedade aprovadas, coletar preferências de visita e preparar uma solicitação de manutenção. O conhecimento inclui fatos atuais de listagens, regras de visita e procedimentos de serviço ao inquilino. Ferramentas podem verificar disponibilidade de visita ou criar um ticket de manutenção confirmado.

**Risco principal:** direcionamento discriminatório ou alegações não suportadas sobre uma propriedade. Não inferir adequação a partir de características protegidas ou inventar segurança de vizinhança, status legal ou retornos de investimento. Direcione perguntas legais e de financiamento adequadamente. A disponibilidade de listagem pode mudar, portanto verifique antes de apresentar uma visita como confirmada.
{{< /tab >}}
{{< tab title="Logística" >}}
**Casos de uso:** consultar um envio autorizado, explicar procedimentos de exceção de entrega e preparar um resumo de incidente para a equipe de despacho. O conhecimento inclui termos de serviço e instruções operacionais atuais. Ferramentas podem recuperar eventos de rastreamento e enviar um caso de exceção.

**Risco principal:** confundir uma estimativa com um compromisso ou permitir uma instrução operacional perigosa. Uma digitalização ausente não estabelece que um envio está perdido. Mantenha mudanças de roteamento, decisões sobre mercadorias perigosas e alterações de endereço de entrega sob os controles humanos e de sistema relevantes. Declare o horário da última atualização confiável.
{{< /tab >}}
{{< tab title="Serviços profissionais" >}}
**Casos de uso:** preparar um resumo de intake de cliente, buscar métodos de trabalho aprovados e elaborar uma atualização de status de projeto para revisão. O conhecimento inclui descrições de serviço, modelos e documentos de projeto autorizados. Ferramentas podem ler marcos permitidos ou criar um registro de rascunho.

**Risco principal:** misturar informações confidenciais entre clientes ou apresentar um rascunho como aconselhamento especializado. Separe limites de acesso de clientes e verifique cada fonte de apoio. Advogados, contadores e outros profissionais permanecem responsáveis pelos conselhos dentro de seu escopo. Um rascunho bem escrito ainda é um rascunho até que a pessoa designada o revise.
{{< /tab >}}
{{< tab title="Setor público" >}}
**Casos de uso:** explicar etapas de inscrição publicadas, ajudar residentes a localizar o departamento correto e fornecer uma atualização autenticada de status de inscrição. O conhecimento inclui formulários atuais, critérios de serviço e orientações acessíveis. Ferramentas podem recuperar status autorizado ou criar uma solicitação de serviço.

**Risco principal:** enganar pessoas sobre direitos, prazos ou benefícios. Preserve canais não‑chat acessíveis e revisão humana. Não deixe o agente tomar decisões vinculativas de elegibilidade ou aplicação em um piloto introdutório. Distinga claramente orientação geral de determinação oficial e explique como obter assistência autoritária.
{{< /tab >}}
{{< /tabs >}}

## Compare os limites antes de comparar benefícios

A mesma ação técnica pode acarretar consequências muito diferentes. Criar um ticket de manutenção de rascunho não equivale a aprovar uma transação financeira. Uma **revisão humana** deve ocorrer antes da ação consequente, com contexto suficiente para julgá‑la; ler um log depois é monitoramento, não aprovação.

| Padrão | Saída inicial adequada | Limite a testar |
|---|---|---|
| Suporte ao varejo | Resposta de política suportada | Informações específicas do cliente permanecem privadas |
| Administração financeira | Checklist de completude | Nenhuma aprovação implícita ou aconselhamento personalizado |
| Administração de saúde | Informação de serviço publicada | Nenhum diagnóstico ou recomendação de tratamento |
| Suporte educacional | Explicação de recurso | Registros estudantis e decisões de avaliação permanecem protegidos |
| Serviço imobiliário | Solicitação de visita confirmada | Nenhum filtro discriminatório ou fatos de listagem inventados |
| Suporte logístico | Resumo de status baseado em evidências | Nenhuma data garantida sem um compromisso válido |
| Serviços profissionais | Rascunho rotulado | Nenhum vazamento de informação entre clientes |
| Orientação ao serviço público | Explicação clara do próximo passo | Nenhuma determinação oficial falsa |

Para o design subjacente, leia [Adding guardrails](../agents/adding-guardrails.md). Para fluxos de trabalho potencialmente consequentes, [Human in the loop](../advanced-agents/human-in-the-loop.md) explica por que a aprovação deve ser uma etapa imposta e não apenas uma sugestão educada no prompt.

## Estime o valor a partir de evidências locais

**Valor** pode significar buscas mais curtas, menos perguntas repetidas, formulários melhor preenchidos ou menos retrabalho. Comece com uma linha de base: observe o processo atual antes de introduzir o agente. Inclua o tempo gasto preparando documentos, revisando saídas, mantendo integrações e lidando com erros.

{{< chart type="bar" title="Tempo semanal ilustrativo recuperado por tipo de caso de uso" unit="hours" data=`[{"label":"Finding approved guidance","value":12},{"label":"Preparing reviewable summaries","value":9},{"label":"Completing routine intake","value":6},{"label":"Routing service requests","value":4}]` caption="Exemplo de planejamento inventado, não economias medidas ou comparação setorial. Economias reais líquidas devem subtrair revisão, manutenção e retrabalho." >}}

O gráfico está deliberadamente organizado por tipo de trabalho, não por setor. Uma pequena empresa com documentos mal mantidos pode ganhar menos com um assistente do que reparando sua base de conhecimento primeiro. Por outro lado, um assistente de recuperação modesto pode ser útil onde a equipe busca repetidamente em uma biblioteca de referência clara e confiável.

## Perguntas a resolver antes de um piloto

{{< accordion title="Devemos automatizar a tarefa de maior volume primeiro?" >}}
O volume importa, mas também a consequência e a capacidade de recuperação. Prefira uma tarefa frequente com evidência confiável, permissões limitadas e um caminho fácil de volta a uma pessoa. Uma tarefa de alto volume que altera resultados legais ou financeiros pode exigir muito mais preparação do que um serviço de informação de baixo risco.
{{< /accordion >}}
{{< accordion title="Podemos usar o mesmo agente em departamentos ou clientes diferentes?" >}}
Instruções compartilhadas podem ser reutilizáveis, mas direitos de acesso e informações devem permanecer corretamente separados. Confirme a identidade e o escopo permitido antes de buscar ou agir. Não confie no modelo para lembrar quais trechos confidenciais ele deve ocultar de cada usuário.
{{< /accordion >}}
{{< accordion title="E se o setor for regulado?" >}}
Envolva o jurídico qualificado da organização, conformidade, privacidade e especialistas de domínio antes do lançamento. Este guia não determina a lei aplicável. Eles devem definir usos permitidos, registros necessários, retenção, divulgações, acessibilidade e supervisão humana para a jurisdição e serviço reais.
{{< /accordion >}}

Selecione um caso de uso, um proprietário responsável e um pequeno conjunto de resultados mensuráveis. Use [Testing and evaluating agents](../quality/testing-and-evaluating-agents.md) para transformar os principais riscos em casos de teste concretos. Expanda somente depois que o primeiro limite funcionar sob erros comuns e tentativas deliberadas de contorná‑lo.

Próximo passo: mantenha [o glossário e o cheat sheet](glossary-and-cheat-sheet.md) por perto enquanto planeja seu próprio projeto limitado.

{{< quiz options="Promete a maior economia independentemente das consequências | Possui fontes confiáveis, propriedade clara, permissões limitadas e um resultado mensurável útil | Remove todo ser humano de uma decisão complexa" answer="2" explanation="Um bom primeiro projeto combina utilidade com limites que podem ser testados e operados com segurança; volume e ambição sozinhos não estabelecem prontidão." >}}
Qual característica apoia mais fortemente a escolha de um piloto de agente inicial?
{{< /quiz >}}
