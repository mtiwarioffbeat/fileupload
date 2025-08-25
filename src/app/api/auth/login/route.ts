'use server';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(req:any) {
  try {
    const { email, password } = await req.json();

    const client = await pool.connect();
    try {
      const userRes = await client.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userRes.rowCount === 0) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const user = userRes.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Generate token (JWT)
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Store cookie securely
      const cookieStore = await cookies();
      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ message: "Login successful" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
