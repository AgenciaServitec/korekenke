import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   putUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   putUserLoading: boolean;
//   putUserResponse: Res<string>;
// }

export const useApiUserPut = () => {
  const { put, loading, response } = useApi("/users");

  const putUser = useCallback(
    async (user) => {
      const url = `/${user.id}`;

      return put(url, user);
    },
    [put]
  );

  return {
    putUser,
    putUserLoading: loading,
    putUserResponse: response,
  };
};
