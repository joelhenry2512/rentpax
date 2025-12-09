/**
 * AI Investment Advisor API Route
 * Generates personalized investment recommendations using Claude AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateInvestmentRecommendation, PropertyAnalysisData } from '@/services/ai';
import { z } from 'zod';

// Request validation schema
const InvestmentAdvisorRequestSchema = z.object({
  address: z.string().min(5),
  homeValue: z.number().positive(),
  rentEstimate: z.number().positive(),
  downPayment: z.number().positive(),
  loanAmount: z.number().positive(),
  monthlyPayment: z.number().positive(),
  monthlyPITI: z.number().positive(),
  monthlyCashFlow: z.number(),
  capRate: z.number(),
  cashOnCashReturn: z.number(),
  appreciationRate: z.number().optional(),
  rentGrowthRate: z.number().optional(),
  propertyType: z.string().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  sqft: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add OPENAI_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = InvestmentAdvisorRequestSchema.parse(body);

    // Generate AI recommendation
    const recommendation = await generateInvestmentRecommendation(validated as PropertyAnalysisData);

    return NextResponse.json(recommendation, { status: 200 });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle AI service errors
    console.error('AI Investment Advisor error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate investment recommendation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
