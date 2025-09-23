import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ incomeAnnual: user.profile?.incomeAnnual ?? 0, otherDebtMonthly: user.profile?.otherDebtMonthly ?? 0 });
}

export async function POST(req: Request) {
  const { email, incomeAnnual, otherDebtMonthly } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { incomeAnnual, otherDebtMonthly },
    create: { userId: user.id, incomeAnnual, otherDebtMonthly }
  });
  return NextResponse.json({ ok: true, profile });
}
