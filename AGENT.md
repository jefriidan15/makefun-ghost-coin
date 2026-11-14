# MakeFun Ghost ($GHOST) — agent guide

This repository is the make.fun entry for `makefun-coin-launch-01`, "Race to launch a real coin on Solana".
The coin already exists on chain. This file tells an agent what it is, how it was launched, what `main.ts`
does, and how to run and check the entry. Do not launch another coin: one launch, one entry, one mint.

## 1. The coin

- Name: MakeFun Ghost
- Symbol: GHOST
- Mint: `Ms5TEdZ4LgMrcftkco5XfR6EWU3jt5dghcxVa1DG7pV`
- Create transaction signature:
  `58GmPoBstHJbEfyiu7TSnV3a6qtVa6EJj2HbcfcJ42wmyHRAAzjtYt8HMmkmn83EXL6StdZmzbgsiaH1JPPHh3DF`
- Pump.fun page: https://pump.fun/coin/Ms5TEdZ4LgMrcftkco5XfR6EWU3jt5dghcxVa1DG7pV
- Logo: make.fun's mascot ghost, `mascot.png` in this repo — the press kit's `mark-1024.png`, used
  unmodified. Never redraw, recolour, stretch, rotate or add effects to it.
- Token metadata description: `MakeFun Ghost, the ghost mascot coin. made for make.fun $1000 bounty`.
  It contains the exact sentence the bounty requires: `made for make.fun $1000 bounty`.

The mint and the create signature in `LAUNCH.json` are the entry's hand-in. Nothing else in this repo
decides a place: the house measures the coin's creation time from the chain, earliest first, and the 100
fastest valid launches share $1,000.

## 2. How the launch was done

The coin was created on pump.fun by this agent, from the agent's own Solana wallet, inside the contest
window (opened 2026-11-14 00:30 UTC, deadline 2026-11-15 00:30 UTC):

1. The mascot image was taken from the official press kit at https://make.fun/press (`mark-1024.png`)
   and stored in this repo as `mascot.png`, byte for byte.
2. Token metadata was written to `metadata.json` in this repo (name, symbol, description carrying the
   required sentence, image) and is served from the repo itself over its raw GitHub URL — the metadata
   document is `https://raw.githubusercontent.com/jefriidan15/makefun-ghost-coin/main/metadata.json`
   and its image is `https://raw.githubusercontent.com/jefriidan15/makefun-ghost-coin/main/mascot.png`.
   No separate IPFS pin, no third-party host: this repo is the metadata host.
3. The create transaction was built with pumpportal's trade-local endpoint
   (`POST https://pumpportal.fun/api/trade-local`, action `create`), signed locally with the agent
   wallet keypair plus the fresh mint keypair, simulated first, then sent and confirmed on Solana
   mainnet.
4. The returned mint and create signature were written into `LAUNCH.json` at this repo's root:

       {"mint": "Ms5TEdZ4LgMrcftkco5XfR6EWU3jt5dghcxVa1DG7pV", "create_signature": "58GmPoBstHJbEfyiu7TSnV3a6qtVa6EJj2HbcfcJ42wmyHRAAzjtYt8HMmkmn83EXL6StdZmzbgsiaH1JPPHh3DF"}

   Do not write a time, a price or a market value in it — the house never reads a time from your files.

## 3. What main.ts does

`main.ts` at the repo root is the whole program. It reads `LAUNCH.json` from the repository and copies it
to the output directory (`/output` when the grader runs it, or whatever `MAKEFUN_OUTPUT_DIR` says when
you run it by hand). That is all it does:

- No network access, no wall clock, no files outside the repository.
- No transformation of the file: the bytes out are the bytes in.
- Both runs of an entry must write the same bytes, and they do — a straight copy is deterministic.

## 4. Run it the way the grader does

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

Then confirm the copy is exact:

    diff out/LAUNCH.json LAUNCH.json

No output from `diff` means the output matches. If it differs, fix it before doing anything else.

## 5. Repository rules

- This repo is the entry: public, created after the contest opened, MIT licensed, owned by jefriidan15,
  with `.makefun/owner.json` naming the agent wallet.
- Do not make the repo private, remove the license, or rewrite history so the submitted commit
  disappears.
- At most 5 submissions a day and 10 in all; the last submission before the deadline is the final entry.
- Upload the transcripts of every agent session that built this entry with each submission.

## 6. Verify the coin on-chain

Before trusting anything in this repo, check the coin against the chain and pump.fun:

1. Fetch the create transaction by its signature and confirm it succeeded and created the mint:

       curl -s -X POST https://api.mainnet-beta.solana.com \
         -H 'Content-Type: application/json' \
         -d '{"jsonrpc":"2.0","id":1,"method":"getTransaction","params":["58GmPoBstHJbEfyiu7TSnV3a6qtVa6EJj2HbcfcJ42wmyHRAAzjtYt8HMmkmn83EXL6StdZmzbgsiaH1JPPHh3DF",{"encoding":"jsonParsed","maxSupportedTransactionVersion":0}]}'

   The response must show the mint `Ms5TEdZ4LgMrcftkco5XfR6EWU3jt5dghcxVa1DG7pV` created by this
   transaction, with a block time inside the contest window (2026-11-14 00:30 UTC to 2026-11-15
   00:30 UTC). That block time is the entry's launch time and its place on the leaderboard.
2. Look the coin up on pump.fun and confirm the listing matches this repo:

       curl -s https://frontend-api.pump.fun/coins/Ms5TEdZ4LgMrcftkco5XfR6EWU3jt5dghcxVa1DG7pV

   Name must be `MakeFun Ghost`, symbol `GHOST`, description must carry
   `made for make.fun $1000 bounty`, and the image must be the press kit's ghost.
3. Confirm the metadata document this repo serves is the one the coin points at:

       curl -s https://raw.githubusercontent.com/jefriidan15/makefun-ghost-coin/main/metadata.json

   It must match `metadata.json` in this repo, and its `image` must resolve to `mascot.png`.

If any of the three disagree with `LAUNCH.json`, stop and fix the repo — do not submit a hand-in whose
coin, signature or metadata do not line up.
