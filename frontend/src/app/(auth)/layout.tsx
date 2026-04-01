export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#070b10] px-4 py-6 md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1400px] overflow-hidden rounded-[var(--radius-xl)] border border-white/8 bg-[#090d13] lg:grid-cols-[1.05fr_0.95fr]">

        {/* Left hero panel */}
        <section className="relative hidden overflow-hidden border-r border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(68,132,255,0.24),transparent_40%),linear-gradient(180deg,#121b2e,#09111d)] p-10 lg:flex lg:flex-col">
          <div className="space-y-5">
            <span className="mono inline-flex rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-widest text-slate-400">
              Failure-Oriented Workflow Analysis
            </span>
            <div>
              <p className="text-5xl font-bold tracking-tight text-white">
                FOWAS
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
                Reliability intelligence for teams who want to turn failures into
                structured operational learning.
              </p>
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            {[
              "Deterministic risk scoring from severity and impact",
              "MTTR, MTBF, and availability-driven reliability panels",
              "Incident taxonomy, cause-chain linking, and operator notes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.04] p-4"
              >
                <p className="text-[13px] leading-relaxed text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right form area */}
        <section className="flex items-center justify-center p-6 md:p-10">{children}</section>
      </div>
    </div>
  );
}
