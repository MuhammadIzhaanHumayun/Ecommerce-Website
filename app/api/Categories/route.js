import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = Prisma();
  try {
    const category = await prisma.category.findMany();
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const prisma = Prisma();
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name cannot be empty" },
        { status: 400 },
      );
    }

    const categoryName = name.trim();

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists." },
        { status: 400 },
      );
    }

    await prisma.category.create({
      data: {
        name: categoryName,
      },
    });

    return NextResponse.json(
      { message: "Category created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Category creation error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const prisma = Prisma();
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    let res = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    return NextResponse.json({ message: "Category updated." }, { status: 201 });
  } catch (error) {
    console.error("category update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const prisma = Prisma();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID cannot be empty" },
        { status: 400 },
      );
    }
    let res = await prisma.category.delete({ where: { id: parseInt(id) } });
    if (!res) {
      console.error("database error: " + res);
      return NextResponse.json(
        { error: "cannot delete at the moment, try again later." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "category deleted successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("something wrong in delete code. " + error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
