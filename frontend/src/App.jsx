// // import React, { useEffect, useState } from 'react'
// // import MapView from './components/MapView'
// // import Login from './pages/Login'
// // import Register from './pages/Register'
// // import FlightPlan from './pages/FlightPlan'
// // import { getToken } from './services/auth'
// // import ErrorBoundary from './ErrorBoundary';

// // function App() {
// //   const [status, setStatus] = useState('Connecting...')
// //   const [page, setPage] = useState('map')
  
// //   useEffect(() => {
// //     fetch('http://localhost:8000/')
// //       .then(r => r.json())
// //       .then(d => setStatus(d.message))
// //       .catch(() => setStatus('Backend unreachable'))
// //   }, [])
  
// //   return (
// //     <div style={{height: '100%'}}>
// //       <div className='header'>
// //         <div style={{flex: 1}}>{status}</div>
// //         <div className='topbar'>
// //           <button onClick={() => setPage('map')}>Map</button>
// //           <button onClick={() => setPage('flight')}>Flight Plan</button>
// //           {!getToken() ? 
// //             <button onClick={() => setPage('login')}>Login</button> : 
// //             <button onClick={() => {
// //               localStorage.removeItem('token'); 
// //               window.location.reload()
// //             }}>Logout</button>
// //           }
// //         </div>
// //       </div>
// //       <div className='container'>
// //         {page === 'map' && (
// //           <ErrorBoundary>
// //             <MapView />
// //           </ErrorBoundary>
// //         )}
// //         {page === 'login' && <Login onDone={() => setPage('map')} />}
// //         {page === 'register' && <Register onDone={() => setPage('login')} />}
// //         {page === 'flight' && <FlightPlan />}
// //       </div>
// //     </div>
// //   )
// // }

// // export default App

// import React, { useEffect, useState } from 'react'
// import MapView from './components/MapView'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import FlightPlan from './pages/FlightPlan'
// import { getToken } from './services/auth'
// import ErrorBoundary from './ErrorBoundary'

// function App() {
//   const [status, setStatus] = useState('Connecting...')
//   const [page, setPage] = useState('map')
//   const [userEmail, setUserEmail] = useState(null)

//   // 🧭 Fetch backend status on load
//   useEffect(() => {
//     fetch('http://localhost:8000/')
//       .then(r => r.json())
//       .then(d => setStatus(d.message))
//       .catch(() => setStatus('Backend unreachable'))

//     // 🧠 Check if a user is logged in (token present)
//     const token = getToken()
//     if (token) {
//       // Optionally fetch user profile info from backend here
//       const email = localStorage.getItem('user_email')
//       setUserEmail(email || 'User')
//     }
//   }, [])

//   // 🧹 Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user_email')
//     setUserEmail(null)
//     setPage('login')
//   }

//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Header */}
//       <div
//         className='header'
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '10px 20px',
//           background: '#282c34',
//           color: 'white',
//         }}
//       >
//         <div style={{ flex: 1 }}>{status}</div>

//         <div className='topbar' style={{ display: 'flex', gap: '10px' }}>
//           <button onClick={() => setPage('map')}>🗺️ Map</button>
//           <button onClick={() => setPage('flight')}>✈️ Flight Plan</button>

//           {!getToken() ? (
//             <>
//               <button onClick={() => setPage('login')}>🔑 Login</button>
//               <button onClick={() => setPage('register')}>🧾 Register</button>
//             </>
//           ) : (
//             <>
//               <span style={{ marginRight: '10px', fontStyle: 'italic' }}>
//                 {userEmail ? `Hi, ${userEmail}` : ''}
//               </span>
//               <button onClick={handleLogout}>🚪 Logout</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Page Container */}
//       <div className='container' style={{ flex: 1, padding: '10px' }}>
//         {page === 'map' && (
//           <ErrorBoundary>
//             <MapView />
//           </ErrorBoundary>
//         )}
//         {page === 'login' && (
//           <Login
//             onDone={(email) => {
//               setUserEmail(email)
//               setPage('map')
//             }}
//             onSwitch={() => setPage('register')}
//           />
//         )}
//         {page === 'register' && (
//           <Register
//             onDone={() => setPage('login')}
//             onSwitch={() => setPage('login')}
//           />
//         )}
//         {page === 'flight' && <FlightPlan />}
//       </div>
//     </div>
//   )
// }

// export default App


import React, { useEffect, useState } from 'react';
import MapView from './components/MapView';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import FlightPlan from './pages/FlightPlan';
import { getToken } from './services/auth';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [status, setStatus] = useState('Connecting...');
  const [page, setPage] = useState('map');

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((r) => r.json())
      .then((d) => setStatus(d.message))
      .catch(() => setStatus('Backend unreachable'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const isLoggedIn = Boolean(getToken());

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand-wrap">
          <div className="brand-title">UTM UAV Control Center</div>
          <div className="brand-subtitle">Real-time planning and monitoring</div>
        </div>
        <div className="topbar">
          <span className="status-pill">{status}</span>
          <button className={page === 'map' ? 'active' : ''} onClick={() => setPage('map')}>Map</button>
          <button className={page === 'flight' ? 'active' : ''} onClick={() => setPage('flight')}>Flight Plan</button>
          {!isLoggedIn ? (
            <>
              <button className={page === 'login' ? 'active' : ''} onClick={() => setPage('login')}>Login</button>
              <button className={page === 'register' ? 'active' : ''} onClick={() => setPage('register')}>Register</button>
            </>
          ) : (
            <button className="danger-btn" onClick={logout}>Logout</button>
          )}
        </div>
      </header>

      <main className="container">
        {page === 'map' && (
          <ErrorBoundary>
            <MapView />
          </ErrorBoundary>
        )}
        {page === 'login' && <Login onDone={() => setPage('map')} />}
        {page === 'register' && (
          <Register onVerify={() => setPage('verify')} onDone={() => setPage('login')} />
        )}
        {page === 'verify' && <VerifyEmail onDone={() => setPage('login')} />}
        {page === 'flight' && <FlightPlan />}
      </main>
    </div>
  );
}

export default App;
