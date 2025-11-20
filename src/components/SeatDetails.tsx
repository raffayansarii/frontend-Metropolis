import React from 'react';
import { SeatDetails as SeatDetailsType } from '../types';
import { getPriceForTier } from '../utils/priceTiers';

interface SeatDetailsProps {
  details: SeatDetailsType | null;
}

export const SeatDetails: React.FC<SeatDetailsProps> = ({ details }) => {
  if (!details) {
    return (
      <div className="seat-details">
        <p className="text-gray-500">Click on a seat to view details</p>
      </div>
    );
  }

  const price = getPriceForTier(details.priceTier);

  return (
    <div className="seat-details">
      <h3 className="text-lg font-semibold mb-2">Seat Details</h3>
      <div className="space-y-1">
        <p>
          <span className="font-medium">Seat ID:</span> {details.id}
        </p>
        <p>
          <span className="font-medium">Section:</span> {details.section}
        </p>
        <p>
          <span className="font-medium">Row:</span> {details.row}
        </p>
        <p>
          <span className="font-medium">Column:</span> {details.col}
        </p>
        <p>
          <span className="font-medium">Price Tier:</span> {details.priceTier}
        </p>
        <p>
          <span className="font-medium">Price:</span> ${price}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`inline-block px-2 py-1 rounded text-xs ${
              details.status === 'available'
                ? 'bg-green-100 text-green-800'
                : details.status === 'reserved'
                ? 'bg-yellow-100 text-yellow-800'
                : details.status === 'sold'
                ? 'bg-red-100 text-red-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {details.status.toUpperCase()}
          </span>
        </p>
      </div>
    </div>
  );
};

