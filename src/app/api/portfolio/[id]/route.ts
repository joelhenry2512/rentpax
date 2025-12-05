import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const UpdatePropertySchema = z.object({
  email: z.string().email(),
  address: z.string().min(3).optional(),
  homeValue: z.number().positive().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  sqft: z.number().optional(),
  taxAnnual: z.number().min(0).optional(),
  hoaMonthly: z.number().min(0).optional(),
  insuranceAnnual: z.number().min(0).optional(),
  rentEstimate: z.number().positive().optional(),
  interestRate: z.number().min(0.01).max(0.5).optional(),
  downPaymentPercent: z.number().min(0).max(0.9).optional(),
  vacancyRate: z.number().min(0).max(0.5).optional(),
  maintenanceRate: z.number().min(0).max(0.5).optional(),
  managementRate: z.number().min(0).max(0.5).optional(),
  piti: z.number().optional(),
  cashFlow: z.number().optional(),
  capRate: z.number().optional(),
  coc: z.number().optional(),
  notes: z.string().optional()
});

// GET - Fetch specific property
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Property fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

// PUT - Update property
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = UpdatePropertySchema.parse(body);

    // Verify user owns this property
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.user.email !== data.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ property: updatedProperty });
  } catch (error) {
    console.error("Property update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

// DELETE - Remove property from portfolio
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const email = new URL(req.url).searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Verify user owns this property
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.user.email !== email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.property.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Property delete error:", error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
