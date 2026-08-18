import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = Prisma();
  try {
    const category = await prisma.category.findMany();
    if (category.length == 0) {
      return NextResponse.json({ message: "error" });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
