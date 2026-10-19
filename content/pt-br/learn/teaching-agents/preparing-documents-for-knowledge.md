---
{title: Preparando documentos para conhecimento,linkTitle: Preparando documentos para conhecimento,description: Transforme arquivos cotidianos em conhecimento claro e rastreável que um agente pode recuperar sem perder condições importantes.,weight: 70,duration: 12,objectives: [Limpe o material de origem sem remover fatos que alterem seu significado.,"Escolha métodos de conversão adequados para documentos, apresentações, planilhas e imagens.",Divida o texto em trechos autônomos para recuperação.,Aplique metadados e classificação para organizar e manter o conhecimento.],sourceHash: 2d6ae169ff5abc9c}
---

Um colega de suporte recebe uma pasta contendo o manual do Trail Lamp, uma planilha de garantia e fotografias da embalagem. A pasta contém conhecimento útil, mas entregá‑la não é o mesmo que torná‑la fácil de usar. Cabeçalhos de página repetidos interrompem frases. As células da planilha dependem dos rótulos das colunas. Uma fotografia pode conter um aviso que nunca aparece no manual.

Preparar documentos significa transformar essas fontes em material preciso e compreensível que um agente pode pesquisar. O objetivo não é fazer com que todo arquivo pareça idêntico. É preservar o significado enquanto remove obstáculos para encontrar e interpretar o conteúdo. Mantenha os originais: uma cópia limpa deve permanecer rastreável à evidência de onde veio.

## Comece com um caminho de preparação

**Ingestão** é o processo de levar material de origem para um sistema de conhecimento. Pode envolver extração, limpeza, segmentação e indexação. **Indexação** prepara o material para busca. São tarefas separadas: fazer upload de um arquivo com sucesso não prova que seu conteúdo foi lido corretamente ou que trechos úteis são pesquisáveis.

{{< flow "Fonte aprovada | Converter e limpar | Dividir por significado | Rotular e revisar | Indexar e testar" >}}

Comece com uma amostra pequena e representativa em vez de todo o arquivo. Inclua um documento simples e outro difícil, como uma folha de garantia digitalizada. Decida quais perguntas o agente deve responder de cada fonte. Essas perguntas se tornam verificações práticas: o texto preparado ainda pode explicar se a bateria do Trail Lamp está coberta, incluindo quaisquer exceções?

{{< steps >}}
{{< step title="Confirmar a fonte" >}}
Verifique propriedade, aprovação, atualidade e permissão para usar o conteúdo. Mantenha uma referência ao original e identifique qual versão é autoritária.
{{< /step >}}
{{< step title="Inspecionar o texto extraído" >}}
Leia o resultado convertido ao lado do original. Verifique cabeçalhos, ordem de leitura, tabelas e avisos antes de torná‑lo pesquisável.
{{< /step >}}
{{< step title="Preparar unidades de conhecimento completas" >}}
Separe tópicos não relacionados, retenha condições necessárias e anexe rótulos úteis a cada trecho.
{{< /step >}}
{{< step title="Testar perguntas representativas" >}}
Pesquise fatos, exceções e paráfrases comuns. Revise os trechos retornados, não apenas a resposta final.
{{< /step >}}
{{< /steps >}}

## Limpar ruído sem excluir significado

**Boilerplate** é texto padrão repetido, como um menu de navegação ou um slogan promocional. Cabeçalhos e rodapés costumam repetir o nome da empresa em cada página. Remover esse ruído pode tornar os parágrafos mais fáceis de ler e reduzir correspondências de busca irrelevantes. Corrija palavras quebradas, quebras de linha acidentais e parágrafos duplicados quando o original deixar o texto pretendido claro.

Não remova automaticamente toda linha repetida. Um rodapé pode identificar a data efetiva, a versão do produto ou a restrição de confidencialidade. Preserve essas informações em local adequado antes de remover cópias repetidas. Um aviso de segurança repetido ao lado de vários procedimentos pode ser essencial em cada procedimento, não uma decoração descartável.

Mantenha a limpeza diferente da reescrita de política. Se a fonte disser que uma falha na bateria requer inspeção, substituir isso por “baterias defeituosas são cobertas” altera a regra. Da mesma forma, uma frase ambígua não dá permissão para adivinhar. Sinalize ambiguidades para o responsável pelo documento, a pessoa que mantém a fonte precisa, e mantenha interpretações não aprovadas fora do conhecimento publicado.

## Converter o formato, preservar as relações

**Extração** transforma informações de uma fonte em texto ou outra representação utilizável. Alguns PDFs contêm texto selecionável; outros contêm imagens de página. **Reconhecimento óptico de caracteres**, geralmente chamado OCR, reconhece letras em imagens. O OCR pode ler incorretamente texto pequeno, pontuação e números, portanto, um output aparentemente fluente ainda precisa ser verificado contra a fonte.

{{< cards >}}
{{< card title="Documentos PDF" icon="book" >}}
Verifique a ordem das páginas, colunas e notas de rodapé. Uma frase de uma coluna vizinha não deve se tornar parte da regra de garantia.
{{< /card >}}
{{< card title="Slides de apresentação" icon="layout" >}}
Mantenha títulos de slides e notas explicativas juntos. Um ponto curto pode depender de um diagrama ou da explicação do apresentador.
{{< /card >}}
{{< card title="Planilhas" icon="database" >}}
Leve os cabeçalhos de coluna, unidades e nomes de planilhas relevantes para o texto. Um valor de célula sem seu produto e condição não é um fato completo.
{{< /card >}}
{{< card title="Imagens" icon="eye" >}}
Use OCR para texto escrito e descrições para relações visuais. Preserve a incerteza quando um rótulo ou símbolo não puder ser lido de forma confiável.
{{< /card >}}
{{< /cards >}}

