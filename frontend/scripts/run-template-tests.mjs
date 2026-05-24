#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const testFile = path.join(root, "tests", "template-resolver.contract.test.ts");

if (!existsSync(testFile)) {
  console.log("[test:templates] Skipped: tests/template-resolver.contract.test.ts not found.");
  process.exit(0);
}

const result = spawnSync(
  "node",
  ["--import", "tsx", "tests/template-resolver.contract.test.ts"],
  { stdio: "inherit" },
);

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
