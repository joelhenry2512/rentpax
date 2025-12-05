/**
 * AI Service Layer using Anthropic Claude API
 * Provides investment analysis and chat assistance
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PropertyAnalysisData {
  address: string;
  homeValue: number;
  rentEstimate: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  monthlyPITI: number;
  monthlyCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  appreciationRate?: number;
  rentGrowthRate?: number;
  propertyType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export interface InvestmentRecommendation {
  score: number; // 1-10
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Pass' | 'Avoid';
  summary: string;
  strengths: string[];
  risks: string[];
  suggestions: string[];
  predictedReturn: {
    year5: number;
    year10: number;
    year30: number;
  };
}

/**
 * Generate AI-powered investment recommendation
 *
 * @param data - Property analysis data
 * @returns Investment recommendation with reasoning
 */
export async function generateInvestmentRecommendation(
  data: PropertyAnalysisData
): Promise<InvestmentRecommendation> {
  const prompt = buildInvestmentAdvisorPrompt(data);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent analysis
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    const recommendation = parseInvestmentRecommendation(content.text, data);
    return recommendation;
  } catch (error) {
    console.error('AI Investment Advisor error:', error);
    throw new Error('Failed to generate investment recommendation');
  }
}

/**
 * AI Chat Assistant for answering investment questions
 *
 * @param question - User's question
 * @param propertyData - Current property context (optional)
 * @param conversationHistory - Previous messages (optional)
 * @returns AI response
 */
export async function chatWithAssistant(
  question: string,
  propertyData?: PropertyAnalysisData,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const systemPrompt = buildChatAssistantSystemPrompt(propertyData);

  try {
    const messages = [
      ...(conversationHistory || []),
      {
        role: 'user' as const,
        content: question,
      },
    ];

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.5, // Slightly higher for conversational tone
      system: systemPrompt,
      messages,
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    return content.text;
  } catch (error) {
    console.error('AI Chat Assistant error:', error);
    throw new Error('Failed to get AI response');
  }
}

/**
 * Build prompt for investment advisor
 */
function buildInvestmentAdvisorPrompt(data: PropertyAnalysisData): string {
  return `You are an expert real estate investment advisor. Analyze this property and provide a detailed investment recommendation.

PROPERTY DETAILS:
Address: ${data.address}
Home Value: $${data.homeValue.toLocaleString()}
Monthly Rent: $${data.rentEstimate.toLocaleString()}
Property Type: ${data.propertyType || 'Single Family'}
Beds/Baths: ${data.beds || 'N/A'} / ${data.baths || 'N/A'}
Square Feet: ${data.sqft ? data.sqft.toLocaleString() : 'N/A'}

FINANCIAL ANALYSIS:
Down Payment: $${data.downPayment.toLocaleString()} (${((data.downPayment / data.homeValue) * 100).toFixed(1)}%)
Loan Amount: $${data.loanAmount.toLocaleString()}
Monthly PITI: $${data.monthlyPITI.toLocaleString()}
Monthly Cash Flow: $${data.monthlyCashFlow.toLocaleString()}
Cap Rate: ${data.capRate.toFixed(2)}%
Cash-on-Cash Return: ${data.cashOnCashReturn.toFixed(2)}%

TASK:
Provide your analysis in the following JSON format:
{
  "score": <number 1-10>,
  "recommendation": "<Strong Buy|Buy|Hold|Pass|Avoid>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "reasoning": "<detailed paragraph explaining your recommendation>"
}

GUIDELINES:
- Score 8-10: Strong Buy (excellent cash flow, cap rate >7%, CoC >10%)
- Score 6-7: Buy (good fundamentals, positive cash flow, cap rate 5-7%)
- Score 4-5: Hold (marginal returns, consider only if strategic)
- Score 2-3: Pass (poor returns, negative cash flow)
- Score 1: Avoid (major red flags)

Consider:
- Cash flow: Positive is essential for rental properties
- Cap rate: 6%+ is good, 8%+ is excellent
- Cash-on-Cash return: 8%+ is target for most investors
- Price-to-rent ratio: Lower is better
- Market conditions and appreciation potential
- Risk factors (vacancy, maintenance, market volatility)

Be specific, actionable, and honest. If it's a bad deal, say so clearly.`;
}

/**
 * Build system prompt for chat assistant
 */
function buildChatAssistantSystemPrompt(propertyData?: PropertyAnalysisData): string {
  let basePrompt = `You are an expert real estate investment advisor and educator. Your role is to:

1. Answer questions about real estate investing clearly and accurately
2. Explain financial concepts in simple terms
3. Provide practical, actionable advice
4. Help users make informed investment decisions
5. Be encouraging but honest about risks

Guidelines:
- Use plain English, avoid excessive jargon
- Provide specific numbers and examples when relevant
- Be conversational but professional
- If you don't know something, say so
- Always consider the user's context and experience level
- Focus on practical, actionable guidance`;

  if (propertyData) {
    basePrompt += `\n\nCURRENT PROPERTY CONTEXT:
You are helping the user analyze this property:
- Address: ${propertyData.address}
- Home Value: $${propertyData.homeValue.toLocaleString()}
- Monthly Rent: $${propertyData.rentEstimate.toLocaleString()}
- Monthly Cash Flow: $${propertyData.monthlyCashFlow.toLocaleString()}
- Cap Rate: ${propertyData.capRate.toFixed(2)}%
- Cash-on-Cash Return: ${propertyData.cashOnCashReturn.toFixed(2)}%

Reference these specifics when answering questions about this property.`;
  }

  return basePrompt;
}

/**
 * Parse AI response into structured recommendation
 */
function parseInvestmentRecommendation(
  aiResponse: string,
  data: PropertyAnalysisData
): InvestmentRecommendation {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = aiResponse;
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    // Calculate predicted returns based on current metrics
    const year5Return = Math.round(
      data.homeValue * 0.15 + // Estimated 15% appreciation over 5 years
      data.monthlyCashFlow * 12 * 5 * 1.1 // Cash flow with 10% growth
    );

    const year10Return = Math.round(
      data.homeValue * 0.35 + // Estimated 35% appreciation over 10 years
      data.monthlyCashFlow * 12 * 10 * 1.2 // Cash flow with 20% cumulative growth
    );

    const year30Return = Math.round(
      data.homeValue * 1.4 + // Estimated 140% appreciation over 30 years (3% annual)
      data.monthlyCashFlow * 12 * 30 * 1.5 // Cash flow with 50% cumulative growth
    );

    return {
      score: parsed.score || 5,
      recommendation: parsed.recommendation || 'Hold',
      summary: parsed.summary || parsed.reasoning || 'Analysis complete.',
      strengths: parsed.strengths || [],
      risks: parsed.risks || [],
      suggestions: parsed.suggestions || [],
      predictedReturn: {
        year5: year5Return,
        year10: year10Return,
        year30: year30Return,
      },
    };
  } catch (error) {
    console.error('Failed to parse AI recommendation:', error);
    console.log('AI Response:', aiResponse);

    // Return fallback recommendation
    return {
      score: 5,
      recommendation: 'Hold',
      summary: 'Analysis completed. Review the financial metrics to make an informed decision.',
      strengths: ['Property has been analyzed'],
      risks: ['Unable to generate detailed AI analysis'],
      suggestions: ['Review cap rate and cash flow metrics', 'Compare with similar properties in the area'],
      predictedReturn: {
        year5: Math.round(data.homeValue * 0.15),
        year10: Math.round(data.homeValue * 0.35),
        year30: Math.round(data.homeValue * 1.4),
      },
    };
  }
}
