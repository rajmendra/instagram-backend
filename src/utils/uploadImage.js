const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

const imagekitConfig = {
  publicKey: "public_4bBramNECIONBieq5KN3FrflR8E=",
  privateKey: "private_X1ue3TKCD0zFD+J+AFL2hjSIlJk=",
  urlEndpoint: "https://ik.imagekit.io/j5laypcak/",
};

const imagekitInstance = new ImageKit(imagekitConfig);

const uploadImage = async (file) => {
  try {
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

    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = uploadImage;
