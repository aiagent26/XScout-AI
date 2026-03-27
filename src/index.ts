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
  console.log('🚀 Khởi chạy XScout - AI Trading Agent (Onchain OS / X Layer)...');

  if (!process.env.API_KEY || process.env.API_KEY === '') {
      console.log('⚠️ Không tìm thấy API_KEY trong file .env');
      return;
  }
  
  console.log(`🛠️ Đã kết nối Proxy LLM: ${process.env.BASE_URL} | Model: ${process.env.MODEL}`);

  // 1. Khởi tạo chức năng TEE Onchain OS từ OKX
  const walletService = new AgenticWalletService(process.env.OKX_ONCHAINOS_API_KEY || 'demo-key');
  const agentWallet = await walletService.createOrLoadWallet();
  
  console.log(`\n💳 [x402 Payment System] Ví Đại diện AI (Agentic Wallet): ${agentWallet.address}`);
  console.log(`Lưu ý: Khách hàng sẽ dùng địa chỉ này để thanh toán Pay-as-you-go.`);

  // 2. Nhận yêu cầu
  const userRequest = "Tìm cặp stablecoin trên OKX Dex mạng X Layer có rủi ro IL thấp nhất và giải ngân 100 USDC nhàn rỗi trong ví bảo vệ hộ tôi.";
  console.log(`\n📥 Nhận Task mới từ User: "${userRequest}"`);
  
  // 3. (Multi-Agent Debate) - Bắt đầu tranh luận 
  console.log(`\n🧠 [Debate Engine] Bắt đầu họp hội đồng Multi-Agent...`);
  const council = new DebateCouncil();
  
  const tokenMarketMock = "OKX DEX Market API: Pair USDC/USDT trên mạng X Layer. Slippage cực thấp, thanh khoản mạnh. TVL 5M USD. Rủi ro Depeg thấp nhưng USDT thi thoảng lệch nhẹ.";
  const result = await council.debate(tokenMarketMock, userRequest);
  
  console.log(`\n================ KẾT QUẢ TRANH LUẬN ================`);
  console.log(`🟢 [Phe Mua - Bull Arg]: \n   ${result.bullArgument}`);
  console.log(`🔴 [Phe Phản Biện - Bear Arg]: \n   ${result.bearArgument}`);
  console.log(`\n👨‍⚖️ [Bản án của Judge]:`);
  console.dir(result.finalDecision, { colors: true });
  console.log(`===================================================`);

  // 4. Thực thi (Execution) gọi API bảo mật TEE
  if (result.finalDecision.confidenceScore > 0.5 && result.finalDecision.amount > 0) {
      console.log(`\n🔐 Agentic Wallet TEE được uỷ quyền thông qua! Định tuyến qua OKX Trade API...`);
      const txHash = await walletService.executeTrade(
          result.finalDecision.from, 
          result.finalDecision.to, 
          result.finalDecision.amount
      );
      
      console.log(`✅ Chốt lệnh thành công. TxHash (X Layer): ${txHash}`);
      console.log(`[x402 Billing] Đã tự động trừ -0.03 USDC phí môi giới AI qua x402 Protocol.`);
      
      // 5. Gửi thông báo Telegram (Nếu User cấu hình)
      const telegram = new TelegramService();
      const testUserID = process.env.TEST_USER_TELEGRAM_ID || ''; // UID user paste trên UI
      if (testUserID) {
          await telegram.sendAlert(testUserID, `🟢 <b>XScout Alert / 成功交易</b>\n\n- <b>Tình trạng:</b> Đã đóng Lệnh Onchain (Executed Onchain).\n- <b>Lệnh (Action):</b> SWAP ${result.finalDecision.amount} ${result.finalDecision.from} -> ${result.finalDecision.to}\n- <b>TxHash:</b> <code>${txHash}</code>\n\n📝 <b>AI Agent Phân Tích (Analysis):</b>\n${result.finalDecision.explanation}\n\n<i>🤖 Auto-managed by XScout TEE Wallet</i>`);
      }
      
  } else {
      console.log(`\n❌ Quyết định HUỶ GIAO DỊCH do đánh giá không khả thi hoặc rủi ro cao.`);
  }
}

if (require.main === module) {
  xScoutMainLoop().catch(console.error);
}
