"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Zap, RotateCcw, Settings } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";
import { useBrandRemix } from "@/hooks/use-brand-remix";

export function ImageEditor() {
  const { image, selectedBrand, soulIdEnabled } = useCluelyStore();
  const { generateRemix, isGenerating, canGenerate } = useBrandRemix();

  const [activeTab, setActiveTab] = useState("preview");

  if (!image || !selectedBrand) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Image Editor</span>
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
        <CardContent className="flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Before & After</TabsTrigger>
              <TabsTrigger value="controls">Edit Controls</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col lg:flex-row gap-4">
                {/* Before Image */}
                <div className="flex-1">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Original
                    </h3>
                    <AspectRatio
                      ratio={16 / 9}
                      className="bg-muted rounded-xl overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt="Original image"
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                </div>

                {/* After Image (Placeholder) */}
                <div className="flex-1">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Styled
                    </h3>
                    <AspectRatio
                      ratio={16 / 9}
                      className="bg-muted rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20"
                    >
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Click &quot;Apply Style&quot; to see result
                          </p>
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="flex-1 flex flex-col">
              <div className="space-y-6">
                {/* Brand Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">
                    Selected Brand: {selectedBrand.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Aesthetics:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedBrand.aesthetics
                          .slice(0, 3)
                          .map((aesthetic) => (
                            <Badge
                              key={aesthetic}
                              variant="outline"
                              className="text-xs"
                            >
                              {aesthetic}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Colors:
                      </span>
                      <div className="flex space-x-1">
                        {Object.values(selectedBrand.palette)
                          .slice(0, 3)
                          .map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
              </div>
            </TabsContent>
          </Tabs>
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={generateRemix}
              disabled={!canGenerate || isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Applying Style...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Style to Image
                </>
              )}
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
