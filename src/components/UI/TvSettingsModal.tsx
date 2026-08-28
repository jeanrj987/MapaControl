import React, { useEffect } from 'react';
import { Clock, X, Play, Pause, CheckCircle2, Sliders } from './Icons';

export interface RegionTimers {
  norte: number;
  sorriso: number;
  oeste: number;
  leste: number;
  geral: number;
}

export const DEFAULT_REGION_TIMERS: RegionTimers = {
  norte: 12,
  sorriso: 12,
  oeste: 12,
  leste: 12,
  geral: 10,
};

interface TvSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
  regionTimers: RegionTimers;
  onChangeRegionTimer: (key: keyof RegionTimers, seconds: number) => void;
  onApplyAllTimers: (seconds: number) => void;
  onResetTimers: () => void;
}

interface RegionConfig {
  key: keyof RegionTimers;
  label: string;
  sub: string;
  color: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
}

const REGION_CONFIGS: RegionConfig[] = [
  {
    key: 'norte',
    label: 'Norte MT a PA/RR',
    sub: 'Wanderson • Sidnei (25 cid.)',
    color: '#38bdf8',
    borderColor: '#0284c7',
    bgColor: 'rgba(2, 132, 199, 0.12)',
    dotColor: '#0091ff',
  },
  {
    key: 'sorriso',
    label: 'Sorriso e Região',
    sub: 'Cledinei • Sidnei (16 cid.)',
    color: '#facc15',
    borderColor: '#ca8a04',
    bgColor: 'rgba(202, 138, 4, 0.12)',
    dotColor: '#eab308',
  },
  {
    key: 'oeste',
    label: 'Oeste MT a RO/AC',
    sub: 'André • Pablo (23 cid.)',
    color: '#4ade80',
    borderColor: '#16a34a',
    bgColor: 'rgba(22, 163, 74, 0.12)',
    dotColor: '#16a34a',
  },
  {
    key: 'leste',
    label: 'Leste MT a TO/GO/MG',
    sub: 'André • Gilberto (33 cid.)',
    color: '#fb923c',
    borderColor: '#ea580c',
    bgColor: 'rgba(234, 88, 12, 0.12)',
    dotColor: '#ea580c',
  },
  {
    key: 'geral',
    label: 'Visão Geral (Todas)',
    sub: 'Painel Geral Completo (97 cid.)',
    color: '#95B955',
    borderColor: '#95B955',
    bgColor: 'rgba(149, 185, 85, 0.12)',
    dotColor: '#95B955',
  },
];

const GLOBAL_PRESETS = [5, 8, 10, 12, 15, 20, 30];

