---
{title: Assistente interno de conhecimento,linkTitle: Assistente interno de conhecimento,description: "Crie um assistente para funcionários que encontre políticas aprovadas, respeite o acesso departamental e torne a incerteza visível.",weight: 30,duration: 12,objectives: [Prepare fontes de conhecimento próprias e atuais para perguntas dos funcionários.,Aplique verificações de acesso antes que a informação chegue ao modelo.,Projete respostas com citações úteis e incerteza honesta.,Meça perguntas resolvidas sem ocultar necessidades não atendidas dos funcionários.],sourceHash: 0ac6c1341ba2b70c}
---

Os funcionários costumam saber que uma resposta existe, mas não onde encontrá‑la. A política de férias está em uma pasta, o guia de laptop em outra, e um formulário antigo de despesas ainda aparece na busca. Um assistente interno de conhecimento ajuda os funcionários a navegar por esse material em linguagem comum. Ele deve se comportar como um bibliotecário cuidadoso, não como um colega onisciente.

Imagine uma organização fictícia chamada Cedar Office. Ela quer um ponto de entrada único para perguntas de recursos humanos, tecnologia da informação e finanças. **Human resources**, ou RH, lida com políticas de emprego. **Information technology**, ou TI, gerencia sistemas de trabalho. A primeira versão responde a perguntas de políticas; ela não aprova licenças, redefine contas ou envia despesas.

## Escolha perguntas antes de coletar documentos

Comece entrevistando as pessoas que respondem a perguntas recorrentes. Pergunte o que os funcionários acham confuso, quais respostas variam por localização ou função, e quais questões devem permanecer privadas. “Ajudar os funcionários a encontrar a política de viagem correta” é um objetivo manejável. “Saber tudo sobre a empresa” não é.

{{< cards >}}
{{< card title="Shared guidance" icon="book" >}}
Políticas publicadas para funcionários, instruções do service‑desk e procedimentos de escritório aprovados podem apoiar perguntas gerais quando se aplicam ao funcionário atual.
{{< /card >}}
{{< card title="Restricted guidance" icon="lock" >}}
Procedimentos específicos de departamento requerem uma decisão de acesso antes da recuperação. Um documento ser pesquisável não significa que todo funcionário possa lê‑lo.
{{< /card >}}
{{< card title="Private records" icon="shield" >}}
Casos de pessoal, detalhes médicos, registros individuais de folha de pagamento e arquivos disciplinares não pertencem à coleção piloto geral.
{{< /card >}}
{{< /cards >}}

Um **wiki** é um conjunto de páginas mantidas colaborativamente. Pode conter material útil, mas popularidade não é autoridade. Uma página amplamente vinculada ainda pode estar desatualizada. **Metadata** são rótulos descritivos anexados a um documento, como proprietário, departamento, data de vigência e público permitido. Esses rótulos ajudam a organizar a recuperação; sua precisão também precisa de um proprietário.

## Prepare uma prateleira de referência confiável

{{< steps >}}
{{< step title="Inventory the sources" >}}
Liste políticas candidatas, páginas de wiki e guias de serviço com seus proprietários. Identifique material duplicado, contraditório, rascunho e expirado antes de importá‑lo.
{{< /step >}}
{{< step title="Rewrite the difficult answers" >}}
Dê a cada política um título claro, escopo, data de vigência e procedimento concreto. Mantenha exceções ao lado da regra que qualificam, em vez de em um anexo não relacionado.
{{< /step >}}
{{< step title="Assign access rules" >}}
Marque o público permitido e conecte as verificações de acesso ao sistema de identidade confiável da organização. Não permita que um funcionário conceda a si mesmo acesso digitando o nome de um departamento.
{{< /step >}}
{{< step title="Build answers around evidence" >}}
Recupere apenas trechos permitidos, então responda com o título da fonte e um link que o funcionário possa abrir. Se os trechos não resolverem a pergunta, diga isso.
{{< /step >}}
{{< step title="Review and improve" >}}
Faça um piloto com representantes de cada departamento. Colete feedback, inspecione perguntas não resolvidas e dê aos proprietários de políticas uma tarefa recorrente de revisão.
{{< /step >}}
{{< /steps >}}

