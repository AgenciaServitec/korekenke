import { logger } from "../utils";
import type { OnSchedule } from "./interface";
import { fetchUsers, updateUser } from "../_firebase/collections";
import assert from "assert";
import moment from "moment";

export const onScheduleResetVacationDaysForAllUsers: OnSchedule = async () => {
  try {
    await onResetHolidaysDays();
  } catch (e) {
    logger.error("Error onScheduleResetVacationDaysForAllUsers: ", e);
  }
};

const onResetHolidaysDays = async (): Promise<void> => {
  const users = await fetchUsers();
  assert(users, "Missing users!");

  const today = moment().format("MM-DD");

  if (today === "12-31") {
    users.map(async (user) => {
      await updateUser(user.id, { vacationDays: 0 });
    });
    logger.log("Users Updated");
  } else {
    logger.log("Don't Updated");
  }
};
