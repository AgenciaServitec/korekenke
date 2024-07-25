import React, { useEffect, useState } from "react";
import localizedFormat from "dayjs/plugin/localizedFormat";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import { setLocale } from "yup";
import { yup } from "../config";
import * as dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import es from "dayjs/locale/es";

import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

export const ConfigsInitializer = ({ children }) => {
  const [locale] = useState(esES);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);
  dayjs.extend(customParseFormat);
  dayjs.extend(advancedFormat);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);

  useEffect(() => {
    setLocale(yup["es"]);

    dayjs.locale(es);
  }, []);

  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
};
