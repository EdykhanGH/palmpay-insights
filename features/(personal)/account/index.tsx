"use client";

import dynamic from "next/dynamic";
import React from "react";

// The personal dashboard reads the clock, the browser and uploaded files, so it renders in the browser only.
const App = dynamic(() => import("./App"), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-[#f6f3fb]" />,
});

// Shows the error instead of a blank page if anything crashes.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null; where: string }> {
  state = { error: null as Error | null, where: "" };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(_error: Error, info: React.ErrorInfo) {
    const where = (info.componentStack ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 4).join(" < ");
    this.setState({ where });
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: "pre-wrap", color: "#DC2626" }}>{this.state.error.message}</pre>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#6B6478" }}>{this.state.where}</pre>
        <button onClick={() => location.reload()}>Reload</button>
      </div>
    );
  }
}

export function PersonalAccountPage() {
  return (
    <div className="min-h-dvh w-full bg-[#f6f3fb] text-[#1e1530]">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </div>
  );
}
