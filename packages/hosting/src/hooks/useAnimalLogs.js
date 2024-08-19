import { addAnimalLog, getAnimalLogId } from "../firebase/collections";
import { getAnimalEntitiesAndBosses } from "../utils";
import { useDefaultFirestoreProps } from "./useDefaultFirestoreProps";

export const useAnimalLogs = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();

  const onSetAnimalLog = async ({ animal, formData }) => {
    const result = await getAnimalEntitiesAndBosses(animal);

    const animalLog = getAnimalLogId();

    // Se crea un copia cada que se actualizar por el motivo de los jefes que paran cambiando en los grupos o puede que no aya jefes
    await addAnimalLog(
      assignCreateProps({
        animalId: animal.id,
        ...formData,
        ...result,
        id: animalLog,
      })
    );
  };

  return {
    onSetAnimalLog,
  };
};
