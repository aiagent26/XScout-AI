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

---

## 💎 XScout Tokenomics & Revenue Model (Zero-Risk Deferred Fees)

The XScout AI economic flywheel is designed entirely around the **High-Water Mark Performance Matrix**, shielding users from arbitrary Web2 SaaS subscription traps:

1. **Initial Gas Deposit (0.002 OKB):** 
   Upon first connecting the Web3 Wallet, the Smart Contract Vault requires a trivial `0.002 OKB` network bridge. This strictly serves to fund On-Chain L2 base-layer signatures (Mempool Gas) and operates as a baseline Sybil-attack & spam filter against the AI engines.
   
2. **Deferred Inference Debt (x402 Pay-as-you-go):** 
   Every Multi-Agent prompt inference dynamically burns the TEE server CPU. We charge **$0.03 USDC** per executed prompt. However, users are **NOT** billed upfront! Instead, this microscopic fee is added to an Off-Chain "Unpaid Debt Ledger", ensuring $0 risk to the initial trading capital during operations. 
   
3. **Automated Profit Deduction (1% Performance Fee):**
   A trade is singularly classified as *"Profitable"* when the AI Agent closes a position (Swap/Unstake) resulting in a definitively higher USDC valuation relative to entry point. Upon sensing this algorithmic triumph, the Smart Contract Vault surgically skims:
   - **1% Agent Commission (Treasury Growth)** 
   - **Lifetime Unpaid x402 Debt Replenishment (API Recoup)**
   *The AI agent algorithmically swaps this precise deduction natively into the XScout Treasury Module prior to funneling the monolithic net profit back into the user's custody.*
