#!/usr/bin/env node
/**
 * korea — 한국 데이터 CLI. 설치 없이 한 줄로 값이 나오는 경험이 곧 마케팅이다.
 *
 *   npx korea-data brn 124-81-29001
 *   npx korea-data search --industry 26 --size 1000+
 *
 * ⚠️ 데이터셋마다 패키지를 내지 않는다. **서브커맨드로 늘린다** —
 *    재무·공시가 붙어도 이름이 틀리지 않아야 한다. 이름은 게시하면 못 바꾼다.
 */
const BASE = process.env.KCID_API || "https://notonlystock.com/korea/api/v0";
const KEY = process.env.KCID_API_KEY || "";

const G = (s) => `\x1b[2m${s}\x1b[0m`;
const B = (s) => `\x1b[1m${s}\x1b[0m`;

async function get(path) {
  const r = await fetch(BASE + path, {
    headers: KEY ? { authorization: `Bearer ${KEY}` } : {},
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = body.error || {};
    if (r.status === 401) {
      console.error(
        `\n  An API key is required.\n` +
        `  Get one at https://notonlystock.com/korea/ and set KCID_API_KEY.\n`,
      );
    } else {
      console.error(`\n  ${e.message || r.statusText}\n`);
    }
    process.exit(1);
  }
  return body;
}

function line(label, value, note) {
  if (value === undefined || value === null || value === "") return;
  console.log(`  ${label.padEnd(14)} ${value}${note ? " " + G(note) : ""}`);
}

async function show(brn) {
  const c = await get(`/companies/${brn}`);
  const romanized = c.name_en_class === "generated" ? "(romanized)" : "";
  console.log("");
  console.log(`  ${B(c.name_en || "—")} ${G(romanized)}`);
  console.log(`  ${G(c.name_ko || "")}`);
  console.log("");
  line("BRN", fmt(c.brn));
  line("Corp. reg. no", c.corporate_registration_no);
  // 한글 원문은 API 가 `business_status` 로 함께 준다. **화면에는 안 찍는다** —
  // 여기는 영문 사용자용이고 `active` 가 그 값을 다 담는다.
  // 한글 상호는 다르다 — 다른 한국 자료를 찾을 때 실제로 쓰이므로 남긴다
  line("Status", c.status);
  line(
    c.established_date_source === "fsc_estb" ? "Established" : "Insured since",
    c.established_date,
  );
  line("Industry", c.ksic_name_en, c.ksic_code ? `KSIC ${c.ksic_code}` : "");
  line("Address", c.address_en);
  line("Employees", c.ei_workers?.toLocaleString(), "Employment Insurance");
  if (c.nps_latest != null) {
    line("", c.nps_latest.toLocaleString(), `National Pension, ${c.nps_period}`);
  }
  // 2026-08-25 `worksite_count`(등록 건수) → `site_count`(주소 수). 사업장이 여럿이면
  // 인원 많은 순으로 몇 곳을 보여준다 — 어디에 사람이 있는지가 이 데이터의 값이다
  if (c.site_count > 1) {
    line("Worksites", c.site_count, "addresses");
    for (const s of (c.sites || []).slice(0, 3)) {
      line("", `${(s.employees ?? 0).toLocaleString().padStart(7)}  ${s.address_en || s.address_ko || ""}`);
    }
    if (c.site_count > 3) line("", `… ${c.site_count - 3} more`);
  }
  line("Phone", c.phone);
  line("Website", c.homepage);
  console.log("");
  console.log(G("  Government records as of the dates shown, not estimates."));
  console.log("");
}

async function search(q) {
  const r = await get(`/search?name=${encodeURIComponent(q)}`);
  if (!r.results?.length) {
    console.log(`\n  No match for "${q}".\n`);
    return;
  }
  console.log("");
  for (const x of r.results) console.log(`  ${fmt(x.brn)}  ${x.name_en}`);
  console.log("");
}

const fmt = (b) => (b && b.length === 10 ? `${b.slice(0, 3)}-${b.slice(3, 5)}-${b.slice(5)}` : b);

/** `--industry 26 --size 1000+` → 질의 문자열. 값 없는 플래그는 무시한다 */
function flags(argv) {
  const out = new URLSearchParams();
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const [k, inline] = argv[i].slice(2).split("=");
    // ⚠️ 값 없는 플래그는 **true** 다. 예전엔 undefined 로 떨어뜨려서
    //    `--count-only` 가 조용히 무시되고 행을 받아 크레딧을 썼다
    const next = argv[i + 1];
    const v = inline ?? (next === undefined || next.startsWith("--") ? "true" : argv[++i]);
    out.set(k, v);
  }
  return out;
}

async function find(argv) {
  const q = flags(argv);
  const free = argv.filter((a) => !a.startsWith("--") && !q.has("name")
                                  && ![...q.values()].includes(a));
  if (!q.has("name") && free.length) q.set("name", free.join(" "));
  if (![...q.keys()].length) throw new Error("Give a name or a filter. See --help.");

  const r = await get(`/search?${q}`);
  if (r.total != null && !r.results) {
    console.log(`\n  ${B(r.total.toLocaleString())} matches\n`);
    return;
  }
  if (!r.results?.length) {
    console.log("\n  No match.\n");
    return;
  }
  console.log("");
  for (const x of r.results) {
    const n = x.ei_workers?.toLocaleString() ?? "";
    console.log(`  ${fmt(x.brn)}  ${(x.name_en || "").slice(0, 42).padEnd(44)}${G(n)}`);
  }
  console.log(G(`\n  ${r.returned} rows · ${r.credits_spent} credits · ${r.credits_remaining} left\n`));
}

async function balance() {
  const r = await get("/me");
  console.log(`\n  ${B(r.credits.toLocaleString())} credits\n`);
}

const HELP = `
  ${B("korea")} — Korean company data, in English

    korea brn 124-81-29001                  one company by registration number
    korea search "samsung electronics"      by name
    korea search --industry 26 --size 1000+ by filter
    korea search --industry 26 --count-only how many match (100 credits)
    korea me                                credit balance

  ${B("Filters")}  --name --brn --industry --region --size --status
            --established-from --established-to --has --limit

  Set ${B("KCID_API_KEY")}. Get a key at https://notonlystock.com/korea/account
  — new accounts start with 5,000 free credits.
`;

const argv = process.argv.slice(2);
const cmd = argv[0];

if (!cmd || cmd === "-h" || cmd === "--help") {
  console.log(HELP);
  process.exit(0);
}

// 하이픈 플래그를 API 이름으로 (--count-only → count_only)
const rest = argv.slice(1).map((a) => (a.startsWith("--") ? a.replace(/-/g, "_").replace("__", "--") : a));

const run =
  cmd === "brn" ? show((argv[1] || "").replace(/\D/g, ""))
  : cmd === "search" ? find(rest)
  : cmd === "me" ? balance()
  // 서브커맨드 없이 숫자만 주면 조회로 받아 준다 — 예전 사용법을 깨뜨리지 않는다
  : /^[\d-]{10,14}$/.test(cmd) ? show(cmd.replace(/\D/g, ""))
  : find(argv);

run.catch((e) => {
  console.error(`\n  ${e.message}\n`);
  process.exit(1);
});
