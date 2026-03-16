
import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8000' })

export async function register(email, password){
  const res = await API.post('/api/auth/register', { email, password })
  return res.data
}

export async function login(email, password){
  const res = await API.post('/api/auth/login', { email, password })
  return res.data
}

export function setToken(token){ localStorage.setItem('token', token) }
export function getToken(){ return localStorage.getItem('token') }
export function authHeader(){ const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {} }
