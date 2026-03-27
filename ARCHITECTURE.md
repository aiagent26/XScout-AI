# XScout AI - Data Flow & Architecture

Project XScout AI (Model: 3-Agent Debate + Onchain OS + x402 Protocol)
Hackathon Goal: Deploying an Autonomous and Decentralized AI Financial Advisor natively on X Layer.

## 1. OVERALL ARCHITECTURE MODEL (MERMAID)

```mermaid
graph TD
    %% User Interfaces
    subgraph Frontend [XScout Terminal UI]
        U((Sponsor/User)) -->|Input Capital & Stop-Loss| UI[React Vite Interface]
        UI -.->|Billing Status| BWidget[x402 Billing Widget]
        UI -.->|Live Console Log| Term[Multi-Agent Terminal]
    end

    %% Edge & Web3 Entry
    UI -->|Send Prompt| Node[Node.js Backend]

    subgraph Defense [Security Guardrails]
        Node -->|Sanitize Input| Guard1[Prompt Injection Guard]
        JudgeAI -->|Output Validation| Guard2[Whitelist / Smart Contract Bounds]
    end

    %% Decentralized AI Logic
    subgraph AI_Core [The Debate Council]
        Guard1 -->|API Call| LLM_Route{Model Router}
        LLM_Route -->|System Prompt 1| Bull[Bull Agent - Bullish Analysis]
        LLM_Route -->|System Prompt 2| Bear[Bear Agent - Risk & Auditing]
        Bull --> JudgeAI[Judge Agent - Referee & Decision]
        Bear --> JudgeAI
    end

    %% Web3 Onchain OS Connection
    subgraph Onchain_OS [OKX Onchain OS Infrastructure]
        JudgeAI -->|JSON Decision| Safety[Dynamic Safety Guard / Trade API]
        Node -->|Logic Extraction| x402[x402 Protocol - Pay-as-you-go Billing]
        Safety -->|Require Signature| TEE[Agentic Wallet / TEE Hardware]
        TEE -->|Sign Transaction| Intent[Intent Verification]
    end

    %% Execution on Blockchain
    subgraph X_Layer [X Layer Blockchain]
        Intent -->|Tx Broadcast| SC_Account[User's Smart Guard - AgenticWalletGuard.sol]
        SC_Account -->|Slippage & Cooldown Check| DEX_Router[OKX DEX Router]
        DEX_Router -->|Swap via Liquidity| Pools[Liquidity Pools]
        Pools -->|Return Asset| SC_Account
    end

    %% Revenue Flow
    x402 -.->|0.15 USDC| Treasury[XScout Developer Treasury]

    %% Feedback loop
    Pools -.->|Real-time Market Data| Node
```

## 2. SECURITY POLICY & WORKFLOW

1. **Initialization & Connection:**
   - Users utilize the OKX Web3 Wallet to authorize operations or deposit budgets into the Agent's Smart Contract.
   - The Node.js Backend restructures user input enforcing strict role arrays, immediately isolating Prompt Injection risks.

2. **Real-time Ground Truth API:**
   - Before debating, the Backend queries the Onchain OS Market API to inject live TVL, Slippage, and Tax constraints directly into the AI's cognitive memory.

3. **The Debate Council:**
   - The **Bull** analyzes high-yield prospects. The **Bear** attacks those proposals looking for Impermanent Loss, Depegs, or Rugpull vulnerabilities.
   - The **Judge** synthesizes the arguments, assigns a Confidence Score, and structurally compiles a definitive strict JSON payload (SWAP, STAKE, or CANCEL).

4. **Accounting & Execution (x402 & RBAC):**
   - Win or lose, the x402 architecture deducts an inference Micro-payment directly from the sponsor wallet prior to execution.
   - Upon execution, the TEE (Trusted Execution Environment) blindly signs the transaction payload. The `Owner` wallet key remains disconnected and offline.
   - Any slippage anomalies or spam-rate violations are natively caught by the `AgenticWalletGuard` and immediately Reverted on the X Layer network.

5. **Proactive Alerts & Recovery:**
   - The system continuously crawls real-time position statuses and triggers Push Notifications via Telegram Bot specifically mapped to the user API.
   - In case of Server Compromise, the user leverages their disconnected Hardware Wallet to call `updateAIAgentRole` or `emergencyWithdrawal` natively on the Blockchain explorer, fully maintaining Zero-Trust fund sovereignty.
