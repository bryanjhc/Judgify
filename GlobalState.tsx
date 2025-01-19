import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
interface GlobalStateContextType {
    globalId: string | null; // Adjust the type based on your use case
    setGlobalId: (id: string | null) => void;
}

// Create the context with the appropriate type
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Create the provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [globalId, setGlobalId] = useState<string | null>(null); // Global state for ID

    return (
        <GlobalStateContext.Provider value={{ globalId, setGlobalId }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Custom hook for accessing the global state
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
