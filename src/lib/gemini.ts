import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function processVirtualTryOn(modelBase64: string, clothingBase64: string, userPrompt: string) {
  try {
    const modelMatch = modelBase64.match(/^data:(image\/\w+);base64,/);
    const clothingMatch = clothingBase64.match(/^data:(image\/\w+);base64,/);
    
    const modelMime = modelMatch ? modelMatch[1] : 'image/png';
    const clothingMime = clothingMatch ? clothingMatch[1] : 'image/png';

    const response = await ai.models.generateContent({
     model: 'gemini-1.5-flash-latest',
      contents: {
        parts: [
          {
            inlineData: {
              data: modelBase64.split(',')[1],
              mimeType: modelMime,
            },
          },
          {
            inlineData: {
              data: clothingBase64.split(',')[1],
              mimeType: clothingMime,
            },
          },
          {
            text: `TASK: Virtual Try-On.
            Instruction: Take the person from the first image and dress them in the outfit shown in the second image. 
            Maintain the person's facial features and skin tone. Adjust the clothing to fit their body pose naturally.
            The final output should be a high-quality single image of the model wearing the outfit.
            Style: professional fashion photography, realistic lighting.
            User hints: ${userPrompt || 'Realistic fit, natural studio light'}`,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('O modelo não retornou uma resposta válida.');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error('O modelo processou o pedido mas não gerou a imagem final. Verifique se as imagens são claras (pessoas e roupas bem visíveis) e tente novamente.');
  } catch (error: any) {
    if (error.message?.includes('Permission denied')) {
      throw new Error('Permissão negada pela API Gemini. Certifique-se de que o modelo gemini-1.5-flash-latest está disponível na sua conta.');
    }
    console.error('Erro no Provador:', error);
    throw error;
  }
}

export async function processRestorePhoto(photoBase64: string, userPrompt: string) {
  try {
    const pathMatch = photoBase64.match(/^data:(image\/\w+);base64,/);
    const mime = pathMatch ? pathMatch[1] : 'image/png';

    const response = await ai.models.generateContent({
      model: model: 'gemini-1.5-flash-latest',
      contents: {
        parts: [
          {
            inlineData: {
              data: photoBase64.split(',')[1],
              mimeType: mime,
            },
          },
          {
            text: `TASK: Photo Restoration and Colorization.
            Instruction: Restore this old or damaged photograph. Perform high-quality colorization with natural skin tones. 
            Remove scratches, stains, and noise. Increase sharpness and contrast while maintaining original identity.
            The final result should be a crisp, modern-looking photo.
            User hints: ${userPrompt || 'Professional restoration, clear faces'}`,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('O modelo não retornou uma resposta válida.');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error('O modelo processou o pedido mas não gerou a imagem final. Tente um prompt diferente.');
  } catch (error: any) {
    if (error.message?.includes('Permission denied')) {
      throw new Error('Permissão negada pela API Gemini. Certifique-se de que o modelo gemini-1.5-flash-latest está disponível na sua conta.');
    }
    console.error('Erro na Restauração:', error);
    throw error;
  }
}
