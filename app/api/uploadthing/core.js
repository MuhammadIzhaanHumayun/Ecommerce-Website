import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a route for images up to 4MB
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("File uploaded to:", file.ufsUrl);
    return { url: file.ufsUrl };
  }),
};
