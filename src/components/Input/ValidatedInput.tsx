import { useState, useCallback, FC, ChangeEvent } from "react"
import { Input } from "../ui/input"


import { z } from "zod";

type ValidatedInputProps = {
  name: string;
  wasSubmitted: boolean;
  errors?: string[];
  fieldSchema: z.ZodType<string>;
};

const ValidatedInput : FC<ValidatedInputProps> = ({
  name,
  wasSubmitted,
  errors,
  fieldSchema,
  ...props
}) => {
  const [value, setValue] = useState("")
  const [touched, setTouched] = useState(false)

  const getErrors = useCallback(() => {
    const validationResult = fieldSchema.safeParse(value)
    return validationResult.success
      ? []
      : validationResult.error.flatten().formErrors
  }, [fieldSchema, value])

  const fieldErrors = errors || getErrors()
  const shouldRenderErrors = errors || wasSubmitted || touched

  const handleBlur = () => setTouched(true)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.currentTarget.value)

  return (
    <>
      <Input
        id={name}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        className={fieldErrors.length > 0 ? "border-red-500" : ""}
        {...props}
      />
      {shouldRenderErrors && (
        <span className="text-sm text-red-500">{fieldErrors}</span>
      )}
    </>
  )
}
export { ValidatedInput }
