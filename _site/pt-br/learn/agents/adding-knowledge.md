Source: https://docs.aivax.net/pt-br/learn/agents/adding-knowledge.html

Imagine contratar um consultor experiente de atendimento ao cliente. Ele sabe como explicar uma devolução de forma educada, mas não conhece a política de devolução da sua empresa. Experiência não substitui o seu manual. A mesma distinção se aplica a um agente: um modelo de linguagem pode redigir uma resposta convincente sobre reembolsos sem saber o que seu negócio realmente promete.

**Conhecimento**, nesta unidade, significa material de referência que o agente pode consultar: políticas aprovadas, catálogos de produtos, manuais operacionais e outros documentos. Fornecer esse material ao agente é diferente de ensiná‑lo um novo estilo de escrita. Você está fornecendo evidência para respostas específicas, não assumindo que o treinamento geral do modelo contém os fatos da sua empresa.

## Por que o conhecimento geral não é o conhecimento da sua empresa

Um modelo aprendeu padrões a partir do material usado durante seu treinamento. Isso pode ajudá‑lo a explicar conceitos comuns, mas não é um registro confiável de suas políticas atuais. Suas regiões de entrega podem ter mudado. Seu catálogo pode incluir um serviço lançado após o treinamento do modelo. Uma exceção interna pode nunca ter aparecido publicamente.

Mesmo perguntas familiares precisam de evidência local. “Posso trocar este item?” parece simples, porém a resposta pode depender da categoria do produto, condição, canal de vendas e política aplicável. Uma explicação fluente de como as trocas geralmente funcionam pode estar completamente errada para esse cliente. O agente precisa da regra relevante e informações suficientes sobre a situação para aplicá‑la.

O conhecimento também cria responsabilidade. Um supervisor pode comparar uma resposta com um documento aprovado em vez de debater se parece razoável. Isso não torna toda resposta correta automaticamente. O agente ainda pode escolher a passagem errada ou interpretar mal uma exceção. Contudo, dá à sua equipe algo concreto para inspecionar e melhorar.

## Buscar primeiro, responder depois

