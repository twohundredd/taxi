import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return useCallback(() => setValue(v => v + 1), []);
};