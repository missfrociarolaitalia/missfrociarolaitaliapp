import { ReactNode } from "react";
import { motion } from "framer-motion";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
}

export function NeonCard({ children, className = "" }: NeonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group rounded-3xl p-1 bg-gradient-to-r from-primary via-secondary to-accent bg-[length:400%_auto] animate-shine ${className}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500 bg-[length:400%_auto] animate-shine"></div>
      <div className="relative bg-background/90 backdrop-blur-xl rounded-[1.4rem] p-6 h-full border border-white/10">
        {children}
      </div>
    </motion.div>
  );
}
