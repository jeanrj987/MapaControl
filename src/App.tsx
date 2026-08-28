import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { RegiaoId } from './types/region';
import { REGIONS_DATA } from './data/regions';
import { StateRenderData } from './data/brazilGeo';
import { Header } from './components/UI/Header';
import { RegionSelector } from './components/RegionSelector/RegionSelector';
import { RegionMap } from './components/Map/RegionMap';
import { RegionDetails } from './components/RegionDetails/RegionDetails';
import { TvSettingsModal, RegionTimers, DEFAULT_REGION_TIMERS } from './components/UI/TvSettingsModal';
import { Clock, Settings } from './components/UI/Icons';
import { loadTvTimers, saveTvTimers, subscribeToMapConfigChanges } from './services/mapConfigService';

const ROTATION_SEQUENCE: (RegiaoId | null)[] = ['norte', 'sorriso', 'oeste', 'leste', null];

interface TvProgressBarProps {
  isTvMode: boolean;
  isPaused: boolean;
  durationSeconds: number;
  currentKey: string | null;
  onNext: () => void;
}

const TvProgressBar = memo<TvProgressBarProps>(({
  isTvMode,
  isPaused,
  durationSeconds,
  currentKey,
  onNext,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isTvMode || isPaused) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = performance.now();
    const durationMs = durationSeconds * 1000;
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (pct >= 100) {
        onNext();
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isTvMode, isPaused, durationSeconds, currentKey, onNext]);

  if (!isTvMode) return null;

  return (
    <div className="w-full h-1 bg-[#1D242E] overflow-hidden shrink-0">
      <div
        className="h-full bg-gradient-to-r from-[#95B955] to-emerald-400"
        style={{
          width: `${progress}%`,
          transform: 'translateZ(0)',
          willChange: 'width',
        }}
      />
    </div>
  );
});
TvProgressBar.displayName = 'TvProgressBar';

