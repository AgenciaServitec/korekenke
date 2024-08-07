import { acls } from "../data-list";
import { includes, isEmpty } from "lodash";

export const filterAcl = (category, subCategory, except = []) =>
  Object.fromEntries(
    Object.entries(acls[category][subCategory]).filter(([acl]) =>
      except ? !includes(except, acl) : true,
    ),
  );

export const filterAclExact = (category, subCategory, filter) =>
  Object.fromEntries(
    Object.entries(acls[category][subCategory]).filter(
      ([acl]) => acl === filter,
    ),
  );

export const removeLabelFieldOfObject = (object = {}, field = "label") => {
  if (typeof object !== "object" || object === null) return object;

  for (let clave in object) {
    if (clave === field) {
      delete object[clave];
    } else {
      object[clave] = removeLabelFieldOfObject(object[clave], field);
    }
  }

  return object;
};

export const mapAcls = (acls = {}) => {
  Object.entries(acls).forEach(([key, subCategories = {}]) => {
    acls[key] = subCategories;
    Object.entries(subCategories).forEach(([_key, values = []]) => {
      acls[key][_key] = values;
    });
  });

  return acls;
};

const filterMapAcl = (acls = [], except = []) =>
  acls.filter((acl) => (except ? !includes(except, acl) : true));

const filterMapAclExact = (acls = [], filter) =>
  acls.filter((acl) => acl === filter);
