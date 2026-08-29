import React from 'react';
import { Users, Building2 } from './Icons';
import { REGIONS_LIST, getTeamMemberCount } from '../../data/regions';
import { EXCEL_CITIES } from '../../data/cidadesExcel';

interface HeaderProps {
  selectedRegionName?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ selectedRegionName }) => {
  const totalMembers = REGIONS_LIST.reduce((acc, r) => acc + getTeamMemberCount(r), 0);
  const totalCities = EXCEL_CITIES.length;

  return (
    <header className='border-b border-[#232E3E] bg-[#111722]/90 backdrop-blur-xl sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-2xl shadow-black/40'>
      <div className='max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <a
            href='https://www.controlsoft.com.br'
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-2.5 group transition-transform hover:scale-[1.02] shrink-0'
          >
            <img
              src='https://www.controlsoft.com.br/wp-content/uploads/2026/01/logo-webp.webp'
              alt='ControlSoft Logo'
              className='h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(149,185,85,0.2)]'
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className='flex flex-col'>
              <span className='text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-[#95B955]'>
                Gestão &amp; Agro
              </span>
            </div>
          </a>

          <div className='h-6 sm:h-7 w-px bg-[#232E3E] hidden xs:block sm:block' />

          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h1 className='text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-2 font-exo truncate'>
                Mapa Comercial e Cobertura
              </h1>
              {selectedRegionName && (
                <span className='hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#95B955]/15 text-[#95B955] border border-[#95B955]/30 shadow-sm'>
                  {selectedRegionName}
                </span>
              )}
            </div>
            <p className='text-[11px] sm:text-xs text-slate-400 hidden xs:block truncate'>
              Distribuição estratégica de consultores e {totalCities} cidades atendidas
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-3 self-start md:self-auto flex-wrap'>
          <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shadow-inner' title='Sincronização em Nuvem Supabase Ativa'>
            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]' />
            <span className='hidden sm:inline'>Nuvem</span>
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-[#1B2433]/80 border border-[#232E3E] shadow-inner text-[11px] sm:text-xs backdrop-blur-md'>
            <Building2 className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#95B955]' />
            <div>
              <span className='text-slate-400 font-medium'>Cidades: </span>
              <span className='font-extrabold text-white'>{totalCities}</span>
            </div>
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-[#1B2433]/80 border border-[#232E3E] shadow-inner text-[11px] sm:text-xs backdrop-blur-md'>
            <Users className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#95B955]' />
            <div>
              <span className='text-slate-400 font-medium'>Equipe: </span>
              <span className='font-extrabold text-white'>{totalMembers}</span>
            </div>
          </div>

          <a
            href='https://wa.me/5566992001704?text=Ol%C3%A1%2C%20vim%20do%20mapa%20comercial%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es'
            target='_blank'
            rel='noreferrer'
            className='btn-controlsoft px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shrink-0'
          >
            <span>Fale Conosco</span>
            <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' viewBox='0 0 16 16'>
              <path d='M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326z'/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
