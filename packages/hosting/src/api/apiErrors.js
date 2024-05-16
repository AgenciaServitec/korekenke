import { notification } from "../components";
import { isObject } from "lodash";
import apiErrors from "../config/apiErros.json";

export const getApiErrorResponse = (response) => {
  try {
    if (isResponse(response)) {
      try {
        console.error(response);
        return response.message;
      } catch (e) {
        console.error(e);
        return response;
      }
    }
  } catch (e) {
    console.error(e);
    return response;
  }
};

export const apiErrorNotification = (response) =>
  response ? notificationApiError(response) : notification({ type: "error" });

const notificationApiError = (key) => {
  notification({
    type: "warning",
    title: apiErrors?.[key]
      ? apiErrors?.[key]?.title
      : apiErrors["default"].title,
    description: apiErrors?.[key]
      ? apiErrors?.[key]?.description
      : apiErrors["default"].description,
  });
};

export const isResponse = (data) => isObject(data) && "message" in data;
