import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { HeartButton } from "@/components/HeartButton";
import { motion } from "framer-motion";
import { useGetHallOfFame, type HallOfFameEntry } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const DEFAULTS = {
  title: "HALL OF FAME",
  subtitle:
    "Le leggende eterne di Miss Frociarola Italia. Inchinati, prendi appunti, asciuga la lacrima. 💅👑✨",
  entries: [] as HallOfFameEntry[],
};

export default function HallOfFame() {
  const { data, isLoading } = useGetHallOfFame();
  const content = data ?? DEFAULTS;

  const grouped = useMemo(() => {
    const map = new Map<string, HallOfFameEntry[]>();
    for (const e of content.entries) {
      const cat = e.categoria || "Senza categoria";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(e);
    }
    return Array.from(map.entries());
  }, [content.entries]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (content.entries.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <NeonCard>
            <h1 className="text-3xl font-display text-primary neon-glow mb-3">
              ANCORA NESSUNA LEGGENDA ✨
            </h1>
            <p className="text-white/80">
              Le incoronate stanno ancora arrivando. Torna presto!
            </p>
          </NeonCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-12 pb-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-display glitter-text leading-tight">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 italic max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {grouped.map(([categoria, entries]) => (
          <CategorySection
            key={categoria}
            categoria={categoria}
            entries={entries}
          />
        ))}

        <NeonCard className="text-center max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-white/90">
            Vuoi vedere il tuo nome qui un giorno? 👀
          </p>
          <p className="text-sm text-white/60 pt-2">
            Iscriviti, vinci, e diventa eterna. Le leggende non si improvvisano,
            si costruiscono palco dopo palco.
          </p>
        </NeonCard>
      </div>
    </Layout>
  );
}

function CategorySection({
  categoria,
  entries,
}: {
  categoria: string;
  entries: HallOfFameEntry[];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-display text-center text-secondary neon-glow">
        {categoria.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <NeonCard className="h-full">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {q.photo ? (
                    <img
                      src={q.photo}
                      alt={q.nome}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-white/30 shadow-[0_0_20px_rgba(255,20,147,0.4)]"
                    />
                  ) : (
                    <div
                      className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${q.gradient || "from-pink-500 to-purple-600"} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,20,147,0.4)] border border-white/30`}
                    >
                      {q.emoji || "👑"}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-lg md:text-xl text-primary leading-tight truncate">
                      {q.nome}
                    </p>
                    {q.anno && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-accent/30 text-accent-foreground border border-accent/50 shrink-0">
                        {q.anno}
                      </span>
                    )}
                  </div>
                  {q.titolo && (
                    <p className="text-sm text-white/90 font-bold">{q.titolo}</p>
                  )}
                  {q.citta && (
                    <p className="text-xs text-white/60">📍 {q.citta}</p>
                  )}
                  {q.motto && (
                    <p className="text-sm italic text-white/80 pt-2 border-t border-white/10 mt-2">
                      “{q.motto}”
                    </p>
                  )}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-white/50">
                      Manda amore
                    </span>
                    <HeartButton id={`legend_${q.id}`} size="sm" />
                  </div>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
