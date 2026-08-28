import React, { useEffect, useMemo, useState, useRef, useCallback, memo } from 'react';
import { RegiaoId } from '../../types/region';
import { REGIONS_DATA } from '../../data/regions';
import {
  getAllBrazilStates,
  getProjectedCities,
  StateRenderData,
  ProjectedCity,
  MAP_VIEWBOX_WIDTH,
  MAP_VIEWBOX_HEIGHT
} from '../../data/brazilGeo';
import { Compass, Sparkles, Users, Briefcase } from '../UI/Icons';

interface RegionMapProps {
  selectedRegionId: RegiaoId | null;
  hoveredRegionId: RegiaoId | null;
  selectedStateUf: string | null;
  selectedCityName?: string | null;
  isLiveEditorActive?: boolean;
  onSelectRegion: (id: RegiaoId | null) => void;
  onHoverRegion: (id: RegiaoId | null) => void;
  onSelectState: (state: StateRenderData | null) => void;
  onSelectCity?: (cityName: string | null) => void;
  onToggleLiveEditor?: (active: boolean) => void;
}

const COLOR_BASE_STATE = '#1B2433';
const COLOR_STATE_BORDER = '#334155';

const COLOR_NORTE = '#0284c7';
const COLOR_SORRISO = '#eab308';
const COLOR_OESTE = '#16a34a';
const COLOR_LESTE = '#ea580c';

const getCityConsultantColor = (regionId: RegiaoId): string => {
  switch (regionId) {
    case 'norte': return COLOR_NORTE;
    case 'sorriso': return COLOR_SORRISO;
    case 'oeste': return COLOR_OESTE;
    case 'leste': return COLOR_LESTE;
    default: return '#95B955';
  }
};

const StatePolygon = memo<{
  state: StateRenderData;
  isSelected: boolean;
  isNorteActive: boolean;
  isOesteActive: boolean;
  isLesteActive: boolean;
  isAllRegions: boolean;
  onSelect: (state: StateRenderData) => void;
  onHover: (regionId: RegiaoId | null) => void;
}>(({ state, isSelected, isNorteActive, isOesteActive, isLesteActive, isAllRegions, onSelect, onHover }) => {
  let fillColor = COLOR_BASE_STATE;
  let fillOpacity = 0.85;

  if (['RR', 'PA'].includes(state.uf)) {
    fillColor = COLOR_NORTE;
    fillOpacity = isNorteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20;
  } else if (['AC', 'RO'].includes(state.uf)) {
    fillColor = COLOR_OESTE;
    fillOpacity = isOesteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20;
  } else if (['TO', 'BA', 'GO', 'DF', 'MG'].includes(state.uf)) {
    fillColor = COLOR_LESTE;
    fillOpacity = isLesteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20;
  } else if (isSelected) {
    fillColor = '#0284c7';
    fillOpacity = 0.55;
  }

  const strokeColor = isSelected ? '#38bdf8' : COLOR_STATE_BORDER;
  const strokeWidth = isSelected ? 2.5 : 1.2;

  return (
    <path
      id={'state-' + state.uf}
      d={state.path}
      fill={fillColor}
      fillOpacity={fillOpacity}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin='round'
      strokeLinecap='round'
      vectorEffect='non-scaling-stroke'
      style={{
        fill: fillColor,
        fillOpacity: fillOpacity,
        stroke: strokeColor,
        strokeWidth: strokeWidth + 'px',
        transition: 'all 0.3s ease',
      }}
      className='cursor-pointer hover:brightness-125'
      onClick={() => onSelect(state)}
      onMouseEnter={() => state.regionId && onHover(state.regionId)}
      onMouseLeave={() => state.regionId && onHover(null)}
    />
  );
});
StatePolygon.displayName = 'StatePolygon';

const CityMarker = memo<{
  city: ProjectedCity;
  isHighlighted: boolean;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (city: ProjectedCity, e: React.MouseEvent) => void;
  onLeave: () => void;
  onClick: (city: ProjectedCity) => void;
}>(({ city, isHighlighted, isHovered, isSelected, onHover, onLeave, onClick }) => {
  const color = getCityConsultantColor(city.regionId);

  return (
    <g
      transform={'translate(' + city.x + ', ' + city.y + ')'}
      className='cursor-pointer'
      onMouseEnter={(e) => onHover(city, e)}
      onMouseMove={(e) => onHover(city, e)}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick(city);
      }}
      style={{
        opacity: isHighlighted || isSelected ? 1 : 0.3,
        transition: 'opacity 0.3s ease, transform 0.2s ease'
      }}
    >
      {isSelected && (
        <circle cx='0' cy='0' r='16' fill={color} fillOpacity='0.3' />
      )}
      <circle
        cx='0'
        cy='0'
        r={isSelected ? 10 : isHovered ? 9 : 6.5}
        fill={color}
        fillOpacity={isSelected ? 0.8 : isHovered ? 0.5 : 0.35}
        className='transition-all duration-200'
      />
      <circle
        cx='0'
        cy='0'
        r={isSelected ? 6.5 : isHovered ? 5.5 : 3.8}
        fill={isSelected ? '#ffffff' : color}
        stroke={isSelected ? color : '#0F172A'}
        strokeWidth={isSelected ? '2.5' : '1.4'}
        className='transition-all duration-200'
        style={{ filter: isSelected ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' : 'none' }}
      />
      {!isSelected && <circle cx='-0.8' cy='-0.8' r='1.1' fill='#ffffff' fillOpacity='0.9' />}

      {/* Static Floating Pin Badge when City is Selected */}
      {isSelected && (
        <g transform='translate(0, -14)' className='pointer-events-none select-none'>
          <rect
            x={-city.name.length * 3.8 - 8}
            y='-14'
            width={city.name.length * 7.6 + 16}
            height='18'
            rx='9'
            fill='#0B121E'
            stroke='#38bdf8'
            strokeWidth='1.5'
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }}
          />
          <text
            y='-1.5'
            textAnchor='middle'
            fill='#ffffff'
            fontSize='9.5'
            fontWeight='800'
            fontFamily='sans-serif'
          >
            📍 {city.name}
          </text>
        </g>
      )}
    </g>
  );
});
CityMarker.displayName = 'CityMarker';

