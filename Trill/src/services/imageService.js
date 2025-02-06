import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImageToFirebase = async (image) => {
  try {
    const storageRef = ref(storage, `images/${image.name}-${Date.now()}`);
    await uploadBytes(storageRef, image);
    const imageURL = await getDownloadURL(storageRef);
    return imageURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }
};
