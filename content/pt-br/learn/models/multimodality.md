---
{title: "Multimodalidade: imagens, áudio, documentos, vídeo",linkTitle: Multimodalidade,description: "Escolha como um assistente recebe e produz mídia, e entenda o que pode ser perdido quando imagens, gravações e documentos se tornam texto.",weight: 30,duration: 12,objectives: [Distinguir as capacidades de entrada de mídia das capacidades de geração de mídia.,Comparar a compreensão direta da mídia com a conversão para texto primeiro.,"Selecionar uma abordagem de processamento para uma fatura, nota de voz ou documento.","Identificar limites de qualidade, privacidade e verificação em fluxos de mídia."],sourceHash: 187dee924e5f6c45}
---

Um cliente nem sempre descreve um problema em uma mensagem digitada. Ele pode fotografar um pacote danificado, gravar uma nota de voz, anexar uma fatura ou enviar uma gravação de tela. **Multimodalidade** significa trabalhar com mais de um tipo de informação, como texto, imagens e áudio. Esses diferentes tipos são chamados de **modalidades**.

Pense em um colega recebendo uma pasta contendo uma carta, uma fotografia e uma gravação. Ler a carta não é a mesma habilidade de ouvir a gravação ou reconhecer danos na fotografia. Um assistente de IA também precisa da capacidade correta para cada entrada. Um modelo de texto não pode inspecionar uma imagem apenas porque suas instruções dizem “olhe cuidadosamente”.

## Entrada e saída são capacidades separadas

Um modelo pode aceitar imagens e devolver texto, aceitar texto e produzir fala, ou lidar com várias combinações. Entender uma imagem não implica ser capaz de criar uma. Da mesma forma, transformar uma gravação em palavras escritas não implica a capacidade de manter uma conversa falada ao vivo. Verifique ambos os lados da tarefa: o que entra e o que deve sair.

{{< cards >}}
{{< card title="Imagens" icon="eye" >}}
Entradas podem incluir fotografias, capturas de tela ou diagramas. Saídas podem ser descrições ou fatos extraídos; criar ou editar uma imagem requer uma capacidade de geração adequada.
{{< /card >}}
{{< card title="Áudio" icon="message" >}}
Entradas podem incluir fala ou outros sons. As tarefas incluem transcrição e interpretação de áudio. A saída falada usa geração de fala ou um sistema de voz ao vivo compatível.
{{< /card >}}
{{< card title="Documentos" icon="book" >}}
Um documento pode misturar texto selecionável, páginas escaneadas, gráficos e tabelas. Sua extensão de arquivo sozinha não indica quais informações podem ser extraídas de forma confiável.
{{< /card >}}
{{< card title="Vídeo" icon="play" >}}
Uma gravação combina imagens ao longo do tempo e pode incluir áudio. Resumir requer decidir quais momentos e sons estão disponíveis para o sistema de processamento.
{{< /card >}}
{{< /cards >}}

Um formato de documento é um contêiner, não um único tipo de significado. Um PDF pode conter texto limpo que pode ser extraído diretamente. Outro pode ser uma coleção de fotografias escaneadas. Um terceiro pode conter um gráfico cuja mensagem depende de cores e layout espacial. Tratar os três como texto simples pode gerar resultados muito diferentes.

A mesma distinção importa para vídeo. Um sistema que inspeciona uma seleção de quadros pode reconhecer objetos mas perder um evento breve entre eles. Uma transcrição pode capturar o que o apresentador disse enquanto perde o diagrama apontado. Seja preciso sobre quais partes da gravação foram processadas antes de afirmar ter analisado todo o evento.

## Dois caminhos da mídia para a resposta

O primeiro caminho é **entrada direta de mídia**: envie a mídia para um modelo ou serviço que suporte essa entrada e faça a pergunta relevante. O segundo caminho é **pré‑processamento**: converta as informações úteis em texto primeiro, depois dê esse texto a um modelo de linguagem. Ambos podem ser adequados, e um fluxo de trabalho pode combiná‑los.

**Transcrição** transforma palavras faladas em texto escrito. **Reconhecimento óptico de caracteres**, geralmente chamado de **OCR**, lê caracteres de imagens ou páginas escaneadas. Uma **descrição de mídia** expressa informações visíveis ou audíveis em palavras, como “uma caixa de papelão com um canto rasgado”. São produtos diferentes: uma descrição de um recibo não é necessariamente uma transcrição fiel de cada valor.

{{< compare >}}
{{< side title="Mídia direta" >}}
Pergunte a um modelo com capacidade de visão sobre a foto original do pacote. Isso pode manter relações visuais úteis, como onde o dano aparece. Formatos suportados, detalhe, custo e qualidade dependem do serviço selecionado.
{{< /side >}}
{{< side title="Texto primeiro" >}}
Crie uma descrição ou transcrição, então deixe um modelo de texto lidar com a conversa. O texto pode ser reutilizado e pesquisado, mas tudo que foi omitido durante a conversão não está disponível para o modelo posterior.
{{< /side >}}
{{< /compare >}}

Uma rota texto‑primeiro é útil quando a informação importante são principalmente palavras e será reutilizada. Uma nota de voz de suporte pode se tornar uma transcrição mais fácil de pesquisar e revisar. Uma rota direta é útil quando a tarefa depende de layout, relações visuais ou outras informações que a conversão para texto pode perder. Nenhuma rota garante que letras miúdas ou fala pouco clara sejam compreendidas corretamente.

{{< flow "Receber mídia | Verificar acesso e formato | Ler diretamente ou converter para texto | Responder à pergunta específica | Verificar detalhes consequentes" >}}

