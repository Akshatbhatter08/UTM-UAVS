
/*import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Note: For geofence editor you'll need leaflet-draw CSS+JS and react wrapper; this file includes placeholders and instructions.

// 1. Create a custom icon
const droneIcon = L.icon({
  iconUrl: '../assets/drone.png',  // put your custom image in /public/assets/
  iconSize: [40, 40],                 // size in pixels
  iconAnchor: [20, 20],               // point that should be at the marker's location
  popupAnchor: [0, -20]               // point where the popup opens relative to the icon
});

// 2. Use the custom icon when creating the marker
L.marker([lat, lng], { icon: droneIcon }).addTo(map)
  .bindPopup('Drone Position');


// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// });

export default function MapView(){
  const [drones, setDrones] = useState({})
  const [alerts, setAlerts] = useState([])
  const wsRef = useRef(null)

  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:8000/ws/telemetry')
    wsRef.current = ws
    ws.onopen = ()=> console.log('ws open')
    ws.onmessage = (ev)=>{
      try{
        const msg = JSON.parse(ev.data)
        if(msg.type === 'telemetry'){
          setDrones(prev=>({...prev, [msg.drone_id]: msg}))
        } else if(msg.type === 'alert'){
          setAlerts(a=>[msg, ...a].slice(0,5))
        }
      }catch(e){ console.error(e) }
    }
    ws.onclose = ()=> console.log('ws closed')
    return ()=> ws.close()
  },[])

  return (
    <div>
      <MapContainer center={[20.5937,78.9629]} zoom={5}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {Object.values(drones).map(d=>(
          <Marker key={d.drone_id} position={[d.lat, d.lon]}>
            <Popup>Drone: {d.drone_id} <br/> alt: {Math.round(d.alt)}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div style={{position:'fixed', right:12, top:72}}>
        {alerts.map((a, idx)=> (<div key={idx} className='toast'>Alert: {a.alert_type} drones {a.drones?.join(', ')} dist: {Math.round(a.distance_m)}</div>))}
      </div>
      <div style={{position:'fixed', left:12, top:72, background:'white', padding:8, borderRadius:6}}>
        <div><b>Geofence editor</b></div>
        <div style={{fontSize:12}}>To add geofences, integrate <i>leaflet-draw</i>. This project includes the scaffold; install leaflet-draw and use react-leaflet-draw to allow drawing polygons and saving to backend.</div>
      </div>
    </div>
  )
}*/





// New code from GPT
// import React, { useEffect, useState, useRef } from 'react'
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// // Custom drone icon
// const droneIcon = L.icon({
//   iconUrl: '/assets/drone.png',  // put your image inside public/assets/drone.png
//   iconSize: [40, 40],            // size in pixels
//   iconAnchor: [20, 20],          // point that corresponds to the marker's location
//   popupAnchor: [0, -20]          // point from which the popup should open
// })

// export default function MapView(){
//   const [drones, setDrones] = useState({})
//   const [alerts, setAlerts] = useState([])
//   const wsRef = useRef(null)

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8000/ws/telemetry')
//     wsRef.current = ws

//     ws.onopen = () => console.log('ws open')
//     ws.onmessage = (ev) => {
//       try {
//         const msg = JSON.parse(ev.data)
//         if (msg.type === 'telemetry') {
//           setDrones(prev => ({ ...prev, [msg.drone_id]: msg }))
//         } else if (msg.type === 'alert') {
//           setAlerts(a => [msg, ...a].slice(0, 5))
//         }
//       } catch (e) {
//         console.error(e)
//       }
//     }
//     ws.onclose = () => console.log('ws closed')

//     return () => ws.close()
//   }, [])

//   return (
//     <div>
//       <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100vh', width: '100%' }}>
//         <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        
//         {Object.values(drones).map(d => (
//           <Marker 
//             key={d.drone_id} 
//             position={[d.lat, d.lon]} 
//             icon={droneIcon} // ← custom icon here
//           >
//             <Popup>
//               Drone: {d.drone_id} <br /> Alt: {Math.round(d.alt)}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       {/* Alerts */}
//       <div style={{ position: 'fixed', right: 12, top: 72 }}>
//         {alerts.map((a, idx) => (
//           <div key={idx} className='toast'>
//             Alert: {a.alert_type} drones {a.drones?.join(', ')} dist: {Math.round(a.distance_m)}
//           </div>
//         ))}
//       </div>

//       {/* Geofence info box */}
//       <div style={{ position: 'fixed', left: 12, top: 72, background: 'white', padding: 8, borderRadius: 6 }}>
//         <div><b>Geofence editor</b></div>
//         <div style={{ fontSize: 12 }}>
//           To add geofences, integrate <i>leaflet-draw</i>. This project includes the scaffold; 
//           install leaflet-draw and use react-leaflet-draw to allow drawing polygons and saving to backend.
//         </div>
//       </div>
//     </div>
//   )
// }





//3
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';

// const droneIcon = L.icon({
//   iconUrl: '/assets/drone.png',
//   iconSize: [40, 40],
//   iconAnchor: [20, 20],
//   popupAnchor: [0, -20],
// });

// function ClickPicker({ setPoint }) {
//   useMapEvents({
//     click(e) {
//       setPoint(e.latlng, e.originalEvent.shiftKey);
//     }
//   });
//   return null;
// }

// export default function MapView() {
//   const [drones, setDrones] = useState({});
//   const [alerts, setAlerts] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [progressPath, setProgressPath] = useState([]); // animated progress line
//   const [animating, setAnimating] = useState(false);
//   const [animatedPos, setAnimatedPos] = useState(null); // current animated marker position
//   const wsRef = useRef(null);

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8000/ws/telemetry');
//     wsRef.current = ws;
//     ws.onmessage = (ev) => {
//       try {
//         const msg = JSON.parse(ev.data);
//         if (msg.type === 'telemetry') {
//           setDrones(prev => ({ ...prev, [msg.drone_id]: msg }));
//         } else if (msg.type === 'alert') {
//           setAlerts(a => [msg, ...a].slice(0, 5));
//         }
//       } catch (e) { console.error(e); }
//     };
//     return () => ws.close();
//   }, []);

//   const requestPlan = async () => {
//     if (!start || !goal) return alert('Pick start and goal.');
//     const payload = {
//       start: { lat: start[0], lon: start[1] },
//       goal: { lat: goal[0], lon: goal[1] },
//       step_deg: 0.001
//     };
//     const { data } = await axios.post('http://localhost:8000/api/path/plan', payload);
//     setPath(data.path);
//     setProgressPath([]);
//     setAnimatedPos(null);
//   };

//   const animateAndTrack = async (droneId = 201, speedMps = 12) => {
//     if (!path.length) return;
//     setAnimating(true);
//     setProgressPath([]);
//     const ingestUrl = 'http://localhost:8000/api/telemetry/ingest';
//     const tick = 500;

//     let progPoints = [];
//     for (let i = 0; i < path.length - 1; i++) {
//       const a = path[i], b = path[i+1];
//       const R = 6371000, toRad = x => x * Math.PI/180;
//       const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
//       const la1 = toRad(a.lat), la2 = toRad(b.lat);
//       const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
//       const dist = 2*R*Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
//       const steps = Math.max(1, Math.floor(dist / speedMps));

//       for (let k = 0; k < steps; k++) {
//         const t = (k + 1) / steps;
//         const lat = a.lat + (b.lat - a.lat) * t;
//         const lon = a.lon + (b.lon - a.lon) * t;

//         // Update animated position
//         setAnimatedPos([lat, lon]);

//         // Extend progress line
//         progPoints.push([lat, lon]);
//         setProgressPath([...progPoints]);

//         // Send telemetry
//         try {
//           await axios.post(ingestUrl, { drone_id: droneId, lat, lon, alt: 80 });
//         } catch (e) { console.error(e); }

//         await new Promise(res => setTimeout(res, tick));
//       }
//     }
//     setAnimating(false);
//   };

//   return (
//     <div style={{ position: 'relative', height: '100vh' }}>
//       <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
//         <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

//         <ClickPicker setPoint={(latlng, shiftKey) => {
//           if (shiftKey) setGoal([latlng.lat, latlng.lng]);
//           else setStart([latlng.lat, latlng.lng]);
//         }} />

//         {/* Live drones */}
//         {Object.values(drones).map(d => (
//           <Marker key={d.drone_id} position={[d.lat, d.lon]} icon={droneIcon}>
//             <Popup>Drone: {d.drone_id}<br/>Alt: {Math.round(d.alt)}</Popup>
//           </Marker>
//         ))}

//         {/* Full planned route (faint) */}
//         {path.length > 1 && (
//           <Polyline positions={path.map(p => [p.lat, p.lon])} pathOptions={{ color: '#66b3ff', weight: 4, opacity: 0.4 }} />
//         )}

//         {/* Progress line (bright) */}
//         {progressPath.length > 1 && (
//           <Polyline positions={progressPath} pathOptions={{ color: '#007bff', weight: 5 }} />
//         )}

//         {/* Animated drone marker */}
//         {animatedPos && (
//           <Marker position={animatedPos} icon={droneIcon}>
//             <Popup>In Transit</Popup>
//           </Marker>
//         )}

//         {/* Start/goal pins */}
//         {start && <Marker position={start} />}
//         {goal && <Marker position={goal} />}
//       </MapContainer>

//       {/* Controls */}
//       <div style={{
//         position: 'absolute',
//         left: 12,
//         bottom: 12,
//         background: 'white',
//         padding: 10,
//         borderRadius: 8,
//         width: 360,
//         zIndex: 1000,
//         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//       }}>
//         <div style={{ fontWeight: 700, marginBottom: 8 }}>Path Planner</div>
//         <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
//           <div>Start: {start ? `${start[0].toFixed(5)}, ${start[1].toFixed(5)}` : 'Click map'}</div>
//           <button onClick={() => setStart(null)}>Clear</button>
//           <div>Goal: {goal ? `${goal[0].toFixed(5)}, ${goal[1].toFixed(5)}` : 'Shift+Click map'}</div>
//           <button onClick={() => setGoal(null)}>Clear</button>
//         </div>
//         <div style={{ display:'flex', gap:8, marginTop:10 }}>
//           <button onClick={requestPlan}>Plan Route</button>
//           <button disabled={!path.length || animating} onClick={() => animateAndTrack(201, 12)}>
//             {animating ? 'Animating...' : 'Animate & Track'}
//           </button>
//         </div>
//         <div style={{ fontSize:12, opacity:0.8, marginTop:6 }}>
//           Tip: Click to set <b>start</b>. Shift+Click to set <b>goal</b>.
//         </div>
//       </div>

