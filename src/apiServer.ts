import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { DebateCouncil } from './agent/debate';
import { AgenticWalletService } from './agenticWallet';
import { TelegramService } from './telegramAlerts';
import { getUserInfo, recordInferenceCost } from './feeAccounting';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔀 PHỤC VỤ TRỰC TIẾP FILE GIAO DIỆN REACT (PRODUCTION BUILDS)
app.use(express.static(path.join(process.cwd(), 'frontend/dist')));

app.get('/api/user-debt/:wallet', (req: any, res: any) => {
    const wallet = req.params.wallet;
    const info = getUserInfo(wallet);
    res.json({ success: true, debt: info ? info.totalUnpaidDebtUsdc : 0 });
});

app.post('/api/trade', async (req: any, res: any) => {
    try {
        const { prompt, wallet } = req.body;
        console.log(`\n[API ENTRY] Received Live Frontend Prompt: ${prompt}`);

        // Ghi Nợ X402 Dữ liệu vào Database Kế Toán (Mức Cước: $0.05 / Lệnh Chat AI)
        if (wallet) {
            recordInferenceCost(wallet, 0.05);
        }

        // 1. Ground Truth Metrics (Tapping Market Live Oracle logic proxy)
        const tokenMarketMock = "OKX DEX API: Current asset analysis context retrieved. Liquidity sufficient.";
        
        // 2. The Debate Simulation (REAL LLM CALL)
        const council = new DebateCouncil();
        const debateResult = await council.debate(tokenMarketMock, prompt);

        // 3. The Execution Sequence
        let txHash = "0x_TX_REJECTED_BY_AI_JUDGE";
        let actionStatus = "Declined Execution Due to Sub-par Viability Score";

        if (debateResult.finalDecision.confidenceScore > 0.5 && debateResult.finalDecision.amount > 0) {
            const walletService = new AgenticWalletService(process.env.OKX_ONCHAINOS_API_KEY || 'demo-key');
            console.log(`🚀 AI Voted FOR Trading Protocol. Initiating Ethers Smart Contract Execution via ${process.env.AI_AGENT_PUBLIC_ADDRESS || "TEE Key"}`);
            
            txHash = await walletService.executeTrade(
                debateResult.finalDecision.from, 
                debateResult.finalDecision.to, 
                debateResult.finalDecision.amount
            );

            actionStatus = "Executed Onchain Successfully";

            // Push to Telegram if configured
            const telegram = new TelegramService();
            const testUserID = process.env.TEST_USER_TELEGRAM_ID || '';
            if (testUserID) {
                await telegram.sendAlert(testUserID, `🟢 <b>XScout Live Execution Alert</b>\n\n- <b>Status:</b> ${actionStatus}\n- <b>Action:</b> SWAP ${debateResult.finalDecision.amount} ${debateResult.finalDecision.from} -> ${debateResult.finalDecision.to}\n- <b>TxHash:</b> <code>${txHash}</code>\n\n📝 <b>AI Agent Rationale:</b>\n${debateResult.finalDecision.explanation}`);
            }
        }

        res.json({
            success: true,
            debate: debateResult,
            txHash: txHash,
            status: actionStatus
        });

    } catch (error: any) {
        console.error("[API CRITICAL FAILURE]:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Chuyển hướng mọi URL 404 về React App Frontend (Bypass hoàn toàn path-to-regexp của Express v5)
app.use((req: any, res: any) => {
    res.sendFile(path.join(process.cwd(), 'frontend/dist/index.html'));
});

// Thay đổi PORT sang 8080 để Cloudflare hỗ trợ Proxy chuẩn HTPPS
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 MAINNET FULL-STACK GATEWAY ONLINE.`);
    console.log(`🌍 Live Server Monitoring & Trade Rest API Listening on: http://0.0.0.0:${PORT}\n`);
});
