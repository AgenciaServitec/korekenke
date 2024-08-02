import { toString, uniq } from "lodash";

export const searchify = (texts) =>
  uniq(texts)
    .map((text) =>
      toString(text)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
    )
    .filter((text) => text);
