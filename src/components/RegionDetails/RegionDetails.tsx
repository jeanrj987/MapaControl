import React, { useMemo, useState, useEffect } from 'react';
import { RegiaoId, WeatherData } from '../../types/region';
import { REGIONS_DATA, REGIONS_LIST } from '../../data/regions';
import { fetchWeather, fetchBatchWeather, MAIN_CITIES_COORDS } from '../../services/weatherService';
import { EXCEL_CITIES } from '../../data/cidadesExcel';
import { UserCheck, Briefcase, Headphones, MapPin, Building2, Sparkles } from '../UI/Icons';

interface RegionDetailsProps {
  selectedRegionId: RegiaoId | null;
  selectedStateUf: string | null;
  selectedCityName?: string | null;
  isAdjustingDividers?: boolean;
  onSelectRegion: (id: RegiaoId | null) => void;
  onSelectCity?: (cityName: string | null) => void;
  onToggleAdjustDividers?: (active: boolean) => void;
}

const STATE_NAME_MAP: Record<string, string> = {
  MT: 'MATO GROSSO',
  PA: 'PARÁ',
  RR: 'RORAIMA',
  RO: 'RONDÔNIA',
  AC: 'ACRE',
  TO: 'TOCANTINS',
  GO: 'GOIÁS',
  MG: 'MINAS GERAIS',
  BA: 'BAHIA',
};

const getConsultantColor = (regionId: RegiaoId): string => {
  switch (regionId) {
    case 'norte': return '#0091FF';
    case 'sorriso': return '#EAB308';
    case 'oeste': return '#16A34A';
    case 'leste': return '#EA580C';
    default: return '#95B955';
  }
};

const getConsultantBorderColor = (regionId: RegiaoId): string => {
  switch (regionId) {
    case 'norte': return '#0091FF44';
    case 'sorriso': return '#EAB30844';
    case 'oeste': return '#16A34A44';
    case 'leste': return '#EA580C44';
    default: return '#95B95544';
  }
};

