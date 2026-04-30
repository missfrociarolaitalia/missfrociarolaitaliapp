import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetHomepageContent } from "@workspace/api-client-react";

const DEFAULTS = {
  line1: "MISS",
  line2: "FROCIAROLA",
  line3: "ITALIA",
  tagline: "La gara più frociarola d'Italia! 💋✨",
};

export default function Home() {
  const { data } = useGetHomepageContent();
  const content = data ?? DEFAULTS;

  const menuItems = [
    { href: "/vota", label: "VOTA", color: "bg-primary", icon: "👑" },
    { href: "/quiz/frociarola", label: "CHE FROCIAROLA SEI?", color: "bg-secondary", icon: "✨" },
    { href: "/roast", label: "ROAST GENERATOR", color: "bg-destructive", icon: "🔥" },
    { href: "/quiz/amico-gay", label: "L'AMICO GAY", color: "bg-accent text-accent-foreground", icon: "👯‍♀️" },
    { href: "/iscriviti", label: "ISCRIVITI", color: "bg-primary", icon: "📝" },
    { href: "/hall-of-fame", label: "HALL OF FAME", color: "bg-accent text-accent-foreground", icon: "🏆" },
    { href: "/save-mauriziano", label: "SALVA MAURIZIANO", color: "bg-secondary", icon: "🏃‍♂️" },
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-12 py-12">
        <div className="text-center space-y-6">
          <motion.div 
            className="animate-float inline-block bg-white/10 p-8 rounded-full border-4 border-primary shadow-[0_0_50px_rgba(255,20,147,0.5)] backdrop-blur-sm relative"
          >
            <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-center leading-tight">
              <span className="glitter-text block">{content.line1}</span>
              <span className="text-white neon-glow block">{content.line2}</span>
              <span className="glitter-text block">{content.line3}</span>
            </h1>
          </motion.div>
          <p className="text-xl md:text-2xl font-bold text-white/90 italic">
            {content.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={item.href}>
                <div className={`
                  ${item.color} 
                  h-40 rounded-3xl p-6 flex flex-col items-center justify-center gap-4
                  cursor-pointer transform transition-all hover:scale-105 hover:-translate-y-2
                  shadow-xl hover:shadow-[0_0_30px_currentColor]
                  border-2 border-white/20 backdrop-blur-md
                `}>
                  <span className="text-4xl">{item.icon}</span>
                  <span className="font-display text-xl text-center tracking-wide">
                    {item.label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
