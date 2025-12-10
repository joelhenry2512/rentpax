/**
 * Diagnostic endpoint to test Gemini API configuration
 * This helps debug API key and connection issues
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
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
          error: 'GEMINI_API_KEY is not set in environment variables',
          instructions: 'Add GEMINI_API_KEY to Vercel environment variables and redeploy',
        },
        { status: 503 }
      );
    }

    // Test the API key with a simple request
    try {
      const gemini = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
      });
      
      const testCompletion = await gemini.chat.completions.create({
        model: 'gemini-1.5-flash',
        messages: [{ role: 'user', content: 'Say "API test successful"' }],
        max_tokens: 10,
      });

      return NextResponse.json({
        ...diagnostics,
        status: 'success',
        geminiResponse: testCompletion.choices[0]?.message?.content || 'No response',
        model: 'gemini-1.5-flash',
        message: 'Gemini API is working correctly!',
      });
    } catch (geminiError: any) {
      return NextResponse.json(
        {
          ...diagnostics,
          status: 'error',
          error: 'Gemini API call failed',
          geminiError: {
            status: geminiError?.status,
            statusText: geminiError?.statusText,
            message: geminiError?.message,
            code: geminiError?.code,
            type: geminiError?.type,
          },
          suggestions: [
            'Verify the API key is correct in Vercel',
            'Check if the API key has access to Gemini models',
            'Verify you have credits/quota in your Google AI Studio account',
            'Check Vercel logs for more details',
            'Get your API key from: https://aistudio.google.com/app/apikey',
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

