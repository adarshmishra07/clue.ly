"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";
import { ImageState } from "@/types/app";
import Image from "next/image";

export function UploadZone() {
  const { image, uploadProgress, setImage, setUploadProgress } =
    useCluelyStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setIsProcessing(true);
      setUploadProgress(0);

      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload an image file");
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File size must be less than 5MB");
        }

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Create image preview
        const url = URL.createObjectURL(file);

        // Get image dimensions
        const img = new window.Image();
        img.onload = () => {
          const imageState: ImageState = {
            id: crypto.randomUUID(),
            url,
            file,
            width: img.width,
            height: img.height,
            size: file.size,
            uploadedAt: new Date(),
          };

          setImage(imageState);
          setIsProcessing(false);
        };

        img.src = url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setIsProcessing(false);
        setUploadProgress(0);
      }
    },
    [setImage, setUploadProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  // Removed unused handleRemoveImage function - functionality handled by reset button

  return (
    <div className="w-full">
      <Card className="overflow-hidden shadow-lg border-0">
        <CardContent className="p-6">
          {!image ? (
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }
                ${isProcessing ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input {...getInputProps()} />

              {isProcessing ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <Progress
                    value={uploadProgress}
                    className="w-full max-w-xs mx-auto"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {isDragActive
                        ? "Drop your reference image here"
                        : "Upload reference image"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Upload any image whose aesthetic you want to steal for
                      your brand
                    </p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Camera
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Camera Upload</DialogTitle>
                        </DialogHeader>
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Camera functionality coming soon...
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <AspectRatio
                ratio={16 / 9}
                className="rounded-lg overflow-hidden border shadow-lg"
              >
                <Image
                  src={image.url}
                  alt="Uploaded image"
                  fill
                  className="object-contain bg-muted"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </AspectRatio>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
