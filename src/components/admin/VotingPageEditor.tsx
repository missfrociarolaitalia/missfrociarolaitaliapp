import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetVotingPage,
  useUpdateVotingPage,
  getGetVotingPageQueryKey,
  type VotingPageSettings,
} from "@workspace/api-client-react";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clearAdminToken } from "@/lib/admin";
import { Loader2, Save, Vote } from "lucide-react";

export function VotingPageEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetVotingPage();
  const update = useUpdateVotingPage();

  const [draft, setDraft] = useState<VotingPageSettings | null>(null);
  useEffect(() => {
    if (data) setDraft({ ...data });
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

  const dirty =
    !!data &&
    (draft.title !== data.title ||
      draft.subtitle !== data.subtitle ||
      draft.slotCount !== data.slotCount);

  const onSave = () => {
    const cleaned: VotingPageSettings = {
      title: draft.title.trim() || "VOTA LA TUA REGINA",
      subtitle: draft.subtitle.trim(),
      slotCount: Math.max(1, Math.min(50, Math.round(draft.slotCount) || 8)),
    };

    update.mutate(
      { data: cleaned },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetVotingPageQueryKey(),
          });
          toast({
            title: "Pagina vota aggiornata",
            description: `Mostrate ${cleaned.slotCount} concorrenti.`,
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
      <div className="flex items-center gap-3 mb-3">
        <Vote className="w-5 h-5 text-secondary" />
        <p className="font-display text-xl text-white">PAGINA VOTA</p>
      </div>
      <p className="text-xs text-white/60 mb-4">
        Titolo, sottotitolo e numero di concorrenti mostrate sulla pagina di
        voto.
      </p>

      <div className="space-y-3">
        <div>
          <Label className="text-white/80 text-xs uppercase tracking-widest">
            Titolo
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
          <Input
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            className="bg-white/10 border-white/30 text-white"
          />
        </div>
        <div>
          <Label className="text-white/80 text-xs uppercase tracking-widest">
            Slot concorrenti (1-50)
          </Label>
          <Input
            type="number"
            min={1}
            max={50}
            value={draft.slotCount}
            onChange={(e) =>
              setDraft({
                ...draft,
                slotCount: parseInt(e.target.value, 10) || 1,
              })
            }
            className="bg-white/10 border-white/30 text-white"
          />
          <p className="text-[11px] text-white/50 mt-1">
            Vengono mostrate le prime N concorrenti per ordine di display.
          </p>
        </div>
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
            <Save className="w-4 h-4 mr-2" /> SALVA PAGINA VOTA
          </>
        )}
      </Button>
    </NeonCard>
  );
}
