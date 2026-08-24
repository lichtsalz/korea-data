#!/usr/bin/env node
/**
 * korea-data-mcp — 호스팅된 /korea/mcp 를 stdio 로 감싸는 얇은 래퍼.
 *
 * 원격 MCP 를 직접 지원하지 않는 클라이언트를 위해 존재한다.
 * 레지스트리 등재 경로이기도 하다 — 검색 색인과 무관한 유통 채널이다.
 *
 *   { "mcpServers": { "korea-data": {
 *       "command": "npx", "args": ["-y", "korea-data-mcp"],
 *       "env": { "KCID_API_KEY": "kcid_..." } } } }
 */
import { createInterface } from "node:readline";

const ENDPOINT = process.env.KCID_MCP_URL || "https://notonlystock.com/korea/mcp";
const KEY = process.env.KCID_API_KEY;

if (!KEY) {
  process.stderr.write(
    "korea-data-mcp: set KCID_API_KEY. Get a key at https://notonlystock.com/korea/account\n",
  );
  process.exit(1);
}

const send = (o) => process.stdout.write(JSON.stringify(o) + "\n");

createInterface({ input: process.stdin }).on("line", async (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }
  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
      body: line,
    });
    const text = await r.text();
    try {
      send(JSON.parse(text));
    } catch {
      send({ jsonrpc: "2.0", id: msg.id ?? null,
             error: { code: -32603, message: text.slice(0, 300) } });
    }
  } catch (e) {
    send({ jsonrpc: "2.0", id: msg.id ?? null,
           error: { code: -32603, message: e.message } });
  }
});
