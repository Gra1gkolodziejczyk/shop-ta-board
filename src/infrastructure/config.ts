import { HttpClient } from '../adapters/outbound/http/httpClient';

// Configuration simple, pas besoin de singleton complexe
export const httpClient = new HttpClient(
  import.meta.env.VITE_API_BASE_URL
);
