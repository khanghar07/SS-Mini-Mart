import React, { createContext, useContext, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { hashString } from "@/lib/hash";

interface AdminAuthContextType {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  currentUsername: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const DEFAULT_USERNAME = "ssmartadmin";
const DEFAULT_PASSWORD = "sspass1122";
const ADMIN_DOC_REF = doc(db, "admin_credentials", "primary");

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDoc(ADMIN_DOC_REF);
      if (!snap.exists()) {
        if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
          const passwordHash = await hashString(password);
          await setDoc(ADMIN_DOC_REF, {
            username,
            passwordHash,
            updatedAt: serverTimestamp(),
          });
          setIsAdmin(true);
          setCurrentUsername(username);
          return true;
        }
        setError("Admin credentials not set.");
        return false;
      }

      const data = snap.data() as { username?: string; passwordHash?: string };
      const storedUsername = data.username ?? "";
      const storedHash = data.passwordHash ?? "";
      const inputHash = await hashString(password);

      if (username === storedUsername && inputHash === storedHash) {
        setIsAdmin(true);
        setCurrentUsername(storedUsername);
        return true;
      }

      setError("Invalid credentials.");
      return false;
    } catch (err) {
      console.error("Admin login failed.", err);
      setError("Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUsername(null);
  };

  const updateCredentials = async (currentPassword: string, newUsername: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDoc(ADMIN_DOC_REF);
      if (!snap.exists()) {
        setError("Admin credentials not set.");
        return false;
      }
      const data = snap.data() as { passwordHash?: string };
      const storedHash = data.passwordHash ?? "";
      const currentHash = await hashString(currentPassword);

      if (currentHash !== storedHash) {
        setError("Current password is incorrect.");
        return false;
      }

      const newHash = await hashString(newPassword);
      await updateDoc(ADMIN_DOC_REF, {
        username: newUsername,
        passwordHash: newHash,
        updatedAt: serverTimestamp(),
      });
      setCurrentUsername(newUsername);
      return true;
    } catch (err) {
      console.error("Failed to update admin credentials.", err);
      setError("Update failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ isAdmin, loading, error, currentUsername, login, logout, updateCredentials }),
    [isAdmin, loading, error, currentUsername]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
