import * as React from "react";
import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  HTMLFieldSetElement,
  React.HTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn(
      "inline-flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
      className,
    )}
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
