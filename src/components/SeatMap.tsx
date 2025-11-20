import React, { useMemo, useCallback } from 'react';
import { Venue, Seat } from '../types';
import { Seat as SeatComponent } from './Seat';

interface SeatMapProps {
  venue: Venue;
  selectedSeats: Set<string>;
  onSeatClick: (seatId: string) => void;
  onSeatFocus: (seat: Seat, sectionLabel: string, rowIndex: number) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  venue,
  selectedSeats,
  onSeatClick,
  onSeatFocus,
}) => {
  const handleSeatKeyDown = useCallback(
    (e: React.KeyboardEvent, seatId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSeatClick(seatId);
      }
    },
    [onSeatClick]
  );

  const allSeats = useMemo(() => {
    const seats: Array<{
      seat: Seat;
      sectionLabel: string;
      rowIndex: number;
    }> = [];

    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seats.push({
            seat,
            sectionLabel: section.label,
            rowIndex: row.index,
          });
        });
      });
    });

    return seats;
  }, [venue]);

  return (
    <svg
      width={venue.map.width}
      height={venue.map.height}
      viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
      style={{
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        maxWidth: '100%',
        height: 'auto',
      }}
      aria-label="Interactive seating map"
    >
      {allSeats.map(({ seat, sectionLabel, rowIndex }) => (
        <SeatComponent
          key={seat.id}
          seat={seat}
          sectionLabel={sectionLabel}
          rowIndex={rowIndex}
          isSelected={selectedSeats.has(seat.id)}
          onClick={() => onSeatClick(seat.id)}
          onKeyDown={(e) => {
            handleSeatKeyDown(e, seat.id);
            if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
              onSeatFocus(seat, sectionLabel, rowIndex);
            }
          }}
        />
      ))}
    </svg>
  );
};

