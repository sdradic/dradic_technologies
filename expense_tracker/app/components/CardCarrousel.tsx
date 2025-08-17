import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import SimpleCard from "./SimpleCard";
import type { SimpleCardProps } from "./SimpleCard";

interface CardCarrouselProps {
  cards: SimpleCardProps[];
  className?: string;
}

export const CardCarrousel = ({
  cards,
  className = "",
}: CardCarrouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollToNext = () => {
    if (scrollContainerRef.current && canScrollRight) {
      const cardWidth =
        scrollContainerRef.current.clientWidth /
        (window.innerWidth >= 1024 ? 3 : 1);
      const newScrollLeft = scrollContainerRef.current.scrollLeft + cardWidth;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const scrollToPrevious = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      const cardWidth =
        scrollContainerRef.current.clientWidth /
        (window.innerWidth >= 1024 ? 3 : 1);
      const newScrollLeft = scrollContainerRef.current.scrollLeft - cardWidth;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleScroll = () => checkScrollability();
    const handleResize = () => checkScrollability();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [cards]);

  if (cards.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Previous Button */}
      {canScrollLeft && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full cursor-pointer p-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={scrollToPrevious}
          aria-label="Previous cards"
        >
          <ChevronLeftIcon className="w-5 h-5 stroke-gray-600 dark:stroke-gray-400" />
        </button>
      )}

      {/* Next Button */}
      {canScrollRight && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full cursor-pointer p-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={scrollToNext}
          aria-label="Next cards"
        >
          <ChevronRightIcon className="w-5 h-5 stroke-gray-600 dark:stroke-gray-400" />
        </button>
      )}

      {/* Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-none w-full lg:w-[calc(33.333%-0.75rem)] snap-center"
          >
            <SimpleCard
              title={card.title}
              description={card.description}
              value={card.value}
              currency={card.currency}
              previousValue={card.previousValue}
              canEdit={card.canEdit}
              inCarrousel={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
