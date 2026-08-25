# Transcrições de Áudio

Use as Transcrições de Áudio para converter fala gravada em texto para pesquisa, revisão, legendas ou automação subsequente. Envie o áudio em um formulário de solicitação suportado e use a transcrição retornada na próxima etapa do seu fluxo de trabalho.

Autentique solicitações com uma chave de API AIVAX. Veja [Authentication](/docs/pt-br/authentication) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar de acordo com a configuração da conta, portanto não codifique rigidamente um catálogo em sua aplicação.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcrever áudio

Forneça áudio que seja acessível ao AIVAX e preserve o contexto linguístico original quando for importante para seu caso de uso. Revise o texto retornado antes de usá-lo em ações visíveis ao usuário ou irreversíveis: gravações com ruído, múltiplos falantes, vocabulário especializado e baixa qualidade do microfone podem afetar a qualidade da transcrição.

A referência incorporada é a fonte da verdade para os formulários de solicitação aceitos, opções e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços, limites e erros

Para disponibilidade atual, preços e limites de conta, consulte [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits). Corrija áudio inválido ou inacessível antes de tentar novamente uma solicitação falhada.