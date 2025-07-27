import { BrandConfig } from "@/types/brand";

export const BRANDS: BrandConfig[] = [
  {
    id: "nike",
    name: "Nike",
    category: "athletic",
    soulId: "nike-soul",
    palette: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#ff6b35",
      background: "#f8f9fa",
    },
    fonts: {
      primary: "Futura",
      weights: [400, 700],
    },
    motifs: ["swoosh", "athletic wear", "dynamic lines", "performance gear"],
    aesthetics: ["sporty", "energetic", "bold", "minimalist"],
    keywords: ["athletic", "performance", "sport", "movement"],
    basePrompt:
      "Style transfer to Nike aesthetic. Convert clothing to Nike athletic wear with swoosh logos. Add Nike branded shoes, accessories. Use black, white, orange color scheme. Maintain athletic, performance-focused styling. Professional sports photography lighting.",
    soulPrompt:
      "Authentic Nike brand transformation with deep athletic DNA. Premium sportswear styling with signature swoosh elements, performance materials, and iconic Nike aesthetic language.",
    negativePrompt:
      "other brand logos, adidas, puma, under armour, generic sportswear, non-athletic clothing",
    logoUrl: "/brands/nike-logo.png",
    description: "Iconic athletic brand known for innovation and performance",
    launchDate: new Date("2024-01-01"),
    popularity: 95,
  },
  {
    id: "apple",
    name: "Apple",
    category: "tech",
    soulId: "apple-soul",
    palette: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#007aff",
      background: "#f5f5f7",
    },
    fonts: {
      primary: "SF Pro Display",
      weights: [400, 500, 600],
    },
    motifs: ["clean lines", "minimalism", "premium materials", "white space"],
    aesthetics: ["elegant", "sophisticated", "minimal", "premium"],
    keywords: ["technology", "design", "innovation", "premium"],
    basePrompt:
      "Style transfer to Apple minimalist aesthetic. Convert to premium, clean design with white/black/silver colors. Add Apple devices or accessories if applicable. Use premium materials, glass, aluminum textures. Clean, minimalist professional photography with soft lighting.",
    soulPrompt:
      "Authentic Apple brand transformation with premium minimalist DNA. Sophisticated design language with clean lines, premium materials, and iconic Apple aesthetic principles.",
    negativePrompt:
      "other brand logos, colorful elements, cluttered design, non-premium materials, samsung, google, microsoft logos",
    logoUrl: "/brands/apple-logo.png",
    description: "Premium technology brand focused on design and innovation",
    launchDate: new Date("2024-01-01"),
    popularity: 98,
  },
  {
    id: "supreme",
    name: "Supreme",
    category: "streetwear",
    soulId: "supreme-soul",
    palette: {
      primary: "#ff0000",
      secondary: "#ffffff",
      accent: "#000000",
      background: "#f8f9fa",
    },
    fonts: {
      primary: "Futura",
      weights: [700],
    },
    motifs: ["bold red box logo", "streetwear", "urban culture", "hype"],
    aesthetics: ["bold", "urban", "rebellious", "exclusive"],
    keywords: ["streetwear", "hype", "urban", "culture"],
    basePrompt:
      "Style transfer to Supreme streetwear aesthetic. Convert clothing to Supreme branded pieces with red box logos. Add Supreme accessories, caps, bags. Use red, white, black color scheme. Urban street photography style with bold composition.",
    soulPrompt:
      "Authentic Supreme brand transformation with street culture DNA. Bold streetwear styling with signature red box logo elements and exclusive hype aesthetic language.",
    negativePrompt:
      "other streetwear brands, off-white, bape, stussy, generic streetwear, corporate clothing",
    logoUrl: "/brands/supreme-logo.png",
    description:
      "Iconic streetwear brand known for bold design and exclusivity",
    launchDate: new Date("2024-01-01"),
    popularity: 92,
  },
  {
    id: "aesop",
    name: "Aesop",
    category: "beauty",
    soulId: "aesop-soul",
    palette: {
      primary: "#2c2c2c",
      secondary: "#f5f5f5",
      accent: "#8b7355",
      background: "#ffffff",
    },
    fonts: {
      primary: "Gill Sans",
      weights: [300, 400],
    },
    motifs: ["apothecary bottles", "earth tones", "natural materials", "craft"],
    aesthetics: ["artisanal", "sophisticated", "natural", "premium"],
    keywords: ["beauty", "natural", "artisanal", "sophisticated"],
    basePrompt:
      "Style transfer to Aesop artisanal aesthetic. Add Aesop beauty products, apothecary bottles. Use earth tones - brown, beige, cream colors. Natural materials, wood, stone textures. Sophisticated artisanal photography with warm, natural lighting.",
    soulPrompt:
      "Authentic Aesop brand transformation with artisanal beauty DNA. Sophisticated natural styling with signature apothecary elements and premium craft aesthetic language.",
    negativePrompt:
      "other beauty brands, bright colors, plastic materials, generic beauty products, sephora, ulta",
    logoUrl: "/brands/aesop-logo.png",
    description:
      "Premium beauty brand known for artisanal products and sophisticated design",
    launchDate: new Date("2024-01-01"),
    popularity: 88,
  },
  {
    id: "tesla",
    name: "Tesla",
    category: "automotive",
    soulId: "tesla-soul",
    palette: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#cc0000",
      background: "#f8f9fa",
    },
    fonts: {
      primary: "Gotham",
      weights: [400, 700],
    },
    motifs: ["sleek design", "electric", "innovation", "futuristic"],
    aesthetics: ["futuristic", "innovative", "clean", "premium"],
    keywords: ["automotive", "electric", "innovation", "future"],
    basePrompt:
      "Style transfer to Tesla futuristic aesthetic. Add Tesla branding, electric vehicle elements. Use black, white, red color scheme. Sleek, innovative design with premium materials. Futuristic photography with clean, high-tech lighting.",
    soulPrompt:
      "Authentic Tesla brand transformation with innovative automotive DNA. Futuristic styling with signature electric vehicle elements and cutting-edge aesthetic language.",
    negativePrompt:
      "other car brands, ford, bmw, mercedes, gas vehicles, traditional automotive, oil, gasoline",
    logoUrl: "/brands/tesla-logo.png",
    description:
      "Innovative automotive brand focused on electric vehicles and sustainability",
    launchDate: new Date("2024-01-01"),
    popularity: 90,
  },
  {
    id: "patagonia",
    name: "Patagonia",
    category: "outdoor",
    soulId: "patagonia-soul",
    palette: {
      primary: "#1e3a8a",
      secondary: "#fbbf24",
      accent: "#059669",
      background: "#f3f4f6",
    },
    fonts: {
      primary: "Trade Gothic",
      weights: [400, 700],
    },
    motifs: [
      "mountain landscapes",
      "outdoor gear",
      "sustainability",
      "adventure",
    ],
    aesthetics: ["rugged", "natural", "authentic", "sustainable"],
    keywords: ["outdoor", "adventure", "nature", "sustainability"],
    basePrompt:
      "Style transfer to Patagonia outdoor aesthetic. Convert clothing to Patagonia outdoor gear with mountain logos. Add hiking accessories, backpacks. Use blue, yellow, green nature colors. Outdoor adventure photography with natural mountain lighting.",
    soulPrompt:
      "Authentic Patagonia brand transformation with outdoor adventure DNA. Rugged outdoor styling with signature mountain elements and sustainable aesthetic language.",
    negativePrompt:
      "other outdoor brands, north face, columbia, rei, indoor clothing, urban fashion",
    logoUrl: "/brands/patagonia-logo.png",
    description:
      "Outdoor brand focused on environmental responsibility and adventure",
    launchDate: new Date("2024-01-01"),
    popularity: 86,
  },
];
