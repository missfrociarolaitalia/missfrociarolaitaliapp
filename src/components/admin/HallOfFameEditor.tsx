import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetHallOfFame,
  useUpdateHallOfFame,
  getGetHallOfFameQueryKey,
  type HallOfFameContent,
  type HallOfFameEntry,
} from "@workspace/api-client-react";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clearAdminToken } from "@/lib/admin";
import { uploadContestantPhoto } from "@/lib/uploadPhoto";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Trophy,
  Camera,
} from "lucide-react";

const GRADIENTS = [
  "from-pink-500 via-fuchsia-500 to-purple-600",
  "from-orange-400 via-pink-500 to-rose-600",
  "from-red-500 via-pink-500 to-yellow-400",
  "from-yellow-300 via-amber-400 to-orange-500",
  "from-cyan-300 via-blue-500 to-purple-600",
  "from-amber-300 via-pink-400 to-fuchsia-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  "from-teal-300 via-cyan-400 to-blue-600",
  "from-fuchsia-500 via-pink-500 to-orange-400",
  "from-rose-400 via-red-500 to-purple-600",
  "from-lime-300 via-emerald-400 to-cyan-600",
  "from-violet-400 via-purple-500 to-fuchsia-600",
];

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `hof-${Math.random().toString(36).slice(2, 10)}`;
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function HallOfFameEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetHallOfFame();
  const update = useUpdateHallOfFame();

  const [draft, setDraft] = useState<HallOfFameContent | null>(null);
  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
  }, [data]);

  if (isLoading || !draft) {
    return (
      <NeonCard>
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </NeonCard>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  const setEntries = (entries: HallOfFameEntry[]) =>
    setDraft({ ...draft, entries });

  const onAdd = () =>
    setEntries([
      ...draft.entries,
      {
        id: uuid(),
        nome: "NUOVA REGINA",
        anno: String(new Date().getFullYear()),
        categoria: "Vincitrici",
        citta: "Italia",
        titolo: "Titolo onorifico",
        motto: "Il mio motto.",
        photo: null,
        gradient: GRADIENTS[draft.entries.length % GRADIENTS.length],
        emoji: "👑",
      },
    ]);

  const onSave = () => {
    const cleaned: HallOfFameContent = {
      title: draft.title.trim() || "HALL OF FAME",
      subtitle: draft.subtitle.trim(),
      entries: draft.entries.map((e) => ({
        ...e,
        nome: e.nome.trim(),
        anno: (e.anno ?? "").trim(),
        categoria: e.categoria.trim() || "Senza categoria",
        citta: e.citta.trim(),
        titolo: e.titolo.trim(),
        motto: e.motto.trim(),
        gradient: e.gradient || GRADIENTS[0],
        emoji: e.emoji.trim() || "👑",
      })),
    };

    if (cleaned.entries.some((e) => !e.nome)) {
      toast({
        title: "Manca un nome",
        description: "Ogni entry deve avere un nome.",
        variant: "destructive",
      });
      return;
    }

    update.mutate(
      { data: cleaned },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetHallOfFameQueryKey(),
          });
          toast({ title: "Hall of Fame salvata", description: "Modifiche live." });
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
              description: "Rifai il login.",
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
    <div className="space-y-4">
      <NeonCard>
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-5 h-5 text-secondary" />
          <p className="font-display text-xl text-white">HALL OF FAME</p>
        </div>
        <p className="text-xs text-white/60 mb-4">
          Aggiungi, modifica e organizza le leggende. Le categorie raggruppano
          le entry sulla pagina pubblica.
        </p>

        <div className="space-y-3">
          <div>
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Titolo pagina
            </Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>
          <div>
            <Label className="text-white/80 text-xs uppercase tracking-widest">
              Sottotitolo
            </Label>
            <Textarea
              value={draft.subtitle}
              onChange={(e) =>
                setDraft({ ...draft, subtitle: e.target.value })
              }
              rows={2}
              className="bg-white/10 border-white/30 text-white resize-none"
            />
          </div>
        </div>
      </NeonCard>

      <NeonCard>
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-sm text-secondary uppercase tracking-widest">
            Entry ({draft.entries.length})
          </p>
          <Button
            size="sm"
            type="button"
            onClick={onAdd}
            className="bg-secondary/30 hover:bg-secondary/50 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Aggiungi
          </Button>
        </div>

        <div className="space-y-3">
          {draft.entries.map((entry, idx) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              isFirst={idx === 0}
              isLast={idx === draft.entries.length - 1}
              onChange={(next) => {
                const arr = [...draft.entries];
                arr[idx] = next;
                setEntries(arr);
              }}
              onMove={(dir) =>
                setEntries(move(draft.entries, idx, idx + dir))
              }
              onDelete={() =>
                setEntries(draft.entries.filter((_, i) => i !== idx))
              }
            />
          ))}
        </div>

        <Button
          onClick={onSave}
          disabled={!dirty || update.isPending}
          className="w-full mt-4 bg-primary hover:bg-primary/80 text-white font-display"
        >
          {update.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> SALVA HALL OF FAME
            </>
          )}
        </Button>
      </NeonCard>
    </div>
  );
}

