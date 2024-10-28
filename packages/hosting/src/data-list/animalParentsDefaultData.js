import { v4 as uuidv4 } from "uuid";

const createAnimalParent = (
  id = uuidv4(),
  relationship,
  parents = [],
  isDefault = true,
  props,
) => {
  return {
    id: id,
    ...(isDefault && { isDefault: isDefault }),
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: relationship,
    parents: parents,
    ...props,
  };
};

export const animalParentsDefaultDataByFather = [
  {
    id: uuidv4(),
    isDefault: true,
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "father",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
    ],
  },
  {
    id: uuidv4(),
    isDefault: true,
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "mother",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
    ],
  },
];
export const animalParentsDefaultDataByMother = [
  {
    id: uuidv4(),
    isDefault: true,
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "father",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
    ],
  },
  {
    id: uuidv4(),
    isDefault: true,
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "mother",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", [], true),
          createAnimalParent(uuidv4(), "mother", [], true),
        ],
        true,
      ),
    ],
  },
];
