# Suporte ao Protocolo de Contexto de Modelo (MCP)

Você pode vincular ferramentas externas do protocolo MCP ao seu [AI Gateway](/docs/pt-br/inference/ai-gateway). O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

AIVAX funciona como um cliente MCP para inferência de gateway: ele se conecta à fonte MCP configurada, lista as ferramentas, converte cada esquema de ferramenta em uma função chamável pelo modelo e chama o servidor MCP remoto quando o modelo seleciona essa ferramenta.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar MCP

Use MCP quando você já tem ferramentas externas que precisam ser descobertas e chamadas pelos modelos de forma padronizada. Um servidor MCP é adequado para catálogos de ferramentas, integrações com sistemas internos, operações com estado, ferramentas compartilhadas entre múltiplos agentes e ambientes onde você deseja manter a lógica fora do AIVAX. AIVAX funciona como um cliente MCP: ele conecta o AI Gateway ao servidor remoto, lê as ferramentas disponíveis e permite que o modelo chame essas ferramentas durante a inferência.

Não use MCP apenas para substituir uma única chamada HTTP simples. Quando você precisa expor uma função isolada com um callback específico e autenticação por nonce, [protocol functions](/docs/pt-br/tools/protocol-functions) são geralmente mais simples. Quando a capacidade já existe no AIVAX, como pesquisa na web, abertura de URL, execução de código ou geração de imagens, [built‑in tools](/docs/pt-br/tools/builtin-tools) são geralmente o caminho mais direto. MCP é melhor quando há um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já fala MCP, ou quando você deseja que o mesmo servidor seja usado por diferentes clientes.

Na produção, trate o servidor MCP como uma API exposta a um agente. As descrições das ferramentas devem ser claras, os esquemas devem ser restritivos e a autenticação deve ser configurada nos cabeçalhos do servidor. O modelo não deve receber ferramentas excessivamente genéricas, como `execute`, `request` ou `search`, sem descrições fortes e parâmetros controlados. Ferramentas ambíguas aumentam chamadas erradas; ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico sobre o que a função faz. Evite nomes que sejam difíceis de adivinhar ou que não indiquem o papel da função, pois o assistente pode ficar confuso e não chamar a função quando apropriado.

Por exemplo, vamos pensar em uma função que consulta um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos a considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres inadequados)

Com o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando o assistente deve chamá‑la. Essa descrição deve incluir os cenários que o assistente deve considerar ao chamá‑la e quando não deve ser chamada, fornecendo alguns exemplos de chamadas únicas e/ou tornando as regras da função explícitas.

### Definindo servidores MCP

Você pode definir seus servidores MCP no gateway através de um array JSON:

```json
[
    {
        "name": "My MCP server",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "sk-pv-12nbo..."
        }
    }
]
```

Seu servidor MCP deve suportar **HTTP Streamable** para funcionar com o AIVAX como fonte de ferramentas do gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. A descoberta de ferramentas é armazenada em cache de acordo com `cacheDuration`; o padrão é 600 segundos.

As chamadas do AIVAX para o servidor MCP remoto enviam informações de metadados adicionais via o campo `_meta` do MCP:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "New York"
        },
        "_meta": {
            "_aiv_nonce": "nonce-hash",
            "_aiv_external_user_id": "custom-user-id",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "conversation-token",
            "_aiv_moment": "2025-09-09T16:58:05",
            "custom_metadata_field_1": "foo",
            "something": "bar"
        }
    }
}
```

A partir dos valores definidos em `_meta`, você tem os parâmetros de metadados de inferência, cliente ou função. Valores prefixados com `_aiv` são reservados para parâmetros do AIVAX. Metadados personalizados do gateway são copiados para o mesmo objeto `_meta`.

Use `_aiv_external_user_id` para aplicar autorização baseada em usuário quando a chamada vem de um cliente de chat ou sessão identificada. Use `_aiv_call_source` para diferenciar chamadas provenientes de API, chat web ou integrações. Use `_aiv_conversation_token` quando o servidor MCP precisar manter correlação com uma conversa específica. Use `_aiv_moment` para decisões dependentes da data local. Quando `_aiv_nonce` está presente, valide-o da mesma forma que `X-Request-Nonce` em hooks reversos, comparando o hash com a chave do hook configurada na conta.

Os resultados das ferramentas podem incluir blocos de conteúdo de texto, imagem e áudio. O texto é adicionado diretamente ao resultado da ferramenta. Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados. Tipos de blocos de conteúdo não suportados são relatados como texto não suportado.

Quando uma ferramenta MCP não aparece para o modelo, verifique se o servidor remoto está acessível, se ele suporta HTTP Streamable, se os cabeçalhos de autenticação estão corretos e se o gateway está realmente configurado com a fonte MCP. Quando a ferramenta aparece mas não é chamada, revise o nome, a descrição e o esquema. Quando ela é chamada com argumentos incorretos, restrinja o JSON Schema e inclua descrições de propriedades. Quando a chamada falha, faça o servidor MCP retornar erros legíveis, pois o modelo precisa entender se deve tentar outro argumento, solicitar informações ao usuário ou encerrar a ação.