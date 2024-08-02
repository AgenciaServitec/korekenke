import { useCallback } from "react";
import { useApi } from "./useApi";

// interface Return {
//   postUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   postUserLoading: boolean;
//   postUserResponse: Res<string>;
// }

export const useApiCorrespondencePost = () => {
  const { post, loading, response } = useApi("/correspondence");

  const postCorrespondence = useCallback(
    async (correspondence) => {
      return post("/", correspondence);
    },
    [post],
  );

  return {
    postCorrespondence: postCorrespondence,
    postCorrespondenceLoading: loading,
    postCorrespondenceResponse: response,
  };
};
