import { Trees, Waves } from "lucide-react";

export function PropertyVisual() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-soft bg-night text-white shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(243,201,95,0.28),transparent_28%),linear-gradient(140deg,rgba(15,118,110,0.92),rgba(16,23,21,0.96)_58%)]" />
      <div className="absolute left-7 top-8 h-44 w-28 rounded-t-full bg-paper/95 shadow-2xl" />
      <div className="absolute left-28 top-24 h-56 w-36 rounded-t-[5rem] bg-clay shadow-2xl" />
      <div className="absolute left-14 top-36 h-44 w-56 border-8 border-paper/70" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-moss" />
      <div className="absolute bottom-16 left-8 right-8 h-12 rounded-full border border-white/45 bg-white/14 backdrop-blur" />
      <div className="absolute bottom-6 left-8 flex items-center gap-2 rounded-soft bg-white/14 px-3 py-2 text-xs font-semibold backdrop-blur">
        <Trees aria-hidden="true" size={16} />
        Zonas verdes
      </div>
      <div className="absolute bottom-6 right-8 flex items-center gap-2 rounded-soft bg-white/14 px-3 py-2 text-xs font-semibold backdrop-blur">
        <Waves aria-hidden="true" size={16} />
        Zonas sociales
      </div>
      <div className="absolute right-7 top-8 max-w-[12rem] rounded-soft bg-white/12 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-pollen">Pereira</p>
        <p className="mt-2 text-lg font-semibold leading-tight">
          Casa familiar en conjunto cerrado
        </p>
      </div>
    </div>
  );
}
