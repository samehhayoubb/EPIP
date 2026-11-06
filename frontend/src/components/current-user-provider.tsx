"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { users } from "@/lib/mock-data";
import type { User } from "@/lib/types";

type CurrentUserContextValue = {
  user: User;
  setUserId: (id: string) => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(users[0].id);
  const user = users.find((u) => u.id === userId) ?? users[0];

  return (
    <CurrentUserContext.Provider value={{ user, setUserId }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }
  return ctx;
}