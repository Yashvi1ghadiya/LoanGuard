import React, { useState, useEffect, useCallback } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConnectionBanner from "./components/ConnectionBanner";
import MobileNav from "./components/MobileNav";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Insights from "./pages/Insights";
import Guide from "./pages/Guide";
import About from "./pages/About";

import { healthCheck } from "./services/api";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth > 768 : true)
  );
  const [apiConnected, setApiConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [history, setHistory] = useState([]);
  const [prefill, setPrefill] = useState(null);
  const [prefillNonce, setPrefillNonce] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  // Auto-connect to backend on launch, retry every 3s until reachable.
  const connect = useCallback(async () => {
    setConnecting(true);
    const data = await healthCheck();
    if (data) {
      setApiConnected(true);
      setConnecting(false);
      return true;
    }
    setApiConnected(false);
    setConnecting(false);
    return false;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const attempt = async () => {
      if (cancelled) return;
      const ok = await connect();
      if (!ok && !cancelled) {
        timer = setTimeout(attempt, 3000);
      }
    };
    attempt();

    const onFocus = () => { if (!cancelled) attempt(); };
    const onOnline = () => { if (!cancelled) attempt(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, [connect]);

  const goTo = (page) => {
    setActivePage(page);
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dashboard shortcut: carry quick applicant values into the full form.
  const handleQuickCheck = (partial) => {
    setPrefill({ ...partial });
    setPrefillNonce((n) => n + 1);
    goTo("prediction");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  };

  // Every successful prediction lands in the session timeline.
  const handlePredictionResult = (result, formData) => {
    setLastResult(result);
    setHistory((h) =>
      [
        {
          id: Date.now(),
          at: new Date().toISOString(),
          result,
          income: formData.Income,
          loanAmount: formData.LoanAmount,
          creditScore: formData.CreditScore
        },
        ...h
      ].slice(0, 10)
    );
    if (!apiConnected) {
      setApiConnected(true);
      connect();
    }
  };

  // Re-open a past result from the activity timeline.
  const viewResult = (result) => {
    setLastResult(result);
    goTo("prediction");
  };

  return (
    <div className="app-container">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <Sidebar
        activePage={activePage}
        setActivePage={goTo}
        sidebarOpen={sidebarOpen}
        apiConnected={apiConnected}
      />

      <div className={`main-content ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          apiConnected={apiConnected}
        />

        <ConnectionBanner
          connected={apiConnected}
          connecting={connecting}
          onRetry={connect}
        />

        <main className="page-content">
          {activePage === "dashboard" && (
            <div className="fade-up" key="dashboard">
              <Dashboard
                setActivePage={goTo}
                apiConnected={apiConnected}
                history={history}
                onSelectResult={viewResult}
                onQuickCheck={handleQuickCheck}
              />
            </div>
          )}

          {activePage === "prediction" && (
            <div className="fade-up" key={`prediction-${prefillNonce}`}>
              <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
                <span className="eyebrow sky">Risk checker</span>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.3px" }}>
                  Check your loan risk
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "8px 0 0" }}>
                  Fill in the form below — your verdict appears instantly.
                  {lastResult && history.length > 0 && " Latest session result shown in Recent activity."}
                </p>
              </div>
              <Prediction
                initialValues={prefill}
                onResult={handlePredictionResult}
              />
            </div>
          )}

          {activePage === "insights" && (
            <div className="fade-up" key="insights">
              <Insights setActivePage={goTo} />
            </div>
          )}

          {activePage === "guide" && (
            <div className="fade-up" key="guide">
              <Guide setActivePage={goTo} />
            </div>
          )}

          {activePage === "about" && (
            <div className="fade-up" key="about">
              <About />
            </div>
          )}
        </main>

        <Footer setActivePage={goTo} />
        <MobileNav activePage={activePage} setActivePage={goTo} />
      </div>
    </div>
  );
}

export default App;
