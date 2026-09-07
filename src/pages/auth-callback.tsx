import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore, type User } from "@/states/user-state";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userRaw = searchParams.get("user");

    if (!accessToken || !userRaw) {
      setError("Missing login credentials from Google.");
      return;
    }

    try {
      const user = JSON.parse(userRaw) as User;
      if (!user?.email || !user?.id) {
        throw new Error("Invalid user payload");
      }

      setSession(user, accessToken);
      const redirect = sessionStorage.getItem("postLoginRedirect") || "/captioning";
      sessionStorage.removeItem("postLoginRedirect");
      navigate(redirect, { replace: true });
    } catch {
      setError("Could not complete sign-in. Please try again.");
    }
  }, [navigate, searchParams, setSession]);

  useEffect(() => {
    console.log("chalo door kahin")
  }, [])
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-foreground">
      <div>chal nikal</div>
      {error ? (
        <div className="space-y-4 text-center">
          <p>ashsih </p>
          <p className="text-red-300">{error}</p>
          <a href="/login" className="text-[#c8f542] underline">
            Back to login
          </a>
        </div>
      ) : (
        <p className="text-foreground/70">Finishing sign-in…</p>
      )}
    </div>
  );
}

export default AuthCallback;
