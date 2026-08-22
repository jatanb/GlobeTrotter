const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "/api/v1";


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );


    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText || `Request failed: ${response.status}`,
      );
    }


    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the API. Make sure the backend is running on port 8000.",
      );
    }

    throw error;
  }
}


export async function checkBackend() {
  return apiRequest<{
    status: string;
    service: string;
    message: string;
  }>("/health");
}