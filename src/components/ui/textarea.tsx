import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * shadcn's Textarea, rethemed onto the print shop.
 *
 * `.composer-field` in the kit already owns the box: the 3px ink border, the
 * hard offset shadow, the `--line-2` caret, and the press it performs when it
 * takes focus. What stays from shadcn is `field-sizing-content`, which grows
 * the box with what the reader types without a resize handle or a script.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "composer-field field-sizing-content w-full disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