export const TvSettingsModal: React.FC<TvSettingsModalProps> = ({
  isOpen,
  onClose,
  isTvMode,
  onToggleTvMode,
  regionTimers,
  onChangeRegionTimer,
  onApplyAllTimers,
  onResetTimers,
}) => {
  // Fecha com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCycleSeconds =
    (regionTimers.norte || 0) +
    (regionTimers.sorriso || 0) +
    (regionTimers.oeste || 0) +
    (regionTimers.leste || 0) +
    (regionTimers.geral || 0);

  const formatTotalTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${sec} segundos`;
    if (remainder === 0) return `${mins} min`;
    return `${mins}m ${remainder}s`;
  };

  const handleStep = (key: keyof RegionTimers, delta: number) => {
    const curr = regionTimers[key] || 12;
    const newVal = Math.min(120, Math.max(3, curr + delta));
    onChangeRegionTimer(key, newVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Container do Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tv-settings-title"
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#1D242E] border border-[#2E3A4B] rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100 overflow-hidden"
      >
        {/* Luz ambiente temática */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#95B955]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0091FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-[#2E3A4B] pb-3 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#95B955]/15 border border-[#95B955]/30 flex items-center justify-center text-[#95B955] shadow-inner">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 id="tv-settings-title" className="text-base sm:text-lg font-black tracking-wide text-white font-exo">
                Tempo de Rotação por Região (Modo TV)
              </h2>
              <p className="text-xs text-slate-400">
                Personalize o tempo individual de cada etapa da apresentação
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#202834] hover:bg-[#2E3A4B] text-slate-400 hover:text-white transition-colors border border-[#2E3A4B]"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Barra de Status e Atalho Rápido Global */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 z-10 shrink-0">
          {/* Status Modo TV */}
          <div className="flex items-center justify-between bg-[#202834] px-3.5 py-2.5 rounded-2xl border border-[#2E3A4B] shadow-inner">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  isTvMode ? 'bg-[#95B955] shadow-lg shadow-[#95B955]/50 animate-ping' : 'bg-slate-500'
                }`}
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isTvMode ? 'Modo TV: Ativo' : 'Modo TV: Pausado'}
                </span>
                <p className="text-[10.5px] text-slate-400">
                  Ciclo total: <strong className="text-[#95B955]">{formatTotalTime(totalCycleSeconds)}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTvMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isTvMode
                  ? 'bg-[#95B955] text-[#1D242E] hover:bg-[#a6cb63]'
                  : 'bg-[#2E3A4B] text-slate-300 hover:text-white'
              }`}
            >
              {isTvMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTvMode ? 'Pausar' : 'Ativar'}</span>
            </button>
          </div>

          {/* Atalho: Aplicar mesmo tempo a todas */}
          <div className="flex flex-col justify-center bg-[#202834] px-3.5 py-2 rounded-2xl border border-[#2E3A4B]">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#95B955]" />
              Definir igual para todas:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {GLOBAL_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onApplyAllTimers(p)}
                  className="px-2 py-0.5 rounded-lg bg-[#1D242E] hover:bg-[#95B955] hover:text-[#1D242E] text-slate-300 border border-[#2E3A4B] text-[11px] font-bold transition-all"
                  title={`Aplicar ${p}s em todas as regiões`}
                >
                  {p}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Lista de Regiões com Ajuste Individual */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 z-10 max-h-[46vh] sm:max-h-[50vh]">
          {REGION_CONFIGS.map((reg) => {
            const currentSeconds = regionTimers[reg.key] || 12;

            return (
              <div
                key={reg.key}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl border transition-all"
                style={{
                  backgroundColor: reg.bgColor,
                  borderColor: `${reg.borderColor}55`,
                }}
              >
                {/* Identificação da Região */}
                <div className="flex items-center gap-2.5 min-w-[200px]">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black shadow-sm shrink-0"
                    style={{ backgroundColor: reg.dotColor }}
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-black tracking-wide font-exo" style={{ color: reg.color }}>
                      {reg.label}
                    </h3>
                    <p className="text-[10.5px] text-slate-300">{reg.sub}</p>
                  </div>
                </div>

                {/* Controles de Tempo (Stepper + Slider + Presets) */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Atalhos Rápidos por linha */}
                  <div className="hidden md:flex items-center gap-1">
                    {[5, 10, 15, 20].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onChangeRegionTimer(reg.key, s)}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                          currentSeconds === s
                            ? 'bg-[#95B955] text-[#1D242E] border-[#95B955]'
                            : 'bg-[#1D242E]/70 text-slate-400 hover:text-white border-[#2E3A4B]'
                        }`}
                      >
                        {s}s
                      </button>
                    ))}
                  </div>

                  {/* Stepper [-] [ Valor ] [+] */}
                  <div className="flex items-center bg-[#1D242E] rounded-xl border border-[#2E3A4B] p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleStep(reg.key, -1)}
                      className="w-7 h-7 rounded-lg bg-[#202834] hover:bg-[#2E3A4B] text-white font-bold flex items-center justify-center transition-colors text-sm"
                      title="Reduzir 1s"
                    >
                      -
                    </button>

                    <div className="w-14 text-center">
                      <span className="text-xs sm:text-sm font-black font-exo" style={{ color: reg.color }}>
                        {currentSeconds}s
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStep(reg.key, 1)}
                      className="w-7 h-7 rounded-lg bg-[#202834] hover:bg-[#2E3A4B] text-white font-bold flex items-center justify-center transition-colors text-sm"
                      title="Aumentar 1s"
                    >
                      +
                    </button>
                  </div>

                  {/* Mini Slider */}
                  <input
                    type="range"
                    min="3"
                    max="60"
                    step="1"
                    value={currentSeconds}
                    onChange={(e) => onChangeRegionTimer(reg.key, Number(e.target.value))}
                    className="w-20 sm:w-28 accent-[#95B955] h-1.5 bg-[#1D242E] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Rodapé com Ações */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E3A4B] z-10 shrink-0">
          <button
            type="button"
            onClick={onResetTimers}
            className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            Restaurar Padrões de Tempo
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 bg-[#95B955] hover:bg-[#a6cb63] text-[#1D242E] font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-[#95B955]/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar e Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
