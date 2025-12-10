/**
 * AI Service Layer using Google Gemini API
 * Provides investment analysis and chat assistance
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client lazily to ensure API key is available
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

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

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    // Initialize client with current API key
    const genAI = getGeminiClient();
    
    // Use stable Gemini 1.5 Flash model (more reliable than experimental models)
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    console.log(`API Key present: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`API Key starts with: ${process.env.GEMINI_API_KEY?.substring(0, 7) || 'N/A'}`);
    
    // Build the prompt with explicit JSON instruction
    const systemInstruction = 'You are an expert real estate investment advisor with 20+ years of experience analyzing rental properties. Provide detailed, actionable analysis. Always respond with valid JSON only.';
    const jsonPrompt = `${prompt}\n\nIMPORTANT: You must respond with ONLY valid JSON. Do not include any text before or after the JSON.`;
    
    // Track last error across all model attempts
    let lastError: any = null;
    
    // Try models in order with retry logic for rate limits
    for (const modelName of models) {
      console.log(`Trying Gemini API with model: ${modelName}`);
      const maxRetries = 3;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemInstruction,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2000,
            },
          });
          
          const result = await model.generateContent(jsonPrompt);

          const response = result.response;
          const content = response.text();
          
          if (!content) {
            console.error('Gemini returned empty response');
            throw new Error('No response from Gemini API');
          }

          console.log('Gemini response received, parsing...');
          const recommendation = parseInvestmentRecommendation(content, data);
          return recommendation;
        } catch (apiError: any) {
          lastError = apiError;
          
          // Log detailed error for debugging
          console.error(`Gemini API error (attempt ${attempt + 1}):`, {
            message: apiError?.message,
            status: apiError?.status,
            statusCode: apiError?.statusCode,
            code: apiError?.code,
            name: apiError?.name,
            stack: apiError?.stack?.substring(0, 200),
          });
          
          // Handle rate limit (429) with exponential backoff
          const statusCode = apiError?.status || apiError?.statusCode || apiError?.code;
          if (statusCode === 429 && attempt < maxRetries - 1) {
            const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
            console.log(`Rate limit hit (429), retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; // Retry
          }
          
          // If it's not a rate limit or we've exhausted retries, break and try next model
          if (statusCode !== 429) {
            break;
          }
        }
      }
      
      // If we got here and lastError is a 429, it means all retries failed
      const lastStatusCode = lastError?.status || lastError?.statusCode || lastError?.code;
      if (lastStatusCode === 429) {
        console.error(`Model ${modelName} rate limited after ${maxRetries} attempts`);
        continue; // Try next model
      }
      
      // If it's a model not found error, try next model
      if (lastStatusCode === 404 || lastError?.message?.includes('model') || lastError?.message?.includes('not found')) {
        console.log(`Model ${modelName} not available, trying next model...`);
        continue;
      }
      
      // For other errors, log and try next model
      if (lastError) {
        console.error(`Model ${modelName} failed:`, {
          status: lastStatusCode,
          message: lastError?.message,
          code: lastError?.code,
        });
        continue;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('All Gemini models failed');
  } catch (error: any) {
    console.error('Gemini Investment Advisor error:', error);
    
    // Provide more specific error messages
    if (error?.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please wait a moment and try again. Free tier has rate limits.');
    }
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Gemini API rate limit exceeded. Please try again in a few seconds.');
      }
      if (error.message.includes('model')) {
        throw new Error('Gemini model not available. Please check your API access.');
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
    
    throw new Error('Failed to generate investment recommendation: Unknown error');
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

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    // Initialize client with current API key
    const genAI = getGeminiClient();
    
    // Retry logic for rate limits
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.7, // Slightly higher for conversational tone
            maxOutputTokens: 1000,
          },
        });
        
        // Build the full prompt with conversation history
        let fullPrompt = question;
        if (conversationHistory && conversationHistory.length > 0) {
          const historyText = conversationHistory
            .map(msg => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
            .join('\n\n');
          fullPrompt = `Previous conversation:\n${historyText}\n\nUser: ${question}`;
        }
        
        const result = await model.generateContent(fullPrompt);

        const content = result.response.text();
        if (!content) {
          throw new Error('No response from Gemini');
        }

        return content;
      } catch (apiError: any) {
        lastError = apiError;
        
        // Handle rate limit (429) with exponential backoff
        const statusCode = apiError?.status || apiError?.statusCode || apiError?.code;
        if (statusCode === 429 && attempt < maxRetries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`Chat rate limit hit (429), retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Retry
        }
        
        // For non-rate-limit errors, break and throw
        break;
      }
    }
    
    // If we exhausted retries for rate limit
    const lastStatusCode = lastError?.status || lastError?.statusCode || lastError?.code;
    if (lastStatusCode === 429) {
      throw new Error('Gemini API rate limit exceeded. Please wait a moment and try again.');
    }
    
    throw lastError || new Error('Failed to get AI response');
  } catch (error: any) {
    console.error('Gemini Chat Assistant error:', error);
    
    if (error?.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again in a few seconds.');
    }
    
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

SCORING GUIDELINES:
- Score 8-10: Strong Buy (excellent cash flow, cap rate >7%, CoC >10%)
- Score 6-7: Buy (good fundamentals, positive cash flow, cap rate 5-7%)
- Score 4-5: Hold (marginal returns, consider only if strategic)
- Score 2-3: Pass (poor returns, negative cash flow)
- Score 1: Avoid (major red flags)

IMPORTANT CONSIDERATIONS:
- Cash flow: Positive is essential for rental properties
- Cap rate: 6%+ is good, 8%+ is excellent
- Cash-on-Cash return: 8%+ is target for most investors
- Price-to-rent ratio: Lower is better
- Market conditions and appreciation potential
- Risk factors (vacancy, maintenance, market volatility)

Be specific, actionable, and honest. If it's a bad deal, say so clearly. Return ONLY valid JSON.`;
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
    // Parse JSON response
    const parsed = JSON.parse(aiResponse);

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