//       {/* Alerts */}
//       <div style={{ position:'fixed', right:12, top:72, zIndex:1000 }}>
//         {alerts.map((a, idx)=> (
//           <div key={idx} className='toast'>
//             Alert: {a.alert_type} drones {a.drones?.join(', ')} dist: {Math.round(a.distance_m)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// //4
// import React, { useEffect, useState, useRef } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import axios from 'axios'

// // Custom icon (make sure /public/assets/drone.png exists)
// const droneIcon = L.icon({
//   iconUrl: '/assets/drone.png',
//   iconSize: [40, 40],
//   iconAnchor: [20, 20],
//   popupAnchor: [0, -20],
// })

// function ClickPicker({ setPoint }) {
//   useMapEvents({
//     click(e) {
//       if (window.event && window.event.shiftKey) {
//         setPoint('goal', [e.latlng.lat, e.latlng.lng])
//       } else {
//         setPoint('start', [e.latlng.lat, e.latlng.lng])
//       }
//     }
//   })
//   return null
// }

// export default function MapView() {
//   const [drones, setDrones] = useState({})
//   const [alerts, setAlerts] = useState([])
//   const [start, setStart] = useState(null)
//   const [goal, setGoal] = useState(null)
//   const [path, setPath] = useState([])
//   const [animating, setAnimating] = useState(false)
//   const wsRef = useRef(null)

//   // WebSocket connection for telemetry
//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8000/ws/telemetry')
//     wsRef.current = ws
//     ws.onmessage = (ev) => {
//       try {
//         const msg = JSON.parse(ev.data)
//         if (msg.type === 'telemetry') {
//           setDrones(prev => ({ ...prev, [msg.drone_id]: msg }))
//         } else if (msg.type === 'alert') {
//           setAlerts(a => [msg, ...a].slice(0, 5))
//         }
//       } catch (e) { console.error(e) }
//     }
//     return () => ws.close()
//   }, [])

//   // Request shortest path from backend
//   const requestPlan = async () => {
//     if (!start || !goal) {
//       alert('Select start and goal')
//       return
//     }
//     const payload = {
//       start: { lat: start[0], lon: start[1] },
//       goal: { lat: goal[0], lon: goal[1] },
//       step_deg: 0.001
//     }
//     try {
//       const { data } = await axios.post('http://localhost:8000/api/path/plan', payload)
//       setPath(data.path || [])
//     } catch (err) {
//       console.error(err)
//       alert('Path planning failed')
//     }
//   }

//   // Call backend simulate API
//   const animateAndTrack = async () => {
//     if (!path.length) {
//       alert('No path to animate')
//       return
//     }
//     setAnimating(true)
//     try {
//       await axios.post('http://localhost:8000/api/path/simulate', {
//         drone_id: 201,
//         path: path,
//         speed_mps: 12
//       })
//     } catch (err) {
//       console.error(err)
//     }
//     setAnimating(false)
//   }

//   return (
//     <div>
//       <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100vh', width: '100%' }}>
//         <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
//         <ClickPicker setPoint={(type, coords) => {
//           if (type === 'start') setStart(coords)
//           else setGoal(coords)
//         }} />

//         {/* Drones from WebSocket */}
//         {Object.values(drones).map(d => (
//           <Marker key={d.drone_id} position={[d.lat, d.lon]} icon={droneIcon}>
//             <Popup>Drone: {d.drone_id}<br />Alt: {Math.round(d.alt)}</Popup>
//           </Marker>
//         ))}

//         {/* Path polyline */}
//         {path.length > 1 && (
//           <Polyline positions={path.map(p => [p.lat, p.lon])} />
//         )}

//         {/* Start & Goal markers */}
//         {start && <Marker position={start} />}
//         {goal && <Marker position={goal} />}
//       </MapContainer>

//       {/* Path Planner Controls */}
//       <div style={{
//         position: 'fixed',
//         left: 12,
//         bottom: 12,
//         background: 'white',
//         padding: 10,
//         borderRadius: 8,
//         width: 360,
//         zIndex: 9999,
//         boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
//       }}>
//         <div style={{ fontWeight: 700, marginBottom: 8 }}>Path Planner</div>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
//           <div>Start: {start ? `${start[0].toFixed(5)}, ${start[1].toFixed(5)}` : 'Click map'}</div>
//           <button onClick={() => setStart(null)}>Clear</button>
//           <div>Goal: {goal ? `${goal[0].toFixed(5)}, ${goal[1].toFixed(5)}` : 'Shift+Click map'}</div>
//           <button onClick={() => setGoal(null)}>Clear</button>
//         </div>
//         <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
//           <button onClick={requestPlan}>Plan Route</button>
//           <button disabled={!path.length || animating} onClick={animateAndTrack}>
//             {animating ? 'Animating...' : 'Animate & Track'}
//           </button>
//         </div>
//         <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
//           Tip: Click to set <b>start</b>. Shift+Click to set <b>goal</b>.
//         </div>
//       </div>

//       {/* Alerts */}
//       <div style={{ position: 'fixed', right: 12, top: 72, zIndex: 9999 }}>
//         {alerts.map((a, idx) => (
//           <div key={idx} className='toast'>
//             Alert: {a.alert_type} drones {a.drones?.join(', ')} dist: {Math.round(a.distance_m)}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

//5
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// // component to pick start and goal points on click
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       if (!setStart || !setGoal) return;
//       const { lat, lng } = e.latlng;
//       // if start not set, set it
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         return prev;
//       });
//       // if start set but goal not set, set goal
//       setGoal((prev) => {
//         if (!prev) return { lat, lon: lng };
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [drones, setDrones] = useState([]);
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);

//   // fetch drones
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/drones')
//       .then((res) => setDrones(res.data))
//       .catch((err) => console.error('Drones error', err));
//   }, []);

//   // fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // whenever start & goal are set, plan the path
//   useEffect(() => {
//     if (start && goal) {
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start: start,
//           goal: goal,
//         })
//         .then((res) => {
//           if (res.data?.path) {
//             setPath(res.data.path);
//           }
//         })
//         .catch((err) => console.error('Path plan error', err));
//     }
//   }, [start, goal]);

//   return (
//     <div style={{ height: '100vh', width: '100%' }}>
//       <MapContainer
//         center={[22.5726, 88.3639]}
//         zoom={12}
//         style={{ height: '100%', width: '100%' }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Geofences polygons */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Start marker */}
//         {start && (
//           <Marker position={[start.lat, start.lon]}>
//             <Popup>Start Point</Popup>
//           </Marker>
//         )}

//         {/* Goal marker */}
//         {goal && (
//           <Marker position={[goal.lat, goal.lon]}>
//             <Popup>Goal Point</Popup>
//           </Marker>
//         )}

//         {/* Path polyline */}
//         {path.length > 0 && (
//           <Polyline
//             positions={path.map((p) => [p.lat, p.lon])}
//             pathOptions={{ color: 'green' }}
//           />
//         )}

//         {/* Drones markers */}
//         {drones.map((drone, idx) => (
//           <Marker key={idx} position={[drone.lat, drone.lon]}>
//             <Popup>{drone.name}</Popup>
//           </Marker>
//         ))}

//         {/* Click picker to set start/goal */}
//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//6
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Component to pick start and goal points on click
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
      
//       setStart(prev => {
//         // If start is not set, set it and return
//         if (!prev) return { lat, lon: lng };
        
//         // If start is set but goal is not set, set goal
//         setGoal(prevGoal => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
        
//         // Return the existing start
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [drones, setDrones] = useState([]);
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePositions, setDronePositions] = useState({});

//   // Fetch drones
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/drones')
//       .then((res) => setDrones(res.data))
//       .catch((err) => console.error('Drones error', err));
//   }, []);

//   // Fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // Whenever start & goal are set, plan the path
//   useEffect(() => {
//     if (start && goal) {
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start: start,
//           goal: goal,
//           step_deg: 0.01  // Add this parameter
//         })
//         .then((res) => {
//           if (res.data?.path) {
//             setPath(res.data.path);
//           }
//         })
//         .catch((err) => console.error('Path plan error', err));
//     }
//   }, [start, goal]);

//   // WebSocket connection for real-time drone positions
//   useEffect(() => {
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
//     const socket = new WebSocket(wsUrl);
    
//     socket.onopen = () => {
//       console.log('WebSocket connected');
//     };
    
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === 'telemetry') {
//           // Update drone position
//           setDronePositions(prev => ({
//             ...prev,
//             [data.drone_id]: {
//               lat: data.lat,
//               lon: data.lon,
//               alt: data.alt,
//               heading: data.heading,
//               speed: data.speed
//             }
//           }));
//         }
//       } catch (e) {
//         console.error('Error parsing WebSocket message:', e);
//       }
//     };
    
//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
    
//     socket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };
    
//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     <div style={{ height: '100vh', width: '100%' }}>
//       <MapContainer
//         center={[22.5726, 88.3639]}
//         zoom={12}
//         style={{ height: '100%', width: '100%' }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Geofences polygons */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Start marker */}
//         {start && (
//           <Marker position={[start.lat, start.lon]}>
//             <Popup>Start Point</Popup>
//           </Marker>
//         )}

//         {/* Goal marker */}
//         {goal && (
//           <Marker position={[goal.lat, goal.lon]}>
//             <Popup>Goal Point</Popup>
//           </Marker>
//         )}

//         {/* Path polyline */}
//         {path.length > 0 && (
//           <Polyline
//             positions={path.map((p) => [p.lat, p.lon])}
//             pathOptions={{ color: 'green', weight: 5 }}
//           />
//         )}

//         {/* Drones markers from WebSocket data */}
//         {Object.entries(dronePositions).map(([droneId, position]) => (
//           <Marker key={droneId} position={[position.lat, position.lon]}>
//             <Popup>
//               Drone {droneId}<br />
//               Altitude: {position.alt}m<br />
//               Speed: {position.speed}m/s<br />
//               Heading: {position.heading}°
//             </Popup>
//           </Marker>
//         ))}

//         {/* Click picker to set start/goal */}
//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//7
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Component to pick start and goal points on click
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
      
//       setStart(prev => {
//         // If start is not set, set it and return
//         if (!prev) return { lat, lon: lng };
        
//         // If start is set but goal is not set, set goal
//         setGoal(prevGoal => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
        
//         // Return the existing start
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [drones, setDrones] = useState([]);
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePositions, setDronePositions] = useState({});
//   const [isPlanning, setIsPlanning] = useState(false);

//   // Fetch drones
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/drones')
//       .then((res) => setDrones(res.data))
//       .catch((err) => console.error('Drones error', err));
//   }, []);

