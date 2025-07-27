import { TogetherAIClient } from "@/lib/together-client";
import { BrandConfig } from "@/types/brand";
import { GeneratedImage } from "@/types/app";

export class BrandRemixService {
  private client: TogetherAIClient;

  constructor(apiKey: string) {
    this.client = new TogetherAIClient(apiKey);
  }

  async remixImage(params: {
    imageUrl: string;
    brand: BrandConfig;
    soulIdEnabled: boolean;
    originalWidth?: number;
    originalHeight?: number;
  }): Promise<{ success: boolean; images?: GeneratedImage[]; error?: string }> {
    const { imageUrl, brand, soulIdEnabled, originalWidth, originalHeight } =
      params;

    // Choose model based on Soul ID setting
    const model = soulIdEnabled
      ? "black-forest-labs/FLUX.1-kontext-dev"
      : "black-forest-labs/FLUX.1-kontext-dev";

    // Generate brand-specific prompt
    const prompt = BrandRemixService.generateBrandPrompt(brand, soulIdEnabled);

    // Use original dimensions or default to 1080x1080
    const width = originalWidth || 1080;
    const height = originalHeight || 1080;

    try {
      const result = await this.client.generateImage({
        model,
        prompt,
        imageUrl, // Use imageUrl parameter
        width,
        height,
        n: 4, // Generate 4 variations
        response_format: "url",
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

  static generateBrandPrompt(brand: BrandConfig, soulId: boolean): string {
    let prompt = "";

    // 1. STRICT IMAGE PRESERVATION COMMAND
    prompt += "IMAGE TO IMAGE TRANSFORMATION: ";
    prompt +=
      "PRESERVE the exact same subject, person, pose, composition, and scene layout. ";
    prompt +=
      "DO NOT create a new image. DO NOT change the person's identity, position, or facial features. ";
    prompt += "ONLY modify clothing, accessories, colors, and brand elements. ";

    // 2. BRAND TRANSFORMATION INSTRUCTION
    if (soulId && brand.soulPrompt) {
      prompt += brand.soulPrompt + " ";
    } else {
      prompt += brand.basePrompt + " ";
    }

    // 3. SPECIFIC STYLE MODIFICATIONS
    prompt += `TRANSFORM ONLY: `;
    prompt += `clothing to ${brand.name} branded items, `;
    prompt += `accessories to ${brand.name} products, `;
    prompt += `colors to ${Object.values(brand.palette).join(", ")}, `;
    prompt += `styling to ${brand.aesthetics.join(", ")} aesthetic. `;

    // 4. BRAND EXCLUSIVITY
    prompt += `BRAND EXCLUSIVITY: `;
    prompt += `Show ONLY ${brand.name} branding. `;
    prompt += `Remove all other brand logos, labels, or identifiers. `;
    prompt += `Replace competing brands with ${brand.name} equivalents. `;

    // 5. NEGATIVE PROMPTING (if available)
    if (brand.negativePrompt) {
      prompt += `AVOID: ${brand.negativePrompt}. `;
    }

    // 6. QUALITY AND STYLE SPECIFICATION
    prompt += `PHOTOGRAPHY STYLE: Professional commercial photography, `;
    prompt += `high resolution, perfect lighting, brand campaign quality. `;
    prompt += `Maintain original image's lighting direction and mood. `;

    // 7. FINAL PRESERVATION REMINDER
    prompt += `CRITICAL: Keep the same person, same pose, same background layout. `;
    prompt += `Only change what they're wearing and holding to ${brand.name} products.`;

    return prompt;
  }

  async validateApiKey(): Promise<boolean> {
    return this.client.validateApiKey();
  }
}
