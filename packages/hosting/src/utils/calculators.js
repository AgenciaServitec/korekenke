import dayjs from "dayjs";

export const calcAges = (birthdate) => {
  const years = dayjs().diff(
    dayjs(dayjs(birthdate, "DD/MM/YYYY HH:mm")),
    "years",
  );

  const months =
    dayjs().diff(dayjs(birthdate, "DD/MM/YYYY HH:mm"), "months") % 12;

  return {
    years: years,
    months: months,
  };
};
