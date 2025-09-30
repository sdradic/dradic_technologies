import { useEffect, useState } from "react";
import Loader from "./Loader";
import { InfoIcon, ErrorIcon, SuccessIcon } from "./Icons";

export const SimpleNotification = ({
  message,
  type,
  timeout = 3000,
}: {
  message: string;
  type: "success" | "error" | "info";
  timeout?: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, timeout);
  }, [timeout]);

  if (!isVisible) return null;

  switch (type) {
    case "info":
      return <InfoNotification message={message} />;
    case "error":
      return <ErrorNotification message={message} />;
    case "success":
      return <SuccessNotification message={message} />;
  }
};

const InfoNotification = ({ message }: { message: string }) => {
  return (
    <div className="absolute top-0 w-full max-w-6xl mx-auto mt-4 gap-2 rounded-lg p-4 flex flex-row items-center justify-center bg-blue-300 dark:bg-blue-400 border border-blue-500 dark:border-blue-500">
      <InfoIcon className="w-4 h-4 stroke-4 stroke-gray-500 dark:stroke-white" />
      <span className="text-gray-500 dark:text-white">{message}</span>
      <Loader loaderSize={[4, 4]} />
    </div>
  );
};

const ErrorNotification = ({ message }: { message: string }) => {
  return (
    <div className="absolute top-0 w-full max-w-6xl mx-auto mt-4 gap-2 rounded-lg p-4 flex flex-row items-center justify-center bg-red-300 dark:bg-red-400 border border-red-500 dark:border-red-500">
      <ErrorIcon className="w-4 h-4 stroke-4 stroke-gray-500 dark:stroke-white" />
      <span className="text-gray-500 dark:text-white">{message}</span>
    </div>
  );
};

const SuccessNotification = ({ message }: { message: string }) => {
  return (
    <div className="absolute top-0 w-full max-w-6xl mx-auto mt-4 gap-2 rounded-lg p-4 flex flex-row items-center justify-center bg-green-300 dark:bg-green-400 border border-green-500 dark:border-green-500">
      <SuccessIcon className="w-4 h-4 stroke-4 stroke-gray-500 dark:stroke-white" />
      <span className="text-gray-500 dark:text-white">{message}</span>
    </div>
  );
};
