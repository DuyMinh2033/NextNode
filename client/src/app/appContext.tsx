"use client";
import { createContext, ReactNode, useContext, useState } from "react";

const AppContext = createContext({
  token: "",
  setToken: (token: string) => {},
  IdUser: "",
  setIdUser: (token: string) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("use context error");
  }
  return context;
};

export default function AppProvider({
  children,
  initialToken = "",
  initialIdUser = "",
}: {
  children: ReactNode;
  initialToken?: string;
  initialIdUser?: string;
}) {
  const [token, setToken] = useState(initialToken);
  const [IdUser, setIdUser] = useState(initialIdUser);
  return (
    <AppContext.Provider value={{ token, setToken, IdUser, setIdUser }}>
      {children}
    </AppContext.Provider>
  );
}
