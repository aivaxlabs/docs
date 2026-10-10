Source: https://docs.aivax.net/pt-br/learn/introduction/introduction-to-ai.html

Inteligência artificial é um nome amplo para softwares que executam tarefas que normalmente associamos ao julgamento humano: entender uma frase, reconhecer um rosto, decidir o próximo movimento em um jogo ou escrever um e‑mail. O nome é antigo — foi cunhado em 1956 — mas o que as pessoas entendem por ele mudou várias vezes. Esta unidade fornece o significado atual e o vocabulário usado ao longo do Learn.

## Regras versus aprendizado

Software comum segue regras que uma pessoa escreveu. Uma planilha soma números porque alguém programou a adição. Um aplicativo bancário bloqueia uma transferência porque um desenvolvedor escreveu *se o saldo for menor que o valor, recusar*. O comportamento é totalmente especificado antecipadamente.

A maior parte do que hoje se chama IA funciona de forma diferente: ninguém escreve as regras. Em vez disso, o sistema recebe um número muito grande de exemplos e se ajusta até que suas respostas correspondam aos exemplos. Dizemos que o sistema foi **treinado**, e o resultado é um **modelo**.


**Programa tradicional**

A pessoa escreve cada regra.

O comportamento é previsível e fácil de explicar.

Falha em tudo que as regras não previram.

Exemplo: um validador de faturas que verifica campos obrigatórios.


**Modelo treinado**

O sistema infere padrões a partir de exemplos.

O comportamento é estatístico; pode ser surpreendente.

Lida com variações que nunca viu, dentro dos limites.

Exemplo: um modelo que lê qualquer layout de fatura e extrai o total.





Nenhuma abordagem é melhor em geral. Regras vencem quando a tarefa é precisa e o custo do erro é alto; modelos aprendidos vencem quando a entrada é bagunçada, variada ou expressa em linguagem humana.

## Uma história curta


- **1950s — O nome e os primeiros programas**: Alan Turing pergunta se máquinas podem pensar. O termo *inteligência artificial* foi cunhado em um workshop em Dartmouth em 1956. Programas iniciais provam teoremas e jogam damas usando regras escritas à mão.

- **1980s — Sistemas especialistas**: Empresas codificam o conhecimento de especialistas como milhares de regras *se-então*. Os sistemas funcionam em áreas restritas, mas são caros de manter e frágeis fora delas.

- **1990s–2000s — Aprendizado de máquina se torna prático**: Em vez de escrever regras, pesquisadores treinam modelos estatísticos com dados. Filtros de spam, recomendações de produtos e pontuação de crédito se tornam aplicações cotidianas.

- **2012 — Aprendizado profundo**: Redes neurais com muitas camadas, treinadas em processadores gráficos, vencem concursos de reconhecimento de imagens por larga margem. Reconhecimento de fala e tradução melhoram rapidamente.

- **2017 — O transformador**: Um novo design de rede torna prático treinar com enormes quantidades de texto. Torna‑se a base da maioria dos modelos de linguagem grandes amplamente usados.

- **2022 onwards — Modelos conversacionais e agentes**: Modelos que geram texto fluente ficam disponíveis ao público. Desenvolvedores começam a conectá‑los a ferramentas, documentos e outros sistemas, e a palavra **agente** entra no vocabulário cotidiano.




## O vocabulário e como ele se encaixa

Os termos que você ouve com mais frequência não são concorrentes. Os três primeiros são campos aninhados, cada um uma parte mais estreita do anterior:

Inteligência artificial → Aprendizado de máquina → Aprendizado profundo


Os dois últimos não são campos, mas coisas que você constrói. Um modelo de linguagem grande é um produto do aprendizado profundo, e um agente é um sistema construído *ao redor* de tal modelo:

Modelo de aprendizado profundo → Modelo de linguagem grande → Agente



- **Artificial intelligence** — O campo inteiro: qualquer técnica que permite que o software faça algo que parece requerer inteligência, com ou sem aprendizado.

- **Machine learning** — O subconjunto onde o comportamento é aprendido a partir de exemplos, em vez de programado.

- **Deep learning** — Aprendizado de máquina feito com grandes redes neurais: muitas camadas de operações numéricas simples ajustadas em conjunto.

- **Language models** — Modelos treinados em texto para prever a próxima palavra. Pequenos já existiam muito antes do aprendizado profundo; os grandes por trás dos assistentes de chat de hoje (LLMs) são modelos de aprendizado profundo.

