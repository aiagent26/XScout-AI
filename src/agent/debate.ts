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
    console.log(`   🐂 [Bull Agent] Analyzing opportunities and upside potential on X Layer (Model: ${this.modelName})...`);
    const { text: bullArgument } = await generateText({
      model: this.aiProvider(this.modelName),
      prompt: `You are the XScout Bull Agent. Identify the absolute best bullish scenario for LOW RISK investment based on this liquidity data: ${tokenPairInfo}.\nCustomer Request: ${userRequest}.\n\nCRITICAL DIRECTIVE: You MUST respond in the EXACT Language the Customer utilized in their request (e.g., if they spoke Chinese, answer in Chinese. If English, answer in English). Output maximum 3 sentences.`
    });

    console.log(`   🐻 [Bear Agent] Scrutinizing protocol risks (Impermanent Loss, Depeg, Rug pulls)...`);
    const { text: bearArgument } = await generateText({
      model: this.aiProvider(this.modelName),
      prompt: `You are the XScout Bear Agent. Rebut the bullish investment decision by outlining severe latent risks on: ${tokenPairInfo}.\nCustomer Request: ${userRequest}.\n\nCRITICAL DIRECTIVE: You MUST respond in the EXACT Language the Customer utilized in their request (e.g., if they spoke Chinese, answer in Chinese). Output maximum 3 sentences.`
    });

    console.log(`   👨‍⚖️ [Judge Agent] Reconciling debate arguments for Final Verdict...`);
    const { text: finalDecisionStr } = await generateText({
      model: this.aiProvider(this.modelName),
      system: `You are the Judge Agent - the core consensus engine of the XScout AI system on the X Layer network. You hold the ultimate Execution Authority.
You MUST RETURN one valid JSON string in strictly this format: 
{ "action": "SWAP" or "STAKE" or "CANCEL", "from": "...", "to": "...", "amount": Number, "confidenceScore": Float, "explanation": "..." }. 

Iron-Clad Constraints (Smart Contract Bounds Constraints) - MUST OBEY:
1. Whitelist: Only execute Swap orders on OKX DEX or Stake into Aave/Curve. Ban all unverified pools.
2. Safety Withdrawal: Absolutely NO external Transfer operations. Intrinsic Ledger logic only.
3. Slippage Bounds: Trigger CANCEL if operation breaches the 5% hard stop-loss slippage limit.
4. Velocity Cooldown: Forbid rapid scalping tactics (< 1 minute) due to Smart Contract Gas spam mitigation logic.

If any above constraints are breached or the prompt is illogical -> Return JSON with action = "CANCEL" and confidenceScore = 0.
Extract capital value from Customer userRequest: ${userRequest}. DO NOT return markdown symbols outside the JSON string boundaries.
CRITICAL EXPROPRIATION DANGER: The "explanation" attribute inside the JSON MUST be written in the original native language of the Customer Request.`,
      prompt: `Bull Argument:\n${bullArgument}\n\nBear Argument:\n${bearArgument}`
    });

    try {
        const jsonMatch = finalDecisionStr.match(/\{[\s\S]*\}/);
        const finalDecision = jsonMatch ? JSON.parse(jsonMatch[0]) : {
            action: 'PARSE_FAILED', from: 'USDC', to: 'USDT', amount: 0, confidenceScore: 0, explanation: 'Failed to extract JSON format from AI output'
        };
        return { bullArgument, bearArgument, finalDecision };
    } catch(e) {
        return {
            bullArgument, bearArgument,
            finalDecision: { action: 'SYS_ERROR', from: 'USDC', to: 'USDC', amount: 0, confidenceScore: 0, explanation: 'Critical JSON parse breakdown' }
        }
    }
  }
}