Antes de processar, declare o que você precisa aprender. “Ler esta fatura” é menos útil que “Extrair o nome do fornecedor, data da fatura, total e moeda; marcar tudo que estiver ilegível.” Uma solicitação focada facilita a avaliação do sucesso e evita a coleta de detalhes não relacionados de um documento ou gravação.

## Escolha o caminho para o trabalho

{{< tabs >}}
{{< tab title="Fotografia da fatura" >}}
Use OCR ou compreensão de imagem para extrair os campos necessários. Verifique a imagem original para dígitos ambíguos, separadores decimais e moeda. Exija revisão antes de criar ou aprovar um pagamento.
{{< /tab >}}
{{< tab title="Nota de voz do cliente" >}}
Transcreva a gravação quando a tarefa for capturar as palavras do cliente. Preserve incertezas sobre nomes, endereços e datas. Peça confirmação antes de agir sobre um detalhe que pareça incerto.
{{< /tab >}}
{{< tab title="PDF do produto" >}}
Extraia texto selecionável quando disponível. Use OCR para páginas escaneadas e compreensão de imagem quando diagramas forem importantes. Mantenha referências de página para que o revisor possa encontrar a evidência por trás da resposta.
{{< /tab >}}
{{< tab title="Vídeo de treinamento" >}}
Decida se fala, mudanças de tela ou ambos são essenciais. Uma transcrição sozinha pode explicar a narração enquanto perde qual botão o apresentador selecionou. Valide contra o momento relevante na gravação.
{{< /tab >}}
{{< /tabs >}}

Para o exemplo da fatura, separe reconhecimento da validação comercial. Um modelo pode ler um total que aparece em uma página, mas isso não prova que a fatura é genuína, que o fornecedor está aprovado ou que o pagamento está autorizado. Essas verificações pertencem ao processo de negócio ao redor. Uma foto clara melhora o reconhecimento; não estabelece confiança no documento.

Para a nota de voz, sotaques, ruído de fundo, falantes sobrepostos e nomes de produtos desconhecidos podem afetar a transcrição. Uma frase fluente pode esconder uma palavra ouvida incorretamente. Onde um detalhe importa, mostre o valor extraído ao usuário ou revisor. Não converta automaticamente uma transcrição incerta em instrução para alterar um pedido.

Para o PDF, preserve títulos e explicações próximas sempre que possível. Um valor de tabela sem seu cabeçalho pode ser enganoso. Uma frase separada de sua exceção pode inverter o sentido da política. Ler mais texto não basta se a conversão remover as relações necessárias para interpretá‑lo.

## Limites fazem parte do design

Todo serviço de mídia tem formatos suportados e limites práticos, como tamanho de arquivo, detalhe da imagem, duração do áudio ou quantidade de conteúdo processado em uma única solicitação. Um upload bem‑sucedido não prova por si só que cada página, som ou quadro foi considerado. Verifique o comportamento documentado do serviço selecionado e torne o escopo processado visível quando afetar a resposta.

A mídia também leva tempo para ser transferida e processada. Converter uma vez e reutilizar o resultado pode ajudar em perguntas repetidas, mas manter transcrições ou descrições cria informações armazenadas adicionais que precisam de controles de acesso e regras de exclusão. O processamento direto evita alguns arquivos intermediários, mas não elimina obrigações de privacidade. Escolha com base no fluxo de trabalho completo, não apenas no tempo de resposta inicial.

> [!WARNING]
> A mídia pode conter instruções escritas por alguém que não o usuário, incluindo texto dentro de uma captura de tela ou documento. Trate esse conteúdo como evidência a ser examinada, não como autoridade para mudar as permissões ou regras de negócio do assistente.

Mídia gerada precisa de revisão separada. Uma imagem de produto sintética pode mostrar recursos que o produto não possui. A saída falada pode pronunciar nomes incorretamente. Uma voz convincente ou imagem polida não é evidência de autenticidade. Deixe claro o uso pretendido e verifique o conteúdo antes de compartilhá‑lo com clientes.

## Capacidades relacionadas do AIVAX

No AIVAX, converter mídia em texto está disponível através de [descrições de mídia](../../docs/data-processing/media-descriptions.md), [transcrição de áudio](../../docs/generations/audio-transcriptions.md) e [busca e OCR](../../docs/web-foundation/fetch-and-ocr.md). Escolha o serviço de acordo com a necessidade de descrição, palavras faladas ou texto escrito de uma página; não presuma que suas saídas são intercambiáveis.

Para saída, veja [geração de fala](../../docs/generations/speech.md) e [geração de imagens](../../docs/generations/images.md). Uma troca falada ao vivo é um padrão de interação separado coberto por [sessões de voz](../../docs/inference/voice-session.md). Esses guias descrevem opções suportadas; os exemplos desta unidade são escolhas de fluxo de trabalho, não promessas de que todo modelo suporte todas as modalidades.

Próximo passo: aprenda como [incorporações e busca semântica](embeddings-and-semantic-search.md) ajudam a encontrar informações relevantes após serem preparadas.

{{< quiz options="Transcrever a narração e assumir que inclui toda ação visual | Escolher um fluxo que examine as imagens de tela relevantes assim como o áudio | Usar qualquer modelo apenas de texto com temperatura mais alta | Gerar um novo vídeo em vez disso" answer="2" explanation="O botão correto pode estar visível sem ser mencionado em voz alta. O caminho de processamento deve preservar a informação de que a tarefa depende; uma transcrição sozinha pode perder evidências visuais." >}}
Uma equipe precisa aprender qual botão o apresentador clicou em um vídeo de treinamento. Qual abordagem se adapta à tarefa?
{{< /quiz >}}
