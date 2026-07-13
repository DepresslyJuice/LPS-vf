import type { LoadState } from "../types/ui";

interface AppHeaderProps {
  loadState: LoadState;
}

export function AppHeader({ loadState }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Fabrica de software academica</p>
        <h1>Courses Platform</h1>
      </div>
      <span className={`status status-${loadState}`}>{loadState}</span>
    </header>
  );
}

