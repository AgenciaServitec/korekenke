import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   getSearch: () => Promise<unknown>;
//   getSearchLoading: boolean;
//   getSearchResponse: Res<string>;
// }

export const useApiPersonDataByDniGet = () => {
  const { loading, get, response } = useApi("/entities/dni");

  const getPersonDataByDni = useCallback(
    async (dni = "") => {
      return await get(dni);
    },
    [get]
  );

  return {
    getPersonDataByDni,
    getPersonDataByDniLoading: loading,
    getPersonDataByDniResponse: response,
  };
};
