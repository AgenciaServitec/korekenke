import { useEffect } from "react";
import { get, isEmpty, isString, toNumber } from "lodash";

// interface Props<FormData extends ObjectType> {
//   errors?: FieldErrors<FormData>;
//   schema: yup.AnyObjectSchema;
// }
//
// type Tests = { name: string; params: Record<string, unknown> }[];
//
// interface Return<FormData extends ObjectType> {
//   required: (name: string) => boolean;
//   error: (name: string) => boolean;
//   errorMessage: (name: string) => string | undefined;
//   errorDetail: (name: string) => FieldErrors<FormData>[string];
//   eventInputNumber: (e: React.ChangeEvent<HTMLInputElement>) => number | null;
//   eventCheckbox: (e: CheckboxChangeEvent) => boolean;
// }

export const useFormUtils = ({ errors, schema }) => {
  useEffect(() => {
    !isEmpty(errors) && scrollIntoError();
  }, [errors]);

  const scrollIntoError = () => {
    const formItemErrors = document.getElementsByClassName(
      "scroll-error-anchor"
    );

    formItemErrors.length &&
      formItemErrors[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const eventInputNumber = (e) => {
    const { value } = e.target;

    if (toNumber(value) < 0) {
      const removeSymbol = value.slice(1);

      return toNumber(removeSymbol);
    }

    return value ? toNumber(value) : null;
  };

  const errorDetail = (name) => errors && errors[name];

  const errorMessage = (name) => {
    const message = errors && errors[name]?.message;

    return isString(message) ? message : undefined;
  };

  const error = (name) => !!(errors && get(errors, name, false));

  const required = (name) => {
    const describe = schema.describe();

    const describePath = [];

    name.split(".").forEach((fieldName) => {
      describePath.push("fields");
      describePath.push(fieldName);
    });

    describePath.push("tests");

    const tests = get(describe, describePath, []);

    return tests.some((test) => test.name === "required");
  };

  const eventCheckbox = (e) => e.target.checked;

  return {
    error,
    errorMessage,
    errorDetail,
    required,
    eventInputNumber,
    eventCheckbox,
  };
};
