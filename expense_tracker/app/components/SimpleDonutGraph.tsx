import React from "react";
import { formatCurrency } from "~/modules/utils";

export interface SimpleDonutGraphProps {
  title: string;
  description?: string | null;
  data: {
    label: string;
    value: number;
  }[];
  graphContainerClassName?: string;
}

const DonutGraphTitle = ({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) => (
  <div className="flex items-center justify-between p-4 sm:p-6">
    <div>
      <h2 className="text-xl sm:text-2xl text-left text-gray-800 dark:text-white  mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-400 dark:text-gray-600 text-left">
        {description || ""}
      </p>
    </div>
  </div>
);

const DonutGraphSegment = ({
  item,
  index,
  data,
}: {
  item: { label: string; value: number };
  index: number;
  data: { label: string; value: number }[];
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const startAngle = data
    .slice(0, index)
    .reduce((sum, d) => sum + (d.value / total) * 360, 0);
  const angle = (item.value / total) * 360;

  const innerRadius = 60;
  const outerRadius = 90;

  // Handle full circle case (360 degrees)
  if (angle >= 359.9) {
    // Draw two semicircles to make a complete donut
    const path1 = [
      `M ${100 + innerRadius} 100`,
      `A ${innerRadius} ${innerRadius} 0 0 1 ${100 - innerRadius} 100`,
      `A ${innerRadius} ${innerRadius} 0 0 1 ${100 + innerRadius} 100`,
      `M ${100 + outerRadius} 100`,
      `A ${outerRadius} ${outerRadius} 0 0 0 ${100 - outerRadius} 100`,
      `A ${outerRadius} ${outerRadius} 0 0 0 ${100 + outerRadius} 100`,
      "Z",
    ].join(" ");

    const colors = [
      "var(--color-primary-300)",
      "var(--color-primary-500)",
      "var(--color-primary-700)",
      "var(--color-primary-900)",
    ];

    return (
      <path
        key={item.label}
        d={path1}
        fill={colors[index % colors.length]}
        className="transition-all duration-300 hover:opacity-80"
        fillRule="evenodd"
      />
    );
  }

  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((startAngle + angle - 90) * Math.PI) / 180;

  const x1 = 100 + innerRadius * Math.cos(startRad);
  const y1 = 100 + innerRadius * Math.sin(startRad);
  const x2 = 100 + outerRadius * Math.cos(startRad);
  const y2 = 100 + outerRadius * Math.sin(startRad);
  const x3 = 100 + outerRadius * Math.cos(endRad);
  const y3 = 100 + outerRadius * Math.sin(endRad);
  const x4 = 100 + innerRadius * Math.cos(endRad);
  const y4 = 100 + innerRadius * Math.sin(endRad);

  const largeArcFlag = angle > 180 ? 1 : 0;

  const path = [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
    "Z",
  ].join(" ");

  const colors = [
    "var(--color-primary-300)",
    "var(--color-primary-500)",
    "var(--color-primary-700)",
    "var(--color-primary-900)",
  ];

  return (
    <path
      key={item.label}
      d={path}
      fill={colors[index % colors.length]}
      className="transition-all duration-300 hover:opacity-80"
    />
  );
};

const DonutGraphLegend = ({
  data,
}: {
  data: { label: string; value: number }[];
}) => {
  const colors = [
    "var(--color-primary-300)",
    "var(--color-primary-500)",
    "var(--color-primary-700)",
    "var(--color-primary-900)",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 sm:p-4">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1 sm:gap-2">
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
            style={{
              backgroundColor: colors[index % colors.length],
            }}
          />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {item.label}: {formatCurrency(item.value, "CLP")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SimpleDonutGraph({
  title,
  description,
  data,
  graphContainerClassName = "w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800",
}: SimpleDonutGraphProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={graphContainerClassName}>
        <DonutGraphTitle title={title} description={description} />
        <div className="flex items-center justify-center h-[200px] sm:h-[250px]">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={graphContainerClassName}>
      <DonutGraphTitle title={title} description={description} />

      <div className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {data.map((item, index) => (
            <DonutGraphSegment
              key={item.label}
              item={item}
              index={index}
              data={data}
            />
          ))}
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="fill-gray-800 dark:fill-white text-2xl sm:text-xl"
          >
            {formatCurrency(totalValue, "CLP")}
          </text>
          <text
            x="100"
            y="130"
            textAnchor="middle"
            className="fill-gray-400 dark:fill-gray-600 text-sm sm:text-base"
          >
            Total
          </text>
        </svg>
      </div>

      <DonutGraphLegend data={data} />
    </div>
  );
}
