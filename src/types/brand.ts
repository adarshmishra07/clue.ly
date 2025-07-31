export type BrandCategory =
  | "athletic"
  | "tech"
  | "streetwear"
  | "beauty"
  | "automotive"
  | "outdoor"
  | "luxury"
  | "entertainment"
  | "music"
  | "travel";

export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface BrandFonts {
  primary: string;
  secondary?: string;
  weights: number[];
}

export interface BrandConfig {
  id: string;
  name: string;
  category: BrandCategory;
  soulId: string;

  // Visual DNA
  palette: BrandPalette;
  fonts: BrandFonts;

  // Style Attributes
  motifs: string[];
  aesthetics: string[];
  keywords: string[];

  // AI Prompting
  basePrompt: string;
  soulPrompt?: string; // Enhanced prompt for Soul ID mode
  negativePrompt?: string;

  // Style Transfer Reference
  referenceImageUrl: string; // High-quality reference image that represents this brand's photographic style/vibe

  // Metadata
  logoUrl: string;
  description: string;
  launchDate: Date;
  popularity: number;
}

export interface FluxModelConfig {
  id: string;
  name: string;
  maxSteps: number;
  optimalSteps: number;
  maxResolution: number;
  supportsImageToImage: boolean;
  costMultiplier: number;
}

export const FLUX_MODELS: Record<string, FluxModelConfig> = {
  dev: {
    id: "black-forest-labs/FLUX.1-dev",
    name: "FLUX.1 Dev",
    maxSteps: 50,
    optimalSteps: 20,
    maxResolution: 1024,
    supportsImageToImage: true,
    costMultiplier: 1,
  },
  pro: {
    id: "black-forest-labs/FLUX.1-pro",
    name: "FLUX.1 Pro",
    maxSteps: 100,
    optimalSteps: 50,
    maxResolution: 2048,
    supportsImageToImage: true,
    costMultiplier: 3,
  },
};
