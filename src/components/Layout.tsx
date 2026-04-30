import { ReactNode } from "react";
import { Header } from "./Header";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
      
      <div className="overflow-hidden whitespace-nowrap bg-primary/20 py-3 border-y border-primary/50">
        <div className="inline-block animate-[marquee_20s_linear_infinite] font-display text-primary whitespace-nowrap">
          <span className="mx-4">💅 YAS KWEEN!</span>
          <span className="mx-4">✨ L'ELEGANZA È UN DIRITTO</span>
          <span className="mx-4">👑 INCHINATI ALLA REGINA</span>
          <span className="mx-4">💋 SERVE, SLAY, SURVIVE</span>
          <span className="mx-4">💅 YAS KWEEN!</span>
          <span className="mx-4">✨ L'ELEGANZA È UN DIRITTO</span>
          <span className="mx-4">👑 INCHINATI ALLA REGINA</span>
          <span className="mx-4">💋 SERVE, SLAY, SURVIVE</span>
        </div>
      </div>
    </div>
  );
}
