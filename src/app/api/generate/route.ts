import { NextRequest, NextResponse } from "next/server";
import { BrandRemixService } from "@/services/remix-service";
import { BrandConfig } from "@/types/brand";

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const brandData = formData.get("brand") as string;
    const soulIdEnabled = formData.get("soulIdEnabled") === "true";
    const originalWidth =
      parseInt(formData.get("originalWidth") as string) || undefined;
    const originalHeight =
      parseInt(formData.get("originalHeight") as string) || undefined;

    // Validate required fields
    if (!imageFile || !brandData) {
      return NextResponse.json(
        { success: false, error: "Image and brand data required" },
        { status: 400 }
      );
    }

    // Parse brand config
    let brand: BrandConfig;
    try {
      brand = JSON.parse(brandData);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid brand data" },
        { status: 400 }
      );
    }

    // Validate API keys
    const apiKey = process.env.TOGETHER_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !openaiApiKey) {
      return NextResponse.json(
        { success: false, error: "Together AI or OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Create remix service
    const remixService = new BrandRemixService(apiKey, openaiApiKey);

    // Validate API key with Together AI
    const isValidKey = await remixService.validateApiKey();
    if (!isValidKey) {
      return NextResponse.json(
        { success: false, error: "Invalid Together AI API key" },
        { status: 500 }
      );
    }

    // Generate brand remix using legacy method for backward compatibility
    const result = await remixService.remixImageLegacy({
      imageUrl: base64Image, // Pass base64 data
      brand,
      soulIdEnabled,
      originalWidth,
      originalHeight,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Generation failed",
      },
      { status: 500 }
    );
  }
}
