import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "./components/navbar";
import { ProtectedRoute } from "./components/protected-route";
import { HoverBorderGradient } from "./components/ui/hover-border-gradient";
import Login from "./pages/login";
import AuthCallback from "./pages/auth-callback";
import Chat from "./pages/chat";
import Captioning from "./pages/captioning";
import { useEffect } from "react";
import { ArrowBigUp, ArrowUpSquare, CaptionsIcon, MessageCircleIcon } from "lucide-react";
import { BsGraphUpArrow } from "react-icons/bs";

function Home() {
  useEffect(() => { console.log("printing") }, [])
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(200,245,66,0.18),_transparent),linear-gradient(180deg,#0a0a0a_0%,#111_55%,#0a0a0a_100%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
      />

      <Navbar />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-11/12 max-w-5xl flex-col items-center justify-center gap-8 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight sm:text-7xl"
        >
          Video-Transcription
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="max-w-xl text-base text-foreground/60 sm:text-lg"
        >
          Upload a clip for English captions, or chat with AI Chat Bot — same account,
          same API.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="flex flex-wrap items-center justify-center gap-[20px]"
        >
         
            <Link to="/captioning" className="[text-decoration:none] bg-foreground text-background rounded-md p-[2px] w-[170px] px-1 flex items-center justify-center">
              Start captioning <CaptionsIcon/>
            </Link>

          <Link
            to="/chat"
            className="[text-decoration:none] text-foreground rounded-md  gap-px p-[2px] px-1 flex items-center justify-center"
          >
            Open chat <ArrowUpSquare/>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-foreground">
      <p className="font-[family-name:var(--font-display)] text-4xl">404</p>
      <p className="text-foreground/50">Page not found</p>
      <Link to="/" className="text-[#c8f542] hover:underline">
        Go home
      </Link>
    </div>
  );
}

function Test() {
  return (<div>chalo doorn kahin</div>)
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/test" element={<Test />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
        //  element={<ProtectedRoute />}
         >
          <Route path="/captioning" element={<Captioning />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