//   // Fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // Whenever start & goal are set, plan the path
//   useEffect(() => {
//     if (start && goal) {
//       setIsPlanning(true);
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start: start,
//           goal: goal,
//           step_deg: 0.01,
//           max_distance_km: 500  // Add this parameter for long distances
//         })
//         .then((res) => {
//           if (res.data?.path) {
//             setPath(res.data.path);
//           }
//         })
//         .catch((err) => {
//           console.error('Path plan error', err);
//           alert('Path planning failed: ' + (err.response?.data?.detail || err.message));
//         })
//         .finally(() => {
//           setIsPlanning(false);
//         });
//     }
//   }, [start, goal]);

//   // WebSocket connection for real-time drone positions
//   useEffect(() => {
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
//     const socket = new WebSocket(wsUrl);
    
//     socket.onopen = () => {
//       console.log('WebSocket connected');
//     };
    
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === 'telemetry') {
//           // Update drone position
//           setDronePositions(prev => ({
//             ...prev,
//             [data.drone_id]: {
//               lat: data.lat,
//               lon: data.lon,
//               alt: data.alt,
//               heading: data.heading,
//               speed: data.speed
//             }
//           }));
//         }
//       } catch (e) {
//         console.error('Error parsing WebSocket message:', e);
//       }
//     };
    
//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
    
//     socket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };
    
//     return () => {
//       socket.close();
//     };
//   }, []);

//   // Function to clear the path and points
//   const clearPath = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
//       {/* Control panel */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         zIndex: 1000,
//         backgroundColor: 'white',
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
//       }}>
//         <h3>UTM UAV Control</h3>
//         <p>Click to set start point, click again to set goal</p>
//         {start && <p>Start: {start.lat.toFixed(6)}, {start.lon.toFixed(6)}</p>}
//         {goal && <p>Goal: {goal.lat.toFixed(6)}, {goal.lon.toFixed(6)}</p>}
//         {isPlanning && <p>Planning path...</p>}
//         {path.length > 0 && <p>Path points: {path.length}</p>}
//         <button onClick={clearPath} disabled={!start && !goal}>
//           Clear Path
//         </button>
//       </div>

//       <MapContainer
//         center={[22.5726, 88.3639]}
//         zoom={5}  // Lower zoom for long distances
//         style={{ height: '100%', width: '100%' }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Geofences polygons */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Start marker */}
//         {start && (
//           <Marker position={[start.lat, start.lon]}>
//             <Popup>Start Point</Popup>
//           </Marker>
//         )}

//         {/* Goal marker */}
//         {goal && (
//           <Marker position={[goal.lat, goal.lon]}>
//             <Popup>Goal Point</Popup>
//           </Marker>
//         )}

//         {/* Path polyline */}
//         {path.length > 0 && (
//           <Polyline
//             positions={path.map((p) => [p.lat, p.lon])}
//             pathOptions={{ color: 'green', weight: 3 }}
//           />
//         )}

//         {/* Drones markers from WebSocket data */}
//         {Object.entries(dronePositions).map(([droneId, position]) => (
//           <Marker key={droneId} position={[position.lat, position.lon]}>
//             <Popup>
//               Drone {droneId}<br />
//               Altitude: {position.alt}m<br />
//               Speed: {position.speed}m/s<br />
//               Heading: {position.heading}°
//             </Popup>
//           </Marker>
//         ))}

//         {/* Click picker to set start/goal */}
//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//8
// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Component to pick start and goal points on click
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         setGoal((prevGoal) => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [drones, setDrones] = useState([]);
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePositions, setDronePositions] = useState({});
//   const [isPlanning, setIsPlanning] = useState(false);
//   const socketRef = useRef(null);

//   // Fetch drones
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/drones')
//       .then((res) => setDrones(res.data))
//       .catch((err) => console.error('Drones error', err));
//   }, []);

//   // Fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // Path planning
//   useEffect(() => {
//     if (start && goal) {
//       setIsPlanning(true);
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start: start,
//           goal: goal,
//           step_deg: 0.01,
//           max_distance_km: 500,
//         })
//         .then((res) => {
//           if (res.data?.path) setPath(res.data.path);
//         })
//         .catch((err) => {
//           console.error('Path plan error', err);
//           alert('Path planning failed: ' + (err.response?.data?.detail || err.message));
//         })
//         .finally(() => setIsPlanning(false));
//     }
//   }, [start, goal]);

//   // WebSocket setup
//   useEffect(() => {
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
//     const socket = new WebSocket(wsUrl);
//     socketRef.current = socket;

//     socket.onopen = () => console.log('WebSocket connected');
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === 'telemetry') {
//           setDronePositions((prev) => ({
//             ...prev,
//             [data.drone_id]: {
//               lat: data.lat,
//               lon: data.lon,
//               alt: data.alt,
//               heading: data.heading,
//               speed: data.speed,
//             },
//           }));
//         } else if (data.type === 'telemetry_done') {
//           console.log(`Simulation done for ${data.drone_id}`);
//         }
//       } catch (e) {
//         console.error('Error parsing WebSocket message:', e);
//       }
//     };

//     socket.onerror = (err) => console.error('WebSocket error:', err);
//     socket.onclose = () => console.log('WebSocket disconnected');
//     return () => socket.close();
//   }, []);

//   const startSimulation = () => {
//     if (!path.length || !socketRef.current) {
//       alert('No path to simulate!');
//       return;
//     }
//     socketRef.current.send(
//       JSON.stringify({
//         type: 'start_simulation',
//         path: path,
//         drone_id: 'SimDrone-1',
//         speed: 1.0, // seconds per step
//       })
//     );
//   };

//   const clearPath = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
//       {/* Control panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           zIndex: 1000,
//           backgroundColor: 'white',
//           padding: '10px',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//         }}
//       >
//         <h3>UTM UAV Control</h3>
//         <p>Click to set start, then goal</p>
//         {start && <p>Start: {start.lat.toFixed(6)}, {start.lon.toFixed(6)}</p>}
//         {goal && <p>Goal: {goal.lat.toFixed(6)}, {goal.lon.toFixed(6)}</p>}
//         {isPlanning && <p>Planning path...</p>}
//         {path.length > 0 && <p>Path points: {path.length}</p>}

//         <button onClick={clearPath} disabled={!start && !goal}>Clear Path</button>
//         <button
//           onClick={startSimulation}
//           disabled={path.length === 0}
//           style={{ marginLeft: '10px' }}
//         >
//           Simulate Flight
//         </button>
//       </div>

//       <MapContainer center={[22.5726, 88.3639]} zoom={5} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b><br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Start marker */}
//         {start && <Marker position={[start.lat, start.lon]}><Popup>Start Point</Popup></Marker>}

//         {/* Goal marker */}
//         {goal && <Marker position={[goal.lat, goal.lon]}><Popup>Goal Point</Popup></Marker>}

//         {/* Path polyline */}
//         {path.length > 0 && (
//           <Polyline positions={path.map((p) => [p.lat, p.lon])} pathOptions={{ color: 'green', weight: 3 }} />
//         )}

//         {/* Live drone markers */}
//         {Object.entries(dronePositions).map(([droneId, pos]) => (
//           <Marker key={droneId} position={[pos.lat, pos.lon]}>
//             <Popup>
//               Drone {droneId}<br />
//               Alt: {pos.alt}m<br />
//               Speed: {pos.speed}m/s<br />
//               Heading: {pos.heading}°
//             </Popup>
//           </Marker>
//         ))}

//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//9

// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Component to pick start and goal points
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         setGoal((prevGoal) => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePositions, setDronePositions] = useState({});
//   const [isPlanning, setIsPlanning] = useState(false);
//   const socketRef = useRef(null);

//   // Fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // Path planning
//   useEffect(() => {
//     if (start && goal) {
//       setIsPlanning(true);
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start: start,
//           goal: goal,
//           step_deg: 0.01,
//           max_distance_km: 500,
//         })
//         .then((res) => {
//           if (res.data?.path) setPath(res.data.path);
//         })
//         .catch((err) => {
//           console.error('Path plan error', err);
//           alert('Path planning failed: ' + (err.response?.data?.detail || err.message));
//         })
//         .finally(() => setIsPlanning(false));
//     }
//   }, [start, goal]);

//   // WebSocket setup
//   useEffect(() => {
//     const ws = new WebSocket("ws://127.0.0.1:8000/ws/telemetry");
//     socketRef.current = ws;

//     ws.onopen = () => console.log('✅ WebSocket connected');
//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === 'telemetry') {
//           setDronePositions((prev) => ({
//             ...prev,
//             [data.drone_id]: {
//               lat: data.lat,
//               lon: data.lon,
//               alt: data.alt,
//               heading: data.heading,
//               speed: data.speed,
//             },
//           }));
//         } else if (data.type === 'telemetry_done') {
//           console.log(`Simulation done for ${data.drone_id}`);
//         }
//       } catch (e) {
//         console.error('Error parsing WebSocket message:', e);
//       }
//     };

//     ws.onerror = (err) => console.error('❌ WebSocket error:', err);
//     ws.onclose = () => console.log('⚠️ WebSocket disconnected');

//     return () => ws.close();
//   }, []);

//   const startSimulation = () => {
//     if (!path.length || !socketRef.current) {
//       alert('No path to simulate!');
//       return;
//     }
//     socketRef.current.send(
//       JSON.stringify({
//         type: 'start_simulation',
//         path: path,
//         drone_id: 'SimDrone-1',
//         speed: 1.0,
//       })
//     );
//   };

//   const clearPath = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           zIndex: 1000,
//           backgroundColor: 'white',
//           padding: '10px',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//         }}
//       >
//         <h3>UTM UAV Control</h3>
//         <p>Click to set start, then goal</p>
//         {start && <p>Start: {start.lat.toFixed(6)}, {start.lon.toFixed(6)}</p>}
//         {goal && <p>Goal: {goal.lat.toFixed(6)}, {goal.lon.toFixed(6)}</p>}
//         {isPlanning && <p>Planning path...</p>}
//         {path.length > 0 && <p>Path points: {path.length}</p>}

//         <button onClick={clearPath} disabled={!start && !goal}>Clear Path</button>
//         <button
//           onClick={startSimulation}
//           disabled={path.length === 0}
//           style={{ marginLeft: '10px' }}
//         >
//           Simulate Flight
//         </button>
//       </div>

//       <MapContainer center={[22.5726, 88.3639]} zoom={5} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b><br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Start/Goal markers */}
//         {start && <Marker position={[start.lat, start.lon]}><Popup>Start Point</Popup></Marker>}
//         {goal && <Marker position={[goal.lat, goal.lon]}><Popup>Goal Point</Popup></Marker>}

//         {/* Path polyline */}
//         {path.length > 0 && (
//           <Polyline positions={path.map((p) => [p.lat, p.lon])} pathOptions={{ color: 'green', weight: 3 }} />
//         )}

//         {/* Live drone markers */}
//         {Object.entries(dronePositions).map(([droneId, pos]) => (
//           <Marker key={droneId} position={[pos.lat, pos.lon]}>
//             <Popup>
//               Drone {droneId}<br />
//               Alt: {pos.alt}m<br />
//               Speed: {pos.speed}m/s<br />
//               Heading: {pos.heading}°
//             </Popup>
//           </Marker>
//         ))}

//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//10

// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
// } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // 🧭 Custom GPS arrow icon for drone
// const droneIcon = new L.Icon({
//   // iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // arrow-style icon
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // arrow-style icon
//   iconSize: [35, 35],
//   iconAnchor: [17, 17], // center it properly
//   popupAnchor: [0, -10],
// });

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // 🗺️ ClickPicker component to set start and goal
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         setGoal((prevGoal) => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// export default function MapView() {
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePositions, setDronePositions] = useState({});
//   const [isPlanning, setIsPlanning] = useState(false);
//   const socketRef = useRef(null);

//   // 🌍 Fetch geofences
//   useEffect(() => {
//     axios
//       .get('http://localhost:8000/api/path/geofences')
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error('Geofences error', err));
//   }, []);

