import { useState } from "react";
import { motion } from "framer-motion";
import { NeonCard } from "./NeonCard";
import { HeartButton } from "./HeartButton";
import type { Contestant } from "@workspace/api-client-react";

interface Props {
  contestant: Contestant;
  index: number;
}

export function ContestantCard({ contestant, index }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const photoSrc = contestant.photo ?? "";
  const showPhoto = photoSrc && !imgFailed;
  const initial = contestant.nome.trim().charAt(0).toUpperCase() || "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
    >
      <NeonCard className="h-full">
        <div className="flex flex-col gap-4 h-full">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_25px_rgba(255,20,147,0.3)]">
            {showPhoto ? (
              <img
                src={photoSrc}
                alt={contestant.nome}
                onError={() => setImgFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${contestant.fallbackGradient} flex items-center justify-center`}
              >
                <span className="font-display text-7xl md:text-8xl text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {initial}
                </span>
                <span className="absolute bottom-2 right-3 text-xs font-bold text-white/80 bg-black/40 px-2 py-1 rounded-full backdrop-blur">
                  Foto in arrivo
                </span>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur text-primary border border-primary/60 font-display text-xs px-2 py-1 rounded-full">
              #{contestant.id}
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="font-display text-xl md:text-2xl text-white neon-glow leading-tight">
              {contestant.nome}
            </h3>
            <p className="text-sm text-secondary font-bold">📍 {contestant.citta}</p>
            <p className="text-sm text-white/80 leading-relaxed">{contestant.bio}</p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-white/50">
              Vota qui ↓
            </span>
            <HeartButton id={`contestant_${contestant.id}`} size="md" />
          </div>
        </div>
      </NeonCard>
    </motion.div>
  );
}
