
import React, { useState } from 'react'
import { login, setToken } from '../services/auth'

export default function Login({ onDone }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const submit = async ()=>{
    try{
      const res = await login(email, password)
      setToken(res.access_token)
      onDone && onDone()
    }catch(e){ setErr('Login failed') }
  }
  return (<div style={{display:'flex'}}>
    <div className='auth-form'>
      <h3>Login</h3>
      <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  </div>)
}
