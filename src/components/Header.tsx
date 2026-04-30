import { Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/vota", label: "Vota" },
    { href: "/quiz/frociarola", label: "Che Frociarola Sei?" },
    { href: "/roast", label: "Roast Generator" },
    { href: "/quiz/amico-gay", label: "L'Amico Gay" },
    { href: "/iscriviti", label: "Iscriviti" },
    { href: "/hall-of-fame", label: "Hall of Fame" },
    { href: "/save-mauriziano", label: "Salva Mauriziano" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-wider text-white neon-glow">
              MISS FROCIAROLA
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {links.slice(1, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-white hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-8 w-8" />
          </Button>

          <nav className="flex flex-col items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-2xl text-white hover:text-primary transition-colors neon-glow"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}
