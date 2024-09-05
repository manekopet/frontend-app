import { get, isEmpty } from "lodash";
import { FieldErrors } from "react-hook-form";

export const convertErrors = (name: string, err?: FieldErrors) => {
  if (isEmpty(err)) return undefined;

  if (!name.includes(".")) return err?.[name];

  return get(err, name);
};
