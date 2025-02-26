import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiUpdateAssistancePut = () => {
  const { post, loading, response } = useApi("/assistances/update");

  const putUpdateAssistance = useCallback(
    async (assistance) => {
      return post("/", assistance);
    },
    [post],
  );

  return {
    putUpdateAssistance: putUpdateAssistance,
    putUpdateAssistanceLoading: loading,
    putUpdateAssistanceResponse: response,
  };
};
