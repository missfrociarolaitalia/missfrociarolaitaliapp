import { useQueryClient } from "@tanstack/react-query";
import {
  useListIscrizioni,
  useDeleteIscrizione,
  getListIscrizioniQueryKey,
} from "@workspace/api-client-react";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { clearAdminToken } from "@/lib/admin";
import { Loader2, Mail, Trash2, Inbox } from "lucide-react";

const TARGET_EMAIL = "missfrociarolaitalia@gmail.com";

export function IscrizioniViewer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useListIscrizioni();
  const remove = useDeleteIscrizione();

  const onDelete = (id: string, nome: string) => {
    if (!window.confirm(`Eliminare l'iscrizione di ${nome}?`)) return;
    remove.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListIscrizioniQueryKey(),
          });
          toast({ title: "Eliminata", description: nome });
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
              description: "Impossibile eliminare.",
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
        <Inbox className="w-5 h-5 text-secondary" />
        <p className="font-display text-xl text-white">
          ISCRIZIONI ({data.length})
        </p>
      </div>
      <p className="text-xs text-white/60 mb-4">
        Tutte le candidature ricevute. Clicca "Email" per rispondere via il tuo
        client di posta.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-white/50 py-8 italic">
          Nessuna iscrizione ancora. Quando arriveranno appariranno qui.
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((i) => {
            const subject = `Candidatura Miss Frociarola — ${i.nomeArte}`;
            const mailto = `mailto:${i.email}?cc=${TARGET_EMAIL}&subject=${encodeURIComponent(subject)}`;
            return (
              <div
                key={i.id}
                className="rounded-xl border border-white/15 bg-white/5 p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-primary truncate">
                      {i.nomeArte}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {i.email} • {i.citta} • {i.pronomi}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                      {new Date(i.createdAt).toLocaleString("it-IT")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap break-words border-l-2 border-primary/40 pl-3">
                  {i.descrizione}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <a href={mailto}>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      className="border-secondary/50 text-secondary hover:bg-secondary/10"
                    >
                      <Mail className="w-4 h-4 mr-1" /> Email
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => onDelete(i.id, i.nomeArte)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </NeonCard>
  );
}
