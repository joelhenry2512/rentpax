import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const SavePropertySchema = z.object({
  email: z.string().email(),
  address: z.string().min(3),
  homeValue: z.number().positive(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  sqft: z.number().optional(),
  taxAnnual: z.number().min(0),
  hoaMonthly: z.number().min(0),
  insuranceAnnual: z.number().min(0),
  rentEstimate: z.number().positive(),
  interestRate: z.number().min(0.01).max(0.5),
  downPaymentPercent: z.number().min(0).max(0.9),
  vacancyRate: z.number().min(0).max(0.5),
  maintenanceRate: z.number().min(0).max(0.5),
  managementRate: z.number().min(0).max(0.5),
  piti: z.number(),
  cashFlow: z.number(),
  capRate: z.number(),
  coc: z.number(),
  notes: z.string().optional()
});

// GET - Fetch user's portfolio
export async function GET(req: Request) {
  try {
    const email = new URL(req.url).searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        properties: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ properties: user.properties });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

// POST - Save property to portfolio
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = SavePropertySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if property with same address already exists for this user
    const existingProperty = await prisma.property.findFirst({
      where: {
        userId: user.id,
        address: data.address
      }
    });

    if (existingProperty) {
      return NextResponse.json({ 
        error: "This property is already in your portfolio",
        duplicate: true 
      }, { status: 409 });
    }

    const property = await prisma.property.create({
      data: {
        userId: user.id,
        address: data.address,
        homeValue: data.homeValue,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft,
        taxAnnual: data.taxAnnual,
        hoaMonthly: data.hoaMonthly,
        insuranceAnnual: data.insuranceAnnual,
        rentEstimate: data.rentEstimate,
        interestRate: data.interestRate,
        downPaymentPercent: data.downPaymentPercent,
        vacancyRate: data.vacancyRate,
        maintenanceRate: data.maintenanceRate,
        managementRate: data.managementRate,
        piti: data.piti,
        cashFlow: data.cashFlow,
        capRate: data.capRate,
        coc: data.coc,
        notes: data.notes
      }
    });

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Save property error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 });
  }
}
