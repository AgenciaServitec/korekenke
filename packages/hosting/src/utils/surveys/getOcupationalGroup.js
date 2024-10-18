import { Surveys } from "../../data-list";

export const getOcupationalGroup = (code, value) => {
  const questionOptions =
    Surveys.questions.find((question) => question.code === code)?.options || [];

  const options = questionOptions.flatMap((option) => option.options) || [];

  return options.find((option) => option.value === value)?.label;
};
