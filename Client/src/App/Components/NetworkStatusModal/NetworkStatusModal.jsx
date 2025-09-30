import React, { useEffect, useState } from 'react';
import './NetworkStatusModal.scss'; 

const NetworkStatusModal = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="network-modal">
      <div className="network-modal-content">
        <h4>No Internet Connection</h4>
        <p>Please check your network settings and try again.</p>
      </div>
    </div>
  );
};

export default NetworkStatusModal;
