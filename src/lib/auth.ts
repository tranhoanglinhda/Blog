"use client";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseEnabled } from "./firebase";

const DEMO_KEY = "blog_admin_demo";

export interface AuthState {
  ready: boolean;
  user: boolean; // true = đã đăng nhập
}

export function useAuth(): AuthState & {
  signIn: (email: string, pw: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({ ready: false, user: false });

  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      return onAuthStateChanged(auth, (u) => setState({ ready: true, user: !!u }));
    }
    const demo = typeof window !== "undefined" && sessionStorage.getItem(DEMO_KEY) === "1";
    setState({ ready: true, user: demo });
  }, []);

  const signIn = async (email: string, pw: string) => {
    if (isFirebaseEnabled && auth) {
      await signInWithEmailAndPassword(auth, email, pw);
      return;
    }
    sessionStorage.setItem(DEMO_KEY, "1");
    setState({ ready: true, user: true });
  };

  const signOut = async () => {
    if (isFirebaseEnabled && auth) {
      await fbSignOut(auth);
      return;
    }
    sessionStorage.removeItem(DEMO_KEY);
    setState({ ready: true, user: false });
  };

  return { ...state, signIn, signOut };
}
