import { DasRequest, DegreesArmy } from "../data-list";
import { capitalize } from "lodash";

export const uniq = (strings: string[]): string[] =>
  strings.map((string) =>
    string
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  );

export const getFullName = (
  user: Headline | Familiar | undefined,
  direction = "obverse"
): string =>
  direction === "obverse"
    ? `${capitalize(user?.firstName)} ${capitalize(
        user?.paternalSurname
      )} ${capitalize(user?.maternalSurname)}`
    : direction === "reverse"
    ? `${capitalize(user?.paternalSurname)} ${capitalize(
        user?.maternalSurname
      )} ${capitalize(user?.firstName)}`
    : "";

export const getDegreesArmy = (degree: string | undefined) =>
  capitalize(
    DegreesArmy.flatMap((_degree) => _degree.options).find(
      (option) => option.value === degree
    )?.label || ""
  );

export const getRequestType = (requestType: string) =>
  DasRequest.find((_requestType) => _requestType.id === requestType)?.name;

export const getResponseType = (reponseType: string) =>
  reponseType === "positive" ? "Positivo" : "Negativo";
