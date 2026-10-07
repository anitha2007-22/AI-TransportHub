/**
 * AuthContext — global authentication state manager
 * Simulates JWT auth flow; replace localStorage calls with real API calls in production
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// Mock users for demo — in production, validate via backend JWT
const MOCK_USERS = [
  { id: "1", name: "Arjun Kumar", email: "arjun@demo.com", password: "demo1234", role: "commuter", avatar: "AK", city: "Chennai" },
  { id: "2", name: "Priya Nair", email: "authority@demo.com", password: "demo1234", role: "authority", avatar: "PN", city: "Coimbatore" },
  { id: "3", name: "Admin User", email: "admin@demo.com", password: "demo1234", role: "admin", avatar: "AU", city: "Tiruppur" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("th_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("th_user", JSON.stringify(safeUser));
    return safeUser;
  }, []);

  const signup = useCallback(async (name, email, password, role = "commuter") => {
    await new Promise(r => setTimeout(r, 1000));
    if (MOCK_USERS.find(u => u.email === email)) throw new Error("Email already registered");
    const newUser = { id: Date.now().toString(), name, email, role, avatar: name.split(" ").map(w => w[0]).join("").toUpperCase(), city: "Chennai" };
    setUser(newUser);
    localStorage.setItem("th_user", JSON.stringify(newUser));
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("th_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