function EntryRow({
  entry,
  isFirst,
  isLast,
  onChange,
  onMove,
  onDelete,
}: {
  entry: HallOfFameEntry;
  isFirst: boolean;
  isLast: boolean;
  onChange: (next: HallOfFameEntry) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadContestantPhoto(file);
      onChange({ ...entry, photo: url });
      toast({ title: "Foto caricata", description: entry.nome });
    } catch (err) {
      toast({
        title: "Errore upload",
        description: err instanceof Error ? err.message : "Riprova",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-3 space-y-3">
      <div className="flex gap-3">
        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-white/30">
          {entry.photo ? (
            <img
              src={entry.photo}
              alt={entry.nome}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${entry.gradient || GRADIENTS[0]} flex items-center justify-center`}
            >
              <span className="text-3xl">{entry.emoji || "👑"}</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
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
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-white/30 bg-white/5 text-white"
          >
            <Camera className="w-4 h-4 mr-1" />
            {entry.photo ? "Cambia foto" : "Carica foto"}
          </Button>
          {entry.photo && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange({ ...entry, photo: null })}
              className="w-full text-white/60 hover:text-white text-[11px]"
            >
              Usa emoji invece
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-destructive hover:bg-destructive/10 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_60px] gap-2">
        <div>
          <Label className="text-[10px] text-white/60 uppercase">Nome</Label>
          <Input
            value={entry.nome}
            onChange={(e) => onChange({ ...entry, nome: e.target.value })}
            className="bg-white/10 border-white/30 text-white h-9"
          />
        </div>
        <div>
          <Label className="text-[10px] text-white/60 uppercase">Anno</Label>
          <Input
            value={entry.anno ?? ""}
            onChange={(e) => onChange({ ...entry, anno: e.target.value })}
            className="bg-white/10 border-white/30 text-white h-9"
          />
        </div>
        <div>
          <Label className="text-[10px] text-white/60 uppercase">Emoji</Label>
          <Input
            value={entry.emoji}
            onChange={(e) => onChange({ ...entry, emoji: e.target.value })}
            className="bg-white/10 border-white/30 text-white h-9 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-white/60 uppercase">
            Categoria
          </Label>
          <Input
            value={entry.categoria}
            onChange={(e) =>
              onChange({ ...entry, categoria: e.target.value })
            }
            placeholder="Vincitrici, Iconiche, Cult..."
            className="bg-white/10 border-white/30 text-white h-9"
          />
        </div>
        <div>
          <Label className="text-[10px] text-white/60 uppercase">Città</Label>
          <Input
            value={entry.citta}
            onChange={(e) => onChange({ ...entry, citta: e.target.value })}
            className="bg-white/10 border-white/30 text-white h-9"
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-white/60 uppercase">Titolo</Label>
        <Input
          value={entry.titolo}
          onChange={(e) => onChange({ ...entry, titolo: e.target.value })}
          className="bg-white/10 border-white/30 text-white h-9"
        />
      </div>
      <div>
        <Label className="text-[10px] text-white/60 uppercase">Motto</Label>
        <Textarea
          value={entry.motto}
          onChange={(e) => onChange({ ...entry, motto: e.target.value })}
          rows={2}
          className="bg-white/10 border-white/30 text-white resize-none"
        />
      </div>

      {!entry.photo && (
        <div>
          <Label className="text-[10px] text-white/60 uppercase">
            Gradiente (sfondo emoji)
          </Label>
          <select
            value={entry.gradient}
            onChange={(e) => onChange({ ...entry, gradient: e.target.value })}
            className="w-full h-9 rounded-md bg-white/10 border border-white/30 text-white text-sm px-2"
          >
            {GRADIENTS.map((g) => (
              <option key={g} value={g} className="bg-background">
                {g}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
