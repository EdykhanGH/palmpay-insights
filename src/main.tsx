import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Shows the error instead of a blank page if anything crashes.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: "pre-wrap", color: "#DC2626" }}>{this.state.error.message}</pre>
        <button
          onClick={() => {
            try {
              localStorage.clear();
            } catch {
              /* ignore */
            }
            location.reload();
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