const StateBadge = memo<{
  state: StateRenderData;
  isSelected: boolean;
}>(({ state, isSelected }) => {
  const isDF = state.uf === 'DF';
  const [cx, cy] = state.centroid;

  let strokeColor = '#334155';
  let textColor = '#94a3b8';
  let bgFill = '#0B121E';

  if (['RR', 'PA', 'MT'].includes(state.uf)) {
    strokeColor = '#0091ff';
    textColor = '#93c5fd';
  } else if (['AC', 'RO'].includes(state.uf)) {
    strokeColor = '#16a34a';
    textColor = '#86efac';
  } else if (['TO', 'BA', 'GO', 'DF', 'MG'].includes(state.uf)) {
    strokeColor = '#ea580c';
    textColor = '#fdba74';
  }

  if (isSelected) {
    strokeColor = '#38bdf8';
    textColor = '#ffffff';
    bgFill = '#0284c7';
  }

  const width = isDF ? 26 : 35;
  const height = isDF ? 17 : 22;
  const fontSize = isDF ? 11.5 : 14.5;

  return (
    <g transform={'translate(' + cx + ', ' + cy + ')'} className='pointer-events-none select-none'>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={4.5}
        fill={bgFill}
        fillOpacity={0.92}
        stroke={strokeColor}
        strokeWidth={isSelected ? 2.2 : 1.5}
        vectorEffect='non-scaling-stroke'
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
      />
      <text
        x='0'
        y='1'
        textAnchor='middle'
        dominantBaseline='central'
        fill={textColor}
        fontSize={fontSize}
        fontWeight='900'
        fontFamily='Exo, Inter, sans-serif'
        letterSpacing='0.5px'
      >
        {state.uf}
      </text>
    </g>
  );
});
StateBadge.displayName = 'StateBadge';

import { ControlPoint, DEFAULT_DIV_NORTE, DEFAULT_DIV_OESTE_LESTE } from '../../types/dividers';
import { loadDividers, saveDividers, subscribeToMapConfigChanges } from '../../services/mapConfigService';

