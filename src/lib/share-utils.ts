/**
 * Utility functions for sharing images and content
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

/**
 * Share content using Web Share API with fallback
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  try {
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare) {
      const shareData: ShareData = {
        title: options.title || "Styled Image from Clue.ly",
        text: options.text || "Check out this styled image created with AI!",
        url: options.url || window.location.href,
      };

      // Add files if supported
      if (options.files && navigator.canShare({ files: options.files })) {
        shareData.files = options.files;
      }

      await navigator.share(shareData);
      return true;
    } else {
      // Fallback: copy to clipboard
      const shareText = `${options.title || "Styled Image from Clue.ly"}\n${
        options.text || "Check out this styled image created with AI!"
      }\n${options.url || window.location.href}`;
      await copyToClipboard(shareText);
      return true;
    }
  } catch (error) {
    console.error("Share failed:", error);
    return false;
  }
}

/**
 * Share a specific image
 */
export async function shareImage(
  imageUrl: string,
  brandName?: string
): Promise<boolean> {
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

    const file = new File([blob], "styled-image.png", { type: "image/png" });

    return await shareContent({
      title: `Styled with ${brandName || "AI"}`,
      text: `Check out this image styled with ${brandName || "AI"} on Clue.ly!`,
      files: [file],
    });
  } catch (error) {
    console.error("Image share failed:", error);
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.error("Share failed due to browser security restrictions");
    }
    return false;
  }
}

/**
 * Share all generated images
 */
export async function shareAllImages(
  images: Array<{ url: string; id: string }>,
  brandName?: string
): Promise<boolean> {
  try {
    // Convert image URLs to Files for sharing
    const files: File[] = [];

    for (let i = 0; i < images.length; i++) {
      let blob: Blob;

      if (images[i].url.startsWith("blob:")) {
        // For blob URLs, we need to fetch them differently
        const response = await fetch(images[i].url);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        blob = await response.blob();
      } else {
        // For regular URLs
        const response = await fetch(images[i].url);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        blob = await response.blob();
      }

      const file = new File([blob], `styled-image-${i + 1}.png`, {
        type: "image/png",
      });
      files.push(file);
    }

    return await shareContent({
      title: `Styled Collection with ${brandName || "AI"}`,
      text: `Check out these ${images.length} styled images created with ${
        brandName || "AI"
      } on Clue.ly!`,
      files,
    });
  } catch (error) {
    console.error("Multiple images share failed:", error);
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.error("Share failed due to browser security restrictions");
    }
    return false;
  }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("execCommand copy failed:", err);
        throw new Error("Copy to clipboard not supported");
      }

      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
    throw error;
  }
}

/**
 * Generate social media share URLs
 */
export function getSocialShareUrls(
  url: string,
  title: string,
  text: string
): Record<string, string> {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
  };
}

/**
 * Open social media share in new window
 */
export function openSocialShare(platform: string, url: string): void {
  const shareUrls = getSocialShareUrls(
    url,
    "Styled Image",
    "Check out this styled image!"
  );
  const shareUrl = shareUrls[platform as keyof typeof shareUrls];

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
}
