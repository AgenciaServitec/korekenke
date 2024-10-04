export const config: Config = {
  common: {
    "node-mailer": {
      port: 465,
      host: "smtp.gmail.com",
      from: "Korekenke App",
      user: "servitecperu266@gmail.com",
      pass: "aghv nygl mzqo gqud",
    },
  },
  development: {
    version: "0.0.1",
    hosting: {
      domain: "https://korekenke-dev.web.app/",
      apiUrl: "https://korekenke-dev.web.app/api",
    },
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "mariano260996@gmail.com",
      },
      sendMailerNotifyDasApplicant: {
        to: "mariano260996@gmail.com",
        bcc: "galafloresangelemilio@gmail.com",
      },
    },
    "apis-net-pe": {
      apiUrl: "https://api.apis.net.pe/v2",
      token: "apis-token-8290.s1Op-FA9ZArlfXq39wpzMuKiaXexehgs",
    },
  },
  production: {
    version: "0.0.1",
    hosting: {
      domain: "https://korekenke.mil.pe/",
      apiUrl: "https://korekenke.mil.pe/api",
    },
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "ti@korekenke.com",
      },
      sendMailerNotifyDasApplicant: {
        to: "juguar01@hotmail.com",
        bcc: "beto1perk@gmail.com",
      },
    },
    "apis-net-pe": {
      apiUrl: "https://api.apis.net.pe/v2",
      token: "apis-token-8290.s1Op-FA9ZArlfXq39wpzMuKiaXexehgs",
    },
  },
};
