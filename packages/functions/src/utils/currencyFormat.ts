import { CurrencyCode } from "../globalTypes";

const currencies = {
  USD: {
    name: "Dollars",
    symbol: "$",
  },
  PEN: {
    name: "Soles",
    symbol: "S/",
  },
};

export const currencyFormat = (
  value: number,
  currencyCode: CurrencyCode
): string => {
  const sign = value < 0 ? "-" : "";

  const currency = currencies[currencyCode];

  const valueFormat = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
  }).format(Math.abs(value));

  return `${sign}${currency.symbol} ${valueFormat}`;
};
