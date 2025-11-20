import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Venue, Seat, SeatDetails } from './types';
import { SeatMap } from './components/SeatMap';
import { SeatDetails as SeatDetailsComponent } from './components/SeatDetails';
import { SelectionSummary } from './components/SelectionSummary';
import { saveSelectedSeats, loadSelectedSeats } from './utils/storage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './App.css';

const MAX_SELECTIONS = 8;

function SeatingMap() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [focusedSeat, setFocusedSeat] = useState<SeatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Load venue data
  useEffect(() => {
    fetch('/venue.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load venue data');
        }
        return res.json();
      })
      .then((data: Venue) => {
        setVenue(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Load persisted selections
  useEffect(() => {
    const saved = loadSelectedSeats();
    if (saved.length > 0) {
      setSelectedSeats(new Set(saved));
    }
  }, []);

  // Persist selections
  useEffect(() => {
    if (selectedSeats.size > 0) {
      saveSelectedSeats(Array.from(selectedSeats));
    } else {
      localStorage.removeItem('selectedSeats');
    }
  }, [selectedSeats]);

  const handleSeatClick = React.useCallback(
    (seatId: string) => {
      if (!venue) return;

      let seat: Seat | null = null;
      let sectionLabel = '';
      let rowIndex = 0;

      for (const section of venue.sections) {
        for (const row of section.rows) {
          const foundSeat = row.seats.find((s: Seat) => s.id === seatId);
          if (foundSeat) {
            seat = foundSeat;
            sectionLabel = section.label;
            rowIndex = row.index;
            break;
          }
        }
        if (seat) break;
      }

      if (!seat || seat.status !== 'available') {
        return;
      }

      setSelectedSeats((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(seatId)) {
          newSet.delete(seatId);
        } else {
          if (newSet.size >= MAX_SELECTIONS) {
            return prev;
          }
          newSet.add(seatId);
        }
        return newSet;
      });

      if (seat) {
        setFocusedSeat({
          id: seat.id,
          section: sectionLabel,
          row: rowIndex,
          col: seat.col,
          priceTier: seat.priceTier,
          status: seat.status,
        });
      }
    },
    [venue]
  );

  const handleSeatFocus = React.useCallback(
    (seat: Seat, sectionLabel: string, rowIndex: number) => {
      setFocusedSeat({
        id: seat.id,
        section: sectionLabel,
        row: rowIndex,
        col: seat.col,
        priceTier: seat.priceTier,
        status: seat.status,
      });
    },
    []
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading venue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="app-container">
        <div className="error">No venue data available</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>{venue.name}</h1>
          <p className="venue-id">Venue ID: {venue.venueId}</p>
        </div>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="map-container">
          <SeatMap
            venue={venue}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            onSeatFocus={handleSeatFocus}
          />
        </div>

        <aside className="sidebar">
          <SeatDetailsComponent details={focusedSeat} />
          <div className="divider" />
          <SelectionSummary venue={venue} selectedSeats={selectedSeats} />
        </aside>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        checkUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show loading state briefly
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/"
        element={user ? <SeatingMap /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
