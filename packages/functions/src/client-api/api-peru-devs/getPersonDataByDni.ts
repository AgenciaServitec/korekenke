import { get } from "./fetchApi";
import { environmentConfig } from "../../config";
import { logger } from "../../utils";
type Response = Person;

interface Props {
  dni: string;
}

interface PersonData {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  fullName: string;
  gender: string;
  birthdate: string;
  verificationCode: string;
}

const { token } = environmentConfig["api-peru-devs"];

export const getPersonDataByDni = async ({
  dni,
}: Props): Promise<PersonData> => {
  const { data } = await get<Response>(
    `/dni/complete?document=${dni}&key=${token}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const dataJson = { ...data };

  logger.log("dataJson: ", dataJson);

  return mapPerson(data.resultado);
};

const mapPerson = (resultado: Person["resultado"]): PersonData => ({
  firstName: resultado.nombres,
  paternalSurname: resultado.apellido_paterno,
  maternalSurname: resultado.apellido_materno,
  fullName: resultado.nombre_completo,
  gender: resultado.genero,
  birthdate: resultado.fecha_nacimiento,
  verificationCode: resultado.codigo_verificacion,
});
