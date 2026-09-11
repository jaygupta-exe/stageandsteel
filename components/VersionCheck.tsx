"use client";

import { useEffect, useRef } from "react";

const VERSION_STORAGE_KEY = "stage_steel_app_build";

export default function VersionCheck() {
  const isCheckingRef = useRef(false);

  const checkVersion = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      // Add timestamp query parameter to bypass aggressive intermediate caches
      const res = await fetch(`/api/version?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const currentBuild = data.buildTime || data.version;

      if (!currentBuild) return;

      const storedBuild = localStorage.getItem(VERSION_STORAGE_KEY);

      if (!storedBuild) {
        // First visit or fresh storage
        localStorage.setItem(VERSION_STORAGE_KEY, currentBuild);
      } else if (storedBuild !== currentBuild) {
        console.log(
          `[App Update] New version detected (${storedBuild} -> ${currentBuild}). Clearing cache & refreshing...`
        );
        // Update stored version first to prevent infinite refresh loop
        localStorage.setItem(VERSION_STORAGE_KEY, currentBuild);

        // Clear Browser Cache Storage if available
        if (typeof window !== "undefined" && "caches" in window) {
          try {
            const cacheNames = await window.caches.keys();
            await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
          } catch (err) {
            console.warn("[App Update] Failed to clear CacheStorage:", err);
          }
        }

        // Unregister any stale service workers
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((reg) => reg.unregister()));
          } catch (err) {
            console.warn("[App Update] Failed to unregister service workers:", err);
          }
        }

        // Hard refresh the page to load fresh assets from the server
        window.location.reload();
      }
    } catch (e) {
      // Silent fail on network disconnection
      console.debug("[App Update] Version check skipped:", e);
    } finally {
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    // Initial check on mount
    checkVersion();

    // Check again when user refocuses or unlocks phone screen
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", checkVersion);

    // Periodic check every 10 minutes
    const interval = setInterval(checkVersion, 10 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkVersion);
      clearInterval(interval);
    };
  }, []);

  return null;
}
