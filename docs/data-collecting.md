# Data Collecting

AIVAX offers an optional semantic data collection program for accounts that choose to contribute eligible RAG and Reflex search data to model development. Document indexing and storage are outside this program. Collected records are detached from the originating account before they are written to the training dataset. The setting is disabled by default and must be enabled by an authorized Account Manager.

## What changes when collection is enabled

While the setting is enabled:

- eligible RAG query-embedding usage receives a 10% discount;
- eligible Reflex searches receive a 10% discount;
- RAG reranking remains at its regular price; and
- document indexing, storage, unrelated inference, tools, and other services keep their regular prices.

The discount applies only to eligible operations performed while collection is enabled. Disabling collection removes the discount from future operations.

## Data included

Depending on the operation, AIVAX may collect:

| Operation | Collected data |
| --- | --- |
| RAG semantic search | Query terms, selected reranker, and the contents and relevance scores of returned documents. |
| Reflex | Query, submitted documents, and ranking results. Unknown response metadata and usage or billing information are not included. |

The dataset does not store the account ID, API key, request ID, collection or document IDs, document names, billing data, or collection timestamp. The account is consulted transiently only to verify that collection is enabled and to apply the eligible search discount. Document indexing and stored collections are never copied into the training dataset by this program; document content is included only when it is submitted to Reflex or returned by a RAG search.

Enabling this setting does not by itself include unrelated chat completions, conversations, tool calls, or other account resources in the training dataset.

> [!IMPORTANT]
> Account-level anonymization does not inspect or redact the semantic text supplied by the Account Manager. A query or document can still contain names, contact details, secrets, or other identifying information. Do not submit such information to the program unless its collection and training use are authorized.

## Purpose and use

AIVAX may use collected data to develop, train, fine-tune, evaluate, test, and improve models and systems related to embeddings, retrieval, ranking, reranking, and other semantic processing. This may include preparing datasets, annotating or transforming records, measuring quality, and producing aggregated or derived artifacts.

Access is limited to authorized personnel and service providers that support these purposes under applicable confidentiality and data-protection obligations. AIVAX does not sell collected semantic data or maintain an account-to-record mapping for this dataset.

## Account Manager responsibilities

Before enabling collection, the Account Manager must:

- have authority to accept these conditions for the account;
- have an appropriate legal basis for AIVAX to use the submitted data for the purposes above;
- provide any notices and obtain any permissions or consents required from end users or other data subjects; and
- avoid submitting credentials, secrets, regulated data, or sensitive personal data unless its collection and use are legally permitted and necessary.

## Enabling, disabling, and deletion

The Account Manager can control collection in **Dashboard > My account > Semantic data collection**.

- The setting is disabled by default.
- Enabling it authorizes collection of future eligible RAG and Reflex searches.
- Disabling it stops new collection and ends the discount for future operations.
- Disabling it does not automatically delete records collected while consent was active or reverse training already completed.

Because account identifiers and account-to-record mappings are not stored, AIVAX cannot retrieve or delete training records merely from an account ID. Requests concerning personal data present inside submitted semantic content can be sent to **privacy@aivax.net** or **wm@aivax.net** and must include enough information to locate the content where applicable. Source records are retained only for as long as reasonably necessary for the documented purposes, legal obligations, security, and audit requirements, and may then be deleted or further anonymized. Deletion of source records does not require AIVAX to retrain or destroy models or aggregated artifacts that no longer identify a person, except where required by applicable law.

See the [Privacy Policy](/docs/legal/privacy-policy) and [Terms of Use](/docs/legal/terms-of-service) for the governing legal terms.