export function App() {
  const [selectedRegionId, setSelectedRegionId] = useState<RegiaoId | null>(null);
  const [selectedState, setSelectedState] = useState<StateRenderData | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<RegiaoId | null>(null);
  const [isTvMode, setIsTvMode] = useState<boolean>(false); // Desativado por padrão para estabilidade
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAdjustingDividers, setIsAdjustingDividers] = useState<boolean>(false);

  const [regionTimers, setRegionTimers] = useState<RegionTimers>(() => {
    try {
      const saved = localStorage.getItem('controlsoft_tv_region_timers');
      if (saved) {
        return { ...DEFAULT_REGION_TIMERS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_REGION_TIMERS;
  });

  // Carrega tempos do Supabase na inicialização e assina Realtime
  useEffect(() => {
    loadTvTimers().then((timers) => {
      setRegionTimers(timers);
    });

    const unsubscribe = subscribeToMapConfigChanges(
      undefined,
      (newTimers) => {
        setRegionTimers(newTimers);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Duração em segundos da etapa atualmente em exibição
  const currentDurationSeconds = useMemo(() => {
    const key: keyof RegionTimers = selectedRegionId ? (selectedRegionId as keyof RegionTimers) : 'geral';
    return regionTimers[key] || 12;
  }, [selectedRegionId, regionTimers]);

  // Altera o tempo de uma região específica
  const handleChangeRegionTimer = useCallback((key: keyof RegionTimers, seconds: number) => {
    const validSec = Math.max(3, Math.min(120, seconds));
    setRegionTimers((prev) => {
      const updated = { ...prev, [key]: validSec };
      saveTvTimers(updated);
      return updated;
    });
  }, []);

  // Aplica o mesmo tempo para todas as regiões
  const handleApplyAllTimers = useCallback((seconds: number) => {
    const validSec = Math.max(3, Math.min(120, seconds));
    const updated: RegionTimers = {
      norte: validSec,
      sorriso: validSec,
      oeste: validSec,
      leste: validSec,
      geral: validSec,
    };
    setRegionTimers(updated);
    saveTvTimers(updated);
  }, []);

  // Restaura os tempos padrões
  const handleResetTimers = useCallback(() => {
    setRegionTimers(DEFAULT_REGION_TIMERS);
    saveTvTimers(DEFAULT_REGION_TIMERS);
  }, []);

  // Próxima região no modo TV
  const handleNextTvRegion = useCallback(() => {
    setSelectedRegionId((curr) => {
      const currIdx = ROTATION_SEQUENCE.indexOf(curr);
      const nextIdx = (currIdx + 1) % ROTATION_SEQUENCE.length;
      return ROTATION_SEQUENCE[nextIdx];
    });
    setSelectedState(null);
    setSelectedCityName(null);
  }, []);

  // Alterna o modo de ajuste de divisas
  const handleToggleAdjustDividers = useCallback((active: boolean) => {
    setIsAdjustingDividers(active);
    setIsTvMode(false);
    if (active) {
      setSelectedRegionId(null);
      setSelectedState(null);
      setSelectedCityName(null);
    }
  }, []);

  // Seleção manual via abas
  const handleSelectRegion = useCallback((id: RegiaoId | null) => {
    setIsTvMode(false);
    setIsAdjustingDividers(false);
    setSelectedRegionId((prev) => (prev === id ? null : id));
    setSelectedState(null);
    setSelectedCityName(null);
  }, []);

  // Seleção manual via clique no mapa
  const handleSelectState = useCallback((state: StateRenderData | null) => {
    setIsTvMode(false);
    setIsAdjustingDividers(false);
    setSelectedState((prev) => (prev?.uf === state?.uf ? null : state));
    if (state?.regionId) {
      setSelectedRegionId(state.regionId);
    } else {
      setSelectedRegionId(null);
    }
  }, []);

  const handleHoverRegion = useCallback((id: RegiaoId | null) => {
    setHoveredRegionId(id);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const selectedTitle = useMemo(() => {
    if (isAdjustingDividers) {
      return '✂️ Editor de Divisas do Mato Grosso';
    }
    if (selectedState) {
      return `${selectedState.name} (${selectedState.uf})`;
    }
    return selectedRegionId ? REGIONS_DATA[selectedRegionId]?.nome : null;
  }, [isAdjustingDividers, selectedRegionId, selectedState]);

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col bg-[#151B23] text-slate-100 font-sans overflow-x-hidden lg:overflow-hidden selection:bg-[#95B955] selection:text-[#1D242E]">
      {/* 1. Cabeçalho Superior Responsivo */}
      <Header selectedRegionName={selectedTitle} />

      {/* 2. Barra de Controle TV e Navegação Responsiva */}
      <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-6 pt-2 sm:pt-3 pb-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <RegionSelector
            selectedRegionId={selectedRegionId}
            isAdjustingDividers={isAdjustingDividers}
            onSelectRegion={handleSelectRegion}
            onToggleAdjustDividers={handleToggleAdjustDividers}
          />
        </div>

        {/* Controles Modo TV com Botão de Ajuste de Tempo Individual */}
        <div className="flex items-center justify-end gap-2 bg-[#1D242E] border border-[#2E3A4B] px-3 py-1.5 rounded-2xl shadow-lg shrink-0 self-end sm:self-auto">
          {/* Botão Liga/Desliga TV */}
          <button
            type="button"
            onClick={() => setIsTvMode((prev) => !prev)}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isTvMode
                ? 'bg-[#95B955] text-[#1D242E] shadow-md shadow-[#95B955]/30'
                : 'bg-[#202834] text-slate-300 hover:text-white border border-[#2E3A4B]'
            }`}
            title="Alternar rotação automática de regiões para TV"
          >
            <span className={`w-2 h-2 rounded-full ${isTvMode ? 'bg-[#1D242E] animate-ping' : 'bg-slate-500'}`} />
            <span>{isTvMode ? `Modo TV (${currentDurationSeconds}s)` : '▶️ Iniciar Modo TV'}</span>
          </button>

          {/* Botão de Ajuste de Tempo / Configurações */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#202834] hover:bg-[#2E3A4B] text-slate-300 hover:text-[#95B955] border border-[#2E3A4B] transition-colors text-xs font-bold shadow-sm"
            title="Configurar tempo de rotação individual de cada região"
          >
            <Clock className="w-3.5 h-3.5 text-[#95B955]" />
            <span className="hidden sm:inline">Tempos</span>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Botão Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-[#202834] hover:bg-[#283342] text-slate-300 hover:text-white border border-[#2E3A4B] transition-colors"
            title="Tela Cheia (Fullscreen)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de Progresso da Transição TV Isolada (Zero re-renders no App) */}
      <TvProgressBar
        isTvMode={isTvMode}
        isPaused={!!selectedCityName || isAdjustingDividers}
        durationSeconds={currentDurationSeconds}
        currentKey={selectedRegionId}
        onNext={handleNextTvRegion}
      />

      {/* 3. Conteúdo Principal Responsivo (Grade Mobile -> Desktop / TV) */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-3 sm:px-6 py-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch overflow-y-auto lg:overflow-hidden">
        {/* Coluna do Mapa (Lado Esquerdo no Desktop, Superior no Mobile) */}
        <section
          aria-label="Visualização Geográfica do Mapa"
          className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center min-h-[420px] sm:min-h-[500px] lg:min-h-0 lg:h-full overflow-hidden"
        >
          <RegionMap
            selectedRegionId={selectedRegionId}
            hoveredRegionId={hoveredRegionId}
            selectedStateUf={selectedState?.uf || null}
            selectedCityName={selectedCityName}
            isLiveEditorActive={isAdjustingDividers}
            onSelectRegion={handleSelectRegion}
            onHoverRegion={handleHoverRegion}
            onSelectState={handleSelectState}
            onSelectCity={setSelectedCityName}
            onToggleLiveEditor={setIsAdjustingDividers}
          />
        </section>

        {/* Coluna das Informações (Lado Direito no Desktop, Inferior no Mobile) */}
        <aside
          aria-label="Painel de Informações da Equipe Comercial"
          className="lg:col-span-5 xl:col-span-5 flex flex-col min-h-[500px] sm:min-h-[460px] lg:min-h-0 lg:h-full overflow-hidden"
        >
          <RegionDetails
            selectedRegionId={selectedRegionId}
            selectedStateUf={selectedState?.uf || null}
            selectedCityName={selectedCityName}
            isAdjustingDividers={isAdjustingDividers}
            onSelectRegion={handleSelectRegion}
            onSelectCity={setSelectedCityName}
            onToggleAdjustDividers={handleToggleAdjustDividers}
          />
        </aside>
      </main>

      {/* 4. Rodapé Discreto e Responsivo */}
      <footer className="border-t border-[#2E3A4B] bg-[#1D242E]/95 py-2 px-4 sm:px-6 text-[11px] sm:text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
        <span>ControlSoft &copy; {new Date().getFullYear()} — Tecnologia e Gestão para o Agro</span>
        <span className="text-[#95B955] font-bold">Painel Comercial de Alta Resolução</span>
      </footer>

      {/* 5. Modal de Configurações de Rotação com Ajuste Individual por Região */}
      <TvSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isTvMode={isTvMode}
        onToggleTvMode={() => setIsTvMode((prev) => !prev)}
        regionTimers={regionTimers}
        onChangeRegionTimer={handleChangeRegionTimer}
        onApplyAllTimers={handleApplyAllTimers}
        onResetTimers={handleResetTimers}
      />
    </div>
  );
}

export default App;

