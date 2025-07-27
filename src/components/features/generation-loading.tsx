"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Palette, Wand2 } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";

export function GenerationLoading() {
  const { generationProgress, generationStep, selectedBrand, soulIdEnabled } =
    useCluelyStore();

  const loadingSteps = [
    { id: 1, title: "Analyzing Image", icon: Palette, progress: 0 },
    { id: 2, title: "Extracting Aesthetics", icon: Sparkles, progress: 25 },
    { id: 3, title: "Applying Brand Style", icon: Wand2, progress: 50 },
    { id: 4, title: "Generating Variations", icon: Zap, progress: 75 },
    { id: 5, title: "Finalizing Results", icon: Sparkles, progress: 100 },
  ];

  const currentStep =
    loadingSteps.find((step) => step.progress <= generationProgress) ||
    loadingSteps[0];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-xl">Creating Your Brand Remix</CardTitle>
          <p className="text-muted-foreground text-sm">
            Applying {selectedBrand?.name} aesthetics to your image
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>

          {/* Current Step */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <currentStep.icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{currentStep.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{generationStep}</p>
          </div>

          {/* Brand Info */}
          {selectedBrand && (
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline">{selectedBrand.name}</Badge>
              <Badge variant={soulIdEnabled ? "default" : "secondary"}>
                <Sparkles className="h-3 w-3 mr-1" />
                {soulIdEnabled ? "Deep Analysis" : "Standard"}
              </Badge>
            </div>
          )}

          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
