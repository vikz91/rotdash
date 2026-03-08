import * as React from "react";
import { cn } from "@/lib/utils";

type ScrollableProps = React.ComponentProps<"div"> & {
  /** Direction of overflow. Default: y */
  direction?: "x" | "y" | "both";
};

/**
 * Scrollable container with custom auto-hide scrollbar.
 * Use for any overflow content that should have consistent scrollbar styling.
 */
function Scrollable({
  className,
  direction = "y",
  children,
  ...props
}: ScrollableProps) {
  const overflowClass =
    direction === "x"
      ? "overflow-x-auto overflow-y-hidden"
      : direction === "y"
        ? "overflow-y-auto overflow-x-hidden"
        : "overflow-auto";

  return (
    <div
      className={cn(
        "scrollbar-autohide",
        overflowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Scrollable };
