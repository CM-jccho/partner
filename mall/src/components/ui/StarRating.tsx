import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showNumber?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 12,
  showNumber = false,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-200"
              fill="currentColor"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating - Math.floor(rating)) * 100}%` : "100%" }}
              >
                <Star
                  size={size}
                  className="text-yellow-400"
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
      {showNumber && (
        <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
