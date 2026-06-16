import { useState } from "react";

type Lang = "en" | "rw";

const S = {
  en: {
    appName: "PregnaCare",
    login: "Log in",
    getStarted: "Get started",
    eyebrow: "Maternal health, close to home",
    h1: "Care for every week of your pregnancy.",
    sub: "PregnaCare helps expecting mothers check their health risk, follow their baby's growth, and know exactly when to visit a clinic.",
    secondaryCta: "I already have an account",
    featuresTitle: "Everything you need, in one place",
    f1t: "Risk in seconds", f1d: "Six simple readings give an instant, model-backed check.",
    f2t: "Week by week", f2d: "Follow your baby's growth with guidance for every stage.",
    f3t: "Care when it counts", f3d: "Clear danger signs tell you when to get help fast.",
    howTitle: "How it works",
    s1t: "Create your account", s1d: "Sign up in under a minute.",
    s2t: "Enter your readings", s2d: "Add the numbers from your antenatal card.",
    s3t: "Get clear guidance", s3d: "See your risk level and what to do next.",
    ctaTitle: "Ready to start?",
    ctaSub: "Create your free account and take your first check today.",
    pWeek: "Week 24", pRing: "of 40", pRisk: "Low risk", pSize: "Size of a corn cob",
    footer: "Built for mothers in Rwanda",
  },
  rw: {
    appName: "PregnaCare",
    login: "Injira",
    getStarted: "Tangira",
    eyebrow: "Ubuzima bw'ababyeyi, hafi yawe",
    h1: "Witabwaho buri cyumweru cyo gutwita kwawe.",
    sub: "PregnaCare ifasha ababyeyi batwite gusuzuma ibyago by'ubuzima, gukurikirana uko umwana akura, no kumenya igihe cyo kujya ku ivuriro.",
    secondaryCta: "Mfite konti",
    featuresTitle: "Ibyo ukeneye byose, ahantu hamwe",
    f1t: "Ibyago ako kanya", f1d: "Ibipimo bitandatu bigutanga isuzuma ryihuse.",
    f2t: "Buri cyumweru", f2d: "Kurikirana uko umwana akura n'inama za buri gihe.",
    f3t: "Ubufasha mu gihe", f3d: "Ibimenyetso bigutera kumenya igihe cyo kwihutira ubufasha.",
    howTitle: "Uko bikora",
    s1t: "Fungura konti", s1d: "Iyandikishe mu munota umwe.",
    s2t: "Injiza ibipimo", s2d: "Ongeraho imibare iri ku ikarita yawe y'ivuriro.",
    s3t: "Bona inama zisobanutse", s3d: "Reba urwego rw'ibyago n'icyo gukora.",
    ctaTitle: "Witeguye gutangira?",
    ctaSub: "Fungura konti yawe y'ubuntu utangire isuzuma ryawe rya mbere uyu munsi.",
    pWeek: "Icyumweru 24", pRing: "mu 40", pRisk: "Ibyago bike", pSize: "Ingana n'ikigori",
    footer: "Yakorewe ababyeyi mu Rwanda",
  },
};

export default function Welcome({ onStart }: { onStart: (m: "login" | "signup") => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = S[lang];

  const features = [
    { t: t.f1t, d: t.f1d, icon: <><path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" /><path d="M9 11.5l2 2 4-4" /></> },
    { t: t.f2t, d: t.f2d, icon: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></> },
    { t: t.f3t, d: t.f3d, icon: <><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
  ];
  const steps = [
    { t: t.s1t, d: t.s1d },
    { t: t.s2t, d: t.s2d },
    { t: t.s3t, d: t.s3d },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-primary">
          <Heartbeat /> <span className="text-lg font-semibold">{t.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} />
          <button
            onClick={() => onStart("login")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            {t.login}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.eyebrow}
          </span>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-4 max-w-md text-stone-500">{t.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onStart("signup")}
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              {t.getStarted}
            </button>
            <button
              onClick={() => onStart("login")}
              className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:border-stone-400"
            >
              {t.secondaryCta}
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-[#0c4a45] p-7 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{t.appName}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{t.pWeek}</span>
            </div>
            <div className="my-6 flex justify-center">
              <WeekRing week={24} sub={t.pRing} />
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">{t.pRisk}</span>
                <span className="rounded-full bg-emerald-400/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-950">
                  92%
                </span>
              </div>
              <div className="mt-2 text-sm text-white/80">{t.pSize}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-center text-2xl font-semibold text-stone-900">{t.featuresTitle}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <IconWrap>{f.icon}</IconWrap>
              </span>
              <div className="mt-3 font-semibold text-stone-900">{f.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-2xl font-semibold text-stone-900">{t.howTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.t} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <div className="mt-3 font-semibold text-stone-900">{s.t}</div>
                <p className="mt-1 text-sm text-stone-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[#0c4a45] px-8 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">{t.ctaSub}</p>
          <button
            onClick={() => onStart("signup")}
            className="mt-6 rounded-xl bg-white px-7 py-3 font-semibold text-primary transition hover:bg-white/90"
          >
            {t.getStarted}
          </button>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-400">
        {t.appName} · {t.footer}
      </footer>
    </div>
  );
}

function WeekRing({ week, sub }: { week: number; sub: string }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(week, 40) / 40);
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e8ad74" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{week}</span>
        <span className="text-[10px] uppercase tracking-wide text-white/60">{sub}</span>
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 text-sm">
      {(["en", "rw"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 ${
            lang === l ? "bg-primary text-white" : "text-stone-500 hover:bg-stone-100"
          }`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function Heartbeat() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}