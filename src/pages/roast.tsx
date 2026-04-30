import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { GlitterButton } from "@/components/GlitterButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetRoastTemplates } from "@workspace/api-client-react";

const FALLBACK = { prefixes: [], bodies: [], suffixes: [] };

export default function Roast() {
  const { data } = useGetRoastTemplates();
  const templates = data ?? FALLBACK;
  const [name, setName] = useState("");
  const [roast, setRoast] = useState<string | null>(null);

  const generateRoast = () => {
    if (!name) return;
    const { prefixes, bodies, suffixes } = templates;
    if (!prefixes.length || !bodies.length || !suffixes.length) {
      setRoast(`Amore ${name}, non ho ancora insulti pronti per te. Torna dopo. 💅`);
      return;
    }
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const body = bodies[Math.floor(Math.random() * bodies.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    setRoast(`${prefix} ${name}, ${body} ${suffix}`);
  };

  const copyToClipboard = () => {
    if (roast) {
      navigator.clipboard.writeText(roast);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <h1 className="text-4xl md:text-5xl font-display text-center glitter-text mb-4">
          ROAST GENERATOR 🔥
        </h1>

        <NeonCard className="max-w-md w-full">
          <div className="flex flex-col space-y-6">
            {!roast ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 flex flex-col"
              >
                <label className="text-xl font-bold text-white text-center block">
                  A chi vogliamo distruggere l'autostima oggi? 😈
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome della poveretta..."
                  className="w-full bg-background/50 border-2 border-primary/50 rounded-xl p-4 text-xl text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/30"
                />
                <GlitterButton 
                  onClick={generateRoast}
                  disabled={!name}
                  className="w-full py-6 text-xl"
                >
                  INSULTAMI CON STILE 💋
                </GlitterButton>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center space-y-6 text-center"
                >
                  <p className="text-2xl font-bold leading-relaxed italic">
                    "{roast}"
                  </p>
                  
                  <div className="flex flex-col w-full gap-4 pt-4">
                    <GlitterButton onClick={copyToClipboard} variant="secondary">
                      COPIA INSULTO 📋
                    </GlitterButton>
                    <GlitterButton onClick={() => setRoast(null)} variant="default">
                      UN'ALTRA VITTIMA 🎯
                    </GlitterButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </NeonCard>
      </div>
    </Layout>
  );
}
