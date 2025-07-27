import { Header } from "@/components/layout/header";
import { MainCanvas } from "@/components/layout/main-canvas";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sidebar/30">
      <Header />
      <MainCanvas />
    </div>
  );
}
