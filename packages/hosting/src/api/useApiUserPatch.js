import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   patchUser: (user: User & { updateBy: string }) => Promise<unknown>;
//   patchUserLoading: boolean;
//   patchUserResponse: Res<string>;
// }

export const useApiUserPatch = () => {
  const { loading, patch, response } = useApi("/users");

  const patchUser = useCallback(
    async (user) => {
      const url = `/${user.id}`;

      return patch(url, user);
    },
    [patch]
  );

  return {
    patchUser,
    patchUserLoading: loading,
    patchUserResponse: response,
  };
};
