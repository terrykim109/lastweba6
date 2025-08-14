import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import { jwtDecode } from "jwt-decode"; 
const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [token, setTokenValue] = useAtom(tokenAtom);

  const setToken = (tokenString) => {
    if (!tokenString || typeof tokenString !== "string" || tokenString.split(".").length !== 3) {
      throw new Error("Invalid token format");
    }
    localStorage.setItem(TOKEN_KEY, tokenString);
    setTokenValue(jwtDecode(tokenString));
  };

  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenValue(null);
  };

  return { token, setToken, removeToken };
}

// set token
export function setToken(token) {
  if (!token || typeof token !== "string" || token.split(".").length !== 3) {
    throw new Error("Invalid token format");
  }
  localStorage.setItem(TOKEN_KEY, token);
}

// get token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function readToken() {
  try {
    const token = getToken();
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
}

// for user registration
export async function registerUser(user, password, password2) {
  try {
    console.log("Registering user:", user);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: user, password, password2 })
      }
    );

    console.log("Registration response status:", response.status);
    
    if (response.status === 200) {
      console.log("Registration successful");
      return true;
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Registration failed";
      console.error("Registration error:", errorMessage);
      
      if (response.status === 422) {
        throw new Error(errorMessage);
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// for user authentication
export async function authenticateUser(user, password) {
  try {
    console.groupCollapsed("Starting authentication");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("API URL:", apiUrl);
    
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
    
    const loginUrl = `${apiUrl}/api/user/login`;
    console.log("Login URL:", loginUrl);
    
    console.log("Sending request:", { user, password });
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password })
    });

    console.log("Response status:", response.status);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned HTML instead of JSON");
    }

    const data = await response.json();
    console.log("Response data:", data);
    
    if (response.status === 200) {
      if (!data.token) {
        throw new Error("Token missing in response");
      }
      
      console.log("Token received:", data.token);
      return data.token;
    } else {
      throw new Error(data.message || `Login failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

// checking authentication status
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = readToken(token);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log("Token expired");
      return false;
    }
    return true;
  } catch (e) {
    console.error("Token validation error:", e);
    return false;
  }
}