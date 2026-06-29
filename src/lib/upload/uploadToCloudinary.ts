"use server";

import cloudinary from "../cloudinary";
export async function uploadToCloudinary(file: File,) {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

 
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      {
        upload_preset: "social_app",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(error);
        }

        resolve(result!.secure_url);
      },
    );
  });
}
