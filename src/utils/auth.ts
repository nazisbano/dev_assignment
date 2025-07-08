interface TokenResponse {
  token: string;
}

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const res = await fetch('/api/auth/token');

    if (!res.ok) {
      throw new Error(`Failed to fetch access token: ${res.statusText}`);
    }

    const data: TokenResponse = await res.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};
