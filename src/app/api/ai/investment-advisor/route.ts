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
    // Don't set to 0 for required positive fields - let validation catch invalid values
    const sanitizedBody = {
      ...body,
      homeValue: typeof body.homeValue === 'number' && isFinite(body.homeValue) ? body.homeValue : (typeof body.homeValue === 'string' ? parseFloat(body.homeValue) : body.homeValue),
      rentEstimate: typeof body.rentEstimate === 'number' && isFinite(body.rentEstimate) ? body.rentEstimate : (typeof body.rentEstimate === 'string' ? parseFloat(body.rentEstimate) : body.rentEstimate),
      downPayment: typeof body.downPayment === 'number' && isFinite(body.downPayment) ? body.downPayment : (typeof body.downPayment === 'string' ? parseFloat(body.downPayment) : body.downPayment),
      loanAmount: typeof body.loanAmount === 'number' && isFinite(body.loanAmount) ? body.loanAmount : (typeof body.loanAmount === 'string' ? parseFloat(body.loanAmount) : body.loanAmount),
      monthlyPayment: typeof body.monthlyPayment === 'number' && isFinite(body.monthlyPayment) ? body.monthlyPayment : (typeof body.monthlyPayment === 'string' ? parseFloat(body.monthlyPayment) : body.monthlyPayment),
      monthlyPITI: typeof body.monthlyPITI === 'number' && isFinite(body.monthlyPITI) ? body.monthlyPITI : (typeof body.monthlyPITI === 'string' ? parseFloat(body.monthlyPITI) : body.monthlyPITI),
      monthlyCashFlow: typeof body.monthlyCashFlow === 'number' && isFinite(body.monthlyCashFlow) ? body.monthlyCashFlow : (typeof body.monthlyCashFlow === 'string' ? parseFloat(body.monthlyCashFlow) : body.monthlyCashFlow),
      capRate: typeof body.capRate === 'number' && isFinite(body.capRate) ? body.capRate : (typeof body.capRate === 'string' ? parseFloat(body.capRate) : body.capRate),
      cashOnCashReturn: typeof body.cashOnCashReturn === 'number' && isFinite(body.cashOnCashReturn) ? body.cashOnCashReturn : (typeof body.cashOnCashReturn === 'string' ? parseFloat(body.cashOnCashReturn) : body.cashOnCashReturn),
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
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
