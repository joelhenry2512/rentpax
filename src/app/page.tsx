"use client";
import { useEffect, useState } from "react";
import SettingsDrawer from "@/components/SettingsDrawer";
import ScenarioCompare from "@/components/ScenarioCompare";
import CompsSelector from "@/components/CompsSelector";
import AnalysisResults from "@/components/analysis/AnalysisResults";
import { saveProperty } from "@/services/portfolio";

type RentCastComp = {
  id: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  distance: number;
  propertyType: string;
  lastUpdated: string;
};

type AnalyzeResponse = {
  address: string;
  property: {
    avm: number;
    beds?: number; baths?: number; sqft?: number;
    taxAnnual: number;
    hoaMonthly: number;
    insuranceAnnual: number;
    photoUrl?: string;
  };
  rent: { estimate: number; range?: [number, number]; comps?: number; };
  comps?: RentCastComp[];
  finance: {
    PI: number; PITI: number; rentBreakEven: number; cashFlow: number;
    pmiMonthly: number; noi: number; capRate: number; coc: number;
  };
  affordability: { maxPITIByDTI: number; incomeMonthly: number; };
};

export default function Home() {
  const [address, setAddress] = useState("");
  const [income, setIncome] = useState(120000);
  const [rate, setRate] = useState(6.5);
  const [down, setDown] = useState(20);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [vacancy, setVacancy] = useState(5);
  const [maint, setMaint] = useState(8);
  const [mgmt, setMgmt] = useState(8);
  const [selectedComps, setSelectedComps] = useState<string[]>([]);

  async function analyze(customRent?: number) {
    setLoading(true);
    setData(null);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        incomeAnnual: Number(income),
        interestRate: rate / 100,
        downPaymentPercent: down / 100,
        vacancyRate: vacancy/100,
        maintenanceRate: maint/100,
        managementRate: mgmt/100,
        customRent,
        selectedCompIds: selectedComps
      })
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  // save income anonymously demo (replace with authed email on real app)
  async function saveIncome() {
    const email = prompt("Enter your account email to save income:");
    if (!email) return;
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, incomeAnnual: Number(income), otherDebtMonthly: 0 })
    });
    alert("Income saved to profile (demo).");
  }

  // save property to portfolio
  async function saveToPortfolio() {
    if (!data) return;
    
    const email = prompt("Enter your account email to save this property:");
    if (!email) return;

    try {
      await saveProperty({
        email,
        address: data.address,
        homeValue: data.property.avm,
        beds: data.property.beds,
        baths: data.property.baths,
        sqft: data.property.sqft,
        taxAnnual: data.property.taxAnnual,
        hoaMonthly: data.property.hoaMonthly,
        insuranceAnnual: data.property.insuranceAnnual,
        rentEstimate: data.rent.estimate,
        interestRate: rate / 100,
        downPaymentPercent: down / 100,
        vacancyRate: vacancy / 100,
        maintenanceRate: maint / 100,
        managementRate: mgmt / 100,
        piti: data.finance.PITI,
        cashFlow: data.finance.cashFlow,
        capRate: data.finance.capRate,
        coc: data.finance.coc
      });
      alert("Property saved to portfolio!");
    } catch (error: any) {
      alert(`Failed to save property: ${error.message}`);
    }
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find value, rent & cash flow in seconds</h1>
          <p className="text-gray-600">Enter an address and we'll estimate property value, rent, and cash flow. Tweak assumptions as needed.</p>
        </div>
        <a href="/portfolio" className="btn-secondary">
          View Portfolio
        </a>
      </div>
      
      <section className="card mb-6">
        <div className="grid md:grid-cols-5 gap-3 items-center">
          <input className="input md:col-span-3" placeholder="123 Main St, City, ST" value={address} onChange={e=>setAddress(e.target.value)} />
          <input className="input" type="number" placeholder="Income (annual)" value={income} onChange={e=>setIncome(Number(e.target.value))} />
          <button onClick={analyze} className="btn-primary">{loading ? "Analyzing..." : "Analyze My Property"}</button>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          <div className="card">
            <div className="mb-2 font-medium">Interest rate</div>
            <input className="range" type="range" min="3" max="10" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))} />
            <div className="mt-1 text-sm text-gray-600">{rate.toFixed(2)}%</div>
          </div>
          <div className="card">
            <div className="mb-2 font-medium">Down payment</div>
            <input className="range" type="range" min="0" max="50" step="1" value={down} onChange={e=>setDown(Number(e.target.value))} />
            <div className="mt-1 text-sm text-gray-600">{down}%</div>
          </div>
          <SettingsDrawer vacancy={vacancy} maintenance={maint} management={mgmt} onChange={(v)=>{ setVacancy(v.vacancy); setMaint(v.maintenance); setMgmt(v.management); }}/>
        </div>
      </section>

      {data && (
        <>
          <AnalysisResults
            data={data}
            onSaveToPortfolio={saveToPortfolio}
            onSaveIncome={saveIncome}
            vacancy={vacancy}
            maintenance={maint}
            management={mgmt}
          />

          <ScenarioCompare scenarios={[
            { name: "10% + PMI", rate: rate, down: 0.10, piti: data.finance.PITI + 150, cashFlow: data.finance.cashFlow - 150 },
            { name: "20% down", rate: rate, down: 0.20, piti: data.finance.PITI, cashFlow: data.finance.cashFlow },
            { name: "3-2-1 Buydown (Yr1)", rate: Math.max(rate-3, 0), down: down/100, piti: data.finance.PITI - 300, cashFlow: data.finance.cashFlow + 300 }
          ]} />

          {data.comps && data.comps.length > 0 && (
            <CompsSelector
              comps={data.comps}
              selectedComps={selectedComps}
              onSelectionChange={setSelectedComps}
              onCalculateCustomRent={analyze}
            />
          )}
        </>
      )}
    </main>
  );
}
