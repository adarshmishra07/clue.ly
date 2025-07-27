"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sparkles, Download, Share2, RotateCcw } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";
import Image from "next/image";
import {
  downloadImage,
  downloadAllImages,
  generateFilename,
} from "@/lib/download-utils";
import { shareImage, shareAllImages } from "@/lib/share-utils";
import { toast } from "sonner";

export function ResultsGallery() {
  const { image, selectedBrand, outputs, soulIdEnabled, editAgain } =
    useCluelyStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!outputs.length || !image || !selectedBrand) return null;

  const editedImages = outputs; // Show all 4 generated variations

  // Download handlers
  const handleDownloadSingle = async (imageUrl: string, index: number) => {
    try {
      setIsDownloading(true);
      const filename = generateFilename(`styled-image-${index + 1}`, "png");
      await downloadImage(imageUrl, { format: "png", filename });
      toast.success(`Downloaded variation ${index + 1}`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async (format: "png" | "jpg" | "webp") => {
    try {
      setIsDownloading(true);
      await downloadAllImages(editedImages, { format });
      toast.success(`Downloaded all ${editedImages.length} images`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Share handlers
  const handleShareSingle = async (imageUrl: string, index: number) => {
    try {
      setIsSharing(true);
      const success = await shareImage(imageUrl, selectedBrand.name);
      if (success) {
        toast.success(`Shared variation ${index + 1}`);
      } else {
        toast.error("Share failed. Please try again.");
      }
    } catch (error) {
      toast.error("Share failed. Please try again.");
      console.error("Share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareAll = async () => {
    try {
      setIsSharing(true);
      const success = await shareAllImages(editedImages, selectedBrand.name);
      if (success) {
        toast.success("Shared all images");
      } else {
        toast.error("Share failed. Please try again.");
      }
    } catch (error) {
      toast.error("Share failed. Please try again.");
      console.error("Share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Edit again handler
  const handleEditAgain = () => {
    editAgain();
    toast.success("Ready to edit again!");
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Styled Result</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {selectedBrand.name}
              </Badge>
              <Badge
                variant={soulIdEnabled ? "default" : "secondary"}
                className="text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {soulIdEnabled ? "Deep Analysis" : "Standard"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generated Results Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {selectedBrand.name} Styled Results
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {editedImages.map((image, index) => (
                <div key={image.id} className="space-y-2">
                  <AspectRatio
                    ratio={1}
                    className="bg-muted rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt={`Styled image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </AspectRatio>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Variation {index + 1}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadSingle(image.url, index)}
                        disabled={isDownloading}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {isDownloading ? "..." : "Download"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareSingle(image.url, index)}
                        disabled={isSharing}
                        className="text-xs"
                      >
                        <Share2 className="h-3 w-3" />
                        {isSharing ? "..." : ""}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Download Options</h3>
                <p className="text-xs text-muted-foreground">
                  Save your styled image in high quality
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {editedImages[0]?.model.includes("pro")
                    ? "FLUX.1-pro"
                    : "FLUX.1-dev"}
                </Badge>
                {editedImages[0]?.soulIdEnabled && (
                  <Badge variant="default" className="text-xs">
                    Deep Analysis
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleDownloadAll("png")}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download HD"}
              </Button>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleShareAll}
                  disabled={isSharing}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {isSharing ? "Sharing..." : "Share"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleEditAgain}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Edit Again
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadAll("png")}
                disabled={isDownloading}
                className="text-xs"
              >
                Download PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadAll("jpg")}
                disabled={isDownloading}
                className="text-xs"
              >
                Download JPG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadAll("webp")}
                disabled={isDownloading}
                className="text-xs"
              >
                Download WebP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
