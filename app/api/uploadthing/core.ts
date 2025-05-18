// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" ,maxFileCount:1} })
    .middleware(async ({ req }) => {
      const { userId } = getAuth(req);
      console.log("UserID--------> on core.ts file",userId)
      if (!userId) {
        throw new UploadThingError("Unauthorized");
      }

      return {userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for", metadata.userId);
      console.log("File URL:", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
