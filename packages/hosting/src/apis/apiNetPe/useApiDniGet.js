import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   getSearch: () => Promise<unknown>;
//   getSearchLoading: boolean;
//   getSearchResponse: Res<string>;
// }

export const useApiDniGet = () => {
  const { loading, get, response } = useApi("/");

  const getDni = useCallback(
    async (dni = "") => {
      return await get(`dni?numero=${dni}`);
    },
    [get]
  );

  return {
    getDni,
    getDniLoading: loading,
    getDniResponse: response,
  };
};
