// frontend/src/components/DroneAnimation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom drone icon
const droneIcon = new L.Icon({
  iconUrl: '/assets/drone.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const DroneAnimation = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [goalPoint, setGoalPoint] = useState(null);
  const [plannedPath, setPlannedPath] = useState([]);
  const [dronePosition, setDronePosition] = useState(null);
  const [droneHeading, setDroneHeading] = useState(0);
  const [droneAltitude, setDroneAltitude] = useState(0);
  const [droneSpeed, setDroneSpeed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const mapRef = useRef();

  // Set initial point on click, goal on shift+click
  const handleMapClick = (e) => {
    if (e.originalEvent.shiftKey) {
      setGoalPoint(e.latlng);
    } else {
      setStartPoint(e.latlng);
    }
  };

  // Plan the route
  const planRoute = async () => {
    if (!startPoint || !goalPoint) {
      alert('Please set both start and goal points');
      return;
    }

    try {
      const response = await fetch('/api/path/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: { lat: startPoint.lat, lon: startPoint.lng },
          goal: { lat: goalPoint.lat, lon: goalPoint.lng },
          step_deg: 0.001
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setPlannedPath(data.path);
      } else {
        alert('Path planning failed: ' + data.detail);
      }
    } catch (error) {
      console.error('Error planning route:', error);
      alert('Error planning route');
    }
  };

  // Start drone animation
  const startAnimation = async () => {
    if (plannedPath.length === 0) {
      alert('Please plan a route first');
      return;
    }

    try {
      const response = await fetch('/api/path/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drone_id: 1,
          path: plannedPath,
          speed_mps: 15, // 15 m/s (~54 km/h)
          altitude_m: 120 // 120 meters altitude
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setIsAnimating(true);
        connectWebSocket();
      } else {
        alert('Simulation failed to start');
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
      alert('Error starting simulation');
    }
  };

  // Connect to WebSocket for real-time updates
  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://${window.location.host}/api/path/ws/drone/1`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateDronePosition(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
    };
    
    setWebsocket(ws);
  };

  // Update drone position based on WebSocket data
  const updateDronePosition = (data) => {
    if (data && data.lat && data.lon) {
      const newPosition = L.latLng(data.lat, data.lon);
      setDronePosition(newPosition);
      setDroneHeading(data.heading || 0);
      setDroneAltitude(data.altitude || 0);
      setDroneSpeed(data.speed || 0);
      
      // Center map on drone if it's moving
      if (mapRef.current) {
        mapRef.current.setView(newPosition);
      }
    }
  };

  // Clean up WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <h2>UTM UAV Path Planning & Animation</h2>
        <div style={{ marginBottom: '10px' }}>
          <strong>Instructions:</strong> Click to set start point, Shift+Click to set goal point
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={planRoute} disabled={!startPoint || !goalPoint}>
            Plan Route
          </button>
          <button onClick={startAnimation} disabled={plannedPath.length === 0 || isAnimating}>
            Animate & Track
          </button>
          {dronePosition && (
            <div style={{ marginLeft: '20px' }}>
              <strong>Drone Status:</strong> 
              Altitude: {droneAltitude.toFixed(1)}m | 
              Speed: {droneSpeed.toFixed(1)}m/s | 
              Heading: {droneHeading.toFixed(0)}°
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={[25.7603, 82.7134]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Start and goal markers */}
          {startPoint && (
            <Marker position={startPoint}>
              <Popup>Start Point</Popup>
            </Marker>
          )}
          
          {goalPoint && (
            <Marker position={goalPoint}>
              <Popup>Goal Point</Popup>
            </Marker>
          )}
          
          {/* Planned path */}
          {plannedPath.length > 0 && (
            <Polyline
              positions={plannedPath.map(p => [p.lat, p.lon])}
              color="blue"
              weight={3}
              opacity={0.7}
            />
          )}
          
          {/* Drone marker with rotation */}
          {dronePosition && (
            <Marker
              position={dronePosition}
              icon={droneIcon}
              rotationAngle={droneHeading}
              rotationOrigin="center"
            >
              <Popup>
                <div>
                  <strong>Drone #1</strong><br />
                  Latitude: {dronePosition.lat.toFixed(6)}<br />
                  Longitude: {dronePosition.lng.toFixed(6)}<br />
                  Altitude: {droneAltitude.toFixed(1)} meters<br />
                  Speed: {droneSpeed.toFixed(1)} m/s<br />
                  Heading: {droneHeading.toFixed(0)}°
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneAnimation;