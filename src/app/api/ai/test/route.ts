/**
 * Diagnostic endpoint to test OpenAI API configuration
 * This helps debug API key and connection issues
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const diagnostics = {
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey?.substring(0, 7) || 'N/A',
      timestamp: new Date().toISOString(),
    };

    if (!apiKey) {
      return NextResponse.json(
        {
          ...diagnostics,
          error: 'OPENAI_API_KEY is not set in environment variables',
          instructions: 'Add OPENAI_API_KEY to Vercel environment variables and redeploy',
        },
        { status: 503 }
      );
    }

    // Test the API key with a simple request
    try {
      const openai = new OpenAI({ apiKey });
      
      const testCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say "API test successful"' }],
        max_tokens: 10,
      });

      return NextResponse.json({
        ...diagnostics,
        status: 'success',
        openaiResponse: testCompletion.choices[0]?.message?.content || 'No response',
        model: 'gpt-4o',
        message: 'OpenAI API is working correctly!',
      });
    } catch (openaiError: any) {
      return NextResponse.json(
        {
          ...diagnostics,
          status: 'error',
          error: 'OpenAI API call failed',
          openaiError: {
            status: openaiError?.status,
            statusText: openaiError?.statusText,
            message: openaiError?.message,
            code: openaiError?.code,
            type: openaiError?.type,
          },
          suggestions: [
            'Verify the API key is correct in Vercel',
            'Check if the API key has access to gpt-4o model',
            'Verify you have credits in your OpenAI account',
            'Check Vercel logs for more details',
          ],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Diagnostic endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

