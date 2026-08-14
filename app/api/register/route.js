import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Prisma from "@/lib/prisma";

const prisma = new Prisma();

export async function POST(request) {
  try {
    const { fullName, email, password, gender } = await request.json();
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        gender,
      },
    });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
