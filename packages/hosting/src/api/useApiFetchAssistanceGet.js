import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiFetchAssistanceGet = () => {
  const { loading, get, response } = useApi("/assistances/");

  const getFetchAssistance = useCallback(
    async (assistanceId = "") => {
      return await get(assistanceId);
    },
    [get],
  );

  return {
    getFetchAssistance,
    getFetchAssistanceLoading: loading,
    getFetchAssistanceResponse: response,
  };
};
