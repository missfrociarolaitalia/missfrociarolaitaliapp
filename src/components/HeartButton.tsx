import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getVote, hasVoted, toggleVote } from "@/lib/votes";

interface HeartButtonProps {
  id: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function HeartButton({ id, size = "md", label }: HeartButtonProps) {
  const [count, setCount] = useState(0);
  const [voted, setVoted] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setCount(getVote(id));
    setVoted(hasVoted(id));
  }, [id]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleVote(id);
    setVoted(result.voted);
    setCount(result.total);
    if (result.voted) setBurst((b) => b + 1);
  };

  const sizes = {
    sm: { btn: "h-9 px-3 text-sm gap-1.5", icon: 16 },
    md: { btn: "h-11 px-4 text-base gap-2", icon: 20 },
    lg: { btn: "h-14 px-6 text-lg gap-2", icon: 24 },
  };
  const s = sizes[size];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={voted}
      aria-label={voted ? "Rimuovi voto" : "Vota questa regina"}
      className={`${s.btn} relative inline-flex items-center justify-center rounded-full font-display tracking-wide
        border-2 transition-all active:scale-95 select-none
        ${
          voted
            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_25px_rgba(255,20,147,0.7)]"
            : "bg-background/60 text-white border-white/30 hover:border-primary hover:shadow-[0_0_20px_rgba(255,20,147,0.5)]"
        }`}
    >
      <motion.span
        key={voted ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className="inline-flex"
      >
        <Heart
          size={s.icon}
          fill={voted ? "currentColor" : "none"}
          strokeWidth={2.5}
        />
      </motion.span>
      <span className="tabular-nums font-bold">{count}</span>
      {label && <span className="hidden sm:inline">{label}</span>}

      <AnimatePresence>
        {Array.from({ length: burst }).map((_, i) => (
          <motion.span
            key={`b-${i}`}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -40, scale: 1.4 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => setBurst(0)}
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-pink-400"
          >
            <Heart size={s.icon} fill="currentColor" />
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
}
