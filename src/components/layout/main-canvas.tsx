"use client";

import { useCluelyStore } from "@/store/cluely-store";
import { UploadZone } from "@/components/features/upload-zone";
import { ResultsGallery } from "@/components/features/results-gallery";
import { GenerationLoading } from "@/components/features/generation-loading";
import { CompactBrandSelection } from "../features/compact-brand-selection";
import { Button } from "@/components/ui/button";
import { Palette, RotateCcw } from "lucide-react";

export function MainCanvas() {
  const {
    image,
    selectedBrand,
    outputs,
    activeView,
    isGenerating,
    resetSession,
  } = useCluelyStore();

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Left Panel - Upload & Image Display */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r bg-sidebar overflow-hidden">
        <div className="h-full flex flex-col">
          {!image ? (
            /* Upload State */
            <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center">
                  Upload Reference Image
                </h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Upload any image whose aesthetic you want to steal for your
                  brand
                </p>
                <UploadZone />
              </div>
            </div>
          ) : (
            /* Image Display State */
            <div className="h-full w-full">
              <img
                src={image.url}
                alt="Reference image"
                className="w-full h-full object-contain bg-muted"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Brand Selection & Results */}
      <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Reset Button - Only show when user is in process */}
          {image && (
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSession}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
          )}

          {!image ? (
            /* No Image State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Palette className="h-16 w-16 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight">
                    See it. Steal it.
                  </h3>
                  <p className="text-muted-foreground max-w-md text-lg">
                    Upload a reference image to extract its aesthetic and apply
                    it to your brand content
                  </p>
                </div>
              </div>
            </div>
          ) : outputs.length === 0 ? (
            /* Brand Selection & Generation State */
            <div className="flex-1">
              <CompactBrandSelection />
            </div>
          ) : (
            /* Results State */
            <div className="flex-1">
              <ResultsGallery />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
