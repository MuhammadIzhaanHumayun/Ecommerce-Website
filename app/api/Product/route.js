import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = Prisma();

    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: {
          orderBy: {
            price: "asc",
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product retrieval error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const prisma = Prisma();

    const {
      name,
      imageUrl,
      description,
      price,
      categoryId,
      variants = [],
    } = await request.json();

    // Validate basic product fields
    if (
      !name?.trim() ||
      !description?.trim() ||
      !imageUrl?.trim() ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const parsedCategoryId = Number(categoryId);
    const parsedPrice = Number(price);

    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!Array.isArray(variants)) {
      return NextResponse.json(
        { error: "Invalid variants data" },
        { status: 400 },
      );
    }

    // Validate variants
    if (variants.length > 0) {
      const variantNames = variants.map((variant) =>
        variant.name?.trim().toLowerCase(),
      );

      if (
        variants.some(
          (variant) =>
            !variant.name?.trim() ||
            variant.price === "" ||
            variant.price === null ||
            variant.price === undefined ||
            !Number.isFinite(Number(variant.price)) ||
            Number(variant.price) < 0,
        ) ||
        new Set(variantNames).size !== variantNames.length
      ) {
        return NextResponse.json(
          {
            error: "Please provide valid variants with unique names and prices",
          },
          { status: 400 },
        );
      }
    } else if (
      price === "" ||
      price === null ||
      price === undefined ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return NextResponse.json(
        { error: "Please provide a valid product price" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { name: name.trim() },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product already exists." },
        { status: 409 },
      );
    }

    await prisma.product.create({
      data: {
        name: name.trim(),
        image: imageUrl,
        description: description.trim(),
        price: variants.length > 0 ? 0 : parsedPrice,
        categoryId: parsedCategoryId,

        ...(variants.length > 0 && {
          variants: {
            create: variants.map((variant) => ({
              name: variant.name.trim(),
              price: Number(variant.price),
            })),
          },
        }),
      },
    });

    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Product creation error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const prisma = Prisma();

    const {
      id,
      name,
      imageUrl,
      description,
      price,
      categoryId,
      variants = [],
    } = await request.json();

    if (
      !id ||
      !name?.trim() ||
      !description?.trim() ||
      !imageUrl?.trim() ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const parsedId = Number(id);
    const parsedCategoryId = Number(categoryId);
    const parsedPrice = Number(price);

    if (
      !Number.isInteger(parsedId) ||
      parsedId <= 0 ||
      !Number.isInteger(parsedCategoryId) ||
      parsedCategoryId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid product or category ID" },
        { status: 400 },
      );
    }

    if (!Array.isArray(variants)) {
      return NextResponse.json(
        { error: "Invalid variants data" },
        { status: 400 },
      );
    }

    // Validate variants
    if (variants.length > 0) {
      const variantNames = variants.map((variant) =>
        variant.name?.trim().toLowerCase(),
      );

      if (
        variants.some(
          (variant) =>
            !variant.name?.trim() ||
            variant.price === "" ||
            variant.price === null ||
            variant.price === undefined ||
            !Number.isFinite(Number(variant.price)) ||
            Number(variant.price) < 0,
        ) ||
        new Set(variantNames).size !== variantNames.length
      ) {
        return NextResponse.json(
          {
            error: "Please provide valid variants with unique names and prices",
          },
          { status: 400 },
        );
      }
    } else if (
      price === "" ||
      price === null ||
      price === undefined ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return NextResponse.json(
        { error: "Please provide a valid product price" },
        { status: 400 },
      );
    }

    // Update product and its variants together
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: parsedId },
        data: {
          name: name.trim(),
          image: imageUrl,
          description: description.trim(),
          price: variants.length > 0 ? 0 : parsedPrice,
          categoryId: parsedCategoryId,
        },
      });

      if (variants.length > 0) {
        const variantNames = variants.map((variant) => variant.name.trim());

        // Remove variants that are no longer in the form
        await tx.productVariant.deleteMany({
          where: {
            productId: parsedId,
            name: {
              notIn: variantNames,
            },
          },
        });

        // Update existing variants or create new ones
        for (const variant of variants) {
          const variantName = variant.name.trim();

          await tx.productVariant.upsert({
            where: {
              productId_name: {
                productId: parsedId,
                name: variantName,
              },
            },
            update: {
              price: Number(variant.price),
            },
            create: {
              name: variantName,
              price: Number(variant.price),
              productId: parsedId,
            },
          });
        }
      } else {
        // Remove all variants when switching back to a regular product
        await tx.productVariant.deleteMany({
          where: {
            productId: parsedId,
          },
        });
      }
    });

    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Product update error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 409 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    await prisma.product.delete({
      where: {
        id: parsedId,
      },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Product deletion error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
