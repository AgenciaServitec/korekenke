import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiVerifyEmailVerifyCodePost = () => {
  const { post, loading, response } = useApi("/verify-email/verify-code");

  const postVerifyEmailVerifyCode = useCallback(
    async (userId, verifyCode) => {
      return post("/", { userId, verifyCode });
    },
    [post],
  );

  return {
    postVerifyEmailVerifyCode,
    postVerifyEmailVerifyCodeLoading: loading,
    postVerifyEmailVerifyCodeResponse: response,
  };
};
