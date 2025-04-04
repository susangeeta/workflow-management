import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-bg-grey-200 data-[state=checked]:bg-[#1e56f5] data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary-2-500 focus-visible:border-primary-2-500 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[8px] border transition-shadow data-[state=checked]:outline-1 checked:outline-offset-1 outline-primary-2-600 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 w-6 h-6",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-surface-white transition-none"
      >
        <svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1L3.5 6.5L1 4"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
