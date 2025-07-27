import { BrandConfig } from "./brand";

export interface ImageState {
  id: string;
  url: string;
  file: File;
  width: number;
  height: number;
  size: number;
  uploadedAt: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  model: string;
  prompt: string;
  brandId: string;
  soulIdEnabled: boolean;
  generatedAt: Date;
}

export type UploadMethod = "paste" | "drag" | "tap" | "camera";
export type GridView = "2x2" | "carousel";
export type DownloadFormat = "png" | "jpg" | "webp";
export type ActiveView = "upload" | "brand-select" | "results" | "generation";

export interface CluelyState {
  // Core State
  image: ImageState | null;
  selectedBrand: BrandConfig | null;
  soulIdEnabled: boolean;
  outputs: GeneratedImage[];

  // UI State
  isGenerating: boolean;
  uploadProgress: number;
  activeView: ActiveView;
  uploadMethod: UploadMethod;
  gridView: GridView;
  downloadFormat: DownloadFormat;

  // Generation State
  generationProgress: number;
  generationStep: string;
  generationError: string | null;
}

export interface CluelyActions {
  setImage: (image: ImageState | null) => void;
  selectBrand: (brand: BrandConfig) => void;
  toggleSoulId: () => void;
  generateRemix: () => Promise<void>;
  resetSession: () => void;
  editAgain: () => void;
  setUploadProgress: (progress: number) => void;
  setActiveView: (view: ActiveView) => void;
  setGenerationProgress: (progress: number, step?: string) => void;
  setGenerationError: (error: string | null) => void;
  setOutputs: (outputs: GeneratedImage[]) => void;
}

export interface CluelyStore extends CluelyState, CluelyActions {}

// API Response Types
export interface GenerationResponse {
  success: boolean;
  images?: GeneratedImage[];
  error?: string;
  model?: string;
  prompt?: string;
}

export interface UploadResponse {
  success: boolean;
  image?: ImageState;
  error?: string;
}

// Error Types
export interface CluelyError {
  code: string;
  message: string;
  details?: string;
  retryable: boolean;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Social Sharing Types
export interface ShareConfig {
  platform: "instagram" | "tiktok" | "twitter" | "facebook";
  format: DownloadFormat;
  includeBrand: boolean;
  customMessage?: string;
}
