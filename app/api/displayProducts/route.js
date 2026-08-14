import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = Prisma();
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // This triggers the SQL JOIN to fetch the Category data
      },
    });
    console.log(products);
    if (products.length == 0) {
      return NextResponse.json({ message: "No Products Found" });
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
