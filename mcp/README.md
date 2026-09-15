# korea-data-mcp

MCP server for Korean company data — identity, registration status, and
**month-by-month employment from government payroll records**, in English.

```json
{
  "mcpServers": {
    "korea-company": {
      "command": "npx",
      "args": ["-y", "korea-data-mcp"],
      "env": { "KCID_API_KEY": "kcid_..." }
    }
  }
}
```

Get a key at **https://dataservice.notonlystock.com/korea/account** — new accounts start with
5,000 free credits, no card.

## Tools

| Tool | Returns | Credits |
|---|---|---|
| `lookup_korean_company` | Full record by BRN, worksite addresses included | 100 |
| `search_korean_companies` | Records by name, industry, region, size, status | 100 per row |
| `get_employment_history` | 36 months of pension subscribers, hires and separations | 1,000 |
| `convert_korean_address` | Official English form of a Korean street address | 1 |
| `korean_holidays` | Is this date a Korean business day, or list a year's holidays &mdash; English names | 1 |
| `find_korean_rail_stop` | Subway and commuter-rail stations by name, English or Korean | 1 per row |
| `get_rail_departures` | Every scheduled departure from a station, in time order | 1 per row |
| `get_credit_balance` | Balance | 0 |

**Each tool states its own cost**, so an agent can budget before it calls.
Rail times follow the GTFS convention and may exceed 24 hours — a train leaving at 1am
the next service day reads `25:00:00`. Which days a service runs, public holidays included,
is at `GET /transit/calendar`, which is free.
`search_korean_companies` accepts `count_only` to see how many match for 100 credits
before pulling rows, and `limit` (up to 1,000) to cap the bill. A full page returns
`next_cursor`; pass it back as `cursor` to continue — paging costs the same per row.

## Coverage

152,367 Korean for-profit corporate headquarters with 10 or more insured employees.
The monthly employment series exists for 91.9% of them — filter on
`has: "pension_series"` to get only those, or read `employment_series` on any record.

Registration numbers are validated against the National Tax Service, so placeholder
numbers that appear in the source registry are not in here.

[What is in the data →](https://dataservice.notonlystock.com/korea/data)

## What this does not do

<!-- 아래 줄은 '그런 것을 만들지 않는다' 는 부정문이다 — 어휘 린터 예외 allow-vocab -->
No score, no grade, no ranking, no opinion about any company. No sanctions,
penalties or litigation history. No personal data. Facts and their sources only.

MIT licensed. The API is `v0` and may change without notice until `v1`.
