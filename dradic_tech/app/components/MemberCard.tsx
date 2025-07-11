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
      className="w-72 h-96 cursor-pointer hover:scale-105 transition-all duration-300 perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d border border-gray-200 rounded-2xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 rounded-2xl bg-white">
          <img src={image} alt={name} className="w-24 h-24 rounded-full" />
          <h3 className="text-xl font-bold mt-4">{name}</h3>
          <h4 className="text-gray-600 mt-2">{title}</h4>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 rounded-lg bg-white">
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
}
