import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiFetchAssistancesGet = () => {
  const { loading, get, response } = useApi("/assistances");

  const getFetchAssistances = useCallback(async () => {
    return await get("/");
  }, [get]);

  return {
    getFetchAssistances,
    getFetchAssistancesLoading: loading,
    getFetchAssistancesResponse: response,
  };
};
