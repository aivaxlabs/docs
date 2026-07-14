# Visão geral

AIVAX é uma plataforma de orquestração de IA para servir assistentes de IA através de uma única conta, superfície de API e carteira de faturamento. Combina inferência compatível com OpenAI, gateways de IA, coleções RAG, ferramentas, habilidades, clientes de chat, workers e processamento em lote.

A maioria das integrações de aplicativos começa com um **Gateway de IA**. Um gateway escolhe o modelo, instruções do sistema, coleções RAG, ferramentas, comportamento de saída estruturada, configurações de moderação, workers e comportamento do canal de chat usados para uma solicitação.

## Serviços principais

### Inferência compatível com OpenAI

AIVAX expõe listagem de modelos compatível com OpenAI e endpoints de conclusão de chat. Você pode chamar modelos hospedados da AIVAX diretamente ou chamar um Gateway de IA pelo seu identificador de modelo.

A URL base de produção principal é:

```text
https://inference.aivax.net
```

Use `/v1` como caminho base do SDK OpenAI:

```text
https://inference.aivax.net/v1
```

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Gateways de IA

Um Gateway de IA é o runtime configurado para um assistente. No modelo fonte ele armazena:

- Seleção de provedor ou modelo integrado.
- Instrução do sistema e modelos de prompt opcionais.
- Links de coleções RAG e estratégia de consulta.
- Ferramentas integradas, funções de protocolo, fontes MCP e opções Bash.
- Configurações de esquema JSON e JSON Healing.
- Fonte do script do worker e configurações de moderação.
- Limites de contexto, comportamento de truncamento, esforço de raciocínio, verbosidade e configurações de roteamento.

Slugs de gateway são convenientes para chaves privadas. Compleções de chat com chave pública devem usar o UUID completo do gateway e não podem chamar modelos integrados diretamente.

### Coleções RAG

Coleções armazenam documentos que são indexados com embeddings e pesquisados durante a inferência ou através de endpoints de coleção. Limites do plano controlam a contagem de coleções, taxa de pesquisa, taxa de inserção e tamanho de importação JSONL.

AIVAX também expõe coleções como ferramentas MCP através de `/v1/mcp/collections`. O endpoint MCP de coleção lê a configuração dos cabeçalhos, como IDs de coleção, nome da ferramenta, top-k, pontuação mínima, reranker e se ferramentas de escrita são permitidas.

### Ferramentas

Gateways podem habilitar ferramentas que permitem ao modelo chamar serviços da plataforma ou sistemas externos. Funções integradas cobrem busca na web, busca avançada na web, busca no X/Twitter, geração de imagens, geração de documentos ou páginas, execução de código, memória, calendário e ativações agendadas.

Chaves privadas podem usar a configuração completa da ferramenta do gateway. Chamadas de conclusão de chat com chave pública removem superfícies de ferramentas do lado do servidor, como fontes MCP, funções de protocolo, ferramentas integradas, Bash, habilidades e opções de sentinela.

### Habilidades

Habilidades são pacotes de instruções reutilizáveis anexados a um gateway. Elas são carregadas no contexto do modelo quando selecionadas pelo assistente e podem restringir ou expor o comportamento da ferramenta.

### Saída estruturada

AIVAX suporta dois caminhos de saída estruturada:

- `response_schema`: AIVAX valida o JSON gerado contra o esquema e habilita JSON Healing.
- `response_format` com `json_schema`: caminho de esquema compatível com provedor; AIVAX também pode aplicar JSON Healing quando as configurações da conta permitirem.

Use `json_only` somente quando o chamador espera o JSON bruto gerado em vez do envelope normal de conclusão de chat.

### Clientes de chat e integrações

Clientes de chat conectam um gateway a usuários finais através de sessões públicas de web-chat ou integrações para Telegram, Z-API WhatsApp, Evolution API e Kapso. Clientes de chat têm seus próprios limites por sessão e por hora, além de verificações de saldo da conta.

### Workers e hooks

Workers são hooks de propriedade da conta que podem interromper ou modificar eventos do gateway. Solicitações da AIVAX ao seu serviço podem incluir `X-Request-Nonce`, um hash BCrypt derivado da chave do hook da conta. Valide-o antes de confiar na solicitação.

### Processamento em lote

Fluxos de trabalho em lote processam itens independentes de forma assíncrona com uma instrução de fluxo, modelo, esquema e ferramentas opcionais. O plano controla quantos itens de fluxo em lote podem ser processados por dia.

## Como as solicitações são verificadas

Solicitações de API autenticadas passam pelo middleware de chave de conta. O middleware resolve a conta e a chave, armazena ambas no contexto da solicitação e adiciona cabeçalhos da conta à resposta. Endpoints que gastam dinheiro ou requerem armazenamento também verificam saldo e cota de armazenamento antes de continuar.

Para conclusões de chat, o runtime então verifica:

1. Se o modelo selecionado está disponível no plano da conta.
2. Limites de taxa de solicitação de modelo integrado e token de entrada, ou limites de solicitação BYOK.
3. O limite de contexto do plano Free.
4. Requisitos de ferramenta e modalidade.
5. Requisitos de saldo e armazenamento, incluindo verificações de saldo mínimo adicionais para entradas de imagem/áudio/arquivo/vídeo.

## Próximos passos

- [Começando](getting-started.md)
- [Autenticação](authentication.md)
- [Precificação](pricing.md)
- [Planos e limites](limits.md)