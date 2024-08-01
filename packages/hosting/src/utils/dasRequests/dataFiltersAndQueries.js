import { DasRequestList, institutions, Relationships } from "../../data-list";

export const findDasRequest = (dasRequestId) =>
  DasRequestList.find((dasRequest) => dasRequest.id === dasRequestId);

export const findRelationShip = (familiar) =>
  Relationships[familiar?.relationship];

export const findInstitution = (institution) =>
  institutions[institution?.type].find(
    (_institution) => _institution.id === institution.id,
  );
