import { v4 as uuidv4 } from "uuid";

const createAnimalParent = (
  id = uuidv4(),
  relationship,
  parents = [],
  type,
  props,
) => {
  return {
    id: id,
    ...(type && { type: type }),
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
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "father",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
    ],
  },
  {
    id: uuidv4(),
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "mother",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
    ],
  },
];
export const animalParentsDefaultDataByMother = [
  {
    id: uuidv4(),
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "father",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
    ],
  },
  {
    id: uuidv4(),
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "mother",
    parents: [
      createAnimalParent(
        uuidv4(),
        "father",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
      createAnimalParent(
        uuidv4(),
        "mother",
        [
          createAnimalParent(uuidv4(), "father", []),
          createAnimalParent(uuidv4(), "mother", []),
        ],
        "default",
      ),
    ],
  },
];
