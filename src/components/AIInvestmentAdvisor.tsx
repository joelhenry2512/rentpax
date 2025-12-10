'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvestmentRecommendation {
  score: number;
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

interface PropertyData {
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

interface AIInvestmentAdvisorProps {
  propertyData: PropertyData;
}

export default function AIInvestmentAdvisor({ propertyData }: AIInvestmentAdvisorProps) {
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/ai/investment-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setRecommendation(data);
      toast.success('AI analysis complete!');
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get AI recommendation');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('Strong Buy')) return 'text-green-700';
    if (rec.includes('Buy')) return 'text-blue-700';
    if (rec === 'Hold') return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <section className="card mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Investment Advisor</h2>
            <p className="text-sm text-gray-600">Powered by Google Gemini</p>
          </div>
        </div>

        {!recommendation && (
          <button
            onClick={getRecommendation}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Get AI Analysis
              </>
            )}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
          <p className="text-gray-600">AI is analyzing this investment opportunity...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      )}

      {/* Recommendation Display */}
      {recommendation && !loading && (
        <div className="space-y-6">
          {/* Score & Recommendation */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Score Card */}
            <div className={`rounded-lg border-2 p-6 ${getScoreColor(recommendation.score)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Investment Score</span>
                <Target size={20} />
              </div>
              <div className="text-4xl font-bold mb-1">
                {recommendation.score.toFixed(1)}/10
              </div>
              <div className={`text-lg font-semibold ${getRecommendationColor(recommendation.recommendation)}`}>
                {recommendation.recommendation}
              </div>
            </div>

            {/* Predicted Returns */}
            <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-gray-700" />
                <span className="text-sm font-medium">Predicted Total Return</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">5 Years:</span>
                  <span className="font-semibold text-green-600">
                    ${recommendation.predictedReturn.year5.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 Years:</span>
                  <span className="font-semibold text-green-600">
                    ${recommendation.predictedReturn.year10.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">30 Years:</span>
                  <span className="font-semibold text-green-700">
                    ${recommendation.predictedReturn.year30.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
            <p className="text-gray-800 leading-relaxed">{recommendation.summary}</p>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="font-semibold text-green-900">Key Strengths</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-green-800">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-600" size={20} />
              <h3 className="font-semibold text-yellow-900">Potential Risks</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-yellow-800">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-blue-600" size={20} />
              <h3 className="font-semibold text-blue-900">Actionable Suggestions</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-blue-800">
                  <span className="text-blue-600 font-bold mt-1">{index + 1}.</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={getRecommendation}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <Sparkles size={16} />
              Refresh Analysis
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!recommendation && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Get AI-Powered Investment Advice</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our AI advisor analyzes this property's financials, market conditions, and investment potential
            to provide personalized recommendations.
          </p>
          <button
            onClick={getRecommendation}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Sparkles size={16} />
            Analyze with AI
          </button>
        </div>
      )}
    </section>
  );
}
