import React from 'react';
import { Venue, Seat } from '../types';
import { getPriceForTier } from '../utils/priceTiers';

interface SelectionSummaryProps {
  venue: Venue;
  selectedSeats: Set<string>;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  venue,
  selectedSeats,
}) => {
  const selectedSeatsData = React.useMemo(() => {
    const seats: Array<{ seat: Seat; sectionLabel: string; rowIndex: number }> = [];

    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (selectedSeats.has(seat.id)) {
            seats.push({
              seat,
              sectionLabel: section.label,
              rowIndex: row.index,
            });
          }
        });
      });
    });

    return seats;
  }, [venue, selectedSeats]);

  const subtotal = selectedSeatsData.reduce(
    (sum, { seat }) => sum + getPriceForTier(seat.priceTier),
    0
  );

  if (selectedSeats.size === 0) {
    return (
      <div className="selection-summary">
        <h3 className="text-lg font-semibold mb-2">Selection Summary</h3>
        <p className="text-gray-500">No seats selected</p>
        <p className="text-sm text-gray-400 mt-2">
          Select up to 8 seats (0/8)
        </p>
      </div>
    );
  }

  return (
    <div className="selection-summary">
      <h3 className="text-lg font-semibold mb-2">Selection Summary</h3>
      <p className="text-sm text-gray-600 mb-2">
        {selectedSeats.size} of 8 seats selected
      </p>
      <div className="space-y-1 mb-3">
        {selectedSeatsData.map(({ seat, sectionLabel, rowIndex }) => (
          <div
            key={seat.id}
            className="flex justify-between text-sm"
          >
            <span>
              {seat.id} ({sectionLabel}, Row {rowIndex})
            </span>
            <span>${getPriceForTier(seat.priceTier)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between font-semibold">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

