---
{title: O que é Learn,linkTitle: O que é Learn,description: "Uma orientação: para quem é o Learn, como os módulos e caminhos de aprendizado são organizados, o que significam os blocos visuais e como acompanhar seu progresso.",weight: 10,duration: 8,objectives: [Reconhecer para quem o Learn foi escrito e o que ele não tenta ser.,"Navegar por módulos, unidades, caminhos de aprendizado, verificações de conhecimento e progresso.",Ler os blocos visuais que você encontrará em cada unidade.],sourceHash: fef976389bc5673d}
---

Learn é a parte da documentação da AIVAX que ensina ideias em vez de recursos do produto. Ele existe porque a maioria das pessoas que precisam tomar decisões sobre agentes de IA — fundadores, diretores, proprietários de produto e desenvolvedores de outras áreas — nunca teve razão para estudar como funcionam os modelos de linguagem. A documentação de referência supõe que você já sabe o que é um token; o Learn supõe que você não sabe.

Essa suposição molda cada página. Os termos são definidos na primeira vez que aparecem, os exemplos vêm de situações de negócios rotineiras, como balcões de suporte, equipes de vendas e ajuda interna, e nada exige que você abra um terminal ou leia código. Quando uma unidade mostra um pequeno trecho, ele está lá para tornar uma ideia concreta, não para ser copiado.

## Para quem o Learn é destinado

{{< cards >}}
{{< card title="Empreendedores e diretores" icon="briefcase" >}}
Você decide onde os agentes criam valor, quanto custam e quais riscos são aceitáveis. O Learn fornece vocabulário e julgamento sem pedir que você escreva código.
{{< /card >}}
{{< card title="Desenvolvedores" icon="cpu" >}}
Você já cria software e precisa do modelo mental por trás de prompts, ferramentas, recuperação e avaliação para que seu primeiro agente não seja o último.
{{< /card >}}
{{< card title="Pessoas curiosas" icon="lightbulb" >}}
Você continua ouvindo *agente*, *RAG* e *janela de contexto* e quer o significado real, explicado uma vez, corretamente.
{{< /card >}}
{{< /cards >}}

Esses três públicos compartilham uma necessidade: um vocabulário comum. Um diretor que entende o que é uma janela de contexto pode fazer ao desenvolvedor uma pergunta precisa sobre custo; um desenvolvedor que entende por que um sistema de recuperação ainda pode produzir uma resposta errada pode explicar um risco a um diretor sem rodeios. O Learn foi escrito para que ambos possam ler a mesma unidade e sair com a mesma visão.

O Learn é deliberadamente neutro. As unidades descrevem como os agentes funcionam em geral; quando algo corresponde a um recurso que você pode usar hoje na AIVAX, a unidade linka para a página correspondente na [Documentação](../../docs/overview.md). Você pode ler todas as unidades sem uma conta, e nada nas explicações depende de um fornecedor ou modelo específico.

## Como o conteúdo está organizado

{{< flow "Module | Unit | Section | Knowledge check" >}}

Um **módulo** é um tema, como *Agentes* ou *Segurança, ética e conformidade*. Cada módulo tem uma página de capa que lista suas **unidades** em uma ordem recomendada e mostra quanto dela você completou.

Uma **unidade** é uma ideia explicada de ponta a ponta em oito a quinze minutos. Cada unidade começa com os objetivos que você deve ser capaz de alcançar ao final, desenvolve a ideia com blocos visuais e termina com uma **verificação de conhecimento** e um botão para marcar como concluída. Dentro de uma unidade, **seções** dividem a ideia em passos que você pode retornar depois a partir do índice mostrado em telas largas.

Você não precisa seguir os módulos em ordem. A página inicial propõe três caminhos de aprendizado, e cada unidade linka para as unidades das quais depende, para que você possa começar onde sua pergunta está e seguir os links para trás quando algo for desconhecido.

## Os três caminhos de aprendizado

{{< cards >}}
{{< card title="Iniciante" icon="graduation" >}}
Introdução; Agentes; Engenharia de prompts e contexto; Segurança, ética e conformidade. Comece aqui se você nunca construiu nada com IA e quer entender o que é um agente, passo a passo.
{{< /card >}}
{{< card title="Desenvolvedor" icon="cpu" >}}
Agentes; Modelos e parâmetros; Ferramentas e integrações; Agentes avançados e fluxos de trabalho; Qualidade, avaliação e observabilidade; Produção e escala. Siga este caminho se você vai projetar, conectar, testar e implantar agentes.
{{< /card >}}
{{< card title="Negócios" icon="briefcase" >}}
Introdução; Ensino de agentes; Qualidade, avaliação e observabilidade; Segurança, ética e conformidade; Guias práticos e estudos de caso. Siga este caminho se você precisa decidir onde os agentes criam valor, quanto custam e quais riscos gerenciar.
{{< /card >}}
{{< /cards >}}

