"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Zap, X, RotateCcw } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";
import { useBrandRemix } from "@/hooks/use-brand-remix";

export function GenerationProgress() {
  const {
    isGenerating,
    generationProgress,
    generationStep,
    generationError,
    selectedBrand,
    soulIdEnabled,
  } = useCluelyStore();

  const { generateRemix, canGenerate } = useBrandRemix();
  const [progressAnimation, setProgressAnimation] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (isGenerating && generationProgress > 0) {
      setProgressAnimation(generationProgress);
    }
  }, [generationProgress, isGenerating]);

  if (!selectedBrand) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="overflow-hidden shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Aesthetic Application</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{selectedBrand.name}</Badge>
              <Badge variant={soulIdEnabled ? "default" : "secondary"}>
                <Zap className="h-3 w-3 mr-1" />
                {soulIdEnabled ? "Deep Analysis" : "Standard"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isGenerating ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Applying aesthetic to your brand...</span>
                  <span>{Math.round(progressAnimation)}%</span>
                </div>
                <Progress value={progressAnimation} className="h-2" />
              </div>

              {/* Step Indicator */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {generationStep || "Processing..."}
                  </span>
                </div>
              </div>

              {/* Loading Animation */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Generation Info */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Creating 4 styled variations for {selectedBrand.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {soulIdEnabled
                    ? "Using FLUX.1-pro for deep aesthetic analysis"
                    : "Using FLUX.1-dev for standard styling"}
                </p>
              </div>
            </div>
          ) : generationError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>{generationError}</AlertDescription>
              </Alert>

              <div className="flex justify-center space-x-2">
                <Button onClick={generateRemix} disabled={!canGenerate}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Styling
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Ready State */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Ready to Style</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to apply the extracted aesthetic to
                    your brand
                  </p>
                </div>

                <Button
                  onClick={generateRemix}
                  disabled={!canGenerate}
                  size="lg"
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Aesthetic to Brand
                </Button>
              </div>

              {/* Generation Preview */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
