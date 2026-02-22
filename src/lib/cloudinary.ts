export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "freshmart_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwdnjs1c1/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url as string;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
