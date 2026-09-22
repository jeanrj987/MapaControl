import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegionSelector } from './RegionSelector';

describe('RegionSelector — gate de autenticação do editor de divisas', () => {
  it('não exibe o botão de ajustar divisas (✂️) para usuário não autenticado', () => {
    render(
      <RegionSelector
        selectedRegionId={null}
        isAuthenticated={false}
        onSelectRegion={() => {}}
        onToggleAdjustDividers={() => {}}
      />
    );

    expect(screen.queryByLabelText('Ajustar Divisas MT')).not.toBeInTheDocument();
  });

  it('exibe o botão de ajustar divisas para usuário autenticado', () => {
    render(
      <RegionSelector
        selectedRegionId={null}
        isAuthenticated
        onSelectRegion={() => {}}
        onToggleAdjustDividers={() => {}}
      />
    );

    expect(screen.getByLabelText('Ajustar Divisas MT')).toBeInTheDocument();
  });

  it('clicar no botão de divisas (autenticado) chama onToggleAdjustDividers', async () => {
    const user = userEvent.setup();
    const onToggleAdjustDividers = vi.fn();

    render(
      <RegionSelector
        selectedRegionId={null}
        isAuthenticated
        isAdjustingDividers={false}
        onSelectRegion={() => {}}
        onToggleAdjustDividers={onToggleAdjustDividers}
      />
    );

    await user.click(screen.getByLabelText('Ajustar Divisas MT'));
    expect(onToggleAdjustDividers).toHaveBeenCalledWith(true);
  });

  it('sempre exibe as regiões e "Todas as Regiões", independente do login', () => {
    render(
      <RegionSelector
        selectedRegionId={null}
        isAuthenticated={false}
        onSelectRegion={() => {}}
        onToggleAdjustDividers={() => {}}
      />
    );

    expect(screen.getByText('Todas as Regiões')).toBeInTheDocument();
    expect(screen.getByText('Norte MT a PA/RR')).toBeInTheDocument();
  });
});
