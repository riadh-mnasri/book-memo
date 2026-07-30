export function RatingStars({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (rating: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = Boolean(onChange);

  return (
    <div className="flex items-center" role={interactive ? "radiogroup" : undefined}>
      {stars.map((value) => (
        <button
          key={value}
          type="button"
          disabled={!interactive}
          aria-label={`${value}`}
          onClick={() => onChange?.(value === rating ? 0 : value)}
          className={`p-1 text-lg leading-none ${interactive ? "cursor-pointer" : "cursor-default"} ${
            value <= rating ? "text-accent" : "text-border"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
