import { useEffect } from 'react';

export const RTL = ({ children }) => {
  useEffect(() => {
    document.dir = 'rtl';
    document.documentElement.setAttribute('dir', 'rtl');
    
    return () => {
      document.dir = 'ltr';
      document.documentElement.setAttribute('dir', 'ltr');
    };
  }, []);

  return children;
};
