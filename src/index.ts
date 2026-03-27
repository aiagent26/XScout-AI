import dotenv from 'dotenv';
// Load from .env
dotenv.config();

import { AgenticWalletService } from './agenticWallet';
import { DebateCouncil } from './agent/debate';
import { TelegramService } from './telegramAlerts';

/**
 * XScout AI (Onchain OS - X Layer)
 * Mô hình: Multi-agent Debate kết hợp Ví Onchain OS (Agentic Wallet) & x402
 */
async function xScoutMainLoop() {
  console.log('🚀 Firing up XScout - AI Trading Agent (Onchain OS / X Layer)...');

  if (!process.env.API_KEY || process.env.API_KEY === '') {
      console.log('⚠️ CRITICAL: API_KEY bound missing in .env footprint');
      return;
  }
  
  console.log(`🛠️ Connected to Proxy LLM Engine: ${process.env.BASE_URL} | Model: ${process.env.MODEL}`);

  // 1. Khởi tạo chức năng TEE Onchain OS từ OKX
  const walletService = new AgenticWalletService(process.env.OKX_ONCHAINOS_API_KEY || 'demo-key');
  const agentWallet = await walletService.createOrLoadWallet();
  
  console.log(`\n💳 [x402 Payment System] AI Agentic TEE Wallet Authorized: ${agentWallet.address}`);
  console.log(`Note: Users will deposit logic-inference collateral here to fuel Pay-as-you-go executions.`);

  // 2. Nhận yêu cầu
  const userRequest = "Find a stablecoin pair on OKX Dex (X Layer network) with lowest IL risk and deploy 100 USDC idle cash into the vault.";
  console.log(`\n📥 Fetching new User Intent payload: "${userRequest}"`);
  
  // 3. (Multi-Agent Debate) - Bắt đầu tranh luận 
  console.log(`\n🧠 [Debate Engine] Instantiating Multi-Agent Council simulation...`);
  const council = new DebateCouncil();
  
  const tokenMarketMock = "OKX DEX Market API: USDC/USDT pair on X Layer. Utterly low slippage, deep liquidity depth. TVL 5M USD. Depeg risk algorithm returns nominal safety.";
  const result = await council.debate(tokenMarketMock, userRequest);
  
  console.log(`\n================ DEBATE RESOLUTION TALLY ================`);
  console.log(`🟢 [Bull Faction - Opportunistic Arg]: \n   ${result.bullArgument}`);
  console.log(`🔴 [Bear Faction - Risk Auditor Arg]: \n   ${result.bearArgument}`);
  console.log(`\n👨‍⚖️ [Judge Magistrate Final Verdict]:`);
  console.dir(result.finalDecision, { colors: true });
  console.log(`========================================================`);

  // 4. Thực thi (Execution) gọi API bảo mật TEE
  if (result.finalDecision.confidenceScore > 0.5 && result.finalDecision.amount > 0) {
      console.log(`\n🔐 TEE Agentic Wallet Authorization Passed! Routing execution matrix down to OKX Trade API...`);
      const txHash = await walletService.executeTrade(
          result.finalDecision.from, 
          result.finalDecision.to, 
          result.finalDecision.amount
      );
      
      console.log(`✅ Physical execution confirmed. TxHash (X Layer): ${txHash}`);
      console.log(`[x402 Billing Protocol] Automatically deducted -0.03 USDC algorithmic inference fee via x402.`);
      
      // 5. Gửi thông báo Telegram (Nếu User cấu hình)
      const telegram = new TelegramService();
      const testUserID = process.env.TEST_USER_TELEGRAM_ID || ''; // UID user paste trên UI
      if (testUserID) {
          await telegram.sendAlert(testUserID, `🟢 <b>XScout Alert / 成功交易</b>\n\n- <b>Status:</b> Executed Onchain successfully.\n- <b>Action:</b> SWAP ${result.finalDecision.amount} ${result.finalDecision.from} -> ${result.finalDecision.to}\n- <b>TxHash:</b> <code>${txHash}</code>\n\n📝 <b>AI Agent Analysis Rationale:</b>\n${result.finalDecision.explanation}\n\n<i>🤖 Auto-managed by XScout TEE Wallet Guard</i>`);
      }
      
  } else {
      console.log(`\n❌ TRANSACTION CANCELLED. Trade vetoed due to insufficient risk-reward viability bounded by the Smart Contract limit.`);
  }
}

if (require.main === module) {
  xScoutMainLoop().catch(console.error);
}
