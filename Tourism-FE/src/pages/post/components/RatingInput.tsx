import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingInputProps {
  value: number | null;
  onChange: (score: number) => void;
  size?: number;
}

const RATING_VALUES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const RatingInput = ({ value, onChange, size = 28 }: RatingInputProps) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {RATING_VALUES.map((score) => (
        <button
          key={score}
          type="button"
          onMouseEnter={() => setHover(score)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(score)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`${
              (hover !== null ? score <= hover : value !== null && score <= value)
                ? 'fill-secondary text-secondary'
                : 'text-outline-variant'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};
