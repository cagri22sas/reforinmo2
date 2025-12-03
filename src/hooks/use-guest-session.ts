import { useState, useEffect } from "react";

// Hook to manage guest session ID for cart tracking
export function useGuestSession() {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Get or create guest session ID
    let existingSessionId = localStorage.getItem("guestSessionId");
    
    if (!existingSessionId) {
      // Create new session ID
      existingSessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("guestSessionId", existingSessionId);
    }
    
    setSessionId(existingSessionId);
  }, []);

  return sessionId;
}
