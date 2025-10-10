export class HttpClient {
  public readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log('📡 HTTP Request:', {
      url,
      method: options?.method || 'GET',
      headers: options?.headers,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      console.log('📥 HTTP Response:', {
        status: response.status,
        ok: response.ok,
      });

      // Gérer les réponses vides (204 No Content, etc.)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      // Essayer de parser le JSON pour avoir un message d'erreur plus précis
      const data = await response.json();

      if (!response.ok) {
        // Si le backend renvoie un message d'erreur structuré
        const errorMessage = data.message || data.error || `Erreur HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Gérer les erreurs réseau et autres
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la requête');
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown, // ← Rendre data optionnel pour les endpoints sans body
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined, // ← Condition pour éviter d'envoyer undefined
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}
