import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * shadcn's Button, rethemed onto the print shop.
 *
 * The kit already owns what a button looks like — `.btn` carries the 3px ink
 * border, the hard offset shadow, the lift on hover and focus, and the press
 * on active — so the variants compose those classes instead of restating them
 * in Tailwind. What stays from shadcn is the part worth having: the slot
 * behaviour, the size scale, the disabled and svg handling.
 *
 * Deliberately absent: `rounded-*` (rule 1 allows no radius) and shadcn's
 * `outline-none` + `ring-*` focus pair. Those two go together — upstream
 * suppresses the outline because a ring replaces it. The kit prints its
 * keyline as an outline against the border instead (see DESIGN.md under
 * Colour), so keeping `outline-none` without the ring would leave every
 * button with no visible keyboard focus at all.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* The primary action: the ink fill. */
        default: "btn btn-solid",
        /* A paper block on the ground — `.btn`'s own resting state. */
        outline: "btn",
        secondary: "btn",
        /* The kit's other action primitive: a quiet 2px mark, for controls
           that travel beside a label rather than carry a page. */
        chip: "chip",
        /* No block at all: a mark that only fills on approach. */
        ghost:
          "btn border-transparent bg-transparent shadow-none hover:bg-accent hover:shadow-none active:translate-none",
        link: "btn border-transparent bg-transparent shadow-none underline-offset-4 hover:underline hover:shadow-none",
        destructive: "btn bg-destructive text-destructive-foreground",
      },
      size: {
        /* Empty: `.btn` sets the kit's own padding and type size. */
        default: "",
        sm: "px-3 py-2 text-[0.8125rem]",
        lg: "px-6 py-3.5 text-base",
        icon: "size-11 gap-0 p-0",
        "icon-sm": "size-9 gap-0 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