Leia [Finding and preparing knowledge](../teaching-agents/finding-and-preparing-knowledge.md) para seleção de fontes e [Writing good documents](../teaching-agents/writing-good-documents.md) para procedimentos claros e autônomos. Material de fonte melhor costuma corrigir uma resposta confusa mais diretamente do que adicionar outra instrução ao agente.

Use um processo de publicação definido. Quando uma política mudar, atualize ou retire a versão pesquisável e verifique se respostas antigas deixam de aparecer. Mantenha um proprietário responsável pela mudança. A data de upload de um documento não é necessariamente a data em que sua regra entrou em vigor.

## Imponha acesso antes que o modelo veja um trecho

**Authentication** verifica quem é o funcionário; **authorisation** verifica o que esse funcionário pode acessar. Ambos são necessários. O aplicativo confiável deve obter a associação a departamentos e funções a partir do sistema de identidade da organização, então restringir a busca antes que seus resultados sejam fornecidos ao modelo.

Não recupere todo documento e apenas instrua o modelo a não mencionar material restrito. Isso coloca informação além da fronteira antes que a decisão seja tomada. Aplique as mesmas regras de acesso a links diretos de documentos, histórico de conversas, respostas em cache e registros de feedback. Um cache é um resultado armazenado reutilizado depois; ele não deve reutilizar uma resposta apenas para finanças para um funcionário não autorizado.

Relacionado: no AIVAX, [collections](../../docs/rag/collections.md) armazenam documentos pesquisáveis e [document filters](../../docs/filters/document-filters.md) restringem buscas suportadas usando metadata ou tags. Filtros ajudam a expressar um escopo, mas um filtro fornecido pelo modelo não é um sistema de autorização. Um aplicativo confiável deve impor a restrição necessária. O caminho RAG de gateway automático documentado não aplica filtros de documento, portanto não assuma que anexar uma coleção de acesso misto torna esse caminho seguro para o departamento.

Se o caminho de recuperação escolhido não puder impor a fronteira necessária, separe os dados ou escolha um caminho controlado adequadamente antes de lançar. Falta de identidade ou informação de permissão deve interromper a recuperação restrita, não ampliá‑la silenciosamente. Revise [Privacy, LGPD, and GDPR](../safety/privacy-lgpd-gdpr.md) ao decidir quais dados de funcionários processar e reter.

## Torne as respostas verificáveis

Uma **citation** identifica a fonte que sustenta uma afirmação. Ela deve levar ao documento ou seção relevante, não apenas à página inicial da empresa. Mencione o escopo quando ele mudar a resposta: “A política de viagem doméstica diz…” é mais seguro que “Todos podem reivindicar…”. Não trate uma citação como decoração; verifique se o trecho citado realmente sustenta a afirmação.

{{< compare >}}
{{< side title="Confident but unsupported" tone="bad" >}}
“Você pode despachar qualquer equipamento de home‑office. Isso provavelmente está coberto pela política geral de despesas.”
{{< /side >}}
{{< side title="Useful uncertainty" tone="good" >}}
“Encontrei a política de despesas de viagem, mas ela não cobre equipamento de home‑office. Não posso confirmar a elegibilidade a partir das orientações disponíveis. A rota de ajuda financeira pode esclarecer.”
{{< /side >}}
{{< /compare >}}

“Não sei” deve vir com um próximo passo útil. Declare o que foi encontrado, o que permanece não resolvido e a equipe responsável. Não revele que um documento restrito existe se sua existência for sensível. Políticas conflitantes também exigem pausa: explique o conflito ao proprietário adequado em vez de inventar um compromisso.

