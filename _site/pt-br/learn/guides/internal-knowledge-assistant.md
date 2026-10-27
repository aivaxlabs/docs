Source: https://docs.aivax.net/pt-br/learn/guides/internal-knowledge-assistant.html

Os funcionários costumam saber que uma resposta existe, mas não onde encontrá‑la. A política de férias está em uma pasta, o guia de laptop em outra, e um antigo formulário de despesas ainda aparece na busca. Um assistente interno de conhecimento ajuda os funcionários a navegar por esse material em linguagem comum. Ele deve se comportar como um bibliotecário cuidadoso, não como um colega onisciente.

Imagine uma organização fictícia chamada Cedar Office. Ela quer um ponto de entrada único para perguntas de recursos humanos, tecnologia da informação e finanças. **Recursos humanos**, ou RH, lida com políticas de emprego. **Tecnologia da informação**, ou TI, gerencia os sistemas de trabalho. A primeira versão responde a perguntas sobre políticas; ela não aprova licenças, reinicia contas ou envia despesas.

## Escolha perguntas antes de coletar documentos

Comece entrevistando as pessoas que respondem às perguntas recorrentes. Pergunte o que os funcionários acham confuso, quais respostas variam por localização ou função, e quais questões devem permanecer privadas. “Ajudar os funcionários a encontrar a política de viagem correta” é um objetivo viável. “Saber tudo sobre a empresa” não é.

- **Orientação compartilhada** — Políticas publicadas para funcionários, instruções do service‑desk e procedimentos de escritório aprovados podem apoiar perguntas gerais quando se aplicam ao funcionário atual.

- **Orientação restrita** — Procedimentos específicos de departamento exigem uma decisão de acesso antes da recuperação. Um documento ser pesquisável não significa que todo funcionário pode lê‑lo.

- **Registros privados** — Casos de pessoal, detalhes médicos, registros individuais de folha de pagamento e arquivos disciplinares não pertencem à coleção piloto geral.

Um **wiki** é um conjunto de páginas mantidas colaborativamente. Pode conter material útil, mas popularidade não é autoridade. Uma página amplamente vinculada ainda pode estar desatualizada. **Metadados** são rótulos descritivos anexados a um documento, como proprietário, departamento, data de vigência e público permitido. Esses rótulos ajudam a organizar a recuperação; sua precisão também precisa de um responsável.

## Prepare uma estante de referência confiável

1. **Inventariar as fontes**

Liste políticas candidatas, páginas de wiki e guias de serviço com seus proprietários. Identifique material duplicado, contraditório, rascunho e expirado antes de importá‑lo.

2. **Reescrever respostas difíceis**

Dê a cada política um título claro, escopo, data de vigência e procedimento concreto. Mantenha exceções ao lado da regra que qualificam, em vez de em um anexo não relacionado.

3. **Atribuir regras de acesso**

Marque o público permitido e conecte as verificações de acesso ao sistema de identidade confiável da organização. Não permita que um funcionário conceda a si mesmo acesso digitando o nome de um departamento.

4. **Construir respostas baseadas em evidência**

Recupere apenas trechos permitidos, depois responda com o título da fonte e um link que o funcionário possa abrir. Se os trechos não resolverem a pergunta, diga isso.

5. **Revisar e melhorar**

Faça um piloto com representantes de cada departamento. Colete feedback, inspecione perguntas não resolvidas e dê aos proprietários das políticas uma tarefa recorrente de revisão.

