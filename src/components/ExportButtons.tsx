"use client";
import { Download, FileText, Table } from "lucide-react";
import { exportToCSV, exportToPDF, type AnalysisData } from "@/services/export";

interface ExportButtonsProps {
  data: AnalysisData;
  className?: string;
}

export default function ExportButtons({ data, className = "" }: ExportButtonsProps) {
  const handleCSVExport = () => {
    exportToCSV(data);
  };

  const handlePDFExport = () => {
    exportToPDF(data);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleCSVExport}
        className="btn-secondary flex items-center gap-2"
        title="Export to CSV"
      >
        <Table size={16} />
        CSV
      </button>
      <button
        onClick={handlePDFExport}
        className="btn-secondary flex items-center gap-2"
        title="Export to PDF"
      >
        <FileText size={16} />
        PDF
      </button>
    </div>
  );
}
