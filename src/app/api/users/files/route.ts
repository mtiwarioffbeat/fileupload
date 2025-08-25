// app/api/upload/route.ts  (Next.js 13+ with App Router)
import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import pool from "@/lib/db";
import {deleteFile, getUserFiles, saveUserFile, updateFile } from "@/services/fileServices";
import { getSession } from "@/lib/session";
// Setup Multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadMiddleware = upload.single("file");

// Convert Multer to a Promise-based function
const runMiddleware = promisify(uploadMiddleware);

export async function POST(req: Request) {
    const client = await pool.connect();
  try {
    // Convert Request (Web API) -> Express-like object
    const formData = await req.formData();
    console.log("formdata arahaa===>",formData)
    const file = formData.get("file") as File | null;
    console.log("Filesssssss", file)

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save file manually since App Router doesn’t support req.file directly
    const bytes = Buffer.from(await file.arrayBuffer());
    // console.log("byteData", bytes)
    const filePath = `./public/uploads/${Date.now()}-${file.name}`;
    await fs.promises.writeFile(filePath, bytes);

    // file save in pg
    const session:any = await getSession();
    const userId = session.id

    const pgfileUpload = await saveUserFile(userId,file,filePath)
    console.log('pgfileUpload',pgfileUpload)
    
    
    
    return NextResponse.json({
      file:file,
      filepath: `/uploads/${filePath.split("uploads/")[1]}`,
      message:"file uploaded successfullly"
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}


export async function GET() {
  const session:any = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await getUserFiles(session.id);
    return NextResponse.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req:any) {
  console.log('req for delete', req)
  try {
    const body = await req.json();
    
    console.log("================> req",body)
  //  const fileName = body.fileName
  //  console.log(fileName)
    
    // const uploadthingRes = await DeleteFromUploadthing(fileName);
    // console.log("deleted from uploadthing", uploadthingRes);

    fs.unlinkSync(body.file.filepath)
   
    const dbRes = await deleteFile(body.file.id);
    console.log("deleted from db ", dbRes);

    return NextResponse.json(
      { message: "File deleted successfully", dbRes },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}


export async function PUT(req:any){
  try{
    // const {oldFileId,newFile}:any =  req.json();
    const formData = await req.formData();
    // console.log("put daataa",body)
    // console.log("put daataa",oldFileId,newFile)
     const formObject = Object.fromEntries(formData.entries());
    console.log("update:::::",formObject.file)
    

    // Save file manually since App Router doesn’t support req.file directly
    const bytes = Buffer.from(await formObject.file.arrayBuffer());
    // console.log("byteData", bytes)
    const filePath = `./public/uploads/${Date.now()}-${formObject.file.name}`;
    await fs.promises.writeFile(filePath, bytes);
    const update = await updateFile(formObject.oldFileId,formObject.file,filePath)

    console.log("update::::",update)
    return NextResponse.json({
      message:"data agya",
      status:201
    })

  } catch(err){
    console.log("eer in updation",err)
     return NextResponse.json({
      message:"data nhi aya"
    })
  }
}



// // app/api/upload/route.ts
// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs";
// import pool from "@/lib/db";
// import { deleteFile, getUserFiles, saveUserFile } from "@/services/fileServices";
// import { getSession } from "@/lib/session";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Save file to disk
//     const bytes = Buffer.from(await file.arrayBuffer());
//     const filePath = `./public/uploads/${Date.now()}-${file.name}`;
//     await fs.promises.writeFile(filePath, bytes);
 
//     const session: any = await getSession();
//     const userId = session.id;

//    const pgfileUpload = await saveUserFile(userId, file, filePath, !!formData.get("isEdit"));


//     return NextResponse.json({
//       file: {
//         filename: file.name,
//         filepath: `/uploads/${filePath.split("uploads/")[1]}`,
//         filetype: file.type,
//       },
//       message: "File uploaded successfully",
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     return NextResponse.json(
//       { error: "File upload failed" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   const session:any = await getSession();
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const files = await getUserFiles(session.id);
//     return NextResponse.json(files);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
