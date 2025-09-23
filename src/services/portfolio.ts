export type SavedProperty = {
  id: string;
  address: string;
  homeValue: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  taxAnnual: number;
  hoaMonthly: number;
  insuranceAnnual: number;
  rentEstimate: number;
  interestRate: number;
  downPaymentPercent: number;
  vacancyRate: number;
  maintenanceRate: number;
  managementRate: number;
  piti: number;
  cashFlow: number;
  capRate: number;
  coc: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SavePropertyData = {
  email: string;
  address: string;
  homeValue: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  taxAnnual: number;
  hoaMonthly: number;
  insuranceAnnual: number;
  rentEstimate: number;
  interestRate: number;
  downPaymentPercent: number;
  vacancyRate: number;
  maintenanceRate: number;
  managementRate: number;
  piti: number;
  cashFlow: number;
  capRate: number;
  coc: number;
  notes?: string;
};

export async function fetchPortfolio(email: string): Promise<SavedProperty[]> {
  const response = await fetch(`/api/portfolio?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch portfolio");
  }
  
  const data = await response.json();
  return data.properties;
}

export async function saveProperty(propertyData: SavePropertyData): Promise<SavedProperty> {
  const response = await fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(propertyData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save property");
  }
  
  const data = await response.json();
  return data.property;
}

export async function updateProperty(id: string, propertyData: Partial<SavePropertyData>): Promise<SavedProperty> {
  const response = await fetch(`/api/portfolio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(propertyData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update property");
  }
  
  const data = await response.json();
  return data.property;
}

export async function deleteProperty(id: string, email: string): Promise<void> {
  const response = await fetch(`/api/portfolio/${id}?email=${encodeURIComponent(email)}`, {
    method: "DELETE"
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete property");
  }
}
