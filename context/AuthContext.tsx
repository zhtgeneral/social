import { User } from "@/types/supabase";
import { User as AuthUser } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  /** The is the global state of the user in the app*/
  user: AuthUser | User | null,
  /** This function sets the global state of the user in the app*/
  setAuth: (authUser: AuthUser | null) => void,
  /** This function sets the global data of the user in the app */
  setUserData: (userData: AuthUser) => void
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

  const setAuth = (authUser: User | null) => {
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
  return useContext(AuthContext);
}