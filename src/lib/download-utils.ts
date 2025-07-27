/**
 * Utility functions for downloading images in different formats
 */

export interface DownloadOptions {
  format: "png" | "jpg" | "webp";
  quality?: number;
  filename?: string;
}

/**
 * Download an image from a URL with specified options
 */
export async function downloadImage(
  imageUrl: string,
  options: DownloadOptions
): Promise<void> {
  try {
    // Handle both blob URLs and regular URLs
    let blob: Blob;

    if (imageUrl.startsWith("blob:")) {
      // For blob URLs, we need to fetch them differently
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      blob = await response.blob();
    } else {
      // For regular URLs
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      blob = await response.blob();
    }

    // Create canvas for format conversion if needed
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx?.drawImage(img, 0, 0);

        // Convert to desired format
        const mimeType = getMimeType(options.format);
        const quality = options.quality || 0.9;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image"));
              return;
            }

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
              options.filename || `styled-image.${options.format}`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            URL.revokeObjectURL(url);
            resolve();
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error("Download failed:", error);
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error(
        "Unable to download image. This might be due to browser security restrictions."
      );
    }
    throw error;
  }
}

/**
 * Download all generated images as a zip file
 */
export async function downloadAllImages(
  images: Array<{ url: string; id: string }>,
  options: DownloadOptions
): Promise<void> {
  try {
    // For now, download images one by one
    // In a production app, you might want to use a library like JSZip
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await downloadImage(image.url, {
        ...options,
        filename: `styled-image-${i + 1}.${options.format}`,
      });

      // Small delay between downloads to prevent browser blocking
      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error("Batch download failed:", error);
    throw error;
  }
}

/**
 * Get MIME type for image format
 */
function getMimeType(format: string): string {
  switch (format) {
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `${prefix}-${timestamp}.${format}`;
}
