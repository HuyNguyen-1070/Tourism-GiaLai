import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  showEmpty?: boolean;
}

export const RatingStars = ({
  rating,
  max = 5,
  size = 16,
  showEmpty = false,
}: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-secondary text-secondary" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star size={size} className="text-secondary" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={size} className="fill-secondary text-secondary" />
          </div>
        </div>
      )}
      {showEmpty &&
        [...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-outline-variant" />
        ))}
    </div>
  );
};
