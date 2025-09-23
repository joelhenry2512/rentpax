"use client";
import { useState } from "react";
import { MapPin, Home, Calendar, Check } from "lucide-react";
import type { RentCastComp } from "@/services/rentcast";

interface CompsSelectorProps {
  comps: RentCastComp[];
  selectedComps: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onCalculateCustomRent: (customRent: number) => void;
}

export default function CompsSelector({ 
  comps, 
  selectedComps, 
  onSelectionChange, 
  onCalculateCustomRent 
}: CompsSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const [customRent, setCustomRent] = useState("");

  const displayedComps = showAll ? comps : comps.slice(0, 3);
  const selectedCompsData = comps.filter(comp => selectedComps.includes(comp.id));

  const handleCompToggle = (compId: string) => {
    const newSelection = selectedComps.includes(compId)
      ? selectedComps.filter(id => id !== compId)
      : [...selectedComps, compId];
    onSelectionChange(newSelection);
  };

  const handleCustomRentSubmit = () => {
    const rent = parseFloat(customRent);
    if (!isNaN(rent) && rent > 0) {
      onCalculateCustomRent(rent);
    }
  };

  const calculateAverageRent = () => {
    if (selectedCompsData.length === 0) return 0;
    const total = selectedCompsData.reduce((sum, comp) => sum + comp.rent, 0);
    return total / selectedCompsData.length;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comparable Properties</h2>
        <span className="text-sm text-gray-600">
          {selectedComps.length} of {comps.length} selected
        </span>
      </div>

      {/* Custom Rent Input */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-medium mb-2">Custom Rent Analysis</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter custom rent amount"
            value={customRent}
            onChange={(e) => setCustomRent(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={handleCustomRentSubmit}
            className="btn-primary"
            disabled={!customRent || isNaN(parseFloat(customRent))}
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Selected Comps Summary */}
      {selectedCompsData.length > 0 && (
        <div className="mb-4 p-3 bg-brand-light rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check size={16} className="text-brand" />
            <span className="font-medium">Selected Properties</span>
          </div>
          <div className="text-sm text-gray-700">
            Average rent: <span className="font-semibold">${calculateAverageRent().toFixed(0)}/month</span>
          </div>
        </div>
      )}

      {/* Comps List */}
      <div className="space-y-3">
        {displayedComps.map((comp) => (
          <div
            key={comp.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedComps.includes(comp.id)
                ? "border-brand bg-brand-light"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleCompToggle(comp.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span className="font-medium text-sm">{comp.address}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Home size={14} className="text-gray-500" />
                    <span>{comp.beds}bd / {comp.baths}ba</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sqft:</span> {comp.sqft.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-500">Distance:</span> {comp.distance.toFixed(1)}mi
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{comp.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-brand">
                  ${comp.rent.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">per month</div>
                <div className={`mt-2 w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedComps.includes(comp.id)
                    ? "bg-brand border-brand"
                    : "border-gray-300"
                }`}>
                  {selectedComps.includes(comp.id) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {comps.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="btn-secondary w-full mt-4"
        >
          {showAll ? "Show Less" : `Show All ${comps.length} Properties`}
        </button>
      )}

      {/* Selection Actions */}
      {comps.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSelectionChange(comps.map(c => c.id))}
            className="btn-secondary flex-1"
          >
            Select All
          </button>
          <button
            onClick={() => onSelectionChange([])}
            className="btn-secondary flex-1"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
