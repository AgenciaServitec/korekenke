import {
  BodyConditionHorse1,
  BodyConditionHorse2,
  BodyConditionHorse3,
  BodyConditionHorse4,
  BodyConditionHorse5,
  BodyConditionHorse6,
  BodyConditionHorse7,
  BodyConditionHorse8,
  BodyConditionHorse9,
  BodyConditionCanine1,
  BodyConditionCanine2,
  BodyConditionCanine3,
  BodyConditionCanine4,
  BodyConditionCanine5,
  BodyConditionCattle1,
  BodyConditionCattle2,
  BodyConditionCattle3,
  BodyConditionCattle4,
  BodyConditionCattle5,
  CaninesPaws,
  CattlePaws,
  HerradoImg,
  ToilleteCanineImg,
  ToilleteCattleImg,
  ToilleteImg,
} from "../images";

export const AnimalMagazineProfiles = {
  equine: {
    bodyCondition: [
      {
        id: 1,
        name: "Pobre o extremadamente flaco",
        img: BodyConditionHorse1,
      },
      {
        id: 2,
        name: "Muy flaco",
        img: BodyConditionHorse2,
      },
      {
        id: 3,
        name: "Flaco",
        img: BodyConditionHorse3,
      },
      {
        id: 4,
        name: "Moderadamente flaco",
        img: BodyConditionHorse4,
      },
      {
        id: 5,
        name: "Moderado",
        img: BodyConditionHorse5,
      },
      {
        id: 6,
        name: "Moderadamente encarnado",
        img: BodyConditionHorse6,
      },
      {
        id: 7,
        name: "Encarnado",
        img: BodyConditionHorse7,
      },
      {
        id: 8,
        name: "Obeso",
        img: BodyConditionHorse8,
      },
      {
        id: 9,
        name: "Extremadamente obeso",
        img: BodyConditionHorse9,
      },
    ],
    toillete: {
      image: ToilleteImg,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
    paws: {
      image: HerradoImg,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
  },
  cattle: {
    bodyCondition: [
      {
        id: 1,
        name: "Extremadamente delgado",
        img: BodyConditionCattle1,
      },
      {
        id: 2,
        name: "Delgado",
        img: BodyConditionCattle2,
      },
      {
        id: 3,
        name: "Magro",
        img: BodyConditionCattle3,
      },
      {
        id: 4,
        name: "Gordo",
        img: BodyConditionCattle4,
      },
      {
        id: 5,
        name: "Extremadamente Gordo",
        img: BodyConditionCattle5,
      },
    ],
    toillete: {
      image: ToilleteCattleImg,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
    paws: {
      image: CattlePaws,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
  },
  canine: {
    bodyCondition: [
      {
        id: 1,
        name: "Excesivamente delgado",
        img: BodyConditionCanine1,
      },
      {
        id: 2,
        name: "Delgado",
        img: BodyConditionCanine2,
      },
      {
        id: 3,
        name: "Peso ideal",
        img: BodyConditionCanine3,
      },
      {
        id: 4,
        name: "Sobrepeso",
        img: BodyConditionCanine4,
      },
      {
        id: 5,
        name: "Sobrepeso extremo",
        img: BodyConditionCanine5,
      },
    ],
    toillete: {
      image: ToilleteCanineImg,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
    paws: {
      image: CaninesPaws,
      items: [
        { id: 1, name: "Muy bueno" },
        { id: 2, name: "Bueno" },
        { id: 3, name: "Regular" },
        { id: 4, name: "Malo" },
      ],
    },
  },
};
