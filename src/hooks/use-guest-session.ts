import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
      // Create new session ID with UUID for unpredictability
      existingSessionId = `guest-${uuidv4()}`;
      localStorage.setItem("guestSessionId", existingSessionId);
      localStorage.setItem("guestSessionTimestamp", Date.now().toString());
    }
    
    setSessionId(existingSessionId);
  }, []);

  return sessionId;
}