export const RegionMap: React.FC<RegionMapProps> = ({
  selectedRegionId,
  hoveredRegionId,
  selectedStateUf,
  selectedCityName,
  isLiveEditorActive,
  onSelectRegion,
  onHoverRegion,
  onSelectState,
  onSelectCity,
  onToggleLiveEditor,
}) => {
  const [hoveredCity, setHoveredCity] = useState<ProjectedCity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Live MT Dividers Editor State (Drag & Drop Points on Map)
  const [liveEditorMode, setLiveEditorMode] = useState(isLiveEditorActive ?? false);

  useEffect(() => {
    if (isLiveEditorActive !== undefined) {
      setLiveEditorMode(isLiveEditorActive);
    }
  }, [isLiveEditorActive]);

  const handleSetLiveEditorMode = useCallback((valOrFn: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof valOrFn === 'function' ? valOrFn(liveEditorMode) : valOrFn;
    setLiveEditorMode(next);
    onToggleLiveEditor?.(next);
  }, [liveEditorMode, onToggleLiveEditor]);

  const [liveEditorSaveMsg, setLiveEditorSaveMsg] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [editorTool, setEditorTool] = useState<'move' | 'add' | 'delete'>('move');
  const [activeEditorRegion, setActiveEditorRegion] = useState<'all' | 'norte' | 'oeste' | 'leste'>('all');

  // Global Map Zoom & Pan State (+ / - Controls)
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = useCallback(() => {
    setMapZoom((z) => Math.min(8.0, Math.round((z + 0.5) * 10) / 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setMapZoom((z) => Math.max(1.0, Math.round((z - 0.5) * 10) / 10));
  }, []);

  const handleResetZoom = useCallback(() => {
    setMapZoom(1.0);
    setMapPan({ x: 0, y: 0 });
  }, []);

  const [divNorte, setDivNorte] = useState<ControlPoint[]>(() => {
    try {
      const saved = localStorage.getItem('mapa_live_div_norte');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DIV_NORTE;
  });

  const [divOesteLeste, setDivOesteLeste] = useState<ControlPoint[]>(() => {
    try {
      const saved = localStorage.getItem('mapa_live_div_oeste_leste');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DIV_OESTE_LESTE;
  });

  // Carrega divisas do Supabase na inicialização e assina Realtime
  useEffect(() => {
    loadDividers().then(({ divNorte: loadedNorte, divOesteLeste: loadedOL }) => {
      setDivNorte(loadedNorte);
      setDivOesteLeste(loadedOL);
    });

    const unsubscribe = subscribeToMapConfigChanges(
      (newDividers) => {
        setDivNorte(newDividers.divNorte);
        setDivOesteLeste(newDividers.divOesteLeste);
      },
      undefined
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // SVG coordinate transformation accurate across all zoom and responsive scales
  const getSvgCoords = useCallback((e: React.MouseEvent | MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const globalPoint = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.round(globalPoint.x),
      y: Math.round(globalPoint.y),
    };
  }, []);

  const draggingPointRef = useRef<{ list: 'norte' | 'oeste-leste'; id: string } | null>(null);

  const deletePoint = useCallback((list: 'norte' | 'oeste-leste', id: string) => {
    if (list === 'norte') {
      setDivNorte((prev) => {
        if (prev.length <= 4) {
          setLiveEditorSaveMsg('⚠️ Mínimo de 4 pontos');
          setTimeout(() => setLiveEditorSaveMsg(''), 2500);
          return prev;
        }
        const next = prev.filter((p) => p.id !== id);
        saveDividers(next, divOesteLeste);
        setLiveEditorSaveMsg('🗑️ Ponto removido!');
        setTimeout(() => setLiveEditorSaveMsg(''), 2000);
        return next;
      });
    } else {
      setDivOesteLeste((prev) => {
        if (prev.length <= 2) {
          setLiveEditorSaveMsg('⚠️ Mínimo de 2 pontos');
          setTimeout(() => setLiveEditorSaveMsg(''), 2500);
          return prev;
        }
        const next = prev.filter((p) => p.id !== id);
        saveDividers(divNorte, next);
        setLiveEditorSaveMsg('🗑️ Ponto removido!');
        setTimeout(() => setLiveEditorSaveMsg(''), 2000);
        return next;
      });
    }
  }, [divNorte, divOesteLeste]);

  const insertPointAtCoords = useCallback((list: 'norte' | 'oeste-leste', x: number, y: number) => {
    const newId = (list === 'norte' ? 'n_' : 'ol_') + Date.now();
    if (list === 'norte') {
      setDivNorte((prev) => {
        let bestIdx = 1;
        let minD = Infinity;
        for (let i = 0; i < prev.length - 1; i++) {
          const midX = (prev[i].x + prev[i + 1].x) / 2;
          const midY = (prev[i].y + prev[i + 1].y) / 2;
          const d = Math.hypot(x - midX, y - midY);
          if (d < minD) {
            minD = d;
            bestIdx = i + 1;
          }
        }
        const next = [...prev.slice(0, bestIdx), { id: newId, x, y }, ...prev.slice(bestIdx)];
        saveDividers(next, divOesteLeste);
        setLiveEditorSaveMsg('➕ Ponto inserido!');
        setTimeout(() => setLiveEditorSaveMsg(''), 2000);
        return next;
      });
    } else {
      setDivOesteLeste((prev) => {
        let bestIdx = 1;
        let minD = Infinity;
        for (let i = 0; i < prev.length - 1; i++) {
          const midX = (prev[i].x + prev[i + 1].x) / 2;
          const midY = (prev[i].y + prev[i + 1].y) / 2;
          const d = Math.hypot(x - midX, y - midY);
          if (d < minD) {
            minD = d;
            bestIdx = i + 1;
          }
        }
        const next = [...prev.slice(0, bestIdx), { id: newId, x, y }, ...prev.slice(bestIdx)];
        saveDividers(divNorte, next);
        setLiveEditorSaveMsg('➕ Ponto inserido!');
        setTimeout(() => setLiveEditorSaveMsg(''), 2000);
        return next;
      });
    }
  }, [divNorte, divOesteLeste]);

  const handlePointMouseDown = useCallback((list: 'norte' | 'oeste-leste', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editorTool === 'delete') {
      deletePoint(list, id);
      return;
    }
    draggingPointRef.current = { list, id };
  }, [editorTool, deletePoint]);

  const handleLineDoubleClick = useCallback((list: 'norte' | 'oeste-leste', e: React.MouseEvent) => {
    e.stopPropagation();
    const { x, y } = getSvgCoords(e);
    insertPointAtCoords(list, x, y);
  }, [getSvgCoords, insertPointAtCoords]);

  const handlePointContextMenu = useCallback((list: 'norte' | 'oeste-leste', id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deletePoint(list, id);
  }, [deletePoint]);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!draggingPointRef.current) return;
      const { x, y } = getSvgCoords(e);
      const { list, id } = draggingPointRef.current;

      if (list === 'norte') {
        setDivNorte(prev => {
          const next = prev.map(p => (p.id === id ? { ...p, x, y } : p));
          return next;
        });
      } else {
        setDivOesteLeste(prev => {
          const next = prev.map(p => (p.id === id ? { ...p, x, y } : p));
          return next;
        });
      }
    };

    const handleWindowMouseUp = () => {
      if (draggingPointRef.current) {
        draggingPointRef.current = null;
        saveDividers(divNorte, divOesteLeste);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [getSvgCoords, divNorte, divOesteLeste]);

  const handleResetDividers = useCallback(() => {
    setDivNorte(DEFAULT_DIV_NORTE);
    setDivOesteLeste(DEFAULT_DIV_OESTE_LESTE);
    saveDividers(DEFAULT_DIV_NORTE, DEFAULT_DIV_OESTE_LESTE);
    setLiveEditorSaveMsg('↺ Divisas Restauradas');
    setTimeout(() => setLiveEditorSaveMsg(''), 2000);
  }, []);

  const handleCopyDividers = useCallback(() => {
    const code = `// Divisão Norte MT:\n` +
      divNorte.map(p => `  { x: ${p.x}, y: ${p.y} }`).join(',\n') +
      `\n\n// Divisão Oeste/Leste MT:\n` +
      divOesteLeste.map(p => `  { x: ${p.x}, y: ${p.y} }`).join(',\n');
    navigator.clipboard.writeText(code);
    setLiveEditorSaveMsg('✅ Coordenadas Copiadas!');
    setTimeout(() => setLiveEditorSaveMsg(''), 3000);
  }, [divNorte, divOesteLeste]);
  const handleSnapJunction = useCallback(() => {
    if (divNorte.length === 0 || divOesteLeste.length === 0) return;
    let bestIdx = 0;
    let minD = Infinity;
    const targetX = divOesteLeste[0]?.x ?? 380;
    const targetY = divOesteLeste[0]?.y ?? 350;
    for (let i = 0; i < divNorte.length; i++) {
      const d = Math.hypot(divNorte[i].x - targetX, divNorte[i].y - targetY);
      if (d < minD) {
        minD = d;
        bestIdx = i;
      }
    }
    const jp = divNorte[bestIdx];
    setDivOesteLeste(prev => {
      const next = [{ ...prev[0], x: jp.x, y: jp.y }, ...prev.slice(1)];
      try { localStorage.setItem('mapa_live_div_oeste_leste', JSON.stringify(next)); } catch {}
      return next;
    });
    setLiveEditorSaveMsg('🧲 Junção 100% alinhada!');
    setTimeout(() => setLiveEditorSaveMsg(''), 2500);
  }, [divNorte, divOesteLeste]);

  const mtPaths = useMemo(() => {
    const n = divNorte;
    const ol = divOesteLeste;

    if (n.length === 0 || ol.length === 0) {
      return { norteD: '', oesteD: '', lesteD: '', norteLineD: '', oesteLesteLineD: '', junctionIndex: 0 };
    }

    // 1. Calculate the exact closest point on divNorte to be the master junction
    let junctionIndex = 0;
    let minD = Infinity;
    const targetX = ol[0]?.x ?? 380;
    const targetY = ol[0]?.y ?? 350;
    for (let i = 0; i < n.length; i++) {
      const d = Math.hypot(n[i].x - targetX, n[i].y - targetY);
      if (d < minD) {
        minD = d;
        junctionIndex = i;
      }
    }

    const junctionPoint = n[junctionIndex];
    // Master vertical line strictly starts from the exact junction vertex
    const seamlessOl = [junctionPoint, ...ol.slice(1)];

    const norteBottomD = n.map(p => `${p.x} ${p.y}`).join(' L ');
    const norteD = `M 240 200 L 550 200 L 550 ${n[n.length - 1].y} L ${n.slice().reverse().map(p => `${p.x} ${p.y}`).join(' L ')} L 240 ${n[0].y} Z`;

    const oesteTopD = n.slice(0, junctionIndex + 1).map(p => `${p.x} ${p.y}`).join(' L ');
    const oesteRightD = seamlessOl.slice(1).map(p => `${p.x} ${p.y}`).join(' L ');
    const oesteD = `M 240 550 L 240 ${n[0].y} L ${oesteTopD} L ${oesteRightD} L 240 550 Z`;

    const lesteLeftD = seamlessOl.slice(1).reverse().map(p => `${p.x} ${p.y}`).join(' L ');
    const lesteTopD = n.slice(junctionIndex).map(p => `${p.x} ${p.y}`).join(' L ');
    const lesteD = `M 550 550 L 395 550 L ${lesteLeftD} L ${lesteTopD} L 550 ${n[n.length - 1].y} L 550 550 Z`;

    return {
      norteD,
      oesteD,
      lesteD,
      norteLineD: 'M ' + norteBottomD,
      oesteLesteLineD: 'M ' + seamlessOl.map(p => `${p.x} ${p.y}`).join(' L '),
      junctionIndex,
      junctionPoint,
    };
  }, [divNorte, divOesteLeste]);



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectRegion(null);
        onSelectState(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectRegion, onSelectState]);

  const states = useMemo(() => getAllBrazilStates(), []);
  const cities = useMemo(() => getProjectedCities(), []);
  const mtState = useMemo(() => states.find((s) => s.uf === 'MT'), [states]);

  const selectedCityObj = useMemo(() => {
    if (!selectedCityName) return null;
    const q = selectedCityName.toLowerCase().trim();
    return cities.find((c) => c.name.toLowerCase() === q || c.id === q || c.rawName.toLowerCase() === q) || null;
  }, [cities, selectedCityName]);

  const activeRegion = selectedRegionId || hoveredRegionId;
  const isAllRegions = activeRegion === null;

  const isNorteActive = isAllRegions || activeRegion === 'norte' || activeRegion === 'sorriso';
  const isOesteActive = isAllRegions || activeRegion === 'oeste';
  const isLesteActive = isAllRegions || activeRegion === 'leste';

  const transformStyle = useMemo(() => {
    let target = { cx: 450, cy: 450, scale: 1 };

    if (liveEditorMode) {
      const baseScale = mapZoom;
      target = { cx: 390 + mapPan.x, cy: 400 + mapPan.y, scale: baseScale };
    } else {
      switch (selectedRegionId) {
        case 'norte': target = { cx: 440 + mapPan.x, cy: 260 + mapPan.y, scale: 1.60 * mapZoom }; break;
        case 'sorriso': target = { cx: 400 + mapPan.x, cy: 395 + mapPan.y, scale: 2.30 * mapZoom }; break;
        case 'oeste': target = { cx: 245 + mapPan.x, cy: 435 + mapPan.y, scale: 1.70 * mapZoom }; break;
        case 'leste': target = { cx: 520 + mapPan.x, cy: 460 + mapPan.y, scale: 1.58 * mapZoom }; break;
        default: target = { cx: 450 + mapPan.x, cy: 450 + mapPan.y, scale: mapZoom }; break;
      }
    }

    const tx = ((450 - target.cx) * target.scale) / 9;
    const ty = ((450 - target.cy) * target.scale) / 9;

    return {
      transform: 'translate3d(' + tx + '%, ' + ty + '%, 0) scale(' + target.scale + ')',
      transformOrigin: '50% 50%',
      transition: 'transform 0.28s cubic-bezier(0.2, 0, 0, 1)',
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
      transformStyle: 'preserve-3d' as const,
    };
  }, [selectedRegionId, liveEditorMode, mapZoom, mapPan]);

  const handleCityHover = useCallback((city: ProjectedCity, e: React.MouseEvent) => {
    setHoveredCity(city);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const handleCityLeave = useCallback(() => { setHoveredCity(null); }, []);

  const handleCityClick = useCallback((city: ProjectedCity) => {
    if (selectedCityName === city.name) {
      onSelectCity?.(null);
    } else {
      onSelectCity?.(city.name);
    }
  }, [selectedCityName, onSelectCity]);

  return (
    <div className='relative w-full bg-[#131A26] rounded-3xl border border-[#232E3E] p-3 sm:p-5 shadow-2xl flex flex-col items-center justify-between overflow-hidden h-full'>
      <div className='w-full flex items-center justify-between z-10 mb-2 px-1 text-xs text-slate-400 shrink-0'>
        <div className='flex items-center gap-2'>
          <Compass className='w-4 h-4 text-[#95B955]' />
          <span className='font-bold tracking-wider text-white uppercase font-exo text-[11px] sm:text-xs'>
            MAPA DE COBERTURA • {cities.length} CIDADES ATENDIDAS
          </span>
        </div>
        <div className='flex items-center gap-1.5 bg-[#1B2433] px-3 py-1 rounded-full border border-[#2B384E] shadow-inner text-slate-300 text-[11px] sm:text-xs'>
          <Sparkles className='w-3.5 h-3.5 text-[#95B955]' />
          <span className='font-medium'>
            {activeRegion ? 'Auto-Zoom: ' + activeRegion.toUpperCase() : 'Visão Geral: Brasil'}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className='relative w-full max-w-2xl aspect-square flex items-center justify-center p-1 overflow-hidden'
        style={{ contain: 'paint' }}
        onWheel={(e) => {
          if (liveEditorMode || e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) handleZoomIn();
            else handleZoomOut();
          }
        }}
      >
        {/* Sleek Floating Zoom Pill Widget (Positioned in Bottom-Left Empty Space, Never Obstructs States) */}
        <div className='absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-[#0B121E]/90 border border-[#2B384E] px-2 py-1 rounded-full shadow-2xl select-none'>
          <button
            onClick={handleZoomIn}
            className='w-7 h-7 rounded-full bg-slate-800 hover:bg-sky-600 text-white font-bold text-base flex items-center justify-center transition-all shadow active:scale-95'
            title='Aumentar Zoom (+)'
          >
            +
          </button>

          <span className='px-1 text-[11px] font-mono font-bold text-sky-300 min-w-[28px] text-center'>
            {Math.round(mapZoom * 10) / 10}x
          </span>

          <button
            onClick={handleZoomOut}
            className='w-7 h-7 rounded-full bg-slate-800 hover:bg-sky-600 text-white font-bold text-base flex items-center justify-center transition-all shadow active:scale-95'
            title='Diminuir Zoom (-)'
          >
            -
          </button>

          {(mapZoom !== 1.0 || mapPan.x !== 0 || mapPan.y !== 0) && (
            <button
              onClick={handleResetZoom}
              className='ml-1 px-2.5 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-[10.5px] font-bold flex items-center gap-1 transition-all shadow active:scale-95 ring-1 ring-amber-400/50'
              title='Resetar Zoom (1.0x) e Centralizar'
            >
              <span>↺</span>
              <span>1x</span>
            </button>
          )}
        </div>
        <div className='w-full h-full relative' style={transformStyle}>
          <svg
            ref={svgRef}
            viewBox={'0 0 ' + MAP_VIEWBOX_WIDTH + ' ' + MAP_VIEWBOX_HEIGHT}
            className='w-full h-full select-none'
            preserveAspectRatio='xMidYMid meet'
            shapeRendering='geometricPrecision'
            role='img'
            aria-label='Mapa do Brasil'
          >
            <defs>
              <pattern id='tech-grid' width='30' height='30' patternUnits='userSpaceOnUse'>
                <path d='M 30 0 L 0 0 0 30' fill='none' stroke='rgba(255, 255, 255, 0.025)' strokeWidth='1' />
              </pattern>
              {mtState && (
                <clipPath id='clip-state-MT'>
                  <path d={mtState.path} />
                </clipPath>
              )}
            </defs>

            <rect width={MAP_VIEWBOX_WIDTH} height={MAP_VIEWBOX_HEIGHT} fill='url(#tech-grid)' pointerEvents='none' />

            <g id='states-fill-layer'>
              {states.map((st) => {
                if (st.uf === 'MT') return null;
                return (
                  <StatePolygon
                    key={st.uf}
                    state={st}
                    isSelected={selectedStateUf === st.uf}
                    isNorteActive={isNorteActive}
                    isOesteActive={isOesteActive}
                    isLesteActive={isLesteActive}
                    isAllRegions={isAllRegions}
                    onSelect={onSelectState}
                    onHover={onHoverRegion}
                  />
                );
              })}
            </g>

            {mtState && (
              <g id='state-MT-group' className='cursor-pointer' onClick={() => onSelectState(mtState)}>
                <g clipPath='url(#clip-state-MT)'>
                  {/* Região Norte */}
                  <path
                    d={mtPaths.norteD}
                    fill={COLOR_NORTE}
                    fillOpacity={isNorteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20}
                    className='transition-colors duration-300'
                  />
                  {/* Região Oeste */}
                  <path
                    d={mtPaths.oesteD}
                    fill={COLOR_OESTE}
                    fillOpacity={isOesteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20}
                    className='transition-colors duration-300'
                  />
                  {/* Região Leste */}
                  <path
                    d={mtPaths.lesteD}
                    fill={COLOR_LESTE}
                    fillOpacity={isLesteActive ? (isAllRegions ? 0.35 : 0.55) : 0.20}
                    className='transition-colors duration-300'
                  />
                </g>
              </g>
            )}

            <g id='states-borders-layer' className='pointer-events-none'>
              {states.map((st) => (
                <path key={'border-' + st.uf} d={st.path} className={selectedStateUf === st.uf ? 'state-border-line-selected' : 'state-border-line'} />
              ))}
              {mtState && (
                <g clipPath='url(#clip-state-MT)'>
                  <path
                    d={mtPaths.norteLineD}
                    fill='none'
                    stroke={liveEditorMode ? '#38bdf8' : '#334155'}
                    strokeWidth={liveEditorMode ? 2.5 : 1}
                    strokeDasharray={liveEditorMode ? '6 4' : '4 3'}
                    strokeOpacity={liveEditorMode ? 1 : 0.7}
                    vectorEffect='non-scaling-stroke'
                  />
                  <path
                    d={mtPaths.oesteLesteLineD}
                    fill='none'
                    stroke={liveEditorMode ? '#38bdf8' : '#334155'}
                    strokeWidth={liveEditorMode ? 2.5 : 1}
                    strokeDasharray={liveEditorMode ? '6 4' : '4 3'}
                    strokeOpacity={liveEditorMode ? 1 : 0.7}
                    vectorEffect='non-scaling-stroke'
                  />
                </g>
              )}
            </g>

            {/* Cities Markers Layer (Static & Visible during Live Editor Mode with pointer-events-none) */}
            <g
              id='cities-markers-layer'
              className={liveEditorMode ? 'pointer-events-none select-none' : ''}
              style={{ pointerEvents: liveEditorMode ? 'none' : 'auto' }}
            >
              {cities.map((city) => {
                const isCityStateSelected = selectedStateUf ? city.uf === selectedStateUf : true;
                const isCityRegionSelected = selectedRegionId ? city.regionId === selectedRegionId : true;
                const isHighlighted = isCityStateSelected && isCityRegionSelected;
                const isHovered = !liveEditorMode && hoveredCity?.id === city.id;
                const isSelected = selectedCityObj?.id === city.id || selectedCityName?.toLowerCase() === city.name.toLowerCase();

                return (
                  <CityMarker
                    key={city.id}
                    city={city}
                    isHighlighted={isHighlighted}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    onHover={liveEditorMode ? () => {} : handleCityHover}
                    onLeave={liveEditorMode ? () => {} : handleCityLeave}
                    onClick={liveEditorMode ? () => {} : handleCityClick}
                  />
                );
              })}
            </g>

            <g id='states-badges-layer' className='pointer-events-none select-none'>
              {states.map((st) => (
                <StateBadge key={'svg-badge-' + st.uf} state={st} isSelected={selectedStateUf === st.uf} />
              ))}
            </g>

            {/* Interactive Live Control Handles for Dragging Divider Lines (Topmost Interactive Layer) */}
            {liveEditorMode && (() => {
              const currentScale = mapZoom > 1.0 ? mapZoom : 2.4;
              const nodeR = Math.max(2.5, 7.5 / currentScale);
              const pingR = nodeR * 1.6;
              const strokeW = Math.max(0.8, 2.0 / currentScale);
              const hitR = Math.max(9, 20 / currentScale);
              const fontSize = Math.max(6, 9 / currentScale);
              const labelY = -nodeR - (3.5 / currentScale);
              const delBtnR = Math.max(4, 7 / currentScale);

              const junctionIdx = mtPaths.junctionIndex ?? 0;

              const showNorteLine = activeEditorRegion === 'all' || activeEditorRegion === 'norte' || activeEditorRegion === 'oeste' || activeEditorRegion === 'leste';
              const showVerticalLine = activeEditorRegion === 'all' || activeEditorRegion === 'oeste' || activeEditorRegion === 'leste';

              return (
                <g id='live-divider-handles-layer'>
                  {/* Clickable Line to Add Point */}
                  {showNorteLine && (
                    <path
                      d={mtPaths.norteLineD}
                      fill='none'
                      stroke='transparent'
                      strokeWidth={Math.max(16, 32 / currentScale)}
                      className={editorTool === 'add' ? 'cursor-crosshair' : 'cursor-copy'}
                      onClick={(e) => {
                        if (editorTool === 'add') {
                          const { x, y } = getSvgCoords(e);
                          insertPointAtCoords('norte', x, y);
                        }
                      }}
                      onDoubleClick={(e) => handleLineDoubleClick('norte', e)}
                    />
                  )}
                  {showVerticalLine && (
                    <path
                      d={mtPaths.oesteLesteLineD}
                      fill='none'
                      stroke='transparent'
                      strokeWidth={Math.max(16, 32 / currentScale)}
                      className={editorTool === 'add' ? 'cursor-crosshair' : 'cursor-copy'}
                      onClick={(e) => {
                        if (editorTool === 'add') {
                          const { x, y } = getSvgCoords(e);
                          insertPointAtCoords('oeste-leste', x, y);
                        }
                      }}
                      onDoubleClick={(e) => handleLineDoubleClick('oeste-leste', e)}
                    />
                  )}

                  {/* Norte Divider Points */}
                  {divNorte.map((p, idx) => {
                    const isHovered = hoveredNodeId === p.id;
                    const isEnd = idx === 0 || idx === divNorte.length - 1;
                    const isJunction = idx === junctionIdx;
                    const showLabel = isHovered || isEnd || isJunction;

                    // Filter points according to activeEditorRegion
                    if (activeEditorRegion === 'oeste' && idx > junctionIdx) return null;
                    if (activeEditorRegion === 'leste' && idx < junctionIdx) return null;

                    const pointColor = isJunction
                      ? '#38bdf8'
                      : activeEditorRegion === 'oeste'
                      ? '#16a34a'
                      : activeEditorRegion === 'leste'
                      ? '#ea580c'
                      : isHovered
                      ? '#38bdf8'
                      : '#0284c7';

                    const pointLabel = isJunction
                      ? '📍 Junção'
                      : activeEditorRegion === 'oeste'
                      ? `O${idx}`
                      : activeEditorRegion === 'leste'
                      ? `L${idx - junctionIdx}`
                      : idx === 0 ? 'Oeste' : idx === divNorte.length - 1 ? 'Leste' : `N${idx}`;

                    return (
                      <g
                        key={p.id}
                        transform={`translate(${p.x}, ${p.y})`}
                        className={'select-none group ' + (editorTool === 'delete' ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing')}
                        onMouseDown={(e) => handlePointMouseDown('norte', p.id, e)}
                        onContextMenu={(e) => handlePointContextMenu('norte', p.id, e)}
                        onMouseEnter={() => setHoveredNodeId(p.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        {/* Large Invisible Hit Target for Effortless Mouse Grab */}
                        <circle r={hitR} fill='transparent' />
                        {(isHovered || isJunction) && (
                          <circle r={pingR} fill={editorTool === 'delete' ? '#ef4444' : pointColor} fillOpacity='0.4' className={isJunction ? 'animate-pulse' : 'animate-ping'} />
                        )}
                        <circle
                          r={isHovered ? nodeR * 1.4 : isJunction ? nodeR * 1.25 : nodeR}
                          fill={editorTool === 'delete' ? '#ef4444' : pointColor}
                          stroke={isJunction ? '#fde047' : '#ffffff'}
                          strokeWidth={isJunction ? strokeW * 1.5 : strokeW}
                          className='transition-all duration-150 shadow-lg'
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }}
                        />
                        {showLabel && (
                          <text
                            y={labelY}
                            textAnchor='middle'
                            fill={isJunction ? '#fde047' : '#ffffff'}
                            fontSize={isJunction ? fontSize * 1.1 : fontSize}
                            fontWeight='bold'
                            fontFamily='monospace'
                            className='pointer-events-none select-none drop-shadow font-mono bg-black/80'
                          >
                            {pointLabel}
                          </text>
                        )}
                        {/* Instant Delete Button on Hover (Click to remove without right-click) */}
                        {isHovered && !isEnd && !isJunction && (
                          <g
                            transform={`translate(${nodeR * 1.9}, ${-nodeR * 1.9})`}
                            className='cursor-pointer group/del'
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deletePoint('norte', p.id);
                            }}
                          >
                            <circle r={delBtnR} fill='#ef4444' stroke='#ffffff' strokeWidth={strokeW} className='shadow' />
                            <text
                              y={delBtnR * 0.4}
                              textAnchor='middle'
                              fill='#ffffff'
                              fontSize={delBtnR * 1.4}
                              fontWeight='bold'
                            >
                              ×
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Oeste-Leste Vertical Divider Points */}
                  {showVerticalLine && divOesteLeste.slice(1).map((p, idx) => {
                    const isHovered = hoveredNodeId === p.id;
                    const isEnd = idx === divOesteLeste.length - 2;
                    const showLabel = isHovered || isEnd;

                    const pointColor = activeEditorRegion === 'oeste'
                      ? '#16a34a'
                      : activeEditorRegion === 'leste'
                      ? '#ea580c'
                      : isHovered
                      ? '#fdba74'
                      : '#ea580c';

                    const pointLabel = activeEditorRegion === 'oeste'
                      ? `O_S${idx + 1}`
                      : activeEditorRegion === 'leste'
                      ? `L_S${idx + 1}`
                      : isEnd ? 'Sul' : `S${idx + 1}`;

                    return (
                      <g
                        key={p.id}
                        transform={`translate(${p.x}, ${p.y})`}
                        className={'select-none group ' + (editorTool === 'delete' ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing')}
                        onMouseDown={(e) => handlePointMouseDown('oeste-leste', p.id, e)}
                        onContextMenu={(e) => handlePointContextMenu('oeste-leste', p.id, e)}
                        onMouseEnter={() => setHoveredNodeId(p.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        {/* Large Invisible Hit Target for Effortless Mouse Grab */}
                        <circle r={hitR} fill='transparent' />
                        {isHovered && (
                          <circle r={pingR} fill={editorTool === 'delete' ? '#ef4444' : pointColor} fillOpacity='0.4' className='animate-ping' />
                        )}
                        <circle
                          r={isHovered ? nodeR * 1.35 : nodeR}
                          fill={editorTool === 'delete' ? '#ef4444' : pointColor}
                          stroke='#ffffff'
                          strokeWidth={strokeW}
                          className='transition-all duration-150 shadow-lg'
                          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }}
                        />
                        {showLabel && (
                          <text
                            y={labelY}
                            textAnchor='middle'
                            fill='#ffffff'
                            fontSize={fontSize}
                            fontWeight='bold'
                            fontFamily='monospace'
                            className='pointer-events-none select-none drop-shadow font-mono bg-black/80'
                          >
                            {pointLabel}
                          </text>
                        )}
                        {/* Instant Delete Button on Hover */}
                        {isHovered && !isEnd && (
                          <g
                            transform={`translate(${nodeR * 1.9}, ${-nodeR * 1.9})`}
                            className='cursor-pointer group/del'
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deletePoint('oeste-leste', p.id);
                            }}
                          >
                            <circle r={delBtnR} fill='#ef4444' stroke='#ffffff' strokeWidth={strokeW} className='shadow' />
                            <text
                              y={delBtnR * 0.4}
                              textAnchor='middle'
                              fill='#ffffff'
                              fontSize={delBtnR * 1.4}
                              fontWeight='bold'
                            >
                              ×
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </svg>

        </div>

        {hoveredCity && tooltipPos && (
          <div className='absolute pointer-events-none z-50 transition-transform duration-75 ease-out transform -translate-x-1/2 -translate-y-full' style={{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px', marginTop: '-14px' }}>
            <div className='bg-[#0B121E]/95 border text-white px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap backdrop-blur-xl' style={{ borderColor: getCityConsultantColor(hoveredCity.regionId), boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.9), 0 0 15px ' + getCityConsultantColor(hoveredCity.regionId) + '44' }}>
              <span className='w-2.5 h-2.5 rounded-full shrink-0 shadow-sm' style={{ backgroundColor: getCityConsultantColor(hoveredCity.regionId) }} />
              <span className='text-sm sm:text-base font-medium tracking-wide font-exo text-white'>{hoveredCity.name} - {hoveredCity.uf}</span>
            </div>
            <div className='w-2.5 h-2.5 bg-[#0B121E] rotate-45 mx-auto -mt-1.5 border-r border-b' style={{ borderColor: getCityConsultantColor(hoveredCity.regionId) }} />
          </div>
        )}
      </div>

      {/* Floating Top Pill Bar when Live Editor is Active */}
      {liveEditorMode && (
        <div className='fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-[#0B121E]/95 border border-sky-500/80 rounded-full px-3.5 py-1.5 shadow-2xl backdrop-blur-xl flex items-center gap-2 text-white text-xs whitespace-nowrap animate-fade-in'>
          <div className='flex items-center gap-1.5 font-bold text-sky-300 shrink-0 pr-1'>
            <span className='w-2 h-2 rounded-full bg-sky-400 animate-pulse' />
            <span>✂️ Divisas:</span>
          </div>

          {liveEditorSaveMsg && (
            <span className='text-green-400 font-bold bg-green-950/90 px-2 py-0.5 rounded-full border border-green-600 text-[11px] shrink-0'>
              {liveEditorSaveMsg}
            </span>
          )}

          {/* Active Region Switcher */}
          <div className='flex items-center bg-slate-900/90 p-0.5 rounded-full border border-slate-700/80 shrink-0'>
            <button
              onClick={() => {
                setActiveEditorRegion('all');
                setMapPan({ x: 0, y: 0 });
                setMapZoom(2.4);
              }}
              className={'px-2 py-0.5 rounded-full text-xs font-bold transition-all ' + (activeEditorRegion === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white')}
              title='Exibir todas as divisas'
            >
              🌐 Todas
            </button>
            <button
              onClick={() => {
                setActiveEditorRegion('norte');
                setMapPan({ x: 0, y: -45 });
                setMapZoom(2.8);
              }}
              className={'px-2.5 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (activeEditorRegion === 'norte' ? 'bg-sky-600 text-white shadow' : 'text-sky-400 hover:text-sky-300')}
              title='Editar somente a divisa da Região Norte'
            >
              🔵 Norte
            </button>
            <button
              onClick={() => {
                setActiveEditorRegion('oeste');
                setMapPan({ x: -50, y: 35 });
                setMapZoom(2.8);
              }}
              className={'px-2.5 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (activeEditorRegion === 'oeste' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-emerald-300')}
              title='Editar somente as divisas da Região Oeste'
            >
              🟢 Oeste
            </button>
            <button
              onClick={() => {
                setActiveEditorRegion('leste');
                setMapPan({ x: 50, y: 35 });
                setMapZoom(2.8);
              }}
              className={'px-2.5 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (activeEditorRegion === 'leste' ? 'bg-orange-600 text-white shadow' : 'text-orange-400 hover:text-orange-300')}
              title='Editar somente as divisas da Região Leste'
            >
              🟠 Leste
            </button>
          </div>

          <div className='w-px h-4 bg-slate-700 shrink-0' />

          {/* Tool Modes: Move / Add / Delete */}
          <div className='flex items-center bg-slate-900/90 p-0.5 rounded-full border border-slate-700/80 shrink-0'>
            <button
              onClick={() => setEditorTool('move')}
              className={'px-2 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (editorTool === 'move' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white')}
              title='Modo Mover: Arraste os pontos com o mouse'
            >
              ✋ Mover
            </button>
            <button
              onClick={() => setEditorTool('add')}
              className={'px-2 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (editorTool === 'add' ? 'bg-amber-600 text-white shadow ring-1 ring-amber-300' : 'text-slate-400 hover:text-white')}
              title='Modo Inserir: Clique na linha para adicionar um novo ponto'
            >
              ➕ Inserir
            </button>
            <button
              onClick={() => setEditorTool('delete')}
              className={'px-2 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ' + (editorTool === 'delete' ? 'bg-red-600 text-white shadow ring-1 ring-red-300' : 'text-slate-400 hover:text-white')}
              title='Modo Remover: Clique em qualquer ponto para apagá-lo'
            >
              🗑️ Excluir
            </button>
          </div>

          <div className='w-px h-4 bg-slate-700 shrink-0' />

          {/* Quick Zoom Buttons inside Pill */}
          <div className='flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700 shrink-0'>
            <button onClick={handleZoomOut} className='w-5 h-5 flex items-center justify-center hover:bg-slate-700 text-white font-bold text-xs rounded-full' title='Diminuir Zoom'>-</button>
            <span className='text-[11px] font-mono text-sky-300 font-bold px-1'>{Math.round(mapZoom * 10) / 10}x</span>
            <button onClick={handleZoomIn} className='w-5 h-5 flex items-center justify-center hover:bg-slate-700 text-white font-bold text-xs rounded-full' title='Aumentar Zoom'>+</button>
            <button
              onClick={handleResetZoom}
              className='ml-1 px-1.5 py-0.5 text-[10px] bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold transition-all shadow'
              title='Resetar Zoom para 1.0x'
            >
              ↺ 1x
            </button>
          </div>

          <button
            onClick={handleSnapJunction}
            className='px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full text-xs shadow transition-all flex items-center gap-1 shrink-0'
            title='Alinhar e travar o ponto de encontro das 3 regiões perfeitamente'
          >
            🧲 Alinhar Junção
          </button>

          <button
            onClick={handleCopyDividers}
            className='px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-full text-xs shadow transition-all flex items-center gap-1 shrink-0'
            title='Copiar coordenadas para o chat'
          >
            📋 Copiar
          </button>

          <button
            onClick={handleResetDividers}
            className='px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-full text-xs transition-all shrink-0'
            title='Resetar para o padrão'
          >
            ↺ Reset
          </button>

          <button
            onClick={() => handleSetLiveEditorMode(false)}
            className='px-3.5 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-xs shadow transition-all shrink-0'
            title='Concluir edição'
          >
            ✓ Concluir
          </button>
        </div>
      )}

      {/* Floating Interactive City Info Banner when a City is Selected */}
      {selectedCityObj && !liveEditorMode && (
        <div className='absolute bottom-16 left-1/2 -translate-x-1/2 z-40 bg-[#0B121E]/95 border border-sky-500/90 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-white max-w-lg animate-fade-in'>
          <div className='w-3.5 h-3.5 rounded-full bg-sky-400 animate-ping shrink-0' />
          <div className='flex flex-col min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              <span className='font-black text-sky-300 text-sm tracking-wide truncate'>
                📍 {selectedCityObj.name} ({selectedCityObj.uf})
              </span>
              <span className='text-[10px] bg-sky-950 px-2 py-0.5 rounded-full border border-sky-600 font-bold text-sky-200 shrink-0 uppercase'>
                {selectedCityObj.regionId === 'sorriso' ? 'Polo Sorriso' : 'Região ' + selectedCityObj.regionId}
              </span>
            </div>
            <span className='text-xs text-slate-300 truncate'>
              Consultor: <strong className='text-white'>{selectedCityObj.consultor || REGIONS_DATA[selectedCityObj.regionId]?.equipe.consultor.nome}</strong> • Comercial: <strong className='text-white'>{selectedCityObj.comercial || REGIONS_DATA[selectedCityObj.regionId]?.equipe.comercial.nome}</strong>
            </span>
          </div>
          <button
            onClick={() => onSelectCity?.(null)}
            className='w-6 h-6 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all shrink-0 ml-1'
            title='Fechar destaque da cidade'
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Bottom Button for Live MT Divider Editor */}
      <div className='fixed bottom-4 right-4 z-[100]'>
        <button
          className={'px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl transition-all flex items-center gap-1.5 ' + (liveEditorMode ? 'bg-sky-500 hover:bg-sky-400 text-black ring-2 ring-sky-300' : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/50')}
          onClick={() => handleSetLiveEditorMode((v) => !v)}
        >
          {liveEditorMode ? '✓ Concluir Divisas' : '✂️ Ajustar Divisas do MT (Arrastar ao Vivo)'}
        </button>
      </div>

      <div className='w-full mt-2 pt-2 border-t border-[#232E3E] flex flex-col gap-1.5 text-xs shrink-0 z-10'>
        <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-2 sm:gap-3 bg-[#17202D]/90 border border-[#2B384E] rounded-2xl p-2 sm:px-3 sm:py-1.5 shadow-md flex-1 backdrop-blur-md'>
            <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
              <span className='font-bold text-[#95B955] uppercase tracking-wider text-[10px] sm:text-[10.5px] flex items-center gap-1'>
                <Users className='w-3.5 h-3.5' /> Consultores:
              </span>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><span className='w-2.5 h-2.5 rounded-full bg-[#0091ff] shadow-[0_0_6px_#0091ff]' /><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>Wanderson (Norte)</span></div>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><span className='w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_6px_#eab308]' /><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>Cledinei (Sorriso)</span></div>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><div className='flex items-center -space-x-1'><span className='w-2.5 h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_6px_#16a34a]' /><span className='w-2.5 h-2.5 rounded-full bg-[#ea580c] shadow-[0_0_6px_#ea580c]' /></div><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>André (Oeste / Leste)</span></div>
            </div>
            <div className='hidden xl:block w-px h-4 bg-[#232E3E]' />
            <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
              <span className='font-bold text-[#38bdf8] uppercase tracking-wider text-[10px] sm:text-[10.5px] flex items-center gap-1'>
                <Briefcase className='w-3.5 h-3.5' /> Comerciais:
              </span>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><div className='flex items-center -space-x-1'><span className='w-2.5 h-2.5 rounded-full bg-[#0091ff]' /><span className='w-2.5 h-2.5 rounded-full bg-[#eab308]' /></div><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>Sidnei (Norte / Sorriso)</span></div>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><span className='w-2.5 h-2.5 rounded-full bg-[#16a34a]' /><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>Pablo (Oeste)</span></div>
              <div className='flex items-center gap-1.5 bg-[#111722] px-2 py-0.5 rounded-lg border border-[#232E3E]'><span className='w-2.5 h-2.5 rounded-full bg-[#ea580c]' /><span className='text-slate-200 text-[10px] sm:text-[10.5px] font-medium'>Gilberto (Leste)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
