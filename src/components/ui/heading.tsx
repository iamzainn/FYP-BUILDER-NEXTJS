import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function Heading({
  title,
  description,
  className,
  ...props
}: HeadingProps) {
  return (
    <div className={cn("space-y-0.5", className)} {...props}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
} 