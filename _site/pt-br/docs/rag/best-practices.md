Source: https://docs.aivax.net/pt-br/docs/rag/best-practices.html

# Melhores Práticas para RAG

Use este guia ao preparar documentos para coleções AIVAX e busca semântica. O pipeline de busca indexa o texto dos documentos como embeddings, armazena os vetores resultantes e, posteriormente, compara as consultas do usuário com esses vetores indexados. A qualidade da busca depende fortemente de quão claro, focado e autocontido cada documento está.

## Tamanho do Documento

Um documento deve representar um pedaço limitado de conhecimento.

Como meta prática, mantenha a maioria dos documentos entre 20 e 700 palavras. Esse intervalo não é uma regra rígida da API, mas geralmente fornece ao modelo de embedding contexto suficiente sem misturar tópicos não relacionados.

O indexador atual também registra avisos para documentos incomumente pequenos ou grandes:

- Documentos com menos de cerca de 10 tokens são aceitos, mas podem ser pequenos demais para serem recuperados de forma confiável.
- Documentos com mais de cerca de 1.562 tokens são aceitos, mas o indexador trunca o texto usado para embedding para cerca de 5.000 caracteres e registra um aviso.

Se um documento for maior que isso, divida‑o antes de indexar. Use parágrafos, seções, cláusulas de política, entradas de FAQ, descrições de produtos ou outras unidades lógicas.

## O que Evitar

- Documentos vazios, minúsculos ou apenas com título.
- PDFs inteiros, capítulos, logs ou manuais como um único documento.
- Vários assuntos não relacionados em um documento.
- Texto que depende de páginas adjacentes para fazer sentido.
- Idiomas misturados dentro do mesmo documento, a menos que o usuário deva buscar dessa forma.
- JSON bruto, código, tabelas ou logs sem uma breve explicação em linguagem natural.
- Pronomes e referências genéricos como “ele”, “este processo” ou “o produto” quando o documento não identifica o assunto.

## O que Fazer

- Dê a cada documento um nome claro e um texto focado.
- Coloque o assunto próximo ao início do documento.
- Use linguagem natural semelhante à forma como os usuários fazem perguntas.
- Repita identificadores importantes, nomes de produtos, nomes de políticas, siglas e termos quando forem relevantes.
- Mantenha um documento focado em um único tópico respondível.
- Use `__tags` para organizar documentos operacionalmente.
- Use `__ref` para agrupar trechos que pertencem à mesma fonte lógica.
- Use `__meta` para dados estruturados que sua aplicação precisa manter, como URL de origem, versão, autor ou data de publicação.

Por exemplo, identifique o veículo e o registro da frota para que o texto faça sentido por si só.

Preferir:

```text
The color of the 2015 Honda Civic registered in fleet record CAR-123 is yellow.
```

Evitar:

```text
The car is yellow.
```

A primeira versão pode ser recuperada e compreendida sem contexto externo.

## Metadados, Tags e Referências

Apenas o texto do documento é incorporado para correspondência semântica. Metadados são retornados com os resultados e podem ser úteis para aplicações, auditorias, links de origem, versionamento ou exibição, mas não devem substituir o texto pesquisável.

Use tags para manutenção e filtragem, não como o único local onde o significado importante aparece. Se um usuário pode buscar por “política de reembolso”, essas palavras devem aparecer no texto do documento, não apenas em uma tag.

Use referências quando vários trechos representam o mesmo item de origem. Quando a expansão de referência está habilitada, um trecho correspondente pode retornar outros documentos que compartilham a mesma referência.

## Dividindo Fontes Maiores

Ao importar PDFs, planilhas, páginas da web ou manuais, inspecione os trechos gerados antes de confiar na coleção. Remova cabeçalhos, rodapés, menus de navegação, tabelas quebradas, textos padrão e isenções irrelevantes quando possível.

Veja [what a vector database leaves to the application](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de escolher um fluxo de ingestão.

Trechos bons geralmente incluem:

- Um título ou cabeçalho de origem.
- O contexto imediato da seção.
- A regra completa, resposta, instrução ou explicação.
- Texto circundante suficiente para responder a uma pergunta sem precisar de páginas vizinhas.

Trechos ruins costumam conter:

- Metade de uma linha de tabela.
- Uma frase que depende da página anterior.
- Várias políticas misturadas em um bloco.
- Texto de layout repetido do arquivo original.

## Qualidade da Consulta

A busca semântica funciona melhor quando documentos e consultas usam linguagem compatível. Se os usuários fizerem perguntas completas, prepare documentos que contenham explicações completas. Se os usuários buscarem por códigos de produto, IDs de política, nomes de plano ou nomes de procedimento, inclua esses identificadores no texto.

Quando os resultados da busca são ruins, verifique o básico primeiro:

- Confirme que os documentos estão indexados.
- Teste a coleção com [Semantic Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) antes de testar através de um AI Gateway.
- Experimente uma pergunta completa em vez de palavras‑chave isoladas.
- Compare a linguagem da consulta com a linguagem do documento.
- Revise se a resposta relevante está dividida em muitos trechos pequenos ou enterrada em um muito grande.

Documentos bem preparados tornam o RAG previsível: o modelo recebe material fonte mais claro, a busca retorna menos correspondências irrelevantes e as respostas se tornam mais fáceis de auditar.
