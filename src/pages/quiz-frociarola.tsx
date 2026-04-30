import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { GlitterButton } from "@/components/GlitterButton";
import { ShareCard } from "@/components/ShareCard";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetQuizFrociarolaContent,
  type QuizFrociarolaContent,
} from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

const FALLBACK: QuizFrociarolaContent = {
  questions: [],
  results: [],
};

export default function QuizFrociarola() {
  const { data, isLoading } = useGetQuizFrociarolaContent();
  const content = data ?? FALLBACK;
  const questions = content.questions;
  const resultsByArchetype = Object.fromEntries(
    content.results.map((r) => [r.archetype, r]),
  );

  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (archetype: string, points: number) => {
    const newScores = {
      ...scores,
      [archetype]: (scores[archetype] || 0) + (points || 1),
    };
    setScores(newScores);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const getWinner = () => {
    let topArchetype = content.results[0]?.archetype ?? "";
    let topScore = -1;
    for (const [arch, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score;
        topArchetype = arch;
      }
    }
    return (
      resultsByArchetype[topArchetype] ??
      content.results[0] ?? {
        archetype: "",
        title: "MISTERO 🤔",
        description: "Risultati non ancora configurati.",
        icon: "❓",
      }
    );
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScores({});
    setShowResult(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <NeonCard>
            <h1 className="text-3xl font-display text-primary neon-glow mb-3">
              QUIZ IN ARRIVO ✨
            </h1>
            <p className="text-white/80">
              Le domande non sono ancora pronte, torna presto!
            </p>
          </NeonCard>
        </div>
      </Layout>
    );
  }

  const winner = getWinner();
  const safeQ = questions[Math.min(currentQ, questions.length - 1)];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-primary neon-glow mb-2">CHE FROCIAROLA SEI?</h1>
          <p className="text-xl text-white/80">Scopri la tua vera essenza drag! 💅</p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <NeonCard>
                <div className="mb-8">
                  <p className="text-primary font-bold mb-2">Domanda {currentQ + 1} di {questions.length}</p>
                  <h2 className="text-3xl font-display leading-tight">{safeQ.question}</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {safeQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.archetype, opt.points)}
                      className="p-6 rounded-xl bg-white/5 border-2 border-white/10 hover:border-primary hover:bg-primary/20 transition-all text-left text-lg font-bold hover:scale-[1.02]"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </NeonCard>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <NeonCard className="text-center py-12">
                <div className="text-8xl mb-6 animate-float">{winner.icon}</div>
                <p className="text-2xl font-bold text-white/70 mb-2">Sei ufficialmente...</p>
                <h2 className="text-4xl md:text-5xl font-display text-primary neon-glow mb-6">
                  {winner.title}
                </h2>
                <p className="text-xl leading-relaxed mb-8 max-w-md mx-auto">
                  {winner.description}
                </p>
                <GlitterButton onClick={resetQuiz} className="px-8 py-6 text-xl">
                  RICOMINCIA IL QUIZ 🔄
                </GlitterButton>

                <ShareCard
                  title={`Sono ${winner.title} 💅`}
                  text={`Ho fatto il quiz "Che frociarola sei?" su Miss Frociarola Italia e sono ${winner.title}! 👑 Scopri la tua essenza drag:`}
                />
              </NeonCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
