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
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'AI service not configured. Please add GEMINI_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Sanitize numeric values to ensure they're finite numbers
    const sanitizedBody = {
      ...body,
      homeValue: typeof body.homeValue === 'number' && isFinite(body.homeValue) ? body.homeValue : 0,
      rentEstimate: typeof body.rentEstimate === 'number' && isFinite(body.rentEstimate) ? body.rentEstimate : 0,
      downPayment: typeof body.downPayment === 'number' && isFinite(body.downPayment) ? body.downPayment : 0,
      loanAmount: typeof body.loanAmount === 'number' && isFinite(body.loanAmount) ? body.loanAmount : 0,
      monthlyPayment: typeof body.monthlyPayment === 'number' && isFinite(body.monthlyPayment) ? body.monthlyPayment : 0,
      monthlyPITI: typeof body.monthlyPITI === 'number' && isFinite(body.monthlyPITI) ? body.monthlyPITI : 0,
      monthlyCashFlow: typeof body.monthlyCashFlow === 'number' && isFinite(body.monthlyCashFlow) ? body.monthlyCashFlow : 0,
      capRate: typeof body.capRate === 'number' && isFinite(body.capRate) ? body.capRate : 0,
      cashOnCashReturn: typeof body.cashOnCashReturn === 'number' && isFinite(body.cashOnCashReturn) ? body.cashOnCashReturn : 0,
    };
    
    // Validate the data
    const validated = InvestmentAdvisorRequestSchema.parse(sanitizedBody);
    console.log('Validated data:', JSON.stringify(validated, null, 2));

    // Generate AI recommendation
    const recommendation = await generateInvestmentRecommendation(validated as PropertyAnalysisData);

    return NextResponse.json(recommendation, { status: 200 });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle AI service errors
    console.error('AI Investment Advisor error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error stack:', errorStack);
    
    return NextResponse.json(
      {
        error: 'Failed to generate investment recommendation',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
