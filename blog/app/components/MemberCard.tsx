import { useState } from "react";

interface MemberCardProps {
  description: string;
  name: string;
  title: string;
  image: string;
}

export default function MemberCard({
  description,
  name,
  title,
  image,
}: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-72 h-96 cursor-pointer hover:scale-105 transition-all duration-300 perspective-1000 mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-600 transform-style-3d border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-100 dark:bg-dark-400 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {!isFlipped ? (
          <div className={`flex flex-col items-center justify-center`}>
            <img src={image} alt={name} className="w-24 h-24 rounded-full" />
            <h3 className="text-xl font-bold mt-4">{name}</h3>
            <h4 className="text-gray-600 mt-2">{title}</h4>
          </div>
        ) : (
          <p className={`text-gray-700 dark:text-gray-300 rotate-y-180`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
