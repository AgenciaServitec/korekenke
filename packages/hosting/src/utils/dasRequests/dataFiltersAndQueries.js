import { DasRequestList } from "../../data-list";

export const findDasRequest = (dasRequestId) =>
  DasRequestList.find((dasRequest) => dasRequest.id === dasRequestId);
