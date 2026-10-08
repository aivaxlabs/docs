Source: http://localhost:1313/pt-br/learn/agents/what-is-an-llm.html

Um **modelo de linguagem grande**, normalmente abreviado como **LLM**, é um modelo treinado com grandes quantidades de texto para reconhecer e gerar padrões na linguagem. Um modelo é um sistema matemático cujos valores internos foram ajustados por meio de exemplos. Ele pode rascunhar um e‑mail, resumir uma reclamação ou sugerir a próxima pergunta em uma conversa. Não precisa de uma regra escrita à mão separada para cada frase que encontra.

Imagine um sistema de conclusão de texto incomumente capaz. Em vez de completar apenas uma palavra, ele pode continuar uma conversa, uma explicação ou um documento estruturado. Essa comparação ajuda a explicar o mecanismo básico, mas não significa que a saída esteja limitada a copiar frases familiares. Aprender com muitos exemplos permite que o modelo combine padrões de novas maneiras, incluindo maneiras úteis e maneiras equivocadas.

## Texto se torna peças chamadas tokens

Um **token** é uma unidade de texto manipulada pelo modelo. Dependendo do sistema e da língua, pode ser uma palavra, parte de uma palavra, pontuação ou outro pequeno fragmento. Um **tokenizador** é o componente que divide o texto nesses fragmentos e os representa como números. Não há regra universal de que uma palavra sempre seja um token.

O modelo recebe uma sequência de tokens. Para cada posição seguinte, ele estima quais tokens se encaixariam, seleciona um e repete o processo usando a sequência expandida. Isso é **predição do próximo token**. Seleções pequenas repetidas podem produzir uma resposta longa, assim como notas individuais podem formar uma melodia. A qualidade da resposta completa depende de mais do que qualquer seleção única.

> **Demonstração interativa: Experimente: texto se torna tokens.** Esta demonstração interativa está disponível na página web. Altere a frase, adicione pontuação ou experimente outro idioma. Esta é uma demonstração de ensino simplificada, não uma medição exata para um modelo específico. Tokenizadores reais podem dividir o mesmo texto de forma diferente.

