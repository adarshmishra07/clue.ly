"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sparkles, Download, Share2, RotateCcw } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";

export function ResultsGallery() {
  const { image, selectedBrand, outputs, soulIdEnabled } = useCluelyStore();

  if (!outputs.length || !image || !selectedBrand) return null;

  const editedImages = outputs; // Show all 4 generated variations

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Styled Result</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{selectedBrand.name}</Badge>
              <Badge variant={soulIdEnabled ? "default" : "secondary"}>
                <Sparkles className="h-3 w-3 mr-1" />
                {soulIdEnabled ? "Deep Analysis" : "Standard"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-6">
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
                      <img
                        src={image.url}
                        alt={`Styled image ${index + 1}`}
                        className="object-contain w-full h-full"
                      />
                    </AspectRatio>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Variation {index + 1}
                      </span>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
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

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download HD
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Edit Again
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Download PNG
              </Button>
              <Button variant="outline" size="sm">
                Download JPG
              </Button>
              <Button variant="outline" size="sm">
                Download WebP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
