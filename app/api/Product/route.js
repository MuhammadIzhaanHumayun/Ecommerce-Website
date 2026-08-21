import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = Prisma();
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // This triggers the SQL JOIN to fetch the Category data
      },
      orderBy: {
        id: "asc",
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

export async function POST(request) {
  try {
    const prisma = Prisma();
    const { name, imageUrl, description, price, categoryId } =
      await request.json();
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

export async function PUT(request) {
  try {
    const prisma = Prisma();
    const { id, name, imageUrl, description, price, categoryId } =
      await request.json();
    if (!id || !name || !description || !imageUrl || !categoryId || !price) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const updateProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        image: imageUrl,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
      },
    });
    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("product update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const prisma = Prisma();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const deleteProduct = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("product delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
