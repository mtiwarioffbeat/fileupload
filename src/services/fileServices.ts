import pool from "@/lib/db";
// import { NextResponse } from "next/server";

export async function saveUserFile(userId: number, file: File, filePath: string, isEdit = false) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // if (isEdit) {
    //   // Delete old file row for this user
    //   await client.query(`DELETE FROM userfiles WHERE id = $1`, [userId]);
    // }

    // Insert new file row
    await client.query(
      `INSERT INTO userfiles (user_id, filename, filepath, filetype, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, file.name, filePath, file.type]
    );

    await client.query(
      `UPDATE users SET has_file = true WHERE id = $1`,
      [userId]
    );

    await client.query("COMMIT");
    return { Uploadedfile: file, message: "file upload/replace success in pg" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


export async function getUserFiles(userId:number) {
  const { rows } = await pool.query(
    `SELECT id, user_id, filename, filepath, filetype, created_at 
     FROM userfiles 
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function deleteFile(id:string) {
  console.log(id)
  const {rows} = await pool.query(
    `DELETE FROM userfiles WHERE id = $1`,
    [id]
  );
  return rows;
}

export async function updateFile(id:string,file:File,filepath:string){
  console.log("id and file::::",id,file)
const { rows } = await pool.query(
  `UPDATE userfiles
   SET filename = $1,
       filepath = $2,
       filetype = $3,
       updated_at = $4
   WHERE id = $5
   RETURNING *`,
  [file.name, filepath, file.type, new Date(), id]
);

  return rows
}
