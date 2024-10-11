import { useApi } from "./useApi";
import { useCallback } from "react";

export const useAPiSendMailNotificationDasRequestPost = () => {
  const { post, loading, response } = useApi(
    "/emails/notification-das-request",
  );

  const postSendMailNotificationDasRequestPost = useCallback(
    async (dasRequestId) => {
      return post(dasRequestId);
    },
    [post],
  );

  return {
    postSendMailNotificationDasRequestPost,
    postSendMailNotificationDasRequestPostLoading: loading,
    postSendMailNotificationDasRequestPostResponse: response,
  };
};
