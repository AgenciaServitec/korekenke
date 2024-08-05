import { addAnimalLog } from "../firebase/collections";
import { getAnimalEntitiesAndBosses } from "../utils";

export const useAnimalLogs = () => {
  const onSetAnimalLog = async ({ animal, formData }) => {
    // Add animal history
    if (!animal?.status || animal?.status === "registered") {
      const result = await getAnimalEntitiesAndBosses(animal);

      // Se usa el mismo id de animal, para realizar solo 1 copia por cada animal
      await addAnimalLog({
        id: animal.id,
        animalId: animal.id,
        ...formData,
        ...result,
      });
    }
  };

  return {
    onSetAnimalLog,
  };
};
