/**
 * Dịch vụ Đẩy Thông Báo Telegram (Push Alerts)
 * Gửi cảnh báo Chốt Lời / Cắt Lỗ hoặc Khớp Lệnh cho User thông qua HTTP thuần,
 * Không cần cài thêm thư viện rườm rà.
 */

export class TelegramService {
    private botToken: string;
  
    constructor() {
      // Lấy Token do BotFather cấp từ file .env
      this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    }
  
    /**
     * Gửi tin nhắn đến một UID cụ thể
     * @param chatId Telegram UID của user (Mà user lấy từ việc chat /start với bot)
     * @param message Nội dung cảnh báo (Hỗ trợ Markdown cơ bản)
     */
    public async sendAlert(chatId: string, message: string): Promise<void> {
      if (!this.botToken || !chatId) {
        console.log('⚠️ Bỏ qua gửi Telegram Alert vì chưa cấu hình cấu hình TELEGRAM_BOT_TOKEN hoặc ChatID.');
        return;
      }
  
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });
  
        const data = await response.json();
        
        if (!data.ok) {
          console.error('❌ Lỗi gửi Telegram:', data.description);
        } else {
          console.log(`✈️ Đã đẩy tin nhắn Alert thành công qua Telegram tới UID [${chatId}]`);
        }
      } catch (error) {
        console.error('❌ Lỗi kết nối API Telegram:', error);
      }
    }
  }
  
