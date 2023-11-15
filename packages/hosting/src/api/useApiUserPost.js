import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   postUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   postUserLoading: boolean;
//   postUserResponse: Res<string>;
// }

export const useApiUserPost = () => {
  const { post, loading, response } = useApi("/users");

  const postUser = useCallback(
    async (user) => {
      const url = `/${user.id}`;

      return post(url, user);
    },
    [post]
  );

  return {
    postUser,
    postUserLoading: loading,
    postUserResponse: response,
  };
};
