'use server';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { PoolClient, QueryResult } from "pg";

export async function POST(req:Request) {
  try {
    const { email, password } = await req.json();

    const client:PoolClient = await pool.connect();
    try {
      const userRes:QueryResult = await client.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userRes.rowCount === 0) {
        return NextResponse.json({ error: "User does not exist." }, { status: 401 });
      }

      const user = userRes.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json({ error: "Invalid username or password!" }, { status: 401 });
      }

      // JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      });

      //cookie
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
