import { useState } from "react";
import { useAuth } from "../lib/auth";

type Lang = "en" | "rw";
type Mode = "login" | "signup" | "reset";

const S = {
  en: {
    appName: "PregnaCare",
    heroTitle: "Every week of your pregnancy, watched over with care.",
    heroBody:
      "Check your health risk in seconds, track your baby's growth, and know when to visit your clinic.",
    trust: "Your health information stays private",
    login: "Log in",
    signup: "Create account",
    welcome: "Welcome back",
    welcomeSub: "Log in to continue tracking your pregnancy.",
    start: "Create your account",
    startSub: "A few details and you're ready to start.",
    fullName: "Full name",
    phone: "Phone number",
    email: "Email",
    password: "Password",
    optional: "optional",
    trimester: "Current stage of pregnancy",
    t1: "First trimester (1–13 weeks)",
    t2: "Second trimester (14–27 weeks)",
    t3: "Third trimester (28–40 weeks)",
    tUnknown: "Not sure yet",
    doLogin: "Log in",
    doSignup: "Create account",
    working: "Please wait…",
    haveAccount: "Already registered?",
    noAccount: "New to PregnaCare?",
    fillRequired: "Please fill in the required fields.",
    checkEmail: "Almost there — check your email to confirm your account, then log in.",
    namePh: "e.g. Tracy Uwase",
    phonePh: "0780 000 000",
    forgot: "Forgot password?",
    resetTitle: "Reset your password",
    resetSub: "Enter your email and we'll send you a reset link.",
    sendReset: "Send reset link",
    resetSent: "Check your email for a link to reset your password.",
    backToLogin: "Back to log in",
  },
  rw: {
    appName: "PregnaCare",
    heroTitle: "Buri cyumweru cyo gutwita kwawe, kirinzwe n'urukundo.",
    heroBody:
      "Suzuma ibyago by'ubuzima mu masegonda, ukurikirane uko umwana akura, umenye igihe cyo kujya ku ivuriro.",
    trust: "Amakuru y'ubuzima bwawe abikwa mu ibanga",
    login: "Injira",
    signup: "Fungura konti",
    welcome: "Murakaza neza",
    welcomeSub: "Injira ukomeze gukurikirana gutwita kwawe.",
    start: "Fungura konti yawe",
    startSub: "Uzuza bike utangire.",
    fullName: "Amazina yombi",
    phone: "Nimero ya telefoni",
    email: "Imeyili",
    password: "Ijambo ry'ibanga",
    optional: "ntibisabwa",
    trimester: "Igihe urimo cyo gutwita",
    t1: "Igice cya mbere (icyumweru 1–13)",
    t2: "Igice cya kabiri (icyumweru 14–27)",
    t3: "Igice cya gatatu (icyumweru 28–40)",
    tUnknown: "Sinzi neza",
    doLogin: "Injira",
    doSignup: "Fungura konti",
    working: "Tegereza gato…",
    haveAccount: "Usanzwe ufite konti?",
    noAccount: "Uri mushya kuri PregnaCare?",
    fillRequired: "Nyamuneka uzuza imyanya isabwa.",
    checkEmail: "Hafi gusoza — reba imeyili yawe wemeze konti, hanyuma winjire.",
    namePh: "urugero: Tracy Uwase",
    phonePh: "0780 000 000",
    forgot: "Wibagiwe ijambo ry'ibanga?",
    resetTitle: "Hindura ijambo ry'ibanga",
    resetSub: "Andika imeyili yawe tukoherereze umuhora wo guhindura.",
    sendReset: "Ohereza umuhora",
    resetSent: "Reba imeyili yawe ubone umuhora wo guhindura ijambo ry'ibanga.",
    backToLogin: "Subira ku kwinjira",
  },
};

const FEATURES = {
  en: [
    { t: "Risk in seconds", s: "Six readings give an instant, model-backed check." },
    { t: "Week by week", s: "Watch your baby grow, with tips for each stage." },
    { t: "Care when it counts", s: "Clear danger signs tell you when to visit a clinic." },
  ],
  rw: [
    { t: "Ibyago ako kanya", s: "Ibipimo bitandatu bigutanga isuzuma ryihuse." },
    { t: "Buri cyumweru", s: "Kurikirana uko umwana akura ubone n'inama." },
    { t: "Ubufasha mu gihe", s: "Ibimenyetso bigutera kumenya igihe cyo kujya ku ivuriro." },
  ],
};

