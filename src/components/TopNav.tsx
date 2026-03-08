import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1440px] px-4 py-3 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              📊
            </div>
            <span className="hidden md:inline">Gestor Tráfego</span>
          </Link>

          <div className="flex gap-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-foreground border-b-2 border-blue-500 pb-3"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Meta Ads
            </Link>
            <Link
              to="/fabricio"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/fabricio"
                  ? "text-foreground border-b-2 border-blue-500 pb-3"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Fabrício
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-lg">
            🟢 Online
          </div>
        </div>
      </div>
    </nav>
  );
}