- **Agents** — Não é um tipo de modelo, mas um sistema: um modelo de linguagem encapsulado com instruções, memória, conhecimento e ferramentas para que possa executar tarefas, não apenas responder.




## O que um modelo de linguagem realmente faz

Um modelo de linguagem faz uma coisa: dado um texto, ele estima qual trecho de texto provavelmente virá a seguir. Ele faz isso repetidamente, um pequeno trecho de cada vez, até produzir uma resposta completa. Esses pequenos trechos são chamados de **tokens** — aproximadamente uma palavra curta ou parte de uma palavra.

> **Demonstração interativa: Experimente: como o texto se torna tokens.** Esta demonstração interativa está disponível na página web. Os modelos nunca veem letras ou palavras. Eles veem uma sequência de peças numeradas. Esta demonstração simplificada divide o texto da forma que um modelo faria aproximadamente; tokenizadores reais diferem nos detalhes, mas a ideia é a mesma.



Duas consequências decorrem de *prever o próximo token* e explicam a maior parte do que parece estranho na IA:

- **O modelo não tem noção de verdade.** Ele produz o que é plausível com base em seu treinamento, que geralmente está correto e às vezes está confiantemente errado. A indústria chama o caso errado de *alucinação*; uma palavra melhor é *confabulação*.
- **O modelo não se lembra de você.** Cada requisição começa do zero. Tudo que ele deveria saber sobre a conversa deve ser enviado novamente a cada mensagem. Unidades posteriores explicam como memória e conhecimento são construídos sobre essa limitação.

> **Demonstração interativa: Experimente: a próxima palavra é um sorteio, não uma busca.** Esta demonstração interativa está disponível na página web. O modelo atribui uma probabilidade a cada token candidato e então sorteia um. Uma configuração chamada *temperatura* achata ou aguça a distribuição. Mova o controle deslizante e sorteie algumas vezes.



## No que a IA de hoje é boa


**Ajuste típico de modelos de linguagem por tarefa (ilustrativo)**

| Item | Value |
| --- | --- |
| Resumir texto | 9/10 |
| Redação e reescrita | 9/10 |
| Classificação e extração | 8/10 |
| Responder a partir de documentos fornecidos | 8/10 |
| Planejamento de múltiplas etapas com ferramentas | 6/10 |
| Aritmética exata sem ferramentas | 3/10 |
| Conhecer fatos recentes ou privados | 2/10 |

Essas pontuações são um recurso didático, não um benchmark. As duas linhas mais fracas são exatamente o que ferramentas e conhecimento, abordados no módulo de Agentes, foram criados para corrigir.



Modelos de linguagem são excelentes em tarefas cuja resposta está *escrita na entrada* ou que são comuns em texto humano: resumir, traduzir, reformular, extrair campos, classificar e redigir. Eles são fracos em tudo que requer cálculo preciso, fatos atualizados ou informações que apenas sua empresa possui. Agentes existem para compensar exatamente essas fraquezas.

## Por que a palavra *agente* importa agora

Até recentemente, usar um modelo significava digitar uma pergunta e ler uma resposta. Um **agente** mantém o modelo no centro, mas lhe fornece:


1. **Instruções**

Um papel escrito, metas e limites — para que o modelo serve e como deve se comportar.


2. **Contexto**

A conversa até agora, quem é o usuário e quaisquer fatos que o modelo deve levar em conta.


3. **Conhecimento**

Documentos que o modelo pode pesquisar como evidência antes de responder. Isso reduz a adivinhação ao invés de terminá‑la: a busca pode perder a passagem correta, e o modelo ainda pode interpretar erroneamente o que encontra.


4. **Ferramentas**

Ações que pode solicitar — buscar um pedido, enviar um e‑mail, criar um ticket — executadas por software comum.


5. **Barreiras**

Verificações que o mantêm no tópico, seguro e em conformidade, e encaminham a um humano quando necessário.





O próximo módulo constrói exatamente isso, um pedaço de cada vez, começando com [Introdução a agentes de IA](https://docs.aivax.net/pt-br/learn/agents/introduction-to-ai-agents.md).

**Verifique seu conhecimento.** Qual frase descreve melhor como um modelo de linguagem produz uma resposta?

1. Ele procura a resposta correta em um banco de fatos
2. Ele prevê o próximo token mais provável, um pedaço de cada vez, baseado em padrões aprendidos a partir do texto
3. Ele segue regras escritas por seus desenvolvedores para cada pergunta possível

Answer: option 2. A previsão, não a busca, é o que torna os modelos fluentes, por que podem estar errados com confiança, e por que agentes adicionam conhecimento e ferramentas ao seu redor.
