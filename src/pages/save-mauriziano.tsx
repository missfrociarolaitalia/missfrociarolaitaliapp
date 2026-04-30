import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { GlitterButton } from "@/components/GlitterButton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function SaveMauriziano() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast({
      title: "🏳️‍🌈 In lista d'attesa, tesoro!",
      description: "Ti avviseremo appena Mauriziano sarà pronto a correre.",
    });
    setEmail("");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-display text-secondary neon-glow">
            SALVA MAURIZIANO!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-bold leading-tight">
            Aiuta Mauriziano ad arrivare sul palco di Miss Frociarola 🏳️‍🌈
          </p>
          <p className="text-base text-white/60 uppercase tracking-widest font-bold">
            Il vero gioco arriva presto!
          </p>
        </div>

        <div className="relative w-full max-w-2xl aspect-[4/3] bg-black/50 border-4 border-secondary rounded-xl overflow-hidden shadow-[0_0_50px_rgba(157,0,255,0.3)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ y: [-12, 12, -12], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-8xl mb-4"
            >
              🏃‍♂️
            </motion.div>
            <p className="text-secondary font-display text-2xl mb-2">
              MAURIZIANO IN AZIONE
            </p>
            <p className="text-white/60 italic text-center px-6 max-w-md">
              Labirinto, hater che inseguono, vite, power-up e arrivo sul palco.
              Il labirinto si sta ancora asciugando dal glitter.
            </p>
            <div className="absolute bottom-4 left-0 w-full text-center">
              <p className="text-sm font-mono text-white/40 animate-pulse">
                COMING SOON
              </p>
            </div>
          </div>
        </div>

        <NeonCard className="w-full max-w-md">
          <form onSubmit={handleNotify} className="space-y-4 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold">
              Vuoi essere il primo a giocare? 🕹️
            </h3>
            <p className="text-white/70">
              Lascia la mail e ti avvisiamo quando il gioco sarà live!
            </p>
            <div className="flex w-full gap-2">
              <Input
                type="email"
                placeholder="la.tua@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-secondary focus-visible:ring-secondary text-white"
              />
              <GlitterButton type="submit" variant="secondary">
                AVVISAMI
              </GlitterButton>
            </div>
          </form>
        </NeonCard>
      </div>
    </Layout>
  );
}
