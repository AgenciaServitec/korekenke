import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   getSearch: () => Promise<unknown>;
//   getSearchLoading: boolean;
//   getSearchResponse: Res<string>;
// }

export const useApiSearchGet = () => {
  const { loading, get, response } = useApi("/search");

  const getSearch = useCallback(async () => {
    return await get("/");
  }, [get]);

  return {
    getSearch,
    getSearchLoading: loading,
    getSearchResponse: response,
  };
};
