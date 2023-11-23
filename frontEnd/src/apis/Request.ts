import axios from 'axios';
import { VITE_API_URL } from '@/constants/env';

const Request = axios.create({
  baseURL: VITE_API_URL,
});

export default Request;
