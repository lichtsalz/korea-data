# korea-data

Korean company data from the command line — in English.

```console
$ npx korea-data brn 124-81-00998

  SAMSUNG ELECTRONICS CO,.LTD
  삼성전자(주)

  BRN            124-81-00998
  Corp. reg. no  1301110006246
  Status         active  계속사업자
  Established    1969-01-13
  Industry       Manufacture of video and other visual equipment  KSIC 26519
  Address        129, Samseong-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do
  Employees      160,917  Employment Insurance
                 125,592  National Pension, 2026-07
  Worksites      14
```

Find companies by filter:

```console
$ npx korea-data search --industry 26 --size 1000+ --has listed

  124-81-00998  SAMSUNG ELECTRONICS CO,.LTD       160,917
  126-81-03725  SK hynix Inc.                      40,471
  107-86-14075  LG ELECTRONICS INC.                37,146
```

Count before you pull — **1 credit regardless of how many match**:

```console
$ npx korea-data search --industry 26 --count-only

  3,152 matches
```

## Commands

| | |
|---|---|
| `korea-data brn <number>` | One company by 10-digit registration number |
| `korea-data search [name] [filters]` | Find companies |
| `korea-data me` | Credit balance |

**Filters** — `--name` `--brn` `--industry` `--region` `--size` `--status`
`--established-from` `--established-to` `--has` `--limit` `--count-only`

`--industry` takes a KSIC code by prefix: `26` is the division, `26299` one class.
`--has` takes `pension_series`, `crno`, `contact` or `listed`.
An unknown value is an error naming what is accepted — **a typo never looks like
"no such companies"**.

## Setup

Get a key at **https://notonlystock.com/korea/account** — new accounts start with
50 free credits, no card.

```console
$ export KCID_API_KEY=kcid_...
```

## What the numbers are

| | |
|---|---|
| **Employment Insurance** | Enrolled workers from the workplace master. Annual. |
| **National Pension** | Monthly subscribers. Excludes those aged 60 and over and includes registered directors, so it differs from the insurance figure **by design**. |

Every value is a government record as of the date shown — not an estimate, and not an
assessment of any company. [What is in the data →](https://notonlystock.com/korea/data)

## Cost

1 credit per company, 1 per search row, 1 for a count.
[Pricing →](https://notonlystock.com/korea/pricing)

Also: **MCP server** for agents — [`korea-data-mcp`](https://www.npmjs.com/package/korea-data-mcp)

MIT licensed. The API is `v0` and may change without notice until `v1`.
