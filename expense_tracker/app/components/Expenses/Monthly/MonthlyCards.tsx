import SimpleCard, { type SimpleCardProps } from "~/components/SimpleCard";
import { CardCarrousel } from "~/components/CardCarrousel";

interface MonthlyCardsProps {
  cards: SimpleCardProps[];
}

export function MonthlyCards({ cards }: MonthlyCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Carrousel */}
      <div className="sm:hidden">
        <CardCarrousel cards={cards} />
      </div>

      {/* Desktop: Grid */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <SimpleCard
            key={card.title}
            title={card.title}
            description={card.description}
            value={card.value}
            currency={card.currency}
            previousValue={card.previousValue}
          />
        ))}
      </div>
    </>
  );
}