{{< demo name="search" title="Try it: a small fictional employee reference shelf" config=`{"label":"Ask about a policy","placeholder":"equipment or travel","documents":[["Travel expenses","Fictional policy: use the approved travel form and attach the required receipts before submitting for review.",["travel","expenses","receipt"]],["Equipment support","Fictional guide: report broken company equipment through the service desk; do not send passwords in the report.",["equipment","laptop","broken"]],["Leave requests","Fictional guide: consult the policy for your employment location and discuss scheduling with your manager.",["leave","holiday","manager"]]]}` >}}
Esta pequena demonstração mostra correspondência com documentos de exemplo. Ela não implementa autenticação de funcionário, permissões departamentais ou um sistema de busca semântica de produção. Experimente uma pergunta que a prateleira não consegue responder e perceba por que a falta de evidência importa.
{{< /demo >}}

## Adapte a resposta ao departamento

O mesmo padrão de resposta funciona em equipes: identifique a pergunta, verifique o escopo, encontre evidência, explique o procedimento e ofereça a rota de ajuda apropriada. O que muda são as informações permitidas e a consequência de estar errado.

{{< tabs >}}
{{< tab title="HR" >}}
Um funcionário pergunta como solicitar licença. Forneça o procedimento publicado aplicável à sua localização de emprego e explique onde ocorre a aprovação. Não divulgue licenças de colegas ou inferir informações de saúde. Uma disputa pessoal vai para a rota confidencial de RH, não para uma resposta de política geral.
{{< /tab >}}
{{< tab title="IT" >}}
Um funcionário não consegue conectar o laptop de trabalho. Ofereça solução de problemas aprovada que não enfraqueça a segurança. Nunca peça que ele colete senhas ou códigos de recuperação. Se for necessário recuperar acesso, direcione-o ao processo de recuperação verificado em vez de tratar o chat como prova de identidade.
{{< /tab >}}
{{< tab title="Finance" >}}
Um funcionário pergunta se um recibo é obrigatório. Cite a regra de despesa aplicável e identifique exceções que realmente estejam documentadas. Não afirme que uma despesa está aprovada nem revele reembolsos de outro funcionário. Uma reivindicação incomum precisa do revisor autorizado.
{{< /tab >}}
{{< /tabs >}}

## Adicione feedback que leve a uma correção

Forneça um botão de feedback visível com opções como “útil”, “desatualizado”, “fonte errada” e “ainda preciso de uma pessoa”. Deixe os funcionários explicarem o problema, mas desencoraje detalhes pessoais desnecessários. O feedback deve entrar em um processo de revisão com um proprietário; coletá‑lo sem agir só cria outra caixa de entrada desatendida.

Revise a pergunta original, as fontes permitidas e a resposta em conjunto. O documento estava faltando, era difícil de recuperar ou foi mal interpretado? Corrija a camada correta e adicione o caso falhado ao conjunto de testes. Não publique automaticamente a correção sugerida por um funcionário como política.

## Meça a resolução em vez do silêncio

**Deflection** é a proporção de perguntas elegíveis resolvidas sem intervenção humana. Defina o conjunto elegível e a janela de observação antes de relatar. Exclua casos privados que devem ir diretamente a uma pessoa e não conte uma conversa abandonada como sucesso apenas porque nenhum ticket apareceu.

Combine uma resposta voluntária “Isso resolveu sua pergunta?” com revisões de respostas amostradas e análise de contatos repetidos quando permitido. Acompanhe a precisão das citações, tempo até resposta útil, transferências adequadas e resultados de testes de controle de acesso. Relate incerteza quando o feedback for escasso; usuários satisfeitos e frustrados podem responder em taxas diferentes.

Teste perguntas interdepartamentais com várias funções fictícias, identidade ausente, permissões expiradas, políticas desatualizadas e fontes contraditórias. Uma falha de privacidade é motivo para parar e investigar, não um pequeno erro a ser incorporado a uma alta pontuação de satisfação. Expanda a prateleira de referência apenas quando seus proprietários e regras de acesso estiverem prontos.

O que vem a seguir: compare esses padrões entre setores em [Common use cases by industry](use-cases-by-industry.md).

{{< quiz options="Search every department and ask the model to hide restricted passages | Apply trusted access rules before retrieval and provide only authorised evidence | Let the employee type the department they want to access" answer="2" explanation="Access must be enforced before restricted information reaches the model; a prompt or self-declared department does not establish permission." >}}
How should an internal assistant protect department-restricted knowledge?
{{< /quiz >}}
