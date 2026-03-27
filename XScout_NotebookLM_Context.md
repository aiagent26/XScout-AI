# XScout AI: The Autonomous Agentic Operating System on X Layer
**Comprehensive Architecture & Security Knowledge Base (For NotebookLM)**

## 1. Executive Summary
XScout AI is a decentralized, autonomous financial intelligence platform built natively on the **X Layer (OKX)** blockchain. It bridges advanced Large Language Models (LLMs) with high-security On-chain execution. By utilizing a "3-Agent Debate" cognitive engine and an un-hackable "Agentic Wallet Guard" Smart Contract, XScout AI allows users to deploy capital autonomously without compromising the security of their private keys.

## 2. The Cognitive Engine: 3-Agent Debate Architecture
To eliminate "AI Hallucinations" (instances where single-agent AI makes irrational or dangerous trading decisions), XScout employs a multi-agent adversarial debate loop off-chain before any transaction is signed:
- **The Bull Agent:** Analyzes live liquidity data and actively searches for optimistic, high-upside trading or staking opportunities.
- **The Bear Agent:** Acts as the strict risk-manager, auditing the Bull's proposal for vulnerabilities such as impermanent loss, liquidity drain, or rug-pull logic.
- **The Judge Agent:** The core decision-maker. It reviews the Bull and Bear arguments and enforces the "Smart Contract Bounds Constraints". It output a strict, verifiable JSON payload indicating `SWAP`, `STAKE`, or `CANCEL` based on acceptable risk parameters.

## 3. Web3 Operations Security (OpSec): The AgenticWalletGuard
The physical execution layer relies on a bespoke Smart Contract deployed on X Layer: `AgenticWalletGuard.sol`. This contract solves the fundamental paradox of Agentic Finance: *How do you let an AI control your money without giving the AI access to steal your money?*

### 3.1. Role-Based Access Control (RBAC) & Key Isolation
The contract separates power into two distinct entities:
1. **The Owner (Cold Wallet):** Holds the supreme `emergencyWithdraw` power. The private key for this wallet never touches the VPS or the internet. It is solely used to deploy the contract and manage the AI role.
2. **The AI Agent (TEE Hot Wallet):** A low-balance wallet running inside a Trusted Execution Environment (TEE) on the VPS. Its private key is exposed to the server to sign transactions, but the Smart Contract **forbids** it from calling any withdrawal functions. It can only call `executeAITrade`.

### 3.2. Disaster Recovery & Key Rotation
If the VPS is hacked and the AI Agent's private key is compromised, the user's funds remain perfectly safe. The contract implements:
- `transferOwnership(address newColdWallet)`: Allows the Owner to migrate the master key to a new hardware wallet.
- `updateAIAgentRole(address newAIAgent)`: Allows the master Owner to instantly revoke a hacked AI Agent's access and assign a new TEE address, neutralizing any malicious actor's ability to trade.

### 3.3. Algorithmic Guardrails (Smart Contract Bounds)
Even if the AI Agent itself goes rogue (or is manipulated), the Smart Contract enforces immutable rules:
- **Velocity Limit (Cooldown):** Instead of a restrictive daily volume cap (which impedes user fiscal freedom), the contract implements a `TRADE_COOLDOWN` (e.g., 1 minute). The AI cannot spam thousands of micro-transactions to drain the user's OKB Gas fees.
- **Protocol Whitelisting:** The contract hardcodes approved DeFi routers (e.g., OKX DEX, Uniswap) and staking protocols (e.g., Aave, Curve). The AI cannot route funds to an unverified or malicious endpoint.
- **Hard Stop Loss (Slippage):** Transactions are instantly reverted by the blockchain if the simulated slippage exceeds a strict 5% boundary.

## 4. Tokenomics & Revenue Flow
The system operates on a sustainable monetization model built directly into the Smart Contract layer:
- **Gas Model:** The AI Agent pays for X Layer execution gas (in OKB). (Future iteration: ERC-4337 Account Abstraction Paymasters for a Gasless user experience).
- **Treasury Fee Collector:** The Smart Contract constructor permanently embeds an `XScout Treasury Address`. Every time the AI successfully executes a profitable swap, the contract intercepts the output, routes 99% to the user's balance, and natively transfers a **1% Performance Fee** directly to the Treasury.

## 5. User Experience (UX)
- **Multi-lingual UI:** A dynamic React 19 Frontend supporting real-time bilingual output (matching the user's input language).
- **Telegram Notification Bridge:** A Web2-to-Web3 notification layer synced via API. The system validates the user's Telegram UID through a polling bot listener and pushes instantaneous, localized trade alerts (e.g., Take Profit / Stop Loss events) directly to their mobile device.

*License: Business Source License (BSL 1.1) - Non-commercial Hackathon educational deployment. Commercial production usage restricted.*
