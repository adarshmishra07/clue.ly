// together-client.ts - FIXED VERSION
import Together from "together-ai";
import { getAdjustedDimensions } from "./image-utils";

// Simple blob to base64 conversion for client-side usage
async function blobToBase64(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1]; // Remove data URL prefix
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to convert blob to base64: ${error}`);
  }
}

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
      steps = 28,
      response_format = "url",
    } = params;

    // Adjust dimensions to be compatible with the model
    const adjustedDimensions = getAdjustedDimensions(width, height);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let requestBody: any;

      // Different parameter structure for FLUX Kontext vs regular FLUX
      if (model.includes("kontext")) {
        // FLUX Kontext models use different parameters
        requestBody = {
          model,
          prompt,
          width: adjustedDimensions.width,
          height: adjustedDimensions.height,
          steps,
          n,
          response_format,
        };

        // Add image_url for FLUX Kontext (NOT condition_image)
        if (imageUrl) {
          const processedImageUrl = await this.processImageUrl(imageUrl);
          if (processedImageUrl) {
            requestBody.image_url = processedImageUrl;
          }
        }
      } else {
        // Regular FLUX models use different parameter structure
        requestBody = {
          model,
          prompt,
          width: adjustedDimensions.width,
          height: adjustedDimensions.height,
          prompt_strength: params.prompt_strength || 0.35, // Reduced to preserve original better
          guidance_scale: 7.5,
          init_image_mode: "IMAGE_STRENGTH",
          steps,
          n,
          response_format,
        };

        // For regular FLUX, use condition_image
        if (imageUrl) {
          const processedImageUrl = await this.processImageUrl(imageUrl);
          if (processedImageUrl) {
            // For condition_image, remove data URL prefix if present
            const conditionImage = processedImageUrl.startsWith("data:")
              ? processedImageUrl.split(",")[1]
              : processedImageUrl;
            requestBody.condition_image = conditionImage;
          }
        }
      }

      console.log(
        "Together AI request body:",
        JSON.stringify(
          {
            ...requestBody,
            image_url: requestBody.image_url ? "[IMAGE_DATA]" : undefined,
            condition_image: requestBody.condition_image
              ? "[IMAGE_DATA]"
              : undefined,
          },
          null,
          2
        )
      );

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

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to generate image with Together AI"
      );
    }
  }

  // validate api key
  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }

  // Process image URL and handle different formats safely
  private async processImageUrl(imageUrl: string): Promise<string | null> {
    if (!imageUrl) {
      console.log("❌ No image URL provided");
      return null;
    }

    console.log("🔄 Processing image URL:", imageUrl.substring(0, 100) + "...");

    try {
      // If it's a proper HTTP/HTTPS URL, use as is for Kontext models
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        console.log("✅ Valid HTTP URL, using directly");
        return imageUrl;
      }

      // If it's already base64 data URL, use as is
      if (imageUrl.startsWith("data:image/")) {
        console.log("✅ Valid data URL, using directly");
        return imageUrl;
      }

      // If it's a blob URL, convert to base64
      if (imageUrl.startsWith("blob:")) {
        console.log("🔄 Converting blob URL to base64...");
        const base64Data = await blobToBase64(imageUrl);
        return `data:image/jpeg;base64,${base64Data}`;
      }

      // Reject localhost or file URLs
      if (imageUrl.includes("localhost") || imageUrl.startsWith("file://")) {
        console.error("❌ Localhost/file URLs not supported:", imageUrl);
        return null;
      }

      // If it's base64 string without data URL prefix, add it
      if (imageUrl.length > 100 && !imageUrl.startsWith("http")) {
        console.log("🔄 Adding data URL prefix to base64 string");
        return `data:image/jpeg;base64,${imageUrl}`;
      }

      console.error("❌ Invalid image URL format:", imageUrl.substring(0, 50));
      return null;
    } catch (error) {
      console.error("❌ Error processing image URL:", error);
      return null;
    }
  }
}
