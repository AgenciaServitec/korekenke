import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   postUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   postUserLoading: boolean;
//   postUserResponse: Res<string>;
// }

export const useApiUserPost = () => {
  const { post, loading, response } = useApi("/user");

  const postUser = useCallback(
    async (user) => {
      return post("/", user);
    },
    [post],
  );

  return {
    postUser,
    postUserLoading: loading,
    postUserResponse: response,
  };
};
