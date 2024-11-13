import React, { createContext, useContext, ReactNode } from 'react';
import useStoredState from './useStoredState';

// Define the context type
interface CursorContextType {
  cursors: { [key: string]: string };
  setCursor: (feedId: string, cursor: string) => void;
  getCursor: (feedId: string) => string | null;
}

// Create the CursorContext with default values
const CursorContext = createContext<CursorContextType>({
  cursors: {},
  setCursor: () => {},
  getCursor: () => null,
});

const CursorProvider = ({ children }: { children: ReactNode }) => {
  const { data: cursors, setDataKey: setCursor, getDataKey: getCursor } = useStoredState<{ [key: string]: string }>('cursors', {});

  return (
    <CursorContext.Provider value={{ cursors, setCursor, getCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

const useCursor = () => {
  return useContext(CursorContext);
};

export { CursorProvider, useCursor };
