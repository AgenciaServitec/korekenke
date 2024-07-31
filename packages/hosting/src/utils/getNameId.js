import { kebabCase, toLower } from "lodash";

export const getNameId = (name) => {
  const nameWithoutAccents = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const nameWithoutSpecialCharacters = nameWithoutAccents.replace(
    /[^a-zA-Z 0-9.]+/g,
    "",
  );

  return toLower(kebabCase(nameWithoutSpecialCharacters).trim());
};
