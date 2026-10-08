---
{title: Introdução à inteligência artificial,linkTitle: Introdução à IA,description: "O que é inteligência artificial em linguagem simples, como difere de software comum, onde os modelos de linguagem se encaixam e por que a palavra agente de repente importa.",weight: 20,duration: 12,objectives: [Explicar a diferença entre um programa que segue regras e um sistema que aprendeu com exemplos.,"Posicionar aprendizado de máquina, aprendizado profundo, modelos de linguagem e agentes em relação uns aos outros.","Descrever, sem jargão, o que um modelo de linguagem faz ao responder.",Reconhecer no que a IA de hoje é boa e onde falha.],sourceHash: ebe160ea3eaa9330}
---

Inteligência artificial é um nome amplo para softwares que executam tarefas que normalmente associamos ao julgamento humano: entender uma frase, reconhecer um rosto, decidir o próximo movimento em um jogo ou escrever um e‑mail. O nome é antigo — foi cunhado em 1956 — mas o que as pessoas entendem por ele mudou várias vezes. Esta unidade fornece o significado atual e o vocabulário usado ao longo do Learn.

## Regras versus aprendizado

Software comum segue regras que uma pessoa escreveu. Uma planilha soma números porque alguém programou a adição. Um aplicativo bancário bloqueia uma transferência porque um desenvolvedor escreveu *se o saldo for menor que o valor, recusar*. O comportamento é totalmente especificado antecipadamente.

A maior parte do que hoje se chama IA funciona de forma diferente: ninguém escreve as regras. Em vez disso, o sistema recebe um número muito grande de exemplos e se ajusta até que suas respostas correspondam aos exemplos. Dizemos que o sistema foi **treinado**, e o resultado é um **modelo**.

{{< compare >}}
{{< side title="Programa tradicional" tone="bad" >}}
A pessoa escreve cada regra.

O comportamento é previsível e fácil de explicar.

Falha em tudo que as regras não previram.

Exemplo: um validador de faturas que verifica campos obrigatórios.
{{< /side >}}
{{< side title="Modelo treinado" tone="good" >}}
O sistema infere padrões a partir de exemplos.

O comportamento é estatístico; pode ser surpreendente.

Lida com variações que nunca viu, dentro dos limites.

Exemplo: um modelo que lê qualquer layout de fatura e extrai o total.
{{< /side >}}
{{< /compare >}}

Nenhuma abordagem é melhor em geral. Regras vencem quando a tarefa é precisa e o custo do erro é alto; modelos aprendidos vencem quando a entrada é bagunçada, variada ou expressa em linguagem humana.

## Uma história curta

{{< timeline >}}
{{< event date="1950s" title="O nome e os primeiros programas" >}}
Alan Turing pergunta se máquinas podem pensar. O termo *inteligência artificial* foi cunhado em um workshop em Dartmouth em 1956. Programas iniciais provam teoremas e jogam damas usando regras escritas à mão.
{{< /event >}}
{{< event date="1980s" title="Sistemas especialistas" >}}
Empresas codificam o conhecimento de especialistas como milhares de regras *se-então*. Os sistemas funcionam em áreas restritas, mas são caros de manter e frágeis fora delas.
{{< /event >}}
{{< event date="1990s–2000s" title="Aprendizado de máquina se torna prático" >}}
Em vez de escrever regras, pesquisadores treinam modelos estatísticos com dados. Filtros de spam, recomendações de produtos e pontuação de crédito se tornam aplicações cotidianas.
{{< /event >}}
{{< event date="2012" title="Aprendizado profundo" >}}
Redes neurais com muitas camadas, treinadas em processadores gráficos, vencem concursos de reconhecimento de imagens por larga margem. Reconhecimento de fala e tradução melhoram rapidamente.
{{< /event >}}
{{< event date="2017" title="O transformador" >}}
Um novo design de rede torna prático treinar com enormes quantidades de texto. Torna‑se a base da maioria dos modelos de linguagem grandes amplamente usados.
{{< /event >}}
{{< event date="2022 onwards" title="Modelos conversacionais e agentes" >}}
Modelos que geram texto fluente ficam disponíveis ao público. Desenvolvedores começam a conectá‑los a ferramentas, documentos e outros sistemas, e a palavra **agente** entra no vocabulário cotidiano.
{{< /event >}}
{{< /timeline >}}

## O vocabulário e como ele se encaixa

Os termos que você ouve com mais frequência não são concorrentes. Os três primeiros são campos aninhados, cada um uma parte mais estreita do anterior:

{{< flow "Inteligência artificial | Aprendizado de máquina | Aprendizado profundo" >}}

Os dois últimos não são campos, mas coisas que você constrói. Um modelo de linguagem grande é um produto do aprendizado profundo, e um agente é um sistema construído *ao redor* de tal modelo:

{{< flow "Modelo de aprendizado profundo | Modelo de linguagem grande | Agente" >}}

{{< cards >}}
{{< card title="Artificial intelligence" icon="sparkle" >}}
O campo inteiro: qualquer técnica que permite que o software faça algo que parece requerer inteligência, com ou sem aprendizado.
{{< /card >}}
{{< card title="Machine learning" icon="refresh" >}}
O subconjunto onde o comportamento é aprendido a partir de exemplos, em vez de programado.
{{< /card >}}
{{< card title="Deep learning" icon="stack" >}}
Aprendizado de máquina feito com grandes redes neurais: muitas camadas de operações numéricas simples ajustadas em conjunto.
{{< /card >}}
{{< card title="Language models" icon="chat" >}}
Modelos treinados em texto para prever a próxima palavra. Pequenos já existiam muito antes do aprendizado profundo; os grandes por trás dos assistentes de chat de hoje (LLMs) são modelos de aprendizado profundo.
{{< /card >}}
{{< card title="Agents" icon="robot" >}}
Não é um tipo de modelo, mas um sistema: um modelo de linguagem encapsulado com instruções, memória, conhecimento e ferramentas para que possa executar tarefas, não apenas responder.
{{< /card >}}
{{< /cards >}}

