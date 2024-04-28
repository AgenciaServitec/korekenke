import { config } from "./config";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "korekenke-prod" ? "production" : "development";

const isProduction = currentEnvironment === "production";

const environmentConfig: EnvironmentConfig = {
  ...config[currentEnvironment],
  ...config.common,
};

export { isProduction, environmentConfig, config };
