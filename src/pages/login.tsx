import { useLocation } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";
import { getGoogleLoginUrl } from "@/lib/api";
import Navbar from "@/components/navbar";

function Login() {
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from || "/captioning";

  function handleGoogleLogin() {
    sessionStorage.setItem("postLoginRedirect", from);
    window.location.href = getGoogleLoginUrl();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,245,66,0.12),transparent_55%),linear-gradient(180deg,#0a0a0a_0%,#121212_100%)]" />
      <div className="pointer-events-none absolute -right-24 top-24 size-72 rounded-full bg-[#c8f542]/10 blur-3xl" />
      <Navbar />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-11/12 max-w-md flex-col items-center justify-center gap-8 py-16 text-center ">
        <div className="space-y-3">
          <p className="font-(family-name:--font-display) text-4xl tracking-tight sm:text-5xl">
            Video-Transcription
          </p>
          <p className="text-foreground/60 ">
            Sign in with Google to caption videos and feel free to chat with ai.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex  h-[40px] w-1/2 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black transition border-background shadow-[0px_0px_5px_rgba(255,255,255,0.3),inset_0px_0px_5px_black]  "
        >
          <BsGoogle className="size-4" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
