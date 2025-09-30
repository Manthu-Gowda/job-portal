import { useState, useEffect } from 'react';

const useTableHeight = (offset = 260) => {
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight - offset; 
      setTableHeight(availableHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [offset]);

  return tableHeight;
};

export default useTableHeight;