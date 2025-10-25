export type YearlyProjection = {
  year: number;
  homeValue: number;
  rentMonthly: number;
  rentAnnual: number;
  loanBalance: number;
  equity: number;
  totalCashFlow: number; // cumulative
  annualCashFlow: number; // for this year
  equityPercent: number;
  totalReturn: number; // equity + cumulative cash flow
};

export type ProjectionInputs = {
  homeValue: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  monthlyPI: number;
  monthlyPITI: number;
  rentEstimate: number;
  monthlyCashFlow: number;
  appreciationRate?: number; // default 3%
  rentGrowthRate?: number; // default 2%
};

/**
 * Calculate remaining loan balance using amortization formula
 */
function calculateRemainingBalance(
  originalLoan: number,
  annualRate: number,
  totalYears: number,
  yearsPaid: number
): number {
  if (yearsPaid >= totalYears) return 0;

  const monthlyRate = annualRate / 12;
  const totalMonths = totalYears * 12;
  const monthsPaid = yearsPaid * 12;

  const monthlyPayment = originalLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Remaining balance formula
  const remainingMonths = totalMonths - monthsPaid;
  const remainingBalance = monthlyPayment * (Math.pow(1 + monthlyRate, remainingMonths) - 1) /
                          (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths));

  return Math.max(0, remainingBalance);
}

/**
 * Calculate 30-year projections for property investment
 */
export function calculate30YearProjection(inputs: ProjectionInputs): YearlyProjection[] {
  const {
    homeValue,
    downPayment,
    loanAmount,
    interestRate,
    loanTermYears,
    rentEstimate,
    monthlyCashFlow,
    appreciationRate = 0.03, // 3% default
    rentGrowthRate = 0.02 // 2% default
  } = inputs;

  const projections: YearlyProjection[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= 30; year++) {
    // Calculate property value with appreciation
    const currentHomeValue = homeValue * Math.pow(1 + appreciationRate, year);

    // Calculate rent with growth
    const currentRent = rentEstimate * Math.pow(1 + rentGrowthRate, year);
    const annualRent = currentRent * 12;

    // Calculate remaining loan balance
    const remainingBalance = calculateRemainingBalance(
      loanAmount,
      interestRate,
      loanTermYears,
      year
    );

    // Calculate equity (home value - remaining loan)
    const equity = currentHomeValue - remainingBalance;

    // Calculate cash flow for this year
    // Simplified: assumes expenses grow with rent
    const cashFlowGrowthFactor = Math.pow(1 + rentGrowthRate, year);
    const annualCashFlow = monthlyCashFlow * 12 * cashFlowGrowthFactor;
    cumulativeCashFlow += annualCashFlow;

    // Total return = equity + all cash flow collected
    const totalReturn = equity + cumulativeCashFlow;

    projections.push({
      year,
      homeValue: Math.round(currentHomeValue),
      rentMonthly: Math.round(currentRent),
      rentAnnual: Math.round(annualRent),
      loanBalance: Math.round(remainingBalance),
      equity: Math.round(equity),
      totalCashFlow: Math.round(cumulativeCashFlow),
      annualCashFlow: Math.round(annualCashFlow),
      equityPercent: (equity / currentHomeValue) * 100,
      totalReturn: Math.round(totalReturn)
    });
  }

  return projections;
}

/**
 * Calculate key metrics from projections
 */
export function calculateProjectionMetrics(projections: YearlyProjection[], initialInvestment: number) {
  const year5 = projections[4]; // 5th year (index 4)
  const year10 = projections[9];
  const year30 = projections[29];

  const roi5Year = ((year5.totalReturn - initialInvestment) / initialInvestment) * 100;
  const roi10Year = ((year10.totalReturn - initialInvestment) / initialInvestment) * 100;
  const roi30Year = ((year30.totalReturn - initialInvestment) / initialInvestment) * 100;

  return {
    year5: {
      homeValue: year5.homeValue,
      equity: year5.equity,
      totalCashFlow: year5.totalCashFlow,
      totalReturn: year5.totalReturn,
      roi: roi5Year
    },
    year10: {
      homeValue: year10.homeValue,
      equity: year10.equity,
      totalCashFlow: year10.totalCashFlow,
      totalReturn: year10.totalReturn,
      roi: roi10Year
    },
    year30: {
      homeValue: year30.homeValue,
      equity: year30.equity,
      totalCashFlow: year30.totalCashFlow,
      totalReturn: year30.totalReturn,
      roi: roi30Year
    }
  };
}
