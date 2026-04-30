import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { GlitterButton } from "@/components/GlitterButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateIscrizione } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

const TARGET_EMAIL = "missfrociarolaitalia@gmail.com";

const PRONOMI = [
  { value: "she/her", label: "Lei / She / Her" },
  { value: "he/him", label: "Lui / He / Him" },
  { value: "they/them", label: "Loro / They / Them" },
  { value: "any", label: "Qualsiasi / Any" },
];

type Form = {
  nomeArte: string;
  email: string;
  citta: string;
  pronomi: string;
  descrizione: string;
  termini: boolean;
};

const EMPTY: Form = {
  nomeArte: "",
  email: "",
  citta: "",
  pronomi: "",
  descrizione: "",
  termini: false,
};

export default function Iscriviti() {
  const { toast } = useToast();
  const create = useCreateIscrizione();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmailLink, setSubmittedEmailLink] = useState<string | null>(null);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (form.nomeArte.trim().length < 2) e.nomeArte = "Almeno 2 caratteri";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Email non valida";
    if (form.citta.trim().length < 2) e.citta = "Dove vivi?";
    if (!form.pronomi) e.pronomi = "Seleziona i pronomi";
    if (form.descrizione.trim().length < 10) e.descrizione = "Almeno 10 caratteri";
    if (!form.termini) e.termini = "Devi accettare per splendere";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildEmailLink = (data: Form) => {
    const subject = `Nuova iscrizione: ${data.nomeArte}`;
    const body = `Nome d'arte: ${data.nomeArte}
Email: ${data.email}
Città: ${data.citta}
Pronomi: ${data.pronomi}

Autodescrizione:
${data.descrizione}`;
    return `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nomeArte: form.nomeArte.trim(),
      email: form.email.trim(),
      citta: form.citta.trim(),
      pronomi: form.pronomi,
      descrizione: form.descrizione.trim(),
    };

    create.mutate(
      { data: payload },
      {
        onSuccess: () => {
          setSubmittedEmailLink(buildEmailLink(form));
          setIsSuccess(true);
          toast({
            title: "👑 Sei dentro, regina!",
            description: "Ti faremo sapere presto.",
          });
          setForm(EMPTY);
        },
        onError: () => {
          toast({
            title: "Ops, errore",
            description: "Riprova fra qualche secondo.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto pb-12">
          <NeonCard className="text-center py-12 space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-display text-primary neon-glow">YASSS!</h2>
            <p className="text-xl text-white/90">
              Iscrizione confermata. Ti faremo sapere presto, tesoro!
            </p>
            <p className="text-sm text-white/60">
              Vuoi anche mandare un'email di conferma alla produzione?
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              {submittedEmailLink && (
                <a href={submittedEmailLink}>
                  <GlitterButton type="button" className="w-full">
                    📧 INVIA ANCHE PER EMAIL
                  </GlitterButton>
                </a>
              )}
              <GlitterButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsSuccess(false);
                  setSubmittedEmailLink(null);
                }}
              >
                ISCRIVI UN'ALTRA QUEEN
              </GlitterButton>
            </div>
          </NeonCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-12 pb-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display glitter-text">
            ISCRIVITI ORA
          </h1>
          <p className="text-xl text-white/80">
            Hai quello che serve per essere la prossima Miss Frociarola Italia? 💅
          </p>
        </div>

        <NeonCard>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <Field label="Nome d'Arte 👑" error={errors.nomeArte}>
              <Input
                value={form.nomeArte}
                onChange={(e) => update("nomeArte", e.target.value)}
                placeholder="Es: Divina C"
                autoComplete="off"
                className="bg-background/50 border-primary/30 text-white"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Email 📧" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="regina@glitter.it"
                  autoComplete="email"
                  inputMode="email"
                  className="bg-background/50 border-primary/30 text-white"
                />
              </Field>
              <Field label="Città 🏙️" error={errors.citta}>
                <Input
                  value={form.citta}
                  onChange={(e) => update("citta", e.target.value)}
                  placeholder="Milano"
                  autoComplete="address-level2"
                  className="bg-background/50 border-primary/30 text-white"
                />
              </Field>
            </div>

            <Field label="Pronomi ✨" error={errors.pronomi}>
              <select
                value={form.pronomi}
                onChange={(e) => update("pronomi", e.target.value)}
                className="w-full h-10 rounded-md bg-background/50 border border-primary/30 text-white px-3"
              >
                <option value="">Seleziona...</option>
                {PRONOMI.map((p) => (
                  <option key={p.value} value={p.value} className="bg-background">
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Autodescrizione Drammatica 🎭" error={errors.descrizione}>
              <Textarea
                value={form.descrizione}
                onChange={(e) => update("descrizione", e.target.value)}
                placeholder="Sono l'essenza della campness fusa con..."
                className="bg-background/50 border-primary/30 min-h-[100px] text-white"
              />
            </Field>

            <label className="flex items-start gap-3 p-4 border border-primary/30 rounded-xl bg-background/30 cursor-pointer">
              <input
                type="checkbox"
                checked={form.termini}
                onChange={(e) => update("termini", e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary"
              />
              <div>
                <p className="text-base text-white">
                  Accetto di essere valutata spietatamente sul mio gusto in fatto
                  di glitter e parrucche.
                </p>
                {errors.termini && (
                  <p className="text-xs text-destructive mt-1">{errors.termini}</p>
                )}
              </div>
            </label>

            <GlitterButton
              type="submit"
              disabled={create.isPending}
              className="w-full py-6 text-xl"
            >
              {create.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "INVIA CANDIDATURA 💋"
              )}
            </GlitterButton>

            <p className="text-center text-xs text-white/50">
              Le iscrizioni arrivano direttamente alla produzione
              ({TARGET_EMAIL}).
            </p>
          </form>
        </NeonCard>
      </div>
    </Layout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-lg text-white">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
