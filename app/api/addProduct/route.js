import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const prisma = Prisma();
    const { name, imageUrl, description, price, categoryId } =
      await request.json();
    console.log(name, imageUrl, description, price, categoryId);
    if (!name || !description || !imageUrl || !categoryId || !price) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const existingProduct = await prisma.product.findUnique({
      where: { name },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product already exists." },
        { status: 400 },
      );
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        image: imageUrl,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
      },
    });
    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("product creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
