import axios from 'axios';
import { MODE, VITE_API_URL } from '@/constants/env';

const Request = axios.create({
  baseURL: MODE === 'development' ? '/' : VITE_API_URL,
});

export default Request;
