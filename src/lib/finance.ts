export type FinanceInputs = {
  homeValue: number;
  taxAnnual: number;
  hoaMonthly: number;
  insuranceAnnual: number;
  interestRate: number; // e.g., 0.065
  loanTermYears: number; // 30
  downPaymentPercent: number; // 0.20
  rentEstimate: number;
  vacancyRate: number; // 0.05
  maintenanceRate: number; // 0.08
  managementRate: number; // 0.08
  closingCostRate?: number; // e.g., 0.03
  includePMI?: boolean; // when DP < 20%
};

export function amortizedPI(loan: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  return loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function calcFinance(i: FinanceInputs) {
  const loan = i.homeValue * (1 - i.downPaymentPercent);
  const PI = amortizedPI(loan, i.interestRate, i.loanTermYears);

  const tax = i.taxAnnual / 12;
  const ins = i.insuranceAnnual / 12;
  const hoa = i.hoaMonthly;

  // Simple PMI model: 0.5% annual of loan if DP < 20%
  const pmiMonthly = (i.includePMI && i.downPaymentPercent < 0.20) ? (loan * 0.005 / 12) : 0;

  const PITI = PI + tax + ins + hoa + pmiMonthly;

  const expRate = i.vacancyRate + i.maintenanceRate + i.managementRate;
  const rentBreakEven = PITI / (1 - expRate);

  const rent = i.rentEstimate;
  const opex = rent * expRate;
  const cashFlow = rent - (PITI + opex);

  // Simple performance metrics
  const noi = rent - opex - (tax + ins + hoa); // NOI excludes debt service
  const capRate = noi * 12 / i.homeValue; // annual NOI / price
  const cashInvested = i.homeValue * i.downPaymentPercent + (i.closingCostRate ?? 0.03) * i.homeValue;
  const coc = (cashFlow * 12) / Math.max(cashInvested, 1);

  return { loan, PI, PITI, rentBreakEven, cashFlow, pmiMonthly, noi, capRate, coc };
}

export function calcAffordability(params: {
  incomeAnnual: number;
  otherDebtMonthly: number;
  piti: number;
  frontEndDTI?: number; // 0.28 default
  backEndDTI?: number; // 0.36 default
}) {
  const front = params.frontEndDTI ?? 0.28;
  const back = params.backEndDTI ?? 0.36;
  const incomeMonthly = params.incomeAnnual / 12;
  const maxHousing = front * incomeMonthly;
  const maxAllDebt = back * incomeMonthly;
  const maxPITIByDTI = Math.min(maxHousing, maxAllDebt - params.otherDebtMonthly);
  return { incomeMonthly, maxPITIByDTI };
}
