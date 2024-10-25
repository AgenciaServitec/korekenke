import { v4 as uuidv4 } from "uuid";

const createAnimalParent = (relationship, parents = [], props) => {
  return {
    id: uuidv4(),
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: relationship,
    parents: parents,
    ...props,
  };
};

export const animalParentsDefaultData = [
  {
    id: uuidv4(),
    type: "default",
    fullName: "",
    registrationNumber: "",
    raceOrLine: "",
    relationship: "father",
    parents: [
      createAnimalParent("father", [
        createAnimalParent("father", []),
        createAnimalParent("mother", []),
      ]),
      createAnimalParent("mother", [
        createAnimalParent("father", []),
        createAnimalParent("mother", []),
      ]),
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
      createAnimalParent("father", [
        createAnimalParent("father", []),
        createAnimalParent("mother", []),
      ]),
      createAnimalParent("mother", [
        createAnimalParent("father", []),
        createAnimalParent("mother", []),
      ]),
    ],
  },
];
