"use client";
import { useState } from "react";
import { TrendingUp, Calendar, DollarSign, Home as HomeIcon } from "lucide-react";
import ProjectionChart from "./charts/ProjectionChart";
import { calculate30YearProjection, calculateProjectionMetrics } from "@/lib/projections";
import type { ProjectionInputs } from "@/lib/projections";

interface ProjectionsViewProps {
  inputs: ProjectionInputs;
}

export default function ProjectionsView({ inputs }: ProjectionsViewProps) {
  const [appreciationRate, setAppreciationRate] = useState(3);
  const [rentGrowthRate, setRentGrowthRate] = useState(2);

  // Calculate projections with current rates
  const projections = calculate30YearProjection({
    ...inputs,
    appreciationRate: appreciationRate / 100,
    rentGrowthRate: rentGrowthRate / 100
  });

  const metrics = calculateProjectionMetrics(projections, inputs.downPayment);

  return (
    <section className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold">30-Year Investment Projections</h3>
      </div>

      {/* Assumption Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="mb-2 font-medium text-sm">Property Appreciation Rate</div>
          <input
            className="range w-full"
            type="range"
            min="0"
            max="8"
            step="0.5"
            value={appreciationRate}
            onChange={e => setAppreciationRate(Number(e.target.value))}
          />
          <div className="mt-1 text-sm text-gray-600">{appreciationRate.toFixed(1)}% per year</div>
        </div>
        <div>
          <div className="mb-2 font-medium text-sm">Rent Growth Rate</div>
          <input
            className="range w-full"
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={rentGrowthRate}
            onChange={e => setRentGrowthRate(Number(e.target.value))}
          />
          <div className="mt-1 text-sm text-gray-600">{rentGrowthRate.toFixed(1)}% per year</div>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={18} />
            <h4 className="font-semibold text-blue-900">Year 5</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Home Value:</span>
              <span className="font-semibold">${metrics.year5.homeValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equity:</span>
              <span className="font-semibold text-green-600">${metrics.year5.equity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cash Flow:</span>
              <span className="font-semibold">${metrics.year5.totalCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Return:</span>
              <span className="font-bold text-blue-600">${metrics.year5.totalReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-bold text-purple-600">{metrics.year5.roi.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-green-600" size={18} />
            <h4 className="font-semibold text-green-900">Year 10</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Home Value:</span>
              <span className="font-semibold">${metrics.year10.homeValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equity:</span>
              <span className="font-semibold text-green-600">${metrics.year10.equity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cash Flow:</span>
              <span className="font-semibold">${metrics.year10.totalCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Return:</span>
              <span className="font-bold text-green-600">${metrics.year10.totalReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-bold text-purple-600">{metrics.year10.roi.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-purple-600" size={18} />
            <h4 className="font-semibold text-purple-900">Year 30</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Home Value:</span>
              <span className="font-semibold">${metrics.year30.homeValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equity:</span>
              <span className="font-semibold text-green-600">${metrics.year30.equity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cash Flow:</span>
              <span className="font-semibold">${metrics.year30.totalCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Return:</span>
              <span className="font-bold text-purple-600">${metrics.year30.totalReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-bold text-purple-600">{metrics.year30.roi.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="mb-4">
        <h4 className="font-medium mb-3">Growth Over Time</h4>
        <ProjectionChart data={projections} />
      </div>

      {/* Insights */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 text-blue-900">Investment Insights</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Your initial investment of ${inputs.downPayment.toLocaleString()} could grow to ${metrics.year30.totalReturn.toLocaleString()} in 30 years</li>
          <li>• Property equity reaches ${metrics.year10.equity.toLocaleString()} by year 10</li>
          <li>• Cumulative rental income after 30 years: ${metrics.year30.totalCashFlow.toLocaleString()}</li>
          <li>• Loan will be paid off in year {inputs.loanTermYears}, after which cash flow increases significantly</li>
        </ul>
      </div>
    </section>
  );
}
