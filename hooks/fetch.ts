import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/api/functions/endpoints";

export const useGetData = () => {
    return useMutation({
        mutationFn: async (payload?: any) => {
            // Pass payload to the endpoint function
            return endpoints.getData(payload);
        }
    });
};
