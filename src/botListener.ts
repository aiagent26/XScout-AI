import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

let lastUpdateId = 0;

async function poll() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    const data = await res.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;

        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
          const senderName = update.message.from?.first_name || 'User';

          if (text === '/start' || text.toLowerCase() === 'hello') {
            const replyMessage = `Xin chào ${senderName}! 👋\n\nMã xác nhận phân quyền (Telegram UID) của bạn là:\n\n<code>${chatId}</code>\n\nBạn hãy COPY mã số này và Paste vào biểu mẫu đồng bộ trên Giao diện phần mềm XScout nhé! Chúc bạn thu được nhiều lợi nhuận Onchain! 🚀`;
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: replyMessage,
                parse_mode: 'HTML'
              })
            });
            console.log(`✅ Đã gửi trả thông tin UID cho ${senderName} (${chatId})`);
          }
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Lỗi kết nối Telegram Polling:', err);
  }

  // Tiếp tục vòng lặp listener
  setTimeout(poll, 1000);
}

console.log('🤖 Khởi động máy chủ Vệ tinh Telegram Listener (XScout Bot)...');
console.log('Đang chờ người dùng nhắn tin /start để báo cáo UID...');
poll();