//   // 🧭 Path planning (A* search)
//   useEffect(() => {
//     if (start && goal) {
//       setIsPlanning(true);
//       axios
//         .post('http://localhost:8000/api/path/plan', {
//           start,
//           goal,
//           step_deg: 0.01,
//           max_distance_km: 500,
//         })
//         .then((res) => {
//           if (res.data?.path) setPath(res.data.path);
//         })
//         .catch((err) => {
//           console.error('Path plan error', err);
//           alert('Path planning failed: ' + (err.response?.data?.detail || err.message));
//         })
//         .finally(() => setIsPlanning(false));
//     }
//   }, [start, goal]);

//   // 📡 WebSocket setup for telemetry updates
//   useEffect(() => {
//     const ws = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');
//     socketRef.current = ws;

//     ws.onopen = () => console.log('✅ WebSocket connected');
//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === 'telemetry') {
//           setDronePositions((prev) => ({
//             ...prev,
//             [data.drone_id]: {
//               lat: data.lat,
//               lon: data.lon,
//               alt: data.alt,
//               heading: data.heading,
//               speed: data.speed,
//             },
//           }));
//         } else if (data.type === 'telemetry_done') {
//           console.log(`✅ Simulation completed for ${data.drone_id}`);
//         }
//       } catch (e) {
//         console.error('Error parsing WebSocket message:', e);
//       }
//     };

//     ws.onerror = (err) => console.error('❌ WebSocket error:', err);
//     ws.onclose = () => console.log('⚠️ WebSocket disconnected');
//     return () => ws.close();
//   }, []);

//   // 🚀 Start drone simulation
//   const startSimulation = () => {
//     if (!path.length || !socketRef.current) {
//       alert('No path to simulate!');
//       return;
//     }
//     socketRef.current.send(
//       JSON.stringify({
//         type: 'start_simulation',
//         path: path,
//         drone_id: 'SimDrone-1',
//         speed: 0.8, // seconds between each waypoint
//       })
//     );
//   };

//   // 🧹 Clear start/goal/path
//   const clearPath = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
//       {/* 🧭 Control Panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           zIndex: 1000,
//           backgroundColor: 'white',
//           padding: '10px',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//         }}
//       >
//         <h3>🛰️ UTM UAV Control</h3>
//         <p>Click to set start, then goal</p>
//         {start && <p>Start: {start.lat.toFixed(6)}, {start.lon.toFixed(6)}</p>}
//         {goal && <p>Goal: {goal.lat.toFixed(6)}, {goal.lon.toFixed(6)}</p>}
//         {isPlanning && <p>Planning path...</p>}
//         {path.length > 0 && <p>Path points: {path.length}</p>}

//         <button onClick={clearPath}>Clear Path</button>
//         <button
//           onClick={startSimulation}
//           disabled={path.length === 0}
//           style={{ marginLeft: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px' }}
//         >
//           Simulate Flight
//         </button>
//       </div>

//       {/* 🌍 Map */}
//       <MapContainer center={[22.5726, 88.3639]} zoom={5} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* 🚫 Geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === 'no-fly' ? 'red' : 'blue',
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b><br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* 📍 Start & Goal */}
//         {start && <Marker position={[start.lat, start.lon]}><Popup>Start Point</Popup></Marker>}
//         {goal && <Marker position={[goal.lat, goal.lon]}><Popup>Goal Point</Popup></Marker>}

//         {/* 🛣️ Path */}
//         {path.length > 0 && (
//           <Polyline positions={path.map((p) => [p.lat, p.lon])} pathOptions={{ color: 'green', weight: 3 }} />
//         )}

//         {/* 🛰️ Live drone marker (GPS arrow) */}
//         {Object.entries(dronePositions).map(([droneId, pos]) => (
//           <Marker
//             key={droneId}
//             position={[pos.lat, pos.lon]}
//             icon={droneIcon}
//             rotationAngle={pos.heading || 0}
//             rotationOrigin="center"
//           >
//             <Popup>
//               <b>{droneId}</b><br />
//               Alt: {pos.alt} m<br />
//               Speed: {pos.speed} m/s<br />
//               Heading: {pos.heading}°
//             </Popup>
//           </Marker>
//         ))}

//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//       </MapContainer>
//     </div>
//   );
// }

//11(Smooth Drone Icon Rotation and Simulation)

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // 🛰️ Drone arrow icon
// const droneIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // GPS arrow-like drone icon
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
//   popupAnchor: [0, -10],
// });

// // Fix default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Component to pick start and goal
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         setGoal((prevGoal) => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// // Utility: auto-fit map to show full path
// function FitMap({ path }) {
//   const map = useMap();
//   useEffect(() => {
//     if (path.length > 0) {
//       const bounds = L.latLngBounds(path.map((p) => [p.lat, p.lon]));
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [path]);
//   return null;
// }

// export default function MapView() {
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]);
//   const [dronePosition, setDronePosition] = useState(null);
//   const [isPlanning, setIsPlanning] = useState(false);
//   const socketRef = useRef(null);

//   // Fetch geofences
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/path/geofences")
//       .then((res) => setGeofences(res.data))
//       .catch((err) => console.error("Geofences error", err));
//   }, []);

//   // Plan path
//   const planPath = async () => {
//     if (!start || !goal) {
//       alert("Select start and goal points first!");
//       return;
//     }

//     setIsPlanning(true);
//     try {
//       const res = await axios.post("http://localhost:8000/api/path/plan", {
//         start,
//         goal,
//         step_deg: 0.01,
//         max_distance_km: 500,
//       });
//       if (res.data?.path) {
//         setPath(res.data.path);
//       }
//     } catch (err) {
//       console.error("Path planning failed:", err);
//       alert(
//         "Path planning failed: " +
//           (err.response?.data?.detail || err.message || "Unknown error")
//       );
//     } finally {
//       setIsPlanning(false);
//     }
//   };

//   // WebSocket
//   useEffect(() => {
//     const socket = new WebSocket("ws://127.0.0.1:8000/ws/telemetry");
//     socketRef.current = socket;

