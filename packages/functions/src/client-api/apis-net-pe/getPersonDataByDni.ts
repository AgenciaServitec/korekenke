import { get } from "./fetchApi";
import { environmentConfig } from "../../config";

type Response = PersonData;

interface Props {
  dni: string;
}

const { token } = environmentConfig["apis-net-pe"];

export const getPersonDataByDni = async ({
  dni,
}: Props): Promise<PersonData> => {
  const { data } = await get<Response>(`/dni?numero=${dni}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  });

  return mapPersonData(data);
};

const mapPersonData = (personData: PersonData): PersonData => ({
  ...personData,
});
