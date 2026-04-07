
import React, { useState } from 'react'
import API from '../services/api'
import { authHeader } from '../services/auth'

export default function FlightPlan(){
  const [droneId, setDroneId] = useState('1')
  const [waypoints, setWaypoints] = useState('[{"lat":28.6139,"lon":77.2090},{"lat":28.62,"lon":77.21}]')
  const [msg, setMsg] = useState('')

  const submit = async ()=>{
    try{
      const plan = JSON.parse(waypoints)
      const res = await API.post('/api/flightplans', { drone_id: parseInt(droneId), plan }, { headers: authHeader() })
      setMsg('Flight plan submitted')
    }catch(e){ setMsg('Error submitting') }
  }
  return (<div className='flight-plan-card'>
    <h3>Submit Flight Plan</h3>
    <label>Drone ID</label>
    <input value={droneId} onChange={e=>setDroneId(e.target.value)} />
    <label>Waypoints (JSON array)</label>
    <textarea value={waypoints} onChange={e=>setWaypoints(e.target.value)} rows={7} />
    <button onClick={submit}>Submit</button>
    {msg && <p className='form-message'>{msg}</p>}
  </div>)
}
