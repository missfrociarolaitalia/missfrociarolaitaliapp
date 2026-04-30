import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  setAdminToken,
  clearAdminToken,
} from "@/lib/admin";
import { uploadContestantPhoto } from "@/lib/uploadPhoto";
import {
  useAdminLogin,
  useGetHomepageContent,
  useGetVotingStatus,
  useListContestants,
  useUpdateContestant,
  useUpdateHomepageContent,
  useUpdateVotingStatus,
  getGetHomepageContentQueryKey,
  getGetVotingStatusQueryKey,
  getListContestantsQueryKey,
  type Contestant,
  type HomepageContent,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, Lock, Camera, Save, Crown, Home as HomeIcon } from "lucide-react";
import { QuizFrociarolaEditor } from "@/components/admin/QuizFrociarolaEditor";
import { QuizAmicoGayEditor } from "@/components/admin/QuizAmicoGayEditor";
import { RoastEditor } from "@/components/admin/RoastEditor";
import { VotingPageEditor } from "@/components/admin/VotingPageEditor";
import { HallOfFameEditor } from "@/components/admin/HallOfFameEditor";
import { IscrizioniViewer } from "@/components/admin/IscrizioniViewer";

export default function AdminPage() {
  const loggedIn = useAdminAuth();
  if (!loggedIn) return <LoginScreen />;
  return <Dashboard />;
}

function LoginScreen() {
  const [password, setPassword] = useState("");
  const login = useAdminLogin();
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    login.mutate(
      { data: { password } },
      {
        onSuccess: (res) => {
          setAdminToken(res.token);
          toast({ title: "Benvenuta, Regina!", description: "Sei dentro." });
        },
        onError: () => {
          toast({
            title: "Password errata",
            description: "Riprova, bellezza.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
        <NeonCard className="max-w-md w-full">
          <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
            <div className="bg-primary/20 p-5 rounded-full border-4 border-primary">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="font-display text-3xl text-primary neon-glow">
                AREA REGINA
              </h1>
              <p className="text-sm text-white/70">
                Inserisci la password per gestire la gara.
              </p>
            </div>
            <div className="w-full space-y-3">
              <Label htmlFor="pw" className="text-white/80">
                Password
              </Label>
              <Input
                id="pw"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/40 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={!password || login.isPending}
              className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-display text-lg"
            >
              {login.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" /> ENTRA
                </>
              )}
            </Button>
          </form>
        </NeonCard>
      </div>
    </Layout>
  );
}

function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: status } = useGetVotingStatus();
  const { data: contestants = [], isLoading } = useListContestants();
  const updateVoting = useUpdateVotingStatus();

  const onToggleVoting = (next: boolean) => {
    updateVoting.mutate(
      { data: { isOpen: next } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetVotingStatusQueryKey() });
          toast({
            title: next ? "Votazioni APERTE" : "Votazioni CHIUSE",
            description: next
              ? "Il pubblico può votare adesso."
              : "Il pubblico vede di nuovo la runway chiusa.",
          });
        },
        onError: (err: unknown) => {
          if (
            typeof err === "object" &&
            err &&
            "status" in err &&
            (err as { status: number }).status === 401
          ) {
            clearAdminToken();
            toast({
              title: "Sessione scaduta",
              description: "Per favore rifai il login.",
              variant: "destructive",
            });
          } else {
            toast({ title: "Errore", description: "Riprova.", variant: "destructive" });
          }
        },
      },
    );
  };

  const onLogout = () => {
    clearAdminToken();
    toast({ title: "Sloggata", description: "A presto!" });
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        <div className="text-center space-y-2 pt-2">
          <h1 className="font-display text-3xl md:text-5xl glitter-text">
            PANNELLO REGINA
          </h1>
          <p className="text-sm text-white/70 italic">
            Tocca, modifica, salva. Le tue modifiche sono live.
          </p>
        </div>

        <NeonCard>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-display text-xl text-white">VOTAZIONI</p>
              <p className="text-sm text-white/60">
                {status?.isOpen
                  ? "✅ Aperte — il pubblico vota"
                  : "🔒 Chiuse — runway closed"}
              </p>
            </div>
            <Switch
              checked={!!status?.isOpen}
              onCheckedChange={onToggleVoting}
              disabled={updateVoting.isPending}
              aria-label="Apri o chiudi votazioni"
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
        </NeonCard>

        <HomepageEditor />

        <VotingPageEditor />

        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-white/70 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-4">
          CONCORRENTI
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contestants.map((c) => (
              <ContestantEditor key={c.id} contestant={c} />
            ))}
          </div>
        )}

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-8">
          ISCRIZIONI
        </h2>
        <IscrizioniViewer />

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-8">
          HALL OF FAME
        </h2>
        <HallOfFameEditor />

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-8">
          QUIZ — FROCIAROLA
        </h2>
        <QuizFrociarolaEditor />

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-8">
          QUIZ — AMICO GAY
        </h2>
        <QuizAmicoGayEditor />

        <h2 className="font-display text-2xl text-secondary neon-glow text-center pt-8">
          ROAST GENERATOR
        </h2>
        <RoastEditor />
      </div>
    </Layout>
  );
}

function HomepageEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetHomepageContent();
  const update = useUpdateHomepageContent();

  const [form, setForm] = useState<HomepageContent | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <NeonCard>
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </NeonCard>
    );
  }

  const dirty =
    !!data &&
    (form.line1 !== data.line1 ||
      form.line2 !== data.line2 ||
      form.line3 !== data.line3 ||
      form.tagline !== data.tagline);

  const onSave = () => {
    update.mutate(
      { data: form },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetHomepageContentQueryKey(),
          });
          toast({
            title: "Homepage aggiornata",
            description: "Le modifiche sono live.",
          });
        },
        onError: (err: unknown) => {
          if (
            typeof err === "object" &&
            err &&
            "status" in err &&
            (err as { status: number }).status === 401
          ) {
            clearAdminToken();
            toast({
              title: "Sessione scaduta",
              description: "Per favore rifai il login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Errore",
              description: "Salvataggio fallito.",
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  return (
    <NeonCard>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <HomeIcon className="w-5 h-5 text-secondary" />
          <p className="font-display text-xl text-white">HOMEPAGE</p>
        </div>
        <p className="text-xs text-white/60 -mt-2">
          Le tre righe del titolo grande + lo slogan sotto.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Riga 1
            </Label>
            <Input
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Riga 2
            </Label>
            <Input
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Riga 3
            </Label>
            <Input
              value={form.line3}
              onChange={(e) => setForm({ ...form, line3: e.target.value })}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-white/80 text-xs uppercase tracking-widest">
            Slogan
          </Label>
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="bg-white/10 border-white/30 text-white"
          />
        </div>

        <Button
          onClick={onSave}
          disabled={
            !dirty ||
            !form.line1.trim() ||
            !form.line2.trim() ||
            !form.line3.trim() ||
            !form.tagline.trim() ||
            update.isPending
          }
          className="w-full bg-primary hover:bg-primary/80 text-white font-display"
        >
          {update.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> SALVA HOMEPAGE
            </>
          )}
        </Button>
      </div>
    </NeonCard>
  );
}

function ContestantEditor({ contestant }: { contestant: Contestant }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const update = useUpdateContestant();
  const fileRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState(contestant.nome);
  const [citta, setCitta] = useState(contestant.citta);
  const [bio, setBio] = useState(contestant.bio);
  const [photo, setPhoto] = useState<string | null>(contestant.photo);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setNome(contestant.nome);
    setCitta(contestant.citta);
    setBio(contestant.bio);
    setPhoto(contestant.photo);
  }, [contestant]);

  const dirty =
    nome !== contestant.nome ||
    citta !== contestant.citta ||
    bio !== contestant.bio ||
    photo !== contestant.photo;

  const handleAuthError = (err: unknown) => {
    if (
      typeof err === "object" &&
      err &&
      "status" in err &&
      (err as { status: number }).status === 401
    ) {
      clearAdminToken();
      toast({
        title: "Sessione scaduta",
        description: "Per favore rifai il login.",
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const newUrl = await uploadContestantPhoto(file);
      setPhoto(newUrl);
      update.mutate(
        { id: contestant.id, data: { photo: newUrl } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getListContestantsQueryKey(),
            });
            toast({ title: "Foto aggiornata", description: contestant.nome });
          },
          onError: (err) => {
            if (!handleAuthError(err)) {
              toast({
                title: "Errore",
                description: "Salvataggio foto fallito.",
                variant: "destructive",
              });
            }
          },
        },
      );
    } catch (err) {
      toast({
        title: "Caricamento fallito",
        description:
          err instanceof Error ? err.message : "Riprova fra poco.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSave = () => {
    update.mutate(
      {
        id: contestant.id,
        data: { nome: nome.trim(), citta: citta.trim(), bio },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListContestantsQueryKey(),
          });
          toast({ title: "Salvato", description: nome });
        },
        onError: (err) => {
          if (!handleAuthError(err)) {
            toast({
              title: "Errore",
              description: "Salvataggio fallito.",
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  const initial = nome.trim().charAt(0).toUpperCase() || "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <NeonCard>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white/30">
              {photo ? (
                <img
                  src={photo}
                  alt={nome}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${contestant.fallbackGradient} flex items-center justify-center`}
                >
                  <span className="font-display text-4xl text-white">
                    {initial}
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              <div className="absolute top-1 left-1 bg-background/80 text-primary border border-primary/60 font-display text-[10px] px-1.5 py-0.5 rounded-full">
                #{contestant.id}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-white/30 bg-white/5 hover:bg-white/10 text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                {photo ? "Cambia foto" : "Carica foto"}
              </Button>
              <p className="text-[11px] text-white/50">
                Da telefono: si apre fotocamera o galleria.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Nome
            </Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Città
            </Label>
            <Input
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Bio
            </Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="bg-white/10 border-white/30 text-white resize-none"
            />
          </div>

          <Button
            onClick={onSave}
            disabled={!dirty || !nome.trim() || update.isPending}
            className="w-full bg-primary hover:bg-primary/80 text-white font-display"
          >
            {update.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> SALVA
              </>
            )}
          </Button>
        </div>
      </NeonCard>
    </motion.div>
  );
}