## O que um modelo de linguagem realmente faz

Um modelo de linguagem faz uma coisa: dado um texto, ele estima qual trecho de texto provavelmente virá a seguir. Ele faz isso repetidamente, um pequeno trecho de cada vez, até produzir uma resposta completa. Esses pequenos trechos são chamados de **tokens** — aproximadamente uma palavra curta ou parte de uma palavra.

{{< demo name="tokenizer" title="Experimente: como o texto se torna tokens" config=`{"text": "Um agente é um modelo com ferramentas e um objetivo.", "labels": {"prompt": "Digite qualquer frase"}}` >}}
Os modelos nunca veem letras ou palavras. Eles veem uma sequência de peças numeradas. Esta demonstração simplificada divide o texto da forma que um modelo faria aproximadamente; tokenizadores reais diferem nos detalhes, mas a ideia é a mesma.
{{< /demo >}}

Duas consequências decorrem de *prever o próximo token* e explicam a maior parte do que parece estranho na IA:

- **O modelo não tem noção de verdade.** Ele produz o que é plausível com base em seu treinamento, que geralmente está correto e às vezes está confiantemente errado. A indústria chama o caso errado de *alucinação*; uma palavra melhor é *confabulação*.
- **O modelo não se lembra de você.** Cada requisição começa do zero. Tudo que ele deveria saber sobre a conversa deve ser enviado novamente a cada mensagem. Unidades posteriores explicam como memória e conhecimento são construídos sobre essa limitação.

{{< demo name="temperature" title="Experimente: a próxima palavra é um sorteio, não uma busca" config=`{"prefix": "Amanhã o tempo será", "candidates": [["ensolarado", 0.52], ["nublado", 0.22], ["chuvoso", 0.14], ["ventoso", 0.08], ["roxo", 0.04]]}` >}}
O modelo atribui uma probabilidade a cada token candidato e então sorteia um. Uma configuração chamada *temperatura* achata ou aguça a distribuição. Mova o controle deslizante e sorteie algumas vezes.
{{< /demo >}}

## No que a IA de hoje é boa

{{< chart type="bar" title="Ajuste típico de modelos de linguagem por tarefa (ilustrativo)" unit="/10" data=`[{"label":"Resumir texto","value":9},{"label":"Redação e reescrita","value":9},{"label":"Classificação e extração","value":8},{"label":"Responder a partir de documentos fornecidos","value":8},{"label":"Planejamento de múltiplas etapas com ferramentas","value":6},{"label":"Aritmética exata sem ferramentas","value":3},{"label":"Conhecer fatos recentes ou privados","value":2}]` caption="Essas pontuações são um recurso didático, não um benchmark. As duas linhas mais fracas são exatamente o que ferramentas e conhecimento, abordados no módulo de Agentes, foram criados para corrigir." >}}

Modelos de linguagem são excelentes em tarefas cuja resposta está *escrita na entrada* ou que são comuns em texto humano: resumir, traduzir, reformular, extrair campos, classificar e redigir. Eles são fracos em tudo que requer cálculo preciso, fatos atualizados ou informações que apenas sua empresa possui. Agentes existem para compensar exatamente essas fraquezas.

## Por que a palavra *agente* importa agora

Até recentemente, usar um modelo significava digitar uma pergunta e ler uma resposta. Um **agente** mantém o modelo no centro, mas lhe fornece:

{{< steps >}}
{{< step title="Instruções" >}}
Um papel escrito, metas e limites — para que o modelo serve e como deve se comportar.
{{< /step >}}
{{< step title="Contexto" >}}
A conversa até agora, quem é o usuário e quaisquer fatos que o modelo deve levar em conta.
{{< /step >}}
{{< step title="Conhecimento" >}}
Documentos que o modelo pode pesquisar como evidência antes de responder. Isso reduz a adivinhação ao invés de terminá‑la: a busca pode perder a passagem correta, e o modelo ainda pode interpretar erroneamente o que encontra.
{{< /step >}}
{{< step title="Ferramentas" >}}
Ações que pode solicitar — buscar um pedido, enviar um e‑mail, criar um ticket — executadas por software comum.
{{< /step >}}
{{< step title="Barreiras" >}}
Verificações que o mantêm no tópico, seguro e em conformidade, e encaminham a um humano quando necessário.
{{< /step >}}
{{< /steps >}}

O próximo módulo constrói exatamente isso, um pedaço de cada vez, começando com [Introdução a agentes de IA](../agents/introduction-to-ai-agents.md).

{{< quiz options="Ele procura a resposta correta em um banco de fatos | Ele prevê o próximo token mais provável, um pedaço de cada vez, baseado em padrões aprendidos a partir do texto | Ele segue regras escritas por seus desenvolvedores para cada pergunta possível" answer="2" explanation="A previsão, não a busca, é o que torna os modelos fluentes, por que podem estar errados com confiança, e por que agentes adicionam conhecimento e ferramentas ao seu redor." >}}
Qual frase descreve melhor como um modelo de linguagem produz uma resposta?
{{< /quiz >}}
