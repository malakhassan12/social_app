"use client";

import {
  useState,
  useCallback,
  FC,
  ChangeEvent,
  TextareaHTMLAttributes,
} from "react";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { AlertCircle } from "lucide-react";

type ValidatedTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  wasSubmitted: boolean;
  errors?: string[];
  fieldSchema: z.ZodType<string>;
};

const ValidatedTextarea: FC<ValidatedTextareaProps> = ({
  name,
  wasSubmitted,
  errors,
  fieldSchema,
  placeholder,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const getErrors = useCallback(() => {
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      return [];
    }

    return result.error.issues.map((issue) => issue.message);
  }, [fieldSchema, value]);

  const clientErrors = touched || wasSubmitted ? getErrors() : [];

  const fieldErrors = errors?.length ? errors : clientErrors;
  const hasError = fieldErrors.length > 0;

  const shouldRenderErrors =
    fieldErrors.length > 0 &&
    (touched || wasSubmitted || Boolean(errors?.length));
  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Textarea
          id={name}
          name={name}
          value={!wasSubmitted ? "" : value}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`flex-1 h-20 max-h-20 sm:h-15 sm:max-h-15 rounded-xl 
            border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-900/50 
            focus:ring-2 focus:ring-green-400 focus:border-transparent 
            transition-all resize-none overflow-y-auto 
            text-sm sm:text-base 
            scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 
            scrollbar-track-transparent hover:scrollbar-thumb-gray-500 
            dark:hover:scrollbar-thumb-gray-500
            ${hasError ? "border-red-500 dark:border-red-500 focus:ring-red-400" : ""}
            ${!hasError && value.length > 0 ? "border-green-500 dark:border-green-500" : ""}`}
          placeholder={placeholder}
          {...props}
        />

        {/* Character Counter */}
        <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
          <span
            className={`font-medium ${value.length > 280 ? "text-red-500" : "text-green-400"}`}
          >
            {value.length}
          </span>
          {" / 280"}
        </div>

        {/* Error Icon */}
        {hasError && shouldRenderErrors && (
          <AlertCircle className="absolute top-3 right-3 h-4 w-4 text-red-500 animate-pulse" />
        )}

        {/* Success Icon */}
        {!hasError && value.length > 0 && touched && (
          <div className="absolute top-3 right-3 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Error Messages */}
      {shouldRenderErrors && (
        <div className="mt-1.5 space-y-0.5">
          {fieldErrors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-1.5 text-sm text-red-500 dark:text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ValidatedTextarea };
