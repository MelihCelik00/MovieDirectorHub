import axios from 'axios';
import { config } from '../config';

const directorServiceBaseUrl = `http://localhost:3001${config.api.prefix}`;

export async function checkDirectorExists(directorId: string): Promise<boolean> {
  try {
    const response = await axios.get(`${directorServiceBaseUrl}/directors/${directorId}`);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw error;
  }
} 