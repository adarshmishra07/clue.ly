import { TogetherAIClient } from "@/lib/together-client";
import { StyleAnalysisService, StyleAnalysis } from "@/lib/style-analysis";
import { BrandConfig } from "@/types/brand";
import { GeneratedImage } from "@/types/app";

export class BrandRemixService {
  private client: TogetherAIClient;
  private styleAnalyzer: StyleAnalysisService;

  constructor(togetherApiKey: string, openaiApiKey: string) {
    this.client = new TogetherAIClient(togetherApiKey);
    this.styleAnalyzer = new StyleAnalysisService(openaiApiKey);
  }

  async remixImage(params: {
    referenceImageUrl: string; // Style reference image (HTTP URL, data URL, base64, or blob URL)
    productImageUrl: string; // Product image data (HTTP URL, data URL, base64, or blob URL)
    brand?: BrandConfig; // Optional brand constraints
    soulIdEnabled?: boolean;
    originalWidth?: number;
    originalHeight?: number;
  }): Promise<{
    success: boolean;
    images?: GeneratedImage[];
    styleAnalysis?: StyleAnalysis;
    error?: string;
  }> {
    const {
      referenceImageUrl,
      productImageUrl,
      brand,
      soulIdEnabled = false,
      originalWidth,
      originalHeight,
    } = params;

    const model = "black-forest-labs/FLUX.1-kontext-dev";
    const width = originalWidth || 1080;
    const height = originalHeight || 1080;

    try {
      // Validate inputs
      if (!referenceImageUrl || !productImageUrl) {
        throw new Error("Both reference image and product image are required");
      }

      // 1. Analyze the reference image for style
      console.log("Analyzing reference image style...");
      const styleAnalysis = await this.styleAnalyzer.analyzeImageStyle(
        referenceImageUrl
      );

      // 2. Generate PURE photographic style transfer prompt (no brand logic)
      const prompt = BrandRemixService.generateStyleTransferPrompt(
        styleAnalysis,
        undefined, // No brand logic - pure photographic style only
        false // No soul ID - pure photographic style only
      );

      console.log("=== STYLE TRANSFER DEBUG ===");
      console.log("Reference Image URL:", referenceImageUrl.substring(0, 100) + "...");
      console.log("Product Image URL:", productImageUrl.substring(0, 100) + "...");
      console.log("Style Analysis:", JSON.stringify(styleAnalysis, null, 2));
      console.log("Generated prompt:", prompt);
      console.log("=== END DEBUG ===");

      // 3. Use product image as the base for transformation
      const result = await this.client.generateImage({
        model,
        prompt,
        imageUrl: productImageUrl, // The product to modify
        width,
        height,
        n: 4,
        response_format: "base64", // Switch to base64 to avoid URL timeout issues
        prompt_strength: 0.35, // Lower strength to preserve original product better
      });

      const images: GeneratedImage[] = result.map((img) => ({
        id: img.id,
        url: img.url,
        model: img.model,
        prompt: img.prompt,
        brandId: brand?.id || "style-transfer",
        soulIdEnabled: soulIdEnabled,
        generatedAt: new Date(),
        styleTransfer: true,
        referenceImage: referenceImageUrl,
      }));

      return {
        success: true,
        images,
        styleAnalysis,
      };
    } catch (error) {
      console.error("Style transfer error:", error);
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to generate style transfer";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid image URL") || error.message.includes("Image URL is required")) {
          errorMessage = "Invalid image provided. Please check that your image is accessible and in a supported format.";
        } else if (error.message.includes("API key")) {
          errorMessage = "API key validation failed. Please check your API configuration.";
        } else if (error.message.includes("localhost") || error.message.includes("file://")) {
          errorMessage = "Local file URLs are not supported. Please use publicly accessible URLs or upload your image.";
        } else if (error.message.includes("blob")) {
          errorMessage = "Blob URLs are not supported in server environment. Please convert to base64 or use HTTP URLs.";
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // UPDATED: Generate PURE style transfer prompt using photographic analysis only
  static generateStyleTransferPrompt(
    styleAnalysis: StyleAnalysis,
    brand?: BrandConfig,
    soulId: boolean = false
  ): string {
    let prompt = "";

    // PHOTOGRAPHIC STYLE TRANSFER: Copy only the vibe/mood, preserve product identity
    prompt += "Apply the photographic style and mood from the reference image to the product photo. ";
    prompt += "PRESERVE: Keep the EXACT same product with identical brand logos, text, design, and colors. ";
    prompt += "TRANSFORM: Only the lighting, background, composition, and photographic mood to match the reference style. ";
    prompt += "This is the same product shot in a different photographic style. ";

    return prompt;
  }

  // validate api key
  async validateApiKey(): Promise<boolean> {
    const togetherValid = await this.client.validateApiKey();
    const openaiValid = await this.styleAnalyzer.validateApiKey();
    return togetherValid && openaiValid;
  }

  // LEGACY: Keep old method for backward compatibility
  async remixImageLegacy(params: {
    imageUrl: string;
    brand: BrandConfig;
    soulIdEnabled: boolean;
    originalWidth?: number;
    originalHeight?: number;
  }): Promise<{ success: boolean; images?: GeneratedImage[]; error?: string }> {
    // Use the old brand replacement logic for existing implementations
    const { imageUrl, brand, soulIdEnabled, originalWidth, originalHeight } =
      params;

    const model = "black-forest-labs/FLUX.1-kontext-dev";
    const prompt = BrandRemixService.generateBrandPrompt(brand, soulIdEnabled);
    const width = originalWidth || 1080;
    const height = originalHeight || 1080;

    try {
      const result = await this.client.generateImage({
        model,
        prompt,
        imageUrl,
        width,
        height,
        n: 4,
        response_format: "base64", // Switch to base64 to avoid URL timeout issues
      });

      const images: GeneratedImage[] = result.map((img) => ({
        id: img.id,
        url: img.url,
        model: img.model,
        prompt: img.prompt,
        brandId: brand.id,
        soulIdEnabled: soulIdEnabled,
        generatedAt: new Date(),
      }));

      return {
        success: true,
        images,
      };
    } catch (error) {
      console.error("FLUX generation error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate brand remix",
      };
    }
  }

  // LEGACY: Old brand replacement prompt (kept for backward compatibility)
  static generateBrandPrompt(brand: BrandConfig, soulId: boolean): string {
    let prompt = "";

    prompt += "IMAGE TO IMAGE TRANSFORMATION: ";
    prompt +=
      "PRESERVE the exact same subject, person, pose, composition, and scene layout. ";
    prompt +=
      "DO NOT create a new image. DO NOT change the person's identity, position, or facial features. ";
    prompt += "ONLY modify clothing, accessories, colors, and brand elements. ";

    if (soulId && brand.soulPrompt) {
      prompt += brand.soulPrompt + " ";
    } else {
      prompt += brand.basePrompt + " ";
    }

    prompt += `TRANSFORM ONLY: `;
    prompt += `clothing to ${brand.name} branded items, `;
    prompt += `accessories to ${brand.name} products, `;
    prompt += `colors to ${Object.values(brand.palette).join(", ")}, `;
    prompt += `styling to ${brand.aesthetics.join(", ")} aesthetic. `;

    prompt += `BRAND EXCLUSIVITY: `;
    prompt += `Show ONLY ${brand.name} branding. `;
    prompt += `Remove all other brand logos, labels, or identifiers. `;
    prompt += `Replace competing brands with ${brand.name} equivalents. `;

    if (brand.negativePrompt) {
      prompt += `AVOID: ${brand.negativePrompt}. `;
    }

    prompt += `PHOTOGRAPHY STYLE: Professional commercial photography, `;
    prompt += `high resolution, perfect lighting, brand campaign quality. `;
    prompt += `Maintain original image's lighting direction and mood. `;

    prompt += `CRITICAL: Keep the same person, same pose, same background layout. `;
    prompt += `Only change what they're wearing and holding to ${brand.name} products.`;

    return prompt;
  }

  // NEW: Direct access to style analysis
  async analyzeStyle(imageUrl: string): Promise<StyleAnalysis> {
    return await this.styleAnalyzer.analyzeImageStyle(imageUrl);
  }

  // NEW: Compare two images for style similarity
  async compareStyles(image1Url: string, image2Url: string): Promise<number> {
    const [style1, style2] = await Promise.all([
      this.styleAnalyzer.analyzeImageStyle(image1Url),
      this.styleAnalyzer.analyzeImageStyle(image2Url),
    ]);

    return this.styleAnalyzer.compareStyles(style1, style2);
  }
}
