import { notification } from "../components";
import { isObject } from "lodash";
import apiErrors from "../config/apiErros.json";

export const getApiErrorResponse = (response) => {
  try {
    if (isResponse(response)) {
      try {
        return response.message;
      } catch (e) {
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
  const titleDefault = apiErrors["default.title"];
  const descriptionDefault = apiErrors["default.description"];

  notification({
    type: "warning",
    title: apiErrors[key ? key : titleDefault]?.title,
    description: apiErrors[key ? key : descriptionDefault]?.description,
  });
};

export const isResponse = (data) => isObject(data) && "message" in data;