A contagem de tokens importa porque há um limite de quanto texto um modelo pode processar em uma requisição, e o uso costuma ser medido por tokens de entrada e saída. Por enquanto, lembre‑se de que uma mensagem mais longa geralmente consome mais desse espaço, mas a contagem de caracteres não é um substituto preciso. [Context window, tokens and cost](http://localhost:1313/pt-br/learn/prompt-engineering/context-window-tokens-and-cost.md) explora as consequências práticas.

## Treinamento é diferente de responder

Durante o **treinamento**, o modelo trabalha repetidamente com exemplos e ajusta seus valores internos para melhorar suas previsões. Esses valores são frequentemente chamados de **parâmetros**. Eles não são um arquivo de documentos completos que o sistema abre um de cada vez. Eles codificam padrões aprendidos a partir do material de treinamento, incluindo estrutura linguística, relações entre conceitos e muitas associações factuais.

Após esse treinamento amplo, um treinamento adicional pode incentivar seguir instruções, responder de forma útil ou recusar certas solicitações. Isso altera tendências, não a necessidade de verificação. Quando você envia uma pergunta mais tarde, o modelo normalmente usa seus parâmetros existentes em vez de ser re‑treinado no momento. Produzir uma resposta com um modelo já treinado é chamado de **inferência**.

- **Before use — Learn patterns**: O treinamento ajusta o modelo usando exemplos de texto. Ele aprende regularidades que podem ser transferidas para perguntas que ainda não viu.

- **Before use — Shape behaviour**: Treinamento adicional pode incentivar seguir instruções e outras respostas desejadas. Não transforma toda resposta em fato verificado.

- **During use — Generate a response**: A aplicação fornece instruções e informações. O modelo gera tokens usando o que aprendeu e o que recebe agora.

Essa distinção explica um mal‑entendido comum: corrigir um modelo em uma conversa não ensina permanentemente o modelo subjacente. Ele pode usar a correção enquanto essa informação permanece disponível na conversa. Memória duradoura ou um processo de treinamento posterior é um mecanismo separado. Da mesma forma, enviar um documento da empresa fornece material ao modelo para o trabalho atual; não atualiza automaticamente todas as conversas futuras.

## Por que parece saber coisas

Se o material de treinamento conecta repetidamente um lugar com seu país, o modelo pode aprender essa associação e reproduzi‑la quando perguntado. Ele também aprende formas de explicar relações, organizar um argumento ou traduzir uma frase. Essas habilidades podem parecer uma busca em enciclopédia, mesmo quando nenhuma busca ocorreu.

Mas a informação aprendida pelo modelo não é uma conexão ao vivo com o mundo. Pode estar desatualizada, incompleta ou distorcida pelo material disponível durante o treinamento. Não saberá o status atual de um pedido privado apenas porque pode explicar processos de entrega. Um assistente empresarial confiável precisa de evidência atual de documentos ou ferramentas quando sua resposta depende de fatos atuais ou privados.

Uma **alucinação** é uma saída que apresenta informação inventada, incorreta ou sem suporte como se fosse fundamentada. Por exemplo, o modelo pode gerar uma exceção de política ou citação plausível quando nenhuma fonte de apoio foi fornecida. Isso não é evidência de engano deliberado. O processo que produz linguagem útil também pode produzir uma continuação convincente onde a resposta correta seria “Não tenho informações suficientes”.

**Formulação plausível**

“Your replacement has already been approved.” The sentence sounds helpful, but no approval record has been checked.

**Formulação fundamentada**

“I do not have an approval result yet. I can check the request or help you contact the team responsible.” The reply distinguishes evidence from possibility.

## A temperatura muda variedade, não verdade

O modelo pode atribuir alta probabilidade a vários tokens possíveis seguintes. **Temperatura** é um parâmetro de geração que altera o quão fortemente a seleção favorece os candidatos mais prováveis. Configurações mais baixas geralmente tornam a saída mais focada ou repetitiva. Configurações mais altas costumam introduzir mais variedade e também podem produzir escolhas menos adequadas. O comportamento exato depende do modelo e de como a geração é implementada.

> **Demonstração interativa: Experimente: escolha a próxima palavra.** Esta demonstração interativa está disponível na página web. Essas probabilidades são ilustrativas, não uma previsão do tempo. Altere a temperatura e gere várias continuações. Observe como a distribuição afeta a variedade sem acrescentar nenhuma evidência sobre o tempo de amanhã.

Uma temperatura baixa não torna uma afirmação sem suporte factual. Pode simplesmente tornar a mesma resposta errada mais repetível. Uma temperatura alta não dá ao modelo mais conhecimento. Para um título criativo, a variação pode ser útil; para o status de um pedido, a melhoria decisiva é uma consulta confiável. Trate as configurações de geração e a evidência como controles diferentes.

## Pontos fortes para usar e limites a considerar

LLMs são frequentemente úteis quando a tarefa envolve interpretar ou transformar linguagem. Um gerente pode pedir uma versão mais curta de um memorando extenso. Uma equipe de suporte pode organizar mensagens recebidas em categorias. Um vendedor pode transformar notas de produto aprovadas em um rascunho inicial. Em cada caso, o modelo ajuda na expressão e interpretação, não se tornando a autoridade da decisão de negócio.

- **Ajuste forte: transformar texto fornecido** — Resuma, reescreva ou traduza material preservando seu significado importante. Verifique se exceções e qualificações sobrevivem à transformação.

- **Ajuste forte: interpretar formulações variadas** — Reconheça que frases diferentes de clientes podem descrever a mesma necessidade. Faça uma pergunta de esclarecimento quando várias interpretações permanecerem possíveis.

- **Precisa de suporte: fatos exatos ou em tempo real** — Use software de cálculo confiável e registros atuais em vez de depender de uma resposta plausível produzida apenas a partir do treinamento.

Um modelo também pode cometer erros de raciocínio, ignorar uma condição em um documento longo ou escolher uma ação seguinte inadequada. Fornecer informações melhores ajuda, mas não garante uso correto. Para tarefas importantes, defina o que conta como resposta bem‑sucedida, compare com exemplos confiáveis e decida quem revisa o resultado. O modelo é um componente capaz em um sistema, não o sistema inteiro.

**Próximo passo:** veja como esse componente se torna útil em um processo de negócios em [From LLMs to agents](http://localhost:1313/pt-br/learn/agents/from-llms-to-agents.md).

**Verifique seu conhecimento.** Por que uma empresa não deve tratar a saída fluente como prova de que uma afirmação é verdadeira?

1. Temperatura baixa garante respostas factuais
2. O modelo sempre busca em um banco de dados atualizado antes de responder
3. Uma resposta fluente pode ser sem suporte porque gerar texto provável não é o mesmo que verificar um fato
4. Enviar uma correção sempre re‑treina o modelo permanentemente

Answer: option 3. O modelo gera texto a partir de padrões aprendidos e informações fornecidas. A confiabilidade factual depende de evidência e validação, não apenas de fluência ou temperatura.
