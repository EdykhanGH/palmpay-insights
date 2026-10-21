import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Shows the error instead of a blank page if anything crashes.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null; where: string }> {
  state = { error: null as Error | null, where: "" };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(_error: Error, info: React.ErrorInfo) {
    // Which component crashed, so a screenshot of this screen is enough to find the bug.
    const where = (info.componentStack ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 4).join(" < ");
    this.setState({ where });
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: "pre-wrap", color: "#DC2626" }}>{this.state.error.message}</pre>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#6B6478" }}>
          {this.state.where}
          {"\n"}
          {(this.state.error.stack ?? "").split("\n").slice(0, 5).join("\n")}
          {"\n"}
          {navigator.userAgent}
        </pre>
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
