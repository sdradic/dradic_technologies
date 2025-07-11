interface LoaderProps {
  showText?: boolean;
  text?: string;
}

export default function Loader({ showText = true, text }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-4xl font-bold text-center">
      {showText && (
        <>
          {text ? (
            <span className="text-primary-800">{text}</span>
          ) : (
            <>
              <span className="text-primary-800">Dradic</span>
              <span className="text-primary-600">Technologies</span>
            </>
          )}
        </>
      )}
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-900 mt-4"></div>
    </div>
  );
}
