// Script to generate a large venue.json for performance testing
// Run with: node scripts/generate-venue.js

const fs = require('fs');
const path = require('path');

const generateVenue = (totalSeats = 15000) => {
  const sections = [];
  const seatsPerRow = 50;
  const rowsPerSection = Math.ceil(totalSeats / (seatsPerRow * 4)); // 4 sections
  let seatCounter = 0;

  const sectionLabels = ['A', 'B', 'C', 'D'];
  const priceTiers = [1, 2, 3, 4];
  const statuses = ['available', 'reserved', 'sold', 'held'];

  sectionLabels.forEach((sectionId, sectionIndex) => {
    const rows = [];
    const sectionX = sectionIndex * 250;
    const sectionY = 0;

    for (let rowIndex = 1; rowIndex <= rowsPerSection; rowIndex++) {
      const seats = [];
      const rowY = 50 + rowIndex * 30;

      for (let col = 1; col <= seatsPerRow && seatCounter < totalSeats; col++) {
        const seatX = sectionX + 50 + col * 15;
        const seatY = rowY;

        seats.push({
          id: `${sectionId}-${rowIndex}-${String(col).padStart(2, '0')}`,
          col: col,
          x: seatX,
          y: seatY,
          priceTier: priceTiers[sectionIndex % priceTiers.length],
          status: statuses[seatCounter % statuses.length],
        });

        seatCounter++;
      }

      if (seats.length > 0) {
        rows.push({
          index: rowIndex,
          seats: seats,
        });
      }
    }

    if (rows.length > 0) {
      sections.push({
        id: sectionId,
        label: `Section ${sectionId}`,
        transform: { x: 0, y: 0, scale: 1 },
        rows: rows,
      });
    }
  });

  const venue = {
    venueId: 'arena-01',
    name: 'Metropolis Arena',
    map: { width: 1024, height: 768 },
    sections: sections,
  };

  return venue;
};

// Generate venue with ~15,000 seats
const venue = generateVenue(15000);
const outputPath = path.join(__dirname, '../public/venue.json');

fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));
console.log(`Generated venue.json with ${venue.sections.reduce((total, section) => 
  total + section.rows.reduce((sum, row) => sum + row.seats.length, 0), 0)} seats`);
console.log(`Output: ${outputPath}`);

