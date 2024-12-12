// Context.js
import { createContext, useContext, useState } from 'react';

const SelectPositionContext = createContext();

export const SelectPositionProvider = ({ children }) => {
  const [selectPosition, setSelectPosition] = useState(null);
  return (
    <SelectPositionContext.Provider value={{ selectPosition, setSelectPosition }}>
      {children}
    </SelectPositionContext.Provider>
  );
};

export const useSelectPosition = () => useContext(SelectPositionContext);