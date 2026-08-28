import React from 'react';
import { Layers } from '../UI/Icons';
import { RegiaoId } from '../../types/region';
import { REGIONS_LIST } from '../../data/regions';

interface RegionSelectorProps {
  selectedRegionId: RegiaoId | null;
  isAdjustingDividers?: boolean;
  onSelectRegion: (id: RegiaoId | null) => void;
  onToggleAdjustDividers?: (active: boolean) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegionId,
  isAdjustingDividers = false,
  onSelectRegion,
  onToggleAdjustDividers,
}) => {
  return (
    <nav
      aria-label='Seletor de Regiões Comerciais'
      className='bg-[#131A26]/80 backdrop-blur-xl border border-[#232E3E] p-1.5 sm:p-2 rounded-2xl shadow-xl w-full overflow-hidden'
    >
      <div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0'>
        <button
          type='button'
          onClick={() => {
            onToggleAdjustDividers?.(false);
            onSelectRegion(null);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#95B955] ${
            selectedRegionId === null && !isAdjustingDividers
              ? 'bg-[#95B955] text-[#0B0F17] shadow-lg shadow-[#95B955]/20'
              : 'bg-[#1A2332] text-[#88A0C0] hover:bg-[#232E3E] hover:text-white'
          }`}
          aria-pressed={selectedRegionId === null && !isAdjustingDividers}
        >
          <Layers className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
          <span>Todas as Regiões</span>
        </button>

        <div className='h-5 sm:h-6 w-px bg-[#232E3E] mx-0.5 sm:mx-1 shrink-0' />

        {REGIONS_LIST.map((regiao) => {
          const isSelected = selectedRegionId === regiao.id && !isAdjustingDividers;
          return (
            <button
              key={regiao.id}
              type='button'
              onClick={() => {
                onToggleAdjustDividers?.(false);
                onSelectRegion(isSelected ? null : regiao.id);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#95B955] ${
                isSelected
                  ? 'bg-[#95B955] text-[#0B0F17] shadow-lg shadow-[#95B955]/20'
                  : 'bg-[#1A2332] text-[#88A0C0] hover:bg-[#232E3E] hover:text-white'
              }`}
              aria-pressed={isSelected}
            >
              <span
                className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 shadow-sm'
                style={{ backgroundColor: regiao.cor, boxShadow: isSelected ? 'none' : '0 0 8px ' + regiao.cor + '88' }}
                aria-hidden='true'
              />
              <span className='whitespace-nowrap'>{regiao.nome}</span>
              {regiao.tipo === 'sub-regiao' && (
                <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-extrabold ${
                  isSelected ? 'bg-[#0B0F17]/30 text-[#0B0F17]' : 'bg-[#232E3E] text-[#88A0C0]'
                }`}>
                  Sub
                </span>
              )}
            </button>
          );
        })}

        <div className='h-5 sm:h-6 w-px bg-[#232E3E] mx-0.5 sm:mx-1 shrink-0' />

        {/* Nova Aba de Ajustar Divisas do MT */}
        <button
          type='button'
          onClick={() => onToggleAdjustDividers?.(!isAdjustingDividers)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            isAdjustingDividers
              ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/25 ring-2 ring-sky-300'
              : 'bg-[#1A2332] text-sky-400 hover:bg-[#232E3E] hover:text-white border border-sky-500/30'
          }`}
          aria-pressed={isAdjustingDividers}
        >
          <span className='text-sm'>✂️</span>
          <span className='whitespace-nowrap'>Ajustar Divisas MT</span>
        </button>
      </div>
    </nav>
  );
};

