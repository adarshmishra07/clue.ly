"use server";

import { revalidatePath } from "next/cache";
import { BrandRemixService } from "@/services/remix-service";
import { BrandConfig } from "@/types/brand";
import { GeneratedImage } from "@/types/app";

export async function generateBrandRemix(
  imageData: string, // Now accepts base64 data instead of URL
  brand: BrandConfig,
  soulIdEnabled: boolean,
  originalWidth?: number,
  originalHeight?: number
): Promise<{ success: boolean; images?: GeneratedImage[]; error?: string }> {
  try {
    // Validate API key
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "Together AI API key not configured",
      };
    }

    // Validate inputs
    if (!imageData || !brand) {
      return {
        success: false,
        error: "Image and brand selection required",
      };
    }

    // Create remix service
    const remixService = new BrandRemixService(apiKey);

    // Validate API key with Together AI
    const isValidKey = await remixService.validateApiKey();
    if (!isValidKey) {
      return {
        success: false,
        error: "Invalid Together AI API key",
      };
    }

    // Generate brand remix
    const result = await remixService.remixImage({
      imageUrl: imageData, // Pass base64 data as imageUrl
      brand,
      soulIdEnabled,
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
    if (!apiKey) {
      return {
        valid: false,
        error: "API key not configured",
      };
    }

    const remixService = new BrandRemixService(apiKey);
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
