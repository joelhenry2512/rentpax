import LabelValue from "./LabelValue";

export type Scenario = {
  name: string;
  piti: number;
  cashFlow: number;
  down: number;
  rate: number;
};

export default function ScenarioCompare({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Scenario Compare</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {scenarios.map((s, i) => (
          <div key={i} className="border border-gray-100 rounded-2xl p-4">
            <div className="font-semibold mb-2">{s.name}</div>
            <div className="grid grid-cols-2 gap-2">
              <LabelValue label="Rate" value={`${s.rate.toFixed(2)}%`} />
              <LabelValue label="Down" value={`${(s.down*100).toFixed(0)}%`} />
              <LabelValue label="PITI" value={`$${s.piti.toFixed(0)}/mo`} />
              <LabelValue label="Cash Flow" value={`$${s.cashFlow.toFixed(0)}/mo`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
