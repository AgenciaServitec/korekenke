export * from "./login";
export * from "./register";
export * from "./home";
export * from "./profile";

//ADMINISTRATION
export * from "./administration/users";
export * from "./administration/users/_userId";
export * from "./administration/entities";
export * from "./administration/entities/_entity";
export * from "./administration/units";
export * from "./administration/units/_unitId";
export * from "./administration/departments";
export * from "./administration/departments/_department";
export * from "./administration/offices";
export * from "./administration/offices/_officeId";
export * from "./administration/sections";
export * from "./administration/sections/_section";

//ACCESS CONTROL
export * from "./access-control/default-roles-acls";
export * from "./access-control/default-roles-acls/_roleAclsId";
export * from "./access-control/manage-acls";

//CORRESPONDENCES "PUBLIC"
export * from "./correspondences";
export * from "./correspondences/_correspondence";
export * from "./correspondences/_correspondence/decree/sheets";

//SURVEYS "PUBLIC"
export * from "./surveys/organizational-climate-studies";
export * from "./surveys/organizational-climate-studies/_organizationalClimateStudyId";
export * from "./surveys/organizational-climate-studies/sheets";
export * from "./military-service-recruitment";
export * from "./military-service-recruitment/_militaryServiceRecruitmentId";
export * from "./holiday-request";

//ENTITIES "departamento-de-apoyo-social"
export * from "./entities/departamento-de-apoyo-social/das-requests/_dasRequestId";
export * from "./entities/departamento-de-apoyo-social/das-requests/sheets";

//ENTITIES "jefatura-de-bienestar-del-ejercito"
export * from "./entities/jefatura-de-bienestar-del-ejercito/inscriptions";

//ENTITIES "servicio-de-veterinaria-y-remonta-del-ejercito"
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/_animalId";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/sheets";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/clinic-history";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/clinic-history/sheets";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/animal-magazine-profiles";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/animal-magazine-profiles/_animalMagazineProfileId";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/animal-magazine-profiles/sheets";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animal-logs";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animal-logs/sheets";
export * from "./entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals/family-tree";

//ENTITIES "departamento-de-apoyo-social"
export * from "./entities/departamento-de-apoyo-social/das-requests";
export * from "./entities/departamento-de-apoyo-social/das-requests/_dasRequestId";

//PRIVACY POLICIES
export * from "./privacy-policies";
