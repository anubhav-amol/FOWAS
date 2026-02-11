import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("fowas_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(email) {
    const mockUser = {
      email,
      token: "mock-jwt-token",
    };

    localStorage.setItem("fowas_user", JSON.stringify(mockUser));
    setUser(mockUser);
  }

  function logout() {
    localStorage.removeItem("fowas_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

