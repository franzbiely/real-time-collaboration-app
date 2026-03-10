import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/notes`,
  headers: { 'Content-Type': 'application/json' },
});
