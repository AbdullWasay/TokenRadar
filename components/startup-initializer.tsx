'use client';

import { useEffect, useState } from 'react';

export default function StartupInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Token Radar...');
        
        const response = await fetch('/api/startup', {
          method: 'GET',
          cache: 'no-store'
        });

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Token Radar initialized successfully');
          setInitialized(true);
        } else {
          console.error('❌ Token Radar initialization failed:', data.message);
          setError(data.message);
        }
      } catch (error) {
        console.error('❌ Failed to initialize Token Radar:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    // Initialize on component mount
    initializeApp();
  }, []);

  // This component doesn't render anything visible
  return null;
}
