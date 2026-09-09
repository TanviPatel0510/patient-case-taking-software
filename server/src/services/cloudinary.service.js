import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export function uploadMedicalDocument(buffer, options) {
  const resourceType = options.mimeType === "application/pdf" ? "raw" : "image";
  const originalName = options.originalFileName?.split(/[\\/]/).pop() || "document";
  const publicId = originalName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "document";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: publicId,
        resource_type: resourceType,
        format: resourceType === "raw" ? "pdf" : options.mimeType === "image/png" ? "png" : "jpg",
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

export function deleteCloudinaryFile(publicId, resourceType = "image") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}