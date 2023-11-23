import axios from 'axios';
import { VITE_API_URL } from '@/constants/env';

const AuthRequest = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

export default AuthRequest;
