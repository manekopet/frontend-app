import { convertErrors } from "@/utils/errors";
import { NUMBER_REGEX } from "@/utils/regex";
import { Box, InputBase } from "@mui/material";
import React, { InputHTMLAttributes } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ErrorMessage } from "./InputForm.styled";

export type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  control: Control<any>;
  errors?: FieldErrors;
  required?: boolean;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showErrorMessage?: boolean;
  onlyNumber?: boolean;
};

const InputForm: React.FC<CustomInputProps> = ({
  name,
  control,
  required,
  onlyNumber,
  errors,
  onChangeInput,
  ...props
}) => {
  const errorMessage = convertErrors(name, errors)?.message as string;
  const parseValueNumber = (value: string) => {
    return (value || "").replace(NUMBER_REGEX, "");
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <Box sx={{ width: "100%" }}>
          <InputBase
            sx={{ width: "100%" }}
            className={props.className}
            ref={ref}
            onBlur={onBlur}
            placeholder={props.placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (onlyNumber) {
                const val = e.target.value;
                e.target.value = parseValueNumber(val);
              }
              onChange(e);
              onChangeInput?.(e);
            }}
            onKeyDown={(e) => {
              if (onlyNumber) {
                if (e.key === "e" || e.key === "-") {
                  e.preventDefault();
                }
              }
            }}
            value={props.type === "number" ? +value : value}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Box>
      )}
    />
  );
};
export default InputForm;
