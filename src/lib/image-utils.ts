import Together from "together-ai";

export function getAdjustedDimensions(
  width: number,
  height: number
): { width: number; height: number } {
  const maxDim = 1024;
  const minDim = 64;

  const roundToMultipleOf16 = (n: number) => Math.round(n / 16) * 16;

  const aspectRatio = width / height;

  let scaledWidth = width;
  let scaledHeight = height;

  if (width > maxDim || height > maxDim) {
    if (aspectRatio >= 1) {
      scaledWidth = maxDim;
      scaledHeight = Math.round(maxDim / aspectRatio);
    } else {
      scaledHeight = maxDim;
      scaledWidth = Math.round(maxDim * aspectRatio);
    }
  }

  const adjustedWidth = Math.min(
    maxDim,
    Math.max(minDim, roundToMultipleOf16(scaledWidth))
  );
  const adjustedHeight = Math.min(
    maxDim,
    Math.max(minDim, roundToMultipleOf16(scaledHeight))
  );

  return { width: adjustedWidth, height: adjustedHeight };
}

export function getTogether(apiKey: string): Together {
  return new Together({
    apiKey,
  });
}

export async function blobToBase64(blobUrl: string): Promise<string> {
  try {
    // Fetch the blob data
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to base64:", error);
    throw new Error("Failed to convert image to base64");
  }
}
