import Papa from 'papaparse';

export type AnalysisData = {
  address: string;
  property: {
    avm: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    taxAnnual: number;
    hoaMonthly: number;
    insuranceAnnual: number;
    photoUrl?: string;
  };
  rent: {
    estimate: number;
    range?: [number, number];
    comps?: number;
  };
  finance: {
    PI: number;
    PITI: number;
    rentBreakEven: number;
    cashFlow: number;
    pmiMonthly: number;
    noi: number;
    capRate: number;
    coc: number;
  };
  affordability: {
    maxPITIByDTI: number;
    incomeMonthly: number;
  };
};

export function exportToCSV(data: AnalysisData): void {
  const csvData = [
    {
      'Property Address': data.address,
      'Home Value': data.property.avm,
      'Beds': data.property.beds || 'N/A',
      'Baths': data.property.baths || 'N/A',
      'Square Feet': data.property.sqft || 'N/A',
      'Annual Taxes': data.property.taxAnnual,
      'HOA Monthly': data.property.hoaMonthly,
      'Annual Insurance': data.property.insuranceAnnual,
      'Rent Estimate': data.rent.estimate,
      'Rent Range Low': data.rent.range?.[0] || 'N/A',
      'Rent Range High': data.rent.range?.[1] || 'N/A',
      'Comparable Properties': data.rent.comps || 'N/A',
      'Principal & Interest': data.finance.PI,
      'Monthly Payment': data.finance.PITI,
      'Break-even Rent': data.finance.rentBreakEven,
      'Monthly Cash Flow': data.finance.cashFlow,
      'PMI Monthly': data.finance.pmiMonthly,
      'Net Operating Income': data.finance.noi,
      'Cap Rate (%)': (data.finance.capRate * 100).toFixed(2),
      'Cash on Cash Return (%)': (data.finance.coc * 100).toFixed(2),
      'Max Payment by DTI': data.affordability.maxPITIByDTI,
      'Monthly Income': data.affordability.incomeMonthly,
    }
  ];

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `rentpax-analysis-${data.address.replace(/[^a-zA-Z0-9]/g, '-')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: AnalysisData): void {
  // This will be implemented with @react-pdf/renderer
  // For now, we'll create a simple HTML-based PDF export
  const htmlContent = generatePDFHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `rentpax-analysis-${data.address.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Open in new window for printing
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

function generatePDFHTML(data: AnalysisData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>RentPax Analysis Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #1F6FEB; border-bottom: 2px solid #1F6FEB; padding-bottom: 5px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .item { margin-bottom: 10px; }
    .label { font-weight: bold; color: #666; }
    .value { font-size: 1.1em; }
    .highlight { background-color: #E8F0FE; padding: 15px; border-radius: 8px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>RentPax Property Analysis Report</h1>
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="section">
    <h2>Property Information</h2>
    <div class="grid">
      <div class="item">
        <div class="label">Address</div>
        <div class="value">${data.address}</div>
      </div>
      <div class="item">
        <div class="label">Home Value</div>
        <div class="value">$${data.property.avm.toLocaleString()}</div>
      </div>
      <div class="item">
        <div class="label">Beds/Baths</div>
        <div class="value">${data.property.beds || 'N/A'} / ${data.property.baths || 'N/A'}</div>
      </div>
      <div class="item">
        <div class="label">Square Feet</div>
        <div class="value">${data.property.sqft?.toLocaleString() || 'N/A'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Rental Analysis</h2>
    <div class="grid">
      <div class="item">
        <div class="label">Rent Estimate</div>
        <div class="value">$${data.rent.estimate.toLocaleString()}/month</div>
      </div>
      <div class="item">
        <div class="label">Rent Range</div>
        <div class="value">$${data.rent.range?.[0]?.toLocaleString() || 'N/A'} - $${data.rent.range?.[1]?.toLocaleString() || 'N/A'}</div>
      </div>
      <div class="item">
        <div class="label">Comparable Properties</div>
        <div class="value">${data.rent.comps || 'N/A'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Financial Analysis</h2>
    <div class="highlight">
      <div class="grid">
        <div class="item">
          <div class="label">Monthly Payment</div>
          <div class="value">$${data.finance.PITI.toFixed(0)}</div>
        </div>
        <div class="item">
          <div class="label">Monthly Cash Flow</div>
          <div class="value">$${data.finance.cashFlow.toFixed(0)}</div>
        </div>
        <div class="item">
          <div class="label">Cap Rate</div>
          <div class="value">${(data.finance.capRate * 100).toFixed(2)}%</div>
        </div>
        <div class="item">
          <div class="label">Cash on Cash Return</div>
          <div class="value">${(data.finance.coc * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Affordability Analysis</h2>
    <div class="grid">
      <div class="item">
        <div class="label">Monthly Income</div>
        <div class="value">$${data.affordability.incomeMonthly.toFixed(0)}</div>
      </div>
      <div class="item">
        <div class="label">Max Payment by DTI</div>
        <div class="value">$${data.affordability.maxPITIByDTI.toFixed(0)}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
