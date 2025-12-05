/**
 * AI Chat Assistant API Route
 * Provides conversational AI for answering real estate investment questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithAssistant, PropertyAnalysisData } from '@/services/ai';
import { z } from 'zod';

// Request validation schema
const ChatRequestSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  propertyData: z.object({
    address: z.string(),
    homeValue: z.number(),
    rentEstimate: z.number(),
    downPayment: z.number(),
    loanAmount: z.number(),
    monthlyPayment: z.number(),
    monthlyPITI: z.number(),
    monthlyCashFlow: z.number(),
    capRate: z.number(),
    cashOnCashReturn: z.number(),
    appreciationRate: z.number().optional(),
    rentGrowthRate: z.number().optional(),
    propertyType: z.string().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    sqft: z.number().optional(),
  }).optional(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add ANTHROPIC_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = ChatRequestSchema.parse(body);

    // Get AI response
    const response = await chatWithAssistant(
      validated.question,
      validated.propertyData as PropertyAnalysisData | undefined,
      validated.conversationHistory
    );

    return NextResponse.json({ response }, { status: 200 });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle AI service errors
    console.error('AI Chat Assistant error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
