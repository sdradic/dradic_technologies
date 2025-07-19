import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface ReloadContextType {
  triggerReload: () => void;
  isReloading: boolean;
  isInitialLoading: boolean;
  onReloadRequest: (callback: () => void) => void;
  setInitialLoading: (loading: boolean) => void;
}

const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export function ReloadProvider({ children }: { children: ReactNode }) {
  const [isReloading, setIsReloading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [reloadCallback, setReloadCallback] = useState<(() => void) | null>(
    null,
  );

  const triggerReload = useCallback(async () => {
    if (reloadCallback) {
      setIsReloading(true);
      try {
        await reloadCallback();
      } finally {
        setIsReloading(false);
      }
    }
  }, [reloadCallback]);

  const onReloadRequest = useCallback((callback: () => void) => {
    setReloadCallback(() => callback);
  }, []);

  const setInitialLoading = useCallback((loading: boolean) => {
    setIsInitialLoading(loading);
  }, []);

  return (
    <ReloadContext.Provider
      value={{
        triggerReload,
        isReloading,
        isInitialLoading,
        onReloadRequest,
        setInitialLoading,
      }}
    >
      {children}
    </ReloadContext.Provider>
  );
}

export function useReload() {
  const context = useContext(ReloadContext);
  if (context === undefined) {
    throw new Error("useReload must be used within a ReloadProvider");
  }
  return context;
}
