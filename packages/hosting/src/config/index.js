import { includes } from "lodash";
import config from "./configs.json";

export { default as yup } from "./yup.json";

const hostName = window.location.hostname;

const hostsProduction = ["admin-vida.web.app"];

export const currentEnvironment = includes(hostsProduction, hostName)
  ? "production"
  : "development";

export const common = config.common;
export const contactData = config.common.contactData;

export const currentConfig = config[currentEnvironment];
