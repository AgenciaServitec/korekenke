export const config: Config = {
  common: {
    "node-mailer": {
      port: 465,
      host: "smtp.gmail.com",
      from: "Korekenke App",
      user: "noreply@korekenke.pe",
      pass: "mbnpgrdavwtxkljc",
    },
  },
  development: {
    version: "0.0.1",
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "mariano260996@gmail.com",
      },
    },
    "apis-net-pe": {
      apiUrl: "https://api.apis.net.pe/v2",
      token: "apis-token-8290.s1Op-FA9ZArlfXq39wpzMuKiaXexehgs",
    },
  },
  production: {
    version: "0.0.1",
    mailer: {
      sendMailNotifyKorekenkeError: {
        to: "ti@korekenke.com",
      },
    },
    "apis-net-pe": {
      apiUrl: "https://api.apis.net.pe/v2",
      token: "apis-token-8290.s1Op-FA9ZArlfXq39wpzMuKiaXexehgs",
    },
  },
};