Os caminhos são uma recomendação, não uma barreira. Nada está bloqueado, e o módulo de Guias Práticos, em particular, é útil para todos: ele aplica as ideias dos outros módulos a cenários completos, como um agente de suporte ao cliente ou um assistente interno de conhecimento.

## Os blocos visuais que você encontrará

{{< steps >}}
{{< step title="Animações passo a passo" >}}
Blocos como este percorrem um processo passo a passo. Pressione **Play** para avançar automaticamente, use as setas ou clique em qualquer passo.
{{< /step >}}
{{< step title="Linhas de tempo" >}}
Linhas de tempo mostram como uma ideia evoluiu, para que você entenda *por que* a abordagem atual existe e não apenas *o que* ela é.
{{< /step >}}
{{< step title="Gráficos e tabelas" >}}
Gráficos de barras, linhas e pizza comparam números; tabelas comparam opções. Os valores no Learn são ilustrativos, a menos que a unidade diga o contrário.
{{< /step >}}
{{< step title="Demonstrações interativas" >}}
Pequenas simulações permitem que você mova um controle deslizante ou digite uma frase e veja o que muda. Elas são executadas inteiramente no seu navegador e nunca chamam um modelo.
{{< /step >}}
{{< step title="Verificações de conhecimento" >}}
Uma pergunta ao final de cada unidade. Não há pontuação; está lá para confirmar que você pode aplicar a ideia.
{{< /step >}}
{{< /steps >}}

Dois outros blocos aparecem com frequência. Uma **comparação** coloca dois exemplos curtos lado a lado, geralmente uma versão fraca e uma melhor, para que você possa ver a diferença em vez de ler sobre ela. Um **fluxo** é a cadeia horizontal de caixas que você viu acima; ele mostra uma ordem ou um pipeline de relance.

## Acompanhando seu progresso

O progresso é armazenado apenas no seu navegador. Nada é enviado para nenhum lugar, e mudar de dispositivo começa do zero.

{{< compare >}}
{{< side title="Marcado automaticamente" tone="good" >}}
Quando você clica em **Próxima unidade** na parte inferior da página, a unidade atual é marcada como concluída.
{{< /side >}}
{{< side title="Marcado por você" tone="good" >}}
Clique em **Marcar como concluída** ao final de uma unidade a qualquer momento. Clique novamente para desfazer.
{{< /side >}}
{{< /compare >}}

A barra lateral mostra uma marca ao lado de cada unidade concluída, e os cartões de módulo na página inicial mostram uma barra de progresso. Se o seu navegador bloquear o armazenamento local, você ainda pode marcar unidades e ler todas as páginas; você simplesmente perde as marcas ao sair da página.

## Como aproveitar ao máximo uma unidade

Leia primeiro os objetivos. Eles dizem qual pergunta a unidade responde e, se você já souber a resposta, avance. Experimente as demonstrações interativas em vez de apenas ler suas legendas; mover o controle deslizante você mesmo é o que transforma uma definição em intuição. Responda à verificação de conhecimento antes de revelar a explicação, mesmo quando a resposta parece óbvia, pois a explicação costuma acrescentar a nuance que a pergunta foi projetada para evidenciar.

Quando uma unidade linka para outra unidade, siga o link apenas se o termo for desconhecido. Os links existem para que você preencha lacunas sob demanda, não para enviá-lo a um desvio toda vez. E quando uma unidade linka para a documentação do produto, trate isso como opcional: o conceito se sustenta por si só, e a página de documentação está lá para o momento em que você quiser experimentar a ideia na prática.

## O que o Learn não é

O Learn não é uma referência de API, nem um curso com certificados, nem uma comparação de fornecedores. Ele evita benchmarks que ficam desatualizados em poucos meses e evita alegações sobre modelos específicos. Quando aparecem preços ou tamanhos, eles são arredondados, valores típicos escolhidos para tornar uma ideia concreta, e a unidade informa isso.

O Learn também não substitui o julgamento. As unidades explicam como os agentes se comportam e por quê, para que as decisões sobre onde usar um, quanto confiar nele e quando envolver uma pessoa permaneçam suas, tomadas com uma visão clara dos trade‑offs.

{{< quiz options="Apenas empreendedores e diretores | Apenas desenvolvedores | Qualquer pessoa que precise entender agentes, independentemente da formação técnica" answer="3" explanation="Learn presume que o leitor não tem formação em computação e mantém a escrita neutra para que leitores de negócios e técnicos compartilhem o mesmo vocabulário." >}}
Para quem o Learn foi escrito?
{{< /quiz >}}