Para slides, “Cobertura estendida” sob uma foto do produto pode não explicar o que está coberto ou para quem. Obtenha uma explicação aprovada em vez de gerar política faltante a partir da imagem. Para planilhas, preserve a diferença entre um resultado exibido e a fórmula usada para calculá‑lo. Um trecho preparado deve nomear o produto, a medida e quaisquer condições, em vez de listar células desconexas.

Uma **descrição de mídia** expressa informações visuais ou auditivas em palavras. Pode explicar que um diagrama coloca a porta de carregamento sob uma capa protetora, algo que o OCR sozinho pode perder. Descrições são interpretações, não cópias perfeitas. Verifique detalhes consequentes como rótulos de conectores e símbolos de segurança, e não infira um recurso não visto a partir de um produto familiar.

Relacionado: no AIVAX, [Buscar e OCR](../../docs/web-foundation/fetch-and-ocr.md) extrai conteúdo legível, enquanto [Descrições de Mídia](../../docs/data-processing/media-descriptions.md) cria descrições reutilizáveis. [Injetor de Mídia](../../docs/rag/documents.md#import-from-files-with-media-injector) processa mídia suportada em documentos de coleção. Escolha o caminho documentado para o tipo de fonte; converter slides ou planilhas pode exigir preparação fora desse fluxo de importação de mídia.

## Dividir por significado, não apenas por tamanho

Um **bloco** é um trecho armazenado ou manipulado como uma unidade pesquisável. **Segmentação** divide textos mais longos nessas unidades. Imagine substituir um grande fichário por cartões de referência rotulados: cada cartão deve cobrir um tópico útil sem enviar o leitor a outro cartão apenas para entender seu assunto.

Comece com limites naturais como cabeçalhos, respostas completas e seções de procedimento. Mantenha uma regra com suas condições e exceções. Retenha o nome do produto quando um trecho de outra forma começaria com “este dispositivo”. Se a fonte já consiste em respostas curtas e autônomas, divisão adicional pode gerar trabalho sem melhorar a recuperação.

{{< compare >}}
{{< side title="Bloco muito grande" tone="bad" >}}
Um único trecho do Trail Lamp contém instruções de carregamento, regras de garantia, descarte de embalagem e todo o catálogo de acessórios.

Uma pergunta sobre cobertura de bateria traz de grande quantidade de material não relacionado, dificultando a identificação da exceção importante.
{{< /side >}}
{{< side title="Tamanho certo para a pergunta" tone="good" >}}
Um trecho chamado “Garantia da bateria do Trail Lamp” contém a regra de cobertura, requisito de inspeção e exclusões da fonte aprovada.

O trecho permanece focado enquanto preserva as condições necessárias para responder com precisão.
{{< /side >}}
{{< /compare >}}

Muito pequeno também é um problema. “Requer inspeção” não é útil isoladamente se o produto e a falha relevante aparecem em outro trecho. **Sobreposição** significa repetir algum texto entre blocos vizinhos para preservar a continuidade. Pode ajudar nos limites, mas sobreposição excessiva produz resultados duplicados e mais manutenção. Prefira uma estrutura sensata antes de adicionar texto repetido.

No AIVAX, [Segmentação de Texto](../../docs/data-processing/text-segmentation.md) devolve segmentos de texto coerentes para revisão e uso posterior. A segmentação em si não armazena os documentos submetidos nem cria o índice de busca. Revise o que o processo produziu antes de tratá‑lo como conhecimento concluído.

## Adicionar rótulos que tornem a manutenção possível

**Metadados** são informações sobre o conteúdo, não o próprio conteúdo. Exemplos úteis incluem o proprietário do documento, produto, referência da fonte, data de vigência e data de revisão. Distinga essas datas: fazer upload de um manual antigo hoje não torna sua política atual. Quando os trechos são separados, carregue os metadados relevantes com eles para que sua identidade não se perca.

**Classificação** atribui conteúdo a categorias, como garantia, configuração ou segurança. Categorias ajudam as pessoas a organizar o material e podem suportar a seleção de busca. Defina o que cada categoria significa e como lidar com um trecho que se encaixa em mais de uma. Revise atribuições incertas em vez de forçar todo documento a um rótulo enganoso. No AIVAX, essa capacidade se chama [Classificação de Documentos](../../docs/data-processing/classification.md).

Rótulos não aplicam permissões automaticamente. Um rótulo “interno” só protege um documento se regras de aplicação confiáveis o usarem para restringir acesso. Da mesma forma, um rótulo de produto não pode corrigir um trecho que mistura silenciosamente vários produtos. Combine texto preciso, metadados corretos e controles de acesso reais.

Antes de publicar, experimente uma pergunta rotineira, uma exceção e uma pergunta que a fonte não pode responder. Confirme que o material preparado suporta os primeiros casos sem incentivar um palpite no último. Quando uma fonte mudar, substitua ou retire seus trechos desatualizados; caso contrário, a nova versão limpa pode competir com a antiga.

O que vem a seguir: combinar conhecimento durável com fatos que mudam durante uma conversa em [Contexto dinâmico](dynamic-context.md).

{{< quiz options="Remover toda linha repetida, incluindo datas e avisos | Dividir cada documento nos menores fragmentos possíveis | Preservar regras e exceções completas, anexar metadados da fonte e verificar o resultado contra o original | Tratar um upload bem‑sucedido como prova de que todos os fatos são pesquisáveis" answer="3" explanation="Uma preparação útil preserva significado e rastreabilidade. Limpeza, conversão e segmentação precisam de revisão porque cada etapa pode perder informações mesmo quando o processamento tem sucesso." >}}
Qual é a maneira mais segura de preparar um documento de garantia para recuperação?
{{< /quiz >}}
