# Frontend - Interactive Event Seating Map

React + TypeScript application for interactive seat selection.

## Setup

```bash
pnpm install
```

## Running

```bash
pnpm dev
```

App runs on `http://localhost:5173`

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001
```

## Features

### Core Requirements
✅ Load and render venue.json  
✅ Smooth rendering for large venues (~15,000 seats)  
✅ Mouse and keyboard seat selection  
✅ Seat details display on click/focus  
✅ Select up to 8 seats  
✅ Live selection summary with subtotal  
✅ Persist selection in localStorage  
✅ Full accessibility (ARIA, keyboard nav)  
✅ Responsive (desktop & mobile)  

### Architecture

- **React 18** with TypeScript (strict mode)
- **Vite** for fast development
- Component structure:
  - `SeatMap` - Main SVG rendering
  - `Seat` - Individual seat component
  - `SeatDetails` - Details panel
  - `SelectionSummary` - Selection summary

### Performance Optimizations

- `React.memo` for seat components
- `useMemo` for expensive calculations
- Efficient SVG rendering
- Minimal re-renders

### Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Space)
- Focus outlines
- Screen reader friendly

### Data Structure

Seats are loaded from `public/venue.json` with structure:
- Venue → Sections → Rows → Seats
- Each seat has absolute coordinates (x, y)
- Status: available, reserved, sold, held

### Generating Large Venues

To generate a venue with ~15,000 seats for performance testing:

```bash
node scripts/generate-venue.js
```

This will overwrite `public/venue.json` with a larger dataset.

## Building

```bash
pnpm build
```

Output in `dist/` directory.