export default function Auth({ initialMode = "login", onBack }: { initialMode?: "login" | "signup"; onBack?: () => void } = {}) {
  const { signUp, signIn, resetPassword } = useAuth();
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState<Record<string, string>>({ trimester: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const t = S[lang];

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const switchMode = (m: Mode) => { setMode(m); setError(""); setNotice(""); };

  const submit = async () => {
    setError("");
    setNotice("");

    if (mode === "reset") {
      if (!form.email) { setError(t.fillRequired); return; }
      setBusy(true);
      try {
        const { error } = await resetPassword(form.email);
        if (error) setError(error);
        else setNotice(t.resetSent);
      } finally {
        setBusy(false);
      }
      return;
    }

    if (mode === "login" && (!form.email || !form.password)) {
      setError(t.fillRequired);
      return;
    }
    if (mode === "signup" && (!form.fullName || !form.email || !form.password)) {
      setError(t.fillRequired);
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(form.email ?? "", form.password ?? "");
        if (error) setError(error);
      } else {
        const { error, needsConfirm } = await signUp({
          email: form.email ?? "",
          password: form.password ?? "",
          fullName: form.fullName ?? "",
          phone: form.phone ?? "",
          trimester: form.trimester || undefined,
          language: lang,
        });
        if (error) setError(error);
        else if (needsConfirm) setNotice(t.checkEmail);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 " +
    "placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  const heading =
    mode === "login" ? t.welcome : mode === "signup" ? t.start : t.resetTitle;
  const subheading =
    mode === "login" ? t.welcomeSub : mode === "signup" ? t.startSub : t.resetSub;
  const submitLabel =
    busy ? t.working : mode === "login" ? t.doLogin : mode === "signup" ? t.doSignup : t.sendReset;

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white md:flex">
        <div className="relative z-10 flex items-center gap-2">
          <Heartbeat />
          <span className="text-xl font-semibold">{t.appName}</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">{t.heroTitle}</h1>
          <p className="mt-4 text-white/80">{t.heroBody}</p>

          <div className="mt-9 grid gap-4">
            <Perk title={FEATURES[lang][0].t} sub={FEATURES[lang][0].s}
              icon={<><path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" /><path d="M9 11.5l2 2 4-4" /></>} />
            <Perk title={FEATURES[lang][1].t} sub={FEATURES[lang][1].s}
              icon={<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></>} />
            <Perk title={FEATURES[lang][2].t} sub={FEATURES[lang][2].s}
              icon={<><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />
          </div>
        </div>

        <p className="relative z-10 flex items-center gap-2 text-sm text-white/70">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          {t.trust}
        </p>

        <div className="pointer-events-none absolute -right-24 -bottom-28 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10" />
      </aside>

      <main className="flex items-center justify-center bg-canvas px-5 py-10">
        <div className="w-full max-w-sm">
          {onBack && (
            <button onClick={onBack}
              className="mb-5 flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
          )}
          <div className="mb-6 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2 text-primary">
              <Heartbeat className="text-primary" />
              <span className="text-lg font-semibold">{t.appName}</span>
            </div>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          {mode !== "reset" && (
            <div className="mb-7 flex gap-1 rounded-xl bg-stone-200/70 p-1">
              {(["login", "signup"] as const).map((m) => (
                <button key={m} onClick={() => switchMode(m)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    mode === m ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                  }`}>
                  {m === "login" ? t.login : t.signup}
                </button>
              ))}
            </div>
          )}

          <div className="mb-6 hidden items-center justify-between md:flex">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900">{heading}</h2>
              <p className="mt-1 text-sm text-stone-500">{subheading}</p>
            </div>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className="grid gap-4">
            {mode === "signup" && (
              <Field label={t.fullName} required>
                <input className={inputCls} placeholder={t.namePh}
                  value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} />
              </Field>
            )}
            {mode === "signup" && (
              <Field label={t.phone} hint={t.optional}>
                <input className={inputCls} inputMode="tel" autoComplete="tel" placeholder={t.phonePh}
                  value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              </Field>
            )}
            <Field label={t.email} required>
              <input className={inputCls} type="email" inputMode="email" autoComplete="email"
                placeholder="you@example.com"
                value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </Field>
            {mode !== "reset" && (
              <Field label={t.password} required>
                <input className={inputCls} type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={form.password ?? ""} onChange={(e) => set("password", e.target.value)} />
              </Field>
            )}
            {mode === "login" && (
              <button type="button" onClick={() => switchMode("reset")}
                className="-mt-1 self-end text-sm font-medium text-primary hover:underline">
                {t.forgot}
              </button>
            )}
            {mode === "signup" && (
              <Field label={t.trimester} hint={t.optional}>
                <select className={inputCls} value={form.trimester}
                  onChange={(e) => set("trimester", e.target.value)}>
                  <option value="">{t.tUnknown}</option>
                  <option value="t1">{t.t1}</option>
                  <option value="t2">{t.t2}</option>
                  <option value="t3">{t.t3}</option>
                </select>
              </Field>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {notice && <p className="mt-3 rounded-lg bg-primary/10 p-3 text-sm text-primary">{notice}</p>}

          <button onClick={submit} disabled={busy}
            className="mt-6 w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-primary-dark disabled:opacity-60">
            {submitLabel}
          </button>

          {mode === "reset" ? (
            <p className="mt-5 text-center text-sm text-stone-500">
              <button onClick={() => switchMode("login")} className="font-semibold text-primary">{t.backToLogin}</button>
            </p>
          ) : (
            <p className="mt-5 text-center text-sm text-stone-500">
              {mode === "login" ? t.noAccount : t.haveAccount}{" "}
              <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-primary">
                {mode === "login" ? t.signup : t.login}
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-600">
      <span>
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && <span className="font-normal text-stone-400"> ({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function Perk({ title, sub, icon }: { title: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-lg bg-white/10">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm leading-snug text-white/70">{sub}</div>
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 text-sm">
      {(["en", "rw"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`rounded-md px-2.5 py-1 ${lang === l ? "bg-primary text-white" : "text-stone-500 hover:bg-stone-100"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Heartbeat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 ${className}`} fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}