//     socket.onopen = () => console.log("✅ WebSocket connected");
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === "telemetry") {
//           setDronePosition({ lat: data.lat, lon: data.lon });
//         } else if (data.type === "telemetry_done") {
//           console.log("Simulation complete.");
//         }
//       } catch (err) {
//         console.error("WebSocket message error:", err);
//       }
//     };
//     socket.onerror = (err) => console.error("❌ WebSocket error:", err);
//     socket.onclose = () => console.log("⚠️ WebSocket closed");

//     return () => socket.close();
//   }, []);

//   // Start simulation
//   const startSimulation = () => {
//     if (!path.length || !socketRef.current) {
//       alert("No path to simulate!");
//       return;
//     }
//     socketRef.current.send(
//       JSON.stringify({
//         type: "start_simulation",
//         path: path.map((p) => [p.lat, p.lon]),
//         drone_id: "SimDrone-1",
//         speed: 0.2, // smoother animation (lower = faster updates)
//       })
//     );
//   };

//   // Clear
//   const clearPath = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//     setDronePosition(null);
//   };

//   return (
//     <div style={{ height: "100vh", width: "100%", position: "relative" }}>
//       {/* UI Controls */}
//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           left: "10px",
//           zIndex: 1000,
//           backgroundColor: "white",
//           padding: "10px",
//           borderRadius: "5px",
//           boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//         }}
//       >
//         <h3>🛰️ UTM UAV Simulator</h3>
//         <p>Click on map to set start, then goal.</p>
//         {start && (
//           <p>
//             Start: {start.lat.toFixed(4)}, {start.lon.toFixed(4)}
//           </p>
//         )}
//         {goal && (
//           <p>
//             Goal: {goal.lat.toFixed(4)}, {goal.lon.toFixed(4)}
//           </p>
//         )}
//         <button onClick={planPath} disabled={isPlanning}>
//           {isPlanning ? "Planning..." : "Plan Path"}
//         </button>
//         <button
//           onClick={startSimulation}
//           disabled={!path.length}
//           style={{ marginLeft: "10px" }}
//         >
//           Simulate Flight
//         </button>
//         <button
//           onClick={clearPath}
//           style={{ marginLeft: "10px", backgroundColor: "#eee" }}
//         >
//           Clear
//         </button>
//       </div>

//       <MapContainer
//         center={[22.5726, 88.3639]}
//         zoom={5}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {geofences.map((gf, i) => (
//           <Polygon
//             key={i}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === "no-fly" ? "red" : "blue",
//               fillOpacity: 0.2,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {start && (
//           <Marker position={[start.lat, start.lon]}>
//             <Popup>Start</Popup>
//           </Marker>
//         )}
//         {goal && (
//           <Marker position={[goal.lat, goal.lon]}>
//             <Popup>Goal</Popup>
//           </Marker>
//         )}

//         {path.length > 0 && (
//           <Polyline
//             positions={path.map((p) => [p.lat, p.lon])}
//             pathOptions={{ color: "green", weight: 3 }}
//           />
//         )}

//         {dronePosition && (
//           <Marker
//             position={[dronePosition.lat, dronePosition.lon]}
//             icon={droneIcon}
//           >
//             <Popup>SimDrone-1</Popup>
//           </Marker>
//         )}

//         <ClickPicker setStart={setStart} setGoal={setGoal} />
//         <FitMap path={path} />
//       </MapContainer>
//     </div>
//   );
// }


//12

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* -------------------------
//    CONFIG
//    ------------------------- */
// // Drone icon (arrow). Replace URL if you want another icon.
// const droneIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
//   popupAnchor: [0, -10],
// });

// // Animation speed fallback (meters/second). Backend can send 'speed' but frontend uses this for interpolation when needed.
// const DEFAULT_SPEED_MPS = 8; // 8 m/s ~ ~28 km/h ; reduce to slow the drone

// /* -------------------------
//    Small helpers: distances + lerp
//    ------------------------- */
// function deg2rad(d) {
//   return (d * Math.PI) / 180;
// }
// function rad2deg(r) {
//   return (r * 180) / Math.PI;
// }
// function haversineMeters([lat1, lon1], [lat2, lon2]) {
//   const R = 6371000; // meters
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
// // simple linear interpolation in lat/lon (fine for small segments)
// function lerpLatLon(a, b, t) {
//   return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// }
// function bearingDegrees([lat1, lon1], [lat2, lon2]) {
//   // Bearing from point1 to point2 in degrees (0 = north)
//   const φ1 = deg2rad(lat1);
//   const φ2 = deg2rad(lat2);
//   const λ1 = deg2rad(lon1);
//   const λ2 = deg2rad(lon2);
//   const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
//   const x =
//     Math.cos(φ1) * Math.sin(φ2) -
//     Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
//   const θ = Math.atan2(y, x);
//   return (rad2deg(θ) + 360) % 360;
// }

// /* -------------------------
//    Click picker component
//    ------------------------- */
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setStart((prev) => {
//         if (!prev) return { lat, lon: lng };
//         setGoal((prevGoal) => {
//           if (!prevGoal) return { lat, lon: lng };
//           return prevGoal;
//         });
//         return prev;
//       });
//     },
//   });
//   return null;
// }

// /* -------------------------
//    FitMap: zoom to path bounds
//    ------------------------- */
// function FitMap({ path }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!path || path.length === 0) return;
//     const latlngs = path.map((p) => (p.lat !== undefined ? [p.lat, p.lon] : [p[0], p[1]]));
//     const bounds = L.latLngBounds(latlngs);
//     map.fitBounds(bounds.pad(0.15));
//   }, [path, map]);
//   return null;
// }

// /* -------------------------
//    MAIN COMPONENT
//    ------------------------- */
// export default function MapView() {
//   // UI / data states
//   const [geofences, setGeofences] = useState([]);
//   const [start, setStart] = useState(null);
//   const [goal, setGoal] = useState(null);
//   const [path, setPath] = useState([]); // path returned by backend: array of {lat,lon} or [lat,lon]
//   const [isPlanning, setIsPlanning] = useState(false);
//   const [isSimulating, setIsSimulating] = useState(false);

//   // animation and websocket refs
//   const socketRef = useRef(null);
//   const markerRef = useRef(null); // for DOM rotation
//   const rafRef = useRef(null);

//   // smoothing buffer: telemetry points received from backend (each as [lat, lon])
//   const bufferRef = useRef([]); // array of {pos: [lat, lon], speed_mps?: number}

//   // current animated state
//   const currentPosRef = useRef(null); // [lat, lon]
//   const currentTarget = useRef(null); // {pos: [lat, lon], speed_mps}
//   const progressRef = useRef(0); // fraction 0..1 of current segment
//   const lastTimestampRef = useRef(null);
//   const [, forceRerender] = useState(0); // use to re-render for markers

//   // Drone visible state (for react render)
//   const [droneVisible, setDroneVisible] = useState(null); // {lat, lon, heading}

//   /* -------------------------
//      Fetch geofences on mount
//      ------------------------- */
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/path/geofences")
//       .then((res) => setGeofences(res.data || []))
//       .catch((err) => {
//         console.error("Geofences fetch error:", err);
//       });
//   }, []);

//   /* -------------------------
//      Path planning function
//      ------------------------- */
//   const planPath = async () => {
//     if (!start || !goal) {
//       alert("Set start and goal by clicking on the map.");
//       return;
//     }
//     setIsPlanning(true);
//     try {
//       const res = await axios.post("http://localhost:8000/api/path/plan", {
//         start,
//         goal,
//         step_deg: 0.01,
//         max_distance_km: 500,
//       });
//       if (res.data?.path) {
//         // normalize path to objects {lat, lon}
//         const p = res.data.path.map((pt) => {
//           if (Array.isArray(pt)) return { lat: pt[0], lon: pt[1] };
//           if (pt.lat !== undefined && pt.lon !== undefined) return { lat: pt.lat, lon: pt.lon };
//           // fallback: assume [lat, lon]
//           return { lat: pt[0], lon: pt[1] };
//         });
//         setPath(p);
//         // set initial position to first path point
//         if (p.length > 0) {
//           currentPosRef.current = [p[0].lat, p[0].lon];
//           setDroneVisible({ lat: p[0].lat, lon: p[0].lon, heading: 0 });
//         }
//       } else {
//         alert("No path received from backend.");
//       }
//     } catch (err) {
//       console.error("Plan path error:", err);
//       alert("Path planning failed: " + (err?.response?.data?.detail || err?.message || ""));
//     } finally {
//       setIsPlanning(false);
//     }
//   };

//   /* -------------------------
//      WebSocket connection and handlers
//      ------------------------- */
//   useEffect(() => {
//     const ws = new WebSocket("ws://127.0.0.1:8000/ws/telemetry");
//     socketRef.current = ws;

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//     };

//     ws.onmessage = (evt) => {
//       try {
//         const data = JSON.parse(evt.data);
//         // We expect "telemetry" messages from backend with type "telemetry" and lat/lon
//         if (data.type === "telemetry") {
//           // accept different formats
//           let lat = data.lat;
//           let lon = data.lon;
//           if (lat === undefined && Array.isArray(data.position)) {
//             lat = data.position[0]; lon = data.position[1];
//           }
//           if (lat === undefined && Array.isArray(data.path)) {
//             // ignore path messages
//             return;
//           }
//           if (typeof lat === "number" && typeof lon === "number") {
//             // push into buffer. speed precedence: data.speed (m/s) else default
//             const speed_mps = Number(data.speed) || DEFAULT_SPEED_MPS;
//             bufferRef.current.push({ pos: [lat, lon], speed_mps });
//           }
//         } else if (data.type === "telemetry_done") {
//           console.log("Simulation finished for", data.drone_id);
//         } else {
//           // handle other broadcast messages if any
//         }
//       } catch (e) {
//         // sometimes backend might broadcast raw arrays (if we used different broadcast). handle that:
//         try {
//           const parsed = JSON.parse(evt.data);
//           console.log("WS raw:", parsed);
//         } catch (err) {
//           console.error("WS parse error:", err);
//         }
//       }
//     };

//     ws.onerror = (err) => console.error("WebSocket error", err);
//     ws.onclose = () => console.log("WebSocket closed");

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   /* -------------------------
//      Start simulation: ask backend to simulate this path
//      ------------------------- */
//   const startSimulation = () => {
//     if (!path || path.length === 0) {
//       alert("Plan a path first.");
//       return;
//     }
//     if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
//       alert("WebSocket not connected to backend.");
//       return;
//     }

//     // clear any existing buffers and animation state
//     bufferRef.current = [];
//     currentTarget.current = null;
//     progressRef.current = 0;
//     lastTimestampRef.current = null;

//     // make a path format acceptable to backend: array of [lat, lon]
//     const sendPath = path.map((p) => [p.lat, p.lon]);
//     socketRef.current.send(
//       JSON.stringify({
//         type: "start_simulation",
//         path: sendPath,
//         drone_id: "SimDrone-1",
//         speed: 0.5, // optional backend hint (sec per waypoint) — your backend might use it; adjust if needed.
//       })
//     );

//     // ensure current position is set
//     if (!currentPosRef.current && path.length) {
//       currentPosRef.current = [path[0].lat, path[0].lon];
//       setDroneVisible({ lat: currentPosRef.current[0], lon: currentPosRef.current[1], heading: 0 });
//     }

//     setIsSimulating(true);
//     // start animation loop
//     if (!rafRef.current) {
//       lastTimestampRef.current = performance.now();
//       rafRef.current = requestAnimationFrame(animationLoop);
//     }
//   };

//   /* -------------------------
//      Animation loop: drives smooth movement between buffered telemetry points
//      ------------------------- */
//   function animationLoop(timestamp) {
//     const now = timestamp;
//     const last = lastTimestampRef.current || now;
//     const dt = Math.max(0, (now - last) / 1000.0); // seconds
//     lastTimestampRef.current = now;

//     // If we currently have no target, try to pull one from buffer
//     if (!currentTarget.current) {
//       if (bufferRef.current.length > 0) {
//         // set next segment: from currentPos to first buffer point
//         const next = bufferRef.current.shift();
//         const startPos = currentPosRef.current ? currentPosRef.current : next.pos;
//         const endPos = next.pos;
//         // compute distance
//         const dist = haversineMeters(startPos, endPos);
//         // if distance is extremely small, snap
//         if (dist < 0.5) {
//           currentPosRef.current = endPos;
//           setDroneVisible((d) => ({ lat: endPos[0], lon: endPos[1], heading: d?.heading || 0 }));
//           // continue to next buffer
//           rafRef.current = requestAnimationFrame(animationLoop);
//           return;
//         }
//         // choose speed (use speed from next if present)
//         const speed_mps = next.speed_mps || DEFAULT_SPEED_MPS;
//         // store target segment
//         currentTarget.current = { startPos, endPos, dist, speed_mps };
//         progressRef.current = 0;
//       } else {
//         // nothing in buffer — keep animating but slowly (or stop)
//         // stop animation if no buffer and we are close to last position
//         rafRef.current = requestAnimationFrame(animationLoop);
//         return;
//       }
//     }

//     // move along current target
//     const seg = currentTarget.current;
//     if (seg) {
//       // progress += (speed * dt) / distance
//       const deltaFrac = (seg.speed_mps * dt) / Math.max(seg.dist, 0.00001);
//       progressRef.current = Math.min(1, progressRef.current + deltaFrac);

//       const newPos = lerpLatLon(seg.startPos, seg.endPos, progressRef.current);
//       // compute heading toward end
//       const heading = bearingDegrees(newPos, seg.endPos);

//       // update refs and visible marker
//       currentPosRef.current = newPos;
//       setDroneVisible({ lat: newPos[0], lon: newPos[1], heading });

//       // if reached end, clear target
//       if (progressRef.current >= 1 - 1e-6) {
//         currentTarget.current = null;
//         progressRef.current = 0;
//       }
//     }

//     // schedule next frame
//     rafRef.current = requestAnimationFrame(animationLoop);
//   }

//   // ensure RAF cancelled on unmount or when simulation stops
//   useEffect(() => {
//     return () => {
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//         rafRef.current = null;
//       }
//     };
//   }, []);

//   /* -------------------------
//      DOM rotation for the marker (use markerRef to set transform)
//      ------------------------- */
//   useEffect(() => {
//     if (!markerRef.current) return;
//     const el = markerRef.current.getElement && markerRef.current.getElement();
//     if (!el) return;
//     // rotate so arrow points direction (Leaflet markers default orientation is up)
//     const heading = (droneVisible && droneVisible.heading) || 0;
//     el.style.transition = "transform 0.08s linear";
//     el.style.transformOrigin = "center";
//     el.style.transform = `rotate(${heading}deg)`;
//   }, [droneVisible]);

//   /* -------------------------
//      Clear / Reset
//      ------------------------- */
//   const clearAll = () => {
//     setStart(null);
//     setGoal(null);
//     setPath([]);
//     setIsSimulating(false);
//     bufferRef.current = [];
//     currentTarget.current = null;
//     progressRef.current = 0;
//     currentPosRef.current = null;
//     setDroneVisible(null);
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       // optionally tell backend to stop — depends on your backend API
//       try {
//         socketRef.current.send(JSON.stringify({ type: "stop_simulation", drone_id: "SimDrone-1" }));
//       } catch {}
//     }
//   };

//   /* -------------------------
//      Render
//      ------------------------- */
//   return (
//     <div style={{ height: "100vh", width: "100%", position: "relative" }}>
//       {/* Control panel */}
//       <div
//         style={{
//           position: "absolute",
//           top: 12,
//           left: 12,
//           zIndex: 1400,
//           background: "white",
//           padding: 10,
//           borderRadius: 6,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         }}
//       >
//         <h4 style={{ margin: "0 0 6px 0" }}>UTM UAV Simulator</h4>
//         <div style={{ fontSize: 12, marginBottom: 8 }}>Click map to set start (first) and goal (second).</div>

//         <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//           <button onClick={planPath} disabled={isPlanning} style={{ padding: "6px 8px" }}>
//             {isPlanning ? "Planning..." : "Plan Path"}
//           </button>
//           <button
//             onClick={startSimulation}
//             disabled={isSimulating || path.length === 0}
//             style={{ padding: "6px 8px" }}
//           >
//             {isSimulating ? "Simulating..." : "Simulate Flight"}
//           </button>
//           <button onClick={clearAll} style={{ padding: "6px 8px" }}>
//             Clear
//           </button>
//         </div>

//         <div style={{ fontSize: 12 }}>
//           {start && <div>Start: {start.lat.toFixed(5)}, {start.lon.toFixed(5)}</div>}
//           {goal && <div>Goal: {goal.lat.toFixed(5)}, {goal.lon.toFixed(5)}</div>}
//           {path?.length > 0 && <div>Path points: {path.length}</div>}
//         </div>
//       </div>

//       <MapContainer center={[22.5726, 88.3639]} zoom={6} style={{ height: "100%", width: "100%" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{ color: gf.type === "no-fly" ? "red" : "blue", fillOpacity: 0.18 }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* start & goal markers */}
//         {start && <Marker position={[start.lat, start.lon]}><Popup>Start</Popup></Marker>}
//         {goal && <Marker position={[goal.lat, goal.lon]}><Popup>Goal</Popup></Marker>}

//         {/* planned path polyline */}
//         {path?.length > 0 && <Polyline positions={path.map(p => [p.lat, p.lon])} pathOptions={{ color: "green", weight: 3 }} />}

//         {/* animated drone marker */}
//         {droneVisible && (
//           <Marker
//             position={[droneVisible.lat, droneVisible.lon]}
//             icon={droneIcon}
//             ref={markerRef}
//           >
//             <Popup>
//               SimDrone-1<br />
//               {droneVisible.lat.toFixed(6)}, {droneVisible.lon.toFixed(6)}
//             </Popup>
//           </Marker>
//         )}

//         {/* click picker */}
//         <ClickPicker setStart={setStart} setGoal={setGoal} />

//         {/* fit map to path when path changes */}
//         <FitMap path={path} />
//       </MapContainer>
//     </div>
//   );
// }

//13(Works for multiple users and drones)
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* -------------------------
//    ICONS
//    ------------------------- */
// const droneIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
//   popupAnchor: [0, -10],
// });

// const startIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
//   popupAnchor: [0, -10],
// });

// const goalIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
// });

// /* -------------------------
//    CLICK PICKER
//    ------------------------- */
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       if (!setStart.current) {
//         setStart.current = { lat, lon: lng };
//         alert("✅ Start point selected!");
//       } else if (!setGoal.current) {
//         setGoal.current = { lat, lon: lng };
//         alert("✅ Destination selected!");
//       }
//     },
//   });
//   return null;
// }

// /* -------------------------
//    FIT MAP TO ALL PATHS
//    ------------------------- */
// function FitMap({ allPaths }) {
//   const map = useMap();
//   useEffect(() => {
//     const allCoords = Object.values(allPaths).flatMap((p) =>
//       p.map((pt) => [pt.lat, pt.lon])
//     );
//     if (allCoords.length) {
//       const bounds = L.latLngBounds(allCoords);
//       map.fitBounds(bounds.pad(0.2));
//     }
//   }, [allPaths, map]);
//   return null;
// }

// /* -------------------------
//    MAIN COMPONENT
//    ------------------------- */
// export default function MapView() {
//   const [geofences, setGeofences] = useState([]);
//   const [allPaths, setAllPaths] = useState({}); // {drone_id: [{lat,lon}]}
//   const [pathColors, setPathColors] = useState({}); // {drone_id: color}
//   const [allDrones, setAllDrones] = useState({}); // {drone_id: {lat,lon,index}}
//   const [isPlanning, setIsPlanning] = useState(false);

//   const startRef = useRef(null);
//   const goalRef = useRef(null);
//   const socketRef = useRef(null);
//   const simIntervals = useRef({});

//   /* -------------------------
//      LOAD GEOFENCES
//      ------------------------- */
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/path/geofences")
//       .then((res) => setGeofences(res.data || []))
//       .catch((err) => console.error("Geofences fetch error:", err));
//   }, []);

//   /* -------------------------
//      PLAN PATH
//      ------------------------- */
//   const planPath = async () => {
//     const start = startRef.current;
//     const goal = goalRef.current;
//     if (!start || !goal) return alert("Click start and goal points first!");

//     setIsPlanning(true);
//     try {
//       const res = await axios.post("http://localhost:8000/api/path/plan", {
//         start,
//         goal,
//         step_deg: 0.01,
//       });

//       const p = (res.data?.path || []).map((pt) =>
//         Array.isArray(pt) ? { lat: pt[0], lon: pt[1] } : pt
//       );
//       if (p.length === 0) throw new Error("No path received");

//       const droneId = "Drone-" + Math.floor(Math.random() * 10000);

//       // store locally
//       setAllPaths((prev) => ({ ...prev, [droneId]: p }));
//       setAllDrones((prev) => ({
//         ...prev,
//         [droneId]: { lat: p[0].lat, lon: p[0].lon, index: 0 },
//       }));

//       // Request backend to start simulation
//       await axios.post("http://localhost:8000/api/path/simulate", {
//         drone_id: parseInt(droneId.replace("Drone-", "")),
//         path: p,
//         speed_mps: 10,
//         altitude_m: 100,
//       });
//     } catch (err) {
//       console.error("Plan path error:", err);
//       alert("Path planning failed: " + (err.message || ""));
//     } finally {
//       setIsPlanning(false);
//     }
//   };

//   /* -------------------------
//      WEBSOCKET SETUP
//      ------------------------- */
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8000/api/path/ws/global");
//     socketRef.current = socket;

//     socket.onopen = () => console.log("✅ Connected to Global WS");
//     socket.onclose = () => console.log("❌ Global WS closed");
//     socket.onerror = (err) => console.error("WS Error:", err);

//     // ✅ Updated socket message handler
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "new_path") {
//         const droneId = "Drone-" + data.drone_id;

//         setAllPaths((prev) => ({ ...prev, [droneId]: data.path }));
//         setPathColors((prev) => ({ ...prev, [droneId]: data.color }));
//         setAllDrones((prev) => ({
//           ...prev,
//           [droneId]: { lat: data.path[0].lat, lon: data.path[0].lon, index: 0 },
//         }));
//       } else if (data.type === "drone_status") {
//         const droneId = "Drone-" + data.drone_id;

//         setAllDrones((prev) => ({
//           ...prev,
//           [droneId]: {
//             lat: data.status.lat,
//             lon: data.status.lon,
//             index: 0,
//           },
//         }));

//         if (data.color) {
//           setPathColors((prev) => ({ ...prev, [droneId]: data.color }));
//         }
//       }
//     };

//     return () => socket.close();
//   }, []);

//   /* -------------------------
//      CLEAR POINTS
//      ------------------------- */
//   const clearPlan = () => {
//     startRef.current = null;
//     goalRef.current = null;
//   };

//   /* -------------------------
//      RENDER
//      ------------------------- */
//   return (
//     <div style={{ height: "100vh", width: "100%", position: "relative" }}>
//       {/* Control Panel */}
//       <div
//         style={{
//           position: "absolute",
//           top: 12,
//           left: 12,
//           zIndex: 1400,
//           background: "white",
//           padding: 10,
//           borderRadius: 6,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         }}
//       >
//         <h4 style={{ margin: "0 0 6px 0" }}>UAV Shared Flight Plans</h4>
//         <div style={{ fontSize: 12, marginBottom: 8 }}>
//           Click map twice: first = Start, second = Goal
//         </div>
//         <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//           <button onClick={planPath} disabled={isPlanning}>
//             {isPlanning ? "Planning..." : "Plan & Simulate"}
//           </button>
//           <button onClick={clearPlan}>Clear Points</button>
//         </div>
//         <div style={{ fontSize: 12 }}>
//           Active drones: {Object.keys(allDrones).length}
//           <br />
//           Shared paths: {Object.keys(allPaths).length}
//         </div>
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[22.57, 88.36]}
//         zoom={6}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === "no-fly" ? "red" : "blue",
//               fillOpacity: 0.18,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Paths + Start/End markers */}
//         {Object.entries(allPaths).map(([id, p]) => {
//           const color = pathColors[id] || "green";
//           return (
//             <React.Fragment key={id}>
//               <Polyline
//                 positions={p.map((pt) => [pt.lat, pt.lon])}
//                 pathOptions={{ color, weight: 3 }}
//               >
//                 <Popup>{id} path</Popup>
//               </Polyline>

//               {p.length > 0 && (
//                 <>
//                   <Marker position={[p[0].lat, p[0].lon]} icon={startIcon}>
//                     <Popup>🚀 Start of {id}</Popup>
//                   </Marker>
//                   <Marker
//                     position={[p[p.length - 1].lat, p[p.length - 1].lon]}
//                     icon={goalIcon}
//                   >
//                     <Popup>🎯 Destination of {id}</Popup>
//                   </Marker>
//                 </>
//               )}
//             </React.Fragment>
//           );
//         })}

//         {/* Drone markers */}
//         {Object.entries(allDrones).map(([id, d]) => {
//           const color = pathColors[id] || "#008000";
//           const icon = L.divIcon({
//             className: "custom-drone-icon",
//             html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;"></div>`,
//           });
//           return (
//             <Marker key={id} position={[d.lat, d.lon]} icon={icon}>
//               <Popup>
//                 {id}
//                 <br />
//                 {d.lat.toFixed(5)}, {d.lon.toFixed(5)}
//               </Popup>
//             </Marker>
//           );
//         })}

//         <ClickPicker setStart={startRef} setGoal={goalRef} />
//         <FitMap allPaths={allPaths} />
//       </MapContainer>
//     </div>
//   );
// }

//14

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Polygon,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* -------------------------
//    ICONS
//    ------------------------- */
// const droneIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
// });

// const startIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
// });

// const goalIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
// });

// /* -------------------------
//    CLICK PICKER
//    ------------------------- */
// function ClickPicker({ setStart, setGoal }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       if (!setStart.current) {
//         setStart.current = { lat, lon: lng };
//         alert("✅ Start point selected!");
//       } else if (!setGoal.current) {
//         setGoal.current = { lat, lon: lng };
//         alert("✅ Destination selected!");
//       }
//     },
//   });
//   return null;
// }

// /* -------------------------
//    FIT MAP TO ALL PATHS
//    ------------------------- */
// function FitMap({ allPaths }) {
//   const map = useMap();
//   useEffect(() => {
//     const allCoords = Object.values(allPaths).flatMap((p) =>
//       p.map((pt) => [pt.lat, pt.lon])
//     );
//     if (allCoords.length) {
//       const bounds = L.latLngBounds(allCoords);
//       map.fitBounds(bounds.pad(0.2));
//     }
//   }, [allPaths, map]);
//   return null;
// }

// /* -------------------------
//    MAIN COMPONENT
//    ------------------------- */
// export default function MapView() {
//   const [geofences, setGeofences] = useState([]);
//   const [allPaths, setAllPaths] = useState({}); // {drone_id: [{lat,lon}]}
//   const [pathColors, setPathColors] = useState({}); // {drone_id: color}
//   const [allDrones, setAllDrones] = useState({}); // {drone_id: {lat,lon,index}}
//   const [isPlanning, setIsPlanning] = useState(false);
//   const [isSimulating, setIsSimulating] = useState(false);

//   const startRef = useRef(null);
//   const goalRef = useRef(null);
//   const socketRef = useRef(null);

//   /* -------------------------
//      LOAD GEOFENCES
//      ------------------------- */
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/path/geofences")
//       .then((res) => setGeofences(res.data || []))
//       .catch((err) => console.error("Geofences fetch error:", err));
//   }, []);

//   /* -------------------------
//      PLAN PATH (only draws + saves)
//      ------------------------- */
//   const planPath = async () => {
//     const start = startRef.current;
//     const goal = goalRef.current;
//     if (!start || !goal) return alert("Click start and goal points first!");

//     setIsPlanning(true);
//     try {
//       const res = await axios.post("http://localhost:8000/api/path/plan", {
//         start,
//         goal,
//         step_deg: 0.01,
//       });

//       const path = (res.data?.path || []).map((pt) =>
//         Array.isArray(pt) ? { lat: pt[0], lon: pt[1] } : pt
//       );
//       if (path.length === 0) throw new Error("No path received");

//       const droneId = "Drone-" + Math.floor(Math.random() * 10000);
//       const randomColor =
//         "#" + Math.floor(Math.random() * 16777215).toString(16);

//       setAllPaths((prev) => ({ ...prev, [droneId]: path }));
//       setPathColors((prev) => ({ ...prev, [droneId]: randomColor }));
//       setAllDrones((prev) => ({
//         ...prev,
//         [droneId]: { lat: path[0].lat, lon: path[0].lon, index: 0 },
//       }));

//       // Broadcast to WebSocket
//       socketRef.current?.send(
//         JSON.stringify({
//           type: "new_path",
//           drone_id: droneId.replace("Drone-", ""),
//           path,
//           color: randomColor,
//         })
//       );

//       alert("✅ Path planned successfully! Now click 'Start Simulation'.");
//     } catch (err) {
//       console.error("Path planning error:", err);
//       alert("Path planning failed: " + (err.message || ""));
//     } finally {
//       setIsPlanning(false);
//     }
//   };

//   /* -------------------------
//      START SIMULATION
//      ------------------------- */
//   const startSimulation = (droneId) => {
//     const path = allPaths[droneId];
//     if (!path || path.length === 0) {
//       alert("Plan a path first!");
//       return;
//     }

//     setIsSimulating(true);
//     let i = 0;

//     const interval = setInterval(() => {
//       if (i >= path.length) {
//         clearInterval(interval);
//         setIsSimulating(false);
//         alert(`✅ Simulation for ${droneId} completed.`);
//         return;
//       }

//       const { lat, lon } = path[i];
//       setAllDrones((prev) => ({
//         ...prev,
//         [droneId]: { lat, lon, index: i },
//       }));

//       // Send live update to others
//       socketRef.current?.send(
//         JSON.stringify({
//           type: "drone_status",
//           drone_id: droneId.replace("Drone-", ""),
//           status: { lat, lon },
//         })
//       );

//       i++;
//     }, 800); // move every 0.8 sec
//   };

//   /* -------------------------
//      WEBSOCKET SETUP
//      ------------------------- */
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8000/api/path/ws/global");
//     socketRef.current = socket;

//     socket.onopen = () => console.log("✅ Connected to Global WS");
//     socket.onclose = () => console.log("❌ Global WS closed");
//     socket.onerror = (err) => console.error("WS Error:", err);

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "new_path") {
//         const droneId = "Drone-" + data.drone_id;
//         setAllPaths((prev) => ({ ...prev, [droneId]: data.path }));
//         setPathColors((prev) => ({ ...prev, [droneId]: data.color || "green" }));
//       } else if (data.type === "drone_status") {
//         const droneId = "Drone-" + data.drone_id;
//         setAllDrones((prev) => ({
//           ...prev,
//           [droneId]: { lat: data.status.lat, lon: data.status.lon, index: 0 },
//         }));
//       }
//     };

//     return () => socket.close();
//   }, []);

//   /* -------------------------
//      CLEAR USER POINTS ONLY
//      ------------------------- */
//   const clearPlan = () => {
//     startRef.current = null;
//     goalRef.current = null;
//     alert("Cleared your selected start/destination points!");
//   };

//   /* -------------------------
//      RENDER
//      ------------------------- */
//   return (
//     <div style={{ height: "100vh", width: "100%", position: "relative" }}>
//       {/* Control Panel */}
//       <div
//         style={{
//           position: "absolute",
//           top: 12,
//           left: 12,
//           zIndex: 1400,
//           background: "white",
//           padding: 10,
//           borderRadius: 6,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         }}
//       >
//         <h4 style={{ margin: "0 0 6px 0" }}>UAV Shared Flight Plans</h4>
//         <div style={{ fontSize: 12, marginBottom: 8 }}>
//           Click map twice: first = Start, second = Goal
//         </div>
//         <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//           <button onClick={planPath} disabled={isPlanning}>
//             {isPlanning ? "Planning..." : "Plan Path"}
//           </button>
//           <button
//             onClick={() => {
//               const firstDrone = Object.keys(allPaths)[0];
//               if (firstDrone) startSimulation(firstDrone);
//               else alert("Plan a path first!");
//             }}
//             disabled={isSimulating}
//           >
//             {isSimulating ? "Simulating..." : "Start Simulation"}
//           </button>
//           <button onClick={clearPlan}>Clear Points</button>
//         </div>
//         <div style={{ fontSize: 12 }}>
//           Active drones: {Object.keys(allDrones).length}
//           <br />
//           Shared paths: {Object.keys(allPaths).length}
//         </div>
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[22.57, 88.36]}
//         zoom={6}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Geofences */}
//         {geofences.map((gf, idx) => (
//           <Polygon
//             key={idx}
//             positions={gf.polygon.map((p) => [p[0], p[1]])}
//             pathOptions={{
//               color: gf.type === "no-fly" ? "red" : "blue",
//               fillOpacity: 0.18,
//             }}
//           >
//             <Popup>
//               <b>{gf.name}</b>
//               <br />
//               Type: {gf.type}
//             </Popup>
//           </Polygon>
//         ))}

//         {/* Paths + Start/End markers */}
//         {Object.entries(allPaths).map(([id, p]) => {
//           const color = pathColors[id] || "green";
//           return (
//             <React.Fragment key={id}>
//               <Polyline
//                 positions={p.map((pt) => [pt.lat, pt.lon])}
//                 pathOptions={{ color, weight: 3 }}
//               >
//                 <Popup>{id} path</Popup>
//               </Polyline>

//               {p.length > 0 && (
//                 <>
//                   <Marker position={[p[0].lat, p[0].lon]} icon={startIcon}>
//                     <Popup>🚀 Start of {id}</Popup>
//                   </Marker>
//                   <Marker
//                     position={[p[p.length - 1].lat, p[p.length - 1].lon]}
//                     icon={goalIcon}
//                   >
//                     <Popup>🎯 Destination of {id}</Popup>
//                   </Marker>
//                 </>
//               )}
//             </React.Fragment>
//           );
//         })}

//         {/* Drone markers */}
//         {Object.entries(allDrones).map(([id, d]) => {
//           const color = pathColors[id] || "#008000";
//           const icon = L.divIcon({
//             className: "custom-drone-icon",
//             html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;"></div>`,
//           });
//           return (
//             <Marker key={id} position={[d.lat, d.lon]} icon={icon}>
//               <Popup>
//                 {id}
//                 <br />
//                 {d.lat.toFixed(5)}, {d.lon.toFixed(5)}
//               </Popup>
//             </Marker>
//           );
//         })}

//         <ClickPicker setStart={startRef} setGoal={goalRef} />
//         <FitMap allPaths={allPaths} />
//       </MapContainer>
//     </div>
//   );
// }

//15

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* -------------------------
   ICONS
   ------------------------- */
const startIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const goalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const mapThemes = {
  streets: {
    label: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  terrain: {
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
};

/* -------------------------
   CLICK PICKER
   ------------------------- */
function ClickPicker({ startRef, goalRef, onStartSelected, onGoalSelected }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!startRef.current) {
        const point = { lat, lon: lng };
        startRef.current = point;
        onStartSelected(point);
        alert("✅ Start point selected!");
      } else if (!goalRef.current) {
        const point = { lat, lon: lng };
        goalRef.current = point;
        onGoalSelected(point);
        alert("✅ Destination selected!");
      }
    },
  });
  return null;
}

