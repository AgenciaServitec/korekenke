import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import esES from "antd/es/locale/es_ES";
import { setLocale } from "yup";
import { yup } from "../config";
import { ConfigProvider } from "antd";

export const ConfigsInitializer = ({ children }) => {
  const [locale] = useState(esES);

  moment.updateLocale("es", {
    week: {
      dow: 1,
    },
  });

  useEffect(() => {
    setLocale(yup["es"]);

    moment.locale("es");
  }, []);

  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
};
