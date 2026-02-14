import { useState, useEffect, useCallback } from "react";
import "./assets/styles/main.css";
import Header from "./components/Header";
import QRGenerator from "./components/QRGenerator";
import PricingModal from "./components/PricingModal";

function App() {
  const [userStatus, setUserStatus] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setUserStatus(data);
    } catch {
      // If API is unreachable (e.g. pure frontend preview), show free tier
      setUserStatus({ used: 0, plan: "free", credits: 0, canGenerate: true, freeRemaining: 1 });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleStatusChange = useCallback((newStatus) => {
    setUserStatus(newStatus);
  }, []);

  const handleLimitReached = useCallback(() => {
    setShowPricing(true);
  }, []);

  const handleSubscriptionSuccess = useCallback((newStatus) => {
    setUserStatus((prev) => ({ ...prev, ...newStatus }));
    setShowPricing(false);
  }, []);

  return (
    <>
      <Header
        userStatus={userStatus}
        loading={loadingStatus}
        onUpgrade={() => setShowPricing(true)}
      />
      <main>
        <QRGenerator
          userStatus={userStatus}
          onStatusChange={handleStatusChange}
          onLimitReached={handleLimitReached}
        />
      </main>

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </>
  );
}

export default App;
