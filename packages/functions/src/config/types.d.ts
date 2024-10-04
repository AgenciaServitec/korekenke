type EnvironmentConfig = ConfigCommon & ConfigEnvironment;

interface Config {
  common: ConfigCommon;
  development: ConfigEnvironment;
  production: ConfigEnvironment;
}

interface ConfigCommon {
  "node-mailer": NodeMailerConfig;
}

interface ConfigEnvironment {
  version: string;
  hosting: {
    domain: string;
    apiUrl: string;
  };
  mailer: MailerConfig;
  "apis-net-pe": ApisNetPeConfig;
}

interface NodeMailerConfig {
  port: number;
  host: string;
  from: string;
  user: string;
  pass: string;
}

interface MailerConfig {
  sendMailNotifyKorekenkeError: {
    to: string;
  };
  sendMailerNotifyDasApplicant: {
    to: string;
    bcc: string;
  };
}

interface ApisNetPeConfig {
  apiUrl: string;
  token: string;
}
