import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: User | null,
  setAuth: (authUser: User) => void,
  setUserData: (userData: User) => void
}

/**
 * This context sets the default values for `user`, `setAuth`, and `setUserData`.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  setAuth: () => {},
  setUserData: () => {}
});

interface AuthProviderProps {
  children?: React.ReactNode
}

/**
 * This provider gives children access to `useAuth` hook.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (authUser: User) => {
    setUser(authUser);
  }
  const setUserData = (userData: User) => {
    setUser({...userData})
  }

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * This function gives access to `user`, `setAuth`, and `setUserData`.
 */
export function useAuth() { 
  useContext(AuthContext);
}