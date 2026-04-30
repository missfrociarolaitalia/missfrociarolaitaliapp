const STORAGE_KEY = "frociarola_votes_v1";

type VoteMap = Record<string, number>;

function read(): VoteMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VoteMap) : {};
  } catch {
    return {};
  }
}

function write(map: VoteMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
}

export function getVote(id: string): number {
  return read()[id] ?? 0;
}

export function getAllVotes(): VoteMap {
  return read();
}

export function toggleVote(id: string): { voted: boolean; total: number } {
  const map = read();
  const flagKey = `__voted__${id}`;
  const alreadyVoted = !!map[flagKey];
  if (alreadyVoted) {
    map[id] = Math.max(0, (map[id] ?? 1) - 1);
    delete map[flagKey];
    write(map);
    return { voted: false, total: map[id] };
  }
  map[id] = (map[id] ?? 0) + 1;
  map[flagKey] = 1;
  write(map);
  return { voted: true, total: map[id] };
}

export function hasVoted(id: string): boolean {
  return !!read()[`__voted__${id}`];
}
