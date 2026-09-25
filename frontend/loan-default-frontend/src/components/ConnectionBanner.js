import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

function ConnectionBanner({ connected, connecting, onRetry }) {
  // Stay invisible when the backend is up — cleaner look for deployment.
  // Only warn when the API can't be reached.
  if (connected) {
    return null;
  }
  return (
    <div className="connection-banner offline">
      <FaExclamationTriangle />
      <span>
        {connecting
          ? "Connecting to backend automatically…"
          : "Backend unreachable — start FastAPI on :8000, then retry."}
      </span>
      <button onClick={onRetry}>
        <FaRedo style={{ marginRight: 5 }} />
        Retry
      </button>
    </div>
  );
}

export default ConnectionBanner;
