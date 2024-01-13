const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

/**
 * Uploads an image to ImageKit and returns the URL.
 *
 * @param {Object} file - The file object containing image data.
 * @returns {Promise<string>} A Promise that resolves with the URL of the uploaded image.
 * @throws {Error} If the file format is invalid or an error occurs during the upload process.
 */
const uploadImage = async (file) => {
  try {
    // Validate file object
    if (!file || !file.buffer || !file.originalname) {
      throw new Error("Invalid file format");
    }

    // Create ImageKit instance
    const imagekitConfig = {
      publicKey: "public_4bBramNECIONBieq5KN3FrflR8E=",
      privateKey: "private_X1ue3TKCD0zFD+J+AFL2hjSIlJk=",
      urlEndpoint: "https://ik.imagekit.io/j5laypcak/",
    };
    const imagekitInstance = new ImageKit(imagekitConfig);

    // Upload the image to ImageKit
    const result = await imagekitInstance.upload({
      file: file.buffer.toString("base64"),
      fileName: `${uuidv4()}-${file.originalname}`,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    // Return the URL of the uploaded image
    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error.message || error);
    throw error;
  }
};

module.exports = uploadImage;
