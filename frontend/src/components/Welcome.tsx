import { useEffect, useState } from "react";

type Lang = "en" | "rw";

const S = {
  en: {
    appName: "PregnaCare",
    login: "Log in",
    getStarted: "Get started",
    eyebrow: "Maternal health, close to home",
    h1a: "Care for every week",
    h1b: "of your pregnancy.",
    sub: "Check your health risk, follow your baby's growth, and know exactly when to visit a clinic — in your own language, on your own phone.",
    secondaryCta: "I already have an account",
    pill1: "Private by design",
    pill2: "Kinyarwanda & English",
    pill3: "Made for Rwanda",
    heroCaption: "Care, week by week",
    statEyebrow: "Why it matters",
    statLead: "Fewer than 6 in 10",
    statBody:
      "mothers in Kigali can recognise a danger sign in pregnancy. Spotting one early can save a life — PregnaCare helps you catch it in time.",

    measureEyebrow: "What you'll measure",
    measureTitle: "Six simple numbers — most from tools you can keep at home",
    measureSub: "Take them from your antenatal card, or measure them yourself. The tools are inexpensive and sold at most pharmacies in Rwanda.",
    m1: "Blood pressure", m1tool: "Home BP monitor",
    m2: "Blood sugar", m2tool: "Glucometer + strips",
    m3: "Body temperature", m3tool: "Thermometer",
    m4: "Heart rate", m4tool: "BP monitor or pulse",
    featuresTitle: "Everything you need, in one place",
    f1t: "Risk in seconds",
    f1d: "Six simple readings give an instant, model-backed check you can understand.",
    f2t: "Week by week",
    f2d: "Follow your baby's growth with guidance written for every stage.",
    f3t: "Care when it counts",
    f3d: "Clear danger signs tell you when to get to a clinic, fast.",

    howTitle: "Start in three steps",
    s1t: "Create your account", s1d: "Sign up in under a minute.",
    s2t: "Enter your readings", s2d: "Add the numbers from your antenatal card.",
    s3t: "Get clear guidance", s3d: "See your risk level and what to do next.",

    ctaTitle: "Ready to start?",
    ctaSub: "Create your free account and take your first check today.",
    footer: "Built for mothers in Rwanda",
  },
  rw: {
    appName: "PregnaCare",
    login: "Injira",
    getStarted: "Tangira",
    eyebrow: "Ubuzima bw'ababyeyi, hafi yawe",
    h1a: "Witabwaho buri cyumweru",
    h1b: "cyo gutwita kwawe.",
    sub: "Suzuma ibyago by'ubuzima, ukurikirane uko umwana akura, umenye igihe cyo kujya ku ivuriro — mu rurimi rwawe, kuri telefoni yawe.",
    secondaryCta: "Mfite konti",
    pill1: "Ibanga ryawe ririnzwe",
    pill2: "Ikinyarwanda n'Icyongereza",
    pill3: "Yakorewe u Rwanda",
    heroCaption: "Kwitabwaho buri cyumweru",

    statEyebrow: "Impamvu bihambaye",
    statLead: "Batageze kuri 6 kuri 10",
    statBody:
      "ni bo babyeyi i Kigali bashobora kumenya ikimenyetso cy'akaga mu gutwita. Kukimenya kare birokora ubuzima — PregnaCare iragufasha.",

    measureEyebrow: "Ibyo uzapima",
    measureTitle: "Imibare itandatu yoroshye — myinshi uyikura ku bikoresho byo mu rugo",
    measureSub: "Yikure ku ikarita y'ivuriro, cyangwa uyipime ubwawe. Ibikoresho ntibihenze kandi biraboneka muri farumasi nyinshi mu Rwanda.",
    m1: "Umuvuduko w'amaraso", m1tool: "Igipimo cyo mu rugo",
    m2: "Isukari mu maraso", m2tool: "Glucometer n'udupapuro",
    m3: "Ubushyuhe bw'umubiri", m3tool: "Termometero",
    m4: "Inshuro umutima utera", m4tool: "Igipimo cyangwa intoki",
    measureNote: "Hiyongeraho imyaka yawe n'igihe umaze utwite — nta gikoresho gikenewe.",

    featuresTitle: "Ibyo ukeneye byose, ahantu hamwe",
    f1t: "Ibyago ako kanya",
    f1d: "Ibipimo bitandatu bigutanga isuzuma ryihuse, ryumvikana.",
    f2t: "Buri cyumweru",
    f2d: "Kurikirana uko umwana akura n'inama za buri gihe.",
    f3t: "Ubufasha mu gihe",
    f3d: "Ibimenyetso bigutera kumenya igihe cyo kwihutira ivuriro.",

    howTitle: "Tangira mu ntambwe eshatu",
    s1t: "Fungura konti", s1d: "Iyandikishe mu munota umwe.",
    s2t: "Injiza ibipimo", s2d: "Ongeraho imibare iri ku ikarita y'ivuriro.",
    s3t: "Bona inama", s3d: "Reba urwego rw'ibyago n'icyo gukora.",

    ctaTitle: "Witeguye gutangira?",
    ctaSub: "Fungura konti y'ubuntu utangire isuzuma rya mbere uyu munsi.",
    footer: "Yakorewe ababyeyi mu Rwanda",
  },
};

