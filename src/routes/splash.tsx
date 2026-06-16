import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import capaImg from "@/assets/capa.png";

export const Route = createFileRoute("/splash")({
  component: Splash,
  head: () => ({ meta: [
    { title: "Torcida Social" },
    { name: "description", content: "Torcida Social - Transformando vidas através do esporte e da solidariedade" },
  ]}),
});

function Splash() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("hasSeenSplash", "true");
    
    const timer = setTimeout(() => {
      router.navigate({ to: "/" });
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-navy flex items-center justify-center z-50">
      <img
        src={capaImg}
        alt="Torcida Social"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
