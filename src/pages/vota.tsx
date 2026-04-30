import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { ContestantCard } from "@/components/ContestantCard";
import { Lock, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllVotes } from "@/lib/votes";
import { motion } from "framer-motion";
import {
  useGetVotingStatus,
  useListContestants,
  useGetVotingPage,
} from "@workspace/api-client-react";

const DEFAULT_PAGE = {
  title: "VOTA LA TUA REGINA",
  subtitle: "Tocca il cuore della tua preferita per supportarla. 💖✨",
  slotCount: 8,
};

export default function Vota() {
  const { data: status, isLoading: statusLoading } = useGetVotingStatus();

  if (statusLoading) {
    return <LoadingState />;
  }
  if (!status?.isOpen) {
    return <VotingClosed />;
  }
  return <VotingOpen />;
}

function LoadingState() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    </Layout>
  );
}

function VotingClosed() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-8">
        <NeonCard className="max-w-md w-full">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
              <div className="bg-primary/20 p-6 rounded-full border-4 border-primary">
                <Lock className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-display text-primary neon-glow">
              RUNWAY CHIUSA!
            </h1>

            <p className="text-xl font-bold leading-relaxed text-white/90">
              Nessuna votazione attiva al momento, bellezze! 💅
            </p>
            <p className="text-lg text-white/70">
              Torna presto per incoronare la prossima Miss Frociarola d'Italia.
              Il glitter si sta ancora asciugando! ✨
            </p>
          </div>
        </NeonCard>
      </div>
    </Layout>
  );
}

function VotingOpen() {
  const { data: contestants = [], isLoading } = useListContestants();
  const { data: page } = useGetVotingPage();
  const settings = page ?? DEFAULT_PAGE;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(onStorage, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(id);
    };
  }, []);

  const visible = useMemo(
    () => contestants.slice(0, settings.slotCount),
    [contestants, settings.slotCount],
  );

  const ranking = useMemo(() => {
    const votes = getAllVotes();
    return [...visible]
      .map((c) => ({
        ...c,
        votes: votes[`contestant_${c.id}`] ?? 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, visible]);

  return (
    <Layout>
      <div className="space-y-12 pb-12">
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-display glitter-text leading-tight"
          >
            {settings.title}
          </motion.h1>
          <p className="text-lg md:text-xl text-white/80 italic max-w-2xl mx-auto">
            {settings.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {ranking[0]?.votes > 0 && (
              <NeonCard className="max-w-3xl mx-auto">
                <h2 className="font-display text-xl md:text-2xl text-secondary neon-glow text-center mb-4">
                  🏆 CLASSIFICA LIVE
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {ranking.map((c, i) => (
                    <div
                      key={c.id}
                      className="text-center bg-white/5 rounded-2xl p-3 border border-white/10"
                    >
                      <div className="text-2xl">{["🥇", "🥈", "🥉"][i]}</div>
                      <p className="font-display text-sm md:text-base text-primary truncate">
                        {c.nome}
                      </p>
                      <p className="text-xs text-white/60 tabular-nums">
                        {c.votes} voti
                      </p>
                    </div>
                  ))}
                </div>
              </NeonCard>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((c, i) => (
                <ContestantCard key={c.id} contestant={c} index={i} />
              ))}
            </div>

            <p className="text-center text-xs text-white/50 max-w-md mx-auto">
              Un voto per concorrente, dal tuo dispositivo. Tocca di nuovo il
              cuore per togliere il voto.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
