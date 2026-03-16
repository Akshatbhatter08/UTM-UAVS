
// import React, { useState } from 'react'
// import { register } from '../services/auth'

// export default function Register({ onDone }){
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [err, setErr] = useState('')
//   const submit = async ()=>{
//     try{
//       await register(email, password)
//       onDone && onDone()
//     }catch(e){ setErr('Registration failed') }
//   }
//   return (<div style={{display:'flex'}}>
//     <div className='auth-form'>
//       <h3>Register</h3>
//       <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
//       <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
//       <button onClick={submit}>Register</button>
//       {err && <div style={{color:'red'}}>{err}</div>}
//     </div>
//   </div>)
// }


import React, { useState } from "react";

function Register({ onDone, onVerify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration successful! Please verify your email.");
        setTimeout(() => onVerify(), 1500);
      } else {
        setMessage(`❌ ${data.detail || "Registration failed"}`);
      }
    } catch {
      setMessage("❌ Network error.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
