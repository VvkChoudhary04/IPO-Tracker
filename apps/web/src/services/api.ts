import { HealthResponse, ApiResponse } from '@ipotrack/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json: ApiResponse<HealthResponse> = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Failed to connect to IPOTrack backend API:', err);
    return null;
  }
}

