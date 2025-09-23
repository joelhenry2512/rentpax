"use client";
import { useState } from "react";

export default function SettingsDrawer({
  vacancy=5, maintenance=8, management=8,
  onChange
}: {
  vacancy?: number; maintenance?: number; management?: number;
  onChange: (v: { vacancy: number; maintenance: number; management: number; }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(vacancy);
  const [m, setM] = useState(maintenance);
  const [g, setG] = useState(management);

  function apply() {
    onChange({ vacancy: v, maintenance: m, management: g });
    setOpen(false);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Assumptions</div>
        <button className="btn-secondary" onClick={()=>setOpen(o=>!o)}>{open ? "Close" : "Edit"}</button>
      </div>
      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1">Vacancy: {v}%</div>
            <input className="range" type="range" min="0" max="15" value={v} onChange={e=>setV(Number(e.target.value))} />
          </div>
          <div>
            <div className="mb-1">Maintenance: {m}%</div>
            <input className="range" type="range" min="0" max="20" value={m} onChange={e=>setM(Number(e.target.value))} />
          </div>
          <div>
            <div className="mb-1">Management: {g}%</div>
            <input className="range" type="range" min="0" max="20" value={g} onChange={e=>setG(Number(e.target.value))} />
          </div>
          <button className="btn-primary" onClick={apply}>Apply</button>
        </div>
      )}
      {!open && <div className="text-sm text-gray-600 mt-2">Vacancy {v}% • Maintenance {m}% • Mgmt {g}%</div>}
    </div>
  );
}
