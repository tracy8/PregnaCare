import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { getProfile } from "../lib/db";
import Dashboard from "./Dashboard";
import App from "../App";
import Guide from "./Guide";

type Lang = "en" | "rw";
type View = "dashboard" | "risk" | "guide";

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { id: "risk", label: "Risk check", icon: <HeartIcon /> },
  { id: "guide", label: "Guide", icon: <BookIcon /> },
];

export default function AppShell() {
  const { signOut } = useAuth();
  const [view, setView] = useState<View>("dashboard");
  const [lang, setLang] = useState<Lang>("en");
  const [name, setName] = useState("");

  useEffect(() => {
    getProfile()
      .then((p) => setName(p?.full_name?.split(" ")[0] ?? ""))
      .catch(() => {});
  }, []);

  const screen =
    view === "dashboard" ? (
      <Dashboard onNavigate={(v) => setView(v as View)} />
    ) : view === "risk" ? (
      <App lang={lang} />
    ) : (
      <Guide />
    );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Fixed white top nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary">
              <Heartbeat /> <span className="text-xl font-semibold">PregnaCare</span>
            </div>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-md font-medium transition ${
                    view === n.id ? "bg-primary/10 text-primary" : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {n.icon} {n.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {name && (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <LogoutIcon />
              <span className="hidden sm:inline">Log out</span>
            </button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

        </div>
      </header>

      {/* Content (padded to clear the fixed bar and the mobile bottom nav) */}
      <main className="pt-20 pb-24 md:pb-10">{screen}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white md:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
              view === n.id ? "text-primary" : "text-stone-400"
            }`}
          >
            {n.icon} {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 text-sm">
      {(["en", "rw"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 ${
            lang === l ? "bg-primary text-white" : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function HomeIcon() {
  return <IconWrap><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></IconWrap>;
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17l5-5-5-5" /><path d="M20 12H9" />
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
function HeartIcon() {
  return <IconWrap><path d="M12 20s-6.5-4.3-6.5-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 6.5 2.8C18.5 15.7 12 20 12 20z" /></IconWrap>;
}
function BookIcon() {
  return <IconWrap><path d="M6 4h9a2 2 0 0 1 2 2v13H8a2 2 0 0 0-2 2V4z" /><path d="M8 19h9" /></IconWrap>;
}
function Heartbeat() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}