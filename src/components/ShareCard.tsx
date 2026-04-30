import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Share2, Instagram } from "lucide-react";

type Props = {
  title: string;
  text: string;
};

export function ShareCard({ title, text }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined" ? window.location.href : "";
  const fullText = `${text}\n\n${url}`;
  const encoded = encodeURIComponent(fullText);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast({ title: "Copiato!", description: "Incolla dove vuoi 💋" });
    } catch {
      toast({
        title: "Impossibile copiare",
        description: "Riprova manualmente.",
        variant: "destructive",
      });
    }
  };

  const onNativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({ title, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  const onInstagram = async () => {
    await onCopy();
    setTimeout(() => {
      window.location.href = "instagram://story-camera";
      setTimeout(() => {
        window.open("https://instagram.com", "_blank", "noopener");
      }, 800);
    }, 200);
  };

  return (
    <div className="space-y-3 pt-4">
      <p className="text-sm text-white/70 text-center font-bold">
        Condividi il risultato 💅
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <a
          href={`https://wa.me/?text=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm">WhatsApp</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1877F2] hover:bg-[#0c5fc4] text-white font-bold transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-xl">f</span>
          <span className="text-sm">Facebook</span>
        </a>
        <button
          type="button"
          onClick={onInstagram}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] text-white font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Instagram className="w-5 h-5" />
          <span className="text-sm">Stories</span>
        </button>
        <button
          type="button"
          onClick={onNativeShare}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold transition-all hover:scale-105 active:scale-95 border border-white/20"
        >
          <span className="text-xl">♪</span>
          <span className="text-sm">TikTok</span>
        </button>
      </div>

      <Button
        type="button"
        onClick={onCopy}
        variant="outline"
        className="w-full h-11 border-white/30 bg-white/5 hover:bg-white/10 text-white"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" /> Copiato!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" /> Copia testo
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={onNativeShare}
        variant="ghost"
        className="w-full text-white/70 hover:text-white"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Altre app...
      </Button>
    </div>
  );
}
