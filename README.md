# Korea Company Data — developer kit

Korean company records in English: identity, registration status, industry, address,
and **month-by-month employment from government payroll records**.

Three ways in, one API key.

| | |
|---|---|
| **[`korea-data`](cli/)** | Command line — `npx korea-data 124-81-00998` |
| **[`korea-data-mcp`](mcp/)** | MCP server for agents |
| **[`openapi.yaml`](openapi.yaml)** | REST API description |

Get a key at **https://notonlystock.com/korea/account** — 5,000 free credits, no card.

## What is in the data

152,367 Korean for-profit corporate headquarters with 10 or more insured employees.

| Field | Present |
|---|---|
| Employees (Employment Insurance) | 100% |
| Address in English | 100% |
| Established date | 100% |
| Monthly employment series | 91.9% |
| Corporate registration number | 70.5% |
| Phone | 69.3% |
| Listed market · DART code | 25.5% |
| Worksite addresses with headcount | 100% (25.5% have more than one) |

Registration numbers are validated against the National Tax Service. Where a value
could be read as more than it is, a companion field says what kind of value it is —
`name_en_class`, `established_date_source`, `nps_quality`. Which source each field
comes from is in the data guide.

[Full data guide →](https://notonlystock.com/korea/data) ·
[API docs →](https://notonlystock.com/korea/api)

## What this does not do

<!-- 아래 줄은 '그런 것을 만들지 않는다' 는 부정문이다 — 어휘 린터 예외 allow-vocab -->
No score, no grade, no ranking, no opinion about any company. No sanctions, penalties
or litigation history. No personal data. **Facts and their sources only.**

## Stability

The API is `v0`. Paths, parameters and field names may change without notice until
`v1`. Pin nothing you cannot change.

MIT licensed.
