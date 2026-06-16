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
    <div className="min-h-screen bg-canvas md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-none flex-col border-r border-stone-200 bg-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5 text-primary">
          <Heartbeat /> <span className="text-lg font-semibold">PregnaCare</span>
        </div>
        {name && (
          <div className="mx-4 mb-4 rounded-lg bg-canvas px-3 py-2">
            <div className="text-sm font-semibold text-stone-800">{name}</div>
            <div className="text-xs text-stone-400">Signed in</div>
          </div>
        )}
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                view === n.id ? "bg-primary text-white" : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between px-4 py-4">
          <LangToggle lang={lang} setLang={setLang} />
          <button onClick={signOut} className="text-sm font-medium text-stone-500 hover:text-stone-800">
            Log out
          </button>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 text-primary">
            <Heartbeat /> <span className="font-semibold">PregnaCare</span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <button onClick={signOut} className="text-sm font-medium text-stone-500">
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{screen}</main>
      </div>

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