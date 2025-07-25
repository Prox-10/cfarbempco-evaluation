import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export function StarRating({ 
  value, 
  onChange, 
  max = 10, 
  size = "md", 
  readOnly = false 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1;
        const isActive = rating <= (hoverValue || value);
        
        return (
          <button
            key={rating}
            type="button"
            className={cn(
              "transition-colors duration-150",
              !readOnly && "hover:scale-110 transform transition-transform",
              readOnly && "cursor-default"
            )}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isActive 
                  ? "fill-warning text-warning" 
                  : "fill-star-inactive text-star-inactive"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium text-muted-foreground">
        {value}/{max}
      </span>
    </div>
  );
}