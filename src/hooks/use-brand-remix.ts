"use client";

import { useState } from "react";
import { useCluelyStore } from "@/store/cluely-store";
import { toast } from "sonner";

// Convert blob URL to File object
async function blobToFile(
  blobUrl: string,
  fileName: string = "image.jpg"
): Promise<File> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // Create a canvas to compress the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Calculate new dimensions (max 1024px)
        const maxSize = 1024;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob, then to File
        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              const file = new File([compressedBlob], fileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(file);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          0.8
        ); // 80% quality
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to file:", error);
    throw new Error("Failed to convert image to file");
  }
}

export function useBrandRemix() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    image,
    selectedBrand,
    soulIdEnabled,
    setOutputs,
    setGenerationProgress,
    setGenerationError,
    setActiveView,
  } = useCluelyStore();

  const generateRemix = async () => {
    if (!image || !selectedBrand) {
      toast.error("Please upload an image and select a brand first");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(0, "Initializing generation...");

    try {
      // Convert blob URL to file on client-side
      setGenerationProgress(10, "Converting image...");
      const imageFile = await blobToFile(image.url);

      // Create form data
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("brand", JSON.stringify(selectedBrand));
      formData.append("soulIdEnabled", soulIdEnabled.toString());
      if (image.width) formData.append("originalWidth", image.width.toString());
      if (image.height)
        formData.append("originalHeight", image.height.toString());

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const currentProgress = Math.floor(Math.random() * 90);
        setGenerationProgress(currentProgress, "Processing...");
      }, 1000);

      // Call API route
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      clearInterval(progressInterval);

      if (result.success && result.images) {
        setOutputs(result.images);
        setGenerationProgress(100, "Generation complete!");
        setActiveView("results");
        toast.success("Brand remix generated successfully!");
      } else {
        setGenerationError(result.error || "Generation failed");
        toast.error(result.error || "Generation failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Generation failed";
      setGenerationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = image && selectedBrand && !isGenerating;

  return {
    generateRemix,
    isGenerating,
    canGenerate,
  };
}
