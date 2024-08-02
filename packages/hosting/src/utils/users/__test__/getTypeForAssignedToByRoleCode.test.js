import { getTypeForAssignedToByRoleCode } from "../getTypeForAssignedToByRoleCode";

describe("getTypeForAssignedToByRoleCode: with corrects roles", () => {
  test("user with roleCode: manager", () => {
    expect(getTypeForAssignedToByRoleCode("manager")).toEqual("entity");
  });

  test("user with roleCode: department_boss", () => {
    expect(getTypeForAssignedToByRoleCode("department_boss")).toEqual(
      "department"
    );
  });

  test("user with roleCode: section_boss", () => {
    expect(getTypeForAssignedToByRoleCode("section_boss")).toEqual("section");
  });

  test("user with roleCode: office_boss", () => {
    expect(getTypeForAssignedToByRoleCode("office_boss")).toEqual("office");
  });

  test("user with roleCode incorrect: department_boss_1312313", () => {
    expect(getTypeForAssignedToByRoleCode("department_boss_1312313")).toEqual(
      null
    );
  });
});
