import { useEffect } from 'react';

const INTERVAL_MS = 10 * 60 * 1000;

const useBackendAwake = () => {
  useEffect(() => {
    if (!import.meta.env.PROD) return;

    const awake = () => {
      fetch(`${import.meta.env.VITE_API_URL}/awake`).catch(() => {});
    };

    awake();
    const intervalId = setInterval(awake, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);
};

const Awake = () => {
  useBackendAwake();
  return null;
};

export default Awake;
