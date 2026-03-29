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

---

## 🚀 Project Roadmap (Vision to Mainnet)

### **Phase 1: Hackathon MVP (Q1 2026 - Current)**
- [x] **Agentic Wallet Guard (V1):** Single-Vault monolithic architecture allowing 100% non-custodial capital delegation via X Layer.
- [x] **3-Agent Cognitive Debate Engine:** Bull, Bear, and Judge Agents simulating Off-chain risk analysis before any On-chain execution.
- [x] **Hybrid x402 Ledger:** Real-time JSON-based Off-chain API accounting for zero-gas deferred inference billing.
- [x] **Telegram Telemetry:** Instantaneous localized alert hooks tracking Slippage bounds and OKX DEX Router approvals.

### **Phase 2: Dual-Tier Intent Architecture & Cryptographic Execution (Q2 2026)**
*(Directly resolving the "Off-chain Database" Trust & On-chain Gas Constraints)*
- [ ] **Dual-Tier Vault Factory (`XScoutRouter.sol`):** A sophisticated threshold balancer. 
  - *Retail Mode (< $1,000)*: Deposits are optimally routed to the Phase 1 Monolithic Single-Vault. The Off-chain Batcher Engine aggregates thousands of retail trade intents into 1 singular On-chain `Swap` transaction, effortlessly socializing gas burn and maximizing individual retail ROI.
  - *Whale / Institutional Mode (> $10,000)*: The Factory automatically executes `create2()`, spinning up a mathematically isolated `PrivateAgenticVault.sol`. The Whale maintains exclusive extraction authority and handles raw CCIP/Gas overhead. 
- [ ] **Proof of AI Intent (EIP-712 Signatures):** Users cryptographically affix an immutable signature to their natural-language Prompts (e.g., *"Farm USDC at 20% APY"*). The Smart Contract natively binds the final `TradeExecuted` node back to the User's core Intent Hash, making every AI financial maneuver 100% verifiable mathematically. 

### **Phase 3: Gasless Abstraction & Zero-Knowledge Verification (Q3 2026)**
- [ ] **Zero-Knowledge Inference Validation (zk-AI):** Cryptographically proving the underlying LLM Neural Weights correctly evaluated the X Layer Market without human-in-the-middle manipulation.
- [ ] **Gasless (ERC-4337) Account Abstraction:** Implementing Native Paymasters, effectively eliminating the $0.002 OKB upfront deposit bridging hassle entirely for subsequent Retail interactions.

### **Phase 4: Regulatory-Compliant Native DAO & SBTs (Q4 2026)**
*(Replacing Private Security ICO mechanics with hardened structural Web3 utility)*
- [ ] **Omni-Chain Aggregate Liquidity Stakes:** Utilizing the Global Omni-chain TVL (Total Value Locked) a user has bridged into XScout Vaults (aggregating Arbitrum, Solana, X Layer, etc., via LayerZero/CCIP messaging) to dynamically represent their Voting Power. This governs Core Protocol upgrades natively without centralized oversight.
- [ ] **Soulbound Tokens (SBTs):** Protocol veterans are algorithmically minted non-transferable NFT certificates mathematically bounding them to the DAO framework in absolute regulatory compliance, entirely bypassing SEC/MiCA friction layers associated with traditional Token Sales.
