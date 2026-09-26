const CLOUD_NAME = "gyrawxqf";
const UPLOAD_PRESET = "portfolio_creator";

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No image selected.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log("Cloudinary status:", response.status);
  console.log("Cloudinary response:", data);

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Cloudinary upload failed."
    );
  }

  return data.secure_url;
};