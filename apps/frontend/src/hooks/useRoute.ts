import { useEffect, useState } from "react";
import { parseRoute, type Route } from "../routing/routes";

export function useRoute() {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.pathname),
  );

  useEffect(() => {
    function syncRoute() {
      setRoute(parseRoute(window.location.pathname));
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isActive(path: string): boolean {
    return window.location.pathname === path;
  }

  return { isActive, navigate, route };
}

