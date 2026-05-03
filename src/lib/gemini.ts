import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processVirtualTryOn(
  modelBase64: string,
  clothingBase64: string,
  userPrompt: string
) {
  try {
    const prompt = `
    TASK: Virtual Try-On.
    Take the person from the first image and dress them with the outfit from the second image.
    Keep face, identity and body realistic.
    Style: professional fashion photography.
    ${userPrompt || ""}
    `;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return `data:image/png;base64,${response.data[0].b64_json}`;

  } catch (error: any) {
    console.error("Erro no Provador:", error);
    throw error;
  }
}

export async function processRestorePhoto(
  photoBase64: string,
  userPrompt: string
) {
  try {
    const prompt = `
    TASK: Photo Restoration.
    Restore this image with high quality.
    Remove noise, improve sharpness and lighting.
    ${userPrompt || ""}
    `;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return `data:image/png;base64,${response.data[0].b64_json}`;

  } catch (error: any) {
    console.error("Erro na Restauração:", error);
    throw error;
  }
}
