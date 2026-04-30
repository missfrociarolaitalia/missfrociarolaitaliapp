import { getAdminToken } from "./admin";

const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadContestantPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Per favore scegli un'immagine.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("L'immagine è troppo grande (max 10 MB).");
  }
  const token = getAdminToken();
  if (!token) {
    throw new Error("Non sei loggata come admin.");
  }

  const requestRes = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
    }),
  });

  if (!requestRes.ok) {
    throw new Error("Impossibile preparare il caricamento.");
  }

  const { uploadURL, objectPath } = (await requestRes.json()) as {
    uploadURL: string;
    objectPath: string;
  };

  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Caricamento foto fallito.");
  }

  return `/api/storage${objectPath}`;
}
