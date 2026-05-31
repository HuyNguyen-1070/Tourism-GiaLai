import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingInputProps {
  value: number | null;
  onChange: (score: number) => void;
  size?: number;
}

export const RatingInput = ({ value, onChange, size = 28 }: RatingInputProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const currentScore = hover !== null ? hover : (value ?? 0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = currentScore >= index;
        const isHalf = currentScore >= index - 0.5 && currentScore < index;

        return (
          <div
            key={index}
            className="relative cursor-pointer transition-transform hover:scale-110"
            style={{ width: size, height: size }}
          >
            {/* Background Empty Star */}
            <Star size={size} className="text-outline-variant absolute top-0 left-0" />

            {/* Filled Star Overlay */}
            {(isFull || isHalf) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: isHalf ? '50%' : '100%' }}
              >
                <Star size={size} className="fill-amber-400 text-amber-400" />
              </div>
            )}

            {/* Clickable hitboxes for half and full star */}
            <div className="absolute inset-0 flex z-10">
              <div
                className="w-1/2 h-full"
                onMouseEnter={() => setHover(index - 0.5)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onChange(index - 0.5)}
              />
              <div
                className="w-1/2 h-full"
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onChange(index)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
