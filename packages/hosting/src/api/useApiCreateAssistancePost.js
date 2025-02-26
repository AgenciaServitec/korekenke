import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiCreateAssistancePost = () => {
  const { post, loading, response } = useApi("/assistances/create");

  const postCreateAssistance = useCallback(
    async (assistance) => {
      return post("/", assistance);
    },
    [post],
  );

  return {
    postCreateAssistance: postCreateAssistance,
    postCreateAssistanceLoading: loading,
    postCreateAssistanceResponse: response,
  };
};
