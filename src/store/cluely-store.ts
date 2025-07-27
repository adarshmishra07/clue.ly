import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  CluelyStore,
  ActiveView,
  UploadMethod,
  GridView,
  DownloadFormat,
  GeneratedImage,
} from "@/types/app";
// Removed unused BrandConfig import

const initialState = {
  // Core State
  image: null,
  selectedBrand: null,
  soulIdEnabled: false,
  outputs: [],

  // UI State
  isGenerating: false,
  uploadProgress: 0,
  activeView: "upload" as ActiveView,
  uploadMethod: "tap" as UploadMethod,
  gridView: "2x2" as GridView,
  downloadFormat: "png" as DownloadFormat,

  // Generation State
  generationProgress: 0,
  generationStep: "",
  generationError: null,
};

export const useCluelyStore = create<CluelyStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Core Actions
      setImage: (image) => {
        set({ image, uploadProgress: image ? 100 : 0 });
      },

      selectBrand: (brand) => {
        set({ selectedBrand: brand });
      },

      toggleSoulId: () => {
        const { soulIdEnabled } = get();
        set({ soulIdEnabled: !soulIdEnabled });
      },

      generateRemix: async () => {
        const { image, selectedBrand } = get();

        if (!image || !selectedBrand) {
          throw new Error("Image and brand selection required");
        }

        set({
          isGenerating: true,
          generationProgress: 0,
          generationStep: "Initializing generation...",
          generationError: null,
        });

        try {
          // TODO: Implement actual AI generation
          // This is a placeholder for the generation logic
          await new Promise((resolve) => setTimeout(resolve, 3000));

          set({
            isGenerating: false,
            generationProgress: 100,
            activeView: "results",
          });
        } catch (error) {
          set({
            isGenerating: false,
            generationError:
              error instanceof Error ? error.message : "Generation failed",
          });
        }
      },

      resetSession: () => {
        set(initialState);
      },

      // UI Actions
      setUploadProgress: (progress) => {
        set({ uploadProgress: progress });
      },

      setActiveView: (view) => {
        set({ activeView: view });
      },

      setGenerationProgress: (progress, step) => {
        set({
          generationProgress: progress,
          generationStep: step || get().generationStep,
        });
      },

      setOutputs: (outputs: GeneratedImage[]) => {
        set({ outputs });
      },

      setGenerationError: (error) => {
        set({ generationError: error });
      },

      // Edit Again Action
      editAgain: () => {
        const { image, selectedBrand } = get();
        if (image && selectedBrand) {
          set({
            outputs: [],
            isGenerating: false,
            generationProgress: 0,
            generationStep: "",
            generationError: null,
            activeView: "brand-select",
          });
        }
      },
    }),
    {
      name: "cluely-store",
    }
  )
);
