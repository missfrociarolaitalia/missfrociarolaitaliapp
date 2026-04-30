import { Button } from "./ui/button";
import { ReactNode } from "react";

interface GlitterButtonProps extends React.ComponentProps<typeof Button> {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
}

export function GlitterButton({ children, className = "", variant = "default", ...props }: GlitterButtonProps) {
  return (
    <Button
      variant={variant}
      className={`relative overflow-hidden group font-display text-lg tracking-wide hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,20,147,0.5)] hover:shadow-[0_0_25px_rgba(255,20,147,0.8)] ${className}`}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
      {children}
    </Button>
  );
}