**Geração aumentada por recuperação**, geralmente abreviada como **RAG**, significa encontrar documentos relevantes antes de pedir ao modelo que responda com a ajuda deles. Pense em um consultor abrindo a página correta do manual em vez de ler todo o arquivo antes de cada chamada. O sistema pesquisa o material disponível, coloca passagens úteis ao lado da pergunta e pede ao modelo que produza uma resposta sustentada por essas passagens. Normalmente isso não re‑treina o modelo nem altera permanentemente o que ele aprendeu. Os detalhes mecânicos pertencem ao [What is a RAG](https://docs.aivax.net/pt-br/learn/teaching-agents/what-is-a-rag.md); por enquanto, lembre‑se da ordem: encontrar evidência, depois explicá‑la.

Pergunta do cliente → Encontrar documentos relevantes → Ler a evidência → Responder com a fonte

Pesquisar não é o mesmo que responder. Uma busca pode encontrar um documento sobre devoluções sem encontrar a cláusula que cobre um item danificado. Antes de confiar em uma passagem, o agente deve considerar se ela responde à pergunta real, se aplica ao produto ou público correto e se ainda é válida. Se a evidência necessária estiver ausente, fazer uma pergunta de acompanhamento ou contatar uma pessoa é melhor do que completar a política pela imaginação.

## Experimente uma pequena coleção de conhecimento

A demonstração abaixo usa documentos inventados para uma loja fictícia. Ela ilustra a seleção de material de referência, não o comportamento ou a precisão de um serviço de busca em produção. Experimente termos como “danificado”, “entrega” ou “manual”, depois pense no que o documento correspondente estabelece e o que não estabelece.

> **Demonstração interativa: Experimente: encontre o documento da empresa relevante.** Esta demonstração interativa está disponível na página web. Observe que encontrar o documento de entrega danificada suporta uma explicação do processo de revisão. Não estabelece que uma substituição específica foi aprovada.

Um exercício útil é fazer uma pergunta que a coleção não pode responder, como se um determinado pacote chegou. Nenhum desses documentos é um registro de envio ao vivo. Um bom design de conhecimento torna esse limite visível. O agente deve usar uma ferramenta de rastreamento autorizada ou explicar que não pode confirmar o status atual a partir desses documentos.

## Escolha os primeiros documentos deliberadamente

Comece com uma tarefa recorrente, não com todo arquivo que a empresa possui. Para um agente de suporte, essa tarefa pode ser explicar devoluções e cobertura de garantia. Para um assistente interno, pode ser ajudar funcionários a solicitar equipamentos. Para vendas, pode ser explicar diferenças de produtos sem inventar promessas contratuais.

Pergunte às pessoas que realizam esse trabalho quais perguntas se repetem, onde vivem as respostas autoritativas e quais erros causam mais retrabalho. Selecione documentos que respondam diretamente a essas perguntas. Uma política curta e aprovada costuma ser um ponto de partida melhor do que uma pasta grande de apresentações contendo rascunhos contraditórios. Mais material só é útil quando adiciona evidência relevante e confiável.

- **Políticas** — Declare o que é permitido, o que é excluído e quem pode aprovar uma exceção. Inclua o escopo e a data de vigência.

- **Catálogos** — Descreva produtos e serviços de forma consistente. Distinga especificações estáveis de preços ou disponibilidade que precisam de verificação em tempo real.

- **Manuais** — Explique como concluir uma tarefa, incluindo pré‑requisitos, avisos e o ponto em que uma pessoa deve assumir.

Antes de adicionar um documento, leia‑o como um recém‑chegado faria. “Pacote padrão” refere‑se a uma oferta nomeada? “Contatar a equipe usual” identifica uma responsabilidade real? A exceção aparece ao lado da regra que modifica? Material que depende de conhecimento de fundo não escrito é difícil tanto para um novo funcionário quanto para um agente usar de forma confiável.

Mantenha informações privadas fora, a menos que o caso de uso realmente as exija e o acesso seja adequadamente restrito. Uma política interna de salários e um guia público de produtos não pertencem ao mesmo pool de respostas irrestritas. O fato de um documento ser pesquisável não significa que todo usuário tem direito de receber seu conteúdo.

## Faça da atualidade responsabilidade de alguém

**Atualidade** significa o quão corrente a informação está para seu propósito. Um guia de limpeza pode permanecer útil por muito tempo, enquanto uma promoção pode ficar obsoleta da noite para o dia. Apenas a data de upload não basta: um arquivo adicionado hoje pode conter uma política revogada no ano passado.

Atribua um proprietário de negócio a cada assunto. Esse proprietário decide qual versão é autoritária, quando entra em vigor e o que deve acontecer com a versão anterior. Mantenha essas decisões visíveis por meio de título, proprietário, escopo, data de revisão e referência de fonte. Esses detalhes são frequentemente chamados de **metadados**: informações que descrevem um documento em vez do texto principal.

1. **Escolher a fonte autoritária**

Pergunte ao responsável pela política qual documento deve reger as respostas. Resolva rascunhos conflitantes antes de adicioná‑los.

2. **Preparar e publicar a versão aprovada**

Torne títulos e exceções explícitos. Verifique se o conteúdo pesquisável corresponde ao original aprovado.

3. **Testar perguntas ordinárias e difíceis**

Inclua perguntas com fatos ausentes, redação conflitante e sem resposta na coleção. Verifique a evidência assim como a redação final.

4. **Revisar e descontinuar**

Reveja respostas após alterações. Remova ou exclua claramente material substituído das buscas de políticas atuais, preservando registros quando necessário.

Um calendário de revisão ajuda, mas atualizações acionadas por eventos também são importantes. Quando o negócio altera uma política, atualizar as fontes do agente deve fazer parte da mesma lista de verificação de release. Caso contrário, o site e o agente podem dar respostas diferentes, embora ambas as equipes acreditem ter publicado as novas regras.

No AIVAX, grupos de documentos pesquisáveis são chamados de [collections](https://docs.aivax.net/pt-br/docs/rag/collections.md). [Semantic search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) encontra material relevante por significado, em vez de exigir correspondência exata de texto. Esses recursos suportam a recuperação; sua equipe ainda detém a qualidade dos documentos, decisões de acesso e o significado comercial da resposta.

Próximo passo: aprenda quando um agente deve deixar seus documentos armazenados e [conectar-se ao mundo](https://docs.aivax.net/pt-br/learn/agents/connecting-to-the-world.md) para informações atuais.

**Verifique seu conhecimento.** Qual é o ponto de partida mais confiável para um agente que explica as políticas da sua empresa?

1. Adicionar cada rascunho histórico para que o agente tenha mais texto
2. Fornecer ao agente fontes aprovadas, um proprietário e um processo para descontinuar versões desatualizadas
3. Dizer ao modelo para soar certo sobre as políticas da empresa

Answer: option 2. Respostas confiáveis da empresa precisam de evidência autoritária e manutenção contínua. Mais texto ou um tom mais confiante não substituem fontes atuais e aprovadas.
