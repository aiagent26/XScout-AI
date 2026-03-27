import dotenv from 'dotenv';
import './apiServer'; // Tự động bật Cổng Giao Tiếp API Port 3001 để Frontend gọi lệnh
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
            const replyMessage = `Hello ${senderName}! 👋\n\nYour Authorization Identity (Telegram UID) is:\n\n<code>${chatId}</code>\n\nPlease COPY this Unique ID and paste it into the Sync Form on the XScout Web Interface! Happy Onchain Yielding! 🚀`;
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: replyMessage,
                parse_mode: 'HTML'
              })
            });
            console.log(`✅ Push validation logic succeeded. Transmitted UID back to ${senderName} (${chatId})`);
          }
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Warning: Telegram Long-Polling connection dropped:', err);
  }

  // Tiếp tục vòng lặp listener
  setTimeout(poll, 1000);
}

console.log('🤖 Invoking background Telegram Satellite Node (XScout AI Listener)...');
console.log('⏳ Awaiting strict command /start to broadcast Authorization UID payload...');
poll();
