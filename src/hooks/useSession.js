import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getCurrentSession } from "../services/authService";

export default function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getCurrentSession()
      .then((currentSession) => {
        if (alive) setSession(currentSession);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}
