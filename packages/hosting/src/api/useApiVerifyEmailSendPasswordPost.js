import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiVerifyEmailSendPasswordPost = () => {
  const { post, loading, response } = useApi("/verify-email/send-password");

  const postVerifyEmailSendPassword = useCallback(
    async (userId) => {
      return post("/", { userId });
    },
    [post],
  );

  return {
    postVerifyEmailSendPassword,
    postVerifyEmailSendPasswordLoading: loading,
    postVerifyEmailSendPasswordResponse: response,
  };
};
