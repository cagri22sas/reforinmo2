import { useState, useEffect } from "react";

// Hook to manage guest session ID for cart tracking with 30-day expiry
export function useGuestSession() {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    // Get or create guest session ID
    let existingSessionId = localStorage.getItem("guestSessionId");
    const sessionTimestamp = localStorage.getItem("guestSessionTimestamp");
    
    const isExpired = sessionTimestamp 
      ? Date.now() - parseInt(sessionTimestamp) > SESSION_DURATION_MS 
      : true;
    
    if (!existingSessionId || isExpired) {
      // Create new session ID
      existingSessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("guestSessionId", existingSessionId);
      localStorage.setItem("guestSessionTimestamp", Date.now().toString());
    }
    
    setSessionId(existingSessionId);
  }, []);

  return sessionId;
}
