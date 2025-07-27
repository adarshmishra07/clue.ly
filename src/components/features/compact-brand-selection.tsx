"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Zap, Play } from "lucide-react";
import { useCluelyStore } from "@/store/cluely-store";
import { BRANDS } from "@/data/brands";
import { BrandConfig } from "@/types/brand";
import { useBrandRemix } from "@/hooks/use-brand-remix";
import { GenerationLoading } from "./generation-loading";

export function CompactBrandSelection() {
  const { selectedBrand, soulIdEnabled, selectBrand } = useCluelyStore();
  const { generateRemix, isGenerating } = useBrandRemix();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", count: BRANDS.length },
    {
      id: "athletic",
      name: "Athletic",
      count: BRANDS.filter((b) => b.category === "athletic").length,
    },
    {
      id: "tech",
      name: "Tech",
      count: BRANDS.filter((b) => b.category === "tech").length,
    },
    {
      id: "streetwear",
      name: "Streetwear",
      count: BRANDS.filter((b) => b.category === "streetwear").length,
    },
    {
      id: "beauty",
      name: "Beauty",
      count: BRANDS.filter((b) => b.category === "beauty").length,
    },
    {
      id: "automotive",
      name: "Auto",
      count: BRANDS.filter((b) => b.category === "automotive").length,
    },
  ];

  const filteredBrands =
    selectedCategory === "all"
      ? BRANDS
      : BRANDS.filter((brand) => brand.category === selectedCategory);

  const handleBrandSelect = (brand: BrandConfig) => {
    selectBrand(brand);
  };

  const handleGenerate = async () => {
    if (selectedBrand) {
      await generateRemix();
    }
  };

  return isGenerating ? (
    <GenerationLoading />
  ) : (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Choose Your Brand</h2>
        <p className="text-muted-foreground text-sm">
          Select a brand to apply its aesthetic to your image
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="text-xs"
          >
            {category.name}
            <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Brand Grid - Desktop */}
      <div className="hidden md:grid md:grid-cols-4 gap-2">
        {filteredBrands.map((brand) => (
          <CompactBrandCard
            key={brand.id}
            brand={brand}
            isSelected={selectedBrand?.id === brand.id}
            onSelect={handleBrandSelect}
          />
        ))}
      </div>

      {/* Brand Grid - Mobile */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2">
          {filteredBrands.map((brand) => (
            <CompactBrandCard
              key={brand.id}
              brand={brand}
              isSelected={selectedBrand?.id === brand.id}
              onSelect={handleBrandSelect}
            />
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {selectedBrand && (
        <div className="space-y-4">
          <Separator />
          <div className="text-center space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Badge variant="default" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {soulIdEnabled ? "Deep Analysis" : "Standard Mode"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedBrand.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              {selectedBrand.description}
            </p>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full max-w-xs"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Steal the Style
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CompactBrandCardProps {
  brand: BrandConfig;
  isSelected: boolean;
  onSelect: (brand: BrandConfig) => void;
}

function CompactBrandCard({
  brand,
  isSelected,
  onSelect,
}: CompactBrandCardProps) {
  return (
    <HoverCard key={brand.id}>
      <HoverCardTrigger asChild>
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            isSelected
              ? "ring-2 ring-primary bg-primary/5 shadow-md"
              : "hover:bg-muted/50"
          }`}
          onClick={() => onSelect(brand)}
        >
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs">{brand.name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {brand.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Brand Description */}
            <p className="text-xs text-muted-foreground">{brand.description}</p>

            {/* Brand Colors */}
            <div className="flex gap-1 justify-center">
              {Object.values(brand.palette)
                .slice(0, 3)
                .map((color, index) => (
                  <div
                    key={index}
                    className="w-1.5 h-1.5 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-popover border shadow-lg z-50">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-base sm:text-lg">
              {brand.name} Brand DNA
            </h4>
            <p className="text-sm text-muted-foreground">{brand.description}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-foreground">
              Aesthetics:
            </div>
            <div className="flex flex-wrap gap-1">
              {brand.aesthetics.map((aesthetic) => (
                <Badge key={aesthetic} variant="outline" className="text-xs">
                  {aesthetic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-foreground">
              Color Palette:
            </div>
            <div className="flex gap-2">
              {Object.entries(brand.palette).map(([key, color]) => (
                <div key={key} className="flex flex-col items-center space-y-1">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-foreground">Motifs:</div>
            <div className="flex flex-wrap gap-1">
              {brand.motifs.map((motif) => (
                <Badge key={motif} variant="secondary" className="text-xs">
                  {motif}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
