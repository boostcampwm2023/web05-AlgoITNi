import axios from 'axios';
import { MODE, VITE_API_URL } from '@/constants/env';

const AuthRequest = axios.create({
  baseURL: MODE === 'development' ? '/' : VITE_API_URL,
  withCredentials: true,
});

export default AuthRequest;
