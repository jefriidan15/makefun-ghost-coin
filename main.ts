// makefun-coin-launch-01 entry: MakeFun Ghost (GHOST).
// The coin itself is launched by the agent on pump.fun; this program only
// hands the launch record to the grader by copying LAUNCH.json to /output.
// Run locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const src = join(BOT_DIR, 'LAUNCH.json');
const raw = readFileSync(src, 'utf8');
// The gate refuses a launch file over 16384 bytes; fail loudly instead of shipping one.
if (raw.length > 16384) {
  console.error(`LAUNCH.json is ${raw.length} bytes, over the 16384 byte gate limit`);
  process.exit(1);
}
const record = JSON.parse(raw) as { mint: string; create_signature: string };

if (typeof record.mint !== 'string' || record.mint.length < 32 || record.mint.length > 44) {
  console.error('LAUNCH.json: mint is not a base58 Solana address');
  process.exit(1);
}
if (typeof record.create_signature !== 'string' || record.create_signature.length < 32) {
  console.error('LAUNCH.json: create_signature is missing or too short');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, join(OUTPUT_DIR, 'LAUNCH.json'));
console.log(`LAUNCH.json copied: mint ${record.mint}`);
