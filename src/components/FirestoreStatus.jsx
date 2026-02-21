import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function FirestoreStatus() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Checking Firestore setup...");

  useEffect(() => {
    // Check browser console for Firebase errors
    const checkStatus = () => {
      const hasTransactionCache = Object.keys(localStorage).some(key => 
        key.startsWith('transactions_')
      );
      const hasInvestmentCache = Object.keys(localStorage).some(key => 
        key.startsWith('investments_')
      );

      if (hasTransactionCache || hasInvestmentCache) {
        setStatus("ok");
        setMessage("✅ Data is being cached locally (works fine!)");
      } else {
        setStatus("warning");
        setMessage("⚠️ No local cache yet. Add some transactions to test.");
      }
    };

    setTimeout(checkStatus, 2000);
  }, []);

  if (status === "checking") {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-900/80 border border-blue-500 rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-sm text-blue-200">{message}</span>
        </div>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="fixed bottom-4 right-4 bg-green-900/80 border border-green-500 rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-200">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-900/80 border border-yellow-500 rounded-lg p-4 max-w-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-yellow-200 font-semibold">{message}</p>
          <p className="text-xs text-yellow-300 mt-1">
            Check browser console (F12) for any Firebase errors
          </p>
        </div>
      </div>
    </div>
  );
}
