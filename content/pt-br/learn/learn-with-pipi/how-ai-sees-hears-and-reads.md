---
{title: "Como a IA vê, ouve e lê",linkTitle: "#6 Multimodalidade",description: "Um cliente envia uma foto de um bolo, uma mensagem de áudio e um arquivo. O Pipi mostra modelos que entendem mídia diretamente, e como o AIVAX transforma mídia em texto para modelos que leem apenas texto.",weight: 60,duration: 5,objectives: [Defina um modelo multimodal.,"Reconheça que nem todos os modelos aceitam imagens, áudio ou arquivos.","A pré-processamento converte mídia em uma descrição textual através de um pipeline que transforma dados brutos (como pixels ou ondas sonoras) em informações estruturadas e semanticamente significativas. O processo varia ligeiramente dependendo do tipo de mídia, mas segue princípios gerais:\n\n### 1. Para Imagens e Vídeos (Visão Computacional)\n\nO objetivo é extrair características visuais relevantes e mapeá-las para conceitos linguísticos.\n\n*   **Normalização e Limpeza:** A imagem é redimensionada, normalizada (ajustando valores de pixel para uma faixa padrão, como 0-1) e, se necessário, corrigida quanto a iluminação ou ruído. Isso garante consistência para o modelo.\n*   **Extração de Características (Feature Extraction):**\n    *   **Modelos Tradicionais:** Algoritmos como SIFT ou HOG detectam bordas, texturas e pontos-chave.\n    *   **Deep Learning (CNNs):** Redes Neurais Convolucionais (como ResNet, VGG ou EfficientNet) processam a imagem em camadas. As primeiras camadas detectam bordas e cores; as camadas mais profundas identificam formas complexas, objetos e relações espaciais.\n*   **Geração de Embeddings:** A saída da CNN é convertida em um vetor numérico denso (embedding) que representa semanticamente o conteúdo da imagem.\n*   **Tradução para Texto (Captioning):**\n    *   Um modelo de linguagem (geralmente baseado em Transformers ou LSTMs) recebe esses embeddings visuais.\n    *   Usando mecanismos de atenção, o modelo \"olha\" para diferentes partes da imagem enquanto gera cada palavra da frase.\n    *   O resultado é uma sequência de palavras (legenda) que descreve a cena, como \"um cachorro dourado correndo na grama\".\n\n### 2. Para Áudio (Processamento de Sinal de Áudio)\n\nO objetivo é transformar ondas sonoras em representações espectrais e depois em texto (transcrição) ou descrições contextuais.\n\n*   **Pré-processamento de Sinal:**\n    *   **Amostragem e Quantização:** O áudio analógico é digitalizado.\n    *   **Filtragem:** Ruídos de fundo são reduzidos usando filtros passa-baixa ou técnicas de cancelamento de ruído.\n    *   **Segmentação:** O áudio é dividido em frames curtos (ex: 20-30 ms) para análise local.\n*   **Transformação Espectral:**\n    *   A Transformada Rápida de Fourier (FFT) converte o sinal do domínio do tempo para o domínio da frequência.\n    *   Isso gera espectrogramas ou mel-spectrogramas, que mostram quais frequências estão presentes ao longo do tempo, similar a uma \"imagem\" do som.\n*   **Codificação Acústica:**\n    *   Modelos como Wav2Vec 2.0 ou Whisper analisam esses espectrogramas.\n    *   Eles identificam padrões fonéticos, entonação e ritmo.\n*   **Decodificação para Texto:**\n    *   Um decodificador de linguagem mapeia os padrões acústicos reconhecidos para unidades linguísticas (fonemas, sílabas ou palavras).\n    *   O resultado é a transcrição literal do discurso ou, em casos mais avançados, uma descrição do conteúdo emocional ou contextual do áudio.\n\n### 3. Para Documentos Multimídia (OCR + NLP)\n\nQuando a mídia inclui texto embutido (como imagens com placas ou documentos escaneados):\n\n*   **Reconhecimento Óptico de Caracteres (OCR):** Detecta regiões de texto na imagem e as converte em caracteres legíveis por máquina.\n*   **Limpeza de Texto:** Remove formatação excessiva, corrige erros comuns de OCR e padroniza a estrutura.\n*   **Análise Semântica:** Técnicas de Processamento de Linguagem Natural (NLP), como extração de entidades nomeadas ou sumarização, transformam o texto bruto em uma descrição concisa e significativa.\n\n### Resumo do Fluxo Geral\n\n1.  **Entrada Bruta:** Pixels, amostras de áudio ou bytes.\n2.  **Pré-processamento Técnico:** Normalização, filtragem e transformação (FFT/Convolution).\n3.  **Representação Intermediária:** Vetores numéricos (embeddings) que capturam significado visual ou acústico.\n4.  **Mapeamento Linguístico:** Uso de modelos de IA (como Transformers) para traduzir esses vetores em sequências de palavras coerentes.\n5.  **Saída:** Uma descrição textual precisa e contextualizada.\n\nEsse processo permite que sistemas de IA \"compreendam\" e comuniquem o conteúdo de mídias não textuais em formato acessível e pesquisável."],sourceHash: 9851b1318afa1028}
---

