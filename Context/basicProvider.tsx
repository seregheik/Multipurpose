//basicProvider
import { useGetData } from "@/hooks/fetch";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

type AppContextType = {
    handleGetData: (payload?: any) => void;
    data: any;
    isLoading: boolean;
    error: any;
    isInitialLoading: boolean;
    setIsInitialLoading: (loading: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { mutate: getData, isPending, error } = useGetData();
    const [data, setData] = useState<any>(null);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false); // Start as false
    const [hasStartedLoading, setHasStartedLoading] = useState<boolean>(false);

    const handleGetData = useCallback((payload?: any) => {
        // Set initial loading to true only on the very first call
        if (!hasStartedLoading) {
            setIsInitialLoading(true);
            setHasStartedLoading(true);
        }

        getData(payload, {
            onSuccess: (responseData) => {
                console.log('Data fetched successfully:', responseData);
                setData(responseData);
                setIsInitialLoading(false); // Hide loading screen on success
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
                setData(null);
                setIsInitialLoading(false); // Hide loading screen on error too
            },
        });
    }, [getData, hasStartedLoading]);

    // Safety timeout - if loading takes too long, hide the loading screen
    useEffect(() => {
        if (isInitialLoading) {
            const timeout = setTimeout(() => {
                console.warn('Loading timeout reached, hiding loading screen');
                setIsInitialLoading(false);
            }, 10000); // 10 second timeout

            return () => clearTimeout(timeout);
        }
    }, [isInitialLoading]);

    return (
        <AppContext.Provider
            value={{
                handleGetData,
                data,
                isLoading: isPending,
                error,
                isInitialLoading,
                setIsInitialLoading
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppProvider = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppProvider must be used within an AppProvider");
    }
    return context;
};