export default function Welcome({ onStart }: { onStart: (m: "login" | "signup") => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const [shown, setShown] = useState(false);
  const t = S[lang];

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const reveal = () =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${
      shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
    }`;

  const features = [
    { t: t.f1t, d: t.f1d, tint: "bg-primary/10 text-primary",
      icon: <><path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" /><path d="M9 11.5l2 2 4-4" /></> },
    { t: t.f2t, d: t.f2d, tint: "bg-secondary/20 text-tertiary",
      icon: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></> },
    { t: t.f3t, d: t.f3d, tint: "bg-tertiary/10 text-tertiary",
      icon: <><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
  ];
  const steps = [
    { t: t.s1t, d: t.s1d }, { t: t.s2t, d: t.s2d }, { t: t.s3t, d: t.s3d },
  ];
  const pills = [t.pill1, t.pill2, t.pill3];
  const measures = [
    { name: t.m1, tool: t.m1tool, icon: <GaugeIcon /> },
    { name: t.m2, tool: t.m2tool, icon: <DropIcon /> },
    { name: t.m3, tool: t.m3tool, icon: <ThermoIcon /> },
    { name: t.m4, tool: t.m4tool, icon: <PulseIcon /> },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-stone-800">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-2 text-primary">
            <Heartbeat /> <span className="font-display text-lg font-semibold sm:text-xl">{t.appName}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle lang={lang} setLang={setLang} />
            <button onClick={() => onStart("login")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 sm:px-4">
              {t.login}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-sage opacity-70 blur-3xl" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-20">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary ${reveal()}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {t.eyebrow}
            </span>
            <h1 className={`mt-5 font-display text-[2rem] font-semibold leading-[1.1] text-stone-900 sm:text-5xl lg:text-[3.5rem] ${reveal()}`}
                style={{ transitionDelay: "60ms" }}>
              {t.h1a}<br /><span className="text-primary">{t.h1b}</span>
            </h1>
            <p className={`mt-4 max-w-md text-base leading-relaxed text-stone-500 sm:mt-5 sm:text-lg ${reveal()}`} style={{ transitionDelay: "120ms" }}>
              {t.sub}
            </p>
            <div className={`mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${reveal()}`} style={{ transitionDelay: "180ms" }}>
              <button onClick={() => onStart("signup")}
                className="rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
                {t.getStarted}
              </button>
              <button onClick={() => onStart("login")}
                className="rounded-xl border border-stone-300 bg-white px-6 py-3.5 font-semibold text-stone-700 transition hover:border-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300">
                {t.secondaryCta}
              </button>
            </div>
            <ul className={`mt-7 flex flex-wrap gap-x-5 gap-y-2 ${reveal()}`} style={{ transitionDelay: "240ms" }}>
              {pills.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-sm text-stone-500"><CheckIcon /> {p}</li>
              ))}
            </ul>
          </div>

          <div className={`relative ${reveal()}`} style={{ transitionDelay: "150ms" }}>
            <HeroArt caption={t.heroCaption} />
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-5">
        <div className="rounded-3xl border border-stone-200 bg-white px-6 py-7 shadow-sm sm:px-10 sm:py-8">
          <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
            <div className="text-center sm:text-left">
              <div className="text-xs font-semibold uppercase tracking-widest text-secondary-dark">{t.statEyebrow}</div>
              <div className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">{t.statLead}</div>
            </div>
            <p className="text-center text-stone-600 sm:border-l sm:border-stone-200 sm:pl-8 sm:text-left">{t.statBody}</p>
          </div>
        </div>
      </section>

      {/* What you'll measure */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-14">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t.measureEyebrow}</div>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{t.measureTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-500">{t.measureSub}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {measures.map((m) => (
            <div key={m.name} className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">{m.icon}</span>
              <div className="mt-3 font-semibold text-stone-900">{m.name}</div>
              <div className="mt-1 inline-block rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-medium text-tertiary-dark">{m.tool}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <h2 className="text-center font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{t.featuresTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-stone-200 bg-canvas p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${f.tint}`}><IconWrap>{f.icon}</IconWrap></span>
                <div className="mt-4 font-semibold text-stone-900">{f.t}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <h2 className="text-center font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{t.howTitle}</h2>
        <div className="relative mt-9 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-6 hidden border-t-2 border-dashed border-stone-200 sm:block" />
          {steps.map((s, i) => (
            <div key={s.t} className="relative text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-lg font-semibold text-white ring-8 ring-canvas">{i + 1}</span>
              <div className="mt-4 font-semibold text-stone-900">{s.t}</div>
              <p className="mx-auto mt-1 max-w-[16rem] text-sm text-stone-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-5 sm:pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#0c4a45] px-6 py-12 text-center text-white shadow-lg sm:px-8 sm:py-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full border border-white/10" />
          <h2 className="relative font-display text-2xl font-semibold sm:text-4xl">{t.ctaTitle}</h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">{t.ctaSub}</p>
          <button onClick={() => onStart("signup")}
            className="relative mt-7 rounded-xl bg-white px-8 py-3.5 font-semibold text-primary transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            {t.getStarted}
          </button>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-4 py-7 text-center text-sm text-stone-400">
        <span className="font-display font-semibold text-stone-500">{t.appName}</span> · {t.footer}
      </footer>
    </div>
  );
}

/* ---------- Hero illustration ---------- */
function HeroArt({ caption }: { caption: string }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="170 40 340 470" className="w-full" role="img" aria-label="Illustration of a pregnant woman cradling her belly">
        <rect x="170" y="40" width="340" height="470" rx="36" fill="#efe7d8" />
        <circle cx="330" cy="205" r="120" fill="#f6d9b0" />
        <ellipse cx="340" cy="486" rx="150" ry="22" fill="#dceae1" />
        <circle cx="286" cy="150" r="18" fill="#2e2724" />
        <circle cx="314" cy="168" r="50" fill="#2e2724" />
        <circle cx="326" cy="176" r="44" fill="#a86d49" />
        <rect x="312" y="210" width="26" height="32" rx="10" fill="#a86d49" />
        <path d="M296 238 C286 290 282 360 290 432 C293 458 296 466 300 472 L432 472 C436 462 438 452 438 432 C440 392 444 372 452 350 C474 322 484 286 462 256 C450 236 414 226 366 232 C340 234 312 232 296 238 Z" fill="#2d726e" />
        <path d="M392 300 C384 350 384 410 392 470 L412 470 C406 412 408 352 416 304 Z" fill="#245c58" opacity="0.5" />
        <line x1="360" y1="252" x2="432" y2="352" stroke="#a86d49" stroke-width="24" stroke-linecap="round" />
        <circle cx="434" cy="352" r="15" fill="#a86d49" />
        <path d="M446 296 c-6 -8 -19 -3 -19 7 c0 9 11 15 19 21 c8 -6 19 -12 19 -21 c0 -10 -13 -15 -19 -7 z" fill="#fbedd9" />
      </svg>
      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-lg ring-1 ring-stone-100">
        <Heartbeat className="h-4 w-4 text-primary" /> {caption}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 text-sm">
      {(["en", "rw"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`rounded-md px-2.5 py-1 transition ${lang === l ? "bg-primary text-white" : "text-stone-500 hover:bg-stone-100"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
function IconWrap({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}
function Heartbeat({ className = "h-6 w-6" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 4 10 2-5h6" /></svg>;
}
function GaugeIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16a8 8 0 1 1 14 0" /><path d="M12 16l3-3" /></svg>;
}
function DropIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10z" /></svg>;
}
function ThermoIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z" /></svg>;
}
function PulseIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 4 10 2-5h6" /></svg>;
}