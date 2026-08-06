import { NextResponse } from "next/server";
import { encrypt } from "@/lib/jwt";
import { PrismaClient } from "../../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Check if user exists first so it doesn't crash on null
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create token containing the user's role
      const token = await encrypt({ userId: user.id, role: user.role });

      // 1. Define the response first
      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 },
      );

      // 2. Attach the cookie to the response
      response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      // 3. Return the modified response
      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