/* -------------------------
   FIT MAP TO ALL PATHS
   ------------------------- */
function FitMap({ allPaths }) {
  const map = useMap();
  useEffect(() => {
    const allCoords = Object.values(allPaths).flatMap((p) =>
      p.map((pt) => [pt.lat, pt.lon])
    );
    if (allCoords.length) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds.pad(0.2));
    }
  }, [allPaths, map]);
  return null;
}

/* -------------------------
   MAIN COMPONENT
   ------------------------- */
export default function MapView() {
  const [geofences, setGeofences] = useState([]);
  const [allPaths, setAllPaths] = useState({});
  const [pathColors, setPathColors] = useState({});
  const [allDrones, setAllDrones] = useState({});
  const [isPlanning, setIsPlanning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulationActionLoading, setIsSimulationActionLoading] = useState(false);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [mapTheme, setMapTheme] = useState("streets");

  const startRef = useRef(null);
  const goalRef = useRef(null);
  const socketRef = useRef(null);
  const userDroneIdRef = useRef(null);

  /* -------------------------
     LOAD GEOFENCES
     ------------------------- */
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/path/geofences")
      .then((res) => setGeofences(res.data || []))
      .catch((err) => console.error("Geofences fetch error:", err));
  }, []);

  /* -------------------------
     PLAN PATH
     ------------------------- */
  const planPath = async () => {
    const start = startRef.current;
    const goal = goalRef.current;
    if (!start || !goal) return alert("Click start and goal points first!");

    setIsPlanning(true);
    try {
      const res = await axios.post("http://localhost:8000/api/path/plan", {
        start,
        goal,
        step_deg: 0.01,
      });

      const droneId = res.data.drone_id;
      const path = res.data.path;
      const color = "#"+Math.floor(Math.random()*16777215).toString(16);

      // Store in frontend state
      userDroneIdRef.current = droneId;
      setAllPaths((prev) => ({ ...prev, ["Drone-" + droneId]: path }));
      setPathColors((prev) => ({ ...prev, ["Drone-" + droneId]: color }));
      setAllDrones((prev) => ({
        ...prev,
        ["Drone-" + droneId]: { lat: path[0].lat, lon: path[0].lon, index: 0 },
      }));

      alert("✅ Path planned! Now click 'Start Simulation'.");

    } catch (err) {
      console.error("Path planning error:", err);
      alert("Path planning failed.");
    } finally {
      setIsPlanning(false);
    }
  };

  /* -------------------------
     START SIMULATION (server)
     ------------------------- */
  const startSimulation = async () => {
    const droneId = userDroneIdRef.current;
    if (!droneId) {
      alert("Plan a path first!");
      return;
    }

    const path = allPaths["Drone-" + droneId];
    if (!path || path.length === 0) {
      alert("Path is empty!");
      return;
    }

    setIsSimulationActionLoading(true);
    try {
      await axios.post("http://localhost:8000/api/path/simulate", {
        drone_id: droneId,
        path,
        speed_mps: 30,
        altitude_m: 100,
      });

      setIsSimulating(true);
      alert(`🚀 Simulation started for your Drone ${droneId}.`);
    } catch (err) {
      console.error("Simulation error:", err);
      alert("Failed to start simulation.");
    } finally {
      setIsSimulationActionLoading(false);
    }
  };

  const stopSimulation = async () => {
    const droneId = userDroneIdRef.current;
    if (!droneId) return;

    setIsSimulationActionLoading(true);
    try {
      await axios.post("http://localhost:8000/api/path/stop", {
        drone_id: droneId,
      });
      setIsSimulating(false);
      alert(`🛑 Simulation stopped for your Drone ${droneId}.`);
    } catch (err) {
      console.error("Stop simulation error:", err);
      alert("Failed to stop simulation.");
    } finally {
      setIsSimulationActionLoading(false);
    }
  };

  const handleSimulationAction = () => {
    if (isSimulating) {
      stopSimulation();
      return;
    }
    startSimulation();
  };

  /* -------------------------
     WEBSOCKET HANDLER
     ------------------------- */
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/api/path/ws/global");
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ Connected to WS");
    socket.onclose = () => console.log("❌ WS closed");
    socket.onerror = (err) => console.error("WS error:", err);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const droneKey = "Drone-" + data.drone_id;

      if (data.type === "new_path") {
        setAllPaths((prev) => ({ ...prev, [droneKey]: data.path }));
        setPathColors((prev) => ({
          ...prev,
          [droneKey]: data.color || "green",
        }));
      } else if (data.type === "drone_status") {
        const status = data.status;
        if (!status) return;
        setAllDrones((prev) => ({
          ...prev,
          [droneKey]: {
            lat: status.lat,
            lon: status.lon,
            index: status.index || 0,
          },
        }));
      } else if (data.type === "simulation_complete") {
        alert(`✅ Drone ${droneKey} finished simulation.`);
        if (droneKey === "Drone-" + userDroneIdRef.current) {
          setIsSimulating(false);
        }
      } else if (data.type === "simulation_stopped") {
        if (droneKey === "Drone-" + userDroneIdRef.current) {
          setIsSimulating(false);
        }
      } else if (data.type === "path_cleared") {
        setAllPaths((prev) => {
          const next = { ...prev };
          delete next[droneKey];
          return next;
        });
        setPathColors((prev) => {
          const next = { ...prev };
          delete next[droneKey];
          return next;
        });
      } else if (data.type === "drone_removed") {
        setAllDrones((prev) => {
          const next = { ...prev };
          delete next[droneKey];
          return next;
        });
        if (droneKey === "Drone-" + userDroneIdRef.current) {
          setIsSimulating(false);
          userDroneIdRef.current = null;
        }
      }
    };

    return () => socket.close();
  }, []);

  /* -------------------------
     CLEAR USER POINTS
     ------------------------- */
  const clearPlan = () => {
    const droneId = userDroneIdRef.current;
    const droneKey = droneId ? "Drone-" + droneId : null;

    startRef.current = null;
    goalRef.current = null;
    setSelectedStart(null);
    setSelectedGoal(null);
    setIsSimulating(false);

    if (droneKey) {
      setAllPaths((prev) => {
        const next = { ...prev };
        delete next[droneKey];
        return next;
      });
      setPathColors((prev) => {
        const next = { ...prev };
        delete next[droneKey];
        return next;
      });
      setAllDrones((prev) => {
        const next = { ...prev };
        delete next[droneKey];
        return next;
      });
      userDroneIdRef.current = null;
      axios
        .post("http://localhost:8000/api/path/clear", { drone_id: droneId })
        .catch((err) => console.error("Clear plan error:", err));
    }

    alert("Cleared selected points, markers, and your drone path.");
  };

  /* -------------------------
     RENDER MAP
     ------------------------- */
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <div className="map-control-panel">
        <h4 className="map-control-title">UAV Shared Flight Planner</h4>
        <div className="map-control-meta">
          Click map twice: first = Start, second = Goal
        </div>
        <div className="map-control-actions">
          <button onClick={planPath} disabled={isPlanning}>
            {isPlanning ? "Planning..." : "Plan Path"}
          </button>
          <button onClick={handleSimulationAction} disabled={isSimulationActionLoading}>
            {isSimulationActionLoading
              ? "Processing..."
              : isSimulating
                ? "Stop Simulation"
                : "Start Simulation"}
          </button>
          <button onClick={clearPlan}>Clear Points</button>
          <select value={mapTheme} onChange={(e) => setMapTheme(e.target.value)}>
            {Object.entries(mapThemes).map(([value, theme]) => (
              <option key={value} value={value}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>
        <div className="map-control-stats">
          Active drones: {Object.keys(allDrones).length}
          <br />
          Shared paths: {Object.keys(allPaths).length}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[22.57, 88.36]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={mapTheme}
          url={mapThemes[mapTheme].url}
          attribution={mapThemes[mapTheme].attribution}
        />

        {/* Geofences
        {geofences.map((gf, idx) => (
          <Polygon
            key={idx}
            positions={gf.polygon.map((p) => [p[0], p[1]])}
            pathOptions={{
              color: gf.type === "no-fly" ? "red" : "blue",
              fillOpacity: 0.18,
            }}
          >
            <Popup>
              <b>{gf.name}</b>
              <br />
              Type: {gf.type}
            </Popup>
          </Polygon>
        ))} */}

        {geofences.map((fence) => {
          let color;
          if (fence.type === "no-fly") color = "red";
          else if (fence.type === "with permission") color = "yellow";
          else if (fence.type === "green") color = "green";
          else if (fence.type === "red") color = "red";
          else color = "blue";

          // Convert polygon from backend JSON string to array if needed
          const coords =
            typeof fence.polygon === "string" ? JSON.parse(fence.polygon) : fence.polygon;

          return (
            <Polygon
              key={fence.id}
              positions={coords}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }}
            >
              <Popup>
                <b>{fence.name}</b>
                <br />
                Type: {fence.type}
              </Popup>
            </Polygon>
          );
        })}

        {/* Paths */}
        {Object.entries(allPaths).map(([id, p]) => {
          const color = pathColors[id] || "green";
          return (
            <React.Fragment key={id}>
              <Polyline
                positions={p.map((pt) => [pt.lat, pt.lon])}
                pathOptions={{ color, weight: 3 }}
              >
                <Popup>{id} path</Popup>
              </Polyline>

              {p.length > 0 && (
                <>
                  <Marker position={[p[0].lat, p[0].lon]} icon={startIcon}>
                    <Popup>🚀 Start of {id}</Popup>
                  </Marker>
                  <Marker
                    position={[p[p.length - 1].lat, p[p.length - 1].lon]}
                    icon={goalIcon}
                  >
                    <Popup>🎯 Destination of {id}</Popup>
                  </Marker>
                </>
              )}
            </React.Fragment>
          );
        })}

        {selectedStart && (
          <Marker position={[selectedStart.lat, selectedStart.lon]} icon={startIcon}>
            <Popup>🚀 Selected Start</Popup>
          </Marker>
        )}

        {selectedGoal && (
          <Marker position={[selectedGoal.lat, selectedGoal.lon]} icon={goalIcon}>
            <Popup>🎯 Selected Destination</Popup>
          </Marker>
        )}

        {/* Drone markers */}
        {Object.entries(allDrones).map(([id, d]) => {
          const color = pathColors[id] || "#008000";
          const icon = L.divIcon({
            className: "custom-drone-icon",
            html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;"></div>`,
          });
          return (
            <Marker key={id} position={[d.lat, d.lon]} icon={icon}>
              <Popup>
                {id}
                <br />
                {d.lat.toFixed(5)}, {d.lon.toFixed(5)}
              </Popup>
            </Marker>
          );
        })}

        <ClickPicker
          startRef={startRef}
          goalRef={goalRef}
          onStartSelected={setSelectedStart}
          onGoalSelected={setSelectedGoal}
        />
        <FitMap allPaths={allPaths} />
      </MapContainer>
    </div>
  );
}
