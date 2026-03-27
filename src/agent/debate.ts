import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export interface DebateCouncilResult {
  bullArgument: string;
  bearArgument: string;
  finalDecision: {
    action: string;
    from: string;
    to: string;
    amount: number;
    confidenceScore: number;
    explanation: string;
  };
}

export class DebateCouncil {
  private aiProvider;
  private modelName: string;

  constructor() {
    this.aiProvider = createOpenAI({
      apiKey: process.env.API_KEY || '',
      baseURL: process.env.BASE_URL || 'https://api.openai.com/v1',
    });
    this.modelName = process.env.MODEL || 'gpt-5.4';
  }

  async debate(tokenPairInfo: string, userRequest: string): Promise<DebateCouncilResult> {
    console.log(`   🐂 [Bull Agent] Đang phân tích rủi ro và tiềm năng trên X Layer (Model: ${this.modelName})...`);
    const { text: bullArgument } = await generateText({
      model: this.aiProvider(this.modelName),
      prompt: `Bạn là XScout Bull Agent. Tìm lý do tích cực để ĐẦU TƯ rủi ro thấp dựa trên dữ liệu thanh khoản: ${tokenPairInfo}.\nYêu cầu của KH: ${userRequest}.\n\nLƯU Ý CỰC KỲ QUAN TRỌNG: Bạn PHẢI trả lời bằng ĐÚNG Ngôn Ngữ mà Khách Hàng (KH) đã sử dụng trong Yêu cầu trên (Nếu KH dùng Tiếng Trung, hãy trả lời bằng Tiếng Trung. Nếu Tiếng Anh, trả lời Tiếng Anh). Trả lời tối đa 3 câu.`
    });

    console.log(`   🐻 [Bear Agent] Đang tìm các rủi ro tiềm ẩn (Impermanent loss, rug pull...).`);
    const { text: bearArgument } = await generateText({
      model: this.aiProvider(this.modelName),
      prompt: `Bạn là XScout Bear Agent. Phản biện lại quyết định đầu tư vào thông tin sau bằng cách chỉ ra những rủi ro: ${tokenPairInfo}.\nYêu cầu của KH: ${userRequest}.\n\nLƯU Ý CỰC KỲ QUAN TRỌNG: Bạn PHẢI trả lời bằng ĐÚNG Ngôn Ngữ mà Khách Hàng (KH) đã sử dụng trong Yêu cầu trên (Ví dụ nếu KH dùng Tiếng Trung, bạn bắt buộc phản biện bằng Tiếng Trung). Trả lời tối đa 3 câu.`
    });

    console.log(`   👨‍⚖️ [Judge Agent] Đang phán quyết định cuối cùng...`);
    const { text: finalDecisionStr } = await generateText({
      model: this.aiProvider(this.modelName),
      system: `Bạn là Judge Agent - Cốt lõi của hệ thống XScout AI trên mạng X Layer. Bạn là người ra Quyết định cuối cùng (Kết án).
Bắt buộc TRẢ VỀ DUY NHẤT một chuỗi JSON hợp lệ theo cấu trúc: 
{ "action": "SWAP" hoặc "STAKE", "from": "...", "to": "...", "amount": Number, "confidenceScore": Float, "explanation": "..." }. 

Luật Thép (Smart Contract Bounds Constraints) - BẮT BUỘC TUÂN THỦ:
1. Whitelist: Chỉ chốt lệnh Swap trên DEX OKX hoặc Stake vào (Aave, Curve). Cấm mọi pool lạ.
2. An Toàn Rút/Chuyển Tiền: Tuyệt đối không sinh lệnh Transfer tiền cho ví ngoài. Laps/Biên lai nội bộ.
3. Kìm kẹp Trượt giá (Slippage): Cảnh báo hoặc bác bỏ (CANCEL) nếu lệnh vi phạm trượt giá > 5% (Bảo vệ SL cứng).
4. Tốc Độ Lệnh (Cooldown): Cấm đề xuất các chiến thuật scalping (đánh nhiều lệnh < 1 phút) vì Hợp đồng Thông minh Tự động khước từ để chống spam Gas. 

Nếu 1 trong 4 lỗi trên xảy ra hoặc yêu cầu phi logic -> Trả về JSON với action = "CANCEL".
Lấy giá trị vốn từ yêu cầu: ${userRequest}. Không in bất kì markdown nào khác ngoài JSON.
LƯU Ý CỰC KỲ QUAN TRỌNG: Thuộc tính "explanation" trong chuỗi JSON PHẢI được viết bằng ĐÚNG ngôn ngữ gốc của Khách hàng (User Request language).`,
      prompt: `Bull Argument:\n${bullArgument}\n\nBear Argument:\n${bearArgument}`
    });

    try {
        const jsonMatch = finalDecisionStr.match(/\{[\s\S]*\}/);
        const finalDecision = jsonMatch ? JSON.parse(jsonMatch[0]) : {
            action: 'PARSE_FAILED', from: 'USDC', to: 'USDT', amount: 0, confidenceScore: 0, explanation: 'Gặp lỗi khi parse JSON từ AI'
        };
        return { bullArgument, bearArgument, finalDecision };
    } catch(e) {
        return {
            bullArgument, bearArgument,
            finalDecision: { action: 'SYS_ERROR', from: 'USDC', to: 'USDC', amount: 0, confidenceScore: 0, explanation: 'Lỗi parse nghiêm trọng' }
        }
    }
  }
}
