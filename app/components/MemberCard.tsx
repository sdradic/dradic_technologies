import { useState } from "react";

interface MemberCardProps {
  description: string;
  name: string;
  title: string;
}

export default function MemberCard({
  description,
  name,
  title,
}: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className="w-72 h-96 cursor-pointer">
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""} w-full h-full`}
        onClick={handleCardClick}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front flex flex-col items-center justify-center p-6 border border-primary-500 rounded-lg bg-white">
            <img
              src="/dusan.jpeg"
              alt="Srdjan Radic"
              className="w-24 h-24 rounded-full"
            />
            <h3 className="text-xl font-bold mt-4">{name}</h3>
            <h4 className="text-gray-600 mt-2">{title}</h4>
          </div>
          <div className="flip-card-back flex flex-col items-center justify-center p-6 border border-primary-500 rounded-lg bg-white">
            <p className="text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
