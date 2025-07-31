"use server";

import { revalidatePath } from "next/cache";
import { BrandRemixService } from "@/services/remix-service";
import { BrandConfig } from "@/types/brand";
import { GeneratedImage } from "@/types/app";

export async function generateBrandRemix(
  imageData: string, // Accepts base64 data, data URLs, HTTP URLs, or blob URLs
  brand: BrandConfig,
  soulIdEnabled: boolean,
  originalWidth?: number,
  originalHeight?: number
): Promise<{ success: boolean; images?: GeneratedImage[]; error?: string }> {
  try {
    // Validate API key
    const apiKey = process.env.TOGETHER_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !openaiApiKey) {
      return {
        success: false,
        error: "Together AI or OpenAI API key not configured",
      };
    }

    // Validate inputs
    if (!imageData || !brand) {
      return {
        success: false,
        error: "Image and brand selection required",
      };
    }

    // Validate image data format
    if (typeof imageData !== 'string' || imageData.trim().length === 0) {
      return {
        success: false,
        error: "Invalid image data provided",
      };
    }

    // Basic validation for common image data formats
    const isValidFormat = 
      imageData.startsWith("data:image/") ||
      imageData.startsWith("http://") ||
      imageData.startsWith("https://") ||
      imageData.startsWith("blob:") ||
      (imageData.length > 100 && !imageData.includes("localhost"));

    if (!isValidFormat) {
      return {
        success: false,
        error: "Invalid image format. Please provide a valid image URL or base64 data.",
      };
    }

    // Create remix service
    const remixService = new BrandRemixService(apiKey, openaiApiKey);

    // Validate API key with Together AI
    const isValidKey = await remixService.validateApiKey();
    if (!isValidKey) {
      return {
        success: false,
        error: "Invalid Together AI API key",
      };
    }

    // TEMPORARY FIX: Use user's image as BOTH reference and product to test pure preservation
    // This should result in the same image with minimal changes if prompt strength is working
    const result = await remixService.remixImage({
      referenceImageUrl: imageData, // User's image as style reference 
      productImageUrl: imageData, // Same image as product to preserve
      brand: undefined, // Remove brand logic entirely for testing
      soulIdEnabled: false, // Disable soul ID for testing
      originalWidth,
      originalHeight,
    });

    if (result.success) {
      // Revalidate the page to show new results
      revalidatePath("/");
    }

    return result;
  } catch {
    console.error("Server action error");
    return {
      success: false,
      error: "Generation failed",
    };
  }
}

export async function validateApiKey(): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const apiKey = process.env.TOGETHER_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !openaiApiKey) {
      return {
        valid: false,
        error: "Together AI or OpenAI API key not configured",
      };
    }

    const remixService = new BrandRemixService(apiKey, openaiApiKey);
    const isValid = await remixService.validateApiKey();

    return {
      valid: isValid,
      error: isValid ? undefined : "Invalid API key",
    };
  } catch {
    return {
      valid: false,
      error: "Failed to validate API key",
    };
  }
}
