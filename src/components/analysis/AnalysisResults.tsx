"use client";
import { TrendingUp, TrendingDown, DollarSign, Home, Calculator } from "lucide-react";
import LabelValue from "@/components/LabelValue";
import ExportButtons from "@/components/ExportButtons";
import CashFlowChart from "@/components/charts/CashFlowChart";
import ROIChart from "@/components/charts/ROIChart";
import ExpenseBreakdown from "@/components/charts/ExpenseBreakdown";
import type { AnalysisData } from "@/services/export";

interface AnalysisResultsProps {
  data: AnalysisData;
  onSaveToPortfolio: () => void;
  onSaveIncome: () => void;
  vacancy: number;
  maintenance: number;
  management: number;
}

export default function AnalysisResults({ 
  data, 
  onSaveToPortfolio, 
  onSaveIncome, 
  vacancy, 
  maintenance, 
  management 
}: AnalysisResultsProps) {
  const cashFlowData = [
    { name: 'Rent Income', amount: data.rent.estimate, color: '#10B981' },
    { name: 'PITI', amount: -data.finance.PITI, color: '#EF4444' },
    { name: 'Vacancy', amount: -(data.rent.estimate * vacancy / 100), color: '#F59E0B' },
    { name: 'Maintenance', amount: -(data.rent.estimate * maintenance / 100), color: '#8B5CF6' },
    { name: 'Management', amount: -(data.rent.estimate * management / 100), color: '#06B6D4' }
  ];

  return (
    <>
      {/* Summary Cards */}
      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Analysis Summary</h2>
            <ExportButtons data={data} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <LabelValue label="Home Value" value={`$${data.property.avm.toLocaleString()}`} />
            <LabelValue label="Rent Estimate" value={`$${data.rent.estimate.toLocaleString()}/mo`} />
            <LabelValue label="PITI" value={`$${data.finance.PITI.toFixed(0)}/mo`} />
            <LabelValue label="Break-even Rent" value={`$${data.finance.rentBreakEven.toFixed(0)}/mo`} />
            <LabelValue 
              label="Cash Flow" 
              value={`$${data.finance.cashFlow.toFixed(0)}/mo`}
              className={data.finance.cashFlow >= 0 ? "text-green-600" : "text-red-600"}
            />
            <LabelValue label="Cap Rate" value={`${(data.finance.capRate*100).toFixed(2)}%`} />
            <LabelValue 
              label="Affordable?" 
              value={data.finance.PITI <= data.affordability.maxPITIByDTI ? 'Yes' : 'No'}
              className={data.finance.PITI <= data.affordability.maxPITIByDTI ? 'text-green-600' : 'text-red-600'}
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Affordability Analysis</h2>
          <div className="space-y-3">
            <LabelValue 
              label="Monthly Income" 
              value={`$${data.affordability.incomeMonthly.toFixed(0)}`} 
              className="text-green-600 font-semibold"
            />
            <LabelValue 
              label="Max PITI by DTI" 
              value={`$${data.affordability.maxPITIByDTI.toFixed(0)}/mo`}
              className="text-blue-600 font-semibold"
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Affordability Status:</div>
              <div className={`font-semibold ${data.finance.PITI <= data.affordability.maxPITIByDTI ? 'text-green-600' : 'text-red-600'}`}>
                {data.finance.PITI <= data.affordability.maxPITIByDTI ? '✅ Affordable' : '❌ Not Affordable'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                PITI: ${data.finance.PITI.toFixed(0)} vs Max: ${data.affordability.maxPITIByDTI.toFixed(0)}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button className="btn-secondary w-full" onClick={onSaveIncome}>
              Save my income
            </button>
            <button className="btn-primary w-full" onClick={onSaveToPortfolio}>
              Save to Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Cash Flow Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold">Monthly Cash Flow</h3>
          </div>
          <CashFlowChart data={cashFlowData} />
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Net Cash Flow:</span>
              <span className={`font-semibold ${data.finance.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${data.finance.cashFlow.toFixed(0)}/month
              </span>
            </div>
          </div>
        </div>

        {/* ROI Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold">Return on Investment</h3>
          </div>
          <ROIChart capRate={data.finance.capRate} coc={data.finance.coc} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(data.finance.capRate * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Cap Rate</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(data.finance.coc * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Cash on Cash</div>
            </div>
          </div>
        </div>
      </section>

      {/* Expense Breakdown */}
      <section className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="text-purple-600" size={20} />
          <h3 className="text-lg font-semibold">Monthly Expense Breakdown</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ExpenseBreakdown
            piti={data.finance.PITI}
            vacancy={vacancy}
            maintenance={maintenance}
            management={management}
            rentEstimate={data.rent.estimate}
          />
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium">PITI</span>
              <span className="font-semibold text-red-600">${data.finance.PITI.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Vacancy ({vacancy}%)</span>
              <span className="font-semibold text-yellow-600">${(data.rent.estimate * vacancy / 100).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium">Maintenance ({maintenance}%)</span>
              <span className="font-semibold text-purple-600">${(data.rent.estimate * maintenance / 100).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
              <span className="text-sm font-medium">Management ({management}%)</span>
              <span className="font-semibold text-cyan-600">${(data.rent.estimate * management / 100).toFixed(0)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Total Expenses</span>
                <span className="font-semibold text-gray-700">
                  ${(data.finance.PITI + (data.rent.estimate * (vacancy + maintenance + management) / 100)).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
