export type RentCastComp = {
  id: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  distance: number; // in miles
  propertyType: string;
  lastUpdated: string;
};

export type RentCastResponse = {
  property: {
    avm: number;
    taxAnnual: number;
    hoaMonthly: number;
    insuranceAnnual: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    photoUrl?: string;
  };
  rent: {
    estimate: number;
    range: [number, number];
    comps: number;
  };
  comps?: RentCastComp[];
};

async function fetchRentCastWithComps(address: string): Promise<RentCastResponse> {
  const key = process.env.RENTCAST_API_KEY;
  
  if (!key) {
    // Mocked response with sample comps when key not present
    return {
      property: {
        avm: 512000,
        taxAnnual: 9600,
        hoaMonthly: 40,
        insuranceAnnual: 1500,
        beds: 3,
        baths: 2,
        sqft: 1750
      },
      rent: {
        estimate: 2850,
        range: [2600, 3100],
        comps: 12
      },
      comps: [
        {
          id: "comp-1",
          address: "123 Oak Street, Same City, ST",
          rent: 2750,
          beds: 3,
          baths: 2,
          sqft: 1650,
          distance: 0.3,
          propertyType: "Single Family",
          lastUpdated: "2024-01-15"
        },
        {
          id: "comp-2",
          address: "456 Pine Avenue, Same City, ST",
          rent: 2900,
          beds: 3,
          baths: 2.5,
          sqft: 1800,
          distance: 0.7,
          propertyType: "Single Family",
          lastUpdated: "2024-01-10"
        },
        {
          id: "comp-3",
          address: "789 Maple Drive, Same City, ST",
          rent: 2800,
          beds: 3,
          baths: 2,
          sqft: 1700,
          distance: 1.2,
          propertyType: "Single Family",
          lastUpdated: "2024-01-08"
        },
        {
          id: "comp-4",
          address: "321 Elm Street, Same City, ST",
          rent: 3000,
          beds: 4,
          baths: 2,
          sqft: 1900,
          distance: 0.5,
          propertyType: "Single Family",
          lastUpdated: "2024-01-12"
        },
        {
          id: "comp-5",
          address: "654 Cedar Lane, Same City, ST",
          rent: 2650,
          beds: 3,
          baths: 2,
          sqft: 1600,
          distance: 0.9,
          propertyType: "Single Family",
          lastUpdated: "2024-01-05"
        }
      ]
    };
  }

  // Real API calls when key is present
  const headers = { 
    "Accept": "application/json", 
    "X-Api-Key": key 
  };
  
  const avmUrl = `https://api.rentcast.io/v1/avm?address=${encodeURIComponent(address)}`;
  const rentUrl = `https://api.rentcast.io/v1/rents/estimate?address=${encodeURIComponent(address)}`;
  const compsUrl = `https://api.rentcast.io/v1/rents/comps?address=${encodeURIComponent(address)}&limit=10`;
  
  try {
    const [avmRes, rentRes, compsRes] = await Promise.all([
      fetch(avmUrl, { headers }),
      fetch(rentUrl, { headers }),
      fetch(compsUrl, { headers })
    ]);

    if (!avmRes.ok || !rentRes.ok || !compsRes.ok) {
      throw new Error("Upstream provider error");
    }

    const avmData = await avmRes.json();
    const rentData = await rentRes.json();
    const compsData = await compsRes.json();

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
        range: [
          rentData?.low || rentData?.rentLow || 2300, 
          rentData?.high || rentData?.rentHigh || 2700
        ],
        comps: rentData?.compsCount || 8
      },
      comps: compsData?.comps?.map((comp: any, index: number) => ({
        id: comp.id || `comp-${index}`,
        address: comp.address || "Unknown Address",
        rent: comp.rent || comp.rentAmount || 2500,
        beds: comp.beds || comp.bedrooms || 3,
        baths: comp.baths || comp.bathrooms || 2,
        sqft: comp.sqft || comp.squareFeet || 1500,
        distance: comp.distance || Math.random() * 2,
        propertyType: comp.propertyType || "Single Family",
        lastUpdated: comp.lastUpdated || comp.updatedAt || new Date().toISOString().split('T')[0]
      })) || []
    };
  } catch (error) {
    console.error("RentCast API error:", error);
    throw new Error("Failed to fetch property data from RentCast");
  }
}

export { fetchRentCastWithComps };
