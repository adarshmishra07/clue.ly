// lib/style-analysis.ts
import OpenAI from "openai";

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

export interface StyleAnalysis {
  lighting: string;
  mood: string;
  composition: string;
  colorPalette: string[];
  aesthetic: string;
  description: string;
  photographyStyle: string;
  background: string;
  tone: string;
}

export class StyleAnalysisService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async analyzeImageStyle(imageUrl: string): Promise<StyleAnalysis> {
    try {
      // Try the standard OpenAI chat completions format first
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // Updated to latest model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image for PURE PHOTOGRAPHIC STYLE TRANSFER. Extract ONLY the visual aesthetic elements that can be applied to a different product, while completely IGNORING any brand elements, logos, or product-specific design.

FOCUS EXCLUSIVELY ON:
- Photography technique and camera work
- Lighting setup and quality  
- Color grading and tone
- Composition and framing
- Background treatment
- Mood and atmosphere
- Visual aesthetic style

COMPLETELY IGNORE:
- Brand logos, names, or identifiers
- Product-specific design elements
- Textual content or typography
- Brand-specific colors (focus on overall color mood instead)
- Product shape or design details

Please provide analysis in this exact JSON format:
{
  "lighting": "describe ONLY the lighting technique (dramatic directional, soft diffused, natural window, studio setup, harsh shadows, etc.)",
  "mood": "describe the emotional atmosphere (moody, bright, elegant, energetic, calm, bold, etc.)",
  "composition": "describe framing and layout (centered, rule of thirds, close-up, wide shot, angle, etc.)",
  "colorPalette": ["extract", "dominant", "color", "tones", "as", "hex", "values"],
  "aesthetic": "describe the photography aesthetic (minimalist, luxury editorial, street photography, vintage film, modern commercial, etc.)",
  "description": "comprehensive description of the PHOTOGRAPHIC STYLE ONLY for AI generation",
  "photographyStyle": "describe the specific photo technique (commercial product photography, editorial fashion, lifestyle, documentary, studio portrait, etc.)",
  "background": "describe background treatment (clean seamless, textured wall, gradient, environmental context, etc.)",
  "tone": "describe color processing (warm golden, cool blue, desaturated matte, high contrast, film grain, etc.)"
}

Extract only the photographic DNA that makes this image visually appealing, not the brand or product identity.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: await this.validateImageUrl(imageUrl),
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more consistent analysis
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      // Parse JSON response
      try {
        const analysis = JSON.parse(content) as StyleAnalysis;
        return analysis;
      } catch {
        // Fallback: extract analysis from text if JSON parsing fails
        return this.parseTextAnalysis(content);
      }
    } catch (error) {
      console.error("Style analysis error (trying alternative format):", error);

      return this.getFallbackAnalysis();
    }
  }

  private getFallbackAnalysis(): StyleAnalysis {
    return {
      lighting: "professional studio lighting",
      mood: "clean and modern",
      composition: "centered composition",
      colorPalette: ["#000000", "#ffffff", "#cccccc"],
      aesthetic: "minimalist commercial",
      description:
        "clean professional photography with modern aesthetic and balanced composition",
      photographyStyle: "commercial product photography",
      background: "clean neutral background",
      tone: "balanced neutral tones",
    };
  }

  // Fallback parser if JSON response fails
  private parseTextAnalysis(content: string): StyleAnalysis {
    const defaultAnalysis = this.getFallbackAnalysis();

    try {
      // Simple keyword extraction
      const lighting =
        this.extractKeyword(content, [
          "dramatic",
          "soft",
          "natural",
          "studio",
          "harsh",
          "ambient",
        ]) || defaultAnalysis.lighting;
      const mood =
        this.extractKeyword(content, [
          "moody",
          "bright",
          "elegant",
          "energetic",
          "calm",
          "bold",
        ]) || defaultAnalysis.mood;
      const aesthetic =
        this.extractKeyword(content, [
          "minimalist",
          "luxury",
          "street",
          "vintage",
          "modern",
          "classic",
        ]) || defaultAnalysis.aesthetic;

      return {
        ...defaultAnalysis,
        lighting,
        mood,
        aesthetic,
        description: content.slice(0, 200) + "...", // Use first part of response
      };
    } catch {
      return defaultAnalysis;
    }
  }

  private extractKeyword(text: string, keywords: string[]): string | null {
    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return keyword;
      }
    }
    return null;
  }

  // Validate and process image URL for OpenAI API
  private async validateImageUrl(imageUrl: string): Promise<string> {
    // Handle different image URL formats
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    console.log("🔄 Processing image URL for style analysis:", imageUrl.substring(0, 100) + "...");

    try {
      // If it's already a proper HTTP URL, use as is
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        console.log("✅ Valid HTTP URL, using directly");
        return imageUrl;
      }

      // If it's base64 data URL, use as is
      if (imageUrl.startsWith("data:image/")) {
        console.log("✅ Valid data URL, using directly");
        return imageUrl;
      }

      // If it's a blob URL, convert to base64
      if (imageUrl.startsWith("blob:")) {
        console.log("🔄 Converting blob URL to base64 for style analysis...");
        const base64Data = await blobToBase64(imageUrl);
        return `data:image/jpeg;base64,${base64Data}`;
      }

      // Reject localhost or file URLs
      if (imageUrl.includes("localhost") || imageUrl.startsWith("file://")) {
        throw new Error("Localhost/file URLs not supported for style analysis");
      }

      // If it's base64 string without data URL prefix, add it
      if (imageUrl.length > 100 && !imageUrl.startsWith("http")) {
        console.log("🔄 Adding data URL prefix to base64 string");
        return `data:image/jpeg;base64,${imageUrl}`;
      }

      throw new Error(
        `Invalid image URL format: ${imageUrl.substring(0, 50)}...`
      );
    } catch (error) {
      console.error("❌ Error processing image URL for style analysis:", error);
      throw error;
    }
  }

  // Generate a detailed prompt from PHOTOGRAPHIC style analysis only
  generateStylePrompt(analysis: StyleAnalysis): string {
    let prompt = "";

    // Core photographic aesthetic (not brand aesthetic)
    prompt += `${analysis.aesthetic} photographic treatment with ${analysis.mood} emotional atmosphere. `;

    // Lighting technique (technical photography aspect)
    prompt += `Lighting: ${analysis.lighting} setup and direction. `;

    // Composition and framing (camera work)
    prompt += `Composition: ${analysis.composition} framing approach. `;

    // Photography technique (camera and processing style)
    prompt += `Photography technique: ${analysis.photographyStyle} execution. `;

    // Background treatment (environmental styling)
    prompt += `Background styling: ${analysis.background}. `;

    // Color grading and processing (post-production style)
    prompt += `Color processing: ${analysis.tone} treatment. `;

    // Color palette (for grading, not product colors)
    if (analysis.colorPalette.length > 0) {
      prompt += `Color grading palette: ${analysis.colorPalette.join(", ")} (apply as photographic treatment, not product colors). `;
    }

    // Overall photographic DNA
    prompt += `Photographic essence: ${analysis.description}`;

    return prompt;
  }

  // Batch analyze multiple images for comparison
  async batchAnalyze(imageUrls: string[]): Promise<StyleAnalysis[]> {
    const analyses = await Promise.allSettled(
      imageUrls.map((url) => this.analyzeImageStyle(url))
    );

    return analyses.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(`Failed to analyze image ${index}:`, result.reason);
        return this.getFallbackAnalysis();
      }
    });
  }

  // Compare two styles for similarity
  compareStyles(style1: StyleAnalysis, style2: StyleAnalysis): number {
    let similarity = 0;
    let factors = 0;

    // Compare categorical elements
    const categoricalMatches = [
      style1.lighting === style2.lighting,
      style1.mood === style2.mood,
      style1.aesthetic === style2.aesthetic,
      style1.photographyStyle === style2.photographyStyle,
      style1.tone === style2.tone,
    ];

    similarity += categoricalMatches.filter(Boolean).length;
    factors += categoricalMatches.length;

    // Compare color palettes
    const commonColors = style1.colorPalette.filter((color) =>
      style2.colorPalette.includes(color)
    ).length;

    if (style1.colorPalette.length > 0 && style2.colorPalette.length > 0) {
      similarity +=
        commonColors /
        Math.max(style1.colorPalette.length, style2.colorPalette.length);
      factors += 1;
    }

    return factors > 0 ? similarity / factors : 0;
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error("OpenAI API key validation failed:", error);
      return false;
    }
  }
}
