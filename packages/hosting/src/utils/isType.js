import { isArray, isObject } from "lodash";

export const isType = (data, validation) => validation;

export const isObjectType = (data) => isObject(data) && !isArray(data);
