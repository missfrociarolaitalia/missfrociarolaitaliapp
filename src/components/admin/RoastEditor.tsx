import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetRoastTemplates,
  useUpdateRoastTemplates,
  getGetRoastTemplatesQueryKey,
  type RoastTemplates,
} from "@workspace/api-client-react";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clearAdminToken } from "@/lib/admin";
import { Loader2, Save, Plus, Trash2, Flame } from "lucide-react";

type ListKey = "prefixes" | "bodies" | "suffixes";

const LABELS: Record<ListKey, { title: string; hint: string; placeholder: string }> = {
  prefixes: {
    title: "Inizio",
    hint: "Esempio: 'Amore,' o 'Tesoro,'",
    placeholder: "Amore,",
  },
  bodies: {
    title: "Corpo dell'insulto",
    hint: "Frase principale, dopo il nome. Inizia con minuscola, finisci con virgola.",
    placeholder: "hai un outfit che urla saldi del 2012,",
  },
  suffixes: {
    title: "Chiusura",
    hint: "L'ultima frecciatina con emoji. Esempio: 'sashay away. 👑'",
    placeholder: "ma almeno ci provi. 💅",
  },
};

export function RoastEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRoastTemplates();
  const update = useUpdateRoastTemplates();

  const [draft, setDraft] = useState<RoastTemplates | null>(null);
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

  const updateList = (key: ListKey, items: string[]) =>
    setDraft({ ...draft, [key]: items });

  const onSave = () => {
    const cleaned: RoastTemplates = {
      prefixes: draft.prefixes.map((s) => s.trim()).filter(Boolean),
      bodies: draft.bodies.map((s) => s.trim()).filter(Boolean),
      suffixes: draft.suffixes.map((s) => s.trim()).filter(Boolean),
    };

    update.mutate(
      { data: cleaned },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetRoastTemplatesQueryKey(),
          });
          toast({ title: "Roast salvato", description: "Modifiche live." });
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
          <Flame className="w-5 h-5 text-destructive" />
          <p className="font-display text-xl text-white">ROAST GENERATOR</p>
        </div>
        <p className="text-xs text-white/60 -mt-2">
          Ogni roast è composto da 3 pezzi a caso: <b>Inizio</b> + <i>nome</i> +{" "}
          <b>Corpo</b> + <b>Chiusura</b>.
        </p>

        {(Object.keys(LABELS) as ListKey[]).map((key) => (
          <RoastList
            key={key}
            label={LABELS[key].title}
            hint={LABELS[key].hint}
            placeholder={LABELS[key].placeholder}
            items={draft[key]}
            onChange={(items) => updateList(key, items)}
          />
        ))}

        <Button
          onClick={onSave}
          disabled={!dirty || update.isPending}
          className="w-full bg-primary hover:bg-primary/80 text-white font-display"
        >
          {update.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> SALVA ROAST
            </>
          )}
        </Button>
      </div>
    </NeonCard>
  );
}

function RoastList({
  label,
  hint,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  hint: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-white text-sm font-bold">{label}</Label>
          <p className="text-[11px] text-white/50">{hint}</p>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={() => onChange([...items, ""])}
          className="bg-secondary/30 hover:bg-secondary/50 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Aggiungi
        </Button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-white/40 italic">Nessun elemento.</p>
        )}
        {items.map((value, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-[10px] text-white/40 font-mono w-5 text-right">
              {idx + 1}
            </span>
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
              className="bg-white/10 border-white/30 text-white h-9 flex-1"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-2 text-destructive hover:bg-destructive/10 rounded"
              aria-label="Elimina"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