Leia [Finding and preparing knowledge](https://docs.aivax.net/pt-br/learn/teaching-agents/finding-and-preparing-knowledge.md) para seleção de fontes e [Writing good documents](https://docs.aivax.net/pt-br/learn/teaching-agents/writing-good-documents.md) para procedimentos claros e autônomos. Material de origem melhor muitas vezes corrige uma resposta confusa mais diretamente do que adicionar outra instrução ao agente.

Use um processo de publicação definido. Quando uma política mudar, atualize ou retire a versão pesquisável e verifique se as respostas antigas deixam de aparecer. Mantenha um responsável pela mudança. A data de upload de um documento não é necessariamente a data em que sua regra entrou em vigor.

## Imponha acesso antes que o modelo veja um trecho

**Autenticação** verifica quem é o funcionário; **autorização** verifica o que esse funcionário pode acessar. Ambos são necessários. O aplicativo confiável deve obter a associação a departamento e função do sistema de identidade da organização e, em seguida, restringir a busca antes que seus resultados sejam fornecidos ao modelo.

Não recupere todos os documentos e apenas instrua o modelo a não mencionar material restrito. Isso coloca a informação além da fronteira antes que a decisão seja tomada. Aplique as mesmas regras de acesso a links diretos de documentos, histórico de conversas, respostas em cache e registros de feedback. Um cache é um resultado armazenado reutilizado posteriormente; ele não deve reutilizar uma resposta apenas para finanças para um funcionário não autorizado.

Relacionado: no AIVAX, [collections](https://docs.aivax.net/pt-br/docs/rag/collections.md) armazenam documentos pesquisáveis e [document filters](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) restringem buscas usando metadados ou tags. Filtros ajudam a expressar um escopo, mas um filtro fornecido pelo modelo não é um sistema de autorização. Um aplicativo confiável deve impor a restrição necessária. O caminho automático de gateway RAG documentado não aplica filtros de documento, portanto não assuma que anexar uma coleção de acesso misto torna esse caminho seguro para o departamento.

Se o caminho de recuperação escolhido não puder impor a fronteira necessária, separe os dados ou escolha um caminho adequadamente controlado antes de lançar. Informações ausentes de identidade ou permissão devem interromper a recuperação restrita, não ampliá‑la silenciosamente. Revise [Privacy, LGPD, and GDPR](https://docs.aivax.net/pt-br/learn/safety/privacy-lgpd-gdpr.md) ao decidir quais dados de funcionários processar e reter.

## Torne as respostas verificáveis

Uma **citação** identifica a fonte que sustenta uma afirmação. Ela deve levar ao documento ou seção relevante, não apenas à página inicial da empresa. Mencione o escopo quando ele altera a resposta: “A política de viagem doméstica diz…” é mais seguro que “Todos podem reivindicar…”. Não trate uma citação como decoração; verifique se o trecho citado realmente sustenta a afirmação.

**Confiante mas sem suporte**

“Você pode registrar despesas com qualquer equipamento de home‑office. Isso provavelmente está coberto pela política geral de despesas.”

**Incerteza útil**

“Encontrei a política de despesas de viagem, mas ela não cobre equipamentos de home‑office. Não posso confirmar a elegibilidade com a orientação disponível. A rota de ajuda financeira pode esclarecer.”

“Não sei” deve vir com um próximo passo útil. Declare o que foi encontrado, o que permanece sem solução e a equipe responsável. Não revele que um documento restrito existe se sua existência for sensível. Políticas conflitantes também exigem uma pausa: explique o conflito ao proprietário adequado em vez de inventar um compromisso.

> **Demonstração interativa: Experimente: uma pequena estante de referência fictícia para funcionários.** Esta demonstração interativa está disponível na página web. Esta pequena demonstração mostra correspondência com documentos de exemplo. Ela não implementa autenticação de funcionários, permissões departamentais ou um sistema de busca semântica de produção. Experimente uma pergunta que a estante não pode responder e perceba por que a falta de evidência importa.

## Adapte a resposta ao departamento

O mesmo padrão de resposta funciona entre equipes: identifique a pergunta, verifique o escopo, encontre evidência, explique o procedimento e ofereça a rota de ajuda adequada. O que muda são as informações permitidas e a consequência de estar errado.

**RH**

Um funcionário pergunta como solicitar licença. Forneça o procedimento publicado aplicável à sua localização de emprego e explique onde a aprovação ocorre. Não divulgue licenças de colegas ou infera informações de saúde. Uma disputa pessoal vai para a rota confidencial de RH, não para uma resposta de política geral.

**TI**

Um funcionário não consegue conectar o laptop de trabalho. Ofereça solução de problemas aprovada que não enfraqueça a segurança. Nunca peça que ele cole ou senhas ou códigos de recuperação. Se for necessário recuperar acesso, direcione‑o ao processo de recuperação verificado em vez de tratar o chat como prova de identidade.

**Finanças**

Um funcionário pergunta se é necessário um recibo. Cite a regra de despesa aplicável e identifique exceções que estejam realmente documentadas. Não afirme que uma despesa foi aprovada ou revele reembolsos de outro funcionário. Uma reivindicação incomum precisa do revisor autorizado.

## Adicione feedback que leve a uma correção

Forneça um botão de feedback visível com opções como “útil”, “desatualizado”, “fonte errada” e “ainda preciso de pessoa”. Deixe os funcionários explicarem o problema, mas desencoraje detalhes pessoais desnecessários. O feedback deve entrar em um processo de revisão com um responsável; coletá‑lo sem agir sobre ele só cria outra caixa de entrada desatendida.

Revise a pergunta original, as fontes permitidas e a resposta em conjunto. O documento estava ausente, era difícil de recuperar ou foi mal interpretado? Corrija a camada correta e adicione o caso falho ao conjunto de testes. Não publique automaticamente a correção sugerida por um funcionário como política.

## Meça a resolução em vez do silêncio

**Desvio** é a proporção de perguntas elegíveis resolvidas sem intervenção humana. Defina o conjunto elegível e a janela de observação antes de reportar. Exclua casos privados que devem ir diretamente a uma pessoa e não conte uma conversa abandonada como sucesso apenas porque nenhum ticket foi aberto.

Combine uma resposta voluntária “Isso resolveu sua pergunta?” com revisões de respostas amostradas e análise de contato repetido onde permitido. Acompanhe a precisão das citações, tempo até a resposta útil, transferências adequadas e resultados de testes de controle de acesso. Relate incerteza quando o feedback for escasso; usuários satisfeitos e frustrados podem responder em taxas diferentes.

Teste perguntas interdepartamentais com várias funções fictícias, identidade ausente, permissões expiradas, políticas desatualizadas e fontes contraditórias. Uma falha de privacidade é motivo para parar e investigar, não um pequeno erro a ser incluído em uma pontuação alta de satisfação. Expanda a estante de referência somente quando seus proprietários e regras de acesso estiverem prontos.

Próximo passo: compare esses padrões entre setores em [Common use cases by industry](https://docs.aivax.net/pt-br/learn/guides/use-cases-by-industry.md).

**Verifique seu conhecimento.** Como um assistente interno deve proteger o conhecimento restrito ao departamento?

1. Buscar em todo o departamento e pedir ao modelo que otre os trechos restritos
2. Aplicar regras de acesso confiáveis antes da recuperação e fornecer apenas evidência autorizada
3. Deixar o funcionário digitar o departamento que deseja acessar

Answer: option 2. O acesso deve ser imposto antes que informações restritas cheguem ao modelo; um prompt ou departamento auto‑declarado não estabelece permissão.
