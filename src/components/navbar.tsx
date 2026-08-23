import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/states/user-state";
import { Button } from "@/components/ui/button";

function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-11/12 max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-white"
        >
          Video-Transcription
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/captioning"
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`
            }
          >
            Caption
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`
            }
          >
            Chat
          </NavLink>

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="size-8 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#c8f542] text-xs font-semibold text-black">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white/70 hover:bg-white/10 hover:text-white"
              >
                Log out
              </Button>
            </div>
          ) : (
            <Button
              render={<Link to="/login" />}
              size="sm"
              className="ml-2 bg-[#c8f542] text-black hover:bg-[#d4f76a]"
            >
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
