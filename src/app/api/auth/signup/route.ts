'use server';

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req:any) {
  try {
    const { name, email, password } = await req.json();
    console.log(name,email,password)
    // const body = req.json()
    // console.log("body;;;+",body)
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Check if user exists
      const existing:any = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      if (existing.rowCount > 0) {
        return NextResponse.json(
          { error: "Email already exists, try login" },
          { status: 400 }
        );
      }

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await client.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name, email, hashed]
      );

      const user = result.rows[0];

      // Create JWT
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" } // 1 day expiry
      );

      // Set cookie (HttpOnly & Secure)
      const cookieStore = await cookies();
      cookieStore.set("session", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      // Return success
      return NextResponse.json(
        { message: "Signup successful" },
        { status: 201 }
      );

    } finally {
      client.release();
    }

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
