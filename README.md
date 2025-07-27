# Clue.ly - AI-Powered Brand Identity Remix Platform

_Premium AI-Powered Brand Identity Remix Platform_

Transform any image into iconic brand content with AI-powered precision and premium mobile experience.

## 🚀 Features

- **Instant Brand Transformation**: Upload any image and get 4 professional brand-style variations in seconds
- **Premium Brand DNA**: Authentic recreation of iconic brand aesthetics through AI-powered "Soul ID" technology
- **Mobile-First Experience**: Seamless touch-optimized interface designed for content creators on-the-go
- **Viral Content Engine**: Create share-worthy content that resonates with brand aesthetics and social media trends

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand with React Context
- **AI Integration**: Together AI FLUX Kontext models (planned)
- **Deployment**: Vercel with Edge Functions
- **Database**: Supabase (PostgreSQL) + Redis for caching (planned)
- **File Storage**: Cloudinary for image optimization (planned)
- **Analytics**: Posthog + Custom telemetry (planned)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/clue.ly.git
   cd clue.ly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

   ```env
   NEXT_PUBLIC_TOGETHER_API_KEY=your_together_ai_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
clue.ly/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature components
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   └── utils/                 # Utility functions
├── documents/                 # Project documentation
├── public/                    # Static assets
└── package.json
```

## 🎨 Component Architecture

### Core Components

- **Header**: Premium navigation with mobile-responsive design
- **UploadZone**: Drag & drop image upload with progress tracking
- **BrandSelection**: Interactive brand grid with Soul ID toggle
- **GenerationProgress**: Animated progress with step indicators
- **ResultsGrid**: 2x2 layout with download/share actions

### Premium Features

- **Soul ID Technology**: Enhanced AI-powered brand transformation
- **Mobile-First Design**: Touch-optimized with 44px minimum targets
- **Premium Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Full ARIA support and keyboard navigation

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Enforced code quality and best practices
- **Prettier**: Consistent code formatting
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 📱 Mobile-First Design

- **Touch Targets**: Minimum 44px for all interactive elements
- **Gesture Support**: Swipe, pinch, and tap interactions
- **Progressive Enhancement**: Graceful degradation for slower connections
- **Offline Capability**: Service worker for basic functionality

## 🎯 Performance Standards

- **Core Web Vitals**: LCP < 1.2s, FID < 100ms, CLS < 0.1
- **Mobile Performance**: 90+ Lighthouse score on mobile devices
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Bundle Size**: Optimized with tree shaking and code splitting

## 🔒 Security

- **Input Validation**: Comprehensive file and data validation
- **CORS Protection**: Proper cross-origin request handling
- **API Security**: Rate limiting and authentication (planned)
- **Content Security**: XSS protection and secure headers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and architecture
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure accessibility compliance
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for premium component library
- **Radix UI** for accessible primitives
- **Tailwind CSS** for utility-first styling
- **Next.js** for the React framework
- **Vercel** for deployment platform

## 📞 Support

- **Documentation**: [docs.clue.ly](https://docs.clue.ly)
- **Issues**: [GitHub Issues](https://github.com/your-username/clue.ly/issues)
- **Discord**: [Join our community](https://discord.gg/cluely)
- **Email**: support@clue.ly

---

**Built with ❤️ by the Clue.ly Team**
