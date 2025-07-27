import Together from "together-ai";
import { getAdjustedDimensions, blobToBase64 } from "./image-utils";

export interface TogetherImageGenerationParams {
  model: string;
  prompt: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  steps?: number;
  n?: number;
  response_format?: "url" | "base64";
  prompt_strength?: number;
}

export interface TogetherImageResponse {
  id: string;
  url: string;
  model: string;
  prompt: string;
}

export class TogetherAIClient {
  private client: Together;

  constructor(apiKey: string) {
    this.client = new Together({
      apiKey,
    });
  }

  async generateImage(
    params: TogetherImageGenerationParams
  ): Promise<TogetherImageResponse[]> {
    const {
      model,
      prompt,
      imageUrl,
      width = 1024,
      height = 1024,
      n = 1,
      steps = 20,
      response_format = "url",
    } = params;

    // Adjust dimensions to be compatible with the model
    const adjustedDimensions = getAdjustedDimensions(width, height);

    // Handle base64 data or blob URL
    let conditionImage: string | undefined;
    if (imageUrl) {
      // Check if it's already base64 data (starts with data: or is a long string without http)
      if (
        imageUrl.startsWith("data:") ||
        (!imageUrl.startsWith("http") && imageUrl.length > 100)
      ) {
        // It's already base64 data
        conditionImage = imageUrl.startsWith("data:")
          ? imageUrl.split(",")[1]
          : imageUrl;
      } else {
        // It's a blob URL, convert to base64
        conditionImage = await blobToBase64(imageUrl);
      }
    }

    try {
      const requestBody = {
        model,
        prompt,
        width: adjustedDimensions.width,
        height: adjustedDimensions.height,
        prompt_strength: 0.65,
        guidance_scale: 7.5,
        init_image_mode: "IMAGE_STRENGTH",
        steps,
        n,
        response_format,
        ...(conditionImage && { condition_image: conditionImage }),
      };

      const response = await this.client.images.create(requestBody);

      // Transform the response to our expected format
      return response.data.map(
        (image: { id?: string; url?: string; b64_json?: string }) => ({
          id: image.id || crypto.randomUUID(),
          url: image.url || `data:image/png;base64,${image.b64_json}`,
          model,
          prompt,
        })
      );
    } catch (error) {
      console.error("Together AI API error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to generate image with Together AI"
      );
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      // Test the API key with a simple request
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }
}
