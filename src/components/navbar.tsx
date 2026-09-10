import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/states/user-state";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md text-foreground">
      <div className="mx-auto flex h-[80px] w-11/12 max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="text-lg tracking-tight text-foreground [text-decoration:none]"
        >
          Video-Transcription
        </Link>

        <nav className="flex items-center gap-[5px]">
          <NavLink
            to="/captioning"
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 [text-decoration:none] text-sm text-foreground transition ${isActive ? "bg-white/50 text-foreground" : "text-foreground/60 hover:text-foreground"
              }`
            }
          >
            Caption
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 [text-decoration:none] text-sm transition ${isActive ? "bg-white/10 text-foreground" : "text-foreground/60 hover:text-foreground"
              }`
            }
          >
            Chat
          </NavLink>

          {user ? (
            <div className="ml-[2px] flex items-center gap-[2px]">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="size-[20px] rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <div className="flex size-[8px] items-center justify-center rounded-full bg-[#c8f542] text-xs font-semibold text-black">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-background/70 hover:bg-white/10 hover:text-background/90 flex items-center gap-[2px] rounded-md px-3 py-1.5 text-sm transition"
              >
                Log out
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 h-[30px] [text-decoration:none]  [box-shadow:inset_0px_0px_3px_rgba(0,0,0,1)] w-[80px] bg-foreground text-background text-center flex items-center justify-center rounded-lg  px-2.5 text-[0.8rem] font-medium text-black transition"
            >
              Sign in <ArrowRight size={17}/>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
