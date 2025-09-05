import { useGetData } from "@/hooks/fetch";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type AppContextType = {
    handleGetData: (payload?: any) => void;
    data: any;
    isLoading: boolean;
    error: any;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { mutate: getData, isPending, error } = useGetData();
    const [data, setData] = useState<any>(null);

    const handleGetData = useCallback((payload?: any) => {
        getData(payload, {
            onSuccess: (responseData) => {
                console.log('Data fetched successfully:', responseData);
                setData(responseData); // Update the context state
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
                setData(null); // Clear data on error
            },
        });
    }, [getData]);

    return (
        <AppContext.Provider
            value={{
                handleGetData,
                data,
                isLoading: isPending,
                error
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