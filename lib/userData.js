import { getToken } from "./authenticate";

async function makeRequest(url, method = 'GET', body = null) {
  try {
    const token = getToken();
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, options);

    if (response.status === 200) {
      return response.json();
    } else {
      const errorText = await response.text();
      console.error(`Request failed with status ${response.status}: ${errorText}`);
      return [];
    }
  } catch (error) {
    console.error("Network error:", error);
    throw new Error(`Network request failed: ${error.message}`);
  }
}

// Favourites
export async function getFavourites() {
  const res = await makeRequest('/favourites');
  return res.favourites;
}

// add favourite
export async function addToFavourites(id) {
  const res = await makeRequest(`/favourites/${id}`, 'PUT');
  return res.favourites;
}

// remove favourite
export async function removeFromFavourites(id) {
  const res = await makeRequest(`/favourites/${id}`, 'DELETE');
  return res.favourites;
}

// get history
export async function getHistory() {
  const res = await makeRequest('/history');
  return res.history;
}

// add history
export async function addToHistory(queryString) {
  const res = await makeRequest('/history', 'POST', { queryString });
  return res.history;
}

export async function removeFromHistory(id) {
  const res = await makeRequest(`/history/${id}`, 'DELETE');
  return res.history;
}