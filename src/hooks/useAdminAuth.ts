import { useEffect, useState } from "react";
import { isAdminLoggedIn } from "@/lib/admin";

export function useAdminAuth() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isAdminLoggedIn());

  useEffect(() => {
    const sync = () => setLoggedIn(isAdminLoggedIn());
    window.addEventListener("admin-auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("admin-auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return loggedIn;
}
