import { Surveys } from "../../data-list";

export const getQuestionValue = (code, value) =>
  Surveys.questions
    .find((question) => question.code === code)
    ?.options.find((option) => option.value === value)?.label;
