import React from 'react';
import { Seat as SeatType } from '../types';
import { getPriceForTier } from '../utils/priceTiers';

interface SeatProps {
  seat: SeatType;
  sectionLabel: string;
  rowIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const getStatusColor = (status: SeatType['status'], isSelected: boolean): string => {
  if (isSelected) return '#3b82f6';
  switch (status) {
    case 'available':
      return '#10b981';
    case 'reserved':
      return '#f59e0b';
    case 'sold':
      return '#ef4444';
    case 'held':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

export const Seat: React.FC<SeatProps> = React.memo(({
  seat,
  sectionLabel,
  rowIndex,
  isSelected,
  onClick,
  onKeyDown,
}) => {
  const isClickable = seat.status === 'available';
  const fillColor = getStatusColor(seat.status, isSelected);

  return (
    <g>
      <circle
        cx={seat.x}
        cy={seat.y}
        r={8}
        fill={fillColor}
        stroke={isSelected ? '#1e40af' : '#ffffff'}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          cursor: isClickable ? 'pointer' : 'not-allowed',
          opacity: isClickable ? 1 : 0.6,
        }}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={isClickable ? onKeyDown : undefined}
        tabIndex={isClickable ? 0 : -1}
        aria-label={`Seat ${seat.id}, Section ${sectionLabel}, Row ${rowIndex}, Column ${seat.col}, ${seat.status}, Price tier ${seat.priceTier}, $${getPriceForTier(seat.priceTier)}`}
        role="button"
      />
    </g>
  );
});