O cérebro da série só lê texto. Pequenos bilhetes passam facilmente, mas os clientes também enviam fotos e mensagens de voz, e essas não cabem na fenda.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.webp" title="AIVAX Learn #6 — Como a IA vê, ouve e lê" lang="pt-BR" caption="Episódio 6 · 1 minuto e 13 segundos" >}}

## O que o vídeo mostra

Alguns modelos são **multimodais**: eles veem imagens, ouvem áudio e leem arquivos. No vídeo, cada tipo de conteúdo tem sua própria pequena entrada no frasco. Um cliente envia uma foto de um bolo, e o cérebro analisa de perto: bolo de cenoura com cobertura de chocolate.

Mas nem todo modelo consegue ver. Alguns só leem texto. Para esses, a AIVAX usa uma máquina tradutora: ela olha para a mídia primeiro e imprime um bilhete descrevendo-a. O bilhete passa pela fenda de texto, e o cérebro entende da mesma forma. Esta etapa é chamada de **pré-processamento**.

{{< tabs >}}
{{< tab title="Modelo multimodal" >}}
{{< flow "Foto | Modelo multimodal | Resposta" >}}

O modelo recebe a imagem original. Melhor quando detalhes visuais finos são importantes e o modelo escolhido suporta esse tipo de mídia.
{{< /tab >}}
{{< tab title="Pré-processamento" >}}
{{< flow "Foto | Descrição escrita pela AIVAX | Modelo apenas de texto | Resposta" >}}

O modelo principal recebe uma descrição textual em vez da imagem. Útil para modelos apenas de texto, ou para manter um único modelo para todos os canais, independentemente do que os clientes enviam.
{{< /tab >}}
{{< /tabs >}}

## Escolhendo entre eles

O pré-processamento adiciona uma etapa, portanto, adiciona algum custo e tempo de espera, e uma descrição pode omitir detalhes que a mídia original tinha. Enviar mídia diretamente evita isso, mas limita você aos modelos que a aceitam. Muitas equipes começam com pré-processamento para áudio e documentos e enviam imagens diretamente quando o modelo as suporta.

## Aprofunde-se

- Em Aprender: [Multimodalidade: imagens, áudio, documentos, vídeo](../models/multimodality.md) e [Famílias de modelos e como escolher](../models/model-families-and-choosing.md).
- Na Documentação: [Inferência](../../docs/inference/chat-completions/concepts.md) explica como enviar mídia em uma solicitação e como o resolvedor multimodal substitui a mídia por uma descrição. [Pipelines](../../docs/inference/pipelines.md) cobre a configuração do gateway para isso. [Descrições de mídia](../../docs/data-processing/media-descriptions.md) e [Transcrições de áudio](../../docs/generations/audio-transcriptions.md) estão disponíveis como ferramentas independentes.

O último episódio leva o mesmo cérebro ao site, WhatsApp e Telegram.

{{< quiz options="Não pode ser usado com fotos de forma alguma | A AIVAX pode descrever a foto como texto primeiro, e o modelo lê a descrição | O cliente deve descrever a foto com palavras" answer="2" explanation="O pré-processamento escreve uma descrição textual da mídia, então um modelo apenas de texto ainda pode entendê-la." >}}
Seu modelo escolhido só lê texto, e um cliente envia uma foto. O que o vídeo mostra?
{{< /quiz >}}
