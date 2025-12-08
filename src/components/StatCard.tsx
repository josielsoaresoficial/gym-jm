import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  variant?: "fitness" | "nutrition" | "default";
  className?: string;
}

export function StatCard({ icon, title, value, variant = "default", className }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const variantColors = {
    fitness: {
      border: "rgba(34, 197, 94, 0.4)",
      glow: "rgba(34, 197, 94, 0.3)",
      icon: "text-primary",
    },
    nutrition: {
      border: "rgba(249, 115, 22, 0.4)",
      glow: "rgba(249, 115, 22, 0.3)",
      icon: "text-secondary",
    },
    default: {
      border: "rgba(255, 255, 255, 0.2)",
      glow: "rgba(255, 255, 255, 0.2)",
      icon: "text-muted-foreground",
    },
  };

  const colors = variantColors[variant];

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "bg-white/10 dark:bg-white/5 backdrop-blur-md",
        "border border-white/20 dark:border-white/10",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        "font-inter tracking-tight",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10",
        className
      )}
    >
      {/* Iridescent border gradient based on variant */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background: variant === "fitness"
            ? `linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(59,130,246,0.4) 50%, rgba(34,197,94,0.4) 100%)`
            : variant === "nutrition"
            ? `linear-gradient(135deg, rgba(249,115,22,0.4) 0%, rgba(236,72,153,0.4) 50%, rgba(249,115,22,0.4) 100%)`
            : `linear-gradient(135deg, rgba(255,100,150,0.3) 0%, rgba(100,200,255,0.3) 25%, rgba(150,255,150,0.3) 50%, rgba(255,200,100,0.3) 75%, rgba(255,100,150,0.3) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Shimmer effect on cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute h-24 w-24 rounded-full opacity-40 transition-opacity duration-300"
          style={{
            left: mousePos.x - 48,
            top: mousePos.y - 48,
            background: `radial-gradient(circle, ${colors.glow}, transparent 60%)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/30"
          style={{
            left: ripple.x - 40,
            top: ripple.y - 40,
            width: 80,
            height: 80,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm",
            colors.icon
          )}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{value}</h3>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
