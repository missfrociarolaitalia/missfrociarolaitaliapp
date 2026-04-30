import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetQuizAmicoGayContent,
  useUpdateQuizAmicoGayContent,
  getGetQuizAmicoGayContentQueryKey,
  type QuizFrociarolaContent,
  type QuizQuestion,
  type QuizResult,
} from "@workspace/api-client-react";
import { NeonCard } from "@/components/NeonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clearAdminToken } from "@/lib/admin";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `q-${Math.random().toString(36).slice(2, 10)}`;
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function QuizAmicoGayEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetQuizAmicoGayContent();
  const update = useUpdateQuizAmicoGayContent();

  const [draft, setDraft] = useState<QuizFrociarolaContent | null>(null);
  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
  }, [data]);

  if (isLoading || !draft) {
    return (
      <NeonCard>
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      </NeonCard>
    );
  }

  const archetypes = draft.results.map((r) => r.archetype);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  const setQuestions = (questions: QuizQuestion[]) =>
    setDraft({ ...draft, questions });
  const setResults = (results: QuizResult[]) =>
    setDraft({ ...draft, results });

  const onAddQuestion = () =>
    setQuestions([
      ...draft.questions,
      {
        id: uuid(),
        question: "Nuova domanda",
        options: [
          { text: "Opzione 1", archetype: archetypes[0] ?? "", points: 1 },
        ],
      },
    ]);

  const onAddResult = () =>
    setResults([
      ...draft.results,
      {
        archetype: `Nuovo Archetipo ${draft.results.length + 1}`,
        title: "NUOVO TITOLO",
        description: "Descrizione del risultato.",
        icon: "✨",
      },
    ]);

  const onSave = () => {
    const cleaned: QuizFrociarolaContent = {
      ...draft,
      questions: draft.questions.map((q) => ({
        ...q,
        question: q.question.trim(),
        options: q.options
          .filter((o) => o.text.trim())
          .map((o) => ({
            text: o.text.trim(),
            archetype: o.archetype.trim(),
            points: Number.isFinite(o.points) ? Math.max(0, o.points) : 1,
          })),
      })),
      results: draft.results.map((r) => ({
        archetype: r.archetype.trim(),
        title: r.title.trim(),
        description: r.description.trim(),
        icon: r.icon.trim() || "✨",
      })),
    };

    if (cleaned.questions.some((q) => !q.question || q.options.length === 0)) {
      toast({
        title: "Quiz incompleto",
        description: "Ogni domanda deve avere testo e almeno un'opzione.",
        variant: "destructive",
      });
      return;
    }
    if (cleaned.results.some((r) => !r.archetype || !r.title)) {
      toast({
        title: "Risultato incompleto",
        description: "Ogni risultato deve avere archetipo e titolo.",
        variant: "destructive",
      });
      return;
    }

    update.mutate(
      { data: cleaned },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetQuizAmicoGayContentQueryKey(),
          });
          toast({ title: "Quiz salvato", description: "Modifiche live." });
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
    <div className="space-y-4">
      <NeonCard>
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-5 h-5 text-accent" />
          <p className="font-display text-xl text-white">
            QUIZ — CHE AMICO GAY SEI?
          </p>
        </div>
        <p className="text-xs text-white/60 mb-4">
          Modifica domande, opzioni e risultati. Ogni opzione assegna dei punti
          a un archetipo. Vince l'archetipo con più punti.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-accent uppercase tracking-widest">
              Risultati ({draft.results.length})
            </p>
            <Button
              size="sm"
              type="button"
              onClick={onAddResult}
              className="bg-accent/30 hover:bg-accent/50 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Aggiungi
            </Button>
          </div>

          {draft.results.map((r, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/15 bg-white/5 p-3 space-y-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px] gap-2">
                <div>
                  <Label className="text-[10px] text-white/60 uppercase">
                    Archetipo
                  </Label>
                  <Input
                    value={r.archetype}
                    onChange={(e) => {
                      const next = [...draft.results];
                      next[idx] = { ...r, archetype: e.target.value };
                      setResults(next);
                    }}
                    className="bg-white/10 border-white/30 text-white h-9"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-white/60 uppercase">
                    Titolo
                  </Label>
                  <Input
                    value={r.title}
                    onChange={(e) => {
                      const next = [...draft.results];
                      next[idx] = { ...r, title: e.target.value };
                      setResults(next);
                    }}
                    className="bg-white/10 border-white/30 text-white h-9"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-white/60 uppercase">
                    Icona
                  </Label>
                  <Input
                    value={r.icon}
                    onChange={(e) => {
                      const next = [...draft.results];
                      next[idx] = { ...r, icon: e.target.value };
                      setResults(next);
                    }}
                    className="bg-white/10 border-white/30 text-white h-9 text-center"
                  />
                </div>
              </div>
              <Textarea
                value={r.description}
                onChange={(e) => {
                  const next = [...draft.results];
                  next[idx] = { ...r, description: e.target.value };
                  setResults(next);
                }}
                rows={2}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    setResults(draft.results.filter((_, i) => i !== idx))
                  }
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Elimina
                </Button>
              </div>
            </div>
          ))}
        </div>
      </NeonCard>

      <NeonCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-accent uppercase tracking-widest">
              Domande ({draft.questions.length})
            </p>
            <Button
              size="sm"
              type="button"
              onClick={onAddQuestion}
              className="bg-accent/30 hover:bg-accent/50 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Aggiungi
            </Button>
          </div>

          {draft.questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="rounded-xl border border-white/15 bg-white/5 p-3 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-accent text-sm">
                  D{qIdx + 1}
                </span>
                <div className="flex-1">
                  <Input
                    value={q.question}
                    onChange={(e) => {
                      const next = [...draft.questions];
                      next[qIdx] = { ...q, question: e.target.value };
                      setQuestions(next);
                    }}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setQuestions(move(draft.questions, qIdx, qIdx - 1))}
                    disabled={qIdx === 0}
                    className="p-1 text-white/60 hover:text-white disabled:opacity-20"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestions(move(draft.questions, qIdx, qIdx + 1))}
                    disabled={qIdx === draft.questions.length - 1}
                    className="p-1 text-white/60 hover:text-white disabled:opacity-20"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuestions(draft.questions.filter((_, i) => i !== qIdx))
                  }
                  className="p-2 text-destructive hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pl-2 border-l-2 border-accent/40">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_140px_60px_28px] gap-2 items-end"
                  >
                    <div>
                      <Label className="text-[10px] text-white/60 uppercase">
                        Opzione
                      </Label>
                      <Input
                        value={opt.text}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oIdx] = { ...opt, text: e.target.value };
                          const qs = [...draft.questions];
                          qs[qIdx] = { ...q, options: opts };
                          setQuestions(qs);
                        }}
                        className="bg-white/10 border-white/30 text-white h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-white/60 uppercase">
                        Archetipo
                      </Label>
                      <select
                        value={opt.archetype}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oIdx] = { ...opt, archetype: e.target.value };
                          const qs = [...draft.questions];
                          qs[qIdx] = { ...q, options: opts };
                          setQuestions(qs);
                        }}
                        className="w-full h-9 rounded-md bg-white/10 border border-white/30 text-white text-sm px-2"
                      >
                        {!archetypes.includes(opt.archetype) && (
                          <option value={opt.archetype}>
                            {opt.archetype || "—"} (manca!)
                          </option>
                        )}
                        {archetypes.map((a) => (
                          <option key={a} value={a} className="bg-background">
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-[10px] text-white/60 uppercase">
                        Punti
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={opt.points}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oIdx] = {
                            ...opt,
                            points: parseInt(e.target.value, 10) || 0,
                          };
                          const qs = [...draft.questions];
                          qs[qIdx] = { ...q, options: opts };
                          setQuestions(qs);
                        }}
                        className="bg-white/10 border-white/30 text-white h-9 text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const opts = q.options.filter((_, i) => i !== oIdx);
                        const qs = [...draft.questions];
                        qs[qIdx] = { ...q, options: opts };
                        setQuestions(qs);
                      }}
                      className="h-9 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    const qs = [...draft.questions];
                    qs[qIdx] = {
                      ...q,
                      options: [
                        ...q.options,
                        {
                          text: "Nuova opzione",
                          archetype: archetypes[0] ?? "",
                          points: 1,
                        },
                      ],
                    };
                    setQuestions(qs);
                  }}
                  className="text-accent hover:bg-accent/10"
                >
                  <Plus className="w-4 h-4 mr-1" /> Opzione
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onSave}
          disabled={!dirty || update.isPending}
          className="w-full mt-4 bg-accent hover:bg-accent/80 text-accent-foreground font-display"
        >
          {update.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> SALVA QUIZ
            </>
          )}
        </Button>
      </NeonCard>
    </div>
  );
}
