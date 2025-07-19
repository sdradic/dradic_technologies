import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface ReloadContextType {
  triggerReload: () => void;
  isReloading: boolean;
  onReloadRequest: (callback: () => void) => void;
}

const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export function ReloadProvider({ children }: { children: ReactNode }) {
  const [isReloading, setIsReloading] = useState(false);
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

  return (
    <ReloadContext.Provider
      value={{ triggerReload, isReloading, onReloadRequest }}
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
