"use client";
import { useState } from "react";
import { X } from "lucide-react";
import type { SavedProperty } from "@/services/portfolio";

interface EditPropertyModalProps {
  property: SavedProperty;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SavedProperty>) => Promise<void>;
}

export default function EditPropertyModal({ property, isOpen, onClose, onSave }: EditPropertyModalProps) {
  const [notes, setNotes] = useState(property.notes || "");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(property.id, { notes });
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Property</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Info (read-only) */}
          <div>
            <h3 className="font-medium mb-2">Property Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{property.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Home Value:</span>
                <span className="font-medium">${property.homeValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Flow:</span>
                <span className={`font-medium ${property.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${property.cashFlow.toFixed(0)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cap Rate:</span>
                <span className="font-medium">{(property.capRate * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Editable Notes */}
          <div>
            <label className="block font-medium mb-2">
              Notes
              <span className="text-sm text-gray-500 ml-2">(Add your thoughts, reminders, or details)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Needs roof repair, Seller motivated, Great school district..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-vertical min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {notes.length} / 1000 characters
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
