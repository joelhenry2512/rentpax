import { NextResponse } from "next/server";
import { z } from "zod";
import { calcFinance, calcAffordability } from "@/lib/finance";
import { fetchRentCastWithComps } from "@/services/rentcast";

const Input = z.object({
  address: z.string().min(3),
  incomeAnnual: z.number().positive(),
  interestRate: z.number().min(0.01).max(0.5),
  loanTermYears: z.number().min(1).max(40).default(30),
  downPaymentPercent: z.number().min(0).max(0.9).default(0.20),
  vacancyRate: z.number().min(0).max(0.5).default(0.05),
  maintenanceRate: z.number().min(0).max(0.5).default(0.08),
  managementRate: z.number().min(0).max(0.5).default(0.08),
  otherDebtMonthly: z.number().min(0).default(0),
  includePMI: z.boolean().optional().default(true),
  customRent: z.number().optional(),
  selectedCompIds: z.array(z.string()).optional().default([])
});

async function fetchRentCast(address: string) {
  const key = process.env.RENTCAST_API_KEY;
  if (!key) {
    // Mocked response when key not present
    return {
      property: {
        avm: 512000,
        taxAnnual: 9600,
        hoaMonthly: 40,
        insuranceAnnual: 1500,
        beds: 3, baths: 2, sqft: 1750
      },
      rent: {
        estimate: 2850,
        range: [2600, 3100],
        comps: 12
      }
    };
  }
  // Example endpoints (adjust to your chosen provider's spec)
  const headers = { "Accept": "application/json", "X-Api-Key": key };
  const avmUrl = `https://api.rentcast.io/v1/avm?address=${encodeURIComponent(address)}`;
  const rentUrl = `https://api.rentcast.io/v1/rents/estimate?address=${encodeURIComponent(address)}`;
  const [avmRes, rentRes] = await Promise.all([
    fetch(avmUrl, { headers }),
    fetch(rentUrl, { headers })
  ]);
  if (!avmRes.ok || !rentRes.ok) {
    throw new Error("Upstream provider error");
  }
  const avmData = await avmRes.json();
  const rentData = await rentRes.json();
  return {
    property: {
      avm: avmData?.valuation || avmData?.avm || 500000,
      taxAnnual: avmData?.taxesAnnual || 8000,
      hoaMonthly: avmData?.hoaMonthly || 0,
      insuranceAnnual: 1500,
      beds: avmData?.beds,
      baths: avmData?.baths,
      sqft: avmData?.squareFeet
    },
    rent: {
      estimate: rentData?.rent || rentData?.estimate || 2500,
      range: [rentData?.low || rentData?.rentLow || 2300, rentData?.high || rentData?.rentHigh || 2700],
      comps: rentData?.compsCount || 8
    }
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = Input.parse(body);

    const rc = await fetchRentCastWithComps(input.address);

    // Use custom rent if provided, otherwise use estimate
    const rentToUse = input.customRent || rc.rent.estimate;

    const finance = calcFinance({
      homeValue: rc.property.avm,
      taxAnnual: rc.property.taxAnnual,
      hoaMonthly: rc.property.hoaMonthly,
      insuranceAnnual: rc.property.insuranceAnnual,
      interestRate: input.interestRate,
      loanTermYears: input.loanTermYears,
      downPaymentPercent: input.downPaymentPercent,
      rentEstimate: rentToUse,
      vacancyRate: input.vacancyRate,
      maintenanceRate: input.maintenanceRate,
      managementRate: input.managementRate,
      closingCostRate: 0.03,
      includePMI: input.includePMI
    });

    const aff = calcAffordability({
      incomeAnnual: input.incomeAnnual,
      otherDebtMonthly: input.otherDebtMonthly,
      piti: finance.PITI
    });

    return NextResponse.json({
      address: input.address,
      property: rc.property,
      rent: {
        ...rc.rent,
        estimate: rentToUse
      },
      comps: rc.comps || [],
      finance: {
        PI: finance.PI,
        PITI: finance.PITI,
        rentBreakEven: finance.rentBreakEven,
        cashFlow: finance.cashFlow,
        pmiMonthly: finance.pmiMonthly,
        noi: finance.noi,
        capRate: finance.capRate,
        coc: finance.coc
      },
      affordability: aff
    });
  } catch (e: any) {
    console.error("API Error:", e);
    if (e.name === 'ZodError') {
      return NextResponse.json({ 
        error: "Invalid input data", 
        details: e.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