export const RegionDetails: React.FC<RegionDetailsProps> = React.memo(({
  selectedRegionId,
  selectedStateUf,
  selectedCityName,
  isAdjustingDividers = false,
  onSelectRegion,
  onSelectCity,
  onToggleAdjustDividers,
}) => {
  const regData = selectedRegionId ? REGIONS_DATA[selectedRegionId] : null;
  const color = selectedRegionId ? getConsultantColor(selectedRegionId) : '#95B955';

  const poloCity = useMemo(() => {
    if (selectedRegionId === 'sorriso') return MAIN_CITIES_COORDS['Sorriso'];
    if (selectedRegionId === 'norte') return MAIN_CITIES_COORDS['Alta Floresta'];
    if (selectedRegionId === 'leste') return MAIN_CITIES_COORDS['Cuiabá'];
    if (selectedRegionId === 'oeste') return MAIN_CITIES_COORDS['Vilhena'];
    return null;
  }, [selectedRegionId]);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cidadeWeatherMap, setCidadeWeatherMap] = useState<Record<string, WeatherData>>({});

  useEffect(() => {
    if (!poloCity) {
      setWeather(null);
      return;
    }
    let active = true;
    fetchWeather(poloCity.name, poloCity.lat, poloCity.lon).then((data) => {
      if (active) setWeather(data);
    });
    return () => { active = false; };
  }, [poloCity]);

  useEffect(() => {
    if (!selectedRegionId || !regData) {
      setCidadeWeatherMap({});
      return;
    }

    let active = true;
    const loadAllCitiesWeather = async () => {
      const regionCities = EXCEL_CITIES.filter((c) => c.regionId === selectedRegionId);
      const data = await fetchBatchWeather(regionCities.map((c) => ({ name: c.name, lat: c.lat, lon: c.lon })));
      if (active) {
        setCidadeWeatherMap(data);
      }
    };

    loadAllCitiesWeather();
    return () => { active = false; };
  }, [selectedRegionId, regData]);

  const totalCidades = useMemo(() => {
    if (!regData) return 0;
    return Object.values(regData.cidadesPorEstado).reduce((acc, curr) => acc + curr.length, 0);
  }, [regData]);

  const entries = useMemo(() => {
    if (!regData) return [];
    return Object.entries(regData.cidadesPorEstado).filter(
      ([uf]) => !selectedStateUf || uf === selectedStateUf
    );
  }, [regData, selectedStateUf]);

  const columns = useMemo(() => {
    if (!selectedRegionId) return [];
    if (selectedRegionId === 'leste') {
      const entryMap = Object.fromEntries(entries);
      return [
        entryMap['MT'] ? [['MT', entryMap['MT']] as [string, string[]]] : [],
        [
          entryMap['GO'] ? (['GO', entryMap['GO']] as [string, string[]]) : null,
          entryMap['BA'] ? (['BA', entryMap['BA']] as [string, string[]]) : null,
        ].filter(Boolean) as [string, string[]][],
        [
          entryMap['TO'] ? (['TO', entryMap['TO']] as [string, string[]]) : null,
          entryMap['MG'] ? (['MG', entryMap['MG']] as [string, string[]]) : null,
        ].filter(Boolean) as [string, string[]][],
      ];
    }
    return entries.map((entry) => [entry]);
  }, [selectedRegionId, entries]);

  if (isAdjustingDividers) {
    return (
      <div className='bg-[#131A26] rounded-3xl border border-sky-500/60 p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full overflow-hidden'>
        <div className='border-b border-[#232E3E] pb-3 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-2.5'>
            <span className='w-4 h-4 rounded-full bg-sky-400 animate-pulse shadow-[0_0_10px_#38bdf8]' />
            <div>
              <h2 className='text-lg sm:text-xl font-black text-sky-400 font-exo uppercase tracking-wide'>
                Ajustar Divisas do MT
              </h2>
              <span className='text-xs text-slate-400 font-medium'>
                Edição vetorial interativa das fronteiras no mapa
              </span>
            </div>
          </div>
          <button
            onClick={() => onToggleAdjustDividers?.(false)}
            className='px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1 shrink-0'
          >
            ✓ Concluir
          </button>
        </div>

        {/* Guia Rápido de Uso */}
        <div className='flex-1 flex flex-col justify-center gap-2.5 py-3 overflow-y-auto'>
          <div className='bg-[#111722] p-3 rounded-2xl border border-[#232E3E] flex items-start gap-3 shadow-sm'>
            <span className='text-xl'>✋</span>
            <div>
              <strong className='text-sm text-sky-300 block'>1. Modo Mover Pontos</strong>
              <span className='text-xs text-slate-300 leading-relaxed'>
                Clique e arraste qualquer bolinha numerada no mapa para puxar e remodelar a linha divisória.
              </span>
            </div>
          </div>

          <div className='bg-[#111722] p-3 rounded-2xl border border-[#232E3E] flex items-start gap-3 shadow-sm'>
            <span className='text-xl'>➕</span>
            <div>
              <strong className='text-sm text-amber-300 block'>2. Inserir Novos Pontos</strong>
              <span className='text-xs text-slate-300 leading-relaxed'>
                Na barra superior, ative <b>➕ Inserir</b> e clique em qualquer parte da linha para criar uma nova curva.
              </span>
            </div>
          </div>

          <div className='bg-[#111722] p-3 rounded-2xl border border-[#232E3E] flex items-start gap-3 shadow-sm'>
            <span className='text-xl'>🗑️</span>
            <div>
              <strong className='text-sm text-red-400 block'>3. Remover Pontos</strong>
              <span className='text-xs text-slate-300 leading-relaxed'>
                Passe o mouse sobre um ponto e clique no <b>×</b> ou ative o modo <b>🗑️ Excluir</b> para apagá-lo.
              </span>
            </div>
          </div>

          <div className='bg-[#111722] p-3 rounded-2xl border border-indigo-500/40 flex items-start gap-3 shadow-sm'>
            <span className='text-xl'>🧲</span>
            <div>
              <strong className='text-sm text-indigo-300 block'>4. Trava de Junção Automática</strong>
              <span className='text-xs text-slate-300 leading-relaxed'>
                O ponto de encontro central entre Norte, Oeste e Leste é fixado matematicamente sem rasgar a divisa.
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé Informativo com Status da Nuvem */}
        <div className='border-t border-[#232E3E] pt-2.5 flex items-center justify-between text-xs text-slate-400 shrink-0'>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
            <span className='text-[11px] font-bold text-emerald-300'>
              ☁️ Sincronização Nuvem (Supabase) Ativa
            </span>
          </div>
          <span className='text-[10px] text-slate-500 hidden sm:inline'>
            Atualização em Tempo Real
          </span>
        </div>
      </div>
    );
  }

  if (selectedRegionId && regData) {
    return (
      <div
        className='bg-[#131A26] rounded-3xl border p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full overflow-hidden'
        style={{ borderColor: color + '66' }}
      >
        <div className='border-b border-[#232E3E] pb-3 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-3'>
            <span
              className='w-4 h-4 rounded-full shrink-0 shadow-lg'
              style={{ backgroundColor: color, boxShadow: '0 0 12px ' + color }}
            />
            <div>
              <h2 className='text-xl sm:text-2xl font-bold tracking-wide uppercase' style={{ color }}>
                {regData.nome}
              </h2>
              <span className='text-xs text-slate-400 font-medium'>
                ControlSoft • Cobertura Comercial no Agro
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2 flex-wrap'>
            {weather && (
              <span className='text-xs font-bold text-amber-300 bg-[#1B2433] px-3 py-1 rounded-full border border-amber-500/50 flex items-center gap-1.5 shadow-sm'>
                <span>{weather.icon}</span>
                <span>{weather.temp}°C</span>
                <span className='text-slate-300 text-[11px] font-normal'>({weather.cityName})</span>
                {weather.rainProbability !== undefined && weather.rainProbability > 0 && (
                  <span className='text-sky-400 font-semibold border-l border-slate-700/80 pl-1.5 ml-0.5 text-[11px] flex items-center gap-0.5'>
                    💧 {weather.rainProbability}%
                  </span>
                )}
              </span>
            )}
            <span className='text-xs font-bold text-slate-200 bg-[#1B2433] px-3 py-1 rounded-full border border-[#2B384E]'>
              {regData.area || 'MT a PA/RR'}
            </span>
            <span className='text-xs font-bold text-[#95B955] bg-[#1B2433] px-3 py-1 rounded-full border border-[#95B955]/40'>
              {totalCidades} Cidades Atendidas
            </span>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2 sm:gap-3 py-3 border-b border-[#232E3E] shrink-0'>
          <div className='bg-[#1B2433]/90 border border-[#2B384E] rounded-2xl p-3 flex flex-col gap-1.5 shadow-md'>
            <div className='flex items-center gap-1.5 text-slate-300 text-xs'>
              <UserCheck className='w-3.5 h-3.5' style={{ color }} />
              <span className='font-bold uppercase tracking-wider text-[11px] text-slate-300'>Consultor</span>
            </div>
            <span className='text-base sm:text-lg font-medium text-slate-100 tracking-tight truncate'>
              {regData.equipe.consultor.nome}
            </span>
          </div>

          <div className='bg-[#1B2433]/90 border border-[#2B384E] rounded-2xl p-3 flex flex-col gap-1.5 shadow-md'>
            <div className='flex items-center gap-1.5 text-slate-300 text-xs'>
              <Briefcase className='w-3.5 h-3.5' style={{ color }} />
              <span className='font-bold uppercase tracking-wider text-[11px] text-slate-300'>Comercial</span>
            </div>
            <span className='text-base sm:text-lg font-medium text-slate-100 tracking-tight truncate'>
              {regData.equipe.comercial.nome}
            </span>
          </div>

          <div className='bg-[#1B2433]/90 border border-[#2B384E] rounded-2xl p-3 flex flex-col gap-1.5 shadow-md'>
            <div className='flex items-center gap-1.5 text-slate-300 text-xs'>
              <Headphones className='w-3.5 h-3.5' style={{ color }} />
              <span className='font-bold uppercase tracking-wider text-[11px] text-slate-300'>Atendentes</span>
            </div>
            <span className='text-base sm:text-lg font-medium text-slate-100 tracking-tight truncate' title={regData.equipe.atendentes.map((a) => a.nome).join(' e ')}>
              {regData.equipe.atendentes.map((a) => a.nome).join(' e ')}
            </span>
          </div>
        </div>

        <div className='flex items-center justify-between pt-3 pb-2 shrink-0'>
          <span className='text-xs font-bold text-[#95B955] uppercase tracking-wider flex items-center gap-1.5'>
            <MapPin className='w-3.5 h-3.5' />
            Municípios Atendidos por Estado:
          </span>
          <span className='text-[11px] text-slate-400 font-medium'>
            Total: {totalCidades} cidades mapeadas
          </span>
        </div>

        <div className={`flex-1 grid gap-3 overflow-hidden pr-1 ${selectedRegionId === 'sorriso' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {columns.map((colEntries, colIdx) => (
            <div
              key={colIdx}
              className='bg-[#17202D]/95 border rounded-2xl p-3 shadow-md flex flex-col gap-2.5 overflow-hidden transition-colors'
              style={{ borderColor: color + '55' }}
            >
              {colEntries.map(([uf, listaCidades]) => {
                const stateTitle = uf === 'MT' && selectedRegionId === 'sorriso' ? 'MATO GROSSO (POLO CENTRAL)' : STATE_NAME_MAP[uf] || uf;
                const isSingleStateSorriso = selectedRegionId === 'sorriso';

                return (
                  <div key={uf} className='flex flex-col gap-1 shrink-0'>
                    <div className='flex items-center justify-between gap-2 bg-[#111722] border border-[#2B384E] px-2.5 py-1.5 rounded-xl shrink-0 overflow-hidden shadow-inner'>
                      <div className='flex items-center gap-2 min-w-0 flex-1 overflow-hidden'>
                        <span className='border border-[#2B384E] text-white text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#1B2433] shrink-0'>
                          {uf}
                        </span>
                        <span className='text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide truncate min-w-0' title={stateTitle}>
                          {stateTitle}
                        </span>
                      </div>
                      <span className='text-xs font-bold text-[#95B955] bg-[#17202D] px-2 py-0.5 rounded-md border border-[#232E3E] shrink-0 whitespace-nowrap'>
                        {listaCidades.length} cid.
                      </span>
                    </div>

                    <div className={`pt-0.5 pr-0.5 ${isSingleStateSorriso ? 'grid grid-cols-2 gap-x-4 gap-y-1 content-start' : 'flex flex-col gap-0.5'}`}>
                      {listaCidades.map((cidade) => {
                        const isSelected = selectedCityName === cidade;
                        return (
                          <div
                            key={cidade}
                            onClick={() => onSelectCity?.(isSelected ? null : cidade)}
                            className={`flex items-center justify-between py-1 px-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-sky-500/25 border border-sky-400 text-white font-bold shadow-lg shadow-sky-500/20 ring-1 ring-sky-400 scale-[1.02]'
                                : 'hover:bg-[#1F2B3E]/80 text-slate-200 hover:text-white border border-transparent'
                            }`}
                            title='Clique para destacar e ver a localização exata no mapa'
                          >
                            <div className='flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden'>
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 transition-transform ${isSelected ? 'scale-125 ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: color, boxShadow: '0 0 6px ' + color }}
                              />
                              <span className='text-xs sm:text-sm font-medium leading-snug truncate min-w-0'>{cidade}</span>
                              {cidadeWeatherMap[cidade] && (
                                <span
                                  className='text-xs shrink-0 font-bold text-amber-300 flex items-center gap-0.5 ml-1 bg-[#111722]/80 px-1.5 py-0.5 rounded-md border border-slate-700/60 shadow-sm'
                                  title={`${cidadeWeatherMap[cidade].conditionText} (${cidadeWeatherMap[cidade].temp}°C)`}
                                >
                                  <span>{cidadeWeatherMap[cidade].icon}</span>
                                  <span className='text-[10.5px] text-amber-200 font-mono font-bold'>{cidadeWeatherMap[cidade].temp}°</span>
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <span className='text-[10px] font-bold text-sky-300 bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-500 shrink-0 ml-1'>
                                📍 No Mapa
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#131A26] rounded-3xl border border-[#232E3E] p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full overflow-hidden'>
      <div className='border-b border-[#232E3E] pb-2.5 flex items-center justify-between shrink-0'>
        <div>
          <div className='flex items-center gap-1.5 text-[#95B955] text-xs font-extrabold uppercase tracking-wider mb-0.5'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>Visão Geral • Todas as 4 Equipes</span>
          </div>
          <h2 className='text-lg font-black text-white tracking-tight font-exo'>
            Estrutura Comercial Completa
          </h2>
        </div>
        <span className='text-xs font-extrabold text-white bg-[#1B2433] px-3 py-1 rounded-full border border-[#232E3E] shadow-inner'>
          97 Cidades Mapeadas
        </span>
      </div>

      <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 py-1.5 overflow-hidden'>
        {REGIONS_LIST.map((reg) => {
          const regData = REGIONS_DATA[reg.id];
          const color = getConsultantColor(reg.id);
          const borderColor = getConsultantBorderColor(reg.id);
          const totalCidades = Object.values(regData.cidadesPorEstado).flat().length;
          const estados = Object.keys(regData.cidadesPorEstado);

          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(reg.id)}
              className='bg-[#1B2433] border rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.015] shadow-lg overflow-hidden group hover:border-[#95B955]/60'
              style={{
                borderColor: borderColor,
                boxShadow: '0 4px 15px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Header do Card */}
              <div className='flex flex-col gap-1.5 border-b border-[#232E3E] pb-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='w-3 h-3 rounded-full shrink-0 shadow-md'
                      style={{ backgroundColor: color, boxShadow: '0 0 8px ' + color }}
                    />
                    <h3
                      className='text-sm sm:text-base font-black font-exo uppercase tracking-wide truncate'
                      style={{ color: color }}
                    >
                      {reg.nome}
                    </h3>
                  </div>
                  <span className='text-xs font-bold text-slate-100 bg-[#111722] px-2.5 py-0.5 rounded-md border border-[#232E3E] shrink-0'>
                    {totalCidades} cid.
                  </span>
                </div>

                {/* Tags dos Estados Atendidos */}
                <div className='flex items-center gap-1 flex-wrap'>
                  {estados.map((uf) => (
                    <span
                      key={uf}
                      className='text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#111722] border border-[#232E3E] text-slate-300'
                    >
                      {uf}: {regData.cidadesPorEstado[uf].length}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipe Comercial Preenchendo o Espaço de Forma Equilibrada */}
              <div className='flex-1 flex flex-col justify-center gap-2 py-2.5 my-auto'>
                <div className='flex items-center justify-between bg-[#111722] px-3 py-2 rounded-xl border border-[#232E3E]/70 shadow-sm'>
                  <div className='flex items-center gap-2 text-slate-300 text-xs font-medium'>
                    <UserCheck className='w-4 h-4 shrink-0' style={{ color }} />
                    <span>Consultor:</span>
                  </div>
                  <span className='text-slate-100 font-bold text-xs sm:text-sm font-exo tracking-wide truncate ml-2'>
                    {regData.equipe.consultor.nome}
                  </span>
                </div>

                <div className='flex items-center justify-between bg-[#111722] px-3 py-2 rounded-xl border border-[#232E3E]/70 shadow-sm'>
                  <div className='flex items-center gap-2 text-slate-300 text-xs font-medium'>
                    <Briefcase className='w-4 h-4 shrink-0' style={{ color }} />
                    <span>Comercial:</span>
                  </div>
                  <span className='text-slate-100 font-bold text-xs sm:text-sm font-exo truncate ml-2'>
                    {regData.equipe.comercial.nome}
                  </span>
                </div>

                <div className='flex items-center justify-between bg-[#111722] px-3 py-2 rounded-xl border border-[#232E3E]/70 shadow-sm'>
                  <div className='flex items-center gap-2 text-slate-300 text-xs font-medium'>
                    <Headphones className='w-4 h-4 shrink-0' style={{ color }} />
                    <span>Atendentes:</span>
                  </div>
                  <span className='text-slate-100 font-bold text-xs sm:text-sm font-exo truncate ml-2' title={regData.equipe.atendentes.map(a => a.nome).join(' e ')}>
                    {regData.equipe.atendentes.map(a => a.nome).join(' e ')}
                  </span>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className='text-[11px] text-[#95B955] font-bold flex items-center justify-between border-t border-[#232E3E] pt-2 mt-auto'>
                <div className='flex items-center gap-1.5 truncate'>
                  <Building2 className='w-3.5 h-3.5 text-[#95B955] shrink-0' />
                  <span className='truncate'>{reg.area || 'Abrangência Regional'}</span>
                </div>
                <span className='text-[10px] text-slate-400 font-medium group-hover:text-white transition-colors shrink-0 ml-1'>
                  Ver detalhes →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RegionDetails.displayName = 'RegionDetails';
