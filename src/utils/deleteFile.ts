import fs from "fs/promises";

const deleteImage = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch (err) {
    console.error("Error deleting temporary file:", err);
  }
};

export default deleteImage;
