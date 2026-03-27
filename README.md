# XScout AI 🤖 (Powered by OKX Onchain OS & X Layer)
An Agentic Wallet Autonomy + x402 Protocol solution for the Web3 Hackathon.

## Core Technology

1. **Intelligence Engine:** Utilizing a **Multi-Agent Debate System (Bull/Bear/Judge)** to analyze the X Layer market in real-time, completely eliminating the risk of AI Hallucinations.
2. **Execution:** 
   - Directly calls the `OKX Trade API` via the Onchain OS, intelligently routing cross-chain transactions with near-zero slippage.
3. **Wallet Management & OpSec:**
   - Abandons dangerous traditional private key management. Implements **Agentic Wallet** technology (powered by a Trusted Execution Environment - TEE). The AI generates its own wallet, protects funds, and signs transactions routed through strict Smart Contract guardrails.
4. **Monetization (x402 Protocol):**
   - Extracts micro-payments natively via the x402 Pay-as-you-go standard for every Yield/Arbitrage analysis requested by the community. Generated revenues are directly deposited into the Onchain Treasury Wallet.

## Project Setup
1. Run `npm install --legacy-peer-deps`
2. Rename `.env.example` to `.env` and configure your API keys.
3. Run `npm run dev` for the Frontend UI.
4. Run `npx ts-node src/botListener.ts` to start the Telegram polling agent (Requires Node.js and TypeScript).

> *"Let machines pay machines. Onchain OS empowers XScout to be a true autonomous corporate entity on the X Layer ecosystem."*
