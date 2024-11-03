import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiVerifyEmailSendCodePost = () => {
  const { post, loading, response } = useApi("/verify-email/send-code");

  const postVerifyEmailSendCode = useCallback(
    async (userId) => {
      return post("/", { userId });
    },
    [post],
  );

  return {
    postVerifyEmailSendCode,
    postVerifyEmailSendCodeLoading: loading,
    postVerifyEmailSendCodeResponse: response,
  };
};
