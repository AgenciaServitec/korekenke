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
        bcc: "galafloresangelemilio@gmail.com",
      },
      sendMailerNotifyDasApplicant: {
        to: "mariano260996@gmail.com",
        bcc: "galafloresangelemilio@gmail.com",
      },
    },
    "api-peru-devs": {
      apiUrl: "https://api.perudevs.com/api/v1",
      token:
        "cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjcwMDVlOTI5ZmE0MTczZjYxMzIwM2M3",
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
        to: "mariano260996@gmail.com",
        bcc: "galafloresangelemilio@gmail.com",
      },
      sendMailerNotifyDasApplicant: {
        to: "juguar01@hotmail.com",
        bcc: "beto1perk@gmail.com, mariano260996@gmail.com",
      },
    },
    "api-peru-devs": {
      apiUrl: "https://api.perudevs.com/api/v1",
      token:
        "cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjcwMDVlOTI5ZmE0MTczZjYxMzIwM2M3",
    },
  },
